<script lang="ts">
	// LED grid component to display LED layout
	export let ledsData: any = null;
	export let activeLayer: string = '';
	export let selectedLED: string | null = null;
	export let onSelectLED: (ledId: string) => void;
	
	// Extract LEDs for the active layer
	$: activeLEDs = extractActiveLEDs(ledsData, activeLayer);
	
	/**
	 * Extract active layer LEDs from the configuration
	 */
	function extractActiveLEDs(ledsData: any, activeLayer: string) {
		if (!ledsData || !ledsData.leds) return [];
		
		// Check if we're using the new layers format
		if (ledsData.leds.layers && Array.isArray(ledsData.leds.layers)) {
			const layer = ledsData.leds.layers.find((l: any) => l['layer-name'] === activeLayer);
			return layer ? layer['layer-config'] || [] : [];
		}
		
		// Legacy format support - use the direct config array
		return ledsData.leds.config || [];
	}
	
	/**
	 * Get LED color style based on LED configuration
	 */
	function getLEDStyle(led: any): string {
		if (!led || !led.color) return '';
		
		return `
			grid-column: ${led.start_location.column + 1} / span ${led.size.columns};
			grid-row: ${led.start_location.row + 1} / span ${led.size.rows};
			background-color: rgb(${led.color.r}, ${led.color.g}, ${led.color.b});
		`;
	}
</script>

<div class="led-grid">
	{#if !ledsData || !activeLEDs.length}
		<div class="empty-grid">Loading LED configuration...</div>
	{:else}
		{#each Array(5) as _, rowIndex}
			{#each Array(5) as _, colIndex}
				{#each activeLEDs as led}
					{#if led.start_location.row === rowIndex && led.start_location.column === colIndex}
						<div 
							class="led" 
							class:selected={selectedLED === led.id}
							style={getLEDStyle(led)}
							on:click={() => onSelectLED(led.id)}
						>
							<div class="led-info">
								{led.id}
							</div>
						</div>
					{/if}
				{/each}
			{/each}
		{/each}
	{/if}
</div>

<style>
	.led-grid {
		display: grid;
		width: 300px;
		height: 300px;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 2px;
		padding: 2px;
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		overflow: hidden;
		position: relative;
	}
	
	.empty-grid {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}
	
	.led {
		background-color: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.75rem;
		padding: 0.25rem;
		text-align: center;
		word-break: break-word;
		position: relative;
		overflow: hidden;
	}
	
	.led:hover {
		filter: brightness(1.2);
	}
	
	.led.selected {
		border: 2px solid white;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
	}
	
	.led-info {
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 2px 4px;
		border-radius: 2px;
		font-size: 0.7rem;
		opacity: 0;
		transition: opacity 0.2s;
	}
	
	.led:hover .led-info,
	.led.selected .led-info {
		opacity: 1;
	}
</style>