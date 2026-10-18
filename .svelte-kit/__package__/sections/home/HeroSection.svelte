<script>
	import { onMount } from 'svelte';

	/** @type {HTMLElement | undefined} */
	let el;
	let isVisible = $state(false);

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
	class="relative min-h-[90vh] mb-16 flex items-center -mt-16 pt-16 overflow-hidden transition-all duration-1000 {isVisible ? 'opacity-100' : 'opacity-0'}"
>
	<div class="absolute inset-0 z-0">
		<div class="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10"></div>
		<div class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
		<img
			alt="Elite athletes in mid-sprint"
			class="w-full h-full object-cover"
			src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCNxlOGZOI3hhCEG-p2ktXCzjxEHzrxXDF_AeJrPS0s1bKVQGHsjyB1W89M9mOUdiqvDYtJiAiAJSfIyf53w-wqIvfLA6SAzKAZ74-2Q4aSDg4a3G0fcc0nJRN4cqzkYHlLN_zIrMzWF2ixTTeNp93U1h-2_tfCSQRhR42Aa6MdCSPbXJNmJP6IAP61ORj2jy5b7WzHPe5a2_zC2oRSdgBR463HXs7W5Vf_JShGafVnhrs-xlZ3AMM2A"
		/>
	</div>
	<div class="relative z-20 w-full px-margin-mobile lg:px-margin-desktop">
		<div class="max-w-4xl space-y-stack-md">
			<div class="flex items-center gap-stack-sm">
				<span class="w-3 h-3 bg-primary rounded-full"></span>
				<span class="font-label-caps text-label-caps animate-pulse text-primary-fixed uppercase tracking-widest">Live: Aro-League Season Open</span>
			</div>
			<h1 class="font-display-xl text-display-xl text-white uppercase italic leading-[0.9] tracking-tighter">
				THE SPEED OF<br />
				<span class="text-primary">KINETIC VELOCITY</span>
			</h1>
			<p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
				Experience the world's premier athletics league. Witness the raw power of human potential as elite athletes shatter records in high-definition speed.
			</p>
			<div class="flex flex-wrap gap-gutter pt-stack-md">
				<a href="/ranking" class="bg-primary hover:bg-primary/90 text-on-primary px-10 py-4 font-label-caps text-label-caps transition-all transform hover:scale-105 active:scale-95 inline-block">
					WATCH LIVE
				</a>
				<a href="/ranking" class="border-2 border-secondary-fixed text-secondary-fixed hover:bg-secondary-fixed hover:text-on-secondary px-10 py-4 font-label-caps text-label-caps transition-all transform hover:scale-105 inline-block">
					VIEW STANDINGS
				</a>
			</div>
		</div>
	</div>
	<div class="absolute bottom-20 right-0 w-1/3 h-px bg-gradient-to-l from-primary to-transparent opacity-50"></div>
	<div class="absolute bottom-24 right-0 w-1/4 h-px bg-gradient-to-l from-secondary-fixed to-transparent opacity-30"></div>
</section>
