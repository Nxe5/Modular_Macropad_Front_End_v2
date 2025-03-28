<script lang="ts">
	import { theme, toggleTheme } from '$lib/stores/theme';
	import { Sun, Moon } from 'lucide-svelte';
</script>

<button
	type="button"
	class="text-text-primary hover:bg-bg-primary rounded-full p-2 transition-colors"
	on:click={toggleTheme}
	aria-label={$theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if $theme === 'dark'}
		<Sun class="h-5 w-5" />
	{:else}
		<Moon class="h-5 w-5" />
	{/if}
</button>
