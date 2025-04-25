<script lang="ts">
	import WiFiSettings from '$lib/components/ui/wifi/WiFiSettings.svelte';
	import FirmwareUpdate from '$lib/components/ui/firmware/FirmwareUpdate.svelte';
	
	// Define available settings sections
	const tabs = [
		{ id: 'wifi', label: 'WiFi' },
		{ id: 'firmware', label: 'Firmware' }
	];
	
	let activeTab = 'wifi';
	
	function setActiveTab(id: string) {
		activeTab = id;
	}
</script>

<div class="page-container">
	<h1>Settings</h1>
	
	<nav class="settings-nav">
		{#each tabs as tab}
			<button 
				class="nav-item {activeTab === tab.id ? 'active' : ''}" 
				on:click={() => setActiveTab(tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</nav>
	
	<div class="settings-content">
		{#if activeTab === 'wifi'}
			<WiFiSettings />
		{:else if activeTab === 'firmware'}
			<FirmwareUpdate />
		{/if}
	</div>
</div>

<style>
	.page-container {
		padding: 2rem 1rem;
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		margin-bottom: 1.5rem;
		text-align: center;
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	
	.settings-nav {
		display: flex;
		gap: 1.5rem;
		padding-bottom: 0.5rem;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid var(--border);
	}
	
	.nav-item {
		background: none;
		border: none;
		font-size: 1rem;
		font-weight: 500;
		color: var(--text-secondary);
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		border-radius: 0.25rem;
		transition: all 0.2s ease;
	}
	
	.nav-item:hover {
		color: var(--text-primary);
		background-color: var(--background-secondary);
	}
	
	.nav-item.active {
		color: var(--primary);
		font-weight: 600;
		position: relative;
	}
	
	.nav-item.active::after {
		content: '';
		position: absolute;
		bottom: -0.5rem;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: var(--primary);
	}
	
	.settings-content {
		margin-top: 1.5rem;
	}
</style>
