<script>
    /** @type {{ data?: { leaderboard?: Array<any> } }} */
    let { data } = $props();
    /** @type {string | number | null} */
    let expandedProfileId = $state(null);

    /** @param {string | number | null} id */
    function toggleExpand(id) {
        expandedProfileId = expandedProfileId === id ? null : id;
    }
</script>

<div class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-bold tracking-tight mb-8">League Scoreboard</h1>

    <div class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        {#each (data?.leaderboard ?? []) as row, index}
            <div class="border-b border-zinc-100 last:border-0">
                <!-- Clickable Athlete Row Header -->
                <button 
                    onclick={() => toggleExpand(row.profile_id)}
                    class="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-zinc-50 transition"
                >
                    <div class="flex items-center gap-4">
                        <span class="font-mono text-zinc-400 w-6">#{index + 1}</span>
                        <div class="w-9 h-9 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 flex-shrink-0">
                            {#if row.avatar_url}
                                <img src={row.avatar_url} alt="" class="w-full h-full object-cover" />
                            {:else}
                                <div class="w-full h-full flex items-center justify-center text-zinc-400">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                </div>
                            {/if}
                        </div>
                        <div>
                            <span class="font-semibold">{row.full_name}</span>
                            <span class="text-xs text-zinc-500 ml-2 bg-zinc-100 px-2 py-0.5 rounded uppercase">{row.nationality}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-6">
                        <span class="text-sm text-zinc-500">{row.events_tracked} Events</span>
                        <span class="font-bold text-zinc-900 w-16 text-right">{row.total_points} pts</span>
                    </div>
                </button>

                <!-- Expandable Sub-panel Detail Panel -->
                {#if expandedProfileId === row.profile_id}
                    <div class="px-16 py-4 bg-zinc-50 text-sm border-t border-zinc-100 text-zinc-600">
                        <p><strong>Club Affiliation:</strong> {row.club || 'Unattached / Independent'}</p>
                        <a href="/athletes/{row.profile_id}" class="inline-block mt-2 text-[#fb310f] font-medium underline hover:text-[#e02c0d]">
                            View Full Performance Profile →
                        </a>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>