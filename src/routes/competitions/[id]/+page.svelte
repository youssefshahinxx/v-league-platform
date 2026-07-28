<script>
    import { supabase } from '$lib/supabase';
    import { page } from '$app/stores';
    import { formatCompetitionDateLong } from '$lib/utils/ui';
    import { registerForCompetition } from '$lib/utils/competitionRegistration';
    import MediaSlideshow from '$lib/components/MediaSlideshow.svelte';

    /** @type {{ data: { competition: any, userHasRegistered: boolean, isLoggedIn: boolean, session: any } }} 
    */    
    let { data } = $props();

    // Initialize state cleanly with empty/false defaults to bypass Svelte 5 capture warnings
    let hasRegistered = $state(false);
    let isProcessing = $state(false);
    let feedbackMessage = $state('');

    // Hydrate local interaction state safely from server/load data
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
</script>

<div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <!-- Back to Hub Navigation -->
    <div class="mb-6">
        <a href="/competitions" class="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
            ← Back to all competitions
        </a>
    </div>

    {#if data.competition}
        <!-- Tailwind UI Pattern: Split Profile Layout Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <!-- Left 2 Columns: Detailed Information Deck -->
            <div class="lg:col-span-2 space-y-8 bg-white border border-zinc-200 rounded-lg p-6 sm:p-8">
                <div class="-m-6 sm:-m-8 mb-6 sm:mb-8">
                    <MediaSlideshow media={data.competition.media ?? []} heroImage={data.competition.image_url ?? ''} />
                </div>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-zinc-900">{data.competition.title}</h1>
                    <p class="mt-2 text-sm text-zinc-500">{data.competition.location}</p>
                </div>

                <!-- Tailwind UI Pattern: Clean Meta List Description Block -->
                <div class="border-t border-zinc-100 pt-6">
                    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <dt class="text-xs font-semibold uppercase tracking-wider text-zinc-400">Event Date</dt>
                            <dd class="mt-1 text-sm font-medium text-zinc-900">{formatCompetitionDateLong(data.competition.event_date)}</dd>
                        </div>
                        <div>
                            <dt class="text-xs font-semibold uppercase tracking-wider text-zinc-400">Venue Location</dt>
                            <dd class="mt-1 text-sm font-medium text-zinc-900">{data.competition.location}</dd>
                        </div>
                    </dl>
                </div>

                <div class="border-t border-zinc-100 pt-6">
                    <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">About The Competition</h3>
                    <div class="text-sm text-zinc-600 leading-relaxed space-y-4">
                        {data.competition.description ?? 'No specific technical rulebooks or descriptions published for this event yet.'}
                    </div>
                </div>
            </div>

            <!-- Right 1 Column: Sticky Action Widget Card -->
            <div class="lg:col-span-1 bg-zinc-50 border border-zinc-200 rounded-lg p-6 space-y-6 lg:sticky lg:top-6">
                <div>
                    <h3 class="text-sm font-semibold text-zinc-900">Registration Entry</h3>
                    <p class="mt-1 text-xs text-zinc-500">Secure your competitive slot instantly.</p>
                </div>

                <div class="border-t border-zinc-200 pt-4 flex items-baseline justify-between">
                    <span class="text-sm text-zinc-600">Pass Price</span>
                    <span class="text-2xl font-bold text-zinc-900">${data.competition.ticket_price ?? 0}</span>
                </div>

                {#if feedbackMessage}
                    <div class="p-3 text-xs rounded font-medium bg-zinc-900 text-white">
                        {feedbackMessage}
                    </div>
                {/if}

                <!-- Contextual Action Engine -->
                {#if hasRegistered}
                    <div class="w-full text-center rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-800">
                        ✓ Confirmed Competitor
                    </div>
                {:else if data.competition.status === 'completed'}
                    <div class="w-full text-center rounded-md bg-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-500">
                        Event Completed
                    </div>
                {:else if data.competition.status === 'closed'}
                    <div class="w-full text-center rounded-md bg-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-500">
                        Registration Closed
                    </div>
                {:else}
                    <button 
                        type="button"
                        onclick={handleRegistration}
                        disabled={isProcessing}
                        class="w-full text-center rounded-md bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 transition disabled:bg-zinc-400"
                    >
                        {isProcessing ? 'Verifying Checkout...' : 'Confirm Entry Spot'}
                    </button>
                {/if}
            </div>

        </div>
    {:else}
        <div class="text-center py-24 bg-white border border-zinc-200 rounded-lg">
            <h3 class="text-sm font-semibold text-zinc-900">Competition context missing</h3>
            <p class="mt-1 text-sm text-zinc-500">This event listing may have been archived or removed from the league records.</p>
        </div>
    {/if}
</div>