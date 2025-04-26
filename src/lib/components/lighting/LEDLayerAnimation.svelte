<script lang="ts">
    // Props
    export let animationSettings: {
        active: boolean;
        mode: number;
        speed: number;
    };
    export let onChange: (settings: any) => void;

    // Animation modes from firmware (match LED_ANIM_* constants)
    const animationModes = [
        { id: 0, name: 'Rainbow' },        // LED_ANIM_RAINBOW
        { id: 1, name: 'Chase' },          // LED_ANIM_CHASE
        { id: 2, name: 'Breath' },         // LED_ANIM_BREATH
        { id: 3, name: 'Alternating' }     // LED_ANIM_ALTERNATING
    ];

    // Default values
    $: active = animationSettings?.active || false;
    $: mode = animationSettings?.mode || 0;
    $: speed = animationSettings?.speed || 100;

    // Handlers
    function handleActiveChange() {
        onChange({
            active: !active,
            mode,
            speed
        });
    }

    function updateMode(e: Event) {
        const select = e.target as HTMLSelectElement;
        const newMode = parseInt(select.value);
        onChange({
            active,
            mode: newMode,
            speed
        });
    }

    function updateSpeed(e: Event) {
        const input = e.target as HTMLInputElement;
        const newSpeed = parseInt(input.value);
        if (isNaN(newSpeed) || newSpeed < 10 || newSpeed > 1000) return;
        
        onChange({
            active,
            mode,
            speed: newSpeed
        });
    }
</script>

<div class="animation-panel">
    <h3>Layer Animation</h3>
    
    <div class="animation-controls">
        <div class="control-group">
            <label for="animation-active">Enable Animation</label>
            <div class="toggle-switch">
                <input 
                    type="checkbox" 
                    id="animation-active" 
                    checked={active}
                    on:change={handleActiveChange}
                />
                <span class="toggle-label">{active ? 'On' : 'Off'}</span>
            </div>
        </div>
        
        <div class="control-group">
            <label for="animation-mode">Animation Mode</label>
            <select 
                id="animation-mode" 
                value={mode} 
                on:change={updateMode}
                disabled={!active}
            >
                {#each animationModes as animMode}
                    <option value={animMode.id}>{animMode.name}</option>
                {/each}
            </select>
        </div>
        
        <div class="control-group">
            <label for="animation-speed">Animation Speed</label>
            <input 
                type="range" 
                id="animation-speed" 
                min="10" 
                max="1000" 
                step="10"
                value={speed}
                on:input={updateSpeed}
                disabled={!active}
            />
            <span class="speed-value">{speed}ms</span>
        </div>
    </div>
    
    <div class="animation-description">
        <h4>Current Animation: {animationModes.find(m => m.id === mode)?.name}</h4>
        <p class="description">
            {#if mode === 0}
                Cycles through a rainbow of colors across all LEDs.
            {:else if mode === 1}
                Animates LEDs in a chase pattern.
            {:else if mode === 2}
                Fades LEDs in and out in a breathing pattern.
            {:else if mode === 3}
                Alternates between colors for visual contrast.
            {/if}
        </p>
    </div>
</div>

<style>
    .animation-panel {
        background-color: var(--bg-secondary);
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        padding: 1rem;
        margin-bottom: 1rem;
    }
    
    h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    h4 {
        margin: 0.5rem 0;
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-secondary);
    }
    
    .animation-controls {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .control-group {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .control-group label {
        flex: 0 0 150px;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .toggle-switch {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    input[type="checkbox"] {
        appearance: none;
        width: 2.5rem;
        height: 1.25rem;
        background-color: #ccc;
        border-radius: 1rem;
        position: relative;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    input[type="checkbox"]::before {
        content: "";
        position: absolute;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        top: 0.125rem;
        left: 0.125rem;
        background-color: white;
        transition: all 0.3s;
    }
    
    input[type="checkbox"]:checked {
        background-color: var(--accent-color);
    }
    
    input[type="checkbox"]:checked::before {
        left: 1.375rem;
    }
    
    .toggle-label {
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    select {
        flex: 1;
        padding: 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid var(--border-color);
        background-color: var(--bg-primary);
        color: var(--text-primary);
    }
    
    select:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    input[type="range"] {
        flex: 1;
    }
    
    input[type="range"]:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .speed-value {
        flex: 0 0 60px;
        font-size: 0.9rem;
        color: var(--text-secondary);
        text-align: right;
    }
    
    .animation-description {
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    
    .description {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.5;
    }
</style> 