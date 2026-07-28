<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	/** @type {Array<{id: string, title: string, location: string, event_date: string, status: string, ticket_price?: number}>} */
	let events = $state([]);
	let isLoading = $state(true);

	/** @param {string} dateString */
	function formatDate(dateString) {
		if (!dateString) return 'TBA';
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	onMount(async () => {
		const { data } = await supabase
			.from('competitions')
			.select('id, title, location, event_date, status, ticket_price')
			.neq('status', 'completed')
			.order('event_date', { ascending: true })
			.limit(3);

		if (data) {
			events = data;
		}

		isLoading = false;
	});
</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-[#e4e4e7]">
	<div class="flex items-center justify-between mb-10">
		<div>
			<h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b]">
				Featured Events
			</h2>
			<p class="mt-2 text-sm text-[#71717a]">
				Upcoming tournaments open for registration.
			</p>
		</div>
		<a
			href="/competitions"
			class="hidden sm:inline-flex items-center text-sm font-medium text-[#fb310f] hover:text-[#e02c0d] transition-colors"
		>
			View all
			<svg class="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
			</svg>
		</a>
	</div>

	{#if isLoading}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each [1, 2, 3] as _}
				<div class="rounded-lg border border-[#e4e4e7] bg-[#fafafa] p-6 skeleton-shimmer">
					<div class="h-4 bg-[#e4e4e7] rounded w-3/4 mb-3"></div>
					<div class="h-3 bg-[#e4e4e7] rounded w-1/2 mb-2"></div>
					<div class="h-3 bg-[#e4e4e7] rounded w-1/3"></div>
				</div>
			{/each}
		</div>
	{:else if events.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each events as event}
				<a
					href="/competitions/{event.id}"
					class="block rounded-lg border border-[#e4e4e7] bg-[#fafafa] p-6 hover:shadow-lg hover:-translate-y-1 hover:border-[#fb310f]/30 transition-all duration-300"
				>
					<div class="flex items-center justify-between mb-3">
						<span
							class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
								{event.status === 'open' ? 'bg-[#fef2f2] text-[#fb310f] ring-1 ring-inset ring-[#fb310f]/20 animate-pulse-subtle'
									: event.status === 'upcoming'
										? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10'
										: 'bg-zinc-100 text-zinc-600'}"
						>
							{event.status === 'open' ? 'Open' : event.status === 'upcoming' ? 'Upcoming' : 'Closed'}
						</span>
						<span class="text-xs text-[#71717a]">{formatDate(event.event_date)}</span>
					</div>
					<h3 class="text-base font-semibold text-[#09090b] truncate">{event.title}</h3>
					<p class="mt-1 text-sm text-[#71717a] truncate">{event.location}</p>
				</a>
			{/each}
		</div>
	{:else}
		<div class="text-center py-12 bg-[#fafafa] border border-[#e4e4e7] rounded-lg">
			<p class="text-sm text-[#71717a]">No upcoming events scheduled yet. Check back soon.</p>
		</div>
	{/if}

	<div class="mt-8 text-center sm:hidden">
		<a href="/competitions" class="text-sm font-medium text-[#fb310f] hover:text-[#e02c0d] transition-colors">
			View all events →
		</a>
	</div>
</section>
