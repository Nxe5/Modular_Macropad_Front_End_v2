<script lang="ts">
	import type { Macro } from '$lib/types/macro';
	import { createEventDispatcher } from 'svelte';

	export let macro: Macro;
	export let readonly = false;

	const dispatch = createEventDispatcher<{
		edit: { id: string };
		delete: { id: string };
	}>();

	function handleEdit() {
		if (!readonly) {
			dispatch('edit', { id: macro.id });
		}
	}

	function handleDelete() {
		if (!readonly) {
			dispatch('delete', { id: macro.id });
		}
	}
</script>

<div class="bg-bg-secondary overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
	<div class="p-4">
		<div class="flex items-start justify-between">
			<h3 class="text-text-primary text-lg font-medium">{macro.name}</h3>
			{#if !readonly}
				<div class="flex space-x-2">
					<button
						class="text-text-secondary hover:text-accent-color rounded p-1 transition-colors"
						on:click={handleEdit}
						aria-label="Edit macro"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
							/>
						</svg>
					</button>
					<button
						class="text-text-secondary rounded p-1 transition-colors hover:text-red-500"
						on:click={handleDelete}
						aria-label="Delete macro"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
				</div>
			{/if}
		</div>
		<p class="text-text-secondary mt-2 text-sm">{macro.description}</p>

		<div class="bg-bg-primary text-text-secondary mt-4 rounded px-3 py-2 text-sm">
			<span class="font-mono">{macro.sequence.length} steps</span>
		</div>
	</div>
</div>
