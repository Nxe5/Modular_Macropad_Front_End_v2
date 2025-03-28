<script lang="ts">
	export let tabs: { id: string; label: string }[] = [];
	export let activeTab = '';

	// Set the first tab as active if none is provided
	if (!activeTab && tabs.length > 0) {
		activeTab = tabs[0].id;
	}

	function setActiveTab(tabId: string) {
		activeTab = tabId;
	}
</script>

<div class="tabs-container">
	<div class="tabs-list border-border-color border-b">
		{#each tabs as tab}
			<button
				class="tab-button mr-2 px-4 py-2 transition-colors focus:outline-none {activeTab === tab.id
					? 'text-accent-color border-accent-color border-b-2'
					: 'text-text-secondary hover:text-text-primary'}"
				on:click={() => setActiveTab(tab.id)}
				aria-selected={activeTab === tab.id}
				role="tab"
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="tab-content py-4">
		<slot {activeTab} />
	</div>
</div>

<style>
	.tabs-container {
		width: 100%;
	}

	.tabs-list {
		display: flex;
		overflow-x: auto;
	}

	.tab-button {
		white-space: nowrap;
		font-weight: 500;
	}
</style>
