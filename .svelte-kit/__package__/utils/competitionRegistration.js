import { supabase } from '../supabase';

/**
 * Register the current authenticated user for a competition.
 * The helper keeps the Supabase write logic out of the page component.
 *
 * @param {string} competitionId
 * @param {string} userId
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function registerForCompetition(competitionId, userId) {
    
    const { error } = await supabase
        .from('registrations')
        .insert({
            competition_id: competitionId,
            profile_id: userId
        });

    if (!error) {
        return {
            success: true,
            message: 'Success! You are officially locked into this event.'
        };
    }

    return {
        success: false,
        message: error?.message || 'Registration processing failed. Please check your account privileges.'
    };
}
