import { t as supabase } from "../../../../chunks/supabase.js";
import { r as requireAuth } from "../../../../chunks/auth.js";
import { error } from "@sveltejs/kit";
//#region src/routes/profile/edit/+page.js
/**
* Load the signed-in user's profile and protect the route with the shared auth helper.
*/
async function load() {
	const userId = (await requireAuth())?.user?.id;
	if (!userId) throw error(401, "You must be signed in to edit your profile.");
	const { data: profile, error: dbError } = await supabase.from("profiles").select("full_name, nationality, gender, dob, club, bio, achievements, avatar_url, facebook_url, tiktok_url, instagram_url, certificates").eq("id", userId).single();
	if (dbError) throw error(500, "Could not retrieve your athlete profile.");
	let totalPoints = 0;
	let eventsTracked = 0;
	let rank = null;
	const { data: leaderboardData } = await supabase.from("leaderboard").select("profile_id, total_points, events_tracked").order("total_points", { ascending: false });
	if (leaderboardData) {
		const userRow = leaderboardData.find((r) => r.profile_id === userId);
		if (userRow) {
			totalPoints = userRow.total_points ?? 0;
			eventsTracked = userRow.events_tracked ?? 0;
			rank = leaderboardData.findIndex((r) => r.profile_id === userId) + 1;
		}
	}
	return {
		profile: profile || null,
		stats: {
			total_points: totalPoints,
			events_tracked: eventsTracked,
			rank
		}
	};
}
//#endregion
export { load };
