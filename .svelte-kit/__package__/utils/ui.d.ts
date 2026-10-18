/**
 * Shared UI helpers for page components.
 * Keeping small presentation decisions here makes the Svelte markup easier to read.
 */
/**
 * Format a competition date into a short display string.
 * @param {string | null | undefined} dateString
 * @returns {string}
 */
export function formatCompetitionDate(dateString: string | null | undefined): string;
/**
 * Format a competition date into a long display string.
 * @param {string | null | undefined} dateString
 * @returns {string}
 */
export function formatCompetitionDateLong(dateString: string | null | undefined): string;
/**
 * Build the competitions filter URL from the current URL and form state.
 * @param {URL} currentUrl
 * @param {string} search
 * @param {string} status
 * @returns {URL}
 */
export function buildCompetitionFilterUrl(currentUrl: URL, search: string, status: string): URL;
/**
 * Return the badge label and styling class for a competition status value.
 * @param {string | null | undefined} status
 * @returns {{ label: string, className: string }}
 */
export function getCompetitionStatusBadge(status: string | null | undefined): {
    label: string;
    className: string;
};
/**
 * Return the display copy for the auth form based on the current mode.
 * @param {'login' | 'register'} mode
 * @returns {{ heading: string, description: string, submitLabel: string, togglePrompt: string, toggleActionLabel: string }}
 */
export function getAuthModeCopy(mode: "login" | "register"): {
    heading: string;
    description: string;
    submitLabel: string;
    togglePrompt: string;
    toggleActionLabel: string;
};
