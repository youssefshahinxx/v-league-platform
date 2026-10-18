<script lang="ts">
	type BadgeVariant = 'default' | 'success' | 'warning' | 'accent';

	let { variant = 'default' as BadgeVariant, class: className = '', children } = $props();

	const variants = {
		default: 'bg-zinc-100 text-zinc-700',
		success: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
		warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
		accent: 'bg-[#fef2f2] text-[#fb310f] ring-1 ring-inset ring-[#fb310f]/20'
	};
</script>

<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {variants[variant]} {className}">
	{@render children?.()}
</span>