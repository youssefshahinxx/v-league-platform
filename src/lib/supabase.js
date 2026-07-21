import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Normalize the project URL so both the bare host and a REST-style value work reliably.
const normalizedSupabaseUrl = PUBLIC_SUPABASE_URL.replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '');

// Initialize a single, robust client instance for frontend operations
export const supabase = createClient(normalizedSupabaseUrl, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true, // Auto-saves login tokens to browser localStorage
        autoRefreshToken: true // Silently keeps user sessions alive in the background
    }
});