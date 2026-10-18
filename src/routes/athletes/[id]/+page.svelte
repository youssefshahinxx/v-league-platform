<script>
    /** @type {{ data: { athlete: any, stats: any } }} */
    let { data } = $props();

    /** @param {string | null | undefined} value */
    function formatLastCompetition(value) {
        if (!value) return '---';
        return new Date(value).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
</script>

<div class="w-full px-margin-mobile lg:px-margin-desktop py-margin-desktop">
    <div class="mb-stack-lg">
        <a href="/athletes" class="font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to athletes directory
        </a>
    </div>

    {#if data.athlete}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
            <!-- Main Content -->
            <div class="lg:col-span-2 bg-surface-container-high p-stack-lg space-y-stack-lg">
                <div class="flex flex-col sm:flex-row sm:items-center gap-stack-lg">
                    <div class="w-24 h-24 rounded-full overflow-hidden border-[3px] border-primary/30 flex-shrink-0">
                        {#if data.athlete.avatar_url}
                            <img src={data.athlete.avatar_url} alt="Athlete avatar" class="w-full h-full object-cover" />
                        {:else}
                            <div class="w-full h-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                        {/if}
                    </div>
                    <div>
                        <div class="flex items-center gap-stack-sm mb-stack-sm flex-wrap">
                            <span class="bg-surface-variant text-on-surface-variant px-3 py-1 font-label-caps text-label-caps">{data.athlete.nationality || 'TBA'}</span>
                            <span class="bg-surface-variant text-on-surface-variant px-3 py-1 font-label-caps text-label-caps">{data.athlete.gender || 'UNSPECIFIED'}</span>
                        </div>
                        <h1 class="font-headline-lg text-headline-lg text-white uppercase italic">{data.athlete.full_name ?? 'Anonymous Athlete'}</h1>
                        <p class="font-body-lg text-on-surface-variant mt-stack-sm">{data.athlete.club || 'Independent / Unattached'}</p>
                    </div>
                </div>

                <div class="border-t border-white/5 pt-stack-lg">
                    <h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">Athlete Biography</h3>
                    <p class="font-body-md text-on-surface-variant leading-relaxed">
                        {data.athlete.bio || 'This athlete has not provided a biography yet.'}
                    </p>
                </div>

                <div class="border-t border-white/5 pt-stack-lg">
                    <h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">Social Links</h3>
                    {#if data.athlete.facebook_url || data.athlete.tiktok_url || data.athlete.instagram_url}
                        <div class="flex items-center gap-stack-md">
                            {#if data.athlete.facebook_url}
                                <a href={data.athlete.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="w-11 h-11 rounded-full border border-white/10 hover:bg-surface-variant hover:border-primary/40 transition-colors flex items-center justify-center text-on-surface-variant hover:text-primary">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" /></svg>
                                </a>
                            {/if}
                            {#if data.athlete.tiktok_url}
                                <a href={data.athlete.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" class="w-11 h-11 rounded-full border border-white/10 hover:bg-surface-variant hover:border-primary/40 transition-colors flex items-center justify-center text-on-surface-variant hover:text-primary">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.58 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.29 0 .56.05.82.12v-3.5a6.33 6.33 0 00-.82-.06A6.34 6.34 0 003 15.36a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.79a8.17 8.17 0 004.22 1.55V7.9a4.81 4.81 0 01-2.31-1.21z" /></svg>
                                </a>
                            {/if}
                            {#if data.athlete.instagram_url}
                                <a href={data.athlete.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="w-11 h-11 rounded-full border border-white/10 hover:bg-surface-variant hover:border-primary/40 transition-colors flex items-center justify-center text-on-surface-variant hover:text-primary">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.11 2.525c.636-.247 1.363-.416 2.427-.465C8.83 2.012 9.183 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.055.048 1.37.058 4.041h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" /></svg>
                                </a>
                            {/if}
                        </div>
                    {:else}
                        <p class="font-body-md text-on-surface-variant">No social links shared.</p>
                    {/if}
                </div>

                <div class="border-t border-white/5 pt-stack-lg">
                    <h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">Certificates & Documents</h3>
                    {#if (data.athlete.certificates ?? []).length > 0}
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
                            {#each (data.athlete.certificates ?? []) as cert}
                                <a href={cert.url} target="_blank" rel="noopener noreferrer" class="flex items-center gap-stack-md bg-surface-container p-stack-sm pr-stack-md hover:bg-surface-variant border border-white/5 transition-colors">
                                    {#if cert.type === 'image'}
                                        <img src={cert.url} alt={cert.name} class="w-12 h-12 rounded object-cover flex-shrink-0" />
                                    {:else}
                                        <div class="w-12 h-12 rounded bg-surface-variant flex items-center justify-center flex-shrink-0">
                                            <svg class="w-6 h-6 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                        </div>
                                    {/if}
                                    <span class="font-body-md text-on-surface truncate">{cert.name}</span>
                                </a>
                            {/each}
                        </div>
                    {:else}
                        <p class="font-body-md text-on-surface-variant">No certificates uploaded yet.</p>
                    {/if}
                </div>

                <div class="border-t border-white/5 pt-stack-lg">
                    <h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">Official League Achievements</h3>
                    {#if (data.athlete.achievements ?? []).length > 0}
                        <ul class="flex flex-wrap gap-stack-sm">
                            {#each (data.athlete.achievements ?? []) as achievement}
                                <li class="inline-flex items-center bg-primary/15 text-primary px-3 py-1 font-label-caps text-label-caps">🏆 {achievement}</li>
                            {/each}
                        </ul>
                    {:else}
                        <p class="font-body-md text-on-surface-variant">No official achievements recorded on the platform yet.</p>
                    {/if}
                </div>
            </div>

            <!-- Performance Sidebar -->
            <div class="lg:col-span-1 bg-surface-container-low p-stack-lg space-y-stack-md lg:sticky lg:top-24">
                <div>
                    <h3 class="font-headline-md text-headline-md text-white uppercase">Performance Profile</h3>
                    <p class="font-body-md text-on-surface-variant mt-stack-sm">League-wide aggregate standing.</p>
                </div>

                <div class="border-t border-white/5 pt-stack-md flex items-baseline justify-between">
                    <span class="font-label-caps text-label-caps text-on-surface-variant">Overall Rank</span>
                    <span class="font-stats-number text-stats-number text-secondary-fixed">{data.stats?.best_rank != null ? '#' + data.stats.best_rank : '---'}</span>
                </div>

                <div class="grid grid-cols-2 gap-stack-md border-t border-white/5 pt-stack-md">
                    <div>
                        <span class="font-label-caps text-label-caps text-on-surface-variant">Total Points</span>
                        <p class="font-stats-number text-stats-number text-white mt-stack-sm">{data.stats?.total_points ?? 0}</p>
                    </div>
                    <div>
                        <span class="font-label-caps text-label-caps text-on-surface-variant">Events Tracked</span>
                        <p class="font-stats-number text-stats-number text-white mt-stack-sm">{data.stats?.events_tracked ?? 0}</p>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-stack-sm border-t border-white/5 pt-stack-md">
                    <div>
                        <p class="font-stats-number text-[22px] text-secondary-fixed">{data.stats?.league_records ?? 0}</p>
                        <span class="font-label-caps text-[9px] text-on-surface-variant">LEAGUE RECORDS</span>
                    </div>
                    <div>
                        <p class="font-stats-number text-[22px] text-secondary-fixed">{data.stats?.competition_records ?? 0}</p>
                        <span class="font-label-caps text-[9px] text-on-surface-variant">COMP RECORDS</span>
                    </div>
                    <div>
                        <p class="font-stats-number text-[22px] text-secondary-fixed">{data.stats?.national_records ?? 0}</p>
                        <span class="font-label-caps text-[9px] text-on-surface-variant">NAT RECORDS</span>
                    </div>
                </div>

                <div class="border-t border-white/5 pt-stack-md">
                    <span class="font-label-caps text-label-caps text-on-surface-variant">Last Competition</span>
                    <p class="font-body-md text-on-surface mt-stack-sm">{formatLastCompetition(data.stats?.last_competition)}</p>
                </div>
            </div>
        </div>
    {:else}
        <div class="text-center py-margin-desktop bg-surface-container-low border border-white/5">
            <p class="font-body-md text-on-surface-variant">This athlete profile may have been moved or removed from the league records.</p>
        </div>
    {/if}
</div>