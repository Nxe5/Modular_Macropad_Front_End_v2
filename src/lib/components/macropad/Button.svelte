<script lang="ts">
	import type { ButtonConfig } from '$lib/types/config';

	export let config: ButtonConfig;
	export let editable: boolean = false;
	export let onClick: () => void = () => {};

	$: backgroundColor = config.color || '#333333';
	$: textColor = getContrastColor(backgroundColor);

	// Determine text color based on background for better contrast
	function getContrastColor(hexColor: string) {
		// Convert hex to RGB
		const r = parseInt(hexColor.substring(1, 3), 16);
		const g = parseInt(hexColor.substring(3, 5), 16);
		const b = parseInt(hexColor.substring(5, 7), 16);

		// Calculate luminance
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

		// Return black or white based on background luminance
		return luminance > 0.5 ? '#000000' : '#ffffff';
	}
</script>

<button
	class="macropad-button"
	style="background-color: {backgroundColor}; color: {textColor};"
	on:click={onClick}
	data-editable={editable}
>
	<span class="label">{config.label}</span>
	{#if editable}
		<span class="edit-indicator">✏️</span>
	{/if}
</button>

<style>
	.macropad-button {
		width: 100%;
		height: 100%;
		min-height: 3rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		border: 2px solid var(--border-color);
		position: relative;
		cursor: pointer;
		font-weight: bold;
		transition: all 0.2s ease;
		padding: 0.5rem;
		text-align: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.macropad-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.macropad-button:active {
		transform: translateY(1px);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.label {
		font-size: 0.9rem;
		word-break: break-word;
	}

	.edit-indicator {
		position: absolute;
		top: 0.2rem;
		right: 0.2rem;
		font-size: 0.8rem;
	}

	[data-editable='true'] {
		cursor: grab;
		border-style: dashed;
	}
</style>
