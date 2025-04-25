<script lang="ts">
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let color: string = 'currentColor';
</script>

<div class="spinner" class:small={size === 'small'} class:large={size === 'large'}>
  <svg viewBox="0 0 24 24" fill="none">
    <circle 
      class="spinner-track" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      stroke-opacity="0.25" 
      stroke-width="4"
    ></circle>
    <path 
      class="spinner-indicator" 
      fill="none"
      stroke={color} 
      stroke-width="4"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10" 
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
</div>

<style>
  .spinner {
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
    animation: spin 1s linear infinite;
  }
  
  .small {
    width: 1rem;
    height: 1rem;
  }
  
  .large {
    width: 2rem;
    height: 2rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style> 