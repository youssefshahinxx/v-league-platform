<script lang="ts">
	import { handleLogout } from "$lib/auth.js";
	let { isLoggedIn = false } = $props();
	let isMobileMenuOpen = $state(false);

	const navLinks = [
		{ label: "Ranking", href: "/ranking" },
		{ label: "Events", href: "/competitions" },
		{ label: "Athletes", href: "/athletes" },
		{ label: "News", href: "/blog" },
		{ label: "Contact", href: "/contact" },
	];

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<header class="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-2xl border-b border-white/5">
	<div class="h-20 w-full px-margin-mobile lg:px-margin-desktop flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href='/' >
				<img
				src="/assets/Adobe Express - file (1).png"
				alt="Athletics League Logo"
				class="h-full w-50 object-contain"
				/>
			</a>
			<!-- <a href="/" class="font-headline-md text-headline-md text-primary tracking-wider uppercase hidden sm:block">
				Athletics League
			</a> -->
		</div>
		<nav class="hidden lg:flex items-center gap-stack-lg">
			{#each navLinks as link}
				<a
					href={link.href}
					class="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-all"
				>
					{link.label}
				</a>
			{/each}
		</nav>
		<div class="flex items-center gap-stack-md">
			
			{#if !isLoggedIn}
				<a href="/auth" class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
					<span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
				</a>
			{:else}
				<a href="/profile/edit" class="w-8 h-8 rounded-full flex items-center justify-center">
					<span class="material-symbols-outlined text-on-primary text-40">person</span>
				</a>
				<button onclick={handleLogout} class="text-md font-bold text-primary hover:text-on-surface transition-colors cursor-pointer">
					Logout
				</button>
			{/if}
			<button onclick={toggleMobileMenu} class="lg:hidden p-unit cursor-pointer">
				<span class="material-symbols-outlined text-on-surface">
					{isMobileMenuOpen ? 'close' : 'menu'}
				</span>
			</button>
		</div>
	</div>
	{#if isMobileMenuOpen}
		<div class="lg:hidden border-t border-white/5 bg-surface">
			<div class="px-margin-mobile py-stack-md space-y-stack-sm">
				{#each navLinks as link}
					<a
						href={link.href}
						class="block py-stack-sm font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-all"
						onclick={() => isMobileMenuOpen = false}
					>
						{link.label}
					</a>
				{/each}
				<div class="border-t border-white/5 pt-stack-md mt-stack-md">
					{#if !isLoggedIn}
						<a href="/auth" class="block py-stack-sm font-label-caps text-label-caps text-primary" onclick={() => isMobileMenuOpen = false}>Sign In</a>
						<a href="/auth?mode=register" class="block py-stack-sm font-label-caps text-label-caps text-primary" onclick={() => isMobileMenuOpen = false}>Sign Up</a>
					{:else}
						<button onclick={handleLogout} class="block py-stack-sm font-label-caps text-label-caps text-error cursor-pointer">Sign Out</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</header>
