import { n as runSupabaseQuery, t as fromTable } from "../../../../chunks/supabaseData.js";
import { error } from "@sveltejs/kit";
//#region src/routes/athletes/[id]/+page.js
/**
* Load a single athlete profile and keep the session lookup consistent with the rest of the app.
* @param {{ params: { id: string } }} props
*/
async function load({ params }) {
	const profileId = params.id;
	const athlete = await runSupabaseQuery(fromTable("profiles", "id, full_name, nationality, gender, club, bio, achievements, avatar_url, facebook_url, tiktok_url, instagram_url, certificates").eq("id", profileId).single(), null, "Error fetching athlete profile");
	if (!athlete) throw error(404, "Athlete not found in the directory.");
	return {
		athlete,
		stats: await runSupabaseQuery(fromTable("leaderboard", "total_points, events_tracked, best_rank, league_records, competition_records, national_records, last_competition").eq("profile_id", profileId).maybeSingle(), {
			total_points: 0,
			events_tracked: 0,
			best_rank: null,
			league_records: 0,
			competition_records: 0,
			national_records: 0,
			last_competition: null
		}, "Error fetching athlete stats")
	};
}
//#endregion
export { load };
