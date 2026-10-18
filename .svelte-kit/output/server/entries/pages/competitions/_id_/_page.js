import { n as isLoggedIn, t as getSession } from "../../../../chunks/auth.js";
import { n as runSupabaseQuery, t as fromTable } from "../../../../chunks/supabaseData.js";
//#region src/routes/competitions/[id]/+page.js
/**
* Load a single competition and determine whether the current user is logged in.
* @param {{ params: { id: string } }} props
*/
async function load({ params }) {
	const session = await getSession();
	const loggedIn = isLoggedIn(session);
	const competitionId = params.id;
	const competition = await runSupabaseQuery(fromTable("competitions", "id, title, location, event_date, status, ticket_price, description, image_url, media").eq("id", competitionId).single(), null, "Error fetching competition deep details");
	const competitionEvents = await runSupabaseQuery(fromTable("competition_events", "id, name, gender, age_category, round_type, status, scheduled_at, price, registration_open").eq("competition_id", competitionId).order("scheduled_at", { ascending: true }), [], "Error fetching competition events");
	/** @type {Array<{ competition_event_id: string, payment_status: string }>} */
	let userRegistrations = [];
	let userHasRegistered = false;
	if (session?.user) {
		userRegistrations = await runSupabaseQuery(fromTable("registrations", "competition_event_id, payment_status").eq("competition_id", competitionId).eq("profile_id", session.user.id), [], "Error checking registration status");
		userHasRegistered = userRegistrations.some((registration) => registration.payment_status === "paid");
	}
	return {
		competition,
		competitionEvents,
		userRegistrations,
		userHasRegistered,
		isLoggedIn: loggedIn
	};
}
//#endregion
export { load };
