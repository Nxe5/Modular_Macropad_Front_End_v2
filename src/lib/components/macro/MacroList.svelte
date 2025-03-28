<script lang="ts">
	import type { Macro } from '$lib/types/macro';
	import MacroCard from './MacroCard.svelte';
	import { createEventDispatcher } from 'svelte';

	export let macros: Macro[] = [];
	export let loading = false;
	export let readonly = false;

	const dispatch = createEventDispatcher<{
		edit: { id: string };
		delete: { id: string };
		create: void;
	}>();

	function handleEdit(event: CustomEvent<{ id: string }>) {
		dispatch('edit', { id: event.detail.id });
	}

	function handleDelete(event: CustomEvent<{ id: string }>) {
		dispatch('delete', { id: event.detail.id });
	}

	function handleCreate() {
		dispatch('create');
	}
</script>

<div class="space-y-4">
	{#if !readonly}
		<div class="flex items-center justify-between">
			<h2 class="text-text-primary text-xl font-semibold">Your Macros</h2>
			<button
				class="bg-accent-color hover:bg-accent-color/90 rounded-md px-4 py-2 text-white transition-colors"
				on:click={handleCreate}
			>
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/>
					</svg>
					<span>Create Macro</span>
				</div>
			</button>
		</div>
	{/if}

	{#if loading}
		<div class="flex justify-center py-10">
			<div class="border-accent-color h-10 w-10 animate-spin rounded-full border-b-2"></div>
		</div>
	{:else if macros.length === 0}
		<div class="bg-bg-secondary rounded-lg p-8 text-center">
			<p class="text-text-secondary">No macros found</p>
			{#if !readonly}
				<button class="text-accent-color mt-4 hover:underline" on:click={handleCreate}>
					Create your first macro
				</button>
			{/if}
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each macros as macro (macro.id)}
				<MacroCard {macro} {readonly} on:edit={handleEdit} on:delete={handleDelete} />
			{/each}
		</div>
	{/if}
</div>
