import { fromTable, runSupabaseQuery } from '$lib/supabaseData';

/**
 * Load all blog posts ordered by publish date.
 * @returns {Promise<{ blogs: any[] }>}
 */
export async function load() {
    const blogs = await runSupabaseQuery(
        fromTable('blogs').order('published_at', { ascending: false }),
        [],
        'Error fetching blog posts'
    );

    return {
        blogs: blogs ?? []
    };
}
