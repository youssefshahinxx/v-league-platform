import { supabase } from '$lib/supabase';
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

    // Merge avatar_url from profiles
    const rows = athletes ?? [];
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
        athletes: rows
    };
}