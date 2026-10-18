/**
 * Run a Supabase query and return either the payload or a safe fallback value.
 * This keeps route loaders short and centralizes the repetitive error-handling pattern.
 *
 * @param {any} query
 * @param {any} fallback
 * @param {string} [context]
 * @returns {Promise<any>}
 */
export function runSupabaseQuery(query: any, fallback?: any, context?: string): Promise<any>;
/**
 * Build a new Supabase query against a table using a shared client instance.
 * This is a convenience wrapper for route loaders that want a small, readable query entry point.
 *
 * @param {string} table
 * @param {string} [selectClause='*']
 * @returns {any}
 */
export function fromTable(table: string, selectClause?: string): any;
