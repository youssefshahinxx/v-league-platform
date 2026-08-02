<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';

  let { data, children } = $props();
  let isLoggedIn = $derived(Boolean(data?.session));

  onMount(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== data.session?.access_token) {
        invalidateAll();
      }
    });

    return () => subscription.unsubscribe();
  });
</script>

<div class="min-h-screen bg-background text-on-surface font-body-md">
  <Navbar {isLoggedIn} />
  <main class="w-full pt-16 min-h-screen">
    {@render children?.()}
  </main>
  <Footer />
</div>
