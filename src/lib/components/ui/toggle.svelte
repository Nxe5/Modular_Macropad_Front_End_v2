<script lang="ts">
	export let checked = false;
	export let disabled = false;
	export let id = '';
	export let name = '';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let ariaLabel = '';

	const sizes = {
		sm: {
			toggle: 'w-8 h-4',
			circle: 'w-3 h-3',
			translateX: 'translate-x-4'
		},
		md: {
			toggle: 'w-10 h-5',
			circle: 'w-4 h-4',
			translateX: 'translate-x-5'
		},
		lg: {
			toggle: 'w-12 h-6',
			circle: 'w-5 h-5',
			translateX: 'translate-x-6'
		}
	};
</script>

<label
	class="inline-flex cursor-pointer items-center {disabled ? 'cursor-not-allowed opacity-50' : ''}"
	{id}
>
	<span class="relative">
		<input
			type="checkbox"
			bind:checked
			{disabled}
			{name}
			class="sr-only"
			aria-label={ariaLabel}
			on:change
			{...$$restProps}
		/>
		<span
			class="block {sizes[size]
				.toggle} bg-bg-secondary rounded-full transition-colors duration-200 ease-in-out {checked
				? 'bg-accent-color'
				: ''}"
		></span>
		<span
			class="absolute top-0.5 left-0.5 block {sizes[size]
				.circle} rounded-full bg-white transition-transform duration-200 ease-in-out {checked
				? sizes[size].translateX
				: ''}"
		></span>
	</span>
	{#if $$slots.default}
		<span class="ml-2">
			<slot />
		</span>
	{/if}
</label>
