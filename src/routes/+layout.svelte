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

  let scrolled = $state(false);
  let progress = $state(0);

  // function handleScroll() {
  //   scrolled = window.scrollY > 400;
  //   const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  //   progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  //   const el = document.getElementById('scroll-progress');
  //   if (el) el.style.width = progress + '%';
  // }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<div class="flex flex-col min-h-screen bg-zinc-50 text-zinc-900">
  <div class="scroll-progress" id="scroll-progress"></div>
  <Navbar {isLoggedIn} />
  <main class="grow">
    {@render children?.()}
  </main>
  <Footer />
  {#if scrolled}
    <button class="back-to-top" onclick={scrollToTop} aria-label="Back to top">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  {/if}
</div>

<!-- <svelte:window on:scroll={handleScroll} /> -->