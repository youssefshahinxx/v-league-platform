<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import {
        buildCompetitionFilterUrl,
        formatCompetitionDate,
    } from "$lib/utils/ui";

    // /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    let search = $state("");
    let status = $state("all");
    let isVisible = $state(false);
    /** @type {HTMLElement | undefined} */
	let el;

    $effect(() => {
        search = data.searchQuery ?? "";
        status = data.statusFilter ?? "all";
    });

    /** @param {Event} e */
    function applyFilters(e) {
        e.preventDefault();
        const url = buildCompetitionFilterUrl($page.url, search, status);
        goto(url.toString(), { keepFocus: true, noScroll: true });
    }

    /** @param {string} status */
    function statusLabel(status) {
        switch (status) {
            case "open":
                return "OPEN";
            case "upcoming":
                return "UPCOMING";
            case "closed":
                return "CLOSED";
            case "completed":
                return "COMPLETED";
            default:
                return "CLOSED";
        }
    }

    /** @param {string} status */
    function statusColor(status) {
        switch (status) {
            case "open":
                return "bg-secondary-fixed text-on-secondary";
            case "upcoming":
                return "bg-primary text-on-primary";
            case "closed":
                return "bg-surface-variant text-on-surface-variant";
            case "completed":
                return "bg-surface-container text-on-surface-variant";
            default:
                return "bg-surface-variant text-on-surface-variant";
        }
    }

    onMount(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				isVisible = true;
				observer.disconnect();
			}
		}, { threshold: 0.1 });
		if (el) observer.observe(el);
		return () => observer.disconnect();
	});

</script>

<section
    bind:this={el}
    class="relative bg-background overflow-hidden transition-all duration-1000 {isVisible ? 'opacity-100' : 'opacity-0'}"
>
    <div class="w-full px-margin-mobile lg:px-margin-desktop py-margin-desktop">
        <div
            class="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-stack-md"
        >
            <div>
                <h1
                    class="font-headline-lg text-headline-lg text-white uppercase italic"
                >
                    League Competitions
                </h1>
                <p class="font-body-md text-on-surface-variant mt-2">
                    Find and register for upcoming athletic events.
                </p>
            </div>
        </div>

        <form
            onsubmit={applyFilters}
            class="mb-stack-lg flex flex-col sm:flex-row gap-gutter items-end"
        >
            <div class="w-full sm:w-1/3 flex flex-col gap-stack-sm">
                <label
                    for="search"
                    class="font-label-caps text-label-caps text-primary"
                    >Search by Location</label
                >
                <input
                    id="search"
                    type="text"
                    bind:value={search}
                    placeholder="E.g. Cairo, Giza..."
                    class="w-full bg-surface-container-high border-b-2 border-outline-variant px-stack-md py-stack-sm focus:border-primary outline-none text-on-surface font-body-md placeholder:text-on-surface-variant/50"
                />
            </div>
            <div class="w-full sm:w-1/4 flex flex-col gap-stack-sm">
                <label
                    for="status"
                    class="font-label-caps text-label-caps text-primary"
                    >Event Status</label
                >
                <select
                    id="status"
                    bind:value={status}
                    class="w-full bg-surface-container-high border-b-2 border-outline-variant px-stack-md py-stack-sm focus:border-primary outline-none text-on-surface font-body-md"
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
                class="bg-primary hover:bg-primary/90 text-on-primary px-8 py-stack-sm font-label-caps text-label-caps transition-all transform hover:scale-105 active:scale-95"
            >
                FILTER
            </button>
        </form>

        {#if (data.competitions ?? []).length > 0}
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter"
            >
                {#each data.competitions ?? [] as competition}
                    <a
                        href="/competitions/{competition.id}"
                        class="bg-surface-container-high group hover:bg-surface-variant transition-all block"
                    >
                        <div class="h-48 relative overflow-hidden">
                            {#if competition.image_url}
                                <img
                                    src={competition.image_url}
                                    alt={competition.title}
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            {:else}
                                <div
                                    class="w-full h-full bg-gradient-to-br from-surface-variant to-surface-container-highest flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                                >
                                    <span
                                        class="material-symbols-outlined text-6xl text-outline"
                                        >stadium</span
                                    >
                                </div>
                            {/if}
                            <div
                                class="absolute top-4 left-4 {statusColor(
                                    competition.status,
                                )} px-3 py-1 font-label-caps text-label-caps"
                            >
                                {statusLabel(competition.status)}
                            </div>
                            <div
                                class="absolute top-4 right-4 bg-surface-container/80 backdrop-blur-sm px-3 py-1 font-label-caps text-[10px] text-on-surface"
                            >
                                {formatCompetitionDate(competition.event_date)}
                            </div>
                        </div>
                        <div class="p-stack-lg space-y-stack-sm">
                            <h4
                                class="font-headline-md text-headline-md text-white uppercase group-hover:text-primary transition-colors"
                            >
                                {competition.title}
                            </h4>
                            <p class="font-body-md text-on-surface-variant">
                                {competition.location}
                            </p>
                            <div class="pt-stack-md">
                                {#if competition.status === "open"}
                                    <span
                                        class="block w-full border border-primary text-primary py-stack-sm font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all text-center"
                                    >
                                        REGISTER (${competition.ticket_price})
                                    </span>
                                {:else}
                                    <span
                                        class="block w-full border border-outline text-outline py-stack-sm font-label-caps text-label-caps text-center"
                                    >
                                        VIEW DETAILS
                                    </span>
                                {/if}
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {:else}
            <div
                class="text-center py-margin-desktop bg-surface-container-low border border-white/5"
            >
                <p class="font-body-md text-on-surface-variant mb-stack-md">
                    No events match your filters.
                </p>
                <button
                    type="button"
                    onclick={() => {
                        search = "";
                        status = "all";
                        applyFilters(new Event("submit"));
                    }}
                    class="bg-primary hover:bg-primary/90 text-on-primary px-8 py-stack-sm font-label-caps text-label-caps transition-all"
                >
                    CLEAR FILTERS
                </button>
            </div>
        {/if}
    </div>
</section>
