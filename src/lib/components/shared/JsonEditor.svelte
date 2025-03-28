<script lang="ts">
	export let value: object = {};
	export let height = '300px';
	export let readonly = false;

	let textValue = '';
	let isValid = true;
	let errorMessage = '';

	// Format the JSON string initially
	$: {
		try {
			textValue = JSON.stringify(value, null, 2);
		} catch (error) {
			textValue = '{}';
			isValid = false;
			errorMessage = 'Invalid JSON object provided';
		}
	}

	// Update the value when the text changes
	function updateValue() {
		try {
			value = JSON.parse(textValue);
			isValid = true;
			errorMessage = '';
		} catch (error) {
			isValid = false;
			errorMessage = `Invalid JSON: ${error.message}`;
		}
	}
</script>

<div class="json-editor">
	<textarea
		class="bg-bg-primary text-text-primary w-full border p-3 font-mono text-sm {isValid
			? 'border-border-color'
			: 'border-red-500'} rounded"
		style="height: {height}; resize: vertical;"
		bind:value={textValue}
		on:input={updateValue}
		disabled={readonly}
		spellcheck="false"
		aria-label="JSON Editor"
	></textarea>

	{#if !isValid}
		<div class="mt-2 text-sm text-red-500">{errorMessage}</div>
	{/if}
</div>

<style>
	textarea {
		tab-size: 2;
	}
</style>
