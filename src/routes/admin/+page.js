import { requireAuth } from '$lib/auth';
import { supabase } from '$lib/supabase';

/**
 * Protect this admin-style route so only signed-in users can access it.
 */
export async function load() {
    await requireAuth();

    // 1. Fetch listing data for the athlete profile drop-down menu.
    const { data: athletes } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name', { ascending: true });

    // 2. Fetch listing data for the tournament competition drop-down menu.
    const { data: competitions } = await supabase
        .from('competitions')
        .select('id, title')
        .order('event_date', { ascending: false });

    return {
        athletes: athletes || [],
        competitions: competitions || []
    };
}