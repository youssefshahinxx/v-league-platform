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

<div class="w-full px-margin-mobile lg:px-margin-desktop py-margin-desktop">
    <div class="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-stack-md">
        <div>
            <h1 class="font-headline-lg text-headline-lg text-white uppercase italic">League Blog</h1>
            <p class="font-body-md text-on-surface-variant mt-2">News, updates, and stories from the V-League.</p>
        </div>
        <span class="font-label-caps text-label-caps text-on-surface-variant mb-2 shrink-0">{data.blogs.length} ARTICLES</span>
    </div>

    {#if data.blogs.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {#each data.blogs as post}
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
                        <div class="absolute bottom-4 left-4 font-label-caps text-[10px] bg-primary text-on-primary px-2 py-1">ARTICLE</div>
                    </div>
                    <div>
                        <p class="font-label-caps text-label-caps text-on-surface-variant mb-stack-sm">{formatDate(post.published_at)} · {post.author || 'V-League Staff'}</p>
                        <h3 class="font-headline-md text-headline-md text-white uppercase group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                        {#if post.excerpt}
                            <p class="font-body-md text-on-surface-variant mt-2 line-clamp-2">{post.excerpt}</p>
                        {/if}
                    </div>
                </a>
            {/each}
        </div>
    {:else}
        <div class="text-center py-margin-desktop bg-surface-container-low border border-white/5">
            <p class="font-body-md text-on-surface-variant">No articles published yet. Check back soon.</p>
        </div>
    {/if}
</div>