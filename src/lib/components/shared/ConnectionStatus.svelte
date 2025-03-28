<script lang="ts">
	import { WifiOff, Wifi } from 'lucide-svelte';
	export let connected = false;
</script>

<div class="flex items-center">
	{#if connected}
		<Wifi class="mr-2 h-4 w-4 text-green-500" />
		<span class="text-text-secondary text-sm">Connected</span>
	{:else}
		<WifiOff class="mr-2 h-4 w-4 text-red-500" />
		<span class="text-text-secondary text-sm">Disconnected</span>
	{/if}
</div>
