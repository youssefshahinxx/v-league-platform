import { n as runSupabaseQuery, t as fromTable } from "../../../../chunks/supabaseData.js";
import { error } from "@sveltejs/kit";
//#region src/routes/blog/[slug]/+page.js
/**
* Load a single blog post by slug.
* @param {{ params: { slug: string } }} props
*/
async function load({ params }) {
	const post = await runSupabaseQuery(fromTable("blogs").eq("slug", params.slug).single(), null, "Error fetching blog post");
	if (!post) throw error(404, "Blog post not found.");
	return { post };
}
//#endregion
export { load };
