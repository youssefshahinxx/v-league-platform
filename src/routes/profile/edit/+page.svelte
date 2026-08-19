<script>
    import { handleLogout } from '$lib/auth';
    import { supabase } from '$lib/supabase';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();

    let fullName = $state('');
    let nationality = $state('');
    let gender = $state('');
    let dob = $state('');
    let club = $state('');
    let bio = $state('');
    let avatarUrl = $state('');
    /** @type {File | null} */
    let selectedFile = $state(null);

    let facebookUrl = $state('');
    let tiktokUrl = $state('');
    let instagramUrl = $state('');

    /** @type {Array<{name: string, url: string, type: string}>} */
    let certificates = $state([]);

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

<div class="w-full px-margin-mobile lg:px-margin-desktop py-margin-desktop max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter items-start">
        <!-- Left Column: Context & Read-Only System Achievements -->
        <div class="md:col-span-1 space-y-stack-lg">
            <div>
                <h1 class="font-headline-lg text-headline-lg text-white uppercase italic">Account Settings</h1>
                <p class="font-body-md text-on-surface-variant mt-2">Manage your public athletic directory presence.</p>
            </div>

            <div class="bg-surface-container-low p-stack-lg">
                <h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">Verified League Achievements</h3>
                {#if data.profile?.achievements && data.profile.achievements.length > 0}
                    <div class="flex flex-wrap gap-stack-sm">
                        {#each data.profile.achievements as achievement}
                            <span class="font-label-caps text-label-caps bg-primary/15 text-primary px-stack-sm py-stack-sm">🏆 {achievement}</span>
                        {/each}
                    </div>
                {:else}
                    <p class="font-body-md text-on-surface-variant">No official tournament achievements recorded yet.</p>
                {/if}
            </div>

            <div class="bg-surface-container-low p-stack-lg border border-white/5 space-y-stack-md">
                <h3 class="font-label-caps text-label-caps text-primary uppercase">Performance Stats</h3>
                <div class="border-t border-white/5 pt-stack-md space-y-stack-md">
                    <div class="flex items-center justify-between">
                        <span class="font-body-md text-on-surface-variant">Total Points</span>
                        <span class="font-stats-number text-[20px] text-secondary-fixed">{data.stats?.total_points ?? 0}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-body-md text-on-surface-variant">Events Competed</span>
                        <span class="font-stats-number text-[20px] text-secondary-fixed">{data.stats?.events_tracked ?? 0}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="font-body-md text-on-surface-variant">Global Rank</span>
                        <span class="font-stats-number text-[20px] text-secondary-fixed">
                            {data.stats?.rank ? '#' + data.stats.rank : '---'}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right column: Update Form -->
        <form onsubmit={updateProfile} class="md:col-span-2 bg-surface-container-high p-stack-lg space-y-stack-lg">
            {#if message}
                <div class="p-stack-md bg-surface-container border border-white/10 font-body-md text-white">
                    {message}
                </div>
            {/if}

            <!-- Avatar Upload -->
            <div class="flex items-center gap-stack-md pb-stack-lg border-b border-white/5">
                <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
                    {#if avatarUrl}
                        <img src={avatarUrl} alt="Profile avatar" class="w-full h-full object-cover" />
                    {:else}
                        <div class="w-full h-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                    {/if}
                </div>
                <label class="cursor-pointer">
                    <span class="inline-flex items-center border border-primary text-primary px-stack-md py-stack-sm font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">
                        Change Photo
                    </span>
                    <input type="file" accept="image/*" class="hidden" onchange={handleFileSelect} />
                </label>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-stack-lg">
                <div class="flex flex-col gap-stack-sm">
                    <label for="fullName" class="font-label-caps text-label-caps text-on-surface-variant">Full Name</label>
                    <input id="fullName" type="text" bind:value={fullName} required class="w-full bg-surface-container border-b-2 border-white/10 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors" />
                </div>

                <div class="flex flex-col gap-stack-sm">
                    <label for="club" class="font-label-caps text-label-caps text-on-surface-variant">Club Affiliation (Optional)</label>
                    <input id="club" type="text" bind:value={club} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors" />
                </div>

                <div class="flex flex-col gap-stack-sm">
                    <label for="nationality" class="font-label-caps text-label-caps text-on-surface-variant">Nationality Code</label>
                    <input id="nationality" type="text" maxlength="3" placeholder="E.g. EGY, USA" bind:value={nationality} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors uppercase" />
                </div>

                <div class="flex flex-col gap-stack-sm">
                    <label for="dob" class="font-label-caps text-label-caps text-on-surface-variant">Date of Birth</label>
                    <input id="dob" type="date" bind:value={dob} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md transition-colors" />
                </div>

                <div class="flex flex-col gap-stack-sm sm:col-span-2">
                    <label for="gender" class="font-label-caps text-label-caps text-on-surface-variant">Gender Identity</label>
                    <select id="gender" bind:value={gender} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md transition-colors">
                        <option value="" class="bg-surface-container">Select Gender</option>
                        <option value="Male" class="bg-surface-container">Male</option>
                        <option value="Female" class="bg-surface-container">Female</option>
                        <option value="Other" class="bg-surface-container">Other</option>
                    </select>
                </div>

                <div class="flex flex-col gap-stack-sm sm:col-span-2">
                    <label for="bio" class="font-label-caps text-label-caps text-on-surface-variant">Athlete Biography</label>
                    <textarea id="bio" rows="4" bind:value={bio} placeholder="Briefly introduce your athletic background..." class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors resize-none"></textarea>
                </div>
            </div>

            <!-- Social Links -->
            <div class="border-t border-white/5 pt-stack-lg">
                <h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">Social Links</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-stack-lg">
                    <div class="flex flex-col gap-stack-sm">
                        <label for="facebookUrl" class="font-label-caps text-label-caps text-on-surface-variant">Facebook URL</label>
                        <input id="facebookUrl" type="url" placeholder="https://facebook.com/..." bind:value={facebookUrl} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors" />
                    </div>
                    <div class="flex flex-col gap-stack-sm">
                        <label for="tiktokUrl" class="font-label-caps text-label-caps text-on-surface-variant">TikTok URL</label>
                        <input id="tiktokUrl" type="url" placeholder="https://tiktok.com/..." bind:value={tiktokUrl} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors" />
                    </div>
                    <div class="flex flex-col gap-stack-sm sm:col-span-2">
                        <label for="instagramUrl" class="font-label-caps text-label-caps text-on-surface-variant">Instagram URL</label>
                        <input id="instagramUrl" type="url" placeholder="https://instagram.com/..." bind:value={instagramUrl} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors" />
                    </div>
                </div>
            </div>

            <!-- Certificates -->
            <div class="border-t border-white/5 pt-stack-lg">
                <h3 class="font-label-caps text-label-caps text-primary uppercase mb-stack-md">Certificates & Documents</h3>
                {#if certificates.length > 0}
                    <div class="space-y-stack-sm mb-stack-md">
                        {#each certificates as cert, i}
                            <div class="flex items-center justify-between bg-surface-container border border-white/5 px-stack-md py-stack-sm gap-stack-md">
                                <div class="flex items-center gap-stack-md min-w-0">
                                    {#if cert.type === 'image'}
                                        <img src={cert.url} alt={cert.name} class="w-10 h-10 rounded object-cover border border-white/10 flex-shrink-0" />
                                    {:else}
                                        <div class="w-10 h-10 rounded bg-surface-variant flex items-center justify-center flex-shrink-0">
                                            <svg class="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                        </div>
                                    {/if}
                                    <a href={cert.url} target="_blank" rel="noopener noreferrer" class="font-body-md text-white hover:text-primary truncate transition-colors">
                                        {cert.name}
                                    </a>
                                </div>
                                <button type="button" onclick={() => removeCert(i)} class="text-on-surface-variant hover:text-error transition-colors flex-shrink-0 cursor-pointer" aria-label="Remove {cert.name}">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="font-body-md text-on-surface-variant mb-stack-md">No certificates uploaded yet.</p>
                {/if}
                <label class="inline-flex items-center gap-2 cursor-pointer">
                    <span class="inline-flex items-center border border-primary text-primary px-4 py-stack-sm font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">
                        Add File
                    </span>
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg,.gif,.webp" multiple class="hidden" onchange={handleCertFilesSelect} />
                </label>
            </div>

            <div class="flex justify-start gap-stack-md pt-stack-lg border-t border-white/5 flex-wrap">
                <button type="submit" disabled={isSaving} class="bg-primary text-on-primary px-8 py-stack-sm font-label-caps text-label-caps hover:bg-primary/90 disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
                    {isSaving ? 'SAVING...' : 'SAVE PROFILE'}
                </button>
                <button
                    type="button"
                    onclick={handleLogout}
                    class="border border-error text-error px-6 py-stack-sm font-label-caps text-label-caps hover:bg-error/10 transition-all cursor-pointer"
                >
                    Sign Out
                </button>
            </div>
        </form>
    </div>
</div>