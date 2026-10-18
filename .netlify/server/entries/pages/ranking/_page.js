import { t as supabase } from "../../../chunks/supabase.js";
import { t as getSession } from "../../../chunks/auth.js";
import { n as runSupabaseQuery, t as fromTable } from "../../../chunks/supabaseData.js";
//#region src/routes/ranking/+page.js
/**
* Load ranking data while resolving auth through the shared helper for consistency.
* Load ranking data from the leaderboard view.
* @type {import('./$types').PageLoad}
*/
async function load() {
	await getSession();
	const rows = await runSupabaseQuery(fromTable("leaderboard"), [], "Error fetching leaderboard data") ?? [];
	if (rows.length > 0) {
		const profileIds = rows.map(
			/** @param {{ profile_id: string }} r */
			(r) => r.profile_id
		);
		const { data: profiles } = await supabase.from("profiles").select("id, avatar_url").in("id", profileIds);
		const avatarMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.avatar_url]));
		for (const row of rows) row.avatar_url = avatarMap[row.profile_id] ?? null;
	}
	return { leaderboard: rows };
}
//#endregion
export { load };
