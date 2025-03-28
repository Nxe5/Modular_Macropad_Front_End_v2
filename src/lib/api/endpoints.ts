/**
 * API endpoint definitions for the ESP32 macropad
 */
export const API_ENDPOINTS = {
	CONFIG: {
		COMPONENTS: '/config/components',
		ACTIONS: '/config/actions',
		EXAMPLE: '/config/example',
		INFO: '/config/info',
		LEDS: '/config/leds',
		REPORTS: '/config/reports',
		DISPLAY: '/config/display'
	},
	MACROS: {
		GET: (name: string) => `/macros/${name}`,
		LIST: '/macros'
	}
};

/**
 * Helper function to get a macro endpoint by name
 */
export const getMacroEndpoint = (name: string): string => {
	return API_ENDPOINTS.MACROS.GET(name);
};
