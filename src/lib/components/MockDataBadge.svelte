<script>
  import { connection } from '$lib/stores/connection';
  import { browser } from '$app/environment';
  
  // Force display if useMockData is set in localStorage, regardless of connection state
  const forceDisplay = browser && localStorage.getItem('useMockData') === 'true';
</script>

{#if $connection.usingMockData || forceDisplay}
  <div class="mock-data-badge" title="Using mock data - not connected to a real device">
    MOCK DATA
  </div>
{/if}

<style>
  .mock-data-badge {
    position: fixed;
    top: 10px;
    right: 10px;
    background-color: #ff6b00;
    color: white;
    font-size: 0.85rem;
    font-weight: bold;
    padding: 6px 10px;
    border-radius: 4px;
    z-index: 9999;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    animation: pulse 2s infinite;
    pointer-events: none;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    letter-spacing: 0.5px;
  }

  @keyframes pulse {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.8;
    }
  }

  :global(:root[data-theme='dark']) .mock-data-badge {
    background-color: #ff6b00;
    color: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  }
</style> 