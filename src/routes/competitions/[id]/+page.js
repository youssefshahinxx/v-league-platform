import { getSession, isLoggedIn } from '$lib/auth';
import { fromTable, runSupabaseQuery } from '$lib/supabaseData';

/**
 * Load a single competition and determine whether the current user is logged in.
 * @param {{ params: { id: string } }} props
 */
export async function load({ params }) {
    const session = await getSession();
    const loggedIn = isLoggedIn(session);
    const competitionId = params.id;

    // 1. Fetch deep details for the single competition.
    const competition = await runSupabaseQuery(
        fromTable('competitions').eq('id', competitionId).single(),
        null,
        'Error fetching competition deep details'
    );

    // 2. Check registration presence using the resolved session.
    let userHasRegistered = false;

    if (session?.user) {
        const registration = await runSupabaseQuery(
            fromTable('registrations', 'id')
                .eq('competition_id', competitionId)
                .eq('profile_id', session.user.id)
                .maybeSingle(),
            null,
            'Error checking registration status'
        );

        userHasRegistered = Boolean(registration);
    }

    return {
        competition,
        userHasRegistered,
        isLoggedIn: loggedIn
    };
}