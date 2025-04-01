<script lang="ts">
	import { Info, Cpu, Play, Lightbulb, FileText, Download, Save, RefreshCw, RotateCcw } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { ConfigApi } from '$lib/api/config';
	import { updateConnectionStatus } from '$lib/stores/connection';

	// Active tab state
	let activeTab = 'info';

	// Configuration data
	let infoData: any = null;
	let componentsData: any = null;
	let actionsData: any = null;
	let ledsData: any = null;
	let reportsData: any = null;
	
	// Loading states
	let loading = {
		info: false,
		components: false,
		actions: false,
		leds: false,
		reports: false
	};
	
	// Error states
	let errors = {
		info: null,
		components: null,
		actions: null,
		leds: null,
		reports: null
	};
	
	// Edited content
	let editedContent = {
		info: '',
		components: '',
		actions: '',
		leds: '',
		reports: ''
	};

	// Function to handle tab switching
	async function switchTab(tab: string) {
		activeTab = tab;
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
		loading[tab] = true;
		errors[tab] = null;
		
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
			errors[tab] = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			loading[tab] = false;
		}
	}
	
	// Function to save edited data
	async function saveConfig(tab: string) {
		loading[tab] = true;
		errors[tab] = null;
		
		try {
			// Parse the edited JSON
			const parsedData = JSON.parse(editedContent[tab]);
			
			// Send the updated data to the ESP32
			switch (tab) {
				case 'components':
					await ConfigApi.updateComponents(parsedData);
					componentsData = parsedData;
					break;
				case 'actions':
					await ConfigApi.updateActions(parsedData);
					actionsData = parsedData;
					break;
				case 'leds':
					await ConfigApi.updateLeds(parsedData);
					ledsData = parsedData;
					break;
			}
			
			// Show success message
			alert(`${tab.charAt(0).toUpperCase() + tab.slice(1)} configuration saved successfully!`);
		} catch (error) {
			console.error(`Error saving ${tab} data:`, error);
			errors[tab] = error instanceof Error ? error.message : 'Unknown error';
			if (error instanceof SyntaxError) {
				errors[tab] = "Invalid JSON format: " + error.message;
			}
		} finally {
			loading[tab] = false;
		}
	}
	
	// Function to download configuration
	function downloadConfig(tab: string) {
		const content = editedContent[tab];
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
		
		loading[tab] = true;
		errors[tab] = null;
		
		try {
			// Call the API to restore the configuration
			await ConfigApi.restoreConfig(tab);
			
			// Fetch the updated configuration
			await fetchTabData(tab);
			
			// Show success message
			alert(`${tab.charAt(0).toUpperCase() + tab.slice(1)} configuration restored successfully!`);
		} catch (error) {
			console.error(`Error restoring ${tab} configuration:`, error);
			errors[tab] = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			loading[tab] = false;
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

	<div class="config-tabs">
		<nav class="config-nav">
			<button
				class={`config-tab ${activeTab === 'info' ? 'active' : ''}`}
				on:click={() => switchTab('info')}
			>
				<Info size={18} />
				<span>Info</span>
			</button>
			<button
				class={`config-tab ${activeTab === 'components' ? 'active' : ''}`}
				on:click={() => switchTab('components')}
			>
				<Cpu size={18} />
				<span>Components</span>
			</button>
			<button
				class={`config-tab ${activeTab === 'actions' ? 'active' : ''}`}
				on:click={() => switchTab('actions')}
			>
				<Play size={18} />
				<span>Actions</span>
			</button>
			<button
				class={`config-tab ${activeTab === 'leds' ? 'active' : ''}`}
				on:click={() => switchTab('leds')}
			>
				<Lightbulb size={18} />
				<span>LEDs</span>
			</button>
			<button
				class={`config-tab ${activeTab === 'reports' ? 'active' : ''}`}
				on:click={() => switchTab('reports')}
			>
				<FileText size={18} />
				<span>Reports</span>
			</button>
		</nav>

		<div class="config-content">
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
	}

	h1 {
		margin-bottom: 1rem;
	}

	p {
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.config-tabs {
		margin-top: 2rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.config-nav {
		display: flex;
		background-color: var(--bg-secondary);
		border-bottom: 1px solid var(--border-color);
		overflow-x: auto;
	}

	.config-tab {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		color: var(--text-secondary);
		cursor: pointer;
		border: none;
		background: none;
		transition: background-color 0.2s;
		white-space: nowrap;
	}

	.config-tab:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.config-tab.active {
		color: var(--accent-color);
		border-bottom: 2px solid var(--accent-color);
		background-color: var(--bg-primary);
	}

	.config-content {
		padding: 2rem;
		background-color: var(--bg-primary);
	}

	.tab-panel h2 {
		margin-bottom: 1rem;
	}

	.tab-panel p {
		margin-bottom: 1.5rem;
	}
	
	.tab-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
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
		background-color: var(--accent-color);
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.action-button:hover {
		background-color: var(--accent-color-dark);
	}
	
	.action-button:disabled {
		background-color: var(--bg-disabled);
		cursor: not-allowed;
	}
	
	.json-editor {
		width: 100%;
		margin-top: 1rem;
	}
	
	.json-editor textarea {
		width: 100%;
		font-family: monospace;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		resize: vertical;
	}
	
	.loading {
		display: flex;
		justify-content: center;
		padding: 2rem;
		color: var(--text-secondary);
	}
	
	.error {
		padding: 1rem;
		border: 1px solid var(--error-color);
		border-radius: 0.25rem;
		background-color: var(--error-bg);
		color: var(--error-color);
		margin-top: 1rem;
	}
	
	.error button {
		margin-top: 0.5rem;
		padding: 0.25rem 0.5rem;
		background-color: var(--error-color);
		color: white;
		border: none;
		border-radius: 0.25rem;
		cursor: pointer;
	}
	
	.spinning {
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .config-tab:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}
	
	:global([data-theme='dark']) .json-editor textarea {
		background-color: rgba(0, 0, 0, 0.3);
	}
</style>
