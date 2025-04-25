<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { WiFiNetwork } from '$lib/types/wifi';
	import { isConnecting, wifiError } from '$lib/stores/wifi';
	import Button from '../button.svelte';
	import Input from '../input.svelte';
	
	export let network: WiFiNetwork | null = null;
	export let visible = false;
	
	// Local state
	let password = '';
	let apMode = false;
	let apName = '';
	
	// Event dispatcher
	const dispatch = createEventDispatcher<{
		connect: { ssid: string; password: string; apMode: boolean; apName: string };
		cancel: void;
	}>();
	
	// Reset form when network changes
	$: if (network) {
		password = '';
		apMode = false;
		apName = 'MacroPad_' + (network ? network.ssid.replace(/[^a-zA-Z0-9]/g, '_') : '');
	}
	
	function handleConnect() {
		if (!network) return;
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
								disabled={$isConnecting || apMode}
								placeholder="Enter network password"
							/>
						</div>
					{:else}
						<p class="open-network-message">This is an open network. No password is required.</p>
					{/if}
					
					<div class="form-field ap-options">
						<label class="checkbox-label">
							<input type="checkbox" bind:checked={apMode} />
							<span>AP Mode Only (don't connect to this WiFi)</span>
						</label>
						
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
									Name for the access point that the macropad will create
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
									Optional: Create an AP while also connecting to this network
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
							{$isConnecting ? 'Connecting...' : (apMode ? 'Create AP' : 'Connect')}
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
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}
	
	.dialog {
		background: var(--card-bg);
		border-radius: 0.5rem;
		width: 90%;
		max-width: 400px;
		box-shadow: var(--shadow-md);
		overflow: hidden;
	}
	
	.dialog-header {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
	}
	
	.dialog-header h3 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
	}
	
	.dialog-content {
		padding: 1rem;
	}
	
	.form-field {
		margin-bottom: 1rem;
	}
	
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.5rem 0;
		cursor: pointer;
	}
	
	.checkbox-label input {
		margin: 0;
		cursor: pointer;
	}
	
	.ap-options {
		padding-top: 0.5rem;
		border-top: 1px solid var(--border-color-light);
	}
	
	.field-help {
		margin-top: 0.25rem;
		font-size: 0.75rem;
		color: var(--text-secondary);
	}
	
	.error-message {
		padding: 0.75rem;
		border-radius: 0.25rem;
		background: var(--error-bg);
		color: var(--error-text);
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}
	
	.open-network-message {
		margin-bottom: 1rem;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}
	
	.dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
	}
</style> 