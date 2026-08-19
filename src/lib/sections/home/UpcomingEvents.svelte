<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	/** @type {Array<{id: string, title: string, location: string, event_date: string, image_url: string}>} */
	let events = $state([]);
	let isVisible = $state(false);
	/** @type {HTMLElement | undefined} */
	let el;
	/** @type {HTMLElement | undefined} */
	let scrollContainer = $state(undefined);

	/** @param {string} dateString */
	function formatDate(dateString) {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
	}

	onMount(async () => {
		const { data } = await supabase
			.from('competitions')
			.select('id, title, location, event_date, image_url')
			.order('event_date', { ascending: true })
			.limit(10);

		if (data) events = data;

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				isVisible = true;
				observer.disconnect();
			}
		}, { threshold: 0.1 });
		if (el) observer.observe(el);
	});

	/** @param {number} dir */
	function scroll(dir) {
		if (!scrollContainer) return;
		const amount = 420;
		scrollContainer.scrollBy({ left: dir * amount, behavior: 'smooth' });
	}
</script>

<section
	bind:this={el}
	class="py-margin-desktop bg-surface-container-lowest transition-all duration-1000 {isVisible ? 'opacity-100' : 'opacity-0'}"
>
	<div class="px-margin-mobile lg:px-margin-desktop mb-stack-lg flex justify-between items-center">
		<h2 class="font-headline-lg text-headline-lg text-white uppercase italic">Upcoming Events</h2>
		<div class="flex gap-stack-sm">
			<button onclick={() => scroll(-1)} class="p-2 border border-white/10 hover:bg-primary hover:text-on-primary transition-all cursor-pointer">
				<span class="material-symbols-outlined">arrow_back</span>
			</button>
			<button onclick={() => scroll(1)} class="p-2 border border-white/10 hover:bg-primary hover:text-on-primary transition-all cursor-pointer">
				<span class="material-symbols-outlined">arrow_forward</span>
			</button>
		</div>
	</div>
	{#if events.length > 0}
		<div bind:this={scrollContainer} class="flex gap-gutter overflow-x-auto pb-stack-lg px-margin-mobile lg:px-margin-desktop no-scrollbar scroll-smooth">
			{#each events as event}
				<a href="/competitions/{event.id}" class="min-w-[320px] md:min-w-[400px] bg-surface-container-high group hover:bg-surface-variant transition-all block">
					<div class="h-48 w-full relative overflow-hidden">
						{#if event.image_url}
							<img src={event.image_url} alt={event.title} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
						{:else}
							<div class="w-full h-full bg-gradient-to-br from-surface-variant to-surface-container-highest flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
								<span class="material-symbols-outlined text-6xl text-outline">stadium</span>
							</div>
						{/if}
						<div class="absolute top-4 left-4 bg-secondary-fixed text-on-secondary px-3 py-1 font-label-caps text-label-caps">
							{formatDate(event.event_date)}
						</div>
					</div>
					<div class="p-stack-lg space-y-stack-sm">
						<h4 class="font-headline-md text-headline-md text-white uppercase">{event.title}</h4>
						<p class="font-body-md text-on-surface-variant">{event.location}</p>
						<div class="pt-stack-md">
							<span class="block w-full border border-primary text-primary py-stack-sm font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all text-center">VIEW DETAILS</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="px-margin-mobile lg:px-margin-desktop text-center py-12 text-on-surface-variant font-body-md">
			No upcoming events scheduled yet.
		</div>
	{/if}
</section>
