<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '../../supabase';
	import { ensureProfileRecord } from '../../profile';
	import { getAuthModeCopy } from '../../utils/ui';

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
					? new URL('/profile/edit', window.location.origin).toString()
					: '/profile/edit';

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

				if (data.session) {
				// New users with an active session are sent straight to the profile editor.
				await goto('/profile/edit');
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
	<div class="mb-stack-lg text-center">
		<h1 class="font-headline-lg text-headline-lg text-white uppercase italic">
			{modeCopy.heading}
		</h1>
		<p class="font-body-md text-on-surface-variant mt-2">
			{modeCopy.description}
		</p>
	</div>

	<!-- Error Message Display -->
	{#if errorMessage}
		<div class="mb-stack-md p-stack-md bg-error/10 border border-error/20 rounded-md flex items-start gap-stack-sm" role="alert">
			<svg class="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			<span class="font-body-md text-error">
				{errorMessage}
			</span>
		</div>
	{/if}

	<!-- Form Application -->
	<form onsubmit={handleSubmit} class="space-y-stack-md">
		
		<!-- Email Input -->
		<div class="flex flex-col gap-stack-sm">
			<label for="email" class="font-label-caps text-label-caps text-on-surface-variant">
				Email Address
			</label>
			<input 
				id="email" 
				name="email" 
				type="email" 
				autocomplete="email" 
				required 
				bind:value={email}
				class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors"
				placeholder="athlete@example.com"
				disabled={isLoading}
			/>
		</div>

		<!-- Password Input -->
		<div class="flex flex-col gap-stack-sm">
			<label for="password" class="font-label-caps text-label-caps text-on-surface-variant">
				Password
			</label>
			<input 
				id="password" 
				name="password" 
				type="password" 
				autocomplete={currentMode === 'login' ? 'current-password' : 'new-password'} 
				required 
				bind:value={password}
				class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors"
				placeholder="••••••••"
				disabled={isLoading}
			/>
		</div>

		{#if currentMode === 'register'}
			<div class="flex flex-col gap-stack-sm">
				<label for="fullName" class="font-label-caps text-label-caps text-on-surface-variant">
					Full Name
				</label>
				<input
					id="fullName"
					name="fullName"
					type="text"
					autocomplete="name"
					required
					bind:value={fullName}
					class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors"
					placeholder="Alex Morgan"
					disabled={isLoading}
				/>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
				<div class="flex flex-col gap-stack-sm">
					<label for="nationality" class="font-label-caps text-label-caps text-on-surface-variant">
						Nationality
					</label>
					<input
						id="nationality"
						name="nationality"
						type="text"
						maxlength="3"
						bind:value={nationality}
						class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors uppercase"
						placeholder="EGY"
						disabled={isLoading}
					/>
				</div>

				<div class="flex flex-col gap-stack-sm">
					<label for="gender" class="font-label-caps text-label-caps text-on-surface-variant">
						Gender
					</label>
					<select
						id="gender"
						name="gender"
						bind:value={gender}
						class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md transition-colors"
						disabled={isLoading}
					>
						<option value="" class="bg-surface-container">Select Gender</option>
						<option value="Male" class="bg-surface-container">Male</option>
						<option value="Female" class="bg-surface-container">Female</option>
						<option value="Other" class="bg-surface-container">Other</option>
					</select>
				</div>
			</div>

			<div class="flex flex-col gap-stack-sm">
				<label for="dob" class="font-label-caps text-label-caps text-on-surface-variant">
					Date of Birth
				</label>
				<input
					id="dob"
					name="dob"
					type="date"
					bind:value={dob}
					class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md transition-colors"
					disabled={isLoading}
				/>
			</div>

			<div class="flex flex-col gap-stack-sm">
				<label for="club" class="font-label-caps text-label-caps text-on-surface-variant">
					Club
				</label>
				<input
					id="club"
					name="club"
					type="text"
					bind:value={club}
					class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors"
					placeholder="North Star FC"
					disabled={isLoading}
				/>
			</div>

			<div class="flex flex-col gap-stack-sm">
				<label for="bio" class="font-label-caps text-label-caps text-on-surface-variant">
					Bio
				</label>
				<textarea
					id="bio"
					name="bio"
					rows="3"
					bind:value={bio}
					class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors resize-none"
					placeholder="Tell the league a bit about your athletic journey."
					disabled={isLoading}
				></textarea>
			</div>
		{/if}

		<!-- Submit Action Button -->
		<button 
			type="submit" 
			disabled={isLoading}
			class="w-full min-h-[44px] mt-stack-sm inline-flex items-center justify-center px-4 py-stack-md text-on-primary bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out font-label-caps text-label-caps tracking-wide"
		>
			{#if isLoading}
				<!-- Loading Spinner Component (SVG inline) -->
				<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-on-primary" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
	<div class="mt-stack-lg text-center font-body-md text-on-surface-variant">
		{modeCopy.togglePrompt}
		<button 
			type="button" 
			onclick={toggleMode}
			class="font-medium text-primary hover:underline rounded-sm ml-1 cursor-pointer"
		>
			{modeCopy.toggleActionLabel}
		</button>
	</div>
</div>