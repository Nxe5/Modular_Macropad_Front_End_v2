import { writable } from 'svelte/store';

export interface ConnectionState {
	connected: boolean;
	lastConnected: Date | null;
	status: 'connected' | 'disconnected' | 'connecting';
	error: string | null;
}

const initialState: ConnectionState = {
	connected: false,
	lastConnected: null,
	status: 'disconnected',
	error: null
};

export const connection = writable<ConnectionState>(initialState);

export function updateConnectionStatus(
	status: 'connected' | 'disconnected' | 'connecting',
	error: string | null = null
) {
	connection.update((state) => {
		const newState = { ...state, status, error };

		if (status === 'connected') {
			newState.connected = true;
			newState.lastConnected = new Date();
		} else if (status === 'disconnected') {
			newState.connected = false;
		}

		return newState;
	});
}

export function resetConnection() {
	connection.set(initialState);
}
