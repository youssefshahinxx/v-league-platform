<script>
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { buildCompetitionFilterUrl, formatCompetitionDate, getCompetitionStatusBadge } from '$lib/utils/ui';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    

    // Initialize state safely with empty defaults to prevent Svelte 5 capture warnings
    let search = $state('');
    let status = $state('all');

    // Hydrate the form state reactively when the page data (URL params) changes
    $effect(() => {
        search = data.searchQuery ?? '';
        status = data.statusFilter ?? 'all';
    });

    /** @param {Event} e */
    function applyFilters(e) {
        e.preventDefault();

        const url = buildCompetitionFilterUrl($page.url, search, status);

        // Push the new URL to SvelteKit's router without reloading the full page
        goto(url.toString(), { keepFocus: true, noScroll: true });
    }
</script>

<div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    
    <!-- Tailwind UI Pattern: Page Header with Actions -->
    <div class="md:flex md:items-center md:justify-between mb-8 border-b border-zinc-200 pb-5">
        <div class="min-w-0 flex-1">
            <h2 class="text-2xl font-bold leading-7 text-zinc-900 sm:truncate sm:text-3xl sm:tracking-tight">
                League Competitions
            </h2>
            <p class="mt-1 text-sm text-zinc-500">Find and register for upcoming athletic events.</p>
        </div>
    </div>

    <!-- Tailwind UI Pattern: Inline Filter Bar -->
    <form onsubmit={applyFilters} class="mb-10 flex flex-col sm:flex-row gap-4 items-end bg-zinc-50 p-4 rounded-lg border border-zinc-200">
        <div class="w-full sm:w-1/3 flex flex-col gap-1.5">
            <label for="search" class="text-xs font-medium text-zinc-700">Search by Location</label>
            <input 
                id="search" 
                type="text" 
                bind:value={search} 
                placeholder="E.g. Cairo, Giza..." 
                class="block w-full rounded-md border-0 py-1.5 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6"
            />
        </div>

        <div class="w-full sm:w-1/4 flex flex-col gap-1.5">
            <label for="status" class="text-xs font-medium text-zinc-700">Event Status</label>
            <select 
                id="status" 
                bind:value={status} 
                class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 bg-white"
            >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="open">Open to Register</option>
                <option value="closed">Registration Closed</option>
                <option value="completed">Completed</option>
            </select>
        </div>

        <button 
            type="submit" 
            class="w-full sm:w-auto rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
            Filter Results
        </button>
    </form>

    <!-- Tailwind UI Pattern: Grid List Layout -->
    {#if (data.competitions ?? []).length > 0}
        <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {#each (data.competitions ?? []) as competition}
                {@const badge = getCompetitionStatusBadge(competition.status)}
                <li class="col-span-1 divide-y divide-zinc-200 rounded-lg bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                    <div class="flex w-full items-center justify-between space-x-6 p-6">
                        <div class="flex-1 truncate">
                            <div class="flex items-center space-x-3">
                                <h3 class="truncate text-lg font-medium text-zinc-900">{competition.title}</h3>
                            </div>
                            <p class="mt-1 truncate text-sm text-zinc-500">{competition.location}</p>
                            <p class="mt-1 text-xs text-zinc-400">{formatCompetitionDate(competition.event_date)}</p>
                        </div>
                        
                        <!-- Status Badge Engine -->
                        <span class={getCompetitionStatusBadge(competition.status).className}>
                            {getCompetitionStatusBadge(competition.status).label}
                        </span>
                    </div>

                    <!-- Card Actions -->
                    <div class="mt-auto">
                        <div class="-mt-px flex divide-x divide-zinc-200">
                            <div class="flex w-0 flex-1">
                                <a 
                                    href="/competitions/{competition.id}" 
                                    class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
                                >
                                    View Details
                                </a>
                            </div>
                            {#if competition.status === 'open'}
                                <div class="-ml-px flex w-0 flex-1">
                                    <a 
                                        href="/competitions/{competition.id}?action=register" 
                                        class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
                                    >
                                        Register (${competition.ticket_price})
                                    </a>
                                </div>
                            {/if}
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    {:else}
        <div class="text-center py-16 bg-white border border-zinc-200 rounded-lg shadow-sm">
            <h3 class="mt-2 text-sm font-semibold text-zinc-900">No events found</h3>
            <p class="mt-1 text-sm text-zinc-500">Try adjusting your search or filters to find what you're looking for.</p>
            <div class="mt-6">
                <button 
                    type="button" 
                    onclick={() => { search = ''; status = 'all'; applyFilters(new Event('submit')); }}
                    class="inline-flex items-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    {/if}
</div>