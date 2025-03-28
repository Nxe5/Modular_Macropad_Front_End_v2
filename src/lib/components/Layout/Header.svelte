<script lang="ts">
	import ThemeToggle from '../shared/ThemeToggle.svelte';
	import ConnectionStatus from '../shared/ConnectionStatus.svelte';
	import { Keyboard, Settings, FileJson, Layers, Lightbulb } from 'lucide-svelte';

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
			<a
				href="/"
				class="text-text-primary hover:text-accent-color flex items-center py-1 transition-colors"
			>
				<Keyboard class="mr-1.5 h-4 w-4" />
				<span>Macropad</span>
			</a>
			<a
				href="/macros"
				class="text-text-primary hover:text-accent-color flex items-center py-1 transition-colors"
			>
				<Layers class="mr-1.5 h-4 w-4" />
				<span>Macros</span>
			</a>
			<a
				href="/lighting"
				class="text-text-primary hover:text-accent-color flex items-center py-1 transition-colors"
			>
				<Lightbulb class="mr-1.5 h-4 w-4" />
				<span>Lighting</span>
			</a>
			<a
				href="/settings"
				class="text-text-primary hover:text-accent-color flex items-center py-1 transition-colors"
			>
				<Settings class="mr-1.5 h-4 w-4" />
				<span>Settings</span>
			</a>
			<a
				href="/config"
				class="text-text-primary hover:text-accent-color flex items-center py-1 transition-colors"
			>
				<FileJson class="mr-1.5 h-4 w-4" />
				<span>Raw Configurations</span>
			</a>
		</nav>

		<div class="flex items-center space-x-4">
			<ConnectionStatus {connected} />
			<ThemeToggle />
		</div>
	</div>
</header>
