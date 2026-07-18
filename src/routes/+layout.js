import { supabase } from '$lib/supabase';

export const ssr = false; // Turn off SSR momentarily for rapid MVP auth tracking

// /** @type {import('./$types').LayoutLoad} */
export async function load() {
    // Safely check if a user session is active on initialization
    const { data: { session } } = await supabase.auth.getSession();
    
    return {
        session
    };
}