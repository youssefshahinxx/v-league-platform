<script>
    import { supabase } from '$lib/supabase';
    import { page } from '$app/stores';
    import { formatCompetitionDateLong } from '$lib/utils/ui';
    import { registerForCompetition } from '$lib/utils/competitionRegistration';
    import MediaSlideshow from '$lib/components/MediaSlideshow.svelte';

    /** @type {{ data: { competition: any, userHasRegistered: boolean, isLoggedIn: boolean, session: any } }} */
    let { data } = $props();

    let hasRegistered = $state(false);
    let isProcessing = $state(false);
    let feedbackMessage = $state('');

    $effect(() => {
        hasRegistered = data.userHasRegistered ?? false;
    });

    /** @param {Event} e */
    async function handleRegistration(e) {
        e.preventDefault();
        if (!data.isLoggedIn) {
            feedbackMessage = 'You must be signed in to register for competitions.';
            return;
        }

        isProcessing = true;
        feedbackMessage = '';

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            feedbackMessage = 'Authentication session lost. Please re-login.';
            isProcessing = false;
            return;
        }

        const competitionId = $page.params.id;
        const result = await registerForCompetition(competitionId ?? '', session.user.id);
        isProcessing = false;

        if (result.success) {
            hasRegistered = true;
        }

        feedbackMessage = result.message;
    }

    /** @param {string} status */
    function statusBadge(status) {
        switch (status) {
            case 'open': return { label: 'OPEN', class: 'bg-secondary-fixed text-on-secondary' };
            case 'upcoming': return { label: 'UPCOMING', class: 'bg-primary text-on-primary' };
            case 'closed': return { label: 'CLOSED', class: 'bg-surface-variant text-on-surface-variant' };
            case 'completed': return { label: 'COMPLETED', class: 'bg-surface-container text-on-surface-variant' };
            default: return { label: 'CLOSED', class: 'bg-surface-variant text-on-surface-variant' };
        }
    }
</script>

<div class="w-full px-margin-mobile lg:px-margin-desktop py-margin-desktop">
    <div class="mb-stack-lg">
        <a href="/competitions" class="font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to all competitions
        </a>
    </div>

    {#if data.competition}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
            <!-- Left: Main Content -->
            <div class="lg:col-span-2 bg-surface-container-high p-stack-lg space-y-stack-lg">
                <div class="-m-stack-lg mb-0">
                    <MediaSlideshow media={data.competition.media ?? []} heroImage={data.competition.image_url ?? ''} />
                </div>

                <div>
                    <div class="flex items-center gap-stack-md mb-stack-sm">
                        <span class="{statusBadge(data.competition.status).class} px-3 py-1 font-label-caps text-label-caps">
                            {statusBadge(data.competition.status).label}
                        </span>
                        <span class="font-body-md text-on-surface-variant">{formatCompetitionDateLong(data.competition.event_date)}</span>
                    </div>
                    <h1 class="font-headline-lg text-headline-lg text-white uppercase italic">{data.competition.title}</h1>
                    <p class="font-body-lg text-on-surface-variant mt-stack-sm">{data.competition.location}</p>
                </div>

                <div class="border-t border-white/5 pt-stack-lg">
                    <h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">About The Competition</h3>
                    <p class="font-body-md text-on-surface-variant leading-relaxed">
                        {data.competition.description ?? 'No specific technical rulebooks or descriptions published for this event yet.'}
                    </p>
                </div>
            </div>

            <!-- Right: Registration Sidebar -->
            <div class="lg:col-span-1 bg-surface-container-low p-stack-lg space-y-stack-md lg:sticky lg:top-24">
                <div>
                    <h3 class="font-headline-md text-headline-md text-white uppercase">Entry</h3>
                    <p class="font-body-md text-on-surface-variant mt-stack-sm">Secure your competitive slot instantly.</p>
                </div>

                <div class="border-t border-white/5 pt-stack-md flex items-baseline justify-between">
                    <span class="font-label-caps text-label-caps text-on-surface-variant">Pass Price</span>
                    <span class="font-stats-number text-stats-number text-white">${data.competition.ticket_price ?? 0}</span>
                </div>

                {#if feedbackMessage}
                    <div class="p-stack-md bg-surface-container border border-white/5 font-body-md text-on-surface">
                        {feedbackMessage}
                    </div>
                {/if}

                {#if hasRegistered}
                    <div class="w-full text-center bg-secondary-fixed text-on-secondary px-stack-md py-stack-sm font-label-caps text-label-caps">
                        ✓ CONFIRMED COMPETITOR
                    </div>
                {:else if data.competition.status === 'completed'}
                    <div class="w-full text-center bg-surface-container text-on-surface-variant px-stack-md py-stack-sm font-label-caps text-label-caps">
                        EVENT COMPLETED
                    </div>
                {:else if data.competition.status === 'closed'}
                    <div class="w-full text-center bg-surface-container text-on-surface-variant px-stack-md py-stack-sm font-label-caps text-label-caps">
                        REGISTRATION CLOSED
                    </div>
                {:else}
                    <button
                        type="button"
                        onclick={handleRegistration}
                        disabled={isProcessing}
                        class="w-full text-center bg-primary hover:bg-primary/90 text-on-primary px-stack-md py-stack-sm font-label-caps text-label-caps transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                    >
                        {isProcessing ? 'PROCESSING...' : 'CONFIRM ENTRY SPOT'}
                    </button>
                {/if}
            </div>
        </div>
    {:else}
        <div class="text-center py-margin-desktop bg-surface-container-low border border-white/5">
            <p class="font-body-md text-on-surface-variant">This event listing may have been archived or removed from the league records.</p>
        </div>
    {/if}
</div>
