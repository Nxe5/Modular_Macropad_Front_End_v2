<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import { Lightbulb } from 'lucide-svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6 flex items-center">
		<Lightbulb class="text-accent-color mr-3 h-6 w-6" />
		<h1 class="text-3xl font-bold">Lighting</h1>
	</div>

	<Card class="mb-6">
		<div class="prose dark:prose-invert max-w-none">
			<p>Customize LED colors, brightness, and patterns for your macropad.</p>
		</div>
	</Card>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Lighting Mode -->
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Lighting Mode</h2>
			<div class="space-y-3">
				<div class="flex items-center">
					<input type="radio" id="solid" name="lightingMode" class="mr-3" checked />
					<label for="solid">Solid Color</label>
				</div>
				<div class="flex items-center">
					<input type="radio" id="rainbow" name="lightingMode" class="mr-3" />
					<label for="rainbow">Rainbow Wave</label>
				</div>
				<div class="flex items-center">
					<input type="radio" id="breathing" name="lightingMode" class="mr-3" />
					<label for="breathing">Breathing</label>
				</div>
				<div class="flex items-center">
					<input type="radio" id="reactive" name="lightingMode" class="mr-3" />
					<label for="reactive">Reactive</label>
				</div>
				<div class="flex items-center">
					<input type="radio" id="perkey" name="lightingMode" class="mr-3" />
					<label for="perkey">Per-Key Colors</label>
				</div>
			</div>
		</Card>

		<!-- Brightness & Speed -->
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Brightness & Speed</h2>
			<div class="space-y-6">
				<div>
					<label for="brightness" class="mb-2 block">Brightness</label>
					<input type="range" id="brightness" min="0" max="100" value="75" class="w-full" />
					<div class="text-text-secondary mt-1 flex justify-between text-sm">
						<span>0%</span>
						<span>75%</span>
						<span>100%</span>
					</div>
				</div>

				<div>
					<label for="speed" class="mb-2 block">Animation Speed</label>
					<input type="range" id="speed" min="0" max="100" value="50" class="w-full" />
					<div class="text-text-secondary mt-1 flex justify-between text-sm">
						<span>Slow</span>
						<span>Medium</span>
						<span>Fast</span>
					</div>
				</div>
			</div>
		</Card>

		<!-- Color Picker -->
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Color Selection</h2>
			<div class="grid grid-cols-4 gap-2">
				{#each ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#FFA500'] as color}
					<button
						class="border-border-color h-12 w-full rounded-md border"
						style="background-color: {color};"
						aria-label="Select color {color}"
					></button>
				{/each}
			</div>
			<div class="mt-4">
				<label for="customColor" class="mb-2 block">Custom Color</label>
				<input type="color" id="customColor" value="#60a5fa" class="h-10 w-full" />
			</div>
		</Card>

		<!-- Actions -->
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Actions</h2>
			<div class="space-y-3">
				<Button variant="primary" class="w-full">Save Configuration</Button>
				<Button variant="ghost" class="w-full">Reset to Default</Button>
			</div>
		</Card>
	</div>
</div>
