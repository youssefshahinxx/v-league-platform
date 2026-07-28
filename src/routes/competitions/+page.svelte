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
    <div class="sm:flex sm:items-center sm:justify-between border-b border-zinc-200 pb-5 mb-8">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">League Competitions</h1>
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
                class="block w-full rounded-md border border-zinc-200 py-1.5 px-3 text-zinc-900 placeholder:text-zinc-400 focus:border-[#fb310f] transition-colors sm:text-sm sm:leading-6"
            />
        </div>

        <div class="w-full sm:w-1/4 flex flex-col gap-1.5">
            <label for="status" class="text-xs font-medium text-zinc-700">Event Status</label>
            <select 
                id="status" 
                bind:value={status} 
                class="block w-full rounded-md border border-zinc-200 py-1.5 pl-3 pr-10 text-zinc-900 focus:border-[#fb310f] transition-colors sm:text-sm sm:leading-6 bg-white"
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
            class="w-full sm:w-auto rounded-md bg-[#fb310f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e02c0d]"
        >
            Filter Results
        </button>
    </form>

    <!-- Tailwind UI Pattern: Grid List Layout -->
    {#if (data.competitions ?? []).length > 0}
        <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {#each (data.competitions ?? []) as competition}
                {@const badge = getCompetitionStatusBadge(competition.status)}
                <li class="col-span-1 divide-y divide-zinc-200 rounded-lg bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden">
                    {#if competition.image_url}
                        <div class="w-full h-40 overflow-hidden">
                            <img src={competition.image_url} alt={competition.title} class="w-full h-full object-cover" />
                        </div>
                    {:else}
                        <div class="w-full h-32 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                            <svg class="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                            </svg>
                        </div>
                    {/if}
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
                                    class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-[#fb310f] hover:bg-[#fef2f2] transition-colors"
                                >
                                    View Details
                                </a>
                            </div>
                            {#if competition.status === 'open'}
                                <div class="-ml-px flex w-0 flex-1">
                                    <a 
                                        href="/competitions/{competition.id}?action=register" 
                                        class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-[#fb310f] hover:bg-[#fef2f2] transition-colors"
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
                    class="inline-flex items-center rounded-md bg-[#fb310f] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e02c0d]"
                >
                    Clear Filters
                </button>
            </div>
</div>
    {/if}
</div>