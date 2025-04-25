<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { WiFiNetwork } from '$lib/types/wifi';
	import { isConnecting, wifiError, wifiStatus } from '$lib/stores/wifi';
	import Button from '../button.svelte';
	import Input from '../input.svelte';
	
	export let network: WiFiNetwork | null = null;
	export let visible = false;
	
	// Local state
	let password = '';
	let apMode = false;
	let apName = '';
	let savedPasswords: Record<string, string> = {};
	
	// Event dispatcher
	const dispatch = createEventDispatcher<{
		connect: { ssid: string; password: string; apMode: boolean; apName: string };
		cancel: void;
	}>();
	
	// Remember previously connected SSID
	let previousSsid = $wifiStatus.connected ? $wifiStatus.ssid : '';
	
	// Try to load saved passwords from localStorage
	onMount(() => {
		try {
			const savedData = localStorage.getItem('wifi_passwords');
			if (savedData) {
				savedPasswords = JSON.parse(savedData);
			}
		} catch (e) {
			console.error('Failed to load saved passwords', e);
		}
	});
	
	// Reset form when network changes
	$: if (network) {
		// Try to get previously saved password for this network
		if (savedPasswords[network.ssid]) {
			password = savedPasswords[network.ssid];
		} else {
			password = '';
		}
		
		// Default to AP mode (keep current connection) if this is not the currently connected network
		apMode = network.ssid !== $wifiStatus.ssid && $wifiStatus.connected;
		
		apName = previousSsid && network.ssid !== previousSsid 
			? 'MacroPad_' + previousSsid.replace(/[^a-zA-Z0-9]/g, '_')
			: 'MacroPad_' + (network ? network.ssid.replace(/[^a-zA-Z0-9]/g, '_') : '');
	}
	
	// Save password when connecting
	function savePassword(ssid: string, pwd: string) {
		if (!pwd) return;
		
		try {
			savedPasswords[ssid] = pwd;
			localStorage.setItem('wifi_passwords', JSON.stringify(savedPasswords));
		} catch (e) {
			console.error('Failed to save password', e);
		}
	}
	
	function handleConnect() {
		if (!network) return;
		
		// Save password for future use
		if (password && network.encryption !== 'OPEN') {
			savePassword(network.ssid, password);
		}
		
		// Remember this SSID for next time
		previousSsid = network.ssid;
		
		dispatch('connect', { 
			ssid: network.ssid, 
			password, 
			apMode, 
			apName: apName || 'MacroPad_AP'
		});
	}
	
	function handleCancel() {
		dispatch('cancel');
	}
	
	function handleSubmit(e: Event) {
		e.preventDefault();
		handleConnect();
	}
</script>

{#if visible && network}
	<div class="dialog-backdrop">
		<div class="dialog">
			<div class="dialog-header">
				<h3>Connect to "{network.ssid}"</h3>
				<button class="close-button" on:click={handleCancel}>×</button>
			</div>
			
			<div class="dialog-content">
				<form on:submit={handleSubmit}>
					{#if network.encryption !== 'OPEN'}
						<div class="form-field">
							<Input 
								type="password"
								label="Password"
								bind:value={password}
								required={network.encryption !== 'OPEN' && !apMode}
								disabled={$isConnecting}
								placeholder="Enter network password"
							/>
						</div>
					{:else}
						<p class="open-network-message">This is an open network. No password is required.</p>
					{/if}
					
					<div class="form-field ap-options">
						<div class="ap-mode-selector">
							<label class="radio-label">
								<input 
									type="radio" 
									name="mode" 
									checked={!apMode} 
									on:change={() => apMode = false}
									disabled={$isConnecting}
								/>
								<span class="radio-text">
									<span class="radio-title">Connect to "{network.ssid}" only</span>
									<span class="radio-desc">Replace current WiFi connection (will disconnect your laptop)</span>
								</span>
							</label>
							
							<label class="radio-label">
								<input 
									type="radio" 
									name="mode" 
									checked={apMode} 
									on:change={() => apMode = true}
									disabled={$isConnecting}
								/>
								<span class="radio-text">
									<span class="radio-title">Connect while keeping AP active</span>
									<span class="radio-desc">Connect to new network while maintaining your current connection</span>
								</span>
							</label>
						</div>
						
						{#if apMode}
							<div class="form-field">
								<Input 
									type="text"
									label="Access Point Name"
									bind:value={apName}
									required={apMode}
									disabled={$isConnecting}
									placeholder="Enter AP name"
								/>
								<div class="field-help">
									Your laptop will stay connected to this AP while the device also connects to {network.ssid}
								</div>
							</div>
						{:else}
							<div class="form-field">
								<Input 
									type="text"
									label="Access Point Name (Optional)"
									bind:value={apName}
									disabled={$isConnecting}
									placeholder="Enter AP name"
								/>
								<div class="field-help">
									Optional: Create a WiFi access point in addition to connecting to {network.ssid}
								</div>
							</div>
						{/if}
					</div>
					
					{#if $wifiError}
						<div class="error-message">
							{$wifiError}
						</div>
					{/if}
					
					<div class="dialog-actions">
						<Button 
							type="button" 
							on:click={handleCancel}
							disabled={$isConnecting}
							variant="secondary"
						>
							Cancel
						</Button>
						
						<Button 
							type="submit"
							disabled={$isConnecting || (network.encryption !== 'OPEN' && !password && !apMode)}
						>
							{#if $isConnecting}
								Connecting...
							{:else if apMode}
								Connect (Keep AP)
							{:else}
								Connect Only
							{/if}
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}
	
	.dialog {
		background: var(--background-primary);
		border-radius: 0.75rem;
		width: 90%;
		max-width: 450px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
		overflow: hidden;
		border: 1px solid var(--border);
		animation: dialog-appear 0.2s ease-out;
	}
	
	@keyframes dialog-appear {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.dialog-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--border);
		background-color: var(--background-secondary);
	}
	
	.dialog-header h3 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	
	.close-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		line-height: 1;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
	}
	
	.close-button:hover {
		background-color: var(--background-tertiary);
		color: var(--text-primary);
	}
	
	.dialog-content {
		padding: 1.25rem;
	}
	
	.form-field {
		margin-bottom: 1.25rem;
	}
	
	.ap-options {
		padding: 1rem;
		border-radius: 0.5rem;
		background-color: var(--background-secondary);
		margin: 1.25rem 0;
	}
	
	.ap-mode-selector {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}
	
	.radio-label {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		cursor: pointer;
		padding: 0.75rem;
		border-radius: 0.5rem;
		transition: background-color 0.2s;
	}
	
	.radio-label:hover {
		background-color: var(--background-tertiary);
	}
	
	.radio-label input {
		margin-top: 0.25rem;
	}
	
	.radio-text {
		display: flex;
		flex-direction: column;
	}
	
	.radio-title {
		font-weight: 500;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}
	
	.radio-desc {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}
	
	.field-help {
		margin-top: 0.5rem;
		font-size: 0.75rem;
		color: var(--text-secondary);
	}
	
	.error-message {
		padding: 0.875rem;
		border-radius: 0.5rem;
		background: var(--error-bg, rgba(255, 0, 0, 0.1));
		color: var(--error-text, #e53935);
		margin-bottom: 1.25rem;
		font-size: 0.875rem;
		border-left: 3px solid var(--error-text, #e53935);
	}
	
	.open-network-message {
		margin-bottom: 1rem;
		color: var(--text-secondary);
		font-size: 0.875rem;
		padding: 0.875rem;
		background-color: var(--background-secondary);
		border-radius: 0.5rem;
	}
	
	.dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}
</style> 