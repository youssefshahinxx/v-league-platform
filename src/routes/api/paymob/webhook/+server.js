import { json } from '@sveltejs/kit';
import { getAdminClient, verifyPaymobHmac } from '$lib/server/paymob';

/**
 * POST /api/paymob/webhook?hmac=...
 *
 * Paymob's authoritative payment callback. Verifies the HMAC signature, then
 * marks the order paid (compare-and-set from pending) and inserts one
 * registrations row per event. Idempotent via the pending state transition
 * and the unique (competition_event_id, profile_id) constraint.
 */
export async function POST({ request, url }) {
    const hmac = url.searchParams.get('hmac') ?? '';
    const body = await request.json().catch(() => ({}));
    const obj = body?.obj;

    if (!obj || typeof obj !== 'object' || !hmac || !verifyPaymobHmac({ obj, hmac })) {
        return json({ received: false, reason: 'invalid hmac' }, { status: 400 });
    }

    const orderId = obj.merchant_order_id ?? obj.special_reference ?? null;
    if (!orderId) {
        return json({ received: true });
    }

    const admin = getAdminClient();

    const { data: payment } = await admin
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle();

    if (!payment) {
        return json({ received: true });
    }

    const transactionId = String(obj.id);

    // Idempotent no-op: this exact transaction already finalized the order.
    if (payment.status === 'paid' && payment.paymob_transaction_id === transactionId) {
        return json({ received: true, duplicate: true });
    }

    // Still awaiting authorization — keep the order pending.
    if (obj.pending === true) {
        return json({ received: true, pending: true });
    }

    if (obj.success === true) {
        // Compare-and-set: only a pending order may become paid.
        /** @type {Array<{ profile_id: string, competition_id: string, event_ids: string[] }>} */
        const updated = (
            await admin
                .from('payments')
                .update({
                    status: 'paid',
                    paymob_transaction_id: transactionId,
                    updated_at: new Date().toISOString()
                })
                .eq('order_id', orderId)
                .eq('status', 'pending')
                .select('profile_id, competition_id, event_ids')
        ).data ?? [];

        if (updated.length > 0) {
            const { profile_id, competition_id, event_ids } = updated[0];

            const rows = (event_ids ?? []).map((eventId) => ({
                competition_event_id: eventId,
                competition_id,
                profile_id,
                order_id: orderId,
                payment_status: 'paid'
            }));

            if (rows.length > 0) {
                // Unique constraint makes duplicates a silent no-op.
                await admin.from('registrations').upsert(rows, {
                    onConflict: 'competition_event_id,profile_id',
                    ignoreDuplicates: true
                });
            }
        }

        return json({ received: true, success: true });
    }

    // Declined or failed — record it, keep the order unlockable for retry.
    await admin
        .from('payments')
        .update({
            status: 'failed',
            paymob_transaction_id: transactionId,
            updated_at: new Date().toISOString()
        })
        .eq('order_id', orderId)
        .eq('status', 'pending');

    return json({ received: true, success: false });
}