<script lang="ts">
	import ThemeToggle from '../shared/ThemeToggle.svelte';
	import ConnectionStatus from '../shared/ConnectionStatus.svelte';

	export let connected = true;
</script>

<header class="bg-bg-secondary border-border-color border-b">
	<div class="container mx-auto flex items-center justify-between px-4 py-3">
		<div class="flex items-center">
			<a href="/" class="text-accent-color flex items-center text-xl font-bold">
				<span class="mr-2">⌨️</span>
				<span>Macropad Config</span>
			</a>
		</div>

		<nav class="mx-4 hidden flex-1 justify-center space-x-6 md:flex">
			<a href="/" class="text-text-primary hover:text-accent-color py-1 transition-colors">
				Home
			</a>
			<a href="/macros" class="text-text-primary hover:text-accent-color py-1 transition-colors">
				Macros
			</a>
			<a href="/lighting" class="text-text-primary hover:text-accent-color py-1 transition-colors">
				Lighting
			</a>
			<a href="/settings" class="text-text-primary hover:text-accent-color py-1 transition-colors">
				Settings
			</a>
			<a href="/config" class="text-text-primary hover:text-accent-color py-1 transition-colors">
				Raw Config
			</a>
		</nav>

		<div class="flex items-center space-x-4">
			<ConnectionStatus {connected} />
			<ThemeToggle />
		</div>
	</div>
</header>
