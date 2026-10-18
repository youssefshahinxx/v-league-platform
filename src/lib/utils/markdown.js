import { marked } from 'marked';

marked.setOptions({
    gfm: true,
    breaks: true
});

/**
 * Render a Markdown string into sanitized-by-pipeline HTML for direct injection.
 * @param {string | null | undefined} content
 * @returns {string}
 */
export function renderMarkdown(content) {
    if (!content) return '';
    return String(marked.parse(content));
}