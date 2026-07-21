<script lang="ts">
	// Static component — no props or reactive states needed.
</script>

<!-- Hero Section: Premium Dark Zinc-950 Core Structural Background -->
<section class="relative w-full overflow-hidden bg-[#18181b] py-16 sm:py-24 lg:py-32 flex items-center justify-center">
	
	<!-- Subtle Geometric Background Grid Texture -->
	<div 
		class="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" 
		aria-hidden="true"
		style="background-image: linear-gradient(#fafafa 1px, transparent 1px), linear-gradient(to right, #fafafa 1px, transparent 1px); background-size: 32px 32px;"
	></div>

	<!-- Radial Ambient glow for subtle depth -->
	<div 
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#fafafa] opacity-[0.02] blur-[120px] pointer-events-none"
		aria-hidden="true"
	></div>

	<!-- Standard Readability Content Container -->
	<div class="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
		
		<!-- Overline Badge -->
		<span 
			class="inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-semibold tracking-wider uppercase bg-[#27272a] text-[#fafafa] border border-[#e4e4e7]/10 mb-6"
		>
			Next-Gen Competitive Analytics
		</span>

		<!-- Main Headline (H1 with Gradient Clip for Emphasis) -->
		<h1 
			class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#fafafa] mb-6 max-w-2xl leading-tight"
		>
			The Definitive Engine for 
			<span class="bg-gradient-to-r from-[#fafafa] via-[#71717a] to-[#fafafa] bg-clip-text text-transparent">
				League Performance
			</span>
		</h1>

		<!-- Subheadline explaining value proposition -->
		<p 
			class="text-base sm:text-lg font-normal text-[#71717a] mb-8 max-w-xl leading-relaxed"
		>
			Track real-time data metrics, register upcoming tournament rosters, and scale your global competitive footprint with absolute precision analytics.
		</p>

		<!-- Call-to-Action (CTA) Area targeting standard min-44px targets -->
		<div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
			
			<!-- Primary Button -->
			<a 
				href="/ranking" 
				class="w-full sm:w-auto min-h-[44px] min-w-[160px] inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-[#09090b] bg-[#fafafa] rounded-md hover:bg-[#e4e4e7] focus:ring-2 focus:ring-[#fafafa] focus:outline-none transition-all duration-200 ease-in-out shadow-sm"
			>
				View Global Rankings
			</a>

			<!-- Secondary Link Button -->
			<a 
				href="/competitions" 
				class="w-full sm:w-auto min-h-[44px] min-w-[160px] inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-[#71717a] hover:text-[#fafafa] focus:ring-2 focus:ring-[#71717a] focus:outline-none rounded-md transition-all duration-200 ease-in-out"
			>
				Browse Active Events →
			</a>
		</div>

	</div>
</section>