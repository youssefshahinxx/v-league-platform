/**
 * Build a profile payload that matches the application's database schema.
 * @param {Record<string, any>} values
 * @returns {{ full_name: string, nationality: string | null, gender: string | null, dob: string | null, club: string | null, bio: string | null, achievements: any[] }}
 */
export function buildProfilePayload(values?: Record<string, any>): {
    full_name: string;
    nationality: string | null;
    gender: string | null;
    dob: string | null;
    club: string | null;
    bio: string | null;
    achievements: any[];
};
/**
 * Persist or update the authenticated user's profile record.
 * @param {string} userId
 * @param {Record<string, any>} values
 * @returns {Promise<{ error: any } | { data: any; error: any }>}
 */
export function ensureProfileRecord(userId: string, values?: Record<string, any>): Promise<{
    error: any;
} | {
    data: any;
    error: any;
}>;
