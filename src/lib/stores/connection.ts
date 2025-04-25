import { writable } from 'svelte/store';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'mock';

export interface ConnectionState {
	connected: boolean;
	lastConnected: Date | null;
	status: ConnectionStatus;
	error: string | null;
	usingMockData: boolean;
}

const initialState: ConnectionState = {
	connected: false,
	lastConnected: null,
	status: 'disconnected',
	error: null,
	usingMockData: false
};

export const connection = writable<ConnectionState>(initialState);

export function updateConnectionStatus(status: ConnectionStatus, error: string | null = null) {
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
	connection.set(initialState);
}
