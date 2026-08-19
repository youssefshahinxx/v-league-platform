<script>
    import { renderMarkdown } from '$lib/utils/markdown';

    /** @type {{ data: { post: {id: string, title: string, slug: string, excerpt: string, content: string, image_url: string, author: string, published_at: string} } }} */
    let { data } = $props();

    let html = $derived(renderMarkdown(data.post.content));

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
    <div class="max-w-3xl mx-auto">
        <div class="mb-stack-lg">
            <a href="/blog" class="font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors flex items-center gap-2">
                <span class="material-symbols-outlined">arrow_back</span>
                Back to Blog
            </a>
        </div>

        <article class="bg-surface-container-high p-stack-lg space-y-stack-lg">
            {#if data.post.image_url}
                <div class="-m-stack-lg mb-0 relative aspect-video overflow-hidden">
                    <img src={data.post.image_url} alt={data.post.title} class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
                    <div class="absolute bottom-4 left-4 font-label-caps text-[10px] bg-primary text-on-primary px-2 py-1">ARTICLE</div>
                </div>
            {/if}

            <header>
                <div class="flex my-5 pb-2 items-center gap-stack-md font-label-caps text-label-caps text-on-surface-variant flex-wrap mb-stack-sm">
                    <span class="w-1 h-1 rounded-full bg-primary flex-shrink-0"></span>
                    <span>By {data.post.author || 'V-League Staff'}</span>
                    <span>{formatDate(data.post.published_at)}</span>
                </div>
                <h1 class="font-headline-lg text-headline-lg text-white uppercase italic">{data.post.title}</h1>
                {#if data.post.excerpt}
                    <p class="font-body-lg text-on-surface-variant mt-stack-md leading-relaxed">{data.post.excerpt}</p>
                {/if}
            </header>

            <div class="md-content border-t border-white/5 pt-stack-lg">
                {@html html}
            </div>
        </article>
    </div>
</div>

<style>
    .md-content {
        color: var(--color-on-surface-variant);
        font-family: var(--font-body-md);
    }

    .md-content :global(h2),
    .md-content :global(h3),
    .md-content :global(h4),
    .md-content :global(h5),
    .md-content :global(h6) {
        font-family: var(--font-headline-lg);
        color: #ffffff;
        text-transform: uppercase;
        line-height: 1.2;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
        letter-spacing: 0.02em;
    }

    .md-content :global(h2) {
        font-size: 24px;
    }

    .md-content :global(h3) {
        font-size: 19px;
    }

    .md-content :global(h4) {
        font-size: 16px;
    }

    .md-content :global(p) {
        font-size: 16px;
        line-height: 1.75;
        margin-bottom: 1rem;
    }

    .md-content :global(a) {
        color: var(--color-primary);
        text-decoration: underline;
        text-underline-offset: 3px;
    }

    .md-content :global(a:hover) {
        color: #ffffff;
    }

    .md-content :global(strong) {
        color: #ffffff;
        font-weight: 700;
    }

    .md-content :global(em) {
        font-style: italic;
    }

    .md-content :global(ul),
    .md-content :global(ol) {
        padding-left: 1.5rem;
        margin-bottom: 1rem;
        display: grid;
        gap: 0.5rem;
    }

    .md-content :global(ul) {
        list-style: disc;
    }

    .md-content :global(ol) {
        list-style: decimal;
    }

    .md-content :global(li) {
        line-height: 1.6;
    }

    .md-content :global(blockquote) {
        border-left: 4px solid var(--color-primary);
        margin: 1.25rem 0;
        padding: 0.75rem 1.25rem;
        background: var(--color-surface-container);
        color: var(--color-on-surface-variant);
        font-style: italic;
    }

    .md-content :global(blockquote p) {
        margin-bottom: 0;
    }

    .md-content :global(code) {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 13px;
        background: var(--color-surface-container);
        border: 1px solid rgb(255 255 255 / 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        color: var(--color-primary);
    }

    .md-content :global(pre) {
        background: var(--color-surface-container);
        border: 1px solid rgb(255 255 255 / 0.1);
        padding: 1.25rem;
        border-radius: 8px;
        overflow-x: auto;
        margin: 1.25rem 0;
    }

    .md-content :global(pre code) {
        background: transparent;
        border: none;
        padding: 0;
        color: #ffffff;
        font-size: 13.5px;
        line-height: 1.6;
    }

    .md-content :global(img) {
        border-radius: 8px;
        max-width: 100%;
        height: auto;
        margin: 1.25rem 0;
    }

    .md-content :global(hr) {
        border: none;
        border-top: 1px solid rgb(255 255 255 / 0.1);
        margin: 2rem 0;
    }

    .md-content :global(table) {
        width: 100%;
        border-collapse: collapse;
        margin: 1.25rem 0;
    }

    .md-content :global(th),
    .md-content :global(td) {
        border: 1px solid rgb(255 255 255 / 0.1);
        padding: 0.6rem 0.8rem;
        font-size: 14px;
        text-align: left;
    }

    .md-content :global(th) {
        background: var(--color-surface-container);
        color: #ffffff;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 12px;
    }
</style>