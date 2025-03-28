<script lang="ts">
	import '../app.css';
	import { theme, toggleTheme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
</script>

<div class="app" data-theme={$theme}>
	<header>
		<div class="logo">Macropad Config</div>
		<nav>
			<a href="/">Home</a>
			<a href="/config">Configuration</a>
			<a href="/macros">Macros</a>
		</nav>
		<button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">
			{$theme === 'dark' ? '☀️' : '🌙'}
		</button>
	</header>

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
		--bg-primary: #1a1a1a;
		--bg-secondary: #2d2d2d;
		--text-primary: #ffffff;
		--text-secondary: #b3b3b3;
		--accent-color: #64b5f6;
		--border-color: #404040;
	}

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--bg-primary);
		color: var(--text-primary);
	}

	header {
		padding: 1rem 2rem;
		background: var(--bg-secondary);
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--border-color);
	}

	.logo {
		font-size: 1.2rem;
		font-weight: bold;
		color: var(--accent-color);
	}

	nav {
		display: flex;
		gap: 1.5rem;
	}

	nav a {
		color: var(--text-primary);
		text-decoration: none;
		padding: 0.5rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	nav a:hover {
		background-color: var(--bg-primary);
	}

	.theme-toggle {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 50%;
		transition: background-color 0.2s;
	}

	.theme-toggle:hover {
		background-color: var(--bg-primary);
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
