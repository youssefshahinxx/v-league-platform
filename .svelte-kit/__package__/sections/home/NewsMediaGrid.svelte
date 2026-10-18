<script>
	import { onMount } from 'svelte';
	import { supabase } from '../../supabase';

	/** @type {Array<{id: string, title: string, slug: string, excerpt: string, image_url: string, author: string, published_at: string}>} */
	let posts = $state([]);
	let isVisible = $state(false);
	/** @type {HTMLElement | undefined} */
	let el;

	onMount(async () => {
		const { data } = await supabase
			.from('blogs')
			.select('id, title, slug, excerpt, image_url, author, published_at')
			.order('published_at', { ascending: false })
			.limit(3);

		if (data) posts = data;

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
	class="py-margin-desktop px-margin-mobile lg:px-margin-desktop transition-all duration-1000 {isVisible ? 'opacity-100' : 'opacity-0'}"
>
	<div class="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-stack-md">
		<div>
			<h2 class="font-headline-lg text-headline-lg text-white uppercase italic">News & Analysis</h2>
			<div class="h-1 w-24 bg-primary mt-2"></div>
		</div>
		<a href="/blog" class="font-label-caps text-label-caps text-primary hover:underline flex items-center gap-2 uppercase">
			Explore all media <span class="material-symbols-outlined">trending_flat</span>
		</a>
	</div>
	{#if posts.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
			{#each posts as post}
				<a href="/blog/{post.slug}" class="group cursor-pointer block">
					<div class="relative aspect-video overflow-hidden mb-stack-md">
						{#if post.image_url}
							<img src={post.image_url} alt={post.title} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
						{:else}
							<div class="w-full h-full bg-surface-variant flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
								<span class="material-symbols-outlined text-5xl text-outline">article</span>
							</div>
						{/if}
						<div class="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
						<div class="absolute bottom-4 left-4 font-label-caps text-[10px] bg-primary text-on-primary px-2 py-1">
							ARTICLE
						</div>
					</div>
					<h3 class="font-headline-md text-headline-md text-white uppercase group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
					<p class="font-body-md text-on-surface-variant mt-2 line-clamp-2">{post.excerpt || 'Read more about the latest V-League developments.'}</p>
				</a>
			{/each}
		</div>
	{:else}
		<div class="text-center py-12 text-on-surface-variant font-body-md">
			No articles published yet. Check back soon.
		</div>
	{/if}
</section>
