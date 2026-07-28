<script lang="ts">
	let heroRef: HTMLElement;
	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMouseMove(e: MouseEvent) {
		if (!heroRef) return;
		const rect = heroRef.getBoundingClientRect();
		mouseX = (e.clientX - rect.left) / rect.width - 0.5;
		mouseY = (e.clientY - rect.top) / rect.height - 0.5;
	}
</script>

<section
	bind:this={heroRef}
	onmousemove={handleMouseMove}
	class="relative w-full overflow-hidden bg-[#ffffff] py-16 sm:py-24 lg:py-32 flex items-center justify-center"
	aria-label="Hero"
>

<div
		class="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
		aria-hidden="true"
		style="background-image: linear-gradient(#fafafa 1px, transparent 1px), linear-gradient(to right, #fafafa 1px, transparent 1px); background-size: 32px 32px;"
	>
</div>
<img src="/assets/victor-freitas-qZ-U9z4TQ6A-unsplash.jpg" alt="Hero Image" class="w-full absolute" />	
<div class="absolute top-[0px] md:top-[0px] left-0 w-full h-full bg-gradient-to-t from-[#fffefa]/10 to-transparent opacity-50 pointer-events-none z-[-1]"></div>


<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#fafafa] opacity-[0.02] blur-[120px] pointer-events-none transition-transform duration-500 ease-out"
		aria-hidden="true"
		style="transform: translate(calc(-50% + {mouseX * 20}px), calc(-50% + {mouseY * 20}px))"
	></div>

<div class="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
	
	<span
			class="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-semibold tracking-wider uppercase bg-[#27272a] text-[#fb310f] border border-[#fb310f]/10 mb-6 animate-fade-up"
		>
			Next-Gen Competitive Analytics
		</span>
		
		<h1
			class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#fafafa] mb-6 max-w-2xl leading-tight animate-fade-up-delay-1"
		>
			The Definitive Engine for
			<span class="bg-gradient-to-r from-[#fb310f] via-[#ffffff] to-[#fb310f] bg-clip-text text-transparent">
				League Performance
			</span>
		</h1>

		<p
			class="text-base sm:text-lg font-normal text-[#fb310f] mb-8 max-w-xl leading-relaxed animate-fade-up-delay-2"
		>
			Track real-time data metrics, register upcoming tournament rosters, and scale your global competitive footprint with absolute precision analytics.
		</p>

		<div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-up-delay-3">

			<a
				href="/ranking"
				class="w-full sm:w-auto min-h-[44px] min-w-[160px] inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-[#fafafa] bg-[#fb310f] rounded-md hover:bg-[#e02c0d] active:scale-[0.98] transition-all duration-200 ease-in-out shadow-sm"
			>
				View Global Rankings
			</a>

			<a
				href="/competitions"
				class="w-full sm:w-auto min-h-[44px] min-w-[160px] inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-[#fb310f] hover:text-[#e02c0d] rounded-md transition-all duration-200 ease-in-out"
			>
				Browse Active Events →
			</a>
		</div>
	</div>
</section>