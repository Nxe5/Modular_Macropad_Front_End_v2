<script lang="ts">
	export let type:
		| 'text'
		| 'password'
		| 'email'
		| 'number'
		| 'tel'
		| 'url'
		| 'search'
		| 'date'
		| 'time'
		| 'datetime-local'
		| 'month'
		| 'week' = 'text';
	export let value = '';
	export let placeholder = '';
	export let disabled = false;
	export let readonly = false;
	export let required = false;
	export let id = '';
	export let name = '';
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let step: number | undefined = undefined;
	export let pattern: string | undefined = undefined;
	export let autocomplete: string | undefined = undefined;
</script>

<input
	{type}
	bind:value
	{placeholder}
	{disabled}
	{readonly}
	{required}
	{id}
	{name}
	{min}
	{max}
	{step}
	{pattern}
	{autocomplete}
	class="border-border-color bg-bg-primary text-text-primary focus:border-accent-color focus:ring-accent-color/20 w-full rounded-md border p-2 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
	on:input
	on:change
	on:focus
	on:blur
	{...$$restProps}
/>

<style>
	input[type='date'],
	input[type='time'],
	input[type='datetime-local'],
	input[type='month'],
	input[type='week'] {
		appearance: none;
	}
</style>
