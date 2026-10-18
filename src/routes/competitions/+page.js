import { getSession } from '$lib/auth';
import { fromTable, runSupabaseQuery } from '$lib/supabaseData';

/**
 * Load competition listings with URL-driven filters.
 * @param {{ url: URL }} props
 */
export async function load({ url }) {

    // Resolve the current session through the shared helper so this route stays aligned with the rest of the app.
    await getSession()

    // Extract query parameters from the URL with robust fallbacks.
    const statusFilter = url.searchParams.get('status') || 'all';
    const searchQuery = url.searchParams.get('search') || '';

    // Initialize the base query.
    let query = fromTable('competitions', 'id, title, location, event_date, status, ticket_price, image_url').order('event_date', { ascending: true });

    // Chain filters dynamically based on user selection.
    if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
    }

    if (searchQuery) {
        query = query.ilike('location', `%${searchQuery}%`);
    }

    const competitions = await runSupabaseQuery(query, [], 'Error fetching competitions');

    // Return the data and the active filters to keep the UI in sync.
    return {
        competitions,
        statusFilter,
        searchQuery
    };
}