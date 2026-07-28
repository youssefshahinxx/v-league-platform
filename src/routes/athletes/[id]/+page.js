import { fromTable, runSupabaseQuery } from '$lib/supabaseData';
import { error } from '@sveltejs/kit';

/**
 * Load a single athlete profile and keep the session lookup consistent with the rest of the app.
 * @param {{ params: { id: string } }} props
 */
export async function load({ params }) {


    const profileId = params.id;

    // 1. Fetch the core public profile data.
    const athlete = await runSupabaseQuery(
        fromTable('profiles', 'id, full_name, nationality, gender, club, bio, achievements, avatar_url, facebook_url, tiktok_url, instagram_url, certificates')
            .eq('id', profileId)
            .single(),
        null,
        'Error fetching athlete profile'
    );

    if (!athlete) {
        throw error(404, 'Athlete not found in the directory.');
    }

    // 2. Fetch the aggregated statistics straight from our PostgreSQL View.
    const stats = await runSupabaseQuery(
        fromTable('leaderboard', 'total_points, events_tracked')
            .eq('profile_id', profileId)
            .maybeSingle(),
        { total_points: 0, events_tracked: 0 },
        'Error fetching athlete stats'
    );

    return {
        athlete,
        stats
    };
}