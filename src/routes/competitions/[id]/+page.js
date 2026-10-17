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
        fromTable('competitions', 'id, title, location, event_date, status, ticket_price, description, image_url, media').eq('id', competitionId).single(),
        null,
        'Error fetching competition deep details'
    );

    // 2. Fetch all scheduled events for this competition.
    const competitionEvents = await runSupabaseQuery(
        fromTable('competition_events', 'id, name, gender, age_category, round_type, status, scheduled_at, price, registration_open')
            .eq('competition_id', competitionId)
            .order('scheduled_at', { ascending: true }),
        [],
        'Error fetching competition events'
    );

    // 3. Load the current user's registrations for this competition.
    /** @type {Array<{ competition_event_id: string, payment_status: string }>} */
    let userRegistrations = [];
    let userHasRegistered = false;

    if (session?.user) {
        userRegistrations = await runSupabaseQuery(
            fromTable('registrations', 'competition_event_id, payment_status')
                .eq('competition_id', competitionId)
                .eq('profile_id', session.user.id),
            [],
            'Error checking registration status'
        );

        userHasRegistered = userRegistrations.some((registration) => registration.payment_status === 'paid');
    }

    return {
        competition,
        competitionEvents,
        userRegistrations,
        userHasRegistered,
        isLoggedIn: loggedIn
    };
}