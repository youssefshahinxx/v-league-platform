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

<!-- Centered Auth Layout Container -->
<div class="min-h-screen w-full flex flex-col items-center justify-center bg-background px-margin-mobile py-margin-desktop">

	<!-- Brand Header -->
	<div class="mb-stack-lg text-center flex flex-col items-center">
		<a
			href="/"
			class="font-headline-lg text-headline-lg text-white uppercase italic rounded-md p-1 mb-stack-sm hover:text-primary transition-colors"
		>
			V-LEAGUE
		</a>
		<div class="h-1 w-16 bg-primary"></div>
	</div>

	{#if isCheckingSession}
		<div class="w-full max-w-md bg-surface-container-high border border-white/5 p-stack-lg text-center font-body-md text-on-surface-variant">
			Checking your session...
		</div>
	{:else}
		<!-- Auth Form Card Container -->
		<div class="w-full max-w-md bg-surface-container-high border border-white/5 p-stack-lg sm:p-stack-lg relative overflow-hidden">
			<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary-fixed to-primary"></div>
			<!-- We pass the URL-derived mode into the smart form component -->
			<AuthForm {initialMode} />
		</div>
	{/if}

</div>