<script lang="ts">
	export let connected = false;
</script>

<div class="flex items-center">
	<span
		class="mr-2 h-2.5 w-2.5 rounded-full {connected ? 'bg-green-500' : 'bg-red-500'}"
		aria-hidden="true"
	></span>
	<span class="text-text-secondary text-sm">
		{connected ? 'Connected' : 'Disconnected'}
	</span>
</div>
