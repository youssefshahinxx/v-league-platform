import { getSession } from '$lib/auth';
import { fromTable, runSupabaseQuery } from '$lib/supabaseData';

/**
 * Load ranking data while resolving auth through the shared helper for consistency.
 * Load ranking data from the leaderboard view.
 * @type {import('./$types').PageLoad}
 */
export async function load() {
    // Resolve the current session through the shared helper so auth handling stays centralized.
    await getSession();
    
    const leaderboard = await runSupabaseQuery(
        fromTable('leaderboard'),
        [],
        'Error fetching leaderboard data'
    );

    return {
        leaderboard: leaderboard ?? []
    };
}