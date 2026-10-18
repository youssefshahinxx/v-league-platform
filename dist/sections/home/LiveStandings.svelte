<script>
	import { onMount } from 'svelte';
	import { supabase } from '../../supabase';

	/** @type {Array<{profile_id: string, full_name: string, nationality: string, total_points: number, events_tracked: number, avatar_url?: string}>} */
	let rows = $state([]);
	let isVisible = $state(false);
	/** @type {HTMLElement | undefined} */
	let el;

	onMount(async () => {
		const { data: leaderboard } = await supabase
			.from('leaderboard')
			.select('profile_id, full_name, nationality, total_points, events_tracked')
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
			rows = leaderboard;
		}

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				isVisible = true;
				observer.disconnect();
			}
		}, { threshold: 0.1 });
		if (el) observer.observe(el);
	});
</script>

<section
	bind:this={el}
	class="relative z-30 -mt-20 px-margin-mobile lg:px-margin-desktop transition-all duration-1000 {isVisible ? 'opacity-100' : 'opacity-0'}"
>
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
		<div class="lg:col-span-8 bg-surface-container/80 backdrop-blur-3xl p-stack-lg relative overflow-hidden group">
			<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary-fixed to-primary"></div>
			<div class="flex justify-between items-end mb-stack-lg">
				<h2 class="font-headline-lg text-headline-lg text-white uppercase italic">Live Standings</h2>
				<span class="font-label-caps text-label-caps capitalize text-on-surface-variant mb-2">Leaders of the league</span>
			</div>
			{#if rows.length > 0}
				<div class="overflow-x-auto">
					<table class="w-full text-left border-collapse">
						<thead>
							<tr class="border-b border-white/10">
								<th class="py-stack-sm font-label-caps text-label-caps text-primary">RANK</th>
								<th class="py-stack-sm font-label-caps text-label-caps text-primary">ATHLETE</th>
								<th class="py-stack-sm font-label-caps text-label-caps text-primary">NATION</th>
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
									<td class="py-stack-md text-on-surface-variant font-label-caps">{row.nationality || '---'}</td>
									<td class="py-stack-md text-right font-stats-number text-stats-number text-white">{row.total_points}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="text-center py-12 text-on-surface-variant font-body-md">
					No standings data available yet.
				</div>
			{/if}
		</div>
		<div class="lg:col-span-4 flex flex-col gap-gutter">
			<a href="/ranking" class="bg-primary p-stack-lg flex flex-col justify-between aspect-square lg:aspect-auto h-full relative overflow-hidden group block">
				<div class="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
					<span class="material-symbols-outlined !text-[200px] text-on-primary">timer</span>
				</div>
				<h3 class="font-label-caps text-label-caps text-on-primary uppercase tracking-widest">Full Leaderboard</h3>
				<div>
					<p class="font-display-xl text-display-xl text-on-primary italic leading-none">{rows[0]?.total_points ?? '---'}</p>
					<p class="font-label-caps text-label-caps text-on-primary-container mt-2">TOP SCORE THIS SEASON</p>
				</div>
				<span class="bg-on-primary text-primary px-stack-md py-stack-sm font-label-caps text-label-caps w-fit">VIEW ALL</span>
			</a>
		</div>
	</div>
</section>
