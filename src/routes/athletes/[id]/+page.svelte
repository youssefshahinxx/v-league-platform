<script>
    /** @type {{ data: { athlete: any, stats: { total_points: number, events_tracked: number } } }} */
    let { data } = $props();
</script>

<div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <!-- Back Navigation -->
    <div class="mb-8">
        <a href="/ranking" class="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
            ← Back to Global Rankings
        </a>
    </div>

    <div class="bg-white overflow-hidden rounded-lg border border-zinc-200 shadow-sm">
        <!-- Tailwind UI Pattern: Profile Header with Stats -->
        <div class="border-b border-zinc-200 bg-zinc-50 px-6 py-8 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div class="flex items-center gap-5">
                <div class="w-16 h-16 rounded-full overflow-hidden bg-zinc-200 border border-zinc-300 flex-shrink-0">
                    {#if data.athlete?.avatar_url}
                        <img src={data.athlete.avatar_url} alt="Avatar" class="w-full h-full object-cover" />
                    {:else}
                        <div class="w-full h-full flex items-center justify-center text-zinc-400">
                            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                    {/if}
                </div>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900">
                        {data.athlete?.full_name ?? 'Anonymous Athlete'}
                    </h1>
                    <div class="mt-2 flex items-center gap-3 text-sm text-zinc-500">
                        <span class="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 uppercase border border-zinc-200">
                            {data.athlete?.nationality || 'TBA'}
                        </span>
                        <span>•</span>
                        <span>{data.athlete?.club || 'Independent / Unattached'}</span>
                    </div>
                </div>
            </div>

            <!-- High-Level Stats Widgets -->
            <div class="flex gap-4 sm:gap-8">
                <div class="flex flex-col">
                    <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Points</span>
                    <span class="text-2xl font-bold text-zinc-900">{data.stats?.total_points ?? 0}</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Events</span>
                    <span class="text-2xl font-bold text-zinc-900">{data.stats?.events_tracked ?? 0}</span>
                </div>
            </div>
        </div>

        <!-- Tailwind UI Pattern: Description List Data Layout -->
        <div class="px-6 py-6 sm:px-8">
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
                <div class="sm:col-span-2">
                    <dt class="text-sm font-medium text-zinc-500">Athlete Biography</dt>
                    <dd class="mt-1 text-sm text-zinc-600 leading-relaxed">
                        {data.athlete?.bio || 'This athlete has not provided a biography yet.'}
                    </dd>
                </div>

                <div class="sm:col-span-1">
                    <dt class="text-sm font-medium text-zinc-500">Division / Gender Category</dt>
                    <dd class="mt-1 text-sm text-zinc-900">
                        {data.athlete?.gender || 'Not specified'}
                    </dd>
                </div>

                <div class="sm:col-span-2 border-t border-zinc-100 pt-8 mt-4">
                    <dt class="text-sm font-medium text-zinc-500 mb-4">Official League Achievements</dt>
                    <dd>
                        {#if data.athlete?.achievements && (data.athlete.achievements ?? []).length > 0}
                            <ul class="flex flex-wrap gap-2">
                                {#each (data.athlete.achievements ?? []) as achievement}
                                    <li class="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white">
                                        🏆 {achievement}
                                    </li>
                                {/each}
                            </ul>
                        {:else}
                            <div class="rounded-md bg-zinc-50 border border-zinc-100 p-4">
                                <p class="text-sm text-zinc-500 italic">No official achievements recorded on the platform yet.</p>
                            </div>
                        {/if}
                    </dd>
                </div>
            </dl>
        </div>
    </div>
</div>