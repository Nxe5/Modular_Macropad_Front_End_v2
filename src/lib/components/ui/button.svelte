<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let disabled = false;
	export let fullWidth = false;

	const variantClasses = {
		primary: 'bg-accent-color text-white hover:bg-accent-color/90',
		secondary: 'bg-bg-secondary text-text-primary border border-border-color hover:bg-bg-primary',
		danger: 'bg-red-600 text-white hover:bg-red-700',
		ghost: 'bg-transparent text-text-primary hover:bg-bg-secondary'
	};

	const sizeClasses = {
		sm: 'text-sm py-1 px-2',
		md: 'text-base py-2 px-4',
		lg: 'text-lg py-3 px-6'
	};
</script>

<button
	{type}
	class="focus:ring-accent-color rounded-md font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50 {variantClasses[
		variant
	]} {sizeClasses[size]} {fullWidth ? 'w-full' : ''}"
	{disabled}
	on:click
	{...$$restProps}
>
	<slot />
</button>
