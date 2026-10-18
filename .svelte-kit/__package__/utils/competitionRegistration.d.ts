/**
 * Register the current authenticated user for a competition.
 * The helper keeps the Supabase write logic out of the page component.
 *
 * @param {string} competitionId
 * @param {string} userId
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export function registerForCompetition(competitionId: string, userId: string): Promise<{
    success: boolean;
    message: string;
}>;
