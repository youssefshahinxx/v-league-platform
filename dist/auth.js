import { supabase } from './supabase';
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';

/**
 * Resolve the current Supabase session from the shared client.
 * @returns {Promise<any>}
 */
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        throw error;
    }

    return session;
}

/**
 * Check whether a session contains a usable access token.
 * @param {any} session
 * @returns {boolean}
 */
export function isLoggedIn(session) {
    return Boolean(session?.access_token);
}

/**
 * Require an authenticated user and redirect to /auth if no valid session exists.
 * @returns {Promise<any>}
 */
export async function requireAuth() {
    const session = await getSession();

    if (!session || !isLoggedIn(session)) {
        throw redirect(303, '/auth');
    }

    return session;
}

export async function handleLogout() {
		await supabase.auth.signOut();
		await goto("/");
	}