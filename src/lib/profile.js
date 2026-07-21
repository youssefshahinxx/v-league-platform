import { supabase } from '$lib/supabase';

/**
 * @param {unknown} value
 */
function normalizeString(value) {
    return typeof value === 'string' ? value.trim() : '';
}

/**
 * Build a profile payload that matches the application's database schema.
 * @param {Record<string, any>} values
 * @returns {{ full_name: string, nationality: string | null, gender: string | null, dob: string | null, club: string | null, bio: string | null, achievements: any[] }}
 */
export function buildProfilePayload(values = {}) {
    const fullName = normalizeString(values.full_name) || 'Anonymous Athlete';

    return {
        full_name: fullName,
        nationality: normalizeString(values.nationality) || null,
        gender: normalizeString(values.gender) || null,
        dob: normalizeString(values.dob) || null,
        club: normalizeString(values.club) || null,
        bio: normalizeString(values.bio) || null,
        achievements: Array.isArray(values.achievements) ? values.achievements : []
    };
}

/**
 * Persist or update the authenticated user's profile record.
 * @param {string} userId
 * @param {Record<string, any>} values
 * @returns {Promise<{ error: any } | { data: any; error: any }>} 
 */
export async function ensureProfileRecord(userId, values = {}) {
    if (!userId) {
        throw new Error('A user id is required to create the profile record.');
    }

    const profileData = buildProfilePayload(values);

    return supabase
        .from('profiles')
        .upsert({ id: userId, ...profileData }, { onConflict: 'id' });
}
