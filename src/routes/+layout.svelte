<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import Header from '$lib/components/Layout/Header.svelte';
	import MockDataBadge from '$lib/components/MockDataBadge.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let connected = false; // Default to disconnected until real connection is implemented
	
	// Update connected state based on connection store
	$: connected = $connection.connected;
</script>

<div class="app">
	<Header {connected} />

	<main class="main container">
		<slot />
	</main>

	<footer class="footer">
		<div class="container">Ocho Labs Snap3r Configuration Tool</div>
	</footer>
	
	<MockDataBadge />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
