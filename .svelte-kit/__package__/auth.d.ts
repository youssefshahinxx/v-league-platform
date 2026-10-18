/**
 * Resolve the current Supabase session from the shared client.
 * @returns {Promise<any>}
 */
export function getSession(): Promise<any>;
/**
 * Check whether a session contains a usable access token.
 * @param {any} session
 * @returns {boolean}
 */
export function isLoggedIn(session: any): boolean;
/**
 * Require an authenticated user and redirect to /auth if no valid session exists.
 * @returns {Promise<any>}
 */
export function requireAuth(): Promise<any>;
export function handleLogout(): Promise<void>;
