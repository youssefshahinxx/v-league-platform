<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	/** @type {Array<{id: string, title: string, slug: string, excerpt: string, image_url: string, published_at: string}>} */
	let posts = $state([]);
	let isLoading = $state(true);

	/** @param {string} dateString */
	function formatDate(dateString) {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	onMount(async () => {
		const { data } = await supabase
			.from('blogs')
			.select('id, title, slug, excerpt, image_url, published_at')
			.order('published_at', { ascending: false })
			.limit(3);

		if (data) {
			posts = data;
		}

		isLoading = false;
	});
</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-[#e4e4e7]">
	<div class="flex items-center justify-between mb-10">
		<div>
			<h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#09090b]">
				Latest News
			</h2>
			<p class="mt-2 text-sm text-[#71717a]">
				Updates and stories from the V-League.
			</p>
		</div>
		<a
			href="/blog"
			class="hidden sm:inline-flex items-center text-sm font-medium text-[#fb310f] hover:text-[#e02c0d] transition-colors"
		>
			View all
			<svg class="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
			</svg>
		</a>
	</div>

	{#if isLoading}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each [1, 2, 3] as _}
				<div class="rounded-lg border border-[#e4e4e7] bg-[#fafafa] p-6 animate-pulse">
					<div class="h-32 bg-[#e4e4e7] rounded mb-3"></div>
					<div class="h-4 bg-[#e4e4e7] rounded w-3/4 mb-2"></div>
					<div class="h-3 bg-[#e4e4e7] rounded w-full mb-1"></div>
					<div class="h-3 bg-[#e4e4e7] rounded w-1/2"></div>
				</div>
			{/each}
		</div>
	{:else if posts.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each posts as post}
				<a
					href="/blog/{post.slug}"
					class="group block rounded-lg border border-[#e4e4e7] bg-[#fafafa] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
				>
					{#if post.image_url}
						<div class="w-full h-40 overflow-hidden">
							<img src={post.image_url} alt={post.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
						</div>
					{:else}
						<div class="w-full h-40 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
							<svg class="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
							</svg>
						</div>
					{/if}
					<div class="p-5">
						<p class="text-xs text-[#71717a] mb-2">{formatDate(post.published_at)}</p>
						<h3 class="text-base font-semibold text-[#09090b] group-hover:text-[#fb310f] transition-colors line-clamp-2">{post.title}</h3>
						{#if post.excerpt}
							<p class="mt-1 text-sm text-[#71717a] line-clamp-2">{post.excerpt}</p>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="text-center py-12 bg-[#fafafa] border border-[#e4e4e7] rounded-lg">
			<p class="text-sm text-[#71717a]">No blog posts yet. Check back soon.</p>
		</div>
	{/if}

	<div class="mt-8 text-center sm:hidden">
		<a href="/blog" class="text-sm font-medium text-[#fb310f] hover:text-[#e02c0d] transition-colors">
			View all blog posts →
		</a>
	</div>
</section>
