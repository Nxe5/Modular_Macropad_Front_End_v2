<script lang="ts">
	import { onMount } from 'svelte';
	import { ConfigApi } from '$lib/api/config';
	import { updateConnectionStatus } from '$lib/stores/connection';
	import Keyboard from '$lib/components/Keyboard.svelte';

	// Data states
	let infoData: any = null;
	let actionsData: any = null;
	let componentsData: any = null;
	
	// Loading states
	let loading = {
		info: false,
		actions: false,
		components: false
	};
	
	// Error states
	let errors = {
		info: null as string | null,
		actions: null as string | null,
		components: null as string | null
	};

	// Selected component state
	let selectedComponent: string | null = null;
	let selectedComponentData: any = null;
	
	// Active layer state
	let activeLayer: string | null = null;
	
	// Available layers
	let availableLayers: string[] = [];
	
	// Active tab state
	let activeTab: string = 'basic';
	
	// Available tabs based on component type
	let availableTabs: string[] = ['basic', 'extended', 'macros'];
	
	// Selected key for mapping
	let selectedKey: string | null = null;

	// Fetch all required data on mount
	onMount(async () => {
		await Promise.all([
			fetchInfo(),
			fetchActions(),
			fetchComponents()
		]);
	});

	// Fetch info data
	async function fetchInfo() {
		loading.info = true;
		errors.info = null;
		try {
			infoData = await ConfigApi.getInfo();
			updateConnectionStatus('connected');
		} catch (error) {
			console.error('Error fetching info:', error);
			errors.info = 'Failed to fetch macropad information';
			updateConnectionStatus('disconnected', errors.info);
		} finally {
			loading.info = false;
		}
	}

	// Fetch actions data
	async function fetchActions() {
		loading.actions = true;
		errors.actions = null;
		try {
			// Get the raw actions data from the API
			const response = await fetch('/api/config/actions');
			if (!response.ok) {
				throw new Error(`API Error: ${response.status} ${response.statusText}`);
			}
			
			// Parse the complete JSON response
			actionsData = await response.json();
			updateConnectionStatus('connected');
			
			console.log('Complete actions data from raw API:', actionsData);
			
			// Extract all available layers from actions data
			if (actionsData) {
				// Create an array to store all layer names
				const layerNames: string[] = [];
				
				// Check for the new format (array of layers under actions.layers)
				if (actionsData.actions && Array.isArray(actionsData.actions.layers)) {
					console.log('Found new array-based layers format:', actionsData.actions.layers);
					
					actionsData.actions.layers.forEach((layer: any) => {
						if (layer['layer-name']) {
							console.log(`Found layer in array: ${layer['layer-name']}`);
							layerNames.push(layer['layer-name']);
						}
					});
				} else {
					// Legacy format support
					// Extract the default layer from "actions" property
					if (actionsData.actions && actionsData.actions['layer-name']) {
						console.log('Found default layer in actions:', actionsData.actions['layer-name']);
						layerNames.push(actionsData.actions['layer-name']);
					}
					
					// Extract additional layers from "layers" property
					if (actionsData.layers) {
						console.log('Found additional layers property:', actionsData.layers);
						
						// Check if layers is an object with named layers
						if (typeof actionsData.layers === 'object' && !Array.isArray(actionsData.layers)) {
							Object.keys(actionsData.layers).forEach(layerName => {
								console.log(`Found layer: ${layerName}`);
								layerNames.push(layerName);
							});
						}
					}
				}
				
				console.log('Extracted layer names:', layerNames);
				
				// Set the available layers
				if (layerNames.length > 0) {
					availableLayers = layerNames;
					
					// Find the active layer
					let foundActiveLayer = false;
					
					// First check the new format (array of layers under actions.layers)
					if (actionsData.actions && Array.isArray(actionsData.actions.layers)) {
						// Look for a layer marked as active
						for (const layer of actionsData.actions.layers) {
							if (layer.active === true && layer['layer-name']) {
								activeLayer = layer['layer-name'];
								foundActiveLayer = true;
								console.log(`Found active layer in array: ${activeLayer}`);
								break;
							}
						}
						
						// If no active layer was found, use the first one from the array
						if (!foundActiveLayer && actionsData.actions.layers.length > 0 && 
							actionsData.actions.layers[0]['layer-name']) {
							activeLayer = actionsData.actions.layers[0]['layer-name'];
							foundActiveLayer = true;
							console.log(`Using first layer from array as active: ${activeLayer}`);
						}
					}
					
					// If still no active layer, check legacy format
					if (!foundActiveLayer) {
						// Check the default layer in "actions"
						if (actionsData.actions && actionsData.actions.active === true) {
							activeLayer = actionsData.actions['layer-name'];
							foundActiveLayer = true;
						} else if (actionsData.layers) {
							// Then check other layers
							for (const layerName in actionsData.layers) {
								if (actionsData.layers[layerName].active === true) {
									activeLayer = layerName;
									foundActiveLayer = true;
									break;
								}
							}
						}
					}
					
					// If still no active layer was found, use the first one
					if (!foundActiveLayer && layerNames.length > 0) {
						activeLayer = layerNames[0];
						console.log(`No active layer found, using first available: ${activeLayer}`);
					}
				} else {
					// If no layers were found, use a default
					availableLayers = ['default-actions-layer'];
					activeLayer = 'default-actions-layer';
					console.log('No layers found, using default: default-actions-layer');
				}
				
				// Debug: check layer configuration for the active layer
				const layerConfig = getLayerConfig(activeLayer);
				if (layerConfig) {
					console.log(`Active layer ${activeLayer} config contains these components:`, 
						Object.keys(layerConfig));
				} else {
					console.log(`No configuration found for active layer: ${activeLayer}`);
				}
			}
		} catch (error) {
			console.error('Error fetching actions:', error);
			errors.actions = 'Failed to fetch actions configuration';
			updateConnectionStatus('disconnected', errors.actions);
		} finally {
			loading.actions = false;
		}
	}
	
	// Helper function to find a layer in the array by name
	function findLayerByName(layerName: string): any {
		if (!actionsData?.actions?.layers || !Array.isArray(actionsData.actions.layers)) {
			return null;
		}
		
		return actionsData.actions.layers.find((layer: any) => layer['layer-name'] === layerName);
	}
	
	// Helper function to get layer configuration
	function getLayerConfig(layerName: string | null): any {
		if (!actionsData || !layerName) return null;
		
		// Check for the new format (array of layers under actions.layers)
		if (actionsData.actions && Array.isArray(actionsData.actions.layers)) {
			const layer = findLayerByName(layerName);
			return layer?.['layer-config'] || null;
		}
		
		// Legacy format support
		// Check if the active layer is the default layer
		if (layerName === actionsData.actions?.['layer-name']) {
			return actionsData.actions?.['layer-config'] || null;
		}
		
		// Check if the active layer is in the layers object
		return actionsData.layers?.[layerName]?.['layer-config'] || null;
	}

	// Function to get the layer configuration for a component
	function getComponentConfig(componentId: string) {
		if (!actionsData || !activeLayer) return null;
		
		const layerConfig = getLayerConfig(activeLayer);
		return layerConfig?.[componentId] || null;
	}

	// Fetch components data
	async function fetchComponents() {
		loading.components = true;
		errors.components = null;
		try {
			componentsData = await ConfigApi.getComponents();
			updateConnectionStatus('connected');
		} catch (error) {
			console.error('Error fetching components:', error);
			errors.components = 'Failed to fetch components configuration';
			updateConnectionStatus('disconnected', errors.components);
		} finally {
			loading.components = false;
		}
	}

	// Handle component selection
	function handleComponentSelect(componentId: string) {
		selectedComponent = componentId;
		
		// Find the component data
		if (componentsData && componentsData.components) {
			selectedComponentData = componentsData.components.find(
				(comp: any) => comp.id === componentId
			);
			
			// Update available tabs based on component type
			updateAvailableTabs(selectedComponentData?.type);
		}
		
		// Reset to basic tab when selecting a new component
		activeTab = 'basic';
		// Reset selected key
		selectedKey = null;
	}
	
	// Update available tabs based on component type
	function updateAvailableTabs(componentType: string | undefined) {
		if (!componentType) return;
		
		// Default tabs for all components
		availableTabs = ['basic', 'extended', 'macros'];
		
		// Add specific tabs based on component type
		switch (componentType.toLowerCase()) {
			case 'encoder':
				availableTabs.push('knob');
				break;
			case 'potentiometer':
				availableTabs.push('fader');
				break;
			case 'display':
				availableTabs = ['display']; // Only display tab for displays
				break;
		}
		
		// If the current active tab is not available, switch to the first available tab
		if (!availableTabs.includes(activeTab)) {
			activeTab = availableTabs[0];
		}
	}
	
	// Handle tab selection
	function handleTabSelect(tab: string) {
		activeTab = tab;
	}
	
	// Handle key selection from keyboard
	function handleKeySelect(event: CustomEvent<{key: string}>) {
		selectedKey = event.detail.key;
		console.log(`Selected key: ${selectedKey} for component: ${selectedComponent}`);
		// Here we would update the component configuration with the selected key
	}

	// Handle layer selection
	async function handleLayerSelect(layerName: string) {
		// Update the active layer
		activeLayer = layerName;
		
		// Log the layer selection and available configuration
		console.log(`Selected layer: ${layerName}`);
		
		// Log the layer configuration to help with debugging
		if (layerName === actionsData?.actions?.['layer-name']) {
			console.log('Using configuration from default layer:', actionsData?.actions?.['layer-config']);
		} else {
			console.log('Using configuration from additional layer:', actionsData?.layers?.[layerName]?.['layer-config']);
		}
		
		// If a component is selected, log its binding information
		if (selectedComponent) {
			const binding = getComponentConfig(selectedComponent);
			console.log(`Binding for ${selectedComponent} in layer ${layerName}:`, binding);
		}
	}
</script>

<div class="macropad-config">
	<!-- Top Section -->
	<section class="top-section">
		<!-- Layer Navigation -->
		<div class="layer-nav">
			{#if loading.actions}
				<div class="loading">Loading layers...</div>
			{:else if errors.actions}
				<div class="error">{errors.actions}</div>
			{:else if availableLayers.length > 0}
				{#each availableLayers as layerName}
					<button 
						class="layer-button" 
						class:active={activeLayer === layerName}
						on:click={() => handleLayerSelect(layerName)}
					>
						{layerName}
					</button>
				{/each}
			{:else}
				<div class="no-layers">No layers available</div>
			{/if}
		</div>

		<!-- Macropad Visual Representation -->
		<div class="macropad-visual">
			{#if loading.info || loading.components}
				<div class="loading">Loading macropad configuration...</div>
			{:else if errors.info || errors.components}
				<div class="error">
					{errors.info || errors.components}
				</div>
			{:else if infoData && componentsData}
				<div class="macropad-grid">
					{#each Array(5) as _, rowIndex}
						{#each Array(5) as _, colIndex}
							{#each componentsData.components as component}
								{#if component.start_location.row === rowIndex && component.start_location.column === colIndex}
									<div 
										class="component" 
										class:selected={selectedComponent === component.id}
										style="
											grid-column: {component.start_location.column + 1} / span {component.size.columns};
											grid-row: {component.start_location.row + 1} / span {component.size.rows};
										"
										on:click={() => handleComponentSelect(component.id)}
									>
										{component.type}
									</div>
								{/if}
							{/each}
						{/each}
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<!-- Bottom Section -->
	<section class="bottom-section">
		{#if selectedComponent && selectedComponentData}
			<!-- Component Tabs -->
			<div class="component-tabs">
				{#each availableTabs as tab}
					<button 
						class="tab-button" 
						class:active={activeTab === tab}
						on:click={() => handleTabSelect(tab)}
					>
						{tab.charAt(0).toUpperCase() + tab.slice(1)}
					</button>
				{/each}
			</div>

			<!-- Configuration Area -->
			<div class="config-area">
				{#if activeTab === 'basic'}
					<div class="tab-content">
						<h3>Basic Configuration</h3>
						<div class="component-info">
							<p><strong>Component ID:</strong> {selectedComponent}</p>
							<p><strong>Component Type:</strong> {selectedComponentData.type}</p>
							<p><strong>Active Layer:</strong> {activeLayer}</p>
							
							{#if activeLayer && actionsData}
								{@const binding = getComponentConfig(selectedComponent)}
								{#if binding}
									<div class="binding-info">
										<h4>Current Binding</h4>
										<p><strong>Type:</strong> {binding.type}</p>
										{#if binding.type === 'hid' && binding.buttonPress}
											<p><strong>Key:</strong> {binding.buttonPress.join(', ')}</p>
										{:else if binding.type === 'macro' && binding.macroId}
											<p><strong>Macro:</strong> {binding.macroId}</p>
										{:else if binding.type === 'multimedia'}
											<p><strong>Clockwise:</strong> {binding.clockwise ? binding.clockwise.join(', ') : 'None'}</p>
											<p><strong>Counterclockwise:</strong> {binding.counterclockwise ? binding.counterclockwise.join(', ') : 'None'}</p>
											<p><strong>Button Press:</strong> {binding.buttonPress ? binding.buttonPress.join(', ') : 'None'}</p>
										{:else if binding.type === 'cycle-layer'}
											<p><em>This button is configured to cycle through layers</em></p>
										{/if}
									</div>
								{:else}
									<div class="binding-info">
										<h4>Current Binding</h4>
										<p><em>No binding configured for this component in the current layer.</em></p>
									</div>
								{/if}
							{:else}
								<div class="binding-info">
									<h4>Current Binding</h4>
									<p><em>No binding information available</em></p>
								</div>
							{/if}
							
							<div class="new-binding">
								<h4>New Binding</h4>
								{#if selectedKey}
									<p><strong>Key:</strong> {selectedKey}</p>
								{:else}
									<p><em>None</em></p>
								{/if}
							</div>
						</div>
						
						<div class="keyboard-section">
							<h4>Select a key to map to this component</h4>
							<Keyboard 
								{selectedKey} 
								on:keySelect={handleKeySelect} 
							/>
						</div>
					</div>
				{:else if activeTab === 'extended'}
					<div class="tab-content">
						<h3>Extended Configuration</h3>
						<p>Extended settings for {selectedComponentData.type}</p>
					</div>
				{:else if activeTab === 'macros'}
					<div class="tab-content">
						<h3>Macros Configuration</h3>
						<p>Configure macros for {selectedComponentData.type}</p>
					</div>
				{:else if activeTab === 'knob'}
					<div class="tab-content">
						<h3>Knob Configuration</h3>
						<p>Configure encoder behavior</p>
					</div>
				{:else if activeTab === 'fader'}
					<div class="tab-content">
						<h3>Fader Configuration</h3>
						<p>Configure potentiometer behavior</p>
					</div>
				{:else if activeTab === 'display'}
					<div class="tab-content">
						<h3>Display Configuration</h3>
						<p>Configure display settings</p>
					</div>
				{/if}
			</div>
		{:else}
			<div class="no-selection">
				<p>Select a component to configure</p>
			</div>
		{/if}
	</section>
</div>

<style>
	.macropad-config {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 1rem;
		height: 100%;
	}

	.top-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.layer-nav {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.layer-button {
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		cursor: pointer;
	}

	.layer-button.active {
		background-color: var(--accent-color);
		color: white;
	}

	.macropad-visual {
		width: 300px;
		height: 300px;
		margin: 0 auto;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		overflow: hidden;
		position: relative;
	}

	.macropad-grid {
		display: grid;
		width: 100%;
		height: 100%;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 2px;
		padding: 2px;
		background-color: var(--bg-secondary);
	}

	.component {
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
	}

	.component:hover {
		background-color: var(--accent-color);
		color: white;
	}

	.component.selected {
		background-color: var(--accent-color);
		color: white;
		border-color: var(--accent-color);
	}

	.bottom-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-top: 1px solid var(--border-color);
		padding-top: 1rem;
	}

	.component-tabs {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.tab-button {
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		cursor: pointer;
	}

	.tab-button:hover {
		background-color: var(--accent-color);
		color: white;
	}
	
	.tab-button.active {
		background-color: var(--accent-color);
		color: white;
		border-color: var(--accent-color);
	}

	.config-area {
		padding: 1rem;
		min-height: 200px;
		background-color: var(--bg-secondary);
		border-radius: 0.5rem;
	}
	
	.tab-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.tab-content h3 {
		margin-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 0.5rem;
	}
	
	.tab-content h4 {
		margin: 1rem 0 0.5rem;
	}
	
	.component-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background-color: var(--bg-primary);
		border-radius: 0.25rem;
		border: 1px solid var(--border-color);
	}
	
	.keyboard-section {
		margin-top: 1rem;
	}

	.loading, .error, .no-selection {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		color: var(--text-secondary);
	}

	.error {
		color: var(--destructive);
	}

	.no-layers {
		padding: 0.5rem;
		color: var(--text-secondary);
		font-style: italic;
	}

	.binding-info, .new-binding {
		margin-top: 1rem;
		padding: 0.5rem;
		background-color: var(--bg-primary);
		border-radius: 0.25rem;
		border: 1px solid var(--border-color);
	}
	
	.binding-info h4, .new-binding h4 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-size: 1rem;
	}
	
	.binding-info.loading {
		background-color: rgba(255, 255, 255, 0.1);
		border-color: var(--accent-color);
	}
	
	.load-button {
		margin-top: 0.5rem;
		padding: 0.25rem 0.5rem;
		background-color: var(--accent-color);
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
	}
	
	.load-button:hover {
		background-color: var(--accent-color-hover, #0056b3);
	}
</style>
