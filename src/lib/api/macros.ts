import { ApiClient } from './client';
import type { Macro } from '$lib/types/macro';
import { API_ENDPOINTS } from './endpoints';

// Define interfaces for the API responses
interface MacroListItem {
	id: string;
	name: string;
	description: string;
}

interface MacrosListResponse {
	macros: MacroListItem[];
}

interface MacroResponse {
	id: string;
	name: string;
	description: string;
	commands: any[];
	[key: string]: any;
}

/**
 * API client for macros endpoints
 */
export class MacrosApi {
	/**
	 * Get a list of all available macros
	 */
	static async getAllMacros(): Promise<string[]> {
		try {
			const response = await ApiClient.get<MacrosListResponse>(API_ENDPOINTS.MACROS.LIST);
			console.log('API Response:', response);

			// Check if the response has a 'macros' property
			if (response && response.macros && Array.isArray(response.macros)) {
				// Extract the IDs from the macros array and sort them
				const macroIds = response.macros.map((macro) => macro.id);
				// Sort by numeric prefix if present, otherwise alphabetically
				return macroIds.sort((a, b) => {
					// Extract numeric prefixes if they exist
					const aMatch = a.match(/^(\d+)_/);
					const bMatch = b.match(/^(\d+)_/);

					if (aMatch && bMatch) {
						// Both have numeric prefixes, sort by number
						return parseInt(aMatch[1]) - parseInt(bMatch[1]);
					} else if (aMatch) {
						// Only a has numeric prefix, it comes first
						return -1;
					} else if (bMatch) {
						// Only b has numeric prefix, it comes first
						return 1;
					} else {
						// No numeric prefixes, sort alphabetically
						return a.localeCompare(b);
					}
				});
			}

			// Fallback to the old format if needed
			if (Array.isArray(response)) {
				return response;
			}

			console.error('Unexpected response format:', response);
			return [];
		} catch (error) {
			console.error('Error fetching macros:', error);
			throw error;
		}
	}

	/**
	 * Get a specific macro by name
	 */
	static async getMacro(macroId: string): Promise<MacroResponse> {
		try {
			const response = await ApiClient.get<MacroResponse | MacrosListResponse>(
				API_ENDPOINTS.MACROS.GET(macroId)
			);
			console.log(`Fetched macro ${macroId}:`, response);

			// If the response is an object with a 'macros' property, find the matching macro
			if (response && 'macros' in response && Array.isArray(response.macros)) {
				const macro = response.macros.find((m) => m.id === macroId);
				if (macro) {
					console.log(`Found macro ${macroId} in list:`, macro);
					return macro as MacroResponse;
				}
			}

			// If the response is a direct macro object, return it
			if (response && 'id' in response) {
				console.log(`Using direct macro object for ${macroId}:`, response);
				return response as MacroResponse;
			}

			console.error('Unexpected macro response format:', response);
			throw new Error('Invalid macro data format');
		} catch (error) {
			console.error(`Error fetching macro ${macroId}:`, error);
			throw error;
		}
	}

	/**
	 * Create or update a macro
	 */
	static async saveMacro(macroId: string, macroData: MacroResponse): Promise<void> {
		try {
			await ApiClient.post(API_ENDPOINTS.MACROS.GET(macroId), macroData);
		} catch (error) {
			console.error(`Error saving macro ${macroId}:`, error);
			throw error;
		}
	}

	/**
	 * Delete a macro
	 */
	static async deleteMacro(macroId: string): Promise<void> {
		try {
			await ApiClient.delete(API_ENDPOINTS.MACROS.GET(macroId));
		} catch (error) {
			console.error(`Error deleting macro ${macroId}:`, error);
			throw error;
		}
	}
}
