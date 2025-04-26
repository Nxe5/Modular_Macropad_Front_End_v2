/**
 * LED utility functions for conversions between UI and firmware
 */

/**
 * Convert brightness from UI scale (0-20) to firmware scale (0-255)
 * @param uiBrightness Brightness value in UI scale (0-20)
 * @returns Brightness value in firmware scale (0-255)
 */
export function uiToFirmwareBrightness(uiBrightness: number): number {
	// Ensure the input is within valid range
	const validUiBrightness = Math.max(0, Math.min(20, uiBrightness));

	// Convert from 0-20 to 0-255 scale
	return Math.round((validUiBrightness / 20) * 255);
}

/**
 * Convert brightness from firmware scale (0-255) to UI scale (0-20)
 * @param firmwareBrightness Brightness value in firmware scale (0-255)
 * @returns Brightness value in UI scale (0-20)
 */
export function firmwareToUiBrightness(firmwareBrightness: number): number {
	// Ensure the input is within valid range
	const validFirmwareBrightness = Math.max(0, Math.min(255, firmwareBrightness));

	// Convert from 0-255 to 0-20 scale
	return Math.round((validFirmwareBrightness / 255) * 20);
}

/**
 * Process LED data for API submission by converting UI brightness to firmware brightness
 * @param ledsData LED configuration data
 * @returns Processed LED configuration with firmware-compatible brightness values
 */
export function processLedsForApi(ledsData: any): any {
	// Create a deep copy to avoid modifying the original
	const processedData = JSON.parse(JSON.stringify(ledsData));

	if (!processedData || !processedData.leds) return processedData;

	// Process global brightness if present
	if (processedData.leds.brightness !== undefined) {
		processedData.leds.brightness = uiToFirmwareBrightness(processedData.leds.brightness);
	}

	// Process layers if using the new format
	if (processedData.leds.layers && Array.isArray(processedData.leds.layers)) {
		for (const layer of processedData.leds.layers) {
			// Process layer brightness
			if (layer.brightness !== undefined) {
				layer.brightness = uiToFirmwareBrightness(layer.brightness);
			}

			// Process individual LEDs in layer
			if (layer['layer-config'] && Array.isArray(layer['layer-config'])) {
				for (const led of layer['layer-config']) {
					if (led.brightness !== undefined) {
						led.brightness = uiToFirmwareBrightness(led.brightness);
					}
				}
			}
		}
	} else if (processedData.leds.config && Array.isArray(processedData.leds.config)) {
		// Legacy format - process individual LEDs
		for (const led of processedData.leds.config) {
			if (led.brightness !== undefined) {
				led.brightness = uiToFirmwareBrightness(led.brightness);
			}
		}
	}

	return processedData;
}

/**
 * Process LED data from API response by converting firmware brightness to UI brightness
 * @param ledsData LED configuration data from API
 * @returns Processed LED configuration with UI-compatible brightness values
 */
export function processLedsFromApi(ledsData: any): any {
	// Create a deep copy to avoid modifying the original
	const processedData = JSON.parse(JSON.stringify(ledsData));

	if (!processedData || !processedData.leds) return processedData;

	// Process global brightness if present
	if (processedData.leds.brightness !== undefined) {
		processedData.leds.brightness = firmwareToUiBrightness(processedData.leds.brightness);
	}

	// Process layers if using the new format
	if (processedData.leds.layers && Array.isArray(processedData.leds.layers)) {
		for (const layer of processedData.leds.layers) {
			// Process layer brightness
			if (layer.brightness !== undefined) {
				layer.brightness = firmwareToUiBrightness(layer.brightness);
			}

			// Process individual LEDs in layer
			if (layer['layer-config'] && Array.isArray(layer['layer-config'])) {
				for (const led of layer['layer-config']) {
					if (led.brightness !== undefined) {
						led.brightness = firmwareToUiBrightness(led.brightness);
					}
				}
			}
		}
	} else if (processedData.leds.config && Array.isArray(processedData.leds.config)) {
		// Legacy format - process individual LEDs
		for (const led of processedData.leds.config) {
			if (led.brightness !== undefined) {
				led.brightness = firmwareToUiBrightness(led.brightness);
			}
		}
	}

	return processedData;
}
