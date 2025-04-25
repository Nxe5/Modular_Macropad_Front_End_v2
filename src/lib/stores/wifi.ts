import { writable, derived } from 'svelte/store';
import type { WiFiNetwork, WiFiConfig, WiFiStatus, SystemStatus } from '$lib/types/wifi';
import { ApiClient } from '$lib/api/client';
import { API_ENDPOINTS } from '$lib/api/endpoints';

// WiFi networks store
export const wifiNetworks = writable<WiFiNetwork[]>([]);

// WiFi config store
export const wifiConfig = writable<WiFiConfig>({
	ssid: '',
	ap_mode: false,
	ap_name: '',
	sta_connected: false,
	sta_ip: '',
	ap_ip: ''
});

// WiFi status store
export const wifiStatus = writable<WiFiStatus>({
	connected: false,
	ip: '',
	ssid: '',
	ap_mode: false
});

// Loading state
export const isScanning = writable<boolean>(false);
export const isConnecting = writable<boolean>(false);

// Error state
export const wifiError = writable<string | null>(null);

// Derived store for connection strength
export const signalStrength = derived(wifiStatus, ($status) => {
	// Return a value between 0-4 based on connected network's signal strength
	// This is just a placeholder - in a real implementation you would
	// find the connected network in wifiNetworks and get its RSSI
	return $status.connected ? 3 : 0;
});

/**
 * Scan for available WiFi networks
 */
export async function scanNetworks() {
	try {
		isScanning.set(true);
		wifiError.set(null);

		const networks = (await ApiClient.scanWiFiNetworks()) as WiFiNetwork[];
		wifiNetworks.set(networks);

		return networks;
	} catch (error) {
		console.error('Failed to scan WiFi networks:', error);
		wifiError.set('Failed to scan WiFi networks');
		return [];
	} finally {
		isScanning.set(false);
	}
}

/**
 * Get current WiFi configuration
 */
export async function getWiFiConfiguration() {
	try {
		wifiError.set(null);

		const config = (await ApiClient.getWiFiConfig()) as WiFiConfig;
		wifiConfig.set(config);

		return config;
	} catch (error) {
		console.error('Failed to get WiFi configuration:', error);
		wifiError.set('Failed to get WiFi configuration');
	}
}

/**
 * Connect to a WiFi network
 */
export async function connectToWiFi(
	ssid: string,
	password: string,
	apMode: boolean = false,
	apName: string = ''
) {
	try {
		isConnecting.set(true);
		wifiError.set(null);

		const data = {
			ssid,
			password,
			ap_mode: apMode,
			ap_name: apName
		};

		await ApiClient.post(API_ENDPOINTS.WIFI.CONFIG, data);

		// Update local config
		wifiConfig.update((config) => ({ ...config, ssid, ap_mode: apMode, ap_name: apName }));

		return true;
	} catch (error) {
		console.error('Failed to connect to WiFi:', error);
		wifiError.set('Failed to connect to WiFi');
		return false;
	} finally {
		isConnecting.set(false);
	}
}

/**
 * Get system status including WiFi status
 */
export async function getSystemStatus() {
	try {
		wifiError.set(null);

		const status = (await ApiClient.getSystemStatus()) as SystemStatus;

		if (status?.wifi) {
			wifiStatus.set(status.wifi);
		}

		return status;
	} catch (error) {
		console.error('Failed to get system status:', error);
		wifiError.set('Failed to get system status');
	}
}
