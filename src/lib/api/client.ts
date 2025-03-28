import type { MacropadConfig } from '$lib/types/config';
import type { Macro } from '$lib/types/macro';
import { API_ENDPOINTS } from './endpoints';

// TODO: Replace with actual ESP32 IP when deploying
const API_BASE_URL = 'http://localhost:8080';

/**
 * API client for communicating with the ESP32 macropad
 */
export class ApiClient {
	/**
	 * Generic request method for API calls
	 */
	private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		try {
			const response = await fetch(`${API_BASE_URL}${endpoint}`, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...options.headers
				}
			});

			if (!response.ok) {
				throw new Error(`API Error: ${response.statusText}`);
			}

			return response.json();
		} catch (error) {
			console.error('API request failed:', error);
			throw error;
		}
	}

	/**
	 * Get components configuration
	 */
	static async getComponents() {
		return this.request(API_ENDPOINTS.CONFIG.COMPONENTS);
	}

	/**
	 * Get actions configuration
	 */
	static async getActions() {
		return this.request(API_ENDPOINTS.CONFIG.ACTIONS);
	}

	/**
	 * Get example configuration
	 */
	static async getExample() {
		return this.request(API_ENDPOINTS.CONFIG.EXAMPLE);
	}

	/**
	 * Get macropad info
	 */
	static async getInfo() {
		return this.request(API_ENDPOINTS.CONFIG.INFO);
	}

	/**
	 * Get LED configuration
	 */
	static async getLeds() {
		return this.request(API_ENDPOINTS.CONFIG.LEDS);
	}

	/**
	 * Get reports configuration
	 */
	static async getReports() {
		return this.request(API_ENDPOINTS.CONFIG.REPORTS);
	}

	/**
	 * Get display configuration
	 */
	static async getDisplay() {
		return this.request(API_ENDPOINTS.CONFIG.DISPLAY);
	}

	/**
	 * Get a specific macro by name
	 */
	static async getMacro(name: string) {
		return this.request(API_ENDPOINTS.MACROS.GET(name));
	}

	/**
	 * Get all macros
	 */
	static async getMacros() {
		return this.request(API_ENDPOINTS.MACROS.LIST);
	}

	/**
	 * Update components configuration
	 */
	static async updateComponents(data: any) {
		return this.request(API_ENDPOINTS.CONFIG.COMPONENTS, {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	/**
	 * Update actions configuration
	 */
	static async updateActions(data: any) {
		return this.request(API_ENDPOINTS.CONFIG.ACTIONS, {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	/**
	 * Update LED configuration
	 */
	static async updateLeds(data: any) {
		return this.request(API_ENDPOINTS.CONFIG.LEDS, {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	/**
	 * Update display configuration
	 */
	static async updateDisplay(data: any) {
		return this.request(API_ENDPOINTS.CONFIG.DISPLAY, {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	/**
	 * Create or update a macro
	 */
	static async saveMacro(name: string, data: any) {
		return this.request(API_ENDPOINTS.MACROS.GET(name), {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}
}
