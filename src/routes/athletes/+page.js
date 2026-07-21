import { getSession } from '$lib/auth';
import { fromTable, runSupabaseQuery } from '$lib/supabaseData';

/**
 * Load the athlete directory while keeping auth resolution and data fetching centralized.
 * @returns {Promise<{ athletes: any[] }>}
 */
export async function load() {
    // Resolve the current session through the shared helper so this route stays aligned with the rest of the app.
    await getSession();

    const athletes = await runSupabaseQuery(
        fromTable('leaderboard').order('total_points', { ascending: false }),
        [],
        'Error hydrating athletes directory'
    );

    return {
        athletes: athletes ?? []
    };
}