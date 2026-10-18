import { fromTable, runSupabaseQuery } from '$lib/supabaseData';
import { error } from '@sveltejs/kit';

/**
 * Load a single blog post by slug.
 * @param {{ params: { slug: string } }} props
 */
export async function load({ params }) {
    const post = await runSupabaseQuery(
        fromTable('blogs').eq('slug', params.slug).single(),
        null,
        'Error fetching blog post'
    );

    if (!post) {
        throw error(404, 'Blog post not found.');
    }

    return { post };
}
