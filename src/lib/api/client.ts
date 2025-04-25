import type { MacropadConfig } from '$lib/types/config';
import type { Macro } from '$lib/types/macro';
import { API_ENDPOINTS } from './endpoints';
import { updateConnectionStatus } from '$lib/stores/connection';
import { fetchMockData, hasMockData } from './mockDataFallback';

// Base URL for API requests - using relative URLs will make it work with any host
const API_BASE_URL = '';

// Default request timeout in milliseconds
const DEFAULT_TIMEOUT = 10000;

// Maximum retry attempts
const MAX_RETRIES = 3;

// Delay between retries in milliseconds
const RETRY_DELAY = 1000;

// Flag to enable/disable mock data fallback
const USE_MOCK_DATA_FALLBACK = true;

/**
 * Base API client class for making HTTP requests to the macropad
 */
export class ApiClient {
	/**
	 * Make a request to the macropad API with retry logic
	 * @param endpoint The API endpoint to request
	 * @param options Fetch options
	 * @returns Promise with the response data
	 */
	static async request<T>(
		endpoint: string,
		options: RequestInit = {},
		timeout: number = DEFAULT_TIMEOUT,
		retryCount: number = 0
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
					Accept: 'application/json',
					...options.headers
				},
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				// Store response clone before attempting to read body
				const responseClone = response.clone();

				// Handle specific HTTP status codes
				if (response.status === 501) {
					updateConnectionStatus('disconnected', `API endpoint not implemented: ${endpoint}`);
					throw new Error(
						`API endpoint not implemented: ${endpoint}. This feature might be available in a future firmware update.`
					);
				}

				// Try to parse error response as JSON first
				try {
					const errorJson = await response.json();
					updateConnectionStatus(
						'disconnected',
						`${response.status}: ${JSON.stringify(errorJson)}`
					);
					throw new Error(
						`API Error: ${response.status} ${response.statusText}\n${JSON.stringify(errorJson)}`
					);
				} catch (e) {
					// If not JSON, use text from clone
					const errorText = await responseClone.text();
					updateConnectionStatus('disconnected', `${response.status}: ${errorText}`);
					throw new Error(`API Error: ${response.status} ${response.statusText}\n${errorText}`);
				}
			}

			updateConnectionStatus('connected');

			// Return empty object for 204 No Content responses
			if (response.status === 204) {
				return {} as T;
			}

			// Create a clone before trying to parse
			const responseClone = response.clone();

			// Try to parse response as JSON
			try {
				const contentType = response.headers.get('content-type');
				if (contentType && contentType.includes('application/json')) {
					return await response.json();
				} else {
					// If not JSON, try to parse as text and then as JSON
					const text = await responseClone.text();
					try {
						return JSON.parse(text);
					} catch (e) {
						// If text is not valid JSON, return it as is
						return text as unknown as T;
					}
				}
			} catch (error) {
				console.warn(`Failed to parse response as JSON for ${url}:`, error);
				// Return empty object for non-JSON responses
				return {} as T;
			}
		} catch (error) {
			clearTimeout(timeoutId);

			// Handle specific error types
			if (error instanceof DOMException && error.name === 'AbortError') {
				updateConnectionStatus('disconnected', 'Request timeout');
				if (retryCount < MAX_RETRIES) {
					console.log(`Retrying request to ${url} (attempt ${retryCount + 1}/${MAX_RETRIES})`);
					await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
					return this.request<T>(endpoint, options, timeout, retryCount + 1);
				}

				// After max retries, try to use mock data if available
				if (USE_MOCK_DATA_FALLBACK && hasMockData(endpoint)) {
					console.log(`Falling back to mock data for ${endpoint}`);
					try {
						const mockData = await fetchMockData<T>(endpoint);
						updateConnectionStatus('mock', `Using mock data for ${endpoint}`);
						return mockData;
					} catch (mockError) {
						console.error(`Failed to load mock data for ${endpoint}:`, mockError);
						throw new Error(`Request timeout after ${MAX_RETRIES} attempts: ${url}`);
					}
				}

				throw new Error(`Request timeout after ${MAX_RETRIES} attempts: ${url}`);
			}

			updateConnectionStatus(
				'disconnected',
				error instanceof Error ? error.message : 'Unknown error'
			);

			// Retry on network errors
			if (
				retryCount < MAX_RETRIES &&
				(error instanceof TypeError || error instanceof DOMException)
			) {
				console.log(`Retrying request to ${url} (attempt ${retryCount + 1}/${MAX_RETRIES})`);
				await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
				return this.request<T>(endpoint, options, timeout, retryCount + 1);
			}

			// If all retries fail, try to use mock data if available
			if (USE_MOCK_DATA_FALLBACK && hasMockData(endpoint)) {
				console.log(`Falling back to mock data for ${endpoint}`);
				try {
					const mockData = await fetchMockData<T>(endpoint);
					updateConnectionStatus('mock', `Using mock data for ${endpoint}`);
					return mockData;
				} catch (mockError) {
					console.error(`Failed to load mock data for ${endpoint}:`, mockError);
					throw error;
				}
			}

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
	static async post<T>(
		endpoint: string,
		data: any,
		options: {
			timeout?: number;
			params?: Record<string, string>;
		} = {}
	): Promise<T> {
		// Add query parameters if provided
		let url = endpoint;
		if (options.params) {
			const queryParams = new URLSearchParams();
			Object.entries(options.params).forEach(([key, value]) => {
				queryParams.append(key, value);
			});
			url += `?${queryParams.toString()}`;
		}

		return this.request<T>(
			url,
			{
				method: 'POST',
				body: data ? JSON.stringify(data) : null
			},
			options.timeout
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
	 * Scan for available WiFi networks
	 */
	static async scanWiFiNetworks() {
		const response = await this.request<{ networks: any[] }>(API_ENDPOINTS.WIFI.SCAN);
		return response.networks;
	}

	/**
	 * Get current WiFi configuration
	 */
	static async getWiFiConfig() {
		return this.request(API_ENDPOINTS.WIFI.CONFIG);
	}

	/**
	 * Connect to a WiFi network
	 */
	static async connectToWiFi(
		ssid: string,
		password: string,
		apMode: boolean = false,
		apName: string = ''
	) {
		return this.post(API_ENDPOINTS.WIFI.CONFIG, {
			ssid,
			password,
			ap_mode: apMode,
			ap_name: apName
		});
	}

	/**
	 * Get system status including WiFi status
	 */
	static async getSystemStatus() {
		return this.request(API_ENDPOINTS.WIFI.STATUS);
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
		return this.request(API_ENDPOINTS.MACROS.CREATE, {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}
}
