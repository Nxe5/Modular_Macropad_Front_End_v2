<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components';
	import { theme } from '$lib/stores/theme';
	import { ApiClient } from '$lib/api/client';

	let configData: any = null;
	let isLoading = true;
	let error = null;

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

<div class="home-container">
	<h1>Macropad Configuration</h1>

	<div class="dashboard">
		{#if isLoading}
			<div class="loading">Loading macropad information...</div>
		{:else if error}
			<div class="error">
				<p>Error connecting to macropad: {error.message}</p>
				<p>Make sure your macropad is connected and try again.</p>
			</div>
		{:else}
			<div class="macropad-info">
				<h2>Welcome to your Macropad Control Panel</h2>
				<p>Use this interface to configure your macropad's buttons, encoders, and display.</p>

				<div class="status-panel">
					<div class="status-item">
						<h3>Device Information</h3>
						<ul>
							<li><strong>Macropad Name:</strong> {configData?.name || 'Unknown'}</li>
							<li><strong>Firmware Version:</strong> {configData?.version || 'Unknown'}</li>
							<li><strong>Status:</strong> Connected</li>
						</ul>
					</div>

					<div class="status-item">
						<h3>Quick Stats</h3>
						<ul>
							<li><strong>Buttons:</strong> {configData?.buttons?.length || 0} configured</li>
							<li><strong>Encoders:</strong> {configData?.encoders?.length || 0} configured</li>
							<li><strong>Macros:</strong> {configData?.macros?.length || 0} available</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="quick-actions">
				<h3>Quick Actions</h3>
				<div class="action-buttons">
					<a href="/config" class="action-button">
						<span class="icon">⚙️</span>
						<span>Configure Layout</span>
					</a>
					<a href="/macros" class="action-button">
						<span class="icon">🔄</span>
						<span>Edit Macros</span>
					</a>
				</div>
			</div>
		{/if}
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
