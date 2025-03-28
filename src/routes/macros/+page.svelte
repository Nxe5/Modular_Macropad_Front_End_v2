<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import { Layers, Plus } from 'lucide-svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center">
			<Layers class="text-accent-color mr-3 h-6 w-6" />
			<h1 class="text-3xl font-bold">Macros</h1>
		</div>
		<Button variant="primary" class="flex items-center gap-2">
			<Plus class="h-4 w-4" />
			<span>Add Macro</span>
		</Button>
	</div>

	<Card class="mb-6">
		<div class="prose dark:prose-invert max-w-none">
			<p>
				Configure key mappings, macros, and shortcuts for your macropad. Define what happens when
				each key is pressed.
			</p>
		</div>
	</Card>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		<!-- Key 1 -->
		<Card class="flex flex-col">
			<div class="mb-4">
				<h3 class="font-medium">Key 1</h3>
				<div class="text-text-secondary mt-1 text-sm">Copy (Ctrl+C)</div>
			</div>
			<div class="mb-4 flex-1">
				<div class="bg-bg-secondary rounded p-3 text-sm">
					<div class="text-text-secondary mb-1 text-xs">Command:</div>
					<code>CTRL+C</code>
				</div>
			</div>
			<div class="flex justify-end gap-2">
				<Button variant="ghost" size="sm">Edit</Button>
			</div>
		</Card>

		<!-- Key 2 -->
		<Card class="flex flex-col">
			<div class="mb-4">
				<h3 class="font-medium">Key 2</h3>
				<div class="text-text-secondary mt-1 text-sm">Paste (Ctrl+V)</div>
			</div>
			<div class="mb-4 flex-1">
				<div class="bg-bg-secondary rounded p-3 text-sm">
					<div class="text-text-secondary mb-1 text-xs">Command:</div>
					<code>CTRL+V</code>
				</div>
			</div>
			<div class="flex justify-end gap-2">
				<Button variant="ghost" size="sm">Edit</Button>
			</div>
		</Card>

		<!-- Key 3 -->
		<Card class="flex flex-col">
			<div class="mb-4">
				<h3 class="font-medium">Key 3</h3>
				<div class="text-text-secondary mt-1 text-sm">Select All (Ctrl+A)</div>
			</div>
			<div class="mb-4 flex-1">
				<div class="bg-bg-secondary rounded p-3 text-sm">
					<div class="text-text-secondary mb-1 text-xs">Command:</div>
					<code>CTRL+A</code>
				</div>
			</div>
			<div class="flex justify-end gap-2">
				<Button variant="ghost" size="sm">Edit</Button>
			</div>
		</Card>

		<!-- Key 4 (Empty) -->
		<Card class="flex flex-col border-dashed">
			<div class="text-text-secondary flex h-full flex-col items-center justify-center py-8">
				<Plus class="mb-2 h-8 w-8" />
				<div class="text-center">
					<p class="font-medium">Key 4</p>
					<p class="mt-1 text-sm">No macro assigned</p>
					<Button variant="ghost" class="mt-4">Configure</Button>
				</div>
			</div>
		</Card>
	</div>
</div>
