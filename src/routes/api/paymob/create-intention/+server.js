import { json, error } from '@sveltejs/kit';
import { createPaymobIntention, getAdminClient, newOrderId } from '$lib/server/paymob';

/**
 * POST /api/paymob/create-intention
 * Body: { competitionId: string, eventIds: string[] }
 * Auth: Authorization: Bearer <supabase access token>
 *
 * Validates the user's session and event selection server-side, recomputes the
 * total from DB prices (never trusts the client), then creates a Paymob
 * intention and returns the Unified Checkout URL.
 */
export async function POST({ request, url }) {
    let payload;
    try {
        payload = await request.json();
    } catch {
        throw error(400, 'Invalid request body.');
    }

    const competitionId = payload?.competitionId;
    const eventIds = Array.isArray(payload?.eventIds) ? payload.eventIds.map(String) : [];

    if (!competitionId || eventIds.length === 0) {
        throw error(400, 'Select at least one event to register.');
    }

    const authHeader = request.headers.get('authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
        throw error(401, 'You must be signed in to register for competitions.');
    }

    const admin = getAdminClient();

    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData?.user) {
        throw error(401, 'Invalid or expired session. Please re-login.');
    }

    const profileId = userData.user.id;

    // Fetch the selected events and verify they belong to this competition.
    /** @type {Array<{ id: string, competition_id: string, name: string, status: string, registration_open: boolean | null, price: number | null }>} */
    const events = (
        await admin
            .from('competition_events')
            .select('id, competition_id, name, status, registration_open, price')
            .in('id', eventIds)
    ).data ?? [];

    if (events.length !== eventIds.length) {
        throw error(400, 'One or more selected events could not be found.');
    }

    if (events.some((event) => event.competition_id !== competitionId)) {
        throw error(400, 'Selected events do not belong to this competition.');
    }

    const ineligible = events.filter((event) => event.status !== 'scheduled' || event.registration_open === false);
    if (ineligible.length > 0) {
        throw error(400, 'One or more selected events are not open for registration.');
    }

    const { data: competition, error: competitionError } = await admin
        .from('competitions')
        .select('id, status')
        .eq('id', competitionId)
        .maybeSingle();

    if (competitionError || !competition) {
        throw error(404, 'Competition not found.');
    }

    if (competition.status !== 'open' && competition.status !== 'upcoming') {
        throw error(400, 'Registration for this competition is closed.');
    }

    // Exclude events the user already registered for.
    /** @type {Array<{ competition_event_id: string }>} */
    const existing = (
        await admin
            .from('registrations')
            .select('competition_event_id')
            .eq('profile_id', profileId)
            .in('competition_event_id', eventIds)
    ).data ?? [];

    const takenEventIds = new Set(existing.map((registration) => registration.competition_event_id));
    const openEvents = events.filter((event) => !takenEventIds.has(event.id));

    if (openEvents.length === 0) {
        throw error(400, 'You are already registered for every selected event.');
    }

    const totalCents = Math.round(openEvents.reduce((sum, event) => sum + Number(event.price ?? 0), 0) * 100);
    const orderId = newOrderId();

    if (totalCents <= 0) {
        // Free registration — no payment gateway involved.
        const { error: paymentError } = await admin.from('payments').insert({
            order_id: orderId,
            profile_id: profileId,
            competition_id: competitionId,
            event_ids: openEvents.map((event) => event.id),
            amount_cents: 0,
            currency: 'EGP',
            status: 'paid'
        });

        if (paymentError) {
            throw error(500, 'Could not create your registration order.');
        }

        const { error: registrationError } = await admin.from('registrations').insert(
            openEvents.map((event) => ({
                competition_event_id: event.id,
                competition_id: competitionId,
                profile_id: profileId,
                order_id: orderId,
                payment_status: 'paid'
            }))
        );

        if (registrationError) {
            throw error(500, 'Could not finalize your registration.');
        }

        return json({ checkoutUrl: null, orderId, free: true });
    }

    const { error: paymentError } = await admin.from('payments').insert({
        order_id: orderId,
        profile_id: profileId,
        competition_id: competitionId,
        event_ids: openEvents.map((event) => event.id),
        amount_cents: totalCents,
        currency: 'EGP',
        status: 'pending'
    });

    if (paymentError) {
        throw error(500, 'Could not create your registration order.');
    }

    // Gather billing data from the profile; Paymob requires a phone number.
    const { data: profile } = await admin
        .from('profiles')
        .select('full_name, nationality')
        .eq('id', profileId)
        .maybeSingle();

    const fullName = (profile?.full_name ?? 'Athlete').trim();
    const nameParts = fullName.split(/\s+/);
    const country = profile?.nationality || 'EGY';

    try {
        const intention = await createPaymobIntention({
            amountCents: totalCents,
            currency: 'EGP',
            orderId,
            items: openEvents.map((event) => ({
                name: event.name ?? 'Competition event',
                amount: Math.round(Number(event.price ?? 0) * 100),
                quantity: 1
            })),
            billingData: {
                first_name: nameParts[0] || 'Athlete',
                last_name: nameParts.slice(1).join(' ') || 'Athlete',
                phone_number: '01000000000',
                email: userData.user.email ?? 'athlete@vleague.test',
                street: 'N/A',
                building: 'N/A',
                floor: 'N/A',
                apartment: 'N/A',
                city: 'Cairo',
                country,
                state: 'Cairo'
            },
            notificationUrl: `${url.origin}/api/paymob/webhook`,
            redirectionUrl: `${url.origin}/competitions/${competitionId}?payment=success&order=${orderId}`
        });

        await admin.from('payments').update({ paymob_intention_id: intention.intentionId }).eq('order_id', orderId);

        return json({ checkoutUrl: intention.checkoutUrl, orderId, free: false });
    } catch (err) {
        // Clean up the pending order so a failed checkout leaves no residue.
        await admin.from('payments').delete().eq('order_id', orderId).eq('status', 'pending');
        throw error(502, err instanceof Error ? err.message : 'Payment provider error. Please try again.');
    }
}