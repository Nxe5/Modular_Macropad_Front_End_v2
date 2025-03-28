<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import Header from '$lib/components/Layout/Header.svelte';
	import { onMount } from 'svelte';

	let connected = false; // Default to disconnected until real connection is implemented
</script>

<div class="app">
	<Header {connected} />

	<main class="main container">
		<slot />
	</main>

	<footer class="footer">
		<div class="container">Ocho Labs Macropad Configuration Tool</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
