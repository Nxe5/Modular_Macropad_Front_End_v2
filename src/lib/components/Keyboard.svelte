<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let selectedKey: string | null = null;
	
	// Define interfaces for keyboard component
	interface KeyboardKey {
		key: string;
		width: number;
	}
	
	interface KeySelectEvent {
		key: string;
	}
	
	const dispatch = createEventDispatcher<{
		keySelect: KeySelectEvent;
	}>();
	
	// Define keyboard layout
	const keyboardLayout: KeyboardKey[][] = [
		// Function keys row
		[
			{ key: 'esc', width: 1 },
			{ key: 'f1', width: 1 },
			{ key: 'f2', width: 1 },
			{ key: 'f3', width: 1 },
			{ key: 'f4', width: 1 },
			{ key: 'f5', width: 1 },
			{ key: 'f6', width: 1 },
			{ key: 'f7', width: 1 },
			{ key: 'f8', width: 1 },
			{ key: 'f9', width: 1 },
			{ key: 'f10', width: 1 },
			{ key: 'f11', width: 1 },
			{ key: 'f12', width: 1 }
		],
		// Numbers row
		[
			{ key: '`', width: 1 },
			{ key: '1', width: 1 },
			{ key: '2', width: 1 },
			{ key: '3', width: 1 },
			{ key: '4', width: 1 },
			{ key: '5', width: 1 },
			{ key: '6', width: 1 },
			{ key: '7', width: 1 },
			{ key: '8', width: 1 },
			{ key: '9', width: 1 },
			{ key: '0', width: 1 },
			{ key: '-', width: 1 },
			{ key: '=', width: 1 },
			{ key: 'backspace', width: 2 }
		],
		// First letter row
		[
			{ key: 'tab', width: 1.5 },
			{ key: 'q', width: 1 },
			{ key: 'w', width: 1 },
			{ key: 'e', width: 1 },
			{ key: 'r', width: 1 },
			{ key: 't', width: 1 },
			{ key: 'y', width: 1 },
			{ key: 'u', width: 1 },
			{ key: 'i', width: 1 },
			{ key: 'o', width: 1 },
			{ key: 'p', width: 1 },
			{ key: '[', width: 1 },
			{ key: ']', width: 1 },
			{ key: '\\', width: 1.5 }
		],
		// Second letter row
		[
			{ key: 'caps', width: 1.75 },
			{ key: 'a', width: 1 },
			{ key: 's', width: 1 },
			{ key: 'd', width: 1 },
			{ key: 'f', width: 1 },
			{ key: 'g', width: 1 },
			{ key: 'h', width: 1 },
			{ key: 'j', width: 1 },
			{ key: 'k', width: 1 },
			{ key: 'l', width: 1 },
			{ key: ';', width: 1 },
			{ key: "'", width: 1 },
			{ key: 'enter', width: 2.25 }
		],
		// Third letter row
		[
			{ key: 'shift', width: 2.25 },
			{ key: 'z', width: 1 },
			{ key: 'x', width: 1 },
			{ key: 'c', width: 1 },
			{ key: 'v', width: 1 },
			{ key: 'b', width: 1 },
			{ key: 'n', width: 1 },
			{ key: 'm', width: 1 },
			{ key: ',', width: 1 },
			{ key: '.', width: 1 },
			{ key: '/', width: 1 },
			{ key: 'shift', width: 2.75 }
		],
		// Bottom row
		[
			{ key: 'ctrl', width: 1.25 },
			{ key: 'win', width: 1.25 },
			{ key: 'alt', width: 1.25 },
			{ key: 'space', width: 6.25 },
			{ key: 'alt', width: 1.25 },
			{ key: 'win', width: 1.25 },
			{ key: 'ctrl', width: 1.25 }
		]
	];
	
	function handleKeyClick(key: string): void {
		selectedKey = key;
		dispatch('keySelect', { key });
	}
</script>

<div class="keyboard">
	{#each keyboardLayout as row}
		<div class="keyboard-row">
			{#each row as { key, width }}
				<button
					class="key"
					class:selected={selectedKey === key}
					style="flex: {width}"
					on:click={() => handleKeyClick(key)}
				>
					{key}
				</button>
			{/each}
		</div>
	{/each}
</div>

<style>
	.keyboard {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		background-color: var(--bg-primary);
		border-radius: 0.5rem;
		border: 1px solid var(--border-color);
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
	}

	.keyboard-row {
		display: flex;
		gap: 0.25rem;
		justify-content: center;
	}

	.key {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 2.5rem;
		height: 2.5rem;
		padding: 0.5rem;
		background-color: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		color: var(--text-primary);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
		user-select: none;
	}

	.key:hover {
		background-color: var(--accent-color);
		color: white;
		border-color: var(--accent-color);
	}

	.key.selected {
		background-color: var(--accent-color);
		color: white;
		border-color: var(--accent-color);
	}

	/* Special key styles */
	.key[data-key="space"] {
		min-width: 8rem;
	}

	.key[data-key="enter"],
	.key[data-key="shift"],
	.key[data-key="caps"],
	.key[data-key="tab"],
	.key[data-key="backspace"] {
		min-width: 4rem;
	}
</style> 