/**
 * API endpoint definitions for the ESP32 macropad
 */
export const API_ENDPOINTS = {
	CONFIG: {
		COMPONENTS: '/api/config/components',
		ACTIONS: '/api/config/actions',
		EXAMPLE: '/api/config/example',
		INFO: '/api/config/info',
		LEDS: '/api/config/leds',
		REPORTS: '/api/config/reports',
		DISPLAY: '/api/config/display'
	},
	MACROS: {
		GET: (name: string) => `/api/macros/${name}`,
		LIST: '/api/macros'
	}
};

/**
 * Helper function to get a macro endpoint by name
 */
export const getMacroEndpoint = (name: string): string => {
	return API_ENDPOINTS.MACROS.GET(name);
};
