import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { updateConnectionStatus } from '$lib/stores/connection';

// WebSocket URL
const WS_URL = 'ws://localhost:8080/ws';

// WebSocket reconnect interval in milliseconds
const RECONNECT_INTERVAL = 3000;

// Store for real-time data received from the WebSocket
export const socketData = writable<any>(null);

// Store for tracking if WebSocket is connected
export const socketConnected = writable<boolean>(false);

// WebSocket instance
let socket: WebSocket | null = null;

// Reconnect timer
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Connect to the WebSocket server
 */
export function connectWebSocket() {
	if (!browser) return;

	// Clear any existing reconnect timer
	if (reconnectTimer) {
		clearTimeout(reconnectTimer);
		reconnectTimer = null;
	}

	// Close existing socket if it exists
	if (socket) {
		try {
			socket.close();
		} catch (e) {
			// Ignore errors on close
		}
	}

	try {
		updateConnectionStatus('connecting');
		socket = new WebSocket(WS_URL);

		socket.onopen = () => {
			socketConnected.set(true);
			updateConnectionStatus('connected');
			console.log('WebSocket connected');
		};

		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				socketData.set(data);
			} catch (error) {
				console.error('Failed to parse WebSocket message:', error);
			}
		};

		socket.onclose = () => {
			socketConnected.set(false);
			updateConnectionStatus('disconnected');
			console.log('WebSocket disconnected. Reconnecting...');

			// Schedule reconnect
			reconnectTimer = setTimeout(() => {
				connectWebSocket();
			}, RECONNECT_INTERVAL);
		};

		socket.onerror = (error) => {
			console.error('WebSocket error:', error);
			socket?.close();
		};
	} catch (error) {
		console.error('WebSocket connection error:', error);
		updateConnectionStatus('disconnected', 'Connection error');

		// Schedule reconnect
		reconnectTimer = setTimeout(() => {
			connectWebSocket();
		}, RECONNECT_INTERVAL);
	}
}

/**
 * Disconnect from the WebSocket server
 */
export function disconnectWebSocket() {
	if (!browser) return;

	if (reconnectTimer) {
		clearTimeout(reconnectTimer);
		reconnectTimer = null;
	}

	if (socket) {
		try {
			socket.close();
		} catch (e) {
			// Ignore errors on close
		}
		socket = null;
	}

	socketConnected.set(false);
}

/**
 * Send data through the WebSocket
 */
export function sendSocketMessage(data: any) {
	if (!socket || socket.readyState !== WebSocket.OPEN) {
		console.error('WebSocket not connected');
		return false;
	}

	try {
		socket.send(JSON.stringify(data));
		return true;
	} catch (error) {
		console.error('Failed to send WebSocket message:', error);
		return false;
	}
}
