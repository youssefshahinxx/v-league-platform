<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	/** @type {Array<{profile_id: string, full_name: string, nationality: string, club: string, total_points: number, events_tracked: number, avatar_url?: string}>} */
	let topAthletes = $state([]);
	let isLoading = $state(true);

	onMount(async () => {
		const { data: leaderboard } = await supabase
			.from('leaderboard')
			.select('profile_id, full_name, nationality, club, total_points, events_tracked')
			.order('total_points', { ascending: false })
			.limit(3);

		if (leaderboard && leaderboard.length > 0) {
			const profileIds = leaderboard.map(r => r.profile_id);
			const { data: profiles } = await supabase
				.from('profiles')
				.select('id, avatar_url')
				.in('id', profileIds);

			const avatarMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.avatar_url]));
			for (const row of leaderboard) {
				/** @type {any} */ (row).avatar_url = avatarMap[row.profile_id] ?? null;
			}
			topAthletes = leaderboard;
		}

		isLoading = false;
	});
</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-[#e4e4e7]">
	<div class="text-center mb-12">
		<h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b]">
			League Leaders
		</h2>
		<p class="mt-2 text-sm text-[#71717a]">
			The top-ranked athletes dominating the competitive circuit.
		</p>
	</div>

	{#if isLoading}
		<div class="flex justify-center gap-6">
			{#each [1, 2, 3] as _}
				<div class="w-64 h-72 rounded-lg border border-[#e4e4e7] bg-[#fafafa] animate-pulse p-6"></div>
			{/each}
		</div>
	{:else if topAthletes.length > 0}
		<div class="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-4">
			{#each topAthletes as athlete, index}
				{@const rank = index + 1}
				{@const isFirst = rank === 1}
				<a
					href="/athletes/{athlete.profile_id}"
					class="group relative flex flex-col items-center text-center p-6 rounded-lg border transition-all duration-300 w-full md:w-64
						{isFirst
							? 'bg-gradient-to-b from-[#fff7e6] to-[#fafafa] border-[#f59e0b]/30 md:-mt-6 md:scale-105 shadow-lg hover:shadow-xl'
							: 'bg-[#fafafa] border-[#e4e4e7] hover:shadow-lg hover:-translate-y-1'}"
				>
					<!-- Rank Badge -->
					<div class="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
						{rank === 1 ? 'bg-[#f59e0b]' : rank === 2 ? 'bg-[#9ca3af]' : 'bg-[#d97706]'}">
						{rank}
					</div>

					<!-- Avatar -->
					<div class="w-16 h-16 rounded-full overflow-hidden bg-zinc-200 border-2 mb-4 mt-2
						{isFirst ? 'border-[#f59e0b]' : 'border-zinc-200'}">
						{#if athlete.avatar_url}
							<img src={athlete.avatar_url} alt="" class="w-full h-full object-cover" />
						{:else}
							<div class="w-full h-full flex items-center justify-center text-zinc-400">
								<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
								</svg>
							</div>
						{/if}
					</div>

					<!-- Name + Nationality -->
					<h3 class="text-base font-semibold text-[#09090b] group-hover:text-[#fb310f] transition-colors">{athlete.full_name}</h3>
					<span class="inline-flex items-center rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 uppercase mt-1">
						{athlete.nationality || 'TBA'}
					</span>

					<!-- Points -->
					<p class="mt-3 text-sm text-[#71717a]">
						<span class="font-bold text-lg text-[#09090b]">{athlete.total_points}</span> pts
					</p>
				</a>
			{/each}
		</div>

		<div class="text-center mt-10">
			<a href="/ranking" class="inline-flex items-center text-sm font-medium text-[#fb310f] hover:text-[#e02c0d] transition-colors">
				View Full Rankings
				<svg class="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
				</svg>
			</a>
		</div>
	{:else}
		<div class="text-center py-12 bg-[#fafafa] border border-[#e4e4e7] rounded-lg">
			<p class="text-sm text-[#71717a]">No ranked athletes yet. Points are awarded after competitions are completed.</p>
		</div>
	{/if}
</section>
