import { supabase } from '$lib/supabase';
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

    // Merge avatar_url from profiles
    const rows = leaderboard ?? [];
    if (rows.length > 0) {
        const profileIds = rows.map(/** @param {{ profile_id: string }} r */ r => r.profile_id);
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, avatar_url')
            .in('id', profileIds);

        const avatarMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.avatar_url]));
        for (const row of rows) {
            row.avatar_url = avatarMap[row.profile_id] ?? null;
        }
    }

    return {
        leaderboard: rows
    };
}