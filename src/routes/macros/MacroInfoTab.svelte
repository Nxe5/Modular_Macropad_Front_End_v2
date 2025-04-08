<script lang="ts">
	import { Info } from 'lucide-svelte';
	
	// Define the command types and their descriptions
	const commandTypes = [
		{
			type: 'key_press',
			description: 'Simulates pressing a key on the keyboard',
			example: {
				type: 'key_press',
				report: ['0x00', '0x00', '0x28', '0x00', '0x00', '0x00', '0x00', '0x00']
			},
			fields: [
				{
					name: 'report',
					type: 'string[]',
					description: 'An array of 8 hexadecimal values representing the HID report for the key press. The first byte (index 0) represents modifier keys (Ctrl, Alt, Shift, etc.). The third byte (index 2) represents the key code. Other bytes are typically set to 0.'
				}
			]
		},
		{
			type: 'key_release',
			description: 'Simulates releasing a key on the keyboard',
			example: {
				type: 'key_release',
				report: ['0x00', '0x00', '0x28', '0x00', '0x00', '0x00', '0x00', '0x00']
			},
			fields: [
				{
					name: 'report',
					type: 'string[]',
					description: 'An array of 8 hexadecimal values representing the HID report for the key release. The first byte (index 0) represents modifier keys (Ctrl, Alt, Shift, etc.). The third byte (index 2) represents the key code. Other bytes are typically set to 0.'
				}
			]
		},
		{
			type: 'consumer_press',
			description: 'Simulates pressing a consumer control key (media keys, volume controls, etc.)',
			example: {
				type: 'consumer_press',
				report: ['0x00', '0x00', '0x00', '0x00']
			},
			fields: [
				{
					name: 'report',
					type: 'string[]',
					description: 'An array of 4 hexadecimal values representing the HID consumer report for the key press.'
				}
			]
		},
		{
			type: 'consumer_release',
			description: 'Simulates releasing a consumer control key',
			example: {
				type: 'consumer_release',
				report: ['0x00', '0x00', '0x00', '0x00']
			},
			fields: [
				{
					name: 'report',
					type: 'string[]',
					description: 'An array of 4 hexadecimal values representing the HID consumer report for the key release.'
				}
			]
		},
		{
			type: 'delay',
			description: 'Pauses execution for a specified amount of time',
			example: {
				type: 'delay',
				ms: 300
			},
			fields: [
				{
					name: 'ms',
					type: 'number',
					description: 'The number of milliseconds to pause execution.'
				}
			]
		},
		{
			type: 'type_text',
			description: 'Types a string of text',
			example: {
				type: 'type_text',
				text: 'Hello, World!'
			},
			fields: [
				{
					name: 'text',
					type: 'string',
					description: 'The text to type.'
				}
			]
		},
		{
			type: 'mouse_move',
			description: 'Moves the mouse cursor by a relative amount',
			example: {
				type: 'mouse_move',
				x: 100,
				y: -50
			},
			fields: [
				{
					name: 'x',
					type: 'number',
					description: 'The relative X movement in pixels. Positive values move right, negative values move left.'
				},
				{
					name: 'y',
					type: 'number',
					description: 'The relative Y movement in pixels. Positive values move down, negative values move up.'
				}
			]
		},
		{
			type: 'mouse_button_press',
			description: 'Simulates pressing a mouse button',
			example: {
				type: 'mouse_button_press',
				button: 1
			},
			fields: [
				{
					name: 'button',
					type: 'number',
					description: 'The mouse button to press. 1 = left, 2 = right, 3 = middle, 4 = back, 5 = forward.'
				}
			]
		},
		{
			type: 'mouse_button_release',
			description: 'Simulates releasing a mouse button',
			example: {
				type: 'mouse_button_release',
				button: 1
			},
			fields: [
				{
					name: 'button',
					type: 'number',
					description: 'The mouse button to release. 1 = left, 2 = right, 3 = middle, 4 = back, 5 = forward.'
				}
			]
		},
		{
			type: 'mouse_wheel',
			description: 'Simulates scrolling the mouse wheel',
			example: {
				type: 'mouse_wheel',
				amount: 1
			},
			fields: [
				{
					name: 'amount',
					type: 'number',
					description: 'The amount to scroll. Positive values scroll up, negative values scroll down.'
				}
			]
		},
		{
			type: 'execute_macro',
			description: 'Executes another macro as a sub-macro',
			example: {
				type: 'execute_macro',
				macroId: 'another_macro_id'
			},
			fields: [
				{
					name: 'macroId',
					type: 'string',
					description: 'The ID of the macro to execute.'
				}
			]
		}
	];
	
	// Define the macro structure
	const macroStructure = {
		id: 'unique_macro_id',
		name: 'Display Name',
		description: 'Description of what this macro does',
		commands: [
			// Array of command objects
		]
	};
	
	// Define the complete example
	const completeExample = {
		id: 'open_iterm_spotlight',
		name: 'Open iTerm via Spotlight',
		description: 'Opens Spotlight and launches iTerm',
		commands: [
			{
				type: 'key_press',
				report: ['0x08', '0x00', '0x2C', '0x00', '0x00', '0x00', '0x00', '0x00']
			},
			{
				type: 'delay',
				ms: 300
			},
			{
				type: 'type_text',
				text: 'iterm'
			},
			{
				type: 'delay',
				ms: 200
			},
			{
				type: 'key_press',
				report: ['0x00', '0x00', '0x28', '0x00', '0x00', '0x00', '0x00', '0x00']
			}
		]
	};
</script>

<div class="info-tab">
	<div class="info-header">
		<Info size={24} />
		<h2>Macro Information</h2>
	</div>
	
	<div class="info-content">
		<section>
			<h3>Macro Structure</h3>
			<p>A macro is defined as a JSON object with the following structure:</p>
			<pre><code>{JSON.stringify(macroStructure, null, 2)}</code></pre>
			
			<h4>Fields:</h4>
			<ul>
				<li><strong>id</strong> (string): A unique identifier for the macro</li>
				<li><strong>name</strong> (string): A display name for the macro</li>
				<li><strong>description</strong> (string): A description of what the macro does</li>
				<li><strong>commands</strong> (array): An array of command objects that define the actions to perform</li>
			</ul>
		</section>
		
		<section>
			<h3>Complete Example</h3>
			<p>Here's a complete example of a macro that opens iTerm via Spotlight:</p>
			<pre><code>{JSON.stringify(completeExample, null, 2)}</code></pre>
		</section>
		
		<section>
			<h3>Command Types</h3>
			<p>The Macro System supports various command types, each representing a different action:</p>
			
			{#each commandTypes as command}
				<div class="command-type">
					<h4>{command.type}</h4>
					<p>{command.description}</p>
					
					<h5>Example:</h5>
					<pre><code>{JSON.stringify(command.example, null, 2)}</code></pre>
					
					<h5>Fields:</h5>
					<ul>
						{#each command.fields as field}
							<li>
								<strong>{field.name}</strong> ({field.type}): {field.description}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</section>
		
		<section>
			<h3>Best Practices</h3>
			<ul>
				<li><strong>Use descriptive names and descriptions</strong>: Make it clear what the macro does</li>
				<li><strong>Keep macros simple</strong>: Break complex actions into multiple macros</li>
				<li><strong>Use delays appropriately</strong>: Add delays between commands to ensure they execute correctly</li>
				<li><strong>Test your macros</strong>: Always test macros to ensure they work as expected</li>
				<li><strong>Consider platform differences</strong>: Some key combinations may work differently on different operating systems</li>
			</ul>
		</section>
	</div>
</div>

<style>
	.info-tab {
		background-color: var(--surface);
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	
	.info-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background-color: var(--primary);
		color: white;
	}
	
	.info-header h2 {
		margin: 0;
		font-size: 1.25rem;
	}
	
	.info-content {
		padding: 1rem;
		overflow-y: auto;
		flex-grow: 1;
	}
	
	section {
		margin-bottom: 2rem;
	}
	
	h3 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: var(--primary);
	}
	
	h4 {
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	
	h5 {
		margin-top: 0.75rem;
		margin-bottom: 0.25rem;
		font-size: 0.9rem;
	}
	
	pre {
		background-color: var(--surface-alt);
		padding: 0.75rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 0.5rem 0;
	}
	
	code {
		font-family: monospace;
		font-size: 0.9rem;
	}
	
	ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}
	
	li {
		margin-bottom: 0.5rem;
	}
	
	.command-type {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background-color: var(--surface-alt);
		border-radius: 4px;
	}
	
	.command-type h4 {
		margin-top: 0;
		color: var(--primary);
	}
</style> 