import "./navigation.js";
import { t as supabase } from "./supabase.js";
import { redirect } from "@sveltejs/kit";
//#region src/lib/auth.js
/**
* Resolve the current Supabase session from the shared client.
* @returns {Promise<any>}
*/
async function getSession() {
	const { data: { session }, error } = await supabase.auth.getSession();
	if (error) throw error;
	return session;
}
/**
* Check whether a session contains a usable access token.
* @param {any} session
* @returns {boolean}
*/
function isLoggedIn(session) {
	return Boolean(session?.access_token);
}
/**
* Require an authenticated user and redirect to /auth if no valid session exists.
* @returns {Promise<any>}
*/
async function requireAuth() {
	const session = await getSession();
	if (!session || !isLoggedIn(session)) throw redirect(303, "/auth");
	return session;
}
//#endregion
export { isLoggedIn as n, requireAuth as r, getSession as t };
