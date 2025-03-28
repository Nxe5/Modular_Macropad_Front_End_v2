<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import { FileJson } from 'lucide-svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6 flex items-center">
		<FileJson class="mr-3 h-6 w-6 text-accent-color" />
		<h1 class="text-3xl font-bold">Raw Configurations</h1>
	</div>
	
	<Card class="mb-6">
		<div class="prose max-w-none dark:prose-invert">
			<p>
				This section allows you to view and edit the raw JSON configuration for your macropad.
				Be careful when making changes, as incorrect formatting may cause issues.
			</p>
		</div>
	</Card>
	
	<Card>
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-xl font-semibold">Edit Configuration</h2>
			<div class="space-x-2">
				<Button variant="ghost">Load</Button>
				<Button variant="primary">Save Changes</Button>
			</div>
		</div>
		
		<div class="relative h-[500px] rounded border border-border-color">
			<textarea 
				class="h-full w-full resize-none bg-bg-primary p-4 font-mono text-sm text-text-primary focus:outline-none"
				spellcheck="false"
				placeholder="{
  'name': 'My Macropad',
  'version': '1.0.0',
  'keys': [
    {
      'id': 1,
      'name': 'Key 1',
      'command': 'CTRL+C',
      'color': '#FF0000'
    }
    // ... more keys
  ],
  'settings': {
    'brightness': 75,
    'mode': 'rainbow'
  }
}"
			></textarea>
		</div>
	</Card>
</div> 