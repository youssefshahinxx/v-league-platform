import { S as escape_html, l as html, n as derived, x as attr } from "../../../../chunks/server.js";
import { marked } from "marked";
//#region src/lib/utils/markdown.js
marked.setOptions({
	gfm: true,
	breaks: true
});
/**
* Render a Markdown string into sanitized-by-pipeline HTML for direct injection.
* @param {string | null | undefined} content
* @returns {string}
*/
function renderMarkdown(content) {
	if (!content) return "";
	return String(marked.parse(content));
}
//#endregion
//#region src/routes/blog/[slug]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** @type {{ data: { post: {id: string, title: string, slug: string, excerpt: string, content: string, image_url: string, author: string, published_at: string} } }} */
		let { data } = $$props;
		let html$1 = derived(() => renderMarkdown(data.post.content));
		/** @param {string} dateString */
		function formatDate(dateString) {
			if (!dateString) return "";
			return new Date(dateString).toLocaleDateString("en-US", {
				month: "long",
				day: "numeric",
				year: "numeric"
			});
		}
		$$renderer.push(`<div class="w-full px-margin-mobile lg:px-margin-desktop py-margin-desktop"><div class="max-w-3xl mx-auto"><div class="mb-stack-lg"><a href="/blog" class="font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors flex items-center gap-2"><span class="material-symbols-outlined">arrow_back</span> Back to Blog</a></div> <article class="bg-surface-container-high p-stack-lg space-y-stack-lg">`);
		if (data.post.image_url) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="-m-stack-lg mb-0 relative aspect-video overflow-hidden"><img${attr("src", data.post.image_url)}${attr("alt", data.post.title)} class="w-full h-full object-cover"/> <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div> <div class="absolute bottom-4 left-4 font-label-caps text-[10px] bg-primary text-on-primary px-2 py-1">ARTICLE</div></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <header><div class="flex my-5 pb-2 items-center gap-stack-md font-label-caps text-label-caps text-on-surface-variant flex-wrap mb-stack-sm"><span class="w-1 h-1 rounded-full bg-primary flex-shrink-0"></span> <span>By ${escape_html(data.post.author || "V-League Staff")}</span> <span>${escape_html(formatDate(data.post.published_at))}</span></div> <h1 class="font-headline-lg text-headline-lg text-white uppercase italic">${escape_html(data.post.title)}</h1> `);
		if (data.post.excerpt) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="font-body-lg text-on-surface-variant mt-stack-md leading-relaxed">${escape_html(data.post.excerpt)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></header> <div class="md-content border-t border-white/5 pt-stack-lg svelte-1teoznn">${html(html$1())}</div></article></div></div>`);
	});
}
//#endregion
export { _page as default };
