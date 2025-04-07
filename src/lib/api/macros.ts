import { ApiClient } from './client';
import type { Macro } from '$lib/types/macro';
import { API_ENDPOINTS } from './endpoints';

/**
 * API client for macros endpoints
 */
export class MacrosApi {
	/**
	 * Get a list of all available macros
	 */
	static async getAllMacros() {
		try {
			const response = await ApiClient.get<{
				macros: Array<{ id: string; name: string; description: string }>;
			}>(API_ENDPOINTS.MACROS.LIST);
			// Extract just the IDs from the macros array
			return response.macros.map((macro) => macro.id);
		} catch (error) {
			console.error('Error fetching macro list:', error);
			return [];
		}
	}

	/**
	 * Get a specific macro by name
	 */
	static async getMacro(name: string) {
		try {
			// Use a direct fetch to get the individual macro content
			const response = await fetch(`/api/macros/${name}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch macro: ${response.status} ${response.statusText}`);
			}

			// Parse the response as JSON
			const data = await response.json();
			console.log(`Fetched macro ${name}:`, data);
			return data;
		} catch (error) {
			console.error(`Error fetching macro ${name}:`, error);
			throw error;
		}
	}

	/**
	 * Create or update a macro
	 */
	static async saveMacro(name: string, data: Macro) {
		// The firmware expects a POST to /api/macros with the macro data
		// The name is included in the data object
		return ApiClient.post('/api/macros', data);
	}

	/**
	 * Delete a macro
	 */
	static async deleteMacro(name: string) {
		return ApiClient.delete(API_ENDPOINTS.MACROS.GET(name));
	}
}
