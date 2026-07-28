<script>
	/** @type {{ media: Array<{url: string, type?: string}>, heroImage?: string }} */
	let { media = [], heroImage = '' } = $props();

	let slides = $derived(
		media.length > 0 ? media : heroImage ? [{ url: heroImage, type: 'image' }] : []
	);

	let currentIndex = $state(0);

	function next() {
		currentIndex = (currentIndex + 1) % slides.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + slides.length) % slides.length;
	}

	/** @param {string} url
	 *  @param {string} [type] */
	function isVideo(url, type) {
		if (type === 'video') return true;
		return /\.(mp4|webm|ogg|mov)$/i.test(url);
	}
</script>

{#if slides.length > 0}
	<div class="relative w-full overflow-hidden rounded-lg bg-zinc-900">
		{#if isVideo(slides[currentIndex].url, slides[currentIndex].type)}
			<!-- svelte-ignore a11y_media_has_caption -->
			<video
				src={slides[currentIndex].url}
				controls
				class="w-full h-full object-contain max-h-[400px]"
			></video>
		{:else}
			<img
				src={slides[currentIndex].url}
				alt="Slide {currentIndex + 1}"
				class="w-full h-full object-contain max-h-[400px]"
			/>
		{/if}

		{#if slides.length > 1}
			<button
				type="button"
				onclick={prev}
				class="absolute left-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition"
				aria-label="Previous slide"
			>
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</button>
			<button
				type="button"
				onclick={next}
				class="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition"
				aria-label="Next slide"
			>
				<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>

			<div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
				{#each slides as _, i}
					<button
						type="button"
						onclick={() => currentIndex = i}
						class="w-2.5 h-2.5 rounded-full transition-colors {i === currentIndex ? 'bg-white' : 'bg-white/40'}"
						aria-label="Go to slide {i + 1}"
					></button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
