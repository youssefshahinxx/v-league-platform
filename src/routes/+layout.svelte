<script>
    import '../app.css';
    import { onMount } from 'svelte';
    import { invalidateAll } from '$app/navigation';
    import { supabase } from '$lib/supabase';
    import Navbar from '$lib/components/layout/Navbar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';

    export let data;

    onMount(() => {
        // Listen closely for auth state modifications (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.access_token !== data.session?.access_token) {
                // Force SvelteKit to re-run all active load functions if the token changes
                invalidateAll();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    });
</script>

<div class="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-white">
    <!-- Clean, static global navigation wrapper -->
    <Navbar session={data.session} />

    <!-- Core page viewport container -->
    <main class="flex-grow">
        <slot />
    </main>

    <!-- Global baseline footer structural links -->
    <Footer />
</div>