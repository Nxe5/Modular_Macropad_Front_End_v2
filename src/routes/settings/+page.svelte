<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Card from '$lib/components/ui/card.svelte';
	import { Settings, Download, Wifi, Trash, RotateCcw } from 'lucide-svelte';
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-6 flex items-center">
		<Settings class="text-accent-color mr-3 h-6 w-6" />
		<h1 class="text-3xl font-bold">Settings</h1>
	</div>

	<Card class="mb-6">
		<div class="prose dark:prose-invert max-w-none">
			<p>Configure device settings, firmware updates, and connection options.</p>
		</div>
	</Card>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Device Settings -->
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Device Settings</h2>
			<div class="space-y-4">
				<div>
					<label for="deviceName" class="mb-1 block">Device Name</label>
					<input
						type="text"
						id="deviceName"
						value="My Macropad"
						class="border-border-color bg-bg-primary text-text-primary w-full rounded border p-2"
					/>
				</div>

				<div>
					<label for="timeout" class="mb-1 block">Sleep Timeout (minutes)</label>
					<input
						type="number"
						id="timeout"
						value="5"
						min="1"
						max="60"
						class="border-border-color bg-bg-primary text-text-primary w-full rounded border p-2"
					/>
				</div>

				<div class="flex items-center">
					<input type="checkbox" id="powerSaving" class="mr-3" checked />
					<label for="powerSaving">Enable Power Saving Mode</label>
				</div>

				<div class="flex items-center">
					<input type="checkbox" id="bootSequence" class="mr-3" checked />
					<label for="bootSequence">Enable Boot Animation</label>
				</div>
			</div>
		</Card>

		<!-- Connection Settings -->
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Connection Settings</h2>
			<div class="mb-6 space-y-4">
				<div class="flex flex-col space-y-2">
					<div class="flex items-center">
						<Wifi class="mr-2 h-5 w-5 text-green-500" />
						<span class="font-medium">Connected</span>
					</div>
					<p class="text-text-secondary text-sm">Local IP: 192.168.1.100</p>
				</div>

				<div>
					<label for="wifiName" class="mb-1 block">Wi-Fi Network</label>
					<input
						type="text"
						id="wifiName"
						value="MyNetwork"
						class="border-border-color bg-bg-primary text-text-primary w-full rounded border p-2"
					/>
				</div>

				<div>
					<label for="wifiPassword" class="mb-1 block">Wi-Fi Password</label>
					<input
						type="password"
						id="wifiPassword"
						value="********"
						class="border-border-color bg-bg-primary text-text-primary w-full rounded border p-2"
					/>
				</div>
			</div>
			<Button variant="primary" class="w-full">Save Connection Settings</Button>
		</Card>

		<!-- Firmware Update -->
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Firmware Update</h2>
			<div class="mb-4 space-y-2">
				<p>Current Firmware: <span class="font-medium">v1.2.3</span></p>
				<p class="text-text-secondary text-sm">
					Check for the latest firmware updates to get new features and improvements.
				</p>
			</div>
			<div class="space-y-2">
				<Button variant="ghost" class="flex w-full items-center justify-center gap-2">
					<Download class="h-4 w-4" />
					<span>Check for Updates</span>
				</Button>
				<Button variant="ghost" class="flex w-full items-center justify-center gap-2">
					<RotateCcw class="h-4 w-4" />
					<span>Upload Custom Firmware</span>
				</Button>
			</div>
		</Card>

		<!-- Factory Reset -->
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Factory Reset</h2>
			<div class="mb-4">
				<p class="text-text-secondary text-sm">
					This will erase all custom configurations, macros, and settings, returning your macropad
					to its factory default state.
				</p>
			</div>
			<Button variant="danger" class="flex w-full items-center justify-center gap-2">
				<Trash class="h-4 w-4" />
				<span>Factory Reset</span>
			</Button>
		</Card>
	</div>
</div>
