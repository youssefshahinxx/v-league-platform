import { n as runSupabaseQuery, t as fromTable } from "../../../chunks/supabaseData.js";
//#region src/routes/blog/+page.js
/**
* Load all blog posts ordered by publish date.
* @returns {Promise<{ blogs: any[] }>}
*/
async function load() {
	return { blogs: await runSupabaseQuery(fromTable("blogs").order("published_at", { ascending: false }), [], "Error fetching blog posts") ?? [] };
}
//#endregion
export { load };
