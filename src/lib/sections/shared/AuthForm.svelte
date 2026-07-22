<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { ensureProfileRecord } from '$lib/profile';
	import { getAuthModeCopy } from '$lib/utils/ui';

	// Props
	let { initialMode = 'login' } = $props();

	// Local State Runes
	let email = $state('');
	let password = $state('');
	let fullName = $state('');
	let nationality = $state('');
	let gender = $state('');
	let dob = $state('');
	let club = $state('');
	let bio = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let currentMode = $state('login' as 'login' | 'register');
	let modeCopy = $derived(getAuthModeCopy(currentMode));

	$effect(() => {
		currentMode = initialMode === 'register' ? 'register' : 'login';
	});

	// Toggle handler for the bottom link
	function toggleMode() {
		currentMode = currentMode === 'login' ? 'register' : 'login';
		errorMessage = '';
	}

	function buildProfilePayload() {
		return {
			full_name: fullName.trim() || 'Anonymous Athlete',
			nationality: nationality.trim() || null,
			gender: gender.trim() || null,
			dob: dob.trim() || null,
			club: club.trim() || null,
			bio: bio.trim() || null,
			achievements: []
		};
	}

	// Main authentication handler
	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading = true;
		errorMessage = '';

		try {
			if (currentMode === 'register') {
				// Sign-up flow: use a fully qualified redirect URL so Supabase can resolve it reliably.
				const redirectTo = typeof window !== 'undefined'
<<<<<<< Updated upstream
					? new URL('/profile/edit?onboarding=true', window.location.origin).toString()
					: '/profile/edit?onboarding=true';
=======
					? new URL('/profile/edit', window.location.origin).toString()
					: '/profile/edit';
>>>>>>> Stashed changes

				const profileValues = buildProfilePayload();
				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: redirectTo,
						data: profileValues
					}
				});

				if (error) throw error;

				if (data.user?.id) {
					const { error: profileError } = await ensureProfileRecord(data.user.id, profileValues);
					if (profileError) throw profileError;
				}

				if (data.session) {
<<<<<<< Updated upstream
					// New users with an active session can be sent straight to the profile editor.
					await goto('/profile/edit?onboarding=true');
=======
					// New users with an active session are sent straight to the profile editor.
					await goto('/profile/edit');
>>>>>>> Stashed changes
				} else {
					// Some Supabase setups require email confirmation before the session is available.
					errorMessage = 'Please check your inbox and confirm your email before signing in.';
				}
				
			} else {
				// Login Flow
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password
				});

				if (error) throw error;

				// Standard Login Pivot
				await goto('/profile/edit');
			}
		} catch (error: any) {
			errorMessage = error?.message || 'An error occurred during authentication.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex flex-col w-full">
	
	<!-- Dynamic Header -->
	<div class="mb-6 text-center">
		<h1 class="text-xl font-bold tracking-tight text-[#09090b]">
			{modeCopy.heading}
		</h1>
		<p class="text-sm font-normal text-[#71717a] mt-2">
			{modeCopy.description}
		</p>
	</div>

	<!-- Error Message Display -->
	{#if errorMessage}
		<div class="mb-4 p-3 bg-[#fef2f2] border border-[#dc2626]/20 rounded-md flex items-start gap-2" role="alert">
			<svg class="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			<span class="text-sm font-medium text-[#dc2626]">
				{errorMessage}
			</span>
		</div>
	{/if}

	<!-- Form Application -->
	<form onsubmit={handleSubmit} class="space-y-4">
		
		<!-- Email Input -->
		<div class="space-y-1">
			<label for="email" class="block text-sm font-medium text-[#09090b]">
				Email Address
			</label>
			<input 
				id="email" 
				name="email" 
				type="email" 
				autocomplete="email" 
				required 
				bind:value={email}
				class="w-full h-10 px-3 text-sm text-[#09090b] bg-[#ffffff] border border-[#e4e4e7] rounded-md focus:ring-2 focus:ring-[#09090b] focus:border-[#09090b] focus:outline-none transition-all duration-200 ease-in-out placeholder:text-[#71717a]"
				placeholder="athlete@example.com"
				disabled={isLoading}
			/>
		</div>

		<!-- Password Input -->
		<div class="space-y-1">
			<label for="password" class="block text-sm font-medium text-[#09090b]">
				Password
			</label>
			<input 
				id="password" 
				name="password" 
				type="password" 
				autocomplete={currentMode === 'login' ? 'current-password' : 'new-password'} 
				required 
				bind:value={password}
				class="w-full h-10 px-3 text-sm text-[#09090b] bg-[#ffffff] border border-[#e4e4e7] rounded-md focus:ring-2 focus:ring-[#09090b] focus:border-[#09090b] focus:outline-none transition-all duration-200 ease-in-out placeholder:text-[#71717a]"
				placeholder="••••••••"
				disabled={isLoading}
			/>
		</div>

		{#if currentMode === 'register'}
			<div class="space-y-1">
				<label for="fullName" class="block text-sm font-medium text-[#09090b]">
					Full Name
				</label>
				<input
					id="fullName"
					name="fullName"
					type="text"
					autocomplete="name"
					required
					bind:value={fullName}
					class="w-full h-10 px-3 text-sm text-[#09090b] bg-[#ffffff] border border-[#e4e4e7] rounded-md focus:ring-2 focus:ring-[#09090b] focus:border-[#09090b] focus:outline-none transition-all duration-200 ease-in-out placeholder:text-[#71717a]"
					placeholder="Alex Morgan"
					disabled={isLoading}
				/>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="space-y-1">
					<label for="nationality" class="block text-sm font-medium text-[#09090b]">
						Nationality
					</label>
					<input
						id="nationality"
						name="nationality"
						type="text"
						maxlength="3"
						bind:value={nationality}
						class="w-full h-10 px-3 text-sm text-[#09090b] bg-[#ffffff] border border-[#e4e4e7] rounded-md focus:ring-2 focus:ring-[#09090b] focus:border-[#09090b] focus:outline-none transition-all duration-200 ease-in-out placeholder:text-[#71717a] uppercase"
						placeholder="EGY"
						disabled={isLoading}
					/>
				</div>

				<div class="space-y-1">
					<label for="gender" class="block text-sm font-medium text-[#09090b]">
						Gender
					</label>
					<select
						id="gender"
						name="gender"
						bind:value={gender}
						class="w-full h-10 px-3 text-sm text-[#09090b] bg-[#ffffff] border border-[#e4e4e7] rounded-md focus:ring-2 focus:ring-[#09090b] focus:border-[#09090b] focus:outline-none transition-all duration-200 ease-in-out"
						disabled={isLoading}
					>
						<option value="">Select Gender</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Other">Other</option>
					</select>
				</div>
			</div>

			<div class="space-y-1">
				<label for="dob" class="block text-sm font-medium text-[#09090b]">
					Date of Birth
				</label>
				<input
					id="dob"
					name="dob"
					type="date"
					bind:value={dob}
					class="w-full h-10 px-3 text-sm text-[#09090b] bg-[#ffffff] border border-[#e4e4e7] rounded-md focus:ring-2 focus:ring-[#09090b] focus:border-[#09090b] focus:outline-none transition-all duration-200 ease-in-out"
					disabled={isLoading}
				/>
			</div>

			<div class="space-y-1">
				<label for="club" class="block text-sm font-medium text-[#09090b]">
					Club
				</label>
				<input
					id="club"
					name="club"
					type="text"
					bind:value={club}
					class="w-full h-10 px-3 text-sm text-[#09090b] bg-[#ffffff] border border-[#e4e4e7] rounded-md focus:ring-2 focus:ring-[#09090b] focus:border-[#09090b] focus:outline-none transition-all duration-200 ease-in-out placeholder:text-[#71717a]"
					placeholder="North Star FC"
					disabled={isLoading}
				/>
			</div>

			<div class="space-y-1">
				<label for="bio" class="block text-sm font-medium text-[#09090b]">
					Bio
				</label>
				<textarea
					id="bio"
					name="bio"
					rows="3"
					bind:value={bio}
					class="w-full px-3 py-2 text-sm text-[#09090b] bg-[#ffffff] border border-[#e4e4e7] rounded-md focus:ring-2 focus:ring-[#09090b] focus:border-[#09090b] focus:outline-none transition-all duration-200 ease-in-out placeholder:text-[#71717a]"
					placeholder="Tell the league a bit about your athletic journey."
					disabled={isLoading}
				></textarea>
			</div>
		{/if}

		<!-- Submit Action Button -->
		<button 
			type="submit" 
			disabled={isLoading}
			class="w-full min-h-[44px] mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#fafafa] bg-[#09090b] rounded-md hover:bg-[#27272a] focus:ring-2 focus:ring-[#09090b] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
		>
			{#if isLoading}
				<!-- Loading Spinner Component (SVG inline) -->
				<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-[#fafafa]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				Processing...
			{:else}
				{modeCopy.submitLabel}
			{/if}
		</button>
	</form>

	<!-- Mode Toggle Area -->
	<div class="mt-6 text-center text-sm text-[#71717a]">
		{#if currentMode === 'login'}
			{modeCopy.togglePrompt}
			<button 
				type="button" 
				onclick={toggleMode}
				class="font-medium text-[#09090b] hover:underline focus:outline-none focus:ring-2 focus:ring-[#09090b] rounded-sm ml-1"
			>
				{modeCopy.toggleActionLabel}
			</button>
		{:else}
			{modeCopy.togglePrompt}
			<button 
				type="button" 
				onclick={toggleMode}
				class="font-medium text-[#09090b] hover:underline focus:outline-none focus:ring-2 focus:ring-[#09090b] rounded-sm ml-1"
			>
				{modeCopy.toggleActionLabel}
			</button>
		{/if}
	</div>
</div>