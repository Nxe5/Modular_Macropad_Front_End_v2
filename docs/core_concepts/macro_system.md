# Macro System

This document provides an overview of the Macro System in the Modular Macropad application, explaining how macros are defined, stored, and executed.

## Overview

The Macro System is a core component of the Modular Macropad that allows users to create, manage, and execute sequences of commands. Macros can simulate keyboard inputs, mouse actions, and other system commands to automate repetitive tasks.

## Macro Structure

A macro consists of the following components:

1. **ID**: A unique identifier for the macro
2. **Name**: A display name for the macro
3. **Description**: A description of what the macro does
4. **Commands**: An array of command objects that define the actions to perform

```typescript
interface Macro {
	id: string;
	name: string;
	description: string;
	commands: MacroCommand[];
}
```

## Command Types

The Macro System supports various command types, each representing a different action:

1. **Key Press**: Simulates pressing a key on the keyboard
2. **Key Release**: Simulates releasing a key on the keyboard
3. **Consumer Press**: Simulates pressing a consumer control key (media keys, volume controls, etc.)
4. **Consumer Release**: Simulates releasing a consumer control key
5. **Delay**: Pauses execution for a specified amount of time
6. **Type Text**: Types a string of text
7. **Mouse Move**: Moves the mouse cursor by a relative amount
8. **Mouse Button Press**: Simulates pressing a mouse button
9. **Mouse Button Release**: Simulates releasing a mouse button
10. **Mouse Wheel**: Simulates scrolling the mouse wheel
11. **Execute Macro**: Executes another macro as a sub-macro

For detailed information about each command type, see the [Macro Options](../reference/macro_options.md) documentation.

## Macro Storage

Macros are stored in JSON files on the device's filesystem. Each macro is stored in a separate file in the `data/macros` directory. The filename is the macro ID with a `.json` extension.

Example macro file (`data/macros/open_iterm_spotlight.json`):

```json
{
	"id": "open_iterm_spotlight",
	"name": "Open iTerm via Spotlight",
	"description": "Opens Spotlight and launches iTerm",
	"commands": [
		{
			"type": "key_press",
			"report": ["0x08", "0x00", "0x2C", "0x00", "0x00", "0x00", "0x00", "0x00"]
		},
		{
			"type": "delay",
			"ms": 300
		},
		{
			"type": "type_text",
			"text": "iterm"
		},
		{
			"type": "delay",
			"ms": 200
		},
		{
			"type": "key_press",
			"report": ["0x00", "0x00", "0x28", "0x00", "0x00", "0x00", "0x00", "0x00"]
		}
	]
}
```

## Macro Execution

When a macro is triggered (by pressing a button or through the API), the following steps occur:

1. The macro is loaded from the filesystem
2. Each command in the macro is executed in sequence
3. If a command fails, the macro execution is stopped
4. The execution status is reported back to the user

## Macro Assignment

Macros can be assigned to buttons in the device configuration. When a button is pressed, the assigned macro is executed.

Example button configuration with a macro assignment:

```json
{
	"id": "button1",
	"type": "button",
	"action": {
		"type": "macro",
		"macroId": "open_iterm_spotlight"
	}
}
```

## Macro Editor

The Macro Editor is a user interface component that allows users to create and edit macros. It provides:

1. A form for entering macro metadata (name, description)
2. A command editor for adding, editing, and removing commands
3. A preview of the macro's actions
4. Validation to ensure the macro is valid

## API Integration

The Macro System is integrated with the API to allow remote management of macros. The API provides endpoints for:

1. Retrieving all macros
2. Retrieving a specific macro
3. Creating a new macro
4. Updating an existing macro
5. Deleting a macro
6. Assigning a macro to a button

For detailed information about the API, see the [Macros API](../api/macros_api.md) documentation.

## Best Practices

When creating macros, consider the following best practices:

1. **Use descriptive names and descriptions**: Make it clear what the macro does
2. **Keep macros simple**: Break complex actions into multiple macros
3. **Use delays appropriately**: Add delays between commands to ensure they execute correctly
4. **Test your macros**: Always test macros to ensure they work as expected
5. **Consider platform differences**: Some key combinations may work differently on different operating systems

## Related Documentation

- [Macro Options](../reference/macro_options.md): Detailed information about macro command types and options
- [Macros API](../api/macros_api.md): API for managing macros
- [Configuration System](configuration_system.md): How device configuration works
