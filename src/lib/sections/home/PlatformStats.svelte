<script lang="ts">
	import { onMount } from 'svelte';

	let {
		stats = {
			totalAthletes: 1240,
			pointsAllocated: 84500,
			eventsLogged: 42
		}
	} = $props();

	let visible = $state(false);
	let animatedAthletes = $state(0);
	let animatedPoints = $state(0);
	let animatedEvents = $state(0);

	function formatNumber(num: number) {
		return new Intl.NumberFormat('en-US').format(num);
	}

	function animateValue(target: number, duration: number, callback: (v: number) => void) {
		let start = 0;
		const step = (timestamp: number) => {
			if (!start) start = timestamp;
			const progress = Math.min((timestamp - start) / duration, 1);
			callback(Math.floor(progress * target));
			if (progress < 1) requestAnimationFrame(step);
		};
		requestAnimationFrame(step);
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					animateValue(stats.totalAthletes, 1200, (v) => { animatedAthletes = v; });
					animateValue(stats.pointsAllocated, 1200, (v) => { animatedPoints = v; });
					animateValue(stats.eventsLogged, 800, (v) => { animatedEvents = v; });
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);

		const el = document.getElementById('platform-stats');
		if (el) observer.observe(el);

		return () => observer.disconnect();
	});
</script>

<section id="platform-stats" class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 z-10 mb-16">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">

		<div
			class="bg-[#fafafa] border-2 border-[#fb310f] rounded-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out"
		>
			<span class="text-3xl sm:text-4xl font-bold tracking-tight text-[#fb310f] mb-2">
				{visible ? formatNumber(animatedAthletes) : '0'}
			</span>
			<h2 class="text-sm font-medium text-[#71717a] uppercase tracking-wider">
				Active Athletes
			</h2>
		</div>

		<div
			class="bg-[#fafafa] border border-[#fb310f] rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out"
		>
			<span class="text-3xl sm:text-4xl font-bold tracking-tight text-[#fb310f] mb-2">
				{visible ? formatNumber(animatedPoints) : '0'}
			</span>
			<h2 class="text-sm font-medium text-[#71717a] uppercase tracking-wider">
				Points Allocated
			</h2>
		</div>

		<div
			class="bg-[#fafafa] border border-[#fb310f] rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out"
		>
			<span class="text-3xl sm:text-4xl font-bold tracking-tight text-[#fb310f] mb-2">
				{visible ? formatNumber(animatedEvents) : '0'}
			</span>
			<h2 class="text-sm font-medium text-[#71717a] uppercase tracking-wider">
				Events Logged
			</h2>
		</div>

	</div>
</section>