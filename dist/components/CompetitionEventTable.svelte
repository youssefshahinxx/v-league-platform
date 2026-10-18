<script>
	import { onMount } from 'svelte';
	import { supabase } from '../supabase';

	/** @type {Array<{official_rank: number, avatar_url: string | null, full_name: string, performance: number | string | null, points: number | null, profile_id: string}>} */
	let rows = $state([]);

	let { competitionEventId, title = '' } = $props();

	onMount(async () => {
		const { data } = await supabase
			.from('competition_event_results')
			.select('official_rank, avatar_url, full_name, performance, points, profile_id')
			.eq('competition_event_id', competitionEventId)
			.order('official_rank', { ascending: true, nullsFirst: false });

		if (data) rows = data;
	});

	/** @param {number | string | null} value */
	function formatPerformance(value) {
		if (value === null || value === undefined || value === '') return '---';
		if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(2);
		return String(value);
	}
</script>

<div class="bg-surface-container/80 backdrop-blur-3xl p-stack-lg relative overflow-hidden">
	<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary-fixed to-primary"></div>
	<div class="flex justify-between items-end mb-stack-lg gap-stack-md">
		<h3 class="font-headline-lg text-headline-lg text-white uppercase italic">{title}</h3>
		<span class="font-label-caps text-label-caps text-on-surface-variant mb-2 shrink-0">EVENT RESULTS</span>
	</div>
	{#if rows.length > 0}
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="border-b border-white/10">
						<th class="py-stack-sm font-label-caps text-label-caps text-primary">RANK</th>
						<th class="py-stack-sm font-label-caps text-label-caps text-primary">ATHLETE</th>
						<th class="py-stack-sm font-label-caps text-label-caps text-primary text-right">PERFORMANCE</th>
						<th class="py-stack-sm font-label-caps text-label-caps text-primary text-right">PTS</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-white/5">
					{#each rows as row, index}
						<tr class="group/row hover:bg-white/5 transition-colors cursor-pointer" onclick={() => window.location.href = '/athletes/' + row.profile_id}>
							<td class="py-stack-md font-stats-number text-stats-number {index === 0 ? 'text-secondary-fixed' : 'text-on-surface-variant'} italic">
								{String(index + 1).padStart(2, '0')}
							</td>
							<td class="py-stack-md flex items-center gap-stack-md">
								<div class="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
									{#if row.avatar_url}
										<img src={row.avatar_url} alt="" class="w-full h-full object-cover" />
									{:else}
										<div class="w-full h-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
											<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
											</svg>
										</div>
									{/if}
								</div>
								<span class="font-headline-md text-headline-md text-white uppercase">{row.full_name}</span>
							</td>
							<td class="py-stack-md text-right font-body-lg text-on-surface">{formatPerformance(row.performance)}</td>
							<td class="py-stack-md text-right font-stats-number text-stats-number text-white">{row.points ?? '---'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="text-center py-12 text-on-surface-variant font-body-md">
			No results recorded for this event yet.
		</div>
	{/if}
</div>
