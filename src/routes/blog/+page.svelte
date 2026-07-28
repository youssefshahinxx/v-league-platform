<script>
    /** @type {{ data: { blogs: Array<{id: string, title: string, slug: string, excerpt: string, image_url: string, author: string, published_at: string}> } }} */
    let { data } = $props();

    /** @param {string} dateString */
    function formatDate(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }
</script>

<div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="md:flex md:items-center md:justify-between mb-10 border-b border-zinc-200 pb-5">
        <div class="min-w-0 flex-1">
            <h1 class="text-2xl font-bold leading-7 text-zinc-900 sm:text-3xl sm:tracking-tight">
                League Blog
            </h1>
            <p class="mt-1 text-sm text-zinc-500">News, updates, and stories from the V-League.</p>
        </div>
    </div>

    {#if data.blogs.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each data.blogs as post}
                <a
                    href="/blog/{post.slug}"
                    class="group flex flex-col rounded-lg border border-zinc-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                    {#if post.image_url}
                        <div class="w-full h-48 overflow-hidden">
                            <img src={post.image_url} alt={post.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    {:else}
                        <div class="w-full h-48 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                            <svg class="w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                        </div>
                    {/if}
                    <div class="flex-1 flex flex-col p-5">
                        <p class="text-xs text-zinc-400 mb-2">{formatDate(post.published_at)}</p>
                        <h2 class="text-base font-semibold text-zinc-900 group-hover:text-[#fb310f] transition-colors line-clamp-2">{post.title}</h2>
                        {#if post.excerpt}
                            <p class="mt-2 text-sm text-zinc-500 line-clamp-3 flex-1">{post.excerpt}</p>
                        {/if}
                        <p class="mt-3 text-xs text-zinc-400">By {post.author || 'V-League Staff'}</p>
                    </div>
                </a>
            {/each}
        </div>
    {:else}
        <div class="text-center py-20 bg-white border border-zinc-200 rounded-lg">
            <svg class="mx-auto w-12 h-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h3 class="mt-4 text-sm font-semibold text-zinc-900">No blog posts yet</h3>
            <p class="mt-1 text-sm text-zinc-500">Check back soon for the latest league news and updates.</p>
        </div>
    {/if}
</div>
