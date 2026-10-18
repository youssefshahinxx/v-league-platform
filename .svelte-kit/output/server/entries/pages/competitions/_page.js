import { t as getSession } from "../../../chunks/auth.js";
import { n as runSupabaseQuery, t as fromTable } from "../../../chunks/supabaseData.js";
//#region src/routes/competitions/+page.js
/**
* Load competition listings with URL-driven filters.
* @param {{ url: URL }} props
*/
async function load({ url }) {
	await getSession();
	const statusFilter = url.searchParams.get("status") || "all";
	const searchQuery = url.searchParams.get("search") || "";
	let query = fromTable("competitions", "id, title, location, event_date, status, ticket_price, image_url").order("event_date", { ascending: true });
	if (statusFilter !== "all") query = query.eq("status", statusFilter);
	if (searchQuery) query = query.ilike("location", `%${searchQuery}%`);
	return {
		competitions: await runSupabaseQuery(query, [], "Error fetching competitions"),
		statusFilter,
		searchQuery
	};
}
//#endregion
export { load };
