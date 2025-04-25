<script lang="ts">
	import { wifiStatus, signalStrength, wifiConfig } from '$lib/stores/wifi';
</script>

<div class="wifi-status-card">
	<div class="status-header">
		<h3>Connection Status</h3>
		<div class="status-indicator {$wifiStatus.connected ? 'connected' : 'disconnected'}">
			{$wifiStatus.connected ? 'Connected' : 'Disconnected'}
		</div>
	</div>
	
	{#if $wifiStatus.connected}
		<div class="status-details">
			<div class="status-item">
				<span class="label">Network:</span>
				<span class="value">{$wifiStatus.ssid}</span>
			</div>
			
			<div class="status-item">
				<span class="label">IP Address:</span>
				<span class="value">{$wifiStatus.ip}</span>
			</div>
			
			<div class="status-item">
				<span class="label">Mode:</span>
				<span class="value">{$wifiStatus.ap_mode ? 'Access Point' : 'Client'}</span>
			</div>
			
			<div class="status-item">
				<span class="label">Signal:</span>
				<div class="signal-strength">
					{#each Array(4) as _, i}
						<div class="signal-bar {i < $signalStrength ? 'active' : ''}"></div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="empty-state">
			<p>Not connected to any network</p>
		</div>
	{/if}
	
	{#if !$wifiStatus.ap_mode && $wifiConfig.ap_name}
		<div class="divider"></div>
		<div class="ap-status">
			<h4>Access Point</h4>
			<div class="status-details">
				<div class="status-item">
					<span class="label">AP Name:</span>
					<span class="value">{$wifiConfig.ap_name}</span>
				</div>
				{#if $wifiConfig.ap_ip}
					<div class="status-item">
						<span class="label">AP IP:</span>
						<span class="value">{$wifiConfig.ap_ip}</span>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.wifi-status-card {
		border-radius: 0.5rem;
		background: var(--card-bg);
		box-shadow: var(--shadow-sm);
		width: 100%;
		max-width: 500px;
		margin: 0 auto 1.5rem auto;
		overflow: hidden;
	}
	
	.status-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
	}
	
	.status-header h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
	}
	
	.status-indicator {
		font-size: 0.8rem;
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		border-radius: 1rem;
	}
	
	.status-indicator.connected {
		background: var(--success-bg);
		color: var(--success-text);
	}
	
	.status-indicator.disconnected {
		background: var(--error-bg);
		color: var(--error-text);
	}
	
	.status-details {
		padding: 1rem;
	}
	
	.status-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-color-light);
	}
	
	.status-item:last-child {
		border-bottom: none;
	}
	
	.label {
		font-weight: 500;
		color: var(--text-secondary);
	}
	
	.value {
		font-weight: 400;
	}
	
	.signal-strength {
		display: flex;
		gap: 2px;
	}
	
	.signal-bar {
		width: 4px;
		height: 12px;
		background-color: var(--text-tertiary);
		border-radius: 1px;
	}
	
	.signal-bar.active {
		background-color: var(--primary-color);
	}
	
	.empty-state {
		padding: 1.5rem 1rem;
		text-align: center;
		color: var(--text-secondary);
	}
	
	.empty-state p {
		margin: 0;
	}
	
	.divider {
		height: 1px;
		background-color: var(--border-color);
		margin: 0;
	}
	
	.ap-status {
		padding: 1rem;
	}
	
	.ap-status h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-secondary);
	}
</style> 