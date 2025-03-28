<script lang="ts">
	import { Info, Cpu, Play, Lightbulb, FileText } from 'lucide-svelte';

	// Active tab state
	let activeTab = 'info';

	// Function to handle tab switching
	function switchTab(tab: string) {
		activeTab = tab;
	}
</script>

<div class="page-container">
	<h1>Raw Configuration</h1>
	<p>View and edit configuration files for your macropad.</p>

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
					<h2>Info Configuration</h2>
					<p>Basic information about your macropad.</p>
					<!-- Info content will go here -->
				</div>
			{:else if activeTab === 'components'}
				<div class="tab-panel">
					<h2>Components Configuration</h2>
					<p>Configure the hardware components of your macropad.</p>
					<!-- Components content will go here -->
				</div>
			{:else if activeTab === 'actions'}
				<div class="tab-panel">
					<h2>Actions Configuration</h2>
					<p>Configure the actions and key mappings for your macropad.</p>
					<!-- Actions content will go here -->
				</div>
			{:else if activeTab === 'leds'}
				<div class="tab-panel">
					<h2>LEDs Configuration</h2>
					<p>Configure the LED settings for your macropad.</p>
					<!-- LEDs content will go here -->
				</div>
			{:else if activeTab === 'reports'}
				<div class="tab-panel">
					<h2>Reports Configuration</h2>
					<p>Configure the reports and notifications for your macropad.</p>
					<!-- Reports content will go here -->
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

	/* Dark mode adjustments */
	:global([data-theme='dark']) .config-tab:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}
</style>
