# Macros API

This document provides detailed information about the Macros API, which is used to manage macros in the Modular Macropad system.

## Overview

The Macros API provides methods for creating, retrieving, updating, and deleting macros. It is implemented in the `MacrosApi` class in `src/lib/api/macros.ts`.

## API Methods

### `getMacros()`

Retrieves all macros from the device.

**Returns**: A promise that resolves to an array of `Macro` objects.

**Example**:

```typescript
import { macrosApi } from '$lib/api/macros';

// Get all macros
const macros = await macrosApi.getMacros();
console.log('Macros:', macros);
```

### `getMacro(macroId: string)`

Retrieves a specific macro by ID.

**Parameters**:

- `macroId`: The ID of the macro to retrieve.

**Returns**: A promise that resolves to a `Macro` object.

**Example**:

```typescript
import { macrosApi } from '$lib/api/macros';

// Get a specific macro
const macro = await macrosApi.getMacro('my_macro_id');
console.log('Macro:', macro);
```

### `createMacro(macro: Macro)`

Creates a new macro.

**Parameters**:

- `macro`: The macro object to create.

**Returns**: A promise that resolves to the created `Macro` object.

**Example**:

```typescript
import { macrosApi } from '$lib/api/macros';
import type { Macro } from '$lib/types/macro';

// Create a new macro
const newMacro: Macro = {
	id: 'new_macro_id',
	name: 'My New Macro',
	description: 'A description of my new macro',
	commands: [
		{
			type: 'key_press',
			report: ['0x00', '0x00', '0x28', '0x00', '0x00', '0x00', '0x00', '0x00']
		},
		{
			type: 'delay',
			ms: 100
		},
		{
			type: 'key_release',
			report: ['0x00', '0x00', '0x28', '0x00', '0x00', '0x00', '0x00', '0x00']
		}
	]
};

const createdMacro = await macrosApi.createMacro(newMacro);
console.log('Created Macro:', createdMacro);
```

### `updateMacro(macroId: string, macro: Macro)`

Updates an existing macro.

**Parameters**:

- `macroId`: The ID of the macro to update.
- `macro`: The updated macro object.

**Returns**: A promise that resolves to the updated `Macro` object.

**Example**:

```typescript
import { macrosApi } from '$lib/api/macros';
import type { Macro } from '$lib/types/macro';

// Update an existing macro
const updatedMacro: Macro = {
	id: 'existing_macro_id',
	name: 'Updated Macro Name',
	description: 'An updated description',
	commands: [
		// Updated commands
	]
};

const result = await macrosApi.updateMacro('existing_macro_id', updatedMacro);
console.log('Updated Macro:', result);
```

### `deleteMacro(macroId: string)`

Deletes a macro.

**Parameters**:

- `macroId`: The ID of the macro to delete.

**Returns**: A promise that resolves when the macro is deleted.

**Example**:

```typescript
import { macrosApi } from '$lib/api/macros';

// Delete a macro
await macrosApi.deleteMacro('macro_to_delete_id');
console.log('Macro deleted');
```

### `assignMacroToButton(buttonId: string, macroId: string)`

Assigns a macro to a button.

**Parameters**:

- `buttonId`: The ID of the button.
- `macroId`: The ID of the macro to assign.

**Returns**: A promise that resolves when the macro is assigned.

**Example**:

```typescript
import { macrosApi } from '$lib/api/macros';

// Assign a macro to a button
await macrosApi.assignMacroToButton('button1', 'my_macro_id');
console.log('Macro assigned to button');
```

## Macro Type Definition

The `Macro` type is defined in `src/lib/types/macro.ts`:

```typescript
export interface Macro {
	id: string;
	name: string;
	description: string;
	commands: MacroCommand[];
}

export interface MacroCommand {
	type: string;
	[key: string]: any;
}
```

## Error Handling

The Macros API methods handle errors by:

1. Throwing exceptions for network errors or server errors
2. Returning appropriate error messages for validation errors
3. Logging errors to the console for debugging

## Related Documentation

- [Macro Options](../reference/macro_options.md): Detailed information about macro command types and options
- [API Overview](overview.md): General information about the API system
