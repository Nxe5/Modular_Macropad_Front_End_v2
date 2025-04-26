<script lang="ts">
	import Tabs from '$lib/components/ui/tabs.svelte';
	import ColorPicker from '$lib/components/ui/ColorPicker.svelte';
	
	// Props: Selected LED data, onChange handler
	export let selectedLEDData: any;
	export let onChange: (data: any) => void;
	
	// UI references
	let colorInput: HTMLInputElement;
	let pressedColorInput: HTMLInputElement;
	
	// Tab configuration
	const tabs = [
		{ id: 'color', label: 'Color' },
		{ id: 'pressed-color', label: 'Pressed Color' }
	];
	let activeTab = 'color';
	
	// Color state
	$: color = selectedLEDData?.color || { r: 0, g: 0, b: 0 };
	$: pressedColor = selectedLEDData?.pressed_color || { r: 255, g: 255, b: 255 };
	$: brightness = selectedLEDData?.brightness || 8; // Default to 8 (scaled 0-20 for UI)
	$: mode = selectedLEDData?.mode || 0;
	
	// Color modes
	const colorModes = [
		{ id: 0, name: 'Static' },         // LED_MODE_STATIC
		{ id: 1, name: 'Animation' },      // LED_MODE_ANIMATION
		{ id: 2, name: 'Button-controlled' }, // LED_MODE_BUTTON
		{ id: 3, name: 'Pulse' },          // LED_MODE_PULSE
		{ id: 4, name: 'Rainbow' },        // LED_MODE_RAINBOW
		{ id: 5, name: 'Breathing' }       // LED_MODE_BREATHING
	];
	
	// Open color pickers
	function openColorPicker() {
		if (colorInput) {
			colorInput.click();
		}
	}
	
	function openPressedColorPicker() {
		if (pressedColorInput) {
			pressedColorInput.click();
		}
	}
	
	// Handle direct color picker changes
	function handleColorPickerChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const hex = input.value;
		const rgb = hexToRgb(hex);
		if (rgb) {
			onChange({ color: rgb });
		}
	}
	
	function handlePressedColorPickerChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const hex = input.value;
		const rgb = hexToRgb(hex);
		if (rgb) {
			onChange({ pressed_color: rgb });
		}
	}
	
	// Color update handlers
	function updateColor(rgb: string, component: 'r' | 'g' | 'b', isPressed = false) {
		const value = Number(rgb);
		if (isNaN(value) || value < 0 || value > 255) return;
		
		if (isPressed) {
			// Clone the object to avoid directly modifying reactive variable
			const newPressedColor = { ...pressedColor };
			newPressedColor[component] = value;
			onChange({ pressed_color: newPressedColor });
		} else {
			// Clone the object to avoid directly modifying reactive variable
			const newColor = { ...color };
			newColor[component] = value;
			onChange({ color: newColor });
		}
	}

	// Handle color picker changes
	function handleColorChange(newColor: { r: number, g: number, b: number }) {
		onChange({ color: newColor });
	}

	function handlePressedColorChange(newColor: { r: number, g: number, b: number }) {
		onChange({ pressed_color: newColor });
	}
	
	function updateBrightness(value: string) {
		const brightnessValue = Number(value);
		if (isNaN(brightnessValue) || brightnessValue < 0 || brightnessValue > 20) return;
		
		onChange({ brightness: brightnessValue });
	}
	
	function updateMode(value: string) {
		const modeValue = Number(value);
		onChange({ mode: modeValue });
	}
	
	// Color preview
	$: colorPreview = `rgb(${color.r}, ${color.g}, ${color.b})`;
	$: pressedColorPreview = `rgb(${pressedColor.r}, ${pressedColor.g}, ${pressedColor.b})`;
	$: colorHex = rgbToHex(color.r, color.g, color.b);
	$: pressedColorHex = rgbToHex(pressedColor.r, pressedColor.g, pressedColor.b);
	
	// Helper functions
	function componentToHex(c: number): string {
		const hex = c.toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	}

	function rgbToHex(r: number, g: number, b: number): string {
		return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			}
			: null;
	}
</script>

<div class="config-panel">
	<Tabs {tabs} bind:activeTab>
		{#if activeTab === 'color'}
		<div class="color-config">
			<div 
				class="color-preview" 
				style="background-color: {colorPreview}" 
				on:click={openColorPicker}
				title="Click to open color picker"
			>
				<div class="click-hint">Click to choose color</div>
				<input 
					type="color" 
					bind:this={colorInput} 
					value={colorHex} 
					on:input={handleColorPickerChange} 
					class="hidden-input"
				/>
			</div>
			
			<div class="hex-input">
				<label for="hex-color">Hex:</label>
				<input 
					type="text" 
					id="hex-color"
					value={colorHex} 
					on:input={(e) => {
						const hex = e.currentTarget.value;
						const rgb = hexToRgb(hex);
						if (rgb) onChange({ color: rgb });
					}}
					placeholder="#RRGGBB"
				/>
			</div>
			
			<h4>Adjust RGB Values</h4>
			<div class="color-controls">
				<div class="control-group">
					<label for="red">Red</label>
					<input 
						type="range" 
						id="red" 
						min="0" 
						max="255" 
						value={color.r} 
						on:input={(e) => updateColor(e.currentTarget.value, 'r')}
					/>
					<input 
						type="number" 
						min="0" 
						max="255" 
						value={color.r} 
						on:input={(e) => updateColor(e.currentTarget.value, 'r')}
					/>
				</div>
				
				<div class="control-group">
					<label for="green">Green</label>
					<input 
						type="range" 
						id="green" 
						min="0" 
						max="255" 
						value={color.g} 
						on:input={(e) => updateColor(e.currentTarget.value, 'g')}
					/>
					<input 
						type="number" 
						min="0" 
						max="255" 
						value={color.g} 
						on:input={(e) => updateColor(e.currentTarget.value, 'g')}
					/>
				</div>
				
				<div class="control-group">
					<label for="blue">Blue</label>
					<input 
						type="range" 
						id="blue" 
						min="0" 
						max="255" 
						value={color.b} 
						on:input={(e) => updateColor(e.currentTarget.value, 'b')}
					/>
					<input 
						type="number" 
						min="0" 
						max="255" 
						value={color.b} 
						on:input={(e) => updateColor(e.currentTarget.value, 'b')}
					/>
				</div>
			</div>
		</div>
		{:else if activeTab === 'pressed-color'}
		<div class="color-config">
			<div 
				class="color-preview" 
				style="background-color: {pressedColorPreview}" 
				on:click={openPressedColorPicker}
				title="Click to open color picker"
			>
				<div class="click-hint">Click to choose color</div>
				<input 
					type="color" 
					bind:this={pressedColorInput} 
					value={pressedColorHex} 
					on:input={handlePressedColorPickerChange} 
					class="hidden-input"
				/>
			</div>
			
			<div class="hex-input">
				<label for="hex-pressed-color">Hex:</label>
				<input 
					type="text" 
					id="hex-pressed-color"
					value={pressedColorHex} 
					on:input={(e) => {
						const hex = e.currentTarget.value;
						const rgb = hexToRgb(hex);
						if (rgb) onChange({ pressed_color: rgb });
					}}
					placeholder="#RRGGBB"
				/>
			</div>
			
			<h4>Adjust RGB Values</h4>
			<div class="color-controls">
				<div class="control-group">
					<label for="pressed-red">Red</label>
					<input 
						type="range" 
						id="pressed-red" 
						min="0" 
						max="255" 
						value={pressedColor.r} 
						on:input={(e) => updateColor(e.currentTarget.value, 'r', true)}
					/>
					<input 
						type="number" 
						min="0" 
						max="255" 
						value={pressedColor.r} 
						on:input={(e) => updateColor(e.currentTarget.value, 'r', true)}
					/>
				</div>
				
				<div class="control-group">
					<label for="pressed-green">Green</label>
					<input 
						type="range" 
						id="pressed-green" 
						min="0" 
						max="255" 
						value={pressedColor.g} 
						on:input={(e) => updateColor(e.currentTarget.value, 'g', true)}
					/>
					<input 
						type="number" 
						min="0" 
						max="255" 
						value={pressedColor.g} 
						on:input={(e) => updateColor(e.currentTarget.value, 'g', true)}
					/>
				</div>
				
				<div class="control-group">
					<label for="pressed-blue">Blue</label>
					<input 
						type="range" 
						id="pressed-blue" 
						min="0" 
						max="255" 
						value={pressedColor.b} 
						on:input={(e) => updateColor(e.currentTarget.value, 'b', true)}
					/>
					<input 
						type="number" 
						min="0" 
						max="255" 
						value={pressedColor.b} 
						on:input={(e) => updateColor(e.currentTarget.value, 'b', true)}
					/>
				</div>
			</div>
		</div>
		{/if}
	</Tabs>
	
	<div class="additional-settings">
		<h3>LED Settings</h3>
		
		<div class="control-group">
			<label for="brightness">Brightness</label>
			<input 
				type="range" 
				id="brightness" 
				min="0" 
				max="20" 
				value={brightness} 
				on:input={(e) => updateBrightness(e.currentTarget.value)}
			/>
			<input 
				type="number" 
				min="0" 
				max="20" 
				value={brightness} 
				on:input={(e) => updateBrightness(e.currentTarget.value)}
			/>
		</div>
		
		<div class="control-group">
			<label for="mode">Mode</label>
			<select id="mode" value={mode} on:change={(e) => updateMode(e.currentTarget.value)}>
				{#each colorModes as modeOption}
					<option value={modeOption.id}>{modeOption.name}</option>
				{/each}
			</select>
		</div>
	</div>
</div>

<style>
	.config-panel {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		height: 100%;
		overflow-y: auto;
	}
	
	.color-config {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem 0;
	}
	
	.color-preview {
		width: 100%;
		height: 80px;
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		position: relative;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.color-preview:hover {
		box-shadow: 0 0 0 2px var(--accent-color);
	}
	
	.click-hint {
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		opacity: 0;
		transition: opacity 0.2s;
	}
	
	.color-preview:hover .click-hint {
		opacity: 1;
	}
	
	.hidden-input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}
	
	.hex-input {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	
	.hex-input label {
		font-size: 0.875rem;
		color: var(--text-secondary);
		width: 40px;
	}
	
	.hex-input input {
		flex: 1;
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid var(--border-color);
		background-color: var(--bg-primary);
		color: var(--text-primary);
		font-family: monospace;
	}

	.color-picker-container {
		margin: 0.5rem 0 1rem 0;
		padding: 0.75rem;
		background-color: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
	}
	
	.color-controls {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	
	.control-group {
		display: grid;
		grid-template-columns: 80px 1fr 60px;
		align-items: center;
		gap: 0.75rem;
	}
	
	.additional-settings {
		border-top: 1px solid var(--border-color);
		padding-top: 1rem;
	}
	
	h3 {
		margin-bottom: 1rem;
		font-size: 1rem;
		font-weight: 600;
	}

	h4 {
		margin: 0.5rem 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-secondary);
	}
	
	input[type="range"] {
		width: 100%;
	}
	
	input[type="number"] {
		width: 60px;
		text-align: center;
	}
	
	select {
		grid-column: 2 / span 2;
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid var(--border-color);
		background-color: var(--bg-primary);
		color: var(--text-primary);
	}
</style> 