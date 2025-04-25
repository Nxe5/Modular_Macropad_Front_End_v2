/**
 * API utility functions
 */

// Interface for fetch with timeout options
interface FetchWithTimeoutOptions extends RequestInit {
	timeout?: number;
}

/**
 * Fetch with timeout functionality to prevent hanging requests
 * @param url - URL to fetch
 * @param options - Fetch options with optional timeout
 * @returns Promise resolving to fetch response
 */
export async function fetchWithTimeout(
	url: string,
	options: FetchWithTimeoutOptions = {}
): Promise<Response> {
	const { timeout = 8000, ...fetchOptions } = options;

	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...fetchOptions,
			signal: controller.signal
		});
		clearTimeout(id);
		return response;
	} catch (error: unknown) {
		clearTimeout(id);
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error(`Request timed out after ${timeout}ms`);
		}
		throw error;
	}
}

/**
 * Format error message from various error types
 * @param error - Error object or message
 * @returns Formatted error message
 */
export function formatErrorMessage(error: any): string {
	if (typeof error === 'string') return error;
	if (error instanceof Error) return error.message;
	if (error && typeof error === 'object' && 'message' in error) return error.message;
	return 'An unknown error occurred';
}
