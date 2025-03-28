<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md';
</script>

<a href="/" class="flex items-center">
	<span class={`font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>
		<span class="text-accent-color">Ocho</span>
		<span class="text-text-primary">Labs</span>
	</span>
</a>

<style>
	a {
		text-decoration: none;
	}
</style>
