<script>
    import { handleLogout } from '$lib/auth';
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
    let avatarUrl = $state('');
    /** @type {File | null} */
    let selectedFile = $state(null);

    // Social links
    let facebookUrl = $state('');
    let tiktokUrl = $state('');
    let instagramUrl = $state('');

    // Certificates
    /** @type {Array<{name: string, url: string, type: string}>} */
    let certificates = $state([]);

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
        avatarUrl = profile?.avatar_url ?? '';
        facebookUrl = profile?.facebook_url ?? '';
        tiktokUrl = profile?.tiktok_url ?? '';
        instagramUrl = profile?.instagram_url ?? '';
        certificates = profile?.certificates ?? [];
    });

    /** @param {Event} e */
    function handleFileSelect(e) {
        const input = /** @type {HTMLInputElement} */ (e.target);
        if (input.files && input.files.length > 0) {
            selectedFile = input.files[0];
            avatarUrl = URL.createObjectURL(input.files[0]);
        }
    }

    /** @param {Event} e */
    async function handleCertFilesSelect(e) {
        const input = /** @type {HTMLInputElement} */ (e.target);
        if (!input.files || input.files.length === 0) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        for (const file of input.files) {
            const ext = file.name.split('.').pop();
            const filePath = `${session.user.id}/certs/${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('profile-certificates')
                .upload(filePath, file);

            if (uploadError) continue;

            const { data: urlData } = supabase.storage
                .from('profile-certificates')
                .getPublicUrl(filePath);

            const type = /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name) ? 'image' : 'pdf';

            certificates = [...certificates, {
                name: file.name,
                url: urlData?.publicUrl || '',
                type
            }];
        }

        input.value = '';
    }

    /** @param {number} index */
    async function removeCert(index) {
        const cert = certificates[index];
        if (!cert) return;

        // Extract path from URL to delete from storage
        const pathMatch = cert.url.match(/\/profile-certificates\/(.+)$/);
        if (pathMatch) {
            await supabase.storage
                .from('profile-certificates')
                .remove([pathMatch[1]]);
        }

        certificates = certificates.filter((_, i) => i !== index);
    }

    /**
     * @param {{ user: { id: string } }} session
     */
    async function uploadAvatar(session) {
        if (!selectedFile) return null;
        const ext = selectedFile.name.split('.').pop();
        const filePath = `${session.user.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, selectedFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
        return publicUrlData?.publicUrl || null;
    }

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

        try {
            let newAvatarUrl = avatarUrl;
            if (selectedFile) {
                newAvatarUrl = await uploadAvatar(session) || avatarUrl;
                selectedFile = null;
            }

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    nationality: nationality.toUpperCase(),
                    gender,
                    dob: dob || null,
                    club,
                    bio,
                    avatar_url: newAvatarUrl,
                    facebook_url: facebookUrl || null,
                    tiktok_url: tiktokUrl || null,
                    instagram_url: instagramUrl || null,
                    certificates
                })
                .eq('id', session.user.id);

            if (error) throw error;
            message = 'Profile successfully updated.';
        } catch (err) {
            message = /** @type {Error} */ (err)?.message || 'Error updating profile data.';
        } finally {
            isSaving = false;
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

        <div class="bg-white border border-zinc-200 p-4 rounded-lg">
            <h3 class="text-xs font-semibold text-zinc-400 tracking-wider uppercase mb-3">Performance Stats</h3>
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-zinc-600">Total Points</span>
                    <span class="text-sm font-bold text-zinc-900">{data.stats?.total_points ?? 0}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-zinc-600">Events Competed</span>
                    <span class="text-sm font-bold text-zinc-900">{data.stats?.events_tracked ?? 0}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-sm text-zinc-600">Global Rank</span>
                    <span class="text-sm font-bold text-zinc-900">
                        {data.stats?.rank ? '#' + data.stats.rank : 'Unranked'}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- Right Column: Minimalist Update Form -->
    <form onsubmit={updateProfile} class="md:col-span-2 space-y-6 bg-white p-6 border border-zinc-200 rounded-lg">
        {#if message}
            <div class="p-3 text-sm rounded bg-zinc-900 text-white font-medium">
                {message}
            </div>
        {/if}

        <!-- Avatar Upload -->
        <div class="flex items-center gap-4 pb-4 border-b border-zinc-100">
            <div class="w-16 h-16 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 flex-shrink-0">
                {#if avatarUrl}
                    <img src={avatarUrl} alt="Profile avatar" class="w-full h-full object-cover" />
                {:else}
                    <div class="w-full h-full flex items-center justify-center text-zinc-400">
                        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>
                {/if}
            </div>
            <label class="cursor-pointer">
                <span class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[#fb310f] bg-white border border-[#fb310f]/20 rounded-md hover:bg-[#fef2f2] transition-colors">
                    Change Photo
                </span>
                <input type="file" accept="image/*" class="hidden" onchange={handleFileSelect} />
            </label>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
                <label for="fullName" class="text-xs font-medium text-zinc-500">Full Name</label>
                <input id="fullName" type="text" bind:value={fullName} required class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label for="club" class="text-xs font-medium text-zinc-500">Club Affiliation (Optional)</label>
                <input id="club" type="text" bind:value={club} class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label for="nationality" class="text-xs font-medium text-zinc-500">Nationality (3-Letter Country Code)</label>
                <input id="nationality" type="text" maxlength="3" placeholder="E.g. EGY, USA" bind:value={nationality} class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors uppercase" />
            </div>

            <div class="flex flex-col gap-1.5">
                <label for="dob" class="text-xs font-medium text-zinc-500">Date of Birth</label>
                <input id="dob" type="date" bind:value={dob} class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors" />
            </div>

            <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label for="gender" class="text-xs font-medium text-zinc-500">Gender Identity</label>
                <select id="gender" bind:value={gender} class="px-3 py-2 border border-zinc-200 bg-white rounded-md text-sm focus:border-[#fb310f] transition-colors">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label for="bio" class="text-xs font-medium text-zinc-500">Athlete Biography</label>
                <textarea id="bio" rows="4" bind:value={bio} placeholder="Briefly introduce your athletic background..." class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors resize-none"></textarea>
            </div>
        </div>

        <!-- Social Links -->
        <div class="border-t border-zinc-100 pt-6">
            <h3 class="text-xs font-semibold text-zinc-400 tracking-wider uppercase mb-4">Social Links</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                    <label for="facebookUrl" class="text-xs font-medium text-zinc-500">Facebook URL</label>
                    <input id="facebookUrl" type="url" placeholder="https://facebook.com/..." bind:value={facebookUrl} class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors" />
                </div>
                <div class="flex flex-col gap-1.5">
                    <label for="tiktokUrl" class="text-xs font-medium text-zinc-500">TikTok URL</label>
                    <input id="tiktokUrl" type="url" placeholder="https://tiktok.com/..." bind:value={tiktokUrl} class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors" />
                </div>
                <div class="flex flex-col gap-1.5 sm:col-span-2">
                    <label for="instagramUrl" class="text-xs font-medium text-zinc-500">Instagram URL</label>
                    <input id="instagramUrl" type="url" placeholder="https://instagram.com/..." bind:value={instagramUrl} class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors" />
                </div>
            </div>
        </div>

        <!-- Certificates -->
        <div class="border-t border-zinc-100 pt-6">
            <h3 class="text-xs font-semibold text-zinc-400 tracking-wider uppercase mb-4">Certificates & Documents</h3>
            {#if certificates.length > 0}
                <div class="space-y-2 mb-4">
                    {#each certificates as cert, i}
                        <div class="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-md px-3 py-2">
                            <div class="flex items-center gap-3 min-w-0">
                                {#if cert.type === 'image'}
                                    <img src={cert.url} alt={cert.name} class="w-10 h-10 rounded object-cover border border-zinc-200 flex-shrink-0" />
                                {:else}
                                    <div class="w-10 h-10 rounded bg-zinc-200 flex items-center justify-center flex-shrink-0">
                                        <svg class="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                {/if}
                                <a href={cert.url} target="_blank" rel="noopener noreferrer" class="text-sm text-zinc-700 hover:text-zinc-900 truncate">
                                    {cert.name}
                                </a>
                            </div>
                            <button type="button" onclick={() => removeCert(i)} class="text-zinc-400 hover:text-red-600 transition-colors flex-shrink-0 ml-2" aria-label="Remove {cert.name}">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    {/each}
                </div>
            {:else}
                <p class="text-xs text-zinc-400 italic mb-4">No certificates uploaded yet.</p>
            {/if}
<label class="inline-flex items-center gap-2 cursor-pointer">
				<span class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[#fb310f] bg-white border border-[#fb310f]/20 rounded-md hover:bg-[#fef2f2] transition-colors">
					Add File
				</span>
                <input type="file" accept=".pdf,.png,.jpg,.jpeg,.gif,.webp" multiple class="hidden" onchange={handleCertFilesSelect} />
            </label>
        </div>

        <div class="flex justify-start gap-2 pt-4 border-t border-zinc-100">
            <button type="submit" disabled={isSaving} class="px-5 py-2 bg-[#fb310f] text-white rounded-md text-sm font-medium hover:bg-[#e02c0d] disabled:bg-zinc-400 transition">
                {isSaving ? 'Saving Changes...' : 'Save Profile'}
            </button>
            <button
					type="button"
					onclick={handleLogout}
					class="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#dc2626] bg-[#fef2f2] border border-[#dc2626]/20 rounded-md hover:bg-[#fef2f2]/80 transition-all duration-200 ease-in-out cursor-pointer"
				>
					Sign Out
				</button>
        </div>
    </form>
</div>