<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase';
	import AuthForm from '$lib/sections/shared/AuthForm.svelte';

	// Svelte 5 derived rune to reactively check the URL for the mode parameter
	let initialMode = $derived($page.url.searchParams.get('mode') === 'register' ? 'register' : 'login');
	let isCheckingSession = $state(true);

	onMount(() => {
		let isSubscribed = true;

		async function checkSession() {
			const { data: { session } } = await supabase.auth.getSession();

			if (!isSubscribed) {
				return;
			}

			if (session?.access_token) {
				await goto('/profile/edit');
				return;
			}

			isCheckingSession = false;
		}

		checkSession();

		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
			if (!isSubscribed) {
				return;
			}

			if (nextSession?.access_token) {
				goto('/profile/edit');
			}
		});

		return () => {
			isSubscribed = false;
			subscription.unsubscribe();
		};
	});
</script>

<!-- Minimalist Centered Layout Container -->
<div class="min-h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] px-4 py-12 sm:px-6 lg:px-8">
	
	<!-- Brand Header -->
	<div class="mb-8 text-center flex flex-col items-center">
		<a 
			href="/" 
			class="text-2xl font-black tracking-tight text-[#09090b] rounded-md p-1 mb-2 hover:text-[#fb310f] transition-colors"
		>
			V-LEAGUE
		</a>
	</div>

	{#if isCheckingSession}
		<div class="w-full max-w-md rounded-xl border border-[#e4e4e7] bg-[#ffffff] p-6 text-center text-sm text-[#71717a] shadow-md">
			Checking your session...
		</div>
	{:else}
		<!-- Auth Form Card Container -->
		<div class="w-full max-w-md bg-[#ffffff] border border-[#e4e4e7] rounded-xl shadow-md p-6 sm:p-8 hover:border-[#fb310f]/30 transition-colors">
			<!-- We pass the URL-derived mode into the smart form component -->
			<AuthForm {initialMode} />
		</div>
	{/if}

</div>