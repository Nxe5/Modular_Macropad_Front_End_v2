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
	
	// Track dropdown state
	let isDropdownOpen = false;
	
	// Toggle dropdown
	function toggleDropdown() {
		if (!$isScanning) {
			isDropdownOpen = !isDropdownOpen;
		}
	}
	
	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const dropdown = document.querySelector('.network-dropdown');
		
		if (dropdown && !dropdown.contains(target) && isDropdownOpen) {
			isDropdownOpen = false;
		}
	}
	
	// Add click outside listener
	if (typeof window !== 'undefined') {
		window.addEventListener('click', handleClickOutside);
	}
	
	// Handle scan button click
	function handleScan(event: Event) {
		event.stopPropagation();
		dispatch('refresh');
	}
	
	// Get the currently connected network, if any
	$: connectedNetwork = $wifiNetworks.find(network => isConnected(network)) || null;
</script>

<div class="network-list">
	<div class="list-header">
		<h3>WiFi Connection</h3>
		
		<Button 
			on:click={handleScan} 
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
	
	<div class="network-selection">
		<div class="dropdown-label">Select Network:</div>
		
		<div class="network-dropdown">
			<button 
				class="dropdown-button" 
				on:click={toggleDropdown}
				disabled={$isScanning || $wifiNetworks.length === 0}
			>
				{#if $isScanning}
					<span>Scanning for networks...</span>
				{:else if $wifiNetworks.length === 0}
					<span>No networks found</span>
				{:else if connectedNetwork}
					<div class="selected-network">
						<span>{connectedNetwork.ssid}</span>
						<span class="connected-badge">Connected</span>
					</div>
				{:else}
					<span>Select a WiFi network</span>
				{/if}
				<span class="dropdown-arrow">▼</span>
			</button>
			
			{#if isDropdownOpen && $wifiNetworks.length > 0}
				<div class="dropdown-content">
					{#each $wifiNetworks as network}
						<div 
							class="dropdown-item {isConnected(network) ? 'connected' : ''}"
							on:click={() => { selectNetwork(network); isDropdownOpen = false; }}
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
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.network-list {
		border-radius: 0.5rem;
		background: var(--background-primary);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
		border: 1px solid var(--border);
	}
	
	.list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border);
	}
	
	.list-header h3 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	
	.network-selection {
		padding: 1rem;
	}
	
	.dropdown-label {
		font-weight: 500;
		margin-bottom: 0.5rem;
		color: var(--text-secondary);
	}
	
	.network-dropdown {
		position: relative;
		margin-bottom: 1rem;
	}
	
	.dropdown-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 0.75rem 1rem;
		background-color: var(--background-secondary);
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		font-size: 1rem;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s;
		color: var(--text-primary);
	}
	
	.dropdown-button:hover:not(:disabled) {
		border-color: var(--primary);
	}
	
	.dropdown-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
	
	.dropdown-arrow {
		font-size: 0.75rem;
		transition: transform 0.2s;
	}
	
	.network-dropdown:has(.dropdown-content) .dropdown-arrow {
		transform: rotate(180deg);
	}
	
	.dropdown-content {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		right: 0;
		z-index: 10;
		background-color: var(--background-primary);
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		max-height: 300px;
		overflow-y: auto;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}
	
	.dropdown-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.875rem 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
		border-bottom: 1px solid var(--border);
	}
	
	.dropdown-item:last-child {
		border-bottom: none;
	}
	
	.dropdown-item:hover {
		background-color: var(--background-secondary);
	}
	
	.dropdown-item.connected {
		background-color: var(--primary-light);
	}
	
	.network-info {
		display: flex;
		flex-direction: column;
	}
	
	.network-name {
		font-weight: 500;
		margin-bottom: 0.25rem;
		color: var(--text-primary);
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
		color: var(--primary);
		font-weight: 600;
	}
	
	.connected-badge {
		font-size: 0.75rem;
		color: var(--primary);
		font-weight: 600;
		background-color: var(--primary-light);
		padding: 0.25rem 0.5rem;
		border-radius: 1rem;
		margin-left: 0.5rem;
	}
	
	.selected-network {
		display: flex;
		align-items: center;
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