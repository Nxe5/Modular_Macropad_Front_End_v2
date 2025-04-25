<script>
  import { connection } from '$lib/stores/connection';
</script>

{#if $connection.usingMockData}
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
    font-size: 0.8rem;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 4px;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    animation: pulse 2s infinite;
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

  @media (prefers-color-scheme: dark) {
    .mock-data-badge {
      background-color: #ff6b00;
      color: #1a1a1a;
    }
  }
</style> 