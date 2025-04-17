<script lang="ts">
	import { onMount } from 'svelte';
	import { ConfigApi } from '$lib/api/config';
	import { updateConnectionStatus } from '$lib/stores/connection';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import { EncoderConfiguration } from '$lib/components';

	// Data states
	let infoData: any = null;
	let actionsData: any = null;
	let componentsData: any = null;
	
	// Loading states
	let loading = {
		info: false,
		actions: false,
		components: false,
		saving: false
	};
	
	// Error states
	let errors = {
		info: null as string | null,
		actions: null as string | null,
		components: null as string | null,
		saving: null as string | null
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
	
	// Active encoder tab (for encoder configuration)
	let activeEncoderTab: 'clockwise' | 'counterclockwise' | 'button' = 'clockwise';
	
	// Track if bindings have been modified
	let hasModifiedBindings: boolean = false;
	// Store pending changes to be saved
	let pendingChanges: Map<string, any> = new Map();

	// Keyboard key to HID code mapping
	const keyToHID: Record<string, string[]> = {
		// Standard keyboard keys
		'a': ['0x00', '0x00', '0x04', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'b': ['0x00', '0x00', '0x05', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'c': ['0x00', '0x00', '0x06', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'd': ['0x00', '0x00', '0x07', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'e': ['0x00', '0x00', '0x08', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f': ['0x00', '0x00', '0x09', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'g': ['0x00', '0x00', '0x0A', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'h': ['0x00', '0x00', '0x0B', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'i': ['0x00', '0x00', '0x0C', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'j': ['0x00', '0x00', '0x0D', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'k': ['0x00', '0x00', '0x0E', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'l': ['0x00', '0x00', '0x0F', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'm': ['0x00', '0x00', '0x10', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'n': ['0x00', '0x00', '0x11', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'o': ['0x00', '0x00', '0x12', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'p': ['0x00', '0x00', '0x13', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'q': ['0x00', '0x00', '0x14', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'r': ['0x00', '0x00', '0x15', '0x00', '0x00', '0x00', '0x00', '0x00'],
		's': ['0x00', '0x00', '0x16', '0x00', '0x00', '0x00', '0x00', '0x00'],
		't': ['0x00', '0x00', '0x17', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'u': ['0x00', '0x00', '0x18', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'v': ['0x00', '0x00', '0x19', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'w': ['0x00', '0x00', '0x1A', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'x': ['0x00', '0x00', '0x1B', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'y': ['0x00', '0x00', '0x1C', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'z': ['0x00', '0x00', '0x1D', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'1': ['0x00', '0x00', '0x1E', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'2': ['0x00', '0x00', '0x1F', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'3': ['0x00', '0x00', '0x20', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'4': ['0x00', '0x00', '0x21', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'5': ['0x00', '0x00', '0x22', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'6': ['0x00', '0x00', '0x23', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'7': ['0x00', '0x00', '0x24', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'8': ['0x00', '0x00', '0x25', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'9': ['0x00', '0x00', '0x26', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'0': ['0x00', '0x00', '0x27', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'enter': ['0x00', '0x00', '0x28', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'esc': ['0x00', '0x00', '0x29', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'backspace': ['0x00', '0x00', '0x2A', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'tab': ['0x00', '0x00', '0x2B', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'space': ['0x00', '0x00', '0x2C', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'-': ['0x00', '0x00', '0x2D', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'=': ['0x00', '0x00', '0x2E', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'[': ['0x00', '0x00', '0x2F', '0x00', '0x00', '0x00', '0x00', '0x00'],
		']': ['0x00', '0x00', '0x30', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'\\': ['0x00', '0x00', '0x31', '0x00', '0x00', '0x00', '0x00', '0x00'],
		';': ['0x00', '0x00', '0x33', '0x00', '0x00', '0x00', '0x00', '0x00'],
		"'": ['0x00', '0x00', '0x34', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'`': ['0x00', '0x00', '0x35', '0x00', '0x00', '0x00', '0x00', '0x00'],
		',': ['0x00', '0x00', '0x36', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'.': ['0x00', '0x00', '0x37', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'/': ['0x00', '0x00', '0x38', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'caps': ['0x00', '0x00', '0x39', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f1': ['0x00', '0x00', '0x3A', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f2': ['0x00', '0x00', '0x3B', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f3': ['0x00', '0x00', '0x3C', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f4': ['0x00', '0x00', '0x3D', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f5': ['0x00', '0x00', '0x3E', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f6': ['0x00', '0x00', '0x3F', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f7': ['0x00', '0x00', '0x40', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f8': ['0x00', '0x00', '0x41', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f9': ['0x00', '0x00', '0x42', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f10': ['0x00', '0x00', '0x43', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f11': ['0x00', '0x00', '0x44', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'f12': ['0x00', '0x00', '0x45', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'shift': ['0x02', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'ctrl': ['0x01', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'alt': ['0x04', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'win': ['0x08', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00'],
		
		// Additional special keys for the extended tab
		'up': ['0x00', '0x00', '0x52', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'down': ['0x00', '0x00', '0x51', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'left': ['0x00', '0x00', '0x50', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'right': ['0x00', '0x00', '0x4F', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'insert': ['0x00', '0x00', '0x49', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'home': ['0x00', '0x00', '0x4A', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'pageup': ['0x00', '0x00', '0x4B', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'delete': ['0x00', '0x00', '0x4C', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'end': ['0x00', '0x00', '0x4D', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'pagedown': ['0x00', '0x00', '0x4E', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'printscreen': ['0x00', '0x00', '0x46', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'scrolllock': ['0x00', '0x00', '0x47', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'pause': ['0x00', '0x00', '0x48', '0x00', '0x00', '0x00', '0x00', '0x00'],
		'numlock': ['0x00', '0x00', '0x53', '0x00', '0x00', '0x00', '0x00', '0x00'],
	};

	// Multimedia keys map with consumer control codes
	const multimediaKeys: Record<string, string[]> = {
		'play/pause': ['0x00', '0x00', '0xCD', '0x00'],
		'stop': ['0x00', '0x00', '0xB7', '0x00'],
		'prev': ['0x00', '0x00', '0xB6', '0x00'],
		'next': ['0x00', '0x00', '0xB5', '0x00'],
		'mute': ['0x00', '0x00', '0xE2', '0x00'],
		'vol+': ['0x00', '0x00', '0xE9', '0x00'],
		'vol-': ['0x00', '0x00', '0xEA', '0x00'],
		'bright+': ['0x00', '0x00', '0x6F', '0x00'],
		'bright-': ['0x00', '0x00', '0x70', '0x00'],
		'calculator': ['0x00', '0x00', '0x92', '0x00'],
		'email': ['0x00', '0x00', '0x8A', '0x00'],
		'browser': ['0x00', '0x00', '0x96', '0x00'],
	};

	// Combined keys for selection
	const specialKeys = [
		'up', 'down', 'left', 'right',
		'insert', 'home', 'pageup', 'delete', 'end', 'pagedown',
		'printscreen', 'scrolllock', 'pause', 'numlock'
	];

	const mediaKeys = Object.keys(multimediaKeys);

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
		
		// Set tabs based on component type
		switch (componentType.toLowerCase()) {
			case 'encoder':
				availableTabs = ['encoder']; // Only encoder tab for encoders
				break;
			case 'potentiometer':
				availableTabs = ['basic', 'extended', 'macros', 'fader'];
				break;
			case 'display':
				availableTabs = ['display']; // Only display tab for displays
				break;
			default:
				availableTabs = ['basic', 'extended', 'macros'];
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
	function handleKeySelect(event: CustomEvent<{key: string}>, keyType: 'standard' | 'multimedia' | 'special' = 'standard') {
		selectedKey = event.detail.key;
		console.log(`Selected key: ${selectedKey} for component: ${selectedComponent}, type: ${keyType}`);
		
		if (selectedComponent && activeLayer && selectedKey) {
			let keyBinding: any = null;
			
			// Create binding configuration based on key type
			if (keyType === 'multimedia') {
				keyBinding = {
					type: "multimedia",
					buttonPress: multimediaKeys[selectedKey] || ['0x00', '0x00', '0x00', '0x00']
				};
			} else {
				// Standard or special keys use HID
				keyBinding = {
					type: "hid",
					buttonPress: keyToHID[selectedKey] || ['0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00']
				};
			}
			
			// Store the binding change
			const componentKey = `${activeLayer}:${selectedComponent}`;
			pendingChanges.set(componentKey, keyBinding);
			pendingChanges = pendingChanges; // Trigger reactivity
			hasModifiedBindings = true;
			
			console.log(`Set pending binding for ${componentKey}:`, keyBinding);
		}
	}

	// Handle encoder key selection
	function handleEncoderKeySelect(event: CustomEvent<{
		key: string;
		action: 'clockwise' | 'counterclockwise' | 'button';
		actionType: 'hid' | 'multimedia';
	}>) {
		const { key, action, actionType } = event.detail;
		selectedKey = key;
		
		console.log(`Selected key: ${key} for encoder action: ${action}, type: ${actionType}, component: ${selectedComponent}`);
		
		if (selectedComponent && activeLayer && key) {
			// Get current binding or create a new one
			const componentKey = `${activeLayer}:${selectedComponent}`;
			let currentBinding = pendingChanges.get(componentKey) || getComponentConfig(selectedComponent) || {};
			
			// Create a copy of the current binding to modify
			let updatedBinding = { ...currentBinding };
			
			// Get the property name for the action (buttonPress for button)
			const propName = action === 'button' ? 'buttonPress' : action;
			
			// Get the command array based on key type
			const commandArray = actionType === 'multimedia' 
				? multimediaKeys[key] || ['0x00', '0x00', '0x00', '0x00']
				: keyToHID[key] || ['0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00'];
			
			// Create structured format
			updatedBinding[propName] = {
				type: actionType,
				command: commandArray
			};
			
			// For backward compatibility with the counterclockwise property - both camelCase and lowercase
			if (action === 'counterclockwise') {
				updatedBinding.counterClockwise = updatedBinding.counterclockwise;
			}
			
			// Store the updated binding
			pendingChanges.set(componentKey, updatedBinding);
			pendingChanges = pendingChanges; // Trigger reactivity
			hasModifiedBindings = true;
			
			console.log(`Set pending binding for ${componentKey}:`, updatedBinding);
		}
	}

	// Handle encoder type change
	function handleEncoderTypeChange(event: CustomEvent<{
		action: 'clockwise' | 'counterclockwise' | 'button';
		actionType: 'hid' | 'multimedia';
	}>) {
		const { action, actionType } = event.detail;
		
		console.log(`Type changed for encoder action: ${action}, type: ${actionType}, component: ${selectedComponent}`);
		
		if (selectedComponent && activeLayer) {
			// Get current binding or create a new one
			const componentKey = `${activeLayer}:${selectedComponent}`;
			let currentBinding = pendingChanges.get(componentKey) || getComponentConfig(selectedComponent) || {};
			
			// Create a copy of the current binding to modify
			let updatedBinding = { ...currentBinding };
			
			// Get the property name for the action
			const propName = action === 'button' ? 'buttonPress' : action;
			
			// If we already have a structured object for this action, update its type
			if (updatedBinding[propName] && typeof updatedBinding[propName] === 'object') {
				updatedBinding[propName].type = actionType;
			} 
			// Otherwise create a new structured object with the type
			else {
				// Try to get existing command value from any format
				let existingCommand = null;
				
				// Check for legacy flat arrays
				if (Array.isArray(updatedBinding[propName])) {
					existingCommand = updatedBinding[propName];
				} 
				// Check for special case of counterClockwise (camelCase)
				else if (action === 'counterclockwise' && Array.isArray(updatedBinding.counterClockwise)) {
					existingCommand = updatedBinding.counterClockwise;
				}
				
				// Create the structured format with a default empty command if no existing command
				updatedBinding[propName] = {
					type: actionType,
					command: existingCommand || (actionType === 'multimedia' 
						? ['0x00', '0x00', '0x00', '0x00']
						: ['0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00', '0x00'])
				};
			}
			
			// For backward compatibility with the counterclockwise property
			if (action === 'counterclockwise') {
				updatedBinding.counterClockwise = updatedBinding.counterclockwise;
			}
			
			// Store the updated binding
			pendingChanges.set(componentKey, updatedBinding);
			pendingChanges = pendingChanges; // Trigger reactivity
			hasModifiedBindings = true;
			
			console.log(`Set pending binding type for ${componentKey}:`, updatedBinding);
		}
	}

	// Handle special key selection
	function handleSpecialKeySelect(key: string, type: 'special' | 'multimedia') {
		const eventDetail = { key };
		handleKeySelect({ detail: eventDetail } as CustomEvent<{key: string}>, type);
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

	// Save all pending changes to the configuration
	async function saveChanges() {
		if (!hasModifiedBindings || !actionsData || !activeLayer) {
			console.log('No changes to save');
			return;
		}
		
		loading.saving = true;
		errors.saving = null;
		
		try {
			console.log('Saving changes to actions configuration...');
			
			// Create a deep copy of the actions data
			const updatedActions = JSON.parse(JSON.stringify(actionsData));
			
			// Apply all pending changes to the appropriate layer
			for (const [key, binding] of pendingChanges.entries()) {
				const [layerName, componentId] = key.split(':');
				
				// Find the layer in the actions data
				if (updatedActions.actions && Array.isArray(updatedActions.actions.layers)) {
					// Find the layer by name
					const layerIndex = updatedActions.actions.layers.findIndex(
						(layer: any) => layer['layer-name'] === layerName
					);
					
					if (layerIndex >= 0) {
						// Update the component binding in the layer
						if (!updatedActions.actions.layers[layerIndex]['layer-config']) {
							updatedActions.actions.layers[layerIndex]['layer-config'] = {};
						}
						
						updatedActions.actions.layers[layerIndex]['layer-config'][componentId] = binding;
						console.log(`Updated binding for ${componentId} in layer ${layerName}:`, binding);
					}
				}
			}
			
			// Send the updated actions data to the server
			await ConfigApi.updateActions(updatedActions);
			console.log('Actions configuration updated successfully');
			
			// Refresh the actions data
			await fetchActions();
			
			// Clear pending changes
			pendingChanges.clear();
			pendingChanges = pendingChanges; // Trigger reactivity
			hasModifiedBindings = false;
			
			// Optionally clear the selected key
			selectedKey = null;
			
		} catch (error) {
			console.error('Error saving actions configuration:', error);
			errors.saving = 'Failed to save changes';
		} finally {
			loading.saving = false;
		}
	}

	// Cancel all pending changes
	function cancelChanges() {
		pendingChanges.clear();
		pendingChanges = pendingChanges; // Trigger reactivity
		hasModifiedBindings = false;
		selectedKey = null;
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
								on:keySelect={(event) => handleKeySelect(event, 'standard')} 
							/>
						</div>
					</div>
				{:else if activeTab === 'extended'}
					<div class="tab-content">
						<h3>Extended Configuration</h3>
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
						
						<!-- Special Navigation Keys Section -->
						<div class="special-keys-section">
							<h4>Navigation & Special Keys</h4>
							<div class="special-keys-grid">
								{#each specialKeys as key}
									<button 
										class="special-key"
										class:selected={selectedKey === key}
										on:click={() => handleSpecialKeySelect(key, 'special')}
									>
										{key}
									</button>
								{/each}
							</div>
						</div>
						
						<!-- Multimedia Keys Section -->
						<div class="multimedia-keys-section">
							<h4>Multimedia Controls</h4>
							<div class="multimedia-keys-grid">
								{#each mediaKeys as key}
									<button 
										class="multimedia-key"
										class:selected={selectedKey === key}
										on:click={() => handleSpecialKeySelect(key, 'multimedia')}
									>
										{key}
									</button>
								{/each}
							</div>
						</div>
					</div>
				{:else if activeTab === 'macros'}
					<div class="tab-content">
						<h3>Macros Configuration</h3>
						<p>Configure macros for {selectedComponentData.type}</p>
					</div>
				{:else if activeTab === 'encoder' && selectedComponentData?.type === 'encoder'}
					<div class="tab-content">
						<h3>Encoder Configuration</h3>
						<div class="component-info">
							<p><strong>Component ID:</strong> {selectedComponent}</p>
							<p><strong>Component Type:</strong> {selectedComponentData.type}</p>
							<p><strong>Active Layer:</strong> {activeLayer}</p>
						</div>
						
						{#if activeLayer && actionsData}
							{@const binding = getComponentConfig(selectedComponent)}
							<EncoderConfiguration 
								{binding}
								componentId={selectedComponent}
								{activeLayer}
								{selectedKey}
								{activeEncoderTab}
								on:keySelect={handleEncoderKeySelect}
								on:typeChange={handleEncoderTypeChange}
							/>
						{:else}
							<div class="binding-info">
								<p><em>No binding information available</em></p>
							</div>
						{/if}
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

	<!-- Save/Cancel buttons for pending changes -->
	{#if hasModifiedBindings}
		<section class="save-section">
			<div class="changes-indicator">
				<p>You have unsaved changes</p>
				<span class="changes-count">{pendingChanges.size}</span>
			</div>
			<div class="action-buttons">
				<button 
					class="cancel-button" 
					on:click={cancelChanges}
					disabled={loading.saving}
				>
					Cancel
				</button>
				<button 
					class="save-button" 
					on:click={saveChanges}
					disabled={loading.saving}
				>
					{#if loading.saving}
						Saving...
					{:else}
						Save Changes
					{/if}
				</button>
			</div>
			{#if errors.saving}
				<div class="error-message">{errors.saving}</div>
			{/if}
		</section>
	{/if}
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

	.save-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		margin-top: 1rem;
		border-top: 1px solid var(--border-color);
		background-color: var(--bg-primary);
		border-radius: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.changes-indicator {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.changes-count {
		background-color: var(--accent-color);
		color: white;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
		font-weight: bold;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
	}

	.save-button, .cancel-button {
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		border: none;
		cursor: pointer;
		font-weight: 500;
	}

	.save-button {
		background-color: var(--accent-color);
		color: white;
	}

	.save-button:hover {
		background-color: var(--accent-color-hover, #0056b3);
	}

	.save-button:disabled {
		background-color: #cccccc;
		cursor: not-allowed;
	}

	.cancel-button {
		background-color: transparent;
		border: 1px solid var(--border-color);
		color: var(--text-primary);
	}

	.cancel-button:hover {
		background-color: #f0f0f0;
	}

	.cancel-button:disabled {
		color: #888888;
		cursor: not-allowed;
	}

	.error-message {
		color: var(--destructive);
		font-size: 0.875rem;
		padding: 0.5rem;
		background-color: rgba(255, 0, 0, 0.1);
		border-radius: 0.25rem;
	}

	/* Extended tab styles */
	.special-keys-section,
	.multimedia-keys-section {
		margin-top: 1.5rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		background-color: var(--bg-primary);
	}

	.special-keys-grid,
	.multimedia-keys-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.special-key,
	.multimedia-key {
		padding: 0.75rem 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.75rem;
		text-transform: uppercase;
	}

	.special-key:hover,
	.multimedia-key:hover {
		background-color: var(--accent-color);
		color: white;
		border-color: var(--accent-color);
	}

	.special-key.selected,
	.multimedia-key.selected {
		background-color: var(--accent-color);
		color: white;
		border-color: var(--accent-color);
	}

	/* Style differences between special and multimedia keys */
	.special-key {
		background-color: #f0f0f0;
	}

	.multimedia-key {
		background-color: #e6f7ff;
	}
</style>
