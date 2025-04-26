import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'mock';

export interface ConnectionState {
	connected: boolean;
	lastConnected: Date | null;
	status: ConnectionStatus;
	error: string | null;
	usingMockData: boolean;
}

// Always start with mock data for development
const initialState: ConnectionState = {
	connected: true,
	lastConnected: new Date(),
	status: 'mock',
	error: null,
	usingMockData: true
};

// Create store
export const connection = writable<ConnectionState>(initialState);

// Try to persist the mock data status across page reloads
if (browser) {
	// Set mock data flag and save it to storage
	localStorage.setItem('useMockData', 'true');
}

export function updateConnectionStatus(status: ConnectionStatus, error: string | null = null) {
	// Force mock data status in development
	if (browser && localStorage.getItem('useMockData') === 'true' && status !== 'mock') {
		status = 'mock';
	}

	connection.update((state) => {
		const newState = { ...state, status, error };

		if (status === 'connected') {
			newState.connected = true;
			newState.lastConnected = new Date();
			newState.usingMockData = false;
		} else if (status === 'disconnected') {
			newState.connected = false;
			newState.usingMockData = false;
		} else if (status === 'mock') {
			newState.connected = true;
			newState.lastConnected = new Date();
			newState.usingMockData = true;
		}

		return newState;
	});
}

export function resetConnection() {
	// Don't reset to disconnected state in development
	if (browser && localStorage.getItem('useMockData') === 'true') {
		connection.set(initialState);
	} else {
		connection.set({
			connected: false,
			lastConnected: null,
			status: 'disconnected',
			error: null,
			usingMockData: false
		});
	}
}
