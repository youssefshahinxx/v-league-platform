<script>
	import { onMount } from 'svelte';

	const steps = [
		{
			icon: 'M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125A3.375 3.375 0 114.5 9.75m3.75 0l-.09 7.5m9-7.5V20.25c0 .621-.504 1.125-1.125 1.125H6.375c-.621 0-1.125-.504-1.125-1.125V9.75M19 7.5h-15',
			title: 'Register Your Profile',
			description: 'Create your athlete account with your credentials, nationality, and club affiliation. Your competitive journey starts here.'
		},
		{
			icon: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721M7.73 9.728l3.75 1.5',
			title: 'Compete in Events',
			description: 'Browse open tournaments, register for competitions, and secure your slot against athletes from around the league.'
		},
		{
			icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
			title: 'Climb the Rankings',
			description: 'Earn points through participation, performance improvement, and ranking stability. Watch your global position rise with every event.'
		}
	];

	let visible = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.2 }
		);

		const el = document.getElementById('how-it-works');
		if (el) observer.observe(el);

		return () => observer.disconnect();
	});
</script>

<section id="how-it-works" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-black">
	<div class="text-center mb-12">
		<h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b]">
			How It Works
		</h2>
		<p class="mt-3 text-sm text-[#71717a] max-w-lg mx-auto">
			Three simple steps to start your competitive tracking journey on the V-League platform.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
		{#each steps as step, index}
			<div
				class="relative flex flex-col items-center text-center p-6 {visible ? 'animate-fade-up' : 'opacity-0'}"
				style="animation-delay: {index * 0.15}s"
			>
				<div class="flex items-center justify-center w-12 h-12 rounded-full bg-[#fb310f] mb-5 hover:scale-110 transition-transform duration-300">
					<svg class="w-6 h-6 text-[#fafafa]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d={step.icon} />
					</svg>
				</div>
				{#if index < steps.length - 1}
					<div class="absolute top-6 left-[calc(50%+2.5rem)] hidden md:block" aria-hidden="true">
						<svg class="w-5 h-5 text-[#d4d4d8]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
						</svg>
					</div>
				{/if}
				<h3 class="text-base font-semibold text-[#09090b] mb-2">{step.title}</h3>
				<p class="text-sm text-[#71717a] leading-relaxed">{step.description}</p>
			</div>
		{/each}
	</div>
</section>
