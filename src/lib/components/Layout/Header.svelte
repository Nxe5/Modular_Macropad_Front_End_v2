<script lang="ts">
	import ThemeToggle from '../shared/ThemeToggle.svelte';
	import { Keyboard, Settings, FileJson, Layers, Lightbulb } from 'lucide-svelte';

	export let connected = false;

	function reconnect() {
		console.log('Attempting to reconnect...');
		// In the real implementation, this would trigger a reconnection attempt
	}
</script>

<header class="header">
	<div class="container">
		<div
			style="display: flex; justify-content: center; align-items: center; flex-direction: column; padding: 1rem 0;"
		>
			<a href="/" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
				Ocho Labs Macropad
			</a>

			<nav class="nav">
				<a href="/" class="nav-link">
					<Keyboard size={18} />
					<span>Macropad</span>
				</a>
				<a href="/macros" class="nav-link">
					<Layers size={18} />
					<span>Macros</span>
				</a>
				<a href="/lighting" class="nav-link">
					<Lightbulb size={18} />
					<span>Lighting</span>
				</a>
				<a href="/settings" class="nav-link">
					<Settings size={18} />
					<span>Settings</span>
				</a>
				<a href="/config" class="nav-link">
					<FileJson size={18} />
					<span>Raw Config</span>
				</a>
			</nav>
		</div>

		<div
			style="display: flex; justify-content: flex-end; align-items: center; gap: 1rem; margin-top: 1rem;"
		>
			<div style="display: flex; align-items: center;">
				<span
					style="height: 10px; width: 10px; border-radius: 50%; margin-right: 0.5rem; 
					background-color: {connected ? '#22c55e' : '#ef4444'};"
					aria-hidden="true"
				></span>
				<span style="font-size: 0.875rem; color: var(--text-secondary);">
					{connected ? 'Connected' : 'Disconnected'}
				</span>
				{#if !connected}
					<button
						on:click={reconnect}
						style="margin-left: 0.5rem; padding: 0.25rem; color: var(--text-secondary);"
						aria-label="Reconnect"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M21 2v6h-6"></path>
							<path d="M3 12a9 9 0 0 1 15-6.7l3-3"></path>
							<path d="M3 22v-6h6"></path>
							<path d="M21 12a9 9 0 0 1-15 6.7l-3 3"></path>
						</svg>
					</button>
				{/if}
			</div>
			<ThemeToggle />
		</div>
	</div>
</header>
