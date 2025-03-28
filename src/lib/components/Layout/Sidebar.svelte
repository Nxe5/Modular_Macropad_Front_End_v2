<script lang="ts">
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
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
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-3 h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
						Home
					</a>
				</li>
				<li>
					<a
						href="/macros"
						class="text-text-primary hover:bg-bg-secondary flex items-center rounded-md px-3 py-2 transition-colors"
						on:click={closeMenu}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-3 h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							/>
						</svg>
						Macros
					</a>
				</li>
				<li>
					<a
						href="/lighting"
						class="text-text-primary hover:bg-bg-secondary flex items-center rounded-md px-3 py-2 transition-colors"
						on:click={closeMenu}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-3 h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
							/>
						</svg>
						Lighting
					</a>
				</li>
				<li>
					<a
						href="/settings"
						class="text-text-primary hover:bg-bg-secondary flex items-center rounded-md px-3 py-2 transition-colors"
						on:click={closeMenu}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-3 h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						Settings
					</a>
				</li>
				<li>
					<a
						href="/config"
						class="text-text-primary hover:bg-bg-secondary flex items-center rounded-md px-3 py-2 transition-colors"
						on:click={closeMenu}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-3 h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
							/>
						</svg>
						Raw Config
					</a>
				</li>
			</ul>
		</nav>
	</div>
</div>
