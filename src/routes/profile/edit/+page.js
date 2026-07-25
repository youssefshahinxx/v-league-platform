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
        .select('full_name, nationality, gender, dob, club, bio, achievements, avatar_url')
        .eq('id', userId)
        .single();

    if (dbError) {
        throw error(500, 'Could not retrieve your athlete profile.');
    }

    return {
        profile: profile || null
    };
}