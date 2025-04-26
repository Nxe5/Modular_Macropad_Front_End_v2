<script lang="ts">
    // Props
    export let color = { r: 0, g: 0, b: 0 };
    export let onChange = (newColor: { r: number, g: number, b: number }) => {};

    // Refs
    let colorInput: HTMLInputElement;

    // Derived values
    $: hexColor = rgbToHex(color.r, color.g, color.b);
    $: rgbString = `rgb(${color.r}, ${color.g}, ${color.b})`;
    
    // Handle preview click - open color picker
    function handlePreviewClick() {
        if (colorInput) {
            colorInput.click();
        }
    }
    
    // Handle input change
    function handleHexChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const hex = input.value;
        if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
            const rgb = hexToRgb(hex);
            if (rgb) {
                onChange(rgb);
            }
        }
    }

    // Handle direct color picker change
    function handleColorPickerChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const hex = input.value;
        const rgb = hexToRgb(hex);
        if (rgb) {
            onChange(rgb);
        }
    }

    // Utility functions
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

<div class="color-picker">
    <div 
        class="color-preview" 
        style="background-color: {rgbString}"
        on:click={handlePreviewClick}
        title="Click to open color picker"
    >
        <div class="preview-hint">Choose color</div>
    </div>
    <div class="color-inputs">
        <input 
            type="color" 
            value={hexColor} 
            on:input={handleColorPickerChange}
            aria-label="Color picker"
            title="Pick a color"
            bind:this={colorInput}
            class="color-input"
        />
        <input 
            type="text" 
            value={hexColor} 
            on:input={handleHexChange}
            placeholder="#000000"
            aria-label="Hex color code"
            title="Enter hex color code (e.g. #FF0000 for red)"
        />
    </div>
</div>

<style>
    .color-picker {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
    }

    .color-preview {
        height: 2rem;
        border-radius: 0.25rem;
        border: 1px solid var(--border-color);
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .color-preview:hover {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 1px var(--accent-color);
    }
    
    .preview-hint {
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 0.15rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        opacity: 0;
        transition: opacity 0.2s;
    }
    
    .color-preview:hover .preview-hint {
        opacity: 1;
    }

    .color-inputs {
        display: flex;
        gap: 0.5rem;
    }

    .color-input {
        width: 1px;
        height: 1px;
        opacity: 0.01;
        position: absolute;
        left: -9999px;
    }

    input[type="text"] {
        flex: 1;
        height: 2rem;
        padding: 0 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: 0.25rem;
        font-family: monospace;
        font-size: 0.875rem;
        background-color: var(--bg-primary);
        color: var(--text-primary);
    }
</style> 