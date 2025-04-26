<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fetchWithTimeout } from '$lib/api/utils';
  import Button from '$lib/components/ui/button.svelte';
  import Spinner from '$lib/components/ui/spinner.svelte';
  import ProgressBar from '$lib/components/ui/progress-bar.svelte';
  import Alert from '$lib/components/ui/alert.svelte';

  // State variables
  let currentVersion = '';
  let availableVersion = '';
  let releaseNotes = '';
  let updateAvailable = false;
  let updateStatus = 'idle';
  let updateMessage = '';
  let updateProgress = 0;
  let error = '';
  let statusInterval: number;
  let isChecking = false;
  let isUpdating = false;

  // Lifecycle hooks
  onMount(() => {
    // Get initial status
    getUpdateStatus();
    
    // Set up status polling when checking or updating
    statusInterval = window.setInterval(() => {
      if (isChecking || isUpdating) {
        getUpdateStatus();
      }
    }, 2000);
  });

  onDestroy(() => {
    if (statusInterval) {
      clearInterval(statusInterval);
    }
  });

  // Function to check for firmware updates
  async function checkForUpdates() {
    isChecking = true;
    error = '';
    updateStatus = 'checking';
    
    try {
      const response = await fetchWithTimeout('/api/firmware/check', {
        method: 'GET',
        timeout: 60000  // Increase timeout from 45000 to 60000ms
      });
      
      if (!response.ok) {
        throw new Error(`Failed to check for updates: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        error = data.message || 'Unknown error checking for updates';
        isChecking = false;
      } else {
        // Poll status continuously
        getUpdateStatus();
      }
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Failed to check for updates';
      isChecking = false;
      updateStatus = 'failed';
    }
  }

  // Function to get update status
  async function getUpdateStatus() {
    try {
      const response = await fetchWithTimeout('/api/firmware/status', {
        method: 'GET',
        timeout: 10000  // Increase timeout from 5000 to 10000ms
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get update status: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update state based on response
      updateStatus = data.status;
      updateProgress = data.progress || 0;
      updateAvailable = data.updateAvailable || false;
      
      if (data.currentVersion) {
        currentVersion = data.currentVersion;
      }
      
      if (data.availableVersion) {
        availableVersion = data.availableVersion;
      }
      
      if (data.releaseNotes) {
        releaseNotes = data.releaseNotes;
      }
      
      if (data.error) {
        error = data.error;
      }
      
      // Update checking status
      if (isChecking && ['idle', 'failed', 'complete'].includes(data.status)) {
        isChecking = false;
      }
      
      // Update updating status
      if (isUpdating && data.state !== 2 && data.state !== 3) { // Not downloading or installing
        isUpdating = false;
      }
      
    } catch (e: unknown) {
      if (isChecking) {
        error = e instanceof Error ? e.message : 'Failed to get update status';
        isChecking = false;
      }
    }
  }

  // Function to install firmware update
  async function installUpdate() {
    isUpdating = true;
    error = '';
    
    try {
      const response = await fetchWithTimeout('/api/firmware/update', {
        method: 'GET',
        timeout: 30000  // Increase timeout from 10000 to 30000ms
      });
      
      if (!response.ok) {
        throw new Error(`Failed to start update: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        error = data.message || 'Unknown error starting update';
        isUpdating = false;
      } else {
        // Update started, poll status
        updateStatus = 'updating';
        updateMessage = data.message || 'Starting update process...';
      }
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Failed to start update';
      isUpdating = false;
    }
  }

  // Function to retry after a connection error
  function retryConnection() {
    error = '';
    getUpdateStatus();
  }

  // Helper to format status for display
  function formatStatus(status: string): string {
    switch (status) {
      case 'idle':
        return 'Ready';
      case 'checking':
        return 'Checking for updates...';
      case 'downloading':
        return 'Downloading firmware...';
      case 'installing':
        return 'Installing firmware...';
      case 'verifying':
        return 'Verifying firmware...';
      case 'complete':
        return 'Update complete';
      case 'failed':
        return 'Update failed';
      default:
        return status;
    }
  }
</script>

<div class="firmware-update-container">
  <h2>Firmware Update</h2>
  
  {#if error}
    <Alert type="error">
      <p>{error}</p>
      {#if error.includes('HTTP error') || error.includes('WiFi')}
        <div class="error-help">
          <p>Make sure your device is connected to WiFi and has internet access.</p>
          <button class="retry-button" on:click={retryConnection}>
            Retry Connection
          </button>
        </div>
      {/if}
    </Alert>
  {/if}
  
  <div class="firmware-info">
    <div class="info-row">
      <span class="label">Current Version:</span>
      <span class="value">{currentVersion || 'Unknown'}</span>
    </div>
    
    {#if updateAvailable}
      <div class="info-row">
        <span class="label">Available Version:</span>
        <span class="value highlight">{availableVersion}</span>
      </div>
    {/if}
    
    <div class="info-row">
      <span class="label">Status:</span>
      <span class="value">{formatStatus(updateStatus)}</span>
    </div>
  </div>
  
  {#if isChecking || isUpdating}
    <div class="progress-container">
      <ProgressBar value={updateProgress} max={100} />
      <p class="progress-text">{updateProgress}%</p>
    </div>
  {/if}
  
  {#if releaseNotes}
    <div class="release-notes">
      <h3>Release Notes</h3>
      <div class="notes-content">
        {#if releaseNotes}
          <pre class="release-notes-pre">{releaseNotes}</pre>
        {:else}
          <p>No release notes available.</p>
        {/if}
      </div>
    </div>
  {/if}
  
  <div class="actions">
    <Button 
      disabled={isChecking} 
      on:click={checkForUpdates}
      variant="primary"
    >
      {#if isChecking}
        <Spinner size="small" />
        <span class="ml-2">Checking...</span>
      {:else}
        Check for Updates
      {/if}
    </Button>
    
    {#if updateAvailable && !isUpdating}
      <Button 
        variant="primary"
        on:click={installUpdate}
      >
        Install Update
      </Button>
    {/if}
    
    {#if isUpdating}
      <Button 
        variant="outline"
        disabled={true}
      >
        <Spinner size="small" />
        <span class="ml-2">Updating...</span>
      </Button>
    {/if}
  </div>
</div>

<style>
  .firmware-update-container {
    padding: 1rem;
    background-color: var(--bg-secondary);
    border-radius: 8px;
    max-width: 100%;
  }
  
  h2 {
    margin-bottom: 1.5rem;
    color: var(--text-primary);
  }
  
  .firmware-info {
    margin-bottom: 1.5rem;
    background-color: var(--bg-primary);
    padding: 1rem;
    border-radius: 6px;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0;
  }
  
  .label {
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  .value {
    font-family: monospace;
    color: var(--text-primary);
  }
  
  .highlight {
    color: var(--accent-color);
    font-weight: bold;
  }
  
  .progress-container {
    margin: 1.5rem 0;
  }
  
  .progress-text {
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  
  .release-notes {
    margin: 1.5rem 0;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 1rem;
    background-color: var(--bg-primary);
  }
  
  .release-notes h3 {
    margin-bottom: 0.75rem;
    color: var(--text-primary);
  }
  
  .notes-content {
    max-height: 200px;
    overflow-y: auto;
    padding-right: 0.5rem;
  }
  
  .release-notes-pre {
    white-space: pre-wrap;
    word-break: break-word;
    font-family: monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--text-secondary);
    margin: 0;
  }
  
  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .error-help {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .retry-button {
    margin-top: 0.5rem;
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }
  
  .retry-button:hover {
    background-color: var(--accent-color);
    border-color: var(--accent-color);
    color: white;
  }
</style> 