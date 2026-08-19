<script>
	import { supabase } from '$lib/supabase';

	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let isSending = $state(false);
	let feedback = $state('');
	let feedbackType = $state('');

	/** @param {Event} e */
	async function handleSubmit(e) {
		e.preventDefault();
		isSending = true;
		feedback = '';

		const { error } = await supabase
			.from('contact_messages')
			.insert({ name, email, subject: subject || null, message });

		isSending = false;

		if (!error) {
			feedback = 'Thank you! Your message has been sent successfully.';
			feedbackType = 'success';
			name = '';
			email = '';
			subject = '';
			message = '';
		} else {
			feedback = 'Failed to send message. Please try again later.';
			feedbackType = 'error';
		}
	}
</script>

<div class="w-full px-margin-mobile lg:px-margin-desktop py-margin-desktop">
	<div class="mb-stack-lg">
		<a href="/" class="font-label-caps text-label-caps text-primary hover:text-on-surface transition-colors flex items-center gap-2">
			<span class="material-symbols-outlined">arrow_back</span>
			Back to Home
		</a>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter items-start">
		<div>
			<h1 class="font-headline-lg text-headline-lg text-white uppercase italic">Contact Us</h1>
			<p class="font-body-md text-on-surface-variant mt-stack-md leading-relaxed">
				Have a question about the league, registration, or partnership opportunities?
				Send us a message and our team will get back to you promptly.
			</p>

			<div class="mt-stack-lg space-y-stack-md">
				<div class="flex items-center gap-stack-md">
					<div class="w-12 h-12 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center flex-shrink-0">
						<svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
						</svg>
					</div>
					<div>
						<p class="font-label-caps text-label-caps text-on-surface-variant uppercase">Email</p>
						<a href="mailto:sales@v-ltd.com" class="font-body-lg text-primary hover:text-on-surface transition-colors">
							sales@v-ltd.com
						</a>
					</div>
				</div>
			</div>
		</div>

		<form onsubmit={handleSubmit} class="bg-surface-container-high p-stack-lg space-y-stack-lg">
			{#if feedback}
				<div class="p-stack-md border font-body-md {feedbackType === 'success' ? 'bg-secondary-fixed/10 text-secondary-fixed border-secondary-fixed/20' : 'bg-error/10 text-error border-error/20'}">
					{feedback}
				</div>
			{/if}

			<div class="flex flex-col gap-stack-sm">
				<label for="name" class="font-label-caps text-label-caps text-on-surface-variant">Name</label>
				<input id="name" type="text" bind:value={name} required class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors" />
			</div>

			<div class="flex flex-col gap-stack-sm">
				<label for="email" class="font-label-caps text-label-caps text-on-surface-variant">Email</label>
				<input id="email" type="email" bind:value={email} required class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors" />
			</div>

			<div class="flex flex-col gap-stack-sm">
				<label for="subject" class="font-label-caps text-label-caps text-on-surface-variant">Subject (Optional)</label>
				<input id="subject" type="text" bind:value={subject} class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors" />
			</div>

			<div class="flex flex-col gap-stack-sm">
				<label for="message" class="font-label-caps text-label-caps text-on-surface-variant">Message</label>
				<textarea id="message" rows="5" bind:value={message} required class="w-full bg-surface-container border-b-2 border-white/15 px-stack-md py-stack-sm focus:border-primary outline-none text-white font-body-md placeholder:text-on-surface-variant/40 transition-colors resize-none"></textarea>
			</div>

			<button
				type="submit"
				disabled={isSending}
				class="w-full bg-primary text-on-primary px-8 py-stack-md font-label-caps text-label-caps hover:bg-primary/90 disabled:opacity-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
			>
				{isSending ? 'SENDING...' : 'SEND MESSAGE'}
			</button>
		</form>
	</div>
</div>