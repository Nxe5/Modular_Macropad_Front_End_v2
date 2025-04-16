import { ApiClient } from './client';
import type { MacropadConfig } from '$lib/types/config';
import { API_ENDPOINTS } from './endpoints';

/**
 * API client for configuration endpoints
 */
export class ConfigApi {
	/**
	 * Get all components configuration
	 */
	static async getComponents() {
		return ApiClient.get(API_ENDPOINTS.CONFIG.COMPONENTS);
	}

	/**
	 * Update components configuration
	 */
	static async updateComponents(data: any) {
		return ApiClient.post(API_ENDPOINTS.CONFIG.COMPONENTS, data);
	}

	/**
	 * Get actions configuration
	 */
	static async getActions() {
		return ApiClient.get(API_ENDPOINTS.CONFIG.ACTIONS);
	}

	/**
	 * Update actions configuration
	 */
	static async updateActions(data: any) {
		return ApiClient.post(API_ENDPOINTS.CONFIG.ACTIONS, data);
	}

	/**
	 * Get example configuration
	 */
	static async getExample() {
		return ApiClient.get(API_ENDPOINTS.CONFIG.EXAMPLE);
	}

	/**
	 * Get macropad info
	 */
	static async getInfo() {
		return ApiClient.get(API_ENDPOINTS.CONFIG.INFO);
	}

	/**
	 * Get LED configuration
	 */
	static async getLeds() {
		return ApiClient.get(API_ENDPOINTS.CONFIG.LEDS);
	}

	/**
	 * Update LED configuration
	 */
	static async updateLeds(data: any) {
		return ApiClient.post(API_ENDPOINTS.CONFIG.LEDS, data);
	}

	/**
	 * Get reports configuration
	 */
	static async getReports() {
		return ApiClient.get(API_ENDPOINTS.CONFIG.REPORTS);
	}

	/**
	 * Get display configuration
	 */
	static async getDisplay() {
		return ApiClient.get(API_ENDPOINTS.CONFIG.DISPLAY);
	}

	/**
	 * Update display configuration
	 */
	static async updateDisplay(data: any) {
		return ApiClient.post(API_ENDPOINTS.CONFIG.DISPLAY, data);
	}

	/**
	 * Restore config from defaults
	 */
	static async restoreConfig(configName: string) {
		return ApiClient.post('/api/config/restore', null, {
			params: { config: configName }
		});
	}
}
