<script lang="ts">
	// Props using Svelte 5 runes with default values
	let { isLoggedIn = false } = $props();

	// Local state management for the responsive mobile menu
	let isMobileMenuOpen = $state(false);

	// Navigation links matrix for single-source maintenance
	const navLinks = [
		{ label: 'Rankings', href: '/ranking' },
		{ label: 'Events', href: '/competitions' },
		{ label: 'Athletes', href: '/athletes' }
	];

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<!-- Outer Container matching max content width from style.md -->
<header class="w-full border-b border-[#e4e4e7] bg-[#fafafa] shadow-sm sticky top-0 z-50 transition-all duration-200 ease-in-out">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
		
		<!-- BRAND LOGO -->
		<div class="flex-shrink-0">
			<a 
				href="/" 
				class="text-xl font-bold tracking-tight text-[#09090b] focus:ring-2 focus:ring-[#09090b] focus:outline-none rounded-md p-1"
			>
				BRAND
			</a>
		</div>

		<!-- DESKTOP NAVIGATION LINKS -->
		<nav class="hidden md:flex space-x-8" aria-label="Main Navigation">
			{#each navLinks as link}
				<a 
					href={link.href} 
					class="text-sm font-medium text-[#71717a] hover:text-[#09090b] focus:ring-2 focus:ring-[#09090b] focus:outline-none rounded-md transition-all duration-200 ease-in-out"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- DESKTOP AUTH ACTION STATES -->
		<div class="hidden md:flex items-center gap-4">
			{#if !isLoggedIn}
				<!-- Logged Out Actions -->
				<a 
					href="/auth" 
					class="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#27272a] bg-transparent border border-[#e4e4e7] rounded-md hover:bg-[#e4e4e7] focus:ring-2 focus:ring-[#09090b] focus:outline-none transition-all duration-200 ease-in-out"
				>
					Sign In
				</a>
				<a 
					href="/auth?mode=register" 
					class="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#fafafa] bg-[#09090b] rounded-md hover:bg-[#27272a] focus:ring-2 focus:ring-[#09090b] focus:outline-none transition-all duration-200 ease-in-out"
				>
					Sign Up
				</a>
			{:else}
				<!-- Logged In Actions -->
				<a 
					href="/profile/edit" 
					class="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#71717a] hover:text-[#09090b] focus:ring-2 focus:ring-[#09090b] focus:outline-none rounded-md transition-all duration-200 ease-in-out"
				>
					Profile
				</a>
				<form action="/auth/logout" method="POST" class="inline-block">
					<button 
						type="submit" 
						class="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#dc2626] bg-[#fef2f2] border border-[#dc2626]/20 rounded-md hover:bg-[#fef2f2]/80 focus:ring-2 focus:ring-[#dc2626] focus:outline-none transition-all duration-200 ease-in-out cursor-pointer"
					>
						Sign Out
					</button>
				</form>
			{/if}
		</div>

		<!-- MOBILE MENU BUTTON (Strict Accessibility Compliance) -->
		<div class="flex items-center md:hidden">
			<button
				type="button"
				onclick={toggleMobileMenu}
				class="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-md text-[#71717a] hover:text-[#09090b] hover:bg-[#e4e4e7] focus:ring-2 focus:ring-[#09090b] focus:outline-none transition-all duration-200 ease-in-out"
				aria-controls="mobile-menu"
				aria-expanded={isMobileMenuOpen}
				aria-label="Toggle main navigation menu"
			>
				{#if !isMobileMenuOpen}
					<!-- Hamburger Icon -->
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				{:else}
					<!-- Close X Icon -->
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- MOBILE DROPDOWN NAVIGATION MENU -->
	{#if isMobileMenuOpen}
		<div class="md:hidden border-t border-[#e4e4e7] bg-[#fafafa]" id="mobile-menu">
			<div class="space-y-1 px-4 pt-2 pb-3">
				{#each navLinks as link}
					<a 
						href={link.href} 
						class="block min-h-[44px] px-3 py-2 rounded-md text-base font-medium text-[#71717a] hover:text-[#09090b] hover:bg-[#e4e4e7] focus:ring-2 focus:ring-[#09090b] focus:outline-none transition-all duration-200 ease-in-out"
					>
						{link.label}
					</a>
				{/each}
			</div>
			
			<!-- Mobile Auth Segment Delineator -->
			<div class="border-t border-[#e4e4e7] pt-4 pb-4 px-4">
				{#if !isLoggedIn}
					<div class="flex flex-col gap-2">
						<a 
							href="/auth" 
							class="w-full min-h-[44px] inline-flex items-center justify-center px-4 py-2 text-base font-medium text-[#27272a] bg-transparent border border-[#e4e4e7] rounded-md hover:bg-[#e4e4e7] focus:ring-2 focus:ring-[#09090b] focus:outline-none transition-all duration-200 ease-in-out"
						>
							Sign In
						</a>
						<a 
							href="/auth?mode=register" 
							class="w-full min-h-[44px] inline-flex items-center justify-center px-4 py-2 text-base font-medium text-[#fafafa] bg-[#09090b] rounded-md hover:bg-[#27272a] focus:ring-2 focus:ring-[#09090b] focus:outline-none transition-all duration-200 ease-in-out"
						>
							Sign Up
						</a>
					</div>
				{:else}
					<div class="flex flex-col gap-2">
						<a 
							href="/profile/edit" 
							class="w-full min-h-[44px] inline-flex items-center justify-center px-4 py-2 text-base font-medium text-[#71717a] hover:text-[#09090b] hover:bg-[#e4e4e7] focus:ring-2 focus:ring-[#09090b] focus:outline-none transition-all duration-200 ease-in-out"
						>
							Profile
						</a>
						<form action="/auth/logout" method="POST" class="w-full">
							<button 
								type="submit" 
								class="w-full min-h-[44px] inline-flex items-center justify-center px-4 py-2 text-base font-medium text-[#dc2626] bg-[#fef2f2] border border-[#dc2626]/20 rounded-md hover:bg-[#fef2f2]/80 focus:ring-2 focus:ring-[#dc2626] focus:outline-none transition-all duration-200 ease-in-out cursor-pointer"
							>
								Sign Out
							</button>
						</form>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</header>