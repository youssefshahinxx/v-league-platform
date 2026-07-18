import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Initialize a single, robust client instance for frontend operations
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true, // Auto-saves login tokens to browser localStorage
        autoRefreshToken: true // Silently keeps user sessions alive in the background
    }
});