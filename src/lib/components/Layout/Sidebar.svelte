<script lang="ts">
	import { Home, Settings, Terminal, Layers, Lightbulb, X } from 'lucide-svelte';
	export let isOpen = false;

	function closeMenu() {
		isOpen = false;
	}
</script>

<div class="lg:hidden">
	<!-- Mobile sidebar overlay -->
	{#if isOpen}
		<div
			class="bg-opacity-50 fixed inset-0 z-20 bg-black transition-opacity"
			on:click={closeMenu}
			aria-hidden="true"
		></div>
	{/if}

	<!-- Sidebar -->
	<div
		class="bg-bg-primary fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto transition duration-300 ease-in-out {isOpen
			? 'translate-x-0'
			: '-translate-x-full'}"
	>
		<div class="border-border-color flex h-16 items-center justify-between border-b px-4">
			<a
				href="/"
				class="text-accent-color flex items-center text-xl font-bold"
				on:click={closeMenu}
			>
				<span class="mr-2">⌨️</span>
				<span>Macropad</span>
			</a>
			<button
				type="button"
				class="text-text-primary hover:text-accent-color"
				on:click={closeMenu}
				aria-label="Close menu"
			>
				<X class="h-6 w-6" />
			</button>
		</div>

		<nav class="p-4">
			<ul class="space-y-2">
				<li>
					<a
						href="/"
						class="text-text-primary hover:bg-bg-secondary flex items-center rounded-md px-3 py-2 transition-colors"
						on:click={closeMenu}
					>
						<Home class="mr-3 h-5 w-5" />
						Home
					</a>
				</li>
				<li>
					<a
						href="/macros"
						class="text-text-primary hover:bg-bg-secondary flex items-center rounded-md px-3 py-2 transition-colors"
						on:click={closeMenu}
					>
						<Layers class="mr-3 h-5 w-5" />
						Macros
					</a>
				</li>
				<li>
					<a
						href="/lighting"
						class="text-text-primary hover:bg-bg-secondary flex items-center rounded-md px-3 py-2 transition-colors"
						on:click={closeMenu}
					>
						<Lightbulb class="mr-3 h-5 w-5" />
						Lighting
					</a>
				</li>
				<li>
					<a
						href="/settings"
						class="text-text-primary hover:bg-bg-secondary flex items-center rounded-md px-3 py-2 transition-colors"
						on:click={closeMenu}
					>
						<Settings class="mr-3 h-5 w-5" />
						Settings
					</a>
				</li>
				<li>
					<a
						href="/config"
						class="text-text-primary hover:bg-bg-secondary flex items-center rounded-md px-3 py-2 transition-colors"
						on:click={closeMenu}
					>
						<Terminal class="mr-3 h-5 w-5" />
						Raw Config
					</a>
				</li>
			</ul>
		</nav>
	</div>
</div>
