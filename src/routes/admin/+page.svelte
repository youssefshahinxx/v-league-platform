<script>
    import { supabase } from '$lib/supabase';

    /** @type {{ data: { athletes: any[], competitions: any[] } }} */
    let { data } = $props();

    // Initialize local input values safely to prevent compilation capture warnings
    let selectedProfileId = $state('');
    let selectedCompetitionId = $state('');
    let pointsAwarded = $state(0);
    let reasonNote = $state('');

    // Workflow state controls
    let isSubmitting = $state(false);
    let bannerMessage = $state('');
    let isSuccess = $state(false);

    /** @param {Event} e */
    async function submitScore(e) {
        e.preventDefault();
        
        if (!selectedProfileId || !selectedCompetitionId || pointsAwarded === 0) {
            bannerMessage = 'Please fill out all allocation metrics properly.';
            isSuccess = false;
            return;
        }

        isSubmitting = true;
        bannerMessage = '';

        // Inject point record transaction straight into the ledger table
        const { error } = await supabase
            .from('points_ledger')
            .insert({
                profile_id: selectedProfileId,
                competition_id: selectedCompetitionId,
                points_awarded: parseInt(pointsAwarded.toString(), 10),
                reason: reasonNote.trim() || 'Tournament Performance Allocation'
            });

        isSubmitting = false;

        if (!error) {
            isSuccess = true;
            bannerMessage = 'Score logged! Global ranking scoreboard updated instantly.';
            // Reset numerical inputs safely
            pointsAwarded = 0;
            reasonNote = '';
        } else {
            isSuccess = false;
            bannerMessage = 'Database validation rejected score insertion.';
        }
    }
</script>

<div class="max-w-4xl mx-auto py-12 px-6">
    <div class="border-b border-zinc-200 pb-5 mb-8">
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">League Score Administration</h1>
        <p class="mt-1 text-sm text-zinc-500">Record tournament results and award placement points to active athletes.</p>
    </div>

    <!-- Status Alert Banner -->
    {#if bannerMessage}
        <div class="mb-6 p-4 rounded-md text-sm font-semibold {isSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-zinc-900 text-white'}">
            {bannerMessage}
        </div>
    {/if}

    <!-- Tailwind UI Form Layout Layout -->
    <form onsubmit={submitScore} class="bg-white border border-zinc-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <!-- Select Athlete Dropdown -->
            <div class="flex flex-col gap-1.5">
                <label for="athlete-select" class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Target Competitor</label>
                <select 
                    id="athlete-select" 
                    bind:value={selectedProfileId}
                    required
                    class="block w-full rounded-md border-0 py-2 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm bg-white"
                >
                    <option value="">-- Choose Athlete --</option>
                    {#each (data.athletes ?? []) as athlete}
                        <option value={athlete.id}>{athlete.full_name}</option>
                    {/each}
                </select>
            </div>

            <!-- Select Competition Dropdown -->
            <div class="flex flex-col gap-1.5">
                <label for="competition-select" class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tournament Event</label>
                <select 
                    id="competition-select" 
                    bind:value={selectedCompetitionId}
                    required
                    class="block w-full rounded-md border-0 py-2 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm bg-white"
                >
                    <option value="">-- Choose Competition --</option>
                    {#each (data.competitions ?? []) as comp}
                        <option value={comp.id}>{comp.title}</option>
                    {/each}
                </select>
            </div>

            <!-- Input Score Points -->
            <div class="flex flex-col gap-1.5">
                <label for="points-input" class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Points To Award</label>
                <input 
                    id="points-input"
                    type="number" 
                    min="1" 
                    max="5000"
                    bind:value={pointsAwarded}
                    required
                    class="block w-full rounded-md border-0 py-2 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm"
                />
            </div>

            <!-- Descriptive Note / Placement Reason -->
            <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label for="reason-input" class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Placement Reason / Notes</label>
                <input 
                    id="reason-input"
                    type="text" 
                    placeholder="E.g. 1st Place Elite Division, Quarterfinalist Bonus..."
                    bind:value={reasonNote}
                    class="block w-full rounded-md border-0 py-2 px-3 text-zinc-900 ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm"
                />
            </div>
        </div>

        <div class="flex justify-end pt-4 border-t border-zinc-100">
            <button 
                type="submit" 
                disabled={isSubmitting}
                class="rounded-md bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition disabled:bg-zinc-400"
            >
                {isSubmitting ? 'Injecting Entry...' : 'Commit Points Result'}
            </button>
        </div>
    </form>
</div>