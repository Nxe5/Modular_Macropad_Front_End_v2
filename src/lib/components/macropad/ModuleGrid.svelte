<script lang="ts">
	import { Button, Display, Encoder } from '$lib/components';
	import type { ButtonConfig, EncoderConfig, DisplayConfig } from '$lib/types/config';
	import type { LayoutConfig } from '$lib/stores/layout';

	export let layout: LayoutConfig;
	export let buttons: ButtonConfig[] = [];
	export let encoders: EncoderConfig[] = [];
	export let display: DisplayConfig | null = null;
	export let editable: boolean = false;

	// Extract component configs based on their positions in the layout
	$: buttonConfigs = buttons.filter((button) =>
		layout.buttonPositions.some((pos) => pos.id === button.id)
	);

	$: encoderConfigs = encoders.filter((encoder) =>
		layout.encoderPositions.some((pos) => pos.id === encoder.id)
	);
</script>

<div class="macropad-layout" style="--grid-rows: {layout.rows}; --grid-cols: {layout.columns};">
	{#each layout.buttonPositions as position}
		{@const buttonConfig = buttons.find((b) => b.id === position.id)}
		{#if buttonConfig}
			<div
				class="grid-item"
				style="grid-row: {position.row} / span {position.rowSpan || 1}; 
                  grid-column: {position.col} / span {position.colSpan || 1};"
			>
				<Button config={buttonConfig} {editable} />
			</div>
		{/if}
	{/each}

	{#each layout.encoderPositions as position}
		{@const encoderConfig = encoders.find((e) => e.id === position.id)}
		{#if encoderConfig}
			<div
				class="grid-item"
				style="grid-row: {position.row}; 
                  grid-column: {position.col};"
			>
				<Encoder config={encoderConfig} {editable} />
			</div>
		{/if}
	{/each}

	{#if layout.displayPosition && display}
		<div
			class="grid-item"
			style="grid-row: {layout.displayPosition.row} / span {layout.displayPosition.rowSpan}; 
                grid-column: {layout.displayPosition.col} / span {layout.displayPosition.colSpan};"
		>
			<Display config={display} {editable} />
		</div>
	{/if}

	{#if editable}
		<div class="layout-controls">
			<span>Layout: {layout.name}</span>
			<span>Grid: {layout.rows}×{layout.columns}</span>
		</div>
	{/if}
</div>

<style>
	.macropad-layout {
		display: grid;
		grid-template-rows: repeat(var(--grid-rows), 1fr);
		grid-template-columns: repeat(var(--grid-cols), 1fr);
		gap: 0.5rem;
		width: 100%;
		height: 100%;
		padding: 1rem;
		background-color: var(--bg-primary);
		border-radius: 12px;
		border: 2px solid var(--border-color);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
		position: relative;
	}

	.grid-item {
		width: 100%;
		height: 100%;
	}

	.layout-controls {
		position: absolute;
		bottom: 0;
		right: 0;
		background-color: var(--bg-secondary);
		padding: 0.5rem;
		font-size: 0.8rem;
		border-top-left-radius: 8px;
		display: flex;
		flex-direction: column;
		color: var(--text-secondary);
	}
</style>
