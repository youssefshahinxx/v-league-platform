<script>
    /** @type {{ data: { post: {id: string, title: string, slug: string, excerpt: string, content: string, image_url: string, author: string, published_at: string} } }} */
    let { data } = $props();

    /** @param {string} dateString */
    function formatDate(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }
</script>

<div class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
        <a href="/blog" class="text-sm font-medium text-zinc-500 hover:text-[#fb310f] transition-colors">
            ← Back to Blog
        </a>
    </div>

    <article class="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        {#if data.post.image_url}
            <div class="w-full h-64 sm:h-80 overflow-hidden">
                <img src={data.post.image_url} alt={data.post.title} class="w-full h-full object-cover" />
            </div>
        {/if}

        <div class="p-6 sm:p-10">
            <div class="flex items-center gap-3 text-xs text-zinc-400 mb-4">
                <span>{formatDate(data.post.published_at)}</span>
                <span>•</span>
                <span>By {data.post.author || 'V-League Staff'}</span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mb-6">
                {data.post.title}
            </h1>

            <md class="prose prose-sm sm:prose-base prose-zinc max-w-none leading-relaxed text-zinc-600">
                {data.post.content}
            </md>
        </div>
    </article>
</div>
