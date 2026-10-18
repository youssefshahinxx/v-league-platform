import { t as supabase } from "../../../chunks/supabase.js";
import { n as runSupabaseQuery, t as fromTable } from "../../../chunks/supabaseData.js";
//#region src/routes/athletes/+page.js
/**
* Load the athlete directory while keeping auth resolution and data fetching centralized.
* @returns {Promise<{ athletes: any[] }>}
*/
async function load() {
	const rows = await runSupabaseQuery(fromTable("leaderboard").order("total_points", { ascending: false }), [], "Error hydrating athletes directory") ?? [];
	if (rows.length > 0) {
		const profileIds = rows.map(
			/** @param {{ profile_id: string }} r */
			(r) => r.profile_id
		);
		const { data: profiles } = await supabase.from("profiles").select("id, avatar_url").in("id", profileIds);
		const avatarMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p.avatar_url]));
		for (const row of rows) row.avatar_url = avatarMap[row.profile_id] ?? null;
	}
	return { athletes: rows };
}
//#endregion
export { load };
