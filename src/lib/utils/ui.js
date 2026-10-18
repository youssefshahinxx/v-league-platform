/**
 * Shared UI helpers for page components.
 * Keeping small presentation decisions here makes the Svelte markup easier to read.
 */

/**
 * Format a competition date into a short display string.
 * @param {string | null | undefined} dateString
 * @returns {string}
 */
export function formatCompetitionDate(dateString) {
    if (!dateString) {
        return 'TBA';
    }

    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Format a competition date into a long display string.
 * @param {string | null | undefined} dateString
 * @returns {string}
 */
export function formatCompetitionDateLong(dateString) {
    if (!dateString) {
        return 'TBA';
    }

    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Build the competitions filter URL from the current URL and form state.
 * @param {URL} currentUrl
 * @param {string} search
 * @param {string} status
 * @returns {URL}
 */
export function buildCompetitionFilterUrl(currentUrl, search, status) {
    const url = new URL(currentUrl);

    if (search.trim()) {
        url.searchParams.set('search', search.trim());
    } else {
        url.searchParams.delete('search');
    }

    if (status !== 'all') {
        url.searchParams.set('status', status);
    } else {
        url.searchParams.delete('status');
    }

    return url;
}

/**
 * Return the badge label and styling class for a competition status value.
 * @param {string | null | undefined} status
 * @returns {{ label: string, className: string }}
 */
export function getCompetitionStatusBadge(status) {
    switch (status) {
        case 'open':
            return {
                label: 'Open',
                className: 'inline-flex shrink-0 items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'
            };
        case 'upcoming':
            return {
                label: 'Upcoming',
                className: 'inline-flex shrink-0 items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'
            };
        case 'completed':
            return {
                label: 'Completed',
                className: 'inline-flex shrink-0 items-center rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10'
            };
        default:
            return {
                label: 'Closed',
                className: 'inline-flex shrink-0 items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20'
            };
    }
}

/**
 * Return the display copy for the auth form based on the current mode.
 * @param {'login' | 'register'} mode
 * @returns {{ heading: string, description: string, submitLabel: string, togglePrompt: string, toggleActionLabel: string }}
 */
export function getAuthModeCopy(mode) {
    if (mode === 'register') {
        return {
            heading: 'Create your athlete profile',
            description: 'Join the definitive engine for league performance.',
            submitLabel: 'Create Account',
            togglePrompt: 'Already have an account?',
            toggleActionLabel: 'Sign in'
        };
    }

    return {
        heading: 'Sign in to your account',
        description: 'Enter your details below to continue.',
        submitLabel: 'Sign In',
        togglePrompt: "Don't have an account?",
        toggleActionLabel: 'Sign up'
    };
}
