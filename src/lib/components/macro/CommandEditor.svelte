<script lang="ts">
	import type { MacroStep } from '$lib/types/macro';
	import { createEventDispatcher } from 'svelte';

	export let step: MacroStep;
	export let index: number;

	const dispatch = createEventDispatcher<{
		update: { index: number; step: MacroStep };
		delete: { index: number };
		moveUp: { index: number };
		moveDown: { index: number };
	}>();

	let localStep = { ...step };

	// Handle changes to the step
	function updateStep() {
		dispatch('update', { index, step: localStep });
	}

	function deleteStep() {
		dispatch('delete', { index });
	}

	function moveUp() {
		dispatch('moveUp', { index });
	}

	function moveDown() {
		dispatch('moveDown', { index });
	}

	// Define options for step types
	const stepTypes = [
		{ value: 'keypress', label: 'Key Press' },
		{ value: 'delay', label: 'Delay (ms)' },
		{ value: 'text', label: 'Type Text' },
		{ value: 'special', label: 'Special Function' }
	];

	// Define common modifiers
	const availableModifiers = [
		{ value: 'shift', label: 'Shift' },
		{ value: 'ctrl', label: 'Ctrl' },
		{ value: 'alt', label: 'Alt' },
		{ value: 'meta', label: 'Meta/Windows' },
		{ value: 'gui', label: 'GUI' }
	];

	// Initialize modifiers array if needed
	if (!localStep.modifiers) {
		localStep.modifiers = [];
	}

	// Toggle a modifier
	function toggleModifier(modifier: string) {
		if (!localStep.modifiers) {
			localStep.modifiers = [];
		}

		if (localStep.modifiers.includes(modifier)) {
			localStep.modifiers = localStep.modifiers.filter((m) => m !== modifier);
		} else {
			localStep.modifiers = [...localStep.modifiers, modifier];
		}

		updateStep();
	}
</script>

<div class="bg-bg-secondary border-border-color relative rounded-lg border p-4">
	<div class="absolute top-2 right-2 flex space-x-1">
		<button
			class="text-text-secondary hover:text-accent-color rounded p-1 transition-colors"
			on:click={moveUp}
			title="Move up"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
			</svg>
		</button>
		<button
			class="text-text-secondary hover:text-accent-color rounded p-1 transition-colors"
			on:click={moveDown}
			title="Move down"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
		<button
			class="text-text-secondary rounded p-1 transition-colors hover:text-red-500"
			on:click={deleteStep}
			title="Delete step"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
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

	<div class="flex flex-col space-y-3 pr-12">
		<div class="flex items-center">
			<span
				class="bg-bg-primary text-text-secondary mr-2 flex h-6 w-6 items-center justify-center rounded-full text-sm"
			>
				{index + 1}
			</span>
			<select
				bind:value={localStep.type}
				on:change={updateStep}
				class="border-border-color bg-bg-primary text-text-primary flex-1 rounded border p-2"
			>
				{#each stepTypes as type}
					<option value={type.value}>{type.label}</option>
				{/each}
			</select>
		</div>

		{#if localStep.type === 'keypress' || localStep.type === 'special'}
			<input
				type="text"
				bind:value={localStep.value}
				on:input={updateStep}
				placeholder={localStep.type === 'keypress' ? 'Key (e.g. a, F1, Enter)' : 'Function name'}
				class="border-border-color bg-bg-primary text-text-primary w-full rounded border p-2"
			/>

			{#if localStep.type === 'keypress'}
				<div class="flex flex-wrap gap-2">
					{#each availableModifiers as mod}
						<label class="inline-flex items-center">
							<input
								type="checkbox"
								checked={localStep.modifiers?.includes(mod.value)}
								on:change={() => toggleModifier(mod.value)}
								class="mr-1"
							/>
							<span class="text-text-secondary text-sm">{mod.label}</span>
						</label>
					{/each}
				</div>
			{/if}
		{:else if localStep.type === 'delay'}
			<input
				type="number"
				bind:value={localStep.value}
				on:input={updateStep}
				min="0"
				step="50"
				placeholder="Delay in milliseconds"
				class="border-border-color bg-bg-primary text-text-primary w-full rounded border p-2"
			/>
		{:else if localStep.type === 'text'}
			<textarea
				bind:value={localStep.value}
				on:input={updateStep}
				placeholder="Text to type"
				rows="2"
				class="border-border-color bg-bg-primary text-text-primary w-full rounded border p-2"
			></textarea>
		{/if}
	</div>
</div>
