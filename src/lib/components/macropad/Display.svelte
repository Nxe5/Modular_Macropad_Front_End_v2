<script lang="ts">
	import type { DisplayConfig } from '$lib/types/config';

	export let config: DisplayConfig;
	export let editable: boolean = false;
	export let content: string = 'Macropad Display';

	// Calculate opacity based on brightness
	$: opacity = config.brightness / 100;
</script>

<div class="display-container" data-editable={editable}>
	<div class="display" style="opacity: {opacity}">
		<div class="screen">
			{content}
		</div>

		{#if editable}
			<div class="display-controls">
				<div class="brightness-control">
					<span>Brightness: {config.brightness}%</span>
				</div>
				<div class="timeout-control">
					<span>Timeout: {config.timeout}s</span>
				</div>
			</div>
			<span class="edit-indicator">✏️</span>
		{/if}
	</div>
</div>

<style>
	.display-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
	}

	.display {
		width: 100%;
		height: 100%;
		min-height: 6rem;
		border-radius: 8px;
		border: 2px solid var(--border-color);
		display: flex;
		flex-direction: column;
		position: relative;
		background-color: #0a0a0a;
		overflow: hidden;
	}

	.screen {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		color: #00ff00;
		font-family: 'Courier New', monospace;
		text-shadow: 0 0 5px #00ff00;
		font-size: 0.9rem;
		text-align: center;
		word-break: break-word;
	}

	.display-controls {
		background-color: rgba(0, 0, 0, 0.6);
		padding: 0.5rem;
		font-size: 0.7rem;
		color: #00ff00;
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

	[data-editable='true'] .display {
		border-style: dashed;
	}
</style>
