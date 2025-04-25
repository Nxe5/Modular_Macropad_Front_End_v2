/**
 * WiFi Network information
 */
export interface WiFiNetwork {
	ssid: string;
	rssi: number; // Signal strength
	encryption: string; // Security type (WPA2, WPA, Open, etc.)
	bssid?: string; // MAC address (optional)
	channel?: number; // WiFi channel (optional)
}

/**
 * WiFi configuration
 */
export interface WiFiConfig {
	ssid: string;
	password?: string; // Not returned from API for security
	ap_mode: boolean;
	ap_name?: string; // AP name when in dual mode
	sta_connected?: boolean; // Whether connected to a WiFi network
	sta_ip?: string; // IP address when connected to a network
	ap_ip?: string; // IP address of the AP
}

/**
 * WiFi status
 */
export interface WiFiStatus {
	connected: boolean;
	ip: string;
	ssid: string;
	ap_mode: boolean;
}

/**
 * System status including WiFi
 */
export interface SystemStatus {
	wifi: WiFiStatus;
}
