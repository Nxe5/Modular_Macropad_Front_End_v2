<script lang="ts">
	import { onMount } from 'svelte';
	import { 
		scanNetworks, 
		getWiFiConfiguration, 
		getSystemStatus,
		connectToWiFi, 
		wifiError
	} from '$lib/stores/wifi';
	import type { WiFiNetwork } from '$lib/types/wifi';
	import NetworkList from './NetworkList.svelte';
	import ConnectionDialog from './ConnectionDialog.svelte';
	import WiFiStatus from './WiFiStatus.svelte';
	
	// Local state
	let selectedNetwork: WiFiNetwork | null = null;
	let showConnectionDialog = false;
	
	// Load WiFi data on mount
	onMount(() => {
		// Get initial WiFi configuration and status
		Promise.all([
			getWiFiConfiguration(),
			getSystemStatus(),
			refreshNetworks()
		]);
		
		// Set up periodic status updates
		const statusInterval = setInterval(() => {
			getSystemStatus();
		}, 10000);
		
		// Return cleanup function
		return () => {
			clearInterval(statusInterval);
		};
	});
	
	// Refresh networks list
	async function refreshNetworks() {
		wifiError.set(null);
		await scanNetworks();
	}
	
	// Handle network selection
	function handleNetworkSelect({ detail }: CustomEvent<{ network: WiFiNetwork }>) {
		selectedNetwork = detail.network;
		showConnectionDialog = true;
	}
	
	// Handle network connection
	async function handleConnect({ detail }: CustomEvent<{ ssid: string; password: string; apMode: boolean; apName: string }>) {
		const success = await connectToWiFi(detail.ssid, detail.password, detail.apMode, detail.apName);
		
		if (success) {
			showConnectionDialog = false;
			selectedNetwork = null;
			
			// Refresh status
			setTimeout(() => {
				getSystemStatus();
			}, 2000);
		}
	}
	
	// Handle dialog close
	function handleDialogCancel() {
		showConnectionDialog = false;
		selectedNetwork = null;
	}
</script>

<div class="wifi-settings">
	<h2>WiFi Settings</h2>
	
	<WiFiStatus />
	
	<NetworkList 
		on:select={handleNetworkSelect}
		on:refresh={refreshNetworks}
	/>
	
	<ConnectionDialog
		network={selectedNetwork}
		visible={showConnectionDialog}
		on:connect={handleConnect}
		on:cancel={handleDialogCancel}
	/>
</div>

<style>
	.wifi-settings {
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem;
	}
	
	h2 {
		margin-bottom: 1.5rem;
		font-size: 1.5rem;
		font-weight: 600;
		text-align: center;
	}
</style> 