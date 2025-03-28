<script lang="ts">
	import type { EncoderConfig } from '$lib/types/config';

	export let config: EncoderConfig;
	export let editable: boolean = false;

	// Simulate encoder rotation
	function rotateClockwise() {
		alert(`Clockwise: ${config.clockwise.value}`);
	}

	function rotateCounterClockwise() {
		alert(`Counter-clockwise: ${config.counterClockwise.value}`);
	}

	function press() {
		if (config.press) {
			alert(`Press: ${config.press.value}`);
		}
	}
</script>

<div class="encoder-container" data-editable={editable}>
	<div class="encoder">
		<button class="rotate-ccw" on:click={rotateCounterClockwise} title="Counter-clockwise">
			<span>↺</span>
		</button>

		<button class="encoder-button" on:click={press} title="Press">
			<span>Encoder {config.id}</span>
			{#if editable}
				<span class="edit-indicator">✏️</span>
			{/if}
		</button>

		<button class="rotate-cw" on:click={rotateClockwise} title="Clockwise">
			<span>↻</span>
		</button>
	</div>
</div>

<style>
	.encoder-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
	}

	.encoder {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
	}

	.encoder-button {
		width: 100%;
		height: 5rem;
		border-radius: 50%;
		background-color: var(--bg-secondary);
		border: 2px solid var(--border-color);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		color: var(--text-primary);
	}

	.rotate-ccw,
	.rotate-cw {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-color);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--text-primary);
	}

	.rotate-ccw:hover,
	.rotate-cw:hover,
	.encoder-button:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.rotate-ccw:active,
	.rotate-cw:active {
		transform: scale(0.95);
	}

	.encoder-button:active {
		transform: translateY(2px);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.edit-indicator {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		font-size: 0.8rem;
	}

	[data-editable='true'] {
		cursor: grab;
	}

	[data-editable='true'] .encoder-button {
		border-style: dashed;
	}
</style>
