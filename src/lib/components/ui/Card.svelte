<script lang="ts">
	type Padding = 'sm' | 'md' | 'lg';
	type Shadow = 'none' | 'sm' | 'md' | 'lg';

	let {
		padding = 'md' as Padding,
		shadow = 'sm' as Shadow,
		hover = false,
		class: className = '',
		children
	} = $props();

	const paddings = {
		sm: 'p-3',
		md: 'p-6',
		lg: 'p-8'
	};

	const shadows = {
		none: '',
		sm: 'shadow-sm',
		md: 'shadow-md',
		lg: 'shadow-lg'
	};

	const base = 'bg-[#fafafa] border border-[#e4e4e7] rounded-lg';
</script>

<div class="{base} {paddings[padding]} {shadows[shadow]} {hover ? 'hover:shadow-md hover:-translate-y-1 transition-all duration-200' : ''} {className}">
	{@render children?.()}
</div>