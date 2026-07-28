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

<div class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
	<div class="mb-8">
		<a href="/" class="text-sm font-medium text-[#fb310f] hover:text-[#e02c0d] transition-colors">
			← Back to Home
		</a>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-10">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-zinc-900">Contact Us</h1>
			<p class="mt-3 text-sm text-zinc-500 leading-relaxed">
				Have a question about the league, registration, or partnership opportunities?
				Send us a message and our team will get back to you promptly.
			</p>

			<div class="mt-8 space-y-4">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0">
						<svg class="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
						</svg>
					</div>
					<div>
						<p class="text-sm font-medium text-zinc-900">Email</p>
						<a href="mailto:sales@v-ltd.com" class="text-sm text-[#fb310f] hover:text-[#e02c0d] transition-colors">
							sales@v-ltd.com
						</a>
					</div>
				</div>
			</div>
		</div>

		<form onsubmit={handleSubmit} class="space-y-5 bg-white p-6 border border-zinc-200 rounded-lg">
			{#if feedback}
				<div class="p-3 text-sm rounded font-medium {feedbackType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}">
					{feedback}
				</div>
			{/if}

			<div class="flex flex-col gap-1.5">
				<label for="name" class="text-xs font-medium text-zinc-500">Name</label>
				<input id="name" type="text" bind:value={name} required class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors" />
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="email" class="text-xs font-medium text-zinc-500">Email</label>
				<input id="email" type="email" bind:value={email} required class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors" />
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="subject" class="text-xs font-medium text-zinc-500">Subject (Optional)</label>
				<input id="subject" type="text" bind:value={subject} class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors" />
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="message" class="text-xs font-medium text-zinc-500">Message</label>
				<textarea id="message" rows="5" bind:value={message} required class="px-3 py-2 border border-zinc-200 rounded-md text-sm focus:border-[#fb310f] transition-colors resize-none"></textarea>
			</div>

			<button
				type="submit"
				disabled={isSending}
				class="w-full rounded-md bg-[#fb310f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e02c0d] disabled:bg-zinc-400 transition"
			>
				{isSending ? 'Sending...' : 'Send Message'}
			</button>
		</form>
	</div>
</div>
