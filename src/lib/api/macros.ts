import { ApiClient } from './client';
import type { Macro } from '$lib/types/macro';

/**
 * API client for macros endpoints
 */
export class MacrosApi {
	/**
	 * Get a list of all available macros
	 */
	static async getAllMacros() {
		return ApiClient.get<string[]>('/macros');
	}

	/**
	 * Get a specific macro by name
	 */
	static async getMacro(name: string) {
		return ApiClient.get<Macro>(`/macros/${name}`);
	}

	/**
	 * Create or update a macro
	 */
	static async saveMacro(name: string, data: Macro) {
		return ApiClient.post(`/macros/${name}`, data);
	}

	/**
	 * Delete a macro
	 */
	static async deleteMacro(name: string) {
		return ApiClient.delete(`/macros/${name}`);
	}
}
