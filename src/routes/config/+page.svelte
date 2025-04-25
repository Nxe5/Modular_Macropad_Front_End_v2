<script lang="ts">
	import { Info, Cpu, Play, Lightbulb, FileText, Download, Save, RefreshCw, RotateCcw } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { ConfigApi } from '$lib/api/config';
	import { updateConnectionStatus } from '$lib/stores/connection';

	type TabId = 'info' | 'components' | 'actions' | 'leds' | 'reports';
	
	let activeTab: TabId = 'info';
	
	// Loading states
	let loading: Record<TabId, boolean> = {
		info: false,
		components: false,
		actions: false,
		leds: false,
		reports: false
	};
	
	// Error states
	let errors: Record<TabId, string | null> = {
		info: null,
		components: null,
		actions: null,
		leds: null,
		reports: null
	};
	
	// Data states
	let infoData: any = null;
	let componentsData: any = null;
	let actionsData: any = null;
	let ledsData: any = null;
	let reportsData: any = null;
	
	// Edited content
	let editedContent: Record<TabId, string> = {
		info: '',
		components: '',
		actions: '',
		leds: '',
		reports: ''
	};

	// Function to handle tab switching
	async function switchTab(tab: string) {
		activeTab = tab as TabId;
		if (!getTabData(tab)) {
			await fetchTabData(tab);
		}
	}
	
	// Function to get the data for the current tab
	function getTabData(tab: string) {
		switch (tab) {
			case 'info': return infoData;
			case 'components': return componentsData;
			case 'actions': return actionsData;
			case 'leds': return ledsData;
			case 'reports': return reportsData;
			default: return null;
		}
	}
	
	// Function to fetch data for a tab
	async function fetchTabData(tab: string) {
		loading[tab as TabId] = true;
		errors[tab as TabId] = null;
		
		try {
			let data;
			switch (tab) {
				case 'info':
					data = await ConfigApi.getInfo();
					infoData = data;
					editedContent.info = JSON.stringify(data, null, 2);
					break;
				case 'components':
					data = await ConfigApi.getComponents();
					componentsData = data;
					editedContent.components = JSON.stringify(data, null, 2);
					break;
				case 'actions':
					data = await ConfigApi.getActions();
					actionsData = data;
					editedContent.actions = JSON.stringify(data, null, 2);
					break;
				case 'leds':
					data = await ConfigApi.getLeds();
					ledsData = data;
					editedContent.leds = JSON.stringify(data, null, 2);
					break;
				case 'reports':
					data = await ConfigApi.getReports();
					reportsData = data;
					editedContent.reports = JSON.stringify(data, null, 2);
					break;
			}
		} catch (error) {
			console.error(`Error fetching ${tab} data:`, error);
			
			// Format the error message based on the type
			if (error instanceof Error) {
				let errorMsg = error.message;
				
				// Handle specific error messages
				if (errorMsg.includes('API endpoint not implemented')) {
					errors[tab as TabId] = `This feature requires a firmware update. The current firmware doesn't support this functionality.`;
				} else if (errorMsg.includes('API Error:')) {
					// Extract clean error message from API Error format
					try {
						const jsonStart = errorMsg.indexOf('{');
						if (jsonStart > -1) {
							const jsonPart = errorMsg.substring(jsonStart);
							const parsedError = JSON.parse(jsonPart);
							errorMsg = parsedError.error || parsedError.message || errorMsg;
						}
					} catch (e) {
						// If JSON parsing fails, use the original message
					}
					errors[tab as TabId] = errorMsg;
				} else {
					errors[tab as TabId] = errorMsg;
				}
			} else {
				errors[tab as TabId] = 'Unknown error occurred';
			}
		} finally {
			loading[tab as TabId] = false;
		}
	}
	
	// Function to save edited data
	async function saveConfig(tab: string) {
		loading[tab as TabId] = true;
		errors[tab as TabId] = null;
		
		try {
			// Parse the edited JSON
			const parsedData = JSON.parse(editedContent[tab as TabId]);
			
			// Send the updated data to the ESP32
			let response;
			switch (tab) {
				case 'components':
					response = await ConfigApi.updateComponents(parsedData);
					componentsData = parsedData;
					break;
				case 'actions':
					response = await ConfigApi.updateActions(parsedData);
					actionsData = parsedData;
					break;
				case 'leds':
					response = await ConfigApi.updateLeds(parsedData);
					ledsData = parsedData;
					break;
			}
			
			// Show success message
			alert(`${tab.charAt(0).toUpperCase() + tab.slice(1)} configuration saved successfully!`);
		} catch (error) {
			console.error(`Error saving ${tab} data:`, error);
			
			// Handle different types of errors
			if (error instanceof SyntaxError) {
				errors[tab as TabId] = "Invalid JSON format: " + error.message;
			} else if (error instanceof Error) {
				// Attempt to extract and format the error message from API
				let errorMsg = error.message;
				if (errorMsg.includes('API Error:')) {
					try {
						// Extract JSON part of the error message
						const jsonStart = errorMsg.indexOf('{');
						if (jsonStart > -1) {
							const jsonPart = errorMsg.substring(jsonStart);
							const parsedError = JSON.parse(jsonPart);
							errorMsg = parsedError.error || parsedError.message || errorMsg;
						}
					} catch (e) {
						// If we can't parse as JSON, use the raw error message
					}
				}
				errors[tab as TabId] = errorMsg;
			} else {
				errors[tab as TabId] = "Unknown error occurred";
			}
			
			// Show error in alert for immediate attention
			alert(`Error saving ${tab} configuration: ${errors[tab as TabId]}`);
		} finally {
			loading[tab as TabId] = false;
		}
	}
	
	// Function to download configuration
	function downloadConfig(tab: string) {
		const content = editedContent[tab as TabId];
		const blob = new Blob([content], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${tab}-config.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	
	// Function to refresh current tab data
	async function refreshTabData() {
		await fetchTabData(activeTab);
	}

	// Function to restore configuration to defaults
	async function restoreConfig(tab: string) {
		if (!confirm(`Are you sure you want to restore the ${tab} configuration to defaults? This will overwrite your current settings.`)) {
			return;
		}
		
		loading[tab as TabId] = true;
		errors[tab as TabId] = null;
		
		try {
			// Call the API to restore the configuration
			await ConfigApi.restoreConfig(tab);
			
			// Fetch the updated configuration
			await fetchTabData(tab);
			
			// Show success message
			alert(`${tab.charAt(0).toUpperCase() + tab.slice(1)} configuration restored successfully!`);
		} catch (error) {
			console.error(`Error restoring ${tab} configuration:`, error);
			errors[tab as TabId] = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			loading[tab as TabId] = false;
		}
	}

	onMount(async () => {
		// Fetch data for the initial tab
		await fetchTabData(activeTab);
	});
</script>

<div class="page-container">
	<h1>Raw Configuration</h1>
	<p>View and edit raw configuration files for your macropad.</p>

	<div class="config-layout">
		<div class="sidebar">
			<div class="sidebar-header">
				<h2>Configuration</h2>
			</div>
			
			<div class="tab-list">
				<button
					class={`tab-item ${activeTab === 'info' ? 'active' : ''}`}
					on:click={() => switchTab('info')}
				>
					<Info size={16} />
					<span>Info</span>
				</button>
				<button
					class={`tab-item ${activeTab === 'components' ? 'active' : ''}`}
					on:click={() => switchTab('components')}
				>
					<Cpu size={16} />
					<span>Components</span>
				</button>
				<button
					class={`tab-item ${activeTab === 'actions' ? 'active' : ''}`}
					on:click={() => switchTab('actions')}
				>
					<Play size={16} />
					<span>Actions</span>
				</button>
				<button
					class={`tab-item ${activeTab === 'leds' ? 'active' : ''}`}
					on:click={() => switchTab('leds')}
				>
					<Lightbulb size={16} />
					<span>LEDs</span>
				</button>
				<button
					class={`tab-item ${activeTab === 'reports' ? 'active' : ''}`}
					on:click={() => switchTab('reports')}
				>
					<FileText size={16} />
					<span>Reports</span>
				</button>
			</div>
		</div>

		<div class="main-content">
			{#if activeTab === 'info'}
				<div class="tab-panel">
					<div class="tab-header">
						<h2>Info Configuration</h2>
						<div class="tab-actions">
							<button class="action-button" on:click={refreshTabData} disabled={loading.info}>
								<RefreshCw size={16} class={loading.info ? 'spinning' : ''} />
								<span>Refresh</span>
							</button>
							<button class="action-button" on:click={() => downloadConfig('info')} disabled={loading.info}>
								<Download size={16} />
								<span>Download</span>
							</button>
							<button class="action-button" on:click={() => restoreConfig('info')} disabled={loading.info}>
								<RotateCcw size={16} />
								<span>Restore</span>
							</button>
						</div>
					</div>
					<p>Basic information about your macropad.</p>
					
					{#if loading.info}
						<div class="loading">Loading info data...</div>
					{:else if errors.info}
						<div class="error">
							<p>Error loading info: {errors.info}</p>
							<button on:click={refreshTabData}>Retry</button>
						</div>
					{:else if infoData}
						<div class="json-editor">
							<textarea 
								bind:value={editedContent.info} 
								rows="20" 
								spellcheck="false"
								readonly
							></textarea>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'components'}
				<div class="tab-panel">
					<div class="tab-header">
						<h2>Components Configuration</h2>
						<div class="tab-actions">
							<button class="action-button" on:click={refreshTabData} disabled={loading.components}>
								<RefreshCw size={16} class={loading.components ? 'spinning' : ''} />
								<span>Refresh</span>
							</button>
							<button class="action-button" on:click={() => saveConfig('components')} disabled={loading.components}>
								<Save size={16} />
								<span>Save</span>
							</button>
							<button class="action-button" on:click={() => downloadConfig('components')} disabled={loading.components}>
								<Download size={16} />
								<span>Download</span>
							</button>
							<button class="action-button" on:click={() => restoreConfig('components')} disabled={loading.components}>
								<RotateCcw size={16} />
								<span>Restore</span>
							</button>
						</div>
					</div>
					<p>Configure the hardware components of your macropad.</p>
					
					{#if loading.components}
						<div class="loading">Loading components data...</div>
					{:else if errors.components}
						<div class="error">
							<p>Error loading components: {errors.components}</p>
							<button on:click={refreshTabData}>Retry</button>
						</div>
					{:else if componentsData}
						<div class="json-editor">
							<textarea 
								bind:value={editedContent.components} 
								rows="20" 
								spellcheck="false"
							></textarea>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'actions'}
				<div class="tab-panel">
					<div class="tab-header">
						<h2>Actions Configuration</h2>
						<div class="tab-actions">
							<button class="action-button" on:click={refreshTabData} disabled={loading.actions}>
								<RefreshCw size={16} class={loading.actions ? 'spinning' : ''} />
								<span>Refresh</span>
							</button>
							<button class="action-button" on:click={() => saveConfig('actions')} disabled={loading.actions}>
								<Save size={16} />
								<span>Save</span>
							</button>
							<button class="action-button" on:click={() => downloadConfig('actions')} disabled={loading.actions}>
								<Download size={16} />
								<span>Download</span>
							</button>
							<button class="action-button" on:click={() => restoreConfig('actions')} disabled={loading.actions}>
								<RotateCcw size={16} />
								<span>Restore</span>
							</button>
						</div>
					</div>
					<p>Configure the actions and key mappings for your macropad.</p>
					
					{#if loading.actions}
						<div class="loading">Loading actions data...</div>
					{:else if errors.actions}
						<div class="error">
							<p>Error loading actions: {errors.actions}</p>
							<button on:click={refreshTabData}>Retry</button>
						</div>
					{:else if actionsData}
						<div class="json-editor">
							<textarea 
								bind:value={editedContent.actions} 
								rows="20" 
								spellcheck="false"
							></textarea>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'leds'}
				<div class="tab-panel">
					<div class="tab-header">
						<h2>LEDs Configuration</h2>
						<div class="tab-actions">
							<button class="action-button" on:click={refreshTabData} disabled={loading.leds}>
								<RefreshCw size={16} class={loading.leds ? 'spinning' : ''} />
								<span>Refresh</span>
							</button>
							<button class="action-button" on:click={() => saveConfig('leds')} disabled={loading.leds}>
								<Save size={16} />
								<span>Save</span>
							</button>
							<button class="action-button" on:click={() => downloadConfig('leds')} disabled={loading.leds}>
								<Download size={16} />
								<span>Download</span>
							</button>
							<button class="action-button" on:click={() => restoreConfig('leds')} disabled={loading.leds}>
								<RotateCcw size={16} />
								<span>Restore</span>
							</button>
						</div>
					</div>
					<p>Configure the LED settings for your macropad.</p>
					
					{#if loading.leds}
						<div class="loading">Loading LEDs data...</div>
					{:else if errors.leds}
						<div class="error">
							<p>Error loading LEDs: {errors.leds}</p>
							<button on:click={refreshTabData}>Retry</button>
						</div>
					{:else if ledsData}
						<div class="json-editor">
							<textarea 
								bind:value={editedContent.leds} 
								rows="20" 
								spellcheck="false"
							></textarea>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'reports'}
				<div class="tab-panel">
					<div class="tab-header">
						<h2>Reports Configuration</h2>
						<div class="tab-actions">
							<button class="action-button" on:click={refreshTabData} disabled={loading.reports}>
								<RefreshCw size={16} class={loading.reports ? 'spinning' : ''} />
								<span>Refresh</span>
							</button>
							<button class="action-button" on:click={() => downloadConfig('reports')} disabled={loading.reports}>
								<Download size={16} />
								<span>Download</span>
							</button>
							<button class="action-button" on:click={() => restoreConfig('reports')} disabled={loading.reports}>
								<RotateCcw size={16} />
								<span>Restore</span>
							</button>
						</div>
					</div>
					<p>Configure the reports and notifications for your macropad.</p>
					
					{#if loading.reports}
						<div class="loading">Loading reports data...</div>
					{:else if errors.reports}
						<div class="error">
							<p>Error loading reports: {errors.reports}</p>
							<button on:click={refreshTabData}>Retry</button>
						</div>
					{:else if reportsData}
						<div class="json-editor">
							<textarea 
								bind:value={editedContent.reports} 
								rows="20" 
								spellcheck="false"
								readonly
							></textarea>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.page-container {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.config-layout {
		display: flex;
		gap: 1rem;
		width: 100%;
		height: calc(100vh - 200px);
		min-height: 500px;
	}

	.sidebar {
		display: flex;
		flex-direction: column;
		width: 250px;
		min-width: 250px;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.sidebar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.sidebar-header h2 {
		margin: 0;
		font-size: 1.2rem;
	}

	.tab-list {
		flex: 1;
		overflow-y: auto;
		padding: 0.5rem;
	}

	.tab-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--text-secondary);
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
		width: 100%;
		text-align: left;
	}

	.tab-item:hover {
		background: var(--bg-hover);
		color: var(--text-primary);
	}

	.tab-item.active {
		background: var(--primary-color);
		color: white;
	}

	.main-content {
		flex: 1;
		min-width: 0;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.tab-panel {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	.tab-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.tab-actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		background: var(--bg-secondary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-button:hover {
		background: var(--bg-hover);
	}

	.action-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.json-editor {
		flex: 1;
		padding: 1rem;
		overflow: auto;
	}

	.json-editor textarea {
		width: 100%;
		height: 100%;
		min-height: 300px;
		font-family: monospace;
		font-size: 14px;
		line-height: 1.5;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		background: var(--bg-secondary);
		color: var(--text-primary);
		resize: none;
	}

	.loading, .error {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		padding: 2rem;
		text-align: center;
	}

	.error {
		color: var(--danger-color);
		flex-direction: column;
		align-items: flex-start;
	}

	.error button {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		background: var(--primary-color);
		color: white;
		border: none;
		cursor: pointer;
	}

	.spinning {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
