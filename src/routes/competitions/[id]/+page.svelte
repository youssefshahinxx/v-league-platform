<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabase';
    import { page } from '$app/stores';
    import { formatCompetitionDateLong } from '$lib/utils/ui';
    import MediaSlideshow from '$lib/components/MediaSlideshow.svelte';
    import CompetitionEventTable from '$lib/components/CompetitionEventTable.svelte';

    /** @type {{ data: { competition: any, competitionEvents: Array<any>, userRegistrations: Array<any>, userHasRegistered: boolean, isLoggedIn: boolean } }} */
    let { data } = $props();

    const registeredEventIds = $derived(new Set((data.userRegistrations ?? []).map((registration) => registration.competition_event_id)));

    let hasRegistered = $state(false);
    let isCreatingPayment = $state(false);
    let isConfirming = $state(false);
    let feedbackMessage = $state('');
    /** @type {string[]} */
    let selectedEventIds = $state([]);

    $effect(() => {
        hasRegistered = data.userHasRegistered ?? false;
    });

    const selectableEvents = $derived(
        (data.competitionEvents ?? []).filter(
            (event) => event.status === 'scheduled' && event.registration_open !== false && !registeredEventIds.has(event.id)
        )
    );

    const totalCents = $derived(
        selectableEvents.reduce(
            (sum, event) => (selectedEventIds.includes(event.id) ? sum + Math.round(Number(event.price ?? 0) * 100) : sum),
            0
        )
    );

    const totalEgp = $derived((totalCents / 100).toFixed(2));

    /** @param {string} eventId */
    function toggleEvent(eventId) {
        if (isCreatingPayment || isConfirming) return;
        selectedEventIds = selectedEventIds.includes(eventId)
            ? selectedEventIds.filter((id) => id !== eventId)
            : [...selectedEventIds, eventId];
        feedbackMessage = '';
    }

    /** @param {string} price */
    function formatPrice(price) {
        return `${Number(price ?? 0).toFixed(2)} EGP`;
    }

    async function handlePayment() {
        feedbackMessage = '';
        if (!data.isLoggedIn) {
            feedbackMessage = 'You must be signed in to register for competitions.';
            return;
        }
        if (selectedEventIds.length === 0) {
            feedbackMessage = 'Select at least one event to register.';
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
            feedbackMessage = 'Authentication session lost. Please re-login.';
            return;
        }

        isCreatingPayment = true;

        try {
            const response = await fetch('/api/paymob/create-intention', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    competitionId: $page.params.id,
                    eventIds: selectedEventIds
                })
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                feedbackMessage = result?.message ?? 'Payment setup failed. Please try again.';
                return;
            }

            if (result.checkoutUrl) {
                window.location.href = result.checkoutUrl;
                return;
            }

            if (result.free) {
                feedbackMessage = 'Success! You are officially locked in.';
                hasRegistered = true;
                return;
            }
        } catch {
            feedbackMessage = 'Network error while contacting the payment service.';
        } finally {
            isCreatingPayment = false;
        }
    }

    onMount(() => {
        const params = $page.url.searchParams;
        if (params.get('payment') !== 'success') return;

        const orderId = params.get('order');
        if (!orderId) return;

        isConfirming = true;

        let attempts = 0;

        const poll = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const { data: rows } = session?.user
                ? await supabase.from('registrations').select('id').eq('order_id', orderId).eq('profile_id', session.user.id)
                : { data: [] };

            attempts += 1;

            if ((rows ?? []).length > 0 || attempts > 12) {
                isConfirming = false;

                const url = new URL(window.location.href);
                url.searchParams.delete('payment');
                url.searchParams.delete('order');
                history.replaceState(null, '', url.pathname + url.search);

                if ((rows ?? []).length > 0) {
                    hasRegistered = true;
                } else {
                    feedbackMessage = 'Payment confirmation is taking longer than expected. Your entry will be confirmed automatically once Paymob processes it.';
                }
                return;
            }

            setTimeout(poll, 2500);
        };

        poll();
    });

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

    /** @param {string | null | undefined} status */
    function eventStatusBadge(status) {
        switch (status) {
            case 'live': return { label: 'LIVE', class: 'bg-primary text-on-primary' };
            case 'completed': return { label: 'COMPLETED', class: 'bg-secondary-fixed text-on-secondary' };
            case 'canceled': return { label: 'CANCELED', class: 'bg-surface-container text-on-surface-variant' };
            case 'scheduled': return { label: 'SCHEDULED', class: 'bg-surface-variant text-on-surface-variant' };
            default: return { label: (status ?? '---').toUpperCase(), class: 'bg-surface-variant text-on-surface-variant' };
        }
    }

    /** @param {string | null | undefined} dateString */
    function formatSchedule(dateString) {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
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
                    <p class="font-body-md text-on-surface-variant mt-stack-sm">Select your events and secure your slot instantly.</p>
                </div>

                {#if feedbackMessage}
                    <div class="p-stack-md bg-surface-container border border-white/5 font-body-md text-on-surface">
                        {feedbackMessage}
                    </div>
                {/if}

                {#if data.competition.status === 'completed'}
                    <div class="w-full text-center bg-surface-container text-on-surface-variant px-stack-md py-stack-sm font-label-caps text-label-caps">
                        EVENT COMPLETED
                    </div>
                {:else if data.competition.status === 'closed'}
                    <div class="w-full text-center bg-surface-container text-on-surface-variant px-stack-md py-stack-sm font-label-caps text-label-caps">
                        REGISTRATION CLOSED
                    </div>
                {:else if (data.competitionEvents ?? []).length === 0}
                    <p class="font-body-md text-on-surface-variant">No events are scheduled for this competition yet.</p>
                {:else}
                    <div class="border-t border-white/5 pt-stack-md space-y-stack-sm">
                        <span class="font-label-caps text-label-caps text-on-surface-variant">SELECT EVENTS</span>
                        {#each (data.competitionEvents ?? []) as event}
                            {#if registeredEventIds.has(event.id)}
                                <div class="flex items-center justify-between gap-stack-md p-stack-sm bg-surface-container/60 border border-white/5 opacity-70">
                                    <span class="font-body-md text-on-surface-variant truncate">{event.name}</span>
                                    <span class="font-label-caps text-label-caps text-secondary-fixed shrink-0">REGISTERED</span>
                                </div>
                            {:else if event.status === 'scheduled' && event.registration_open !== false}
                                <button
                                    type="button"
                                    onclick={() => toggleEvent(event.id)}
                                    disabled={isCreatingPayment || isConfirming}
                                    class="w-full flex items-center justify-between gap-stack-md p-stack-sm border transition-colors text-left cursor-pointer disabled:opacity-50 {selectedEventIds.includes(event.id) ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/25'}"
                                >
                                    <span class="flex items-center gap-stack-md min-w-0">
                                        <span class="w-4 h-4 flex-shrink-0 border flex items-center justify-center {selectedEventIds.includes(event.id) ? 'border-primary bg-primary' : 'border-white/30'}">
                                            {#if selectedEventIds.includes(event.id)}
                                                <svg class="w-3 h-3 text-on-primary" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            {/if}
                                        </span>
                                        <span class="font-body-md text-white truncate">{event.name}</span>
                                    </span>
                                    <span class="font-body-md text-on-surface-variant shrink-0">{formatPrice(event.price)}</span>
                                </button>
                            {/if}
                        {/each}
                    </div>

                    <div class="border-t border-white/5 pt-stack-md flex items-baseline justify-between">
                        <span class="font-label-caps text-label-caps text-on-surface-variant">Total</span>
                        <span class="font-stats-number text-stats-number text-white">{totalEgp} EGP</span>
                    </div>

                    {#if hasRegistered}
                        <div class="w-full text-center bg-secondary-fixed text-on-secondary px-stack-md py-stack-sm font-label-caps text-label-caps">
                            ✓ CONFIRMED COMPETITOR
                        </div>
                    {:else}
                        <button
                            type="button"
                            onclick={handlePayment}
                            disabled={isCreatingPayment || isConfirming || selectedEventIds.length === 0}
                            class="w-full text-center bg-primary hover:bg-primary/90 text-on-primary px-stack-md py-stack-sm font-label-caps text-label-caps transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                        >
                            {isCreatingPayment ? 'PROCESSING...' : isConfirming ? 'CONFIRMING PAYMENT...' : `PAY ${totalEgp} EGP`}
                        </button>
                    {/if}
                {/if}
            </div>
        </div>

        {#if (data.competitionEvents ?? []).length > 0}
            <div class="mt-margin-desktop space-y-stack-lg">
                <div class="bg-surface-container/80 backdrop-blur-3xl p-stack-lg relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary-fixed to-primary"></div>
                    <div class="flex justify-between items-end mb-stack-lg gap-stack-md">
                        <h2 class="font-headline-lg text-headline-lg text-white uppercase italic">Competition Event Statistics</h2>
                        <span class="font-label-caps text-label-caps text-on-surface-variant mb-2 shrink-0">PROGRAM</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-white/10">
                                    <th class="py-stack-sm font-label-caps text-label-caps text-primary">NAME</th>
                                    <th class="py-stack-sm font-label-caps text-label-caps text-primary">GENDER</th>
                                    <th class="py-stack-sm font-label-caps text-label-caps text-primary">AGE CATEGORY</th>
                                    <th class="py-stack-sm font-label-caps text-label-caps text-primary">ROUND</th>
                                    <th class="py-stack-sm font-label-caps text-label-caps text-primary">STATUS</th>
                                    <th class="py-stack-sm font-label-caps text-label-caps text-primary text-right">SCHEDULE</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                {#each (data.competitionEvents ?? []) as event}
                                <tr class="group/row hover:bg-white/5 transition-colors" onclick={() => window.location.href = '#event-' + event.id}>
                                    <td class="py-stack-md font-headline-md italic text-headline-md text-white uppercase hover:text-primary transition-colors">
                                        <!-- <a href="#event-{event.id}" class="font-headline-md italic text-headline-md text-white uppercase hover:text-primary transition-colors"> -->
                                            {event.name}
                                        <!-- </a> -->
                                        </td>
                                            <td class="py-stack-md font-label-caps uppercase text-on-surface-variant">{event.gender ?? '---'}</td>
                                            <td class="py-stack-md font-label-caps uppercase text-on-surface-variant">{event.age_category ?? '---'}</td>
                                            <td class="py-stack-md font-label-caps uppercase text-on-surface-variant">{event.round_type ?? '---'}</td>
                                            <td class="py-stack-md">
                                                <span class="{eventStatusBadge(event.status).class} px-3 py-1 font-label-caps text-label-caps">
                                                    {eventStatusBadge(event.status).label}
                                                </span>
                                            </td>
                                            <td class="py-stack-md text-sm text-right uppercase font-bold font-body-md text-on-surface">{formatSchedule(event.scheduled_at)}</td>
                                        </tr>
                                        {/each}
                                    </tbody>
                        </table>
                    </div>
                </div>

                {#each (data.competitionEvents ?? []) as event}
                    <div id="event-{event.id}" class="scroll-mt-32">
                        <CompetitionEventTable competitionEventId={event.id} title={event.name} />
                    </div>
                {/each}
            </div>
        {/if}
    {:else}
        <div class="text-center py-margin-desktop bg-surface-container-low border border-white/5">
            <p class="font-body-md text-on-surface-variant">This event listing may have been archived or removed from the league records.</p>
        </div>
    {/if}
</div>
