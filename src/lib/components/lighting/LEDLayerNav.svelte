<script lang="ts">
	import { Plus, X, Edit2 } from 'lucide-svelte';
	
	// Props: Available layers, active layer, layer handlers
	export let layers: Array<{
		'layer-name': string;
		active: boolean;
	}> = [];
	
	export let activeLayer: string = '';
	export let onSelectLayer: (layerName: string) => void;
	export let onAddLayer: () => void;
	export let onRemoveLayer: (layerName: string) => void;
	export let onRenameLayer: (oldName: string, newName: string) => void;
	
	// Layer renaming
	let isRenaming = false;
	let layerToRename = '';
	let newLayerName = '';
	
	function startRenaming(layerName: string) {
		layerToRename = layerName;
		newLayerName = layerName;
		isRenaming = true;
	}
	
	function submitRename() {
		if (newLayerName && newLayerName !== layerToRename) {
			onRenameLayer(layerToRename, newLayerName);
		}
		
		// Reset renaming state
		isRenaming = false;
		layerToRename = '';
		newLayerName = '';
	}
</script>

<div class="layer-nav">
	<div class="layer-label">Layer:</div>
	
	<div class="layer-buttons">
		{#each layers as layer}
			{#if isRenaming && layerToRename === layer['layer-name']}
				<form class="rename-form" on:submit|preventDefault={submitRename}>
					<input 
						type="text" 
						bind:value={newLayerName} 
						on:blur={submitRename}
						autofocus
					/>
				</form>
			{:else}
				<div class="layer-button-group">
					<button 
						class="layer-button {activeLayer === layer['layer-name'] ? 'active' : ''}"
						on:click={() => onSelectLayer(layer['layer-name'])}
					>
						{layer['layer-name']}
					</button>
					
					<div class="button-actions">
						<button 
							class="icon-button edit"
							on:click={() => startRenaming(layer['layer-name'])}
							title="Rename layer"
						>
							<Edit2 size={14} />
						</button>
						
						{#if layers.length > 1}
							<button 
								class="icon-button delete"
								on:click={() => onRemoveLayer(layer['layer-name'])}
								title="Delete layer"
							>
								<X size={14} />
							</button>
						{/if}
					</div>
				</div>
			{/if}
		{/each}
		
		<button 
			class="layer-button add"
			on:click={onAddLayer}
			title="Add new layer"
		>
			<Plus size={16} />
		</button>
	</div>
</div>

<style>
	.layer-nav {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color);
	}
	
	.layer-label {
		font-weight: 600;
		color: var(--text-primary);
	}
	
	.layer-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
	}
	
	.layer-button-group {
		display: flex;
		align-items: center;
		border-radius: 0.25rem;
		background-color: var(--bg-secondary);
		overflow: hidden;
	}
	
	.layer-button {
		padding: 0.5rem 1rem;
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		border-radius: 0.25rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.layer-button:hover {
		background-color: var(--bg-hover);
	}
	
	.layer-button.active {
		background-color: var(--accent-color);
		color: white;
		border-color: var(--accent-color);
	}
	
	.layer-button.add {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background-color: var(--bg-primary);
	}
	
	.button-actions {
		display: flex;
		align-items: center;
		opacity: 0;
		transition: opacity 0.2s ease;
		background-color: var(--bg-secondary);
		margin-left: 0.25rem;
		border-left: 1px solid var(--border-color);
	}
	
	.layer-button-group:hover .button-actions {
		opacity: 1;
	}
	
	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.35rem;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-secondary);
		transition: all 0.2s ease;
	}
	
	.icon-button:hover {
		color: var(--text-primary);
	}
	
	.icon-button.delete:hover {
		color: var(--destructive);
	}
	
	.rename-form {
		display: flex;
	}
	
	.rename-form input {
		padding: 0.5rem;
		border: 1px solid var(--accent-color);
		border-radius: 0.25rem;
		background-color: var(--bg-primary);
		color: var(--text-primary);
		font-size: 0.875rem;
		outline: none;
		width: 150px;
	}
</style> 