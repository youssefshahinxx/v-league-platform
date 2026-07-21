<script lang="ts">
	// Props using Svelte 5 runes with safe fallback default values for MVP
	let {
		stats = {
			totalAthletes: 1240,
			pointsAllocated: 84500,
			eventsLogged: 42
		}
	} = $props();

	// Helper to format large numbers for better readability (e.g., 84500 -> 84,500)
	const formatNumber = (num: number) => {
		return new Intl.NumberFormat('en-US').format(num);
	};
</script>

<!-- 
	Stats Section Container
	The -mt-12 class pulls this block up to overlap the dark Hero section above it,
	while z-10 ensures it sits correctly on top of the background. 
-->
<section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 z-10 mb-16">
	<!-- Responsive Grid: 1 column mobile, 3 columns tablet/desktop -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		
		<!-- Total Athletes Card -->
		<div 
			class="bg-[#fafafa] border border-[#e4e4e7] rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
		>
			<span class="text-3xl sm:text-4xl font-bold tracking-tight text-[#09090b] mb-2">
				{formatNumber(stats.totalAthletes)}
			</span>
			<h2 class="text-sm font-medium text-[#71717a] uppercase tracking-wider">
				Active Athletes
			</h2>
		</div>

		<!-- Points Allocated Card -->
		<div 
			class="bg-[#fafafa] border border-[#e4e4e7] rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
		>
			<span class="text-3xl sm:text-4xl font-bold tracking-tight text-[#09090b] mb-2">
				{formatNumber(stats.pointsAllocated)}
			</span>
			<h2 class="text-sm font-medium text-[#71717a] uppercase tracking-wider">
				Points Allocated
			</h2>
		</div>

		<!-- Events Logged Card -->
		<div 
			class="bg-[#fafafa] border border-[#e4e4e7] rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
		>
			<span class="text-3xl sm:text-4xl font-bold tracking-tight text-[#09090b] mb-2">
				{formatNumber(stats.eventsLogged)}
			</span>
			<h2 class="text-sm font-medium text-[#71717a] uppercase tracking-wider">
				Events Logged
			</h2>
		</div>

	</div>
</section>