<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' | 'default' | 'outline' = 'default';
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let disabled: boolean = false;
	export let fullWidth: boolean = false;
</script>

<button
	{type}
	class="btn {variant} {size}"
	class:full-width={fullWidth}
	{disabled}
	on:click
>
	<slot />
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
		border: 1px solid transparent;
	}
	
	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	
	.btn.small {
		font-size: 0.75rem;
		padding: 0.375rem 0.75rem;
	}
	
	.btn.medium {
		font-size: 0.875rem;
		padding: 0.5rem 1rem;
	}
	
	.btn.large {
		font-size: 1rem;
		padding: 0.625rem 1.25rem;
	}
	
	.full-width {
		width: 100%;
	}
	
	/* Variants */
	.primary {
		background-color: var(--primary);
		color: white;
	}
	
	.primary:hover:not(:disabled) {
		background-color: var(--primary-hover, #2563eb);
	}
	
	.secondary {
		background-color: var(--secondary, #6b7280);
		color: white;
	}
	
	.secondary:hover:not(:disabled) {
		background-color: var(--secondary-hover, #4b5563);
	}
	
	.danger {
		background-color: var(--danger, #ef4444);
		color: white;
	}
	
	.danger:hover:not(:disabled) {
		background-color: var(--danger-hover, #dc2626);
	}
	
	.ghost {
		background-color: transparent;
		color: var(--text-primary);
	}
	
	.ghost:hover:not(:disabled) {
		background-color: var(--bg-hover);
	}
	
	.default {
		background-color: var(--bg-button, #f9fafb);
		color: var(--text-primary);
		border-color: var(--border);
	}
	
	.default:hover:not(:disabled) {
		background-color: var(--bg-hover);
	}
	
	.outline {
		background-color: transparent;
		color: var(--text-primary);
		border-color: var(--border);
	}
	
	.outline:hover:not(:disabled) {
		background-color: var(--bg-hover);
	}
</style>
