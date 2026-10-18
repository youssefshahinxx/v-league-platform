<script>
	import { onMount } from 'svelte';
	import { supabase } from '../../supabase';

	/** @type {{profile_id?: string, full_name?: string, total_points?: number, events_tracked?: number, avatar_url?: string, nationality?: string, club?: string}} */
	let athlete = $state({});
	let isVisible = $state(false);
	/** @type {HTMLElement | undefined} */
	let el;

	onMount(async () => {
		const { data: leaderboard } = await supabase
			.from('leaderboard')
			.select('profile_id, full_name, total_points, events_tracked, nationality')
			.order('total_points', { ascending: false })
			.limit(1);

		if (leaderboard && leaderboard[0]) {
			const top = leaderboard[0];
			const { data: profiles } = await supabase
				.from('profiles')
				.select('avatar_url')
				.eq('id', top.profile_id)
				.single();

			athlete = {
				...top,
				avatar_url: profiles?.avatar_url ?? null
			};
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
	class="relative bg-background py-margin-desktop overflow-hidden transition-all duration-1000 {isVisible ? 'opacity-100' : 'opacity-0'}"
>
	<div class="absolute top-0 right-0 w-1/2 h-full bg-surface-container-low skew-x-[15deg] translate-x-20 z-0"></div>
	<div class="relative z-10 px-margin-mobile lg:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center">
		{#if athlete.profile_id}
			<div class="relative group">
				<div class="absolute inset-0 border-[12px] border-primary/20 -translate-x-6 translate-y-6 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
				{#if athlete.avatar_url}
					<img src={athlete.avatar_url} alt={athlete.full_name} class="w-full aspect-[4/5] object-cover relative z-10 shadow-2xl" />
				{:else}
					<div class="w-full aspect-[4/5] bg-surface-variant relative z-10 shadow-2xl flex items-center justify-center">
						<svg class="w-24 h-24 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
						</svg>
					</div>
				{/if}
				<div class="absolute -bottom-6 -right-6 bg-secondary-fixed p-stack-lg z-20">
					<p class="font-stats-number text-display-xl text-on-secondary italic leading-none">{athlete.total_points ?? 0}</p>
					<p class="font-label-caps text-label-caps text-on-secondary uppercase">TOTAL POINTS</p>
				</div>
			</div>
			<div class="space-y-stack-lg lg:pl-12">
				<div class="space-y-stack-sm">
					<h4 class="font-label-caps text-label-caps text-primary uppercase tracking-[0.2em]">LEAGUE LEADER</h4>
					<h2 class="font-display-xl text-display-xl text-white italic uppercase leading-[0.8]">
						{athlete.full_name}<br />
					</h2>
				</div>
				<div class="grid grid-cols-2 gap-gutter">
					<div class="border-l-2 border-primary pl-4">
						<p class="font-stats-number text-stats-number text-white">{athlete.total_points ?? 0}</p>
						<p class="font-label-caps text-label-caps text-on-surface-variant">TOTAL POINTS</p>
					</div>
					<div class="border-l-2 border-primary pl-4">
						<p class="font-stats-number text-stats-number text-white">{athlete.events_tracked ?? 0}</p>
						<p class="font-label-caps text-label-caps text-on-surface-variant">EVENTS</p>
					</div>
				</div>
				<p class="font-body-lg text-body-lg text-on-surface-variant">
					The current leader of the V-League standings. With exceptional performance across all events, {athlete.full_name} sets the standard for competitive excellence.
				</p>
				<a href="/athletes/{athlete.profile_id}" class="inline-block bg-white text-background px-12 py-4 font-label-caps text-label-caps uppercase hover:bg-primary transition-colors">
					Full Profile
				</a>
			</div>
		{:else}
			<div class="lg:col-span-2 text-center py-20 text-on-surface-variant font-body-md">
				No featured athlete data available yet.
			</div>
		{/if}
	</div>
</section>
