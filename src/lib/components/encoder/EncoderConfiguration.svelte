<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';

	export let binding: any = null;
	export let componentId: string = '';
	export let activeLayer: string = '';
	export let selectedKey: string | null = null;
	export let activeEncoderTab: 'clockwise' | 'counterclockwise' | 'button' = 'clockwise';

	type ActionType = 'hid' | 'multimedia';
	type ActionKey = 'clockwise' | 'counterclockwise' | 'button';

	// Current action type selection ('hid' or 'multimedia')
	let actionTypes: Record<ActionKey, ActionType> = {
		clockwise: 'multimedia',
		counterclockwise: 'multimedia',
		button: 'multimedia'
	};

	// Initialize action types from existing binding
	$: {
		if (binding) {
			// For backward compatibility with older formats
			if (binding.type) {
				const type = binding.type as ActionType;
				actionTypes.clockwise = type;
				actionTypes.counterclockwise = type;
				actionTypes.button = type;
			}
			
			// Check for newer individual action types - standalone properties
			if (binding.clockwiseType) actionTypes.clockwise = binding.clockwiseType as ActionType;
			if (binding.counterclockwiseType) actionTypes.counterclockwise = binding.counterclockwiseType as ActionType;
			if (binding.buttonType) actionTypes.button = binding.buttonType as ActionType;
			
			// Check for newer structured format
			if (binding.clockwise && typeof binding.clockwise === 'object' && binding.clockwise.type) {
				actionTypes.clockwise = binding.clockwise.type as ActionType;
			}
			if (binding.counterclockwise && typeof binding.counterclockwise === 'object' && binding.counterclockwise.type) {
				actionTypes.counterclockwise = binding.counterclockwise.type as ActionType;
			}
			if (binding.buttonPress && typeof binding.buttonPress === 'object' && binding.buttonPress.type) {
				actionTypes.button = binding.buttonPress.type as ActionType;
			}
		}
	}

	const dispatch = createEventDispatcher<{
		keySelect: { key: string; action: ActionKey; actionType: ActionType };
		typeChange: { action: ActionKey; actionType: ActionType };
	}>();

	let pendingBindings: any = {
		clockwise: null,
		counterclockwise: null,
		button: null
	};

	// Handle tab switching
	function handleTabSelect(tab: ActionKey) {
		activeEncoderTab = tab;
		selectedKey = null;
	}

	// Handle key selection from keyboard
	function handleKeySelect(event: CustomEvent<{key: string}>) {
		selectedKey = event.detail.key;
		dispatch('keySelect', { 
			key: event.detail.key, 
			action: activeEncoderTab,
			actionType: actionTypes[activeEncoderTab]
		});
	}

	// Handle type selection change
	function handleTypeChange(action: ActionKey, type: ActionType) {
		actionTypes[action] = type;
		dispatch('typeChange', {
			action,
			actionType: type
		});
	}

	// Helper to get the right property name for button actions
	function getActionPropertyName(action: ActionKey): string {
		return action === 'button' ? 'buttonPress' : action;
	}

	// Get the command array for an action (handles all formats)
	function getCommandArray(action: ActionKey): string[] | null {
		if (!binding) return null;
		
		const propName = getActionPropertyName(action);
		
		// Check for structured format first
		if (binding[propName] && typeof binding[propName] === 'object') {
			// New structured format (with type and command)
			if (binding[propName].command && Array.isArray(binding[propName].command)) {
				return binding[propName].command;
			}
			// Old object format but not structured (counterClockwise vs counterclockwise)
			if (propName === 'counterclockwise' && binding.counterClockwise && Array.isArray(binding.counterClockwise)) {
				return binding.counterClockwise;
			}
		}
		
		// Old flat format
		if (Array.isArray(binding[propName])) {
			return binding[propName];
		}
		
		// Special case for counterclockwise (check both casings)
		if (action === 'counterclockwise') {
			if (binding.counterClockwise && Array.isArray(binding.counterClockwise)) {
				return binding.counterClockwise;
			}
			if (binding.counterclockwise && Array.isArray(binding.counterclockwise)) {
				return binding.counterclockwise;
			}
		}
		
		return null;
	}

	// Get the human readable representation of a command
	function getCommandDisplay(action: ActionKey): string | null {
		const command = getCommandArray(action);
		return command ? command.join(', ') : null;
	}

	// Get the current type for an action
	function getCurrentType(action: ActionKey): ActionType {
		if (!binding) return actionTypes[action];
		
		const propName = getActionPropertyName(action);
		
		// Check for structured format
		if (binding[propName] && typeof binding[propName] === 'object' && binding[propName].type) {
			return binding[propName].type as ActionType;
		}
		
		// Check for specific action type
		if (action === 'clockwise' && binding.clockwiseType) {
			return binding.clockwiseType as ActionType;
		} else if (action === 'counterclockwise' && binding.counterclockwiseType) {
			return binding.counterclockwiseType as ActionType;
		} else if (action === 'button' && binding.buttonType) {
			return binding.buttonType as ActionType;
		}
		
		// Fall back to global type
		return (binding.type as ActionType) || actionTypes[action];
	}
</script>

<div class="encoder-config">
	<div class="encoder-tabs">
		<button 
			class="tab-button" 
			class:active={activeEncoderTab === 'clockwise'}
			on:click={() => handleTabSelect('clockwise')}
		>
			Clockwise
		</button>
		<button 
			class="tab-button" 
			class:active={activeEncoderTab === 'counterclockwise'}
			on:click={() => handleTabSelect('counterclockwise')}
		>
			Counter-Clockwise
		</button>
		<button 
			class="tab-button" 
			class:active={activeEncoderTab === 'button'}
			on:click={() => handleTabSelect('button')}
		>
			Button Press
		</button>
	</div>

	<div class="tab-content">
		<div class="binding-info">
			<h4>Current Binding</h4>
			{#if binding}
				{#if activeEncoderTab === 'clockwise'}
					<p><strong>Type:</strong> {getCurrentType('clockwise') || 'Not configured'}</p>
					{#if getCommandDisplay('clockwise')}
						<p><strong>Command:</strong> {getCommandDisplay('clockwise')}</p>
					{:else}
						<p><em>No binding configured for clockwise rotation</em></p>
					{/if}
				{:else if activeEncoderTab === 'counterclockwise'}
					<p><strong>Type:</strong> {getCurrentType('counterclockwise') || 'Not configured'}</p>
					{#if getCommandDisplay('counterclockwise')}
						<p><strong>Command:</strong> {getCommandDisplay('counterclockwise')}</p>
					{:else}
						<p><em>No binding configured for counter-clockwise rotation</em></p>
					{/if}
				{:else if activeEncoderTab === 'button'}
					<p><strong>Type:</strong> {getCurrentType('button') || 'Not configured'}</p>
					{#if getCommandDisplay('button')}
						<p><strong>Command:</strong> {getCommandDisplay('button')}</p>
					{:else}
						<p><em>No binding configured for button press</em></p>
					{/if}
				{/if}
			{:else}
				<p><em>No binding configured for this encoder in the current layer</em></p>
			{/if}
		</div>

		<div class="type-selection">
			<h4>Action Type</h4>
			<div class="radio-group">
				<label>
					<input 
						type="radio" 
						name="{activeEncoderTab}-type" 
						value="hid" 
						bind:group={actionTypes[activeEncoderTab]}
						on:change={() => handleTypeChange(activeEncoderTab, 'hid')}
					/>
					HID (Keyboard)
				</label>
				<label>
					<input 
						type="radio" 
						name="{activeEncoderTab}-type" 
						value="multimedia" 
						bind:group={actionTypes[activeEncoderTab]}
						on:change={() => handleTypeChange(activeEncoderTab, 'multimedia')}
					/>
					Multimedia
				</label>
			</div>
		</div>

		<div class="new-binding">
			<h4>New Binding</h4>
			{#if selectedKey}
				<p><strong>Key:</strong> {selectedKey}</p>
				<p><strong>Type:</strong> {actionTypes[activeEncoderTab]}</p>
			{:else}
				<p><em>None</em></p>
			{/if}
		</div>

		<div class="keyboard-section">
			<h4>Select a key to map to encoder {activeEncoderTab}</h4>
			<Keyboard {selectedKey} on:keySelect={handleKeySelect} />
		</div>
	</div>
</div>

<style>
	.encoder-config {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.encoder-tabs {
		display: flex;
		border-bottom: 1px solid var(--border-color);
		gap: 0.5rem;
	}

	.tab-button {
		padding: 0.5rem 1rem;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		cursor: pointer;
		color: var(--text-secondary);
	}

	.tab-button.active {
		border-bottom: 2px solid var(--accent-color);
		color: var(--text-primary);
	}

	.tab-content {
		padding: 1rem 0;
	}

	.binding-info, .new-binding, .type-selection {
		margin-bottom: 1.5rem;
		padding: 1rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		background-color: var(--bg-primary);
	}

	.keyboard-section {
		margin-top: 1.5rem;
	}

	h4 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1rem;
		font-weight: 500;
	}

	.radio-group {
		display: flex;
		gap: 1.5rem;
	}

	.radio-group label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.radio-group input {
		cursor: pointer;
	}
</style> 