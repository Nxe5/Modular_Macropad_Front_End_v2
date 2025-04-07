<script lang="ts">
	import { FileText, Download, Save, RefreshCw, RotateCcw, Plus } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { MacrosApi } from '$lib/api/macros';
	import { updateConnectionStatus } from '$lib/stores/connection';

	// Active tab state
	let activeTab = '';
	let macroFiles: string[] = [];
	let macroNames: Record<string, string> = {};

	// Loading states
	let loading = {
		list: false,
		content: false
	};
	
	// Error states
	let errors = {
		list: null as string | null,
		content: null as string | null
	};
	
	// Edited content
	let editedContent = '';

	// Function to handle tab switching
	async function switchTab(tab: string) {
		activeTab = tab;
		await fetchMacroContent(tab);
	}
	
	// Function to fetch macro files list
	async function fetchMacroFiles() {
		loading.list = true;
		errors.list = null;
		
		try {
			// Get the list of macro IDs
			const macroList = await MacrosApi.getAllMacros();
			macroFiles = macroList;
			
			// Fetch the full macro details to get names
			macroNames = {};
			for (const macroId of macroList) {
				try {
					const macro = await MacrosApi.getMacro(macroId);
					macroNames[macroId] = macro.name || macroId;
				} catch (error) {
					console.error(`Error fetching macro details for ${macroId}:`, error);
					macroNames[macroId] = macroId;
				}
			}
			
			// If we have files but no active tab, select the first one
			if (macroFiles.length > 0 && !activeTab) {
				activeTab = macroFiles[0];
				await fetchMacroContent(activeTab);
			}
		} catch (error) {
			console.error('Error fetching macro files:', error);
			errors.list = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			loading.list = false;
		}
	}
	
	// Function to fetch macro content
	async function fetchMacroContent(macroName: string) {
		loading.content = true;
		errors.content = null;
		
		try {
			console.log(`Fetching macro content for ${macroName}...`);
			// Get the full macro content
			const data = await MacrosApi.getMacro(macroName);
			console.log('Macro content received:', data);
			
			if (!data) {
				throw new Error('No data received from the server');
			}
			
			// Check if we have the expected structure
			if (!data.id || !data.commands) {
				console.warn('Unexpected macro data structure:', data);
			}
			
			editedContent = JSON.stringify(data, null, 2);
		} catch (error) {
			console.error(`Error fetching macro content for ${macroName}:`, error);
			errors.content = error instanceof Error ? error.message : 'Unknown error';
		} finally {
			loading.content = false;
		}
	}
	
	// Function to save edited macro
	async function saveMacro() {
		loading.content = true;
		errors.content = null;
		
		try {
			// Parse the edited JSON
			const parsedData = JSON.parse(editedContent);
			
			// Send the updated data to the ESP32
			await MacrosApi.saveMacro(activeTab, parsedData);
			
			// Show success message
			alert(`Macro ${activeTab} saved successfully!`);
		} catch (error) {
			console.error(`Error saving macro ${activeTab}:`, error);
			errors.content = error instanceof Error ? error.message : 'Unknown error';
			if (error instanceof SyntaxError) {
				errors.content = "Invalid JSON format: " + error.message;
			}
		} finally {
			loading.content = false;
		}
	}
	
	// Function to download macro
	function downloadMacro() {
		const content = editedContent;
		const blob = new Blob([content], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${activeTab}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	
	// Function to refresh current macro data
	async function refreshMacroData() {
		await fetchMacroContent(activeTab);
	}
	
	// Function to create a new macro
	async function createNewMacro() {
		const name = prompt('Enter a name for the new macro:');
		if (!name) return;
		
		// Check if name already exists
		if (macroFiles.includes(name)) {
			alert(`A macro named "${name}" already exists.`);
			return;
		}
		
		// Create a new macro with default structure
		const newMacro = {
			id: name,
			name: name,
			description: 'New macro',
			commands: []
		};
		
		try {
			await MacrosApi.saveMacro(name, newMacro);
			
			// Refresh the list and switch to the new macro
			await fetchMacroFiles();
			activeTab = name;
			editedContent = JSON.stringify(newMacro, null, 2);
		} catch (error) {
			console.error('Error creating new macro:', error);
			alert(`Error creating macro: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
	
	// Function to delete a macro
	async function deleteMacro(macroName: string) {
		if (!confirm(`Are you sure you want to delete the macro "${macroName}"?`)) {
			return;
		}
		
		try {
			await MacrosApi.deleteMacro(macroName);
			
			// Refresh the list
			await fetchMacroFiles();
			
			// If the deleted macro was active, select another one or clear
			if (activeTab === macroName) {
				activeTab = macroFiles.length > 0 ? macroFiles[0] : '';
				if (activeTab) {
					await fetchMacroContent(activeTab);
				} else {
					editedContent = '';
				}
			}
		} catch (error) {
			console.error(`Error deleting macro ${macroName}:`, error);
			alert(`Error deleting macro: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	onMount(async () => {
		// Fetch macro files list
		await fetchMacroFiles();
	});
</script>

<div class="page-container">
	<h1>Raw Macros Configuration</h1>
	<p>View and edit raw macro files for your macropad.</p>

	<div class="config-tabs">
		<nav class="config-nav">
			{#if macroFiles.length > 0}
				{#each macroFiles as macroFile}
					<button
						class={`config-tab ${activeTab === macroFile ? 'active' : ''}`}
						on:click={() => switchTab(macroFile)}
					>
						<FileText size={18} />
						<span>{macroNames[macroFile] || macroFile}</span>
					</button>
				{/each}
			{:else}
				<div class="no-macros">
					<p>No macro files found</p>
				</div>
			{/if}
			<button class="config-tab new-macro" on:click={createNewMacro}>
				<Plus size={18} />
				<span>New Macro</span>
			</button>
		</nav>

		<div class="config-content">
			{#if activeTab}
				<div class="tab-panel">
					<div class="tab-header">
						<h2>Macro: {macroNames[activeTab] || activeTab}</h2>
						<div class="tab-actions">
							<button class="action-button" on:click={refreshMacroData} disabled={loading.content}>
								<RefreshCw size={16} class={loading.content ? 'spinning' : ''} />
								<span>Refresh</span>
							</button>
							<button class="action-button" on:click={() => downloadMacro()} disabled={loading.content}>
								<Download size={16} />
								<span>Download</span>
							</button>
							<button class="action-button primary" on:click={saveMacro} disabled={loading.content}>
								<Save size={16} />
								<span>Save</span>
							</button>
							<button class="action-button danger" on:click={() => deleteMacro(activeTab)} disabled={loading.content}>
								<span>Delete</span>
							</button>
						</div>
					</div>

					{#if loading.content}
						<div class="loading">Loading macro content...</div>
					{:else if errors.content}
						<div class="error">
							<p>Error loading macro content:</p>
							<pre>{errors.content}</pre>
						</div>
					{:else}
						<div class="editor-container">
							<textarea
								bind:value={editedContent}
								class="json-editor"
								spellcheck="false"
								placeholder="Macro content will appear here..."
							></textarea>
						</div>
					{/if}
				</div>
			{:else}
				<div class="no-macro-selected">
					<p>Select a macro file to view and edit its content</p>
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
		margin-bottom: 0.5rem;
	}

	p {
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.config-tabs {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.config-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 0.5rem;
	}

	.config-tab {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		background: transparent;
		color: var(--text-secondary);
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.config-tab:hover {
		background: var(--bg-hover);
		color: var(--text-primary);
	}

	.config-tab.active {
		background: var(--primary-color);
		color: white;
	}

	.new-macro {
		margin-left: auto;
		background: var(--success-color);
		color: white;
	}

	.new-macro:hover {
		background: var(--success-color-hover);
	}

	.config-content {
		flex: 1;
		min-height: 400px;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.tab-panel {
		display: flex;
		flex-direction: column;
		height: 100%;
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

	.action-button.primary {
		background: var(--primary-color);
		color: white;
		border: none;
	}

	.action-button.primary:hover {
		background: var(--primary-color-hover);
	}

	.action-button.danger {
		background: var(--danger-color);
		color: white;
		border: none;
	}

	.action-button.danger:hover {
		background: var(--danger-color-hover);
	}

	.editor-container {
		flex: 1;
		padding: 1rem;
		overflow: auto;
	}

	.json-editor {
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

	.loading, .error, .no-macro-selected, .no-macros {
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

	.error pre {
		background: var(--bg-secondary);
		padding: 1rem;
		border-radius: 0.5rem;
		width: 100%;
		overflow: auto;
		margin-top: 0.5rem;
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
