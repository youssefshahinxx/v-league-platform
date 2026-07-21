<script>
    /** @type {{ data: { athletes: any[] } }} */
    let { data } = $props();

    // Initialize search state cleanly with empty fallback string
    let searchQuery = $state('');

    // Svelte 5 Runes: Create a lightning-fast derived search index filter
    let filteredAthletes = $derived(
        (data.athletes ?? []).filter(athlete => 
            athlete.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            athlete.club?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
</script>

<div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center sm:justify-between border-b border-zinc-200 pb-5 mb-8">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Athlete Directory</h1>
            <p class="mt-1 text-sm text-zinc-500">Search and view verified competitors registered across the league.</p>
        </div>
    </div>

    <!-- Live Client-Side Search Input -->
    <div class="mb-8 max-w-md">
        <label for="search" class="sr-only">Search athletes</label>
        <input 
            id="search"
            type="text" 
            bind:value={searchQuery}
            placeholder="Search by competitor name or club..." 
            class="block w-full rounded-md border-0 py-2 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm"
        />
    </div>

    <!-- Stacked Avatar/Roster List Grid -->
    {#if filteredAthletes.length > 0}
        <ul role="list" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {#each filteredAthletes as athlete}
                <li class="relative flex items-center space-x-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm hover:border-zinc-400 transition">
                    <div class="min-w-0 flex-1">
                        <a href="/athletes/{athlete.profile_id}" class="focus:outline-none">
                            <span class="absolute inset-0" aria-hidden="true"></span>
                            <div class="flex items-center justify-between">
                                <p class="text-sm font-semibold text-zinc-900 truncate">{athlete.full_name}</p>
                                <span class="font-bold text-sm text-zinc-900">{athlete.total_points} pts</span>
                            </div>
                            <div class="flex items-center justify-between mt-1 text-xs text-zinc-500">
                                <p class="truncate">{athlete.club || 'Independent Athlete'}</p>
                                <p class="uppercase font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">{athlete.nationality || '???'}</p>
                            </div>
                        </a>
                    </div>
                </li>
            {/each}
        </ul>
    {:else}
        <div class="text-center py-16 bg-zinc-50 border border-zinc-200 rounded-lg">
            <p class="text-sm text-zinc-500 italic">No competitors match your active search terms.</p>
        </div>
    {/if}
</div>