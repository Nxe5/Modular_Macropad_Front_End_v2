<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import Header from '$lib/components/layout/Header.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import { onMount } from 'svelte';

	let sidebarOpen = false;

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<div class="app" data-theme={$theme}>
	<Header />
	<Sidebar isOpen={sidebarOpen} />

	<main>
		<slot />
	</main>

	<footer>
		<p>ESP32 Macropad Configuration Tool</p>
	</footer>
</div>

<style>
	:global(:root[data-theme='light']) {
		--bg-primary: #ffffff;
		--bg-secondary: #f0f0f0;
		--text-primary: #333333;
		--text-secondary: #666666;
		--accent-color: #4a90e2;
		--border-color: #dddddd;
	}

	:global(:root[data-theme='dark']) {
		--bg-primary: #111827;
		--bg-secondary: #1f2937;
		--text-primary: #f9fafb;
		--text-secondary: #9ca3af;
		--accent-color: #60a5fa;
		--border-color: #374151;
	}

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--bg-primary);
		color: var(--text-primary);
	}

	main {
		flex: 1;
		padding: 1rem;
	}

	footer {
		padding: 1rem;
		text-align: center;
		background: var(--bg-secondary);
		border-top: 1px solid var(--border-color);
		color: var(--text-secondary);
	}
</style>
