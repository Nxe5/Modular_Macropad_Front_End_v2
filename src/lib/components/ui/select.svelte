<script lang="ts">
	export let value = '';
	export let disabled = false;
	export let required = false;
	export let id = '';
	export let name = '';
	export let placeholder = '';
	export let options: { value: string; label: string }[] = [];
</script>

<div class="relative">
	<select
		bind:value
		{disabled}
		{required}
		{id}
		{name}
		class="border-border-color bg-bg-primary text-text-primary focus:border-accent-color focus:ring-accent-color/20 w-full appearance-none rounded-md border p-2 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
		on:change
		on:focus
		on:blur
		{...$$restProps}
	>
		{#if placeholder}
			<option value="" disabled selected>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	<div
		class="text-text-primary pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
	>
		<svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
			<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
		</svg>
	</div>
</div>
