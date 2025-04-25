<script lang="ts">
	import { wifiNetworks, isScanning, wifiStatus } from '$lib/stores/wifi';
	import type { WiFiNetwork } from '$lib/types/wifi';
	import Button from '../button.svelte';
	
	// Event dispatcher for when a network is selected
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{
		select: { network: WiFiNetwork };
		refresh: void;
	}>();
	
	// Helper function to determine signal strength class
	function getSignalStrengthClass(rssi: number): string {
		if (rssi >= -50) return 'signal-excellent';
		if (rssi >= -60) return 'signal-good';
		if (rssi >= -70) return 'signal-fair';
		return 'signal-weak';
	}
	
	// Helper function to determine if a network is currently connected
	function isConnected(network: WiFiNetwork): boolean {
		return $wifiStatus.connected && $wifiStatus.ssid === network.ssid;
	}
	
	// Handle network selection
	function selectNetwork(network: WiFiNetwork) {
		dispatch('select', { network });
	}
</script>

<div class="network-list">
	<div class="list-header">
		<h3>Available Networks</h3>
		
		<Button 
			on:click={() => dispatch('refresh')} 
			disabled={$isScanning}
		>
			{#if $isScanning}
				<span class="spinner"></span>
			{:else}
				<span class="icon">↻</span>
			{/if}
			{$isScanning ? 'Scanning...' : 'Scan'}
		</Button>
	</div>
	
	{#if $isScanning}
		<div class="scanning-message">
			<p>Scanning for networks...</p>
		</div>
	{:else if $wifiNetworks.length === 0}
		<div class="empty-message">
			<p>No networks found. Try scanning again.</p>
		</div>
	{:else}
		<ul class="networks">
			{#each $wifiNetworks as network}
				<li 
					class="network-item {isConnected(network) ? 'connected' : ''}"
					on:click={() => selectNetwork(network)}
					on:keydown={(e) => e.key === 'Enter' && selectNetwork(network)}
					tabindex="0"
				>
					<div class="network-info">
						<span class="network-name">{network.ssid}</span>
						<span class="network-security">{network.encryption}</span>
					</div>
					
					<div class="network-signal {getSignalStrengthClass(network.rssi)}">
						<span class="signal-bar"></span>
						<span class="signal-bar"></span>
						<span class="signal-bar"></span>
						<span class="signal-bar"></span>
					</div>
					
					{#if isConnected(network)}
						<div class="connected-indicator">
							Connected
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.network-list {
		border-radius: 0.5rem;
		background: var(--card-bg);
		box-shadow: var(--shadow-sm);
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}
	
	.list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
	}
	
	.list-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
	}
	
	.empty-message,
	.scanning-message {
		padding: 2rem;
		text-align: center;
		color: var(--text-secondary);
	}
	
	.networks {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	
	.network-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.network-item:last-child {
		border-bottom: none;
	}
	
	.network-item:hover {
		background-color: var(--hover-bg);
	}
	
	.network-item.connected {
		background-color: var(--primary-highlight);
	}
	
	.network-info {
		display: flex;
		flex-direction: column;
	}
	
	.network-name {
		font-weight: 500;
		margin-bottom: 0.25rem;
	}
	
	.network-security {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}
	
	.network-signal {
		display: flex;
		gap: 2px;
	}
	
	.signal-bar {
		width: 4px;
		height: 16px;
		background-color: var(--text-tertiary);
		border-radius: 1px;
	}
	
	.signal-weak .signal-bar:nth-child(1) {
		background-color: var(--text-secondary);
	}
	
	.signal-fair .signal-bar:nth-child(1),
	.signal-fair .signal-bar:nth-child(2) {
		background-color: var(--text-secondary);
	}
	
	.signal-good .signal-bar:nth-child(1),
	.signal-good .signal-bar:nth-child(2),
	.signal-good .signal-bar:nth-child(3) {
		background-color: var(--text-secondary);
	}
	
	.signal-excellent .signal-bar {
		background-color: var(--text-secondary);
	}
	
	.connected-indicator {
		font-size: 0.75rem;
		color: var(--primary-color);
		font-weight: 600;
	}
	
	.spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: white;
		animation: spin 1s ease-in-out infinite;
	}
	
	.icon {
		display: inline-block;
		font-size: 1rem;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style> 