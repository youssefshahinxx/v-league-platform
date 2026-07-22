import { fromTable, runSupabaseQuery } from '$lib/supabaseData';

/**
 * Load the athlete directory while keeping auth resolution and data fetching centralized.
 * @returns {Promise<{ athletes: any[] }>}
 */
export async function load() {

    const athletes = await runSupabaseQuery(
        fromTable('leaderboard').order('total_points', { ascending: false }),
        [],
        'Error hydrating athletes directory'
    );

    return {
        athletes: athletes ?? []
    };
}