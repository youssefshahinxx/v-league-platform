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

<div class="flex flex-col min-h-screen bg-zinc-50 text-zinc-900">
  <Navbar {isLoggedIn} />
  <main class="grow">
    {@render children?.()}
  </main>
  <Footer />
</div>