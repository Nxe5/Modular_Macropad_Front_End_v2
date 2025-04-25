<script lang="ts">
  export let value: number = 0;
  export let max: number = 100;
  export let color: string = 'var(--primary)';
  export let height: string = '0.5rem';
  export let radius: string = '0.25rem';
  
  // Calculate percentage width
  $: percentage = Math.min(100, Math.max(0, (value / max) * 100));
</script>

<div class="progress-container" style="--height: {height}; --radius: {radius};">
  <div class="progress-bar" style="--width: {percentage}%; --color: {color};"></div>
</div>

<style>
  .progress-container {
    width: 100%;
    background-color: var(--bg-muted);
    border-radius: var(--radius);
    height: var(--height);
    overflow: hidden;
  }
  
  .progress-bar {
    width: var(--width);
    height: 100%;
    background-color: var(--color);
    transition: width 0.2s ease-in-out;
  }
</style> 