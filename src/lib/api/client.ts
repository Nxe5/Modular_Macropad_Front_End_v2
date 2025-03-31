import type { MacropadConfig } from '$lib/types/config';
import type { Macro } from '$lib/types/macro';
import { API_ENDPOINTS } from './endpoints';
import { updateConnectionStatus } from '$lib/stores/connection';

// Base URL for API requests - using relative URLs will make it work with any host
const API_BASE_URL = '';

// Default request timeout in milliseconds
const DEFAULT_TIMEOUT = 5000;

/**
 * Base API client class for making HTTP requests to the macropad
 */
export class ApiClient {
	/**
	 * Make a request to the macropad API
	 * @param endpoint The API endpoint to request
	 * @param options Fetch options
	 * @returns Promise with the response data
	 */
	static async request<T>(
		endpoint: string,
		options: RequestInit = {},
		timeout: number = DEFAULT_TIMEOUT
	): Promise<T> {
		const url = `${API_BASE_URL}${endpoint}`;

		// Create abort controller for timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			updateConnectionStatus('connecting');

			const response = await fetch(url, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...options.headers
				},
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorText = await response.text();
				updateConnectionStatus('disconnected', `${response.status}: ${errorText}`);
				throw new Error(`API Error: ${response.status} ${response.statusText}\n${errorText}`);
			}

			updateConnectionStatus('connected');

			// Return empty object for 204 No Content responses
			if (response.status === 204) {
				return {} as T;
			}

			return await response.json();
		} catch (error) {
			clearTimeout(timeoutId);

			if (error instanceof DOMException && error.name === 'AbortError') {
				updateConnectionStatus('disconnected', 'Request timeout');
				throw new Error(`Request timeout: ${url}`);
			}

			updateConnectionStatus(
				'disconnected',
				error instanceof Error ? error.message : 'Unknown error'
			);
			throw error;
		}
	}

	/**
	 * Make a GET request to the API
	 */
	static async get<T>(endpoint: string, timeout?: number): Promise<T> {
		return this.request<T>(endpoint, { method: 'GET' }, timeout);
	}

	/**
	 * Make a POST request to the API
	 */
	static async post<T>(endpoint: string, data: any, timeout?: number): Promise<T> {
		return this.request<T>(
			endpoint,
			{
				method: 'POST',
				body: JSON.stringify(data)
			},
			timeout
		);
	}

	/**
	 * Make a PUT request to the API
	 */
	static async put<T>(endpoint: string, data: any, timeout?: number): Promise<T> {
		return this.request<T>(
			endpoint,
			{
				method: 'PUT',
				body: JSON.stringify(data)
			},
			timeout
		);
	}

	/**
	 * Make a DELETE request to the API
	 */
	static async delete<T>(endpoint: string, timeout?: number): Promise<T> {
		return this.request<T>(endpoint, { method: 'DELETE' }, timeout);
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
