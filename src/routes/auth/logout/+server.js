// import { supabase } from '$lib/supabase';
// import { redirect } from '@sveltejs/kit';

// /**
//  * POST /auth/logout — Sign out the current user and redirect to the landing page.
//  * This acts as a fallback for direct server-side logout requests.
//  */
// export async function POST() {
// 	await supabase.auth.signOut();
// 	throw redirect(303, '/');
// }

// /**
//  * GET /auth/logout — Handle direct navigation to the logout route gracefully.
//  */
// export async function GET() {
// 	await supabase.auth.signOut();
// 	throw redirect(303, '/');
// }