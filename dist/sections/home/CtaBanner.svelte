<script>
	import { supabase } from '../../supabase';
	import { onMount } from 'svelte';

	let email = $state('');
	let isSubmitting = $state(false);
	let feedback = $state('');
	let isVisible = $state(false);
	/** @type {HTMLElement | undefined} */
	let el;

	async function handleSubscribe() {
		if (!email) return;
		isSubmitting = true;
		feedback = '';

		const { error } = await supabase
			.from('contact_messages')
			.insert({ name: 'Newsletter', email, subject: 'Newsletter signup', message: 'Newsletter subscription from CTA banner.' });

		isSubmitting = false;

		if (!error) {
			feedback = 'Subscribed!';
			email = '';
		} else {
			feedback = 'Failed. Try again.';
		}
	}

	onMount(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				isVisible = true;
				observer.disconnect();
			}
		}, { threshold: 0.1 });
		if (el) observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<section
	bind:this={el}
	class="mx-margin-mobile lg:mx-margin-desktop my-margin-desktop relative overflow-hidden transition-all duration-1000 {isVisible ? 'opacity-100' : 'opacity-0'}"
>
	<div class="bg-primary px-stack-lg py-20 flex flex-col items-center text-center relative z-10">
		<div class="absolute top-0 right-0 opacity-10">
			<span class="material-symbols-outlined !text-[300px] text-on-primary -rotate-12 translate-x-20">bolt</span>
		</div>
		<h2 class="font-display-xl text-display-xl text-on-primary italic uppercase max-w-2xl mb-stack-lg">STAY IN THE SLIPSTREAM</h2>
		<p class="font-body-lg text-on-primary-container max-w-xl mb-stack-lg">
			Join 500,000+ fans for exclusive access to race highlights, athlete interviews, and priority ticketing.
		</p>
		<div class="flex flex-col sm:flex-row gap-stack-md w-full max-w-md">
			<input
				type="email"
				bind:value={email}
				placeholder="ENTER YOUR EMAIL"
				class="flex-grow bg-white/20 border-b-2 border-on-primary-container p-4 font-label-caps text-on-primary placeholder:text-on-primary-container/60 focus:bg-white/30 outline-none"
			/>
			<button
				onclick={handleSubscribe}
				disabled={isSubmitting}
				class="bg-on-primary text-primary font-label-caps text-label-caps px-8 py-4 hover:scale-105 transition-transform disabled:opacity-50 cursor-pointer"
			>
				{isSubmitting ? '...' : feedback || 'SUBSCRIBE'}
			</button>
		</div>
	</div>
</section>
