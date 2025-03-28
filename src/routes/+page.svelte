<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/ui/card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { Keyboard, Layers, Lightbulb, Settings, FileJson } from 'lucide-svelte';

	let configData: any = null;
	let isLoading = true;
	let error: Error | null = null;

	onMount(async () => {
		try {
			configData = await ApiClient.getInfo();
			isLoading = false;
		} catch (err) {
			error = err;
			isLoading = false;
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold">Ocho Labs</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<Card class="flex flex-col">
			<div class="mb-4 flex items-center">
				<Keyboard class="text-accent-color mr-3 h-6 w-6" />
				<h2 class="text-xl font-semibold">Macropad Status</h2>
			</div>
			<div class="flex-1">
				<p class="text-text-secondary mb-4">
					View and manage your macropad device status, connection, and information.
				</p>
				<div class="bg-bg-secondary mb-4 space-y-2 rounded-md p-4">
					<div class="flex justify-between">
						<span>Connection</span>
						<span class="text-green-500">Connected</span>
					</div>
					<div class="flex justify-between">
						<span>Firmware Version</span>
						<span>v1.2.3</span>
					</div>
					<div class="flex justify-between">
						<span>Battery</span>
						<span>82%</span>
					</div>
				</div>
			</div>
			<Button href="/settings" variant="ghost" class="mt-auto w-full">Device Settings</Button>
		</Card>

		<Card class="flex flex-col">
			<div class="mb-4 flex items-center">
				<Layers class="text-accent-color mr-3 h-6 w-6" />
				<h2 class="text-xl font-semibold">Macros</h2>
			</div>
			<div class="flex-1">
				<p class="text-text-secondary mb-4">
					Configure key mappings, macros, and shortcuts for your macropad.
				</p>
				<div class="bg-bg-secondary mb-4 space-y-2 rounded-md p-4">
					<div class="flex justify-between">
						<span>Active Profile</span>
						<span>Default</span>
					</div>
					<div class="flex justify-between">
						<span>Configured Keys</span>
						<span>12/16</span>
					</div>
					<div class="flex justify-between">
						<span>Saved Profiles</span>
						<span>3</span>
					</div>
				</div>
			</div>
			<Button href="/macros" variant="ghost" class="mt-auto w-full">Edit Macros</Button>
		</Card>

		<Card class="flex flex-col">
			<div class="mb-4 flex items-center">
				<Lightbulb class="text-accent-color mr-3 h-6 w-6" />
				<h2 class="text-xl font-semibold">Lighting</h2>
			</div>
			<div class="flex-1">
				<p class="text-text-secondary mb-4">
					Customize LED colors, brightness, and patterns for your macropad.
				</p>
				<div class="bg-bg-secondary mb-4 space-y-2 rounded-md p-4">
					<div class="flex justify-between">
						<span>Current Mode</span>
						<span>Rainbow</span>
					</div>
					<div class="flex justify-between">
						<span>Brightness</span>
						<span>75%</span>
					</div>
					<div class="flex justify-between">
						<span>Per-key Color</span>
						<span>Disabled</span>
					</div>
				</div>
			</div>
			<Button href="/lighting" variant="ghost" class="mt-auto w-full">Configure Lighting</Button>
		</Card>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card>
			<div class="mb-4 flex items-center">
				<Settings class="text-accent-color mr-3 h-6 w-6" />
				<h2 class="text-xl font-semibold">Settings</h2>
			</div>
			<p class="text-text-secondary mb-4">
				Configure device settings, firmware updates, and connection options.
			</p>
			<Button href="/settings" variant="ghost">Settings</Button>
		</Card>

		<Card>
			<div class="mb-4 flex items-center">
				<FileJson class="text-accent-color mr-3 h-6 w-6" />
				<h2 class="text-xl font-semibold">Raw Configurations</h2>
			</div>
			<p class="text-text-secondary mb-4">
				View and edit raw JSON configuration for advanced users.
			</p>
			<Button href="/config" variant="ghost">Edit Configurations</Button>
		</Card>
	</div>
</div>

<style>
	.home-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 2rem;
		text-align: center;
		color: var(--text-primary);
	}

	.dashboard {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.loading,
	.error {
		padding: 2rem;
		text-align: center;
		border-radius: 8px;
		background-color: var(--bg-secondary);
	}

	.error {
		border: 1px solid #e74c3c;
		color: #e74c3c;
	}

	.macropad-info {
		background-color: var(--bg-secondary);
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.status-panel {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.status-item {
		background-color: var(--bg-primary);
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	h3 {
		font-size: 1.2rem;
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		margin-bottom: 0.5rem;
		color: var(--text-secondary);
	}

	.quick-actions {
		background-color: var(--bg-secondary);
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.action-buttons {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.action-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-primary);
		color: var(--text-primary);
		text-decoration: none;
		padding: 1.5rem;
		border-radius: 8px;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.action-button:hover {
		transform: translateY(-3px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.icon {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}
</style>
