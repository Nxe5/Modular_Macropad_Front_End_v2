<script lang="ts">
  export let type: 'info' | 'success' | 'warning' | 'error' = 'info';
  export let title: string = '';
  
  // Compute styles based on alert type
  let bgColor: string;
  let textColor: string;
  let borderColor: string;
  
  $: {
    switch (type) {
      case 'success':
        bgColor = 'var(--success-bg, #ecfdf5)';
        textColor = 'var(--success-text, #065f46)';
        borderColor = 'var(--success-border, #10b981)';
        break;
      case 'warning':
        bgColor = 'var(--warning-bg, #fffbeb)';
        textColor = 'var(--warning-text, #92400e)';
        borderColor = 'var(--warning-border, #f59e0b)';
        break;
      case 'error':
        bgColor = 'var(--error-bg, #fef2f2)';
        textColor = 'var(--error-text, #b91c1c)';
        borderColor = 'var(--error-border, #ef4444)';
        break;
      case 'info':
      default:
        bgColor = 'var(--info-bg, #eff6ff)';
        textColor = 'var(--info-text, #1e40af)';
        borderColor = 'var(--info-border, #3b82f6)';
        break;
    }
  }
</script>

<div 
  class="alert" 
  class:has-title={title}
  style="--bg-color: {bgColor}; --text-color: {textColor}; --border-color: {borderColor};"
>
  {#if title}
    <div class="alert-title">{title}</div>
  {/if}
  <div class="alert-content">
    <slot></slot>
  </div>
</div>

<style>
  .alert {
    background-color: var(--bg-color);
    color: var(--text-color);
    border-left: 4px solid var(--border-color);
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
  }
  
  .alert-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .alert-content {
    font-size: 0.875rem;
  }
  
  .alert:not(.has-title) .alert-content {
    font-size: 1rem;
  }
</style> 