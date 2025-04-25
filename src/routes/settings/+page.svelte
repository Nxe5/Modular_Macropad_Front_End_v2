<script lang="ts">
	import Tabs from '$lib/components/ui/tabs.svelte';
	import WiFiSettings from '$lib/components/ui/wifi/WiFiSettings.svelte';
	
	// Define available settings sections
	const tabs = [
		{ id: 'wifi', label: 'WiFi' },
		{ id: 'device', label: 'Device' },
		{ id: 'appearance', label: 'Appearance' }
	];
	
	let activeTab = 'wifi';
</script>

<div class="page-container">
	<h1>Settings</h1>
	
	<Tabs {tabs} bind:activeTab />
	
	<div class="settings-content">
		{#if activeTab === 'wifi'}
			<WiFiSettings />
		{:else if activeTab === 'device'}
			<div class="placeholder">
				<p>Device settings will be available soon.</p>
			</div>
		{:else if activeTab === 'appearance'}
			<div class="placeholder">
				<p>Appearance settings will be available soon.</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.page-container {
		padding: 2rem 1rem;
	}

	h1 {
		margin-bottom: 1.5rem;
		text-align: center;
	}
	
	.settings-content {
		margin-top: 1.5rem;
	}
	
	.placeholder {
		padding: 3rem 1rem;
		text-align: center;
		color: var(--text-secondary);
	}
</style>
