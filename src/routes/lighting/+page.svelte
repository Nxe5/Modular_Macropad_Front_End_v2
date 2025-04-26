<script lang="ts">
	import { onMount } from 'svelte';
	import { Save, RefreshCw } from 'lucide-svelte';
	import { ConfigApi } from '$lib/api/config';
	import { updateConnectionStatus } from '$lib/stores/connection';
	import LEDGrid from '$lib/components/lighting/LEDGrid.svelte';
	import LEDConfigPanel from '$lib/components/lighting/LEDConfigPanel.svelte';
	import LEDLayerNav from '$lib/components/lighting/LEDLayerNav.svelte';
	import LEDLayerAnimation from '$lib/components/lighting/LEDLayerAnimation.svelte';
	
	// State management
	let loading = true;
	let error: string | null = null;
	let ledsData: any = null;
	
	// LED state
	let availableLayers: Array<{ 'layer-name': string; active: boolean }> = [];
	let activeLayer = '';
	let selectedLED: string | null = null;
	let selectedLEDData: any = null;
	
	// Pending changes
	let pendingChanges: Record<string, any> = {};
	let hasChanges = false;
	
	// Initialize component
	onMount(async () => {
		await fetchLEDConfiguration();
	});
	
	// Fetch LED configuration
	async function fetchLEDConfiguration() {
		loading = true;
		error = null;
		
		try {
			// Get the LED configuration from the API
			const response = await ConfigApi.getLeds();
			ledsData = response;
			
			// Extract layers from the configuration
			extractLayers();
			
			// Select first layer as default if available
			if (availableLayers.length > 0) {
				activeLayer = availableLayers[0]['layer-name'];
			}
			
			updateConnectionStatus('connected');
		} catch (err: any) {
			console.error('Error fetching LED configuration:', err);
			error = err.message || 'Failed to load LED configuration';
			updateConnectionStatus('disconnected');
		} finally {
			loading = false;
		}
	}
	
	// Extract available layers from LED data
	function extractLayers() {
		availableLayers = [];
		
		if (!ledsData || !ledsData.leds) return;
		
		// Check if using the new layers format
		if (ledsData.leds.layers && Array.isArray(ledsData.leds.layers)) {
			availableLayers = ledsData.leds.layers.map((layer: any) => ({
				'layer-name': layer['layer-name'],
				active: layer.active || false
			}));
		} else {
			// Legacy format - single layer
			availableLayers = [{
				'layer-name': ledsData.leds['layer-name'] || 'default-led-layer',
				active: ledsData.leds.active || false
			}];
		}
		
		console.log('Available LED layers:', availableLayers);
	}
	
	// Update LED data when layer changes
	$: {
		if (activeLayer && ledsData) {
			// Deselect any selected LED when changing layers
			selectedLED = null;
			selectedLEDData = null;
		}
	}
	
	// Handle LED selection
	function handleLEDSelect(ledId: string) {
		selectedLED = ledId;
		
		// Find selected LED data
		if (ledsData && ledsData.leds) {
			// Check if we're using the new layers format
			if (ledsData.leds.layers && Array.isArray(ledsData.leds.layers)) {
				const layer = ledsData.leds.layers.find((l: any) => l['layer-name'] === activeLayer);
				if (layer && layer['layer-config']) {
					const led = layer['layer-config'].find((led: any) => led.id === ledId);
					if (led) {
						// Create a deep clone of the LED data to prevent reference issues
						selectedLEDData = JSON.parse(JSON.stringify(led));
					}
				}
			} else {
				// Legacy format
				const led = ledsData.leds.config?.find((led: any) => led.id === ledId);
				if (led) {
					// Create a deep clone of the LED data to prevent reference issues
					selectedLEDData = JSON.parse(JSON.stringify(led));
				}
			}
		}
		
		console.log('Selected LED:', selectedLEDData);
	}
	
	// Handle layer selection
	function handleLayerSelect(layerName: string) {
		activeLayer = layerName;
		selectedLED = null;
		selectedLEDData = null;
	}
	
	// Handle LED updates
	function handleLEDUpdate(changes: any) {
		if (!selectedLED || !activeLayer) return;
		
		// Store changes in pending changes
		const key = `${activeLayer}:${selectedLED}`;
		pendingChanges[key] = { ...pendingChanges[key], ...changes };
		hasChanges = true;
		
		// Update local state for immediate UI feedback
		// Handle nested objects (like color and pressed_color) properly
		for (const key in changes) {
			if (typeof changes[key] === 'object' && changes[key] !== null) {
				// For nested objects, create a new object with updated properties
				selectedLEDData[key] = { ...selectedLEDData[key], ...changes[key] };
			} else {
				// For primitive values, directly update
				selectedLEDData[key] = changes[key];
			}
		}
		
		// Update ledsData for grid refresh
		updateLocalLEDData(selectedLED, changes);
		
		console.log('Updated LED:', selectedLEDData);
	}
	
	// Add a new layer
	function handleAddLayer() {
		if (!ledsData || !ledsData.leds) return;
		
		// Generate a new layer name
		const baseName = 'led-layer';
		let counter = 1;
		let newLayerName = `${baseName}-${counter}`;
		
		// Find a unique name
		while (availableLayers.some(layer => layer['layer-name'] === newLayerName)) {
			counter++;
			newLayerName = `${baseName}-${counter}`;
		}
		
		// Create a new layer structure
		if (!ledsData.leds.layers) {
			// Convert legacy format to layers format
			const currentConfig = ledsData.leds.config || [];
			const currentLayerName = ledsData.leds['layer-name'] || 'default-led-layer';
			
			ledsData.leds.layers = [
				{
					'layer-name': currentLayerName,
					active: ledsData.leds.active || false,
					pin: ledsData.leds.pin,
					type: ledsData.leds.type,
					brightness: ledsData.leds.brightness,
					animation: ledsData.leds.animation,
					'layer-config': currentConfig
				}
			];
			
			// Clean up legacy properties
			delete ledsData.leds.config;
		}
		
		// Copy configuration from active layer if available
		const activeLayerData = ledsData.leds.layers.find((l: any) => l['layer-name'] === activeLayer);
		
		// Create new layer
		const newLayer = {
			'layer-name': newLayerName,
			active: false,
			pin: ledsData.leds.pin || activeLayerData?.pin || 7,
			type: ledsData.leds.type || activeLayerData?.type || 'sk6812',
			brightness: ledsData.leds.brightness || activeLayerData?.brightness || 8,
			animation: ledsData.leds.animation || activeLayerData?.animation || { active: false, mode: 0, speed: 100 },
			'layer-config': JSON.parse(JSON.stringify(activeLayerData?.['layer-config'] || []))
		};
		
		// Add the new layer
		ledsData.leds.layers.push(newLayer);
		
		// Update available layers
		availableLayers = [...availableLayers, { 'layer-name': newLayerName, active: false }];
		
		// Switch to the new layer
		activeLayer = newLayerName;
		
		// Mark changes
		hasChanges = true;
	}
	
	// Remove a layer
	function handleRemoveLayer(layerName: string) {
		if (!ledsData || !ledsData.leds || !ledsData.leds.layers) return;
		
		// Remove the layer
		ledsData.leds.layers = ledsData.leds.layers.filter((l: any) => l['layer-name'] !== layerName);
		
		// Update available layers
		availableLayers = availableLayers.filter(l => l['layer-name'] !== layerName);
		
		// If active layer was removed, select the first available
		if (activeLayer === layerName && availableLayers.length > 0) {
			activeLayer = availableLayers[0]['layer-name'];
		}
		
		// Mark changes
		hasChanges = true;
		selectedLED = null;
		selectedLEDData = null;
	}
	
	// Rename a layer
	function handleRenameLayer(oldName: string, newName: string) {
		if (!ledsData || !ledsData.leds || !ledsData.leds.layers) return;
		
		// Find and update the layer
		const layerIndex = ledsData.leds.layers.findIndex((l: any) => l['layer-name'] === oldName);
		if (layerIndex >= 0) {
			ledsData.leds.layers[layerIndex]['layer-name'] = newName;
			
			// Update available layers
			availableLayers = availableLayers.map(l => 
				l['layer-name'] === oldName 
				? { ...l, 'layer-name': newName } 
				: l
			);
			
			// If active layer was renamed, update active layer
			if (activeLayer === oldName) {
				activeLayer = newName;
			}
			
			// Mark changes
			hasChanges = true;
		}
	}
	
	// Update the local LED data for immediate UI feedback
	function updateLocalLEDData(ledId: string, changes: any) {
		if (!ledsData || !ledsData.leds) return;
		
		// Find and update the LED in the appropriate layer
		if (ledsData.leds.layers && Array.isArray(ledsData.leds.layers)) {
			const layerIndex = ledsData.leds.layers.findIndex((l: any) => l['layer-name'] === activeLayer);
			if (layerIndex >= 0 && ledsData.leds.layers[layerIndex]['layer-config']) {
				const ledIndex = ledsData.leds.layers[layerIndex]['layer-config'].findIndex((led: any) => led.id === ledId);
				if (ledIndex >= 0) {
					// Update properties directly instead of creating a new object
					const targetLed = ledsData.leds.layers[layerIndex]['layer-config'][ledIndex];
					for (const key in changes) {
						if (typeof changes[key] === 'object' && changes[key] !== null) {
							// For nested objects like color, handle them properly
							targetLed[key] = { ...targetLed[key], ...changes[key] };
						} else {
							// For primitive values, directly update
							targetLed[key] = changes[key];
						}
					}
				}
			}
		} else if (ledsData.leds.config) {
			// Legacy format
			const ledIndex = ledsData.leds.config.findIndex((led: any) => led.id === ledId);
			if (ledIndex >= 0) {
				// Update properties directly instead of creating a new object
				const targetLed = ledsData.leds.config[ledIndex];
				for (const key in changes) {
					if (typeof changes[key] === 'object' && changes[key] !== null) {
						// For nested objects like color, handle them properly
						targetLed[key] = { ...targetLed[key], ...changes[key] };
					} else {
						// For primitive values, directly update
						targetLed[key] = changes[key];
					}
				}
			}
		}
	}
	
	// Save changes
	async function saveChanges() {
		if (!hasChanges) return;
		
		try {
			// Update the LEDs config with the pending changes
			await ConfigApi.updateLeds(ledsData);
			
			// Clear pending changes
			pendingChanges = {};
			hasChanges = false;
			
			// Show success message
			alert('LED configuration saved successfully!');
		} catch (err: any) {
			console.error('Error saving LED configuration:', err);
			alert(`Failed to save LED configuration: ${err.message}`);
		}
	}
	
	// Handle animation updates for the active layer
	function handleAnimationUpdate(animationSettings: any) {
		if (!ledsData || !ledsData.leds || !activeLayer) return;
		
		// Find the active layer
		if (ledsData.leds.layers && Array.isArray(ledsData.leds.layers)) {
			const layerIndex = ledsData.leds.layers.findIndex((l: any) => l['layer-name'] === activeLayer);
			if (layerIndex >= 0) {
				// Update animation settings
				ledsData.leds.layers[layerIndex].animation = animationSettings;
				hasChanges = true;
			}
		} else {
			// Legacy format support
			ledsData.leds.animation = animationSettings;
			hasChanges = true;
		}
	}
	
	// Get animation settings for the active layer
	function getActiveLayerAnimation() {
		if (!ledsData || !ledsData.leds || !activeLayer) {
			return { active: false, mode: 0, speed: 100 };
		}
		
		// Check if we're using the new layers format
		if (ledsData.leds.layers && Array.isArray(ledsData.leds.layers)) {
			const layer = ledsData.leds.layers.find((l: any) => l['layer-name'] === activeLayer);
			return layer?.animation || { active: false, mode: 0, speed: 100 };
		}
		
		// Legacy format support
		return ledsData.leds.animation || { active: false, mode: 0, speed: 100 };
	}
</script>

<div class="page-container">
	<div class="header">
		<h1>Lighting Configuration</h1>
		<div class="header-actions">
			<button 
				class="action-button refresh" 
				on:click={fetchLEDConfiguration} 
				disabled={loading}
				title="Refresh LED configuration"
			>
				<RefreshCw size={16} class={loading ? 'spinning' : ''} />
				<span>Refresh</span>
			</button>
			
			<button 
				class="action-button save" 
				on:click={saveChanges} 
				disabled={!hasChanges || loading}
				title="Save LED configuration"
			>
				<Save size={16} />
				<span>Save</span>
			</button>
		</div>
	</div>
	
	{#if loading}
		<div class="loading">Loading LED configuration...</div>
	{:else if error}
		<div class="error">
			<p>Error: {error}</p>
			<button on:click={fetchLEDConfiguration}>Retry</button>
		</div>
	{:else if ledsData}
		<LEDLayerNav
			layers={availableLayers}
			{activeLayer}
			onSelectLayer={handleLayerSelect}
			onAddLayer={handleAddLayer}
			onRemoveLayer={handleRemoveLayer}
			onRenameLayer={handleRenameLayer}
		/>
		
		{#if activeLayer}
			<LEDLayerAnimation 
				animationSettings={getActiveLayerAnimation()}
				onChange={handleAnimationUpdate}
			/>
		{/if}
		
		<div class="main-content">
			<div class="led-visual">
				<LEDGrid
					{ledsData}
					{activeLayer}
					selectedLED={selectedLED}
					onSelectLED={handleLEDSelect}
				/>
			</div>
			
			<div class="led-config">
				{#if selectedLED && selectedLEDData}
					<div class="config-header">
						<h2>Configure LED: {selectedLED}</h2>
						<p class="button-info">Associated Button: {selectedLEDData.button_id || 'None'}</p>
					</div>
					
					<LEDConfigPanel
						selectedLEDData={selectedLEDData}
						onChange={handleLEDUpdate}
					/>
				{:else}
					<div class="no-selection">
						<p>Select an LED on the grid to configure it.</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.page-container {
		padding: 2rem 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}
	
	h1 {
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}
	
	.header-actions {
		display: flex;
		gap: 0.5rem;
	}
	
	.action-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
	}
	
	.action-button:hover {
		background-color: var(--bg-hover);
	}
	
	.action-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.action-button.save {
		background-color: var(--accent-color);
		color: white;
		border-color: var(--accent-color);
	}
	
	.action-button.save:hover {
		filter: brightness(1.1);
	}
	
	.spinning {
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
	
	.main-content {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 2rem;
		align-items: start;
	}
	
	.led-visual {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.led-config {
		background-color: var(--bg-secondary);
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
		padding: 1rem;
		min-height: 300px;
	}
	
	.config-header {
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}
	
	h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		color: var(--text-primary);
	}
	
	.button-info {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
	}
	
	.loading, .error, .no-selection {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
		color: var(--text-secondary);
		min-height: 300px;
	}
	
	.error {
		color: var(--destructive);
	}
	
	@media (max-width: 768px) {
		.main-content {
			grid-template-columns: 1fr;
		}
		
		.led-visual {
			margin-bottom: 2rem;
		}
	}
</style>
