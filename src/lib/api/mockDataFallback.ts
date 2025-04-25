import { API_ENDPOINTS } from './endpoints';

/**
 * Maps API endpoints to corresponding mock data files
 */
const mockDataMap = {
	[API_ENDPOINTS.CONFIG.COMPONENTS]: '/mock_data/config/components.json',
	[API_ENDPOINTS.CONFIG.ACTIONS]: '/mock_data/config/actions.json',
	[API_ENDPOINTS.CONFIG.EXAMPLE]: '/mock_data/config/example.json',
	[API_ENDPOINTS.CONFIG.INFO]: '/mock_data/config/info.json',
	[API_ENDPOINTS.CONFIG.LEDS]: '/mock_data/config/leds.json',
	[API_ENDPOINTS.CONFIG.REPORTS]: '/mock_data/config/reports.json',
	[API_ENDPOINTS.CONFIG.DISPLAY]: '/mock_data/config/display.json',
	[API_ENDPOINTS.WIFI.STATUS]: '/mock_data/config/status.json',
	[API_ENDPOINTS.MACROS.LIST]: '/mock_data/macros/index.json'
};

/**
 * Get the mock data file path for a given API endpoint
 */
export const getMockDataPath = (endpoint: string): string | null => {
	// Handle parameterized endpoints
	if (endpoint.startsWith('/api/macros/') && endpoint !== '/api/macros') {
		const macroName = endpoint.replace('/api/macros/', '');
		return `/mock_data/macros/${macroName}.json`;
	}

	return mockDataMap[endpoint] || null;
};

/**
 * Fetch mock data for the given endpoint
 */
export const fetchMockData = async <T>(endpoint: string): Promise<T> => {
	const mockPath = getMockDataPath(endpoint);

	if (!mockPath) {
		throw new Error(`No mock data available for endpoint: ${endpoint}`);
	}

	try {
		console.log(`Fetching mock data from ${mockPath}`);
		const response = await fetch(mockPath);

		if (!response.ok) {
			console.error(`Failed to fetch mock data: ${response.status} ${response.statusText}`);
			throw new Error(`Failed to fetch mock data from ${mockPath}`);
		}

		return (await response.json()) as T;
	} catch (error) {
		console.error(`Error fetching mock data for ${endpoint}:`, error);

		// Provide fallback default data for critical endpoints
		if (endpoint === API_ENDPOINTS.CONFIG.INFO) {
			console.log('Using hardcoded fallback for INFO endpoint');
			return {
				name: 'Modular Macropad (Mock)',
				version: '1.0.0-mock',
				device_id: 'MOCK-123456',
				features: ['keys', 'encoders', 'leds', 'display'],
				status: 'ready'
			} as unknown as T;
		}

		if (endpoint === API_ENDPOINTS.CONFIG.COMPONENTS) {
			console.log('Using hardcoded fallback for COMPONENTS endpoint');
			return {
				rows: 3,
				cols: 3,
				encoders: 2,
				leds: 9,
				display: true
			} as unknown as T;
		}

		if (endpoint === API_ENDPOINTS.CONFIG.ACTIONS) {
			console.log('Using hardcoded fallback for ACTIONS endpoint');
			return {
				actions: [
					{ id: 'press', name: 'Press', type: 'key' },
					{ id: 'release', name: 'Release', type: 'key' },
					{ id: 'type', name: 'Type', type: 'text' }
				]
			} as unknown as T;
		}

		throw error;
	}
};

/**
 * Check if mock data is available for a specific endpoint
 */
export const hasMockData = (endpoint: string): boolean => {
	return getMockDataPath(endpoint) !== null;
};
