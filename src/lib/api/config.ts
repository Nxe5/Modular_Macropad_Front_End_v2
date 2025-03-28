import { ApiClient } from './client';
import type { MacropadConfig } from '$lib/types/config';

/**
 * API client for configuration endpoints
 */
export class ConfigApi {
	/**
	 * Get all components configuration
	 */
	static async getComponents() {
		return ApiClient.get('/config/components');
	}

	/**
	 * Update components configuration
	 */
	static async updateComponents(data: any) {
		return ApiClient.post('/config/components', data);
	}

	/**
	 * Get actions configuration
	 */
	static async getActions() {
		return ApiClient.get('/config/actions');
	}

	/**
	 * Update actions configuration
	 */
	static async updateActions(data: any) {
		return ApiClient.post('/config/actions', data);
	}

	/**
	 * Get example configuration
	 */
	static async getExample() {
		return ApiClient.get('/config/example');
	}

	/**
	 * Get macropad info
	 */
	static async getInfo() {
		return ApiClient.get('/config/info');
	}

	/**
	 * Get LED configuration
	 */
	static async getLeds() {
		return ApiClient.get('/config/leds');
	}

	/**
	 * Update LED configuration
	 */
	static async updateLeds(data: any) {
		return ApiClient.post('/config/leds', data);
	}

	/**
	 * Get reports configuration
	 */
	static async getReports() {
		return ApiClient.get('/config/reports');
	}

	/**
	 * Get display configuration
	 */
	static async getDisplay() {
		return ApiClient.get('/config/display');
	}

	/**
	 * Update display configuration
	 */
	static async updateDisplay(data: any) {
		return ApiClient.post('/config/display', data);
	}
}
