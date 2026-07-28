import { supabase } from '$lib/supabase';
import { error } from '@sveltejs/kit';
import { requireAuth } from '$lib/auth';

/**
 * Load the signed-in user's profile and protect the route with the shared auth helper.
 */
export async function load() {
    const session = await requireAuth();
    const userId = session?.user?.id;

    if (!userId) {
        throw error(401, 'You must be signed in to edit your profile.');
    }

    const { data: profile, error: dbError } = await supabase
        .from('profiles')
        .select('full_name, nationality, gender, dob, club, bio, achievements, avatar_url, facebook_url, tiktok_url, instagram_url, certificates')
        .eq('id', userId)
        .single();

    if (dbError) {
        throw error(500, 'Could not retrieve your athlete profile.');
    }

    // Fetch performance stats from leaderboard
    let totalPoints = 0;
    let eventsTracked = 0;
    let rank = null;

    const { data: leaderboardData } = await supabase
        .from('leaderboard')
        .select('profile_id, total_points, events_tracked')
        .order('total_points', { ascending: false });

    if (leaderboardData) {
        const userRow = leaderboardData.find(r => r.profile_id === userId);
        if (userRow) {
            totalPoints = userRow.total_points ?? 0;
            eventsTracked = userRow.events_tracked ?? 0;
            rank = leaderboardData.findIndex(r => r.profile_id === userId) + 1;
        }
    }

    return {
        profile: profile || null,
        stats: { total_points: totalPoints, events_tracked: eventsTracked, rank }
    };
}