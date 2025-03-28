<script lang="ts">
	export let variant: 'default' | 'bordered' = 'default';

	const variantClasses = {
		default: 'bg-bg-secondary',
		bordered: 'bg-bg-secondary border border-border-color'
	};
</script>

<div class="rounded-lg p-4 shadow-sm {variantClasses[variant]}" {...$$restProps}>
	<slot />
</div>

<style>
	div {
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	div:hover {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
</style>
