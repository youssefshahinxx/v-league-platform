<script>
    import { supabase } from '$lib/supabase';

    // Svelte 5 Runes: Destructure loaded database profile data cleanly
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    // Initialize state with robust string fallbacks to satisfy the compiler
    let fullName = $state('');
    let nationality = $state('');
    let gender = $state('');
    let dob = $state('');
    let club = $state('');
    let bio = $state('');

    // System Feedback Statuses
    let isSaving = $state(false);
    let message = $state('');

    $effect(() => {
        const profile = data.profile;
        fullName = profile?.full_name ?? '';
        nationality = profile?.nationality ?? '';
        gender = profile?.gender ?? '';
        dob = profile?.dob ?? '';
        club = profile?.club ?? '';
        bio = profile?.bio ?? '';
    });

    /** @param {Event} e */
    async function updateProfile(e) {
        e.preventDefault();
        isSaving = true;
        message = '';

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            message = 'You must be signed in to update your profile.';
            isSaving = false;
            return;
        }
        
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                nationality: nationality.toUpperCase(),
                gender,
                dob: dob || null, // Ensure empty date picks submit safely as null
                club,
                bio
            })
            .eq('id', session.user.id);

        isSaving = false;
        if (!error) {
            message = 'Profile successfully updated.';
        } else {
            message = 'Error updating profile data.';
        }
    }
</script>

<div class="max-w-4xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Left Column: Context & Read-Only System Achievements -->
    <div class="md:col-span-1 space-y-6">
        <div>
            <h1 class="text-2xl font-bold tracking-tight text-zinc-900">Account Settings</h1>
            <p class="text-sm text-zinc-500 mt-1">Manage your public athletic directory presence.</p>
        </div>

        <div class="bg-zinc-100 border border-zinc-200 p-4 rounded-lg">            <h3 class="text-xs font-semibold text-zinc-400 tracking-wider uppercase mb-3">Verified League Achievements</h3>
            {#if data.profile?.achievements && data.profile.achievements.length > 0}
                <div class="flex flex-wrap gap-2">
                    {#each data.profile.achievements as achievement}
                        <span class="text-xs bg-zinc-900 text-white px-2.5 py-1 rounded font-medium">
                            {achievement}
                        </span>
                    {/each}
                </div>
            {:else}
                <p class="text-xs text-zinc-500 italic">No official tournament achievements recorded yet.</p>
            {/if}
        </div>
    </div>

    <!-- Right Column: Minimalist Update Form -->
    <form onsubmit={updateProfile} class="md:col-span-2 space-y-6 bg-white p-6 border border-zinc-200 rounded-lg">
        {#if message}
            <div class="p-3 text-sm rounded bg-zinc-900 text-white font-medium">
                {message}
            </div>
        {/if}

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
                <label for="fullName" class="text-xs font-medium text-zinc-500">Full Name</label>
                <input id="fullName" type="text" bind:value={fullName} required class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-zinc-900" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label for="club" class="text-xs font-medium text-zinc-500">Club Affiliation (Optional)</label>
                <input id="club" type="text" bind:value={club} class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-zinc-900" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label for="nationality" class="text-xs font-medium text-zinc-500">Nationality (3-Letter Country Code)</label>
                <input id="nationality" type="text" maxlength="3" placeholder="E.g. EGY, USA" bind:value={nationality} class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-zinc-900 uppercase" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label for="dob" class="text-xs font-medium text-zinc-500">Date of Birth</label>
                <input id="dob" type="date" bind:value={dob} class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-zinc-900" />
            </div>

            <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label for="gender" class="text-xs font-medium text-zinc-500">Gender Identity</label>
                <select id="gender" bind:value={gender} class="px-3 py-2 border border-zinc-200 bg-white rounded-md text-sm focus:outline-none focus:border-zinc-900">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label for="bio" class="text-xs font-medium text-zinc-500">Athlete Biography</label>
                <textarea id="bio" rows="4" bind:value={bio} placeholder="Briefly introduce your athletic background..." class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-zinc-900 resize-none"></textarea>
            </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-zinc-100">
            <button type="submit" disabled={isSaving} class="px-5 py-2 bg-zinc-900 text-white rounded-md text-sm font-medium hover:bg-zinc-800 disabled:bg-zinc-400 transition">
                {isSaving ? 'Saving Changes...' : 'Save Profile'}
            </button>
        </div>
    </form>
</div>