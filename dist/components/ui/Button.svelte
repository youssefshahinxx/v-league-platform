<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';
	type ButtonType = 'button' | 'submit' | 'reset';

	let {
		variant = 'primary' as Variant,
		size = 'md' as Size,
		disabled = false,
		type = 'button' as ButtonType,
		class: className = '',
		children
	} = $props();

	const variants = {
		primary: 'bg-[#fb310f] text-[#fafafa] hover:bg-[#e02c0d] shadow-sm',
		secondary: 'bg-transparent border border-[#e4e4e7] text-[#09090b] hover:bg-[#e4e4e7]',
		ghost: 'text-[#71717a] hover:text-[#fb310f] hover:bg-[#fef2f2]',
		danger: 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
	};

	const sizes = {
		sm: 'min-h-[36px] min-w-[36px] px-3 py-1.5 text-xs',
		md: 'min-h-[44px] px-4 py-2.5 text-sm',
		lg: 'min-h-[52px] px-6 py-3 text-base'
	};

	const base = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
</script>

<button {type} {disabled} class="{base} {variants[variant]} {sizes[size]} {className}">
	{@render children?.()}
</button>