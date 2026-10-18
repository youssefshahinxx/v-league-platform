import { i as verifyPaymobHmac, n as getAdminClient } from "../../../../../chunks/paymob.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/paymob/webhook/+server.js
/**
* POST /api/paymob/webhook?hmac=...
*
* Paymob's authoritative payment callback. Verifies the HMAC signature, then
* marks the order paid (compare-and-set from pending) and inserts one
* registrations row per event. Idempotent via the pending state transition
* and the unique (competition_event_id, profile_id) constraint.
*/
async function POST({ request, url }) {
	const hmac = url.searchParams.get("hmac") ?? "";
	const obj = (await request.json().catch(() => ({})))?.obj;
	if (!obj || typeof obj !== "object" || !hmac || !verifyPaymobHmac({
		obj,
		hmac
	})) return json({
		received: false,
		reason: "invalid hmac"
	}, { status: 400 });
	const orderId = obj.merchant_order_id ?? obj.special_reference ?? null;
	if (!orderId) return json({ received: true });
	const admin = getAdminClient();
	const { data: payment } = await admin.from("payments").select("*").eq("order_id", orderId).maybeSingle();
	if (!payment) return json({ received: true });
	const transactionId = String(obj.id);
	if (payment.status === "paid" && payment.paymob_transaction_id === transactionId) return json({
		received: true,
		duplicate: true
	});
	if (obj.pending === true) return json({
		received: true,
		pending: true
	});
	if (obj.success === true) {
		/** @type {Array<{ profile_id: string, competition_id: string, event_ids: string[] }>} */
		const updated = (await admin.from("payments").update({
			status: "paid",
			paymob_transaction_id: transactionId,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("order_id", orderId).eq("status", "pending").select("profile_id, competition_id, event_ids")).data ?? [];
		if (updated.length > 0) {
			const { profile_id, competition_id, event_ids } = updated[0];
			const rows = (event_ids ?? []).map((eventId) => ({
				competition_event_id: eventId,
				competition_id,
				profile_id,
				order_id: orderId,
				payment_status: "paid"
			}));
			if (rows.length > 0) await admin.from("registrations").upsert(rows, {
				onConflict: "competition_event_id,profile_id",
				ignoreDuplicates: true
			});
		}
		return json({
			received: true,
			success: true
		});
	}
	await admin.from("payments").update({
		status: "failed",
		paymob_transaction_id: transactionId,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("order_id", orderId).eq("status", "pending");
	return json({
		received: true,
		success: false
	});
}
//#endregion
export { POST };
