# Macro Options Documentation

This document provides a comprehensive overview of all macro options available in the Modular Macropad system. Each macro consists of a sequence of commands that are executed in order when the macro is triggered.

## Basic Macro Structure

A macro is defined as a JSON object with the following structure:

```json
{
	"id": "unique_macro_id",
	"name": "Display Name",
	"description": "Description of what this macro does",
	"commands": [
		// Array of command objects
	]
}
```

## Command Types

### 1. Key Press

Simulates pressing a key on the keyboard.

```json
{
	"type": "key_press",
	"report": ["0x00", "0x00", "0x28", "0x00", "0x00", "0x00", "0x00", "0x00"]
}
```

- **type**: Always `"key_press"`
- **report**: An array of 8 hexadecimal values representing the HID report for the key press
  - The first byte (index 0) represents modifier keys (Ctrl, Alt, Shift, etc.)
  - The third byte (index 2) represents the key code
  - Other bytes are typically set to 0

### 2. Key Release

Simulates releasing a key on the keyboard.

```json
{
	"type": "key_release",
	"report": ["0x00", "0x00", "0x28", "0x00", "0x00", "0x00", "0x00", "0x00"]
}
```

- **type**: Always `"key_release"`
- **report**: An array of 8 hexadecimal values representing the HID report for the key release
  - Should match the report used in the corresponding key_press command
  - The firmware uses this report to identify which specific key to release
  - The actual HID report sent to the computer will be all zeros (0x00) for the key being released

#### Multiple Key Presses and Releases

When multiple keys are pressed simultaneously, the firmware maintains an internal state of which keys are currently pressed. When a key release command is executed:

1. The firmware identifies which specific key needs to be released based on the report parameter
2. It updates its internal state to mark that key as released
3. It sends a new HID report to the computer that includes all currently pressed keys (excluding the one that was just released)

For example, if you have 4 keys pressed and release one of them:

- The firmware removes that specific key from its internal "pressed keys" list
- It sends a new HID report that includes the remaining 3 pressed keys

The report parameter in the key release command is for the firmware's internal tracking, not for the actual HID report sent to the computer.

### 3. Consumer Press

Simulates pressing a consumer control key (media keys, volume controls, etc.).

```json
{
	"type": "consumer_press",
	"report": ["0x00", "0x00", "0x00", "0x00"]
}
```

- **type**: Always `"consumer_press"`
- **report**: An array of 4 hexadecimal values representing the consumer control report
  - The first two bytes typically represent the usage page and usage ID

### 4. Consumer Release

Simulates releasing a consumer control key.

```json
{
	"type": "consumer_release",
	"report": ["0x00", "0x00", "0x00", "0x00"]
}
```

- **type**: Always `"consumer_release"`
- **report**: An array of 4 hexadecimal values representing the consumer control report
  - Should match the report used in the corresponding consumer_press command
  - Similar to key_release, the firmware uses this to identify which consumer key to release
  - The actual HID report sent to the computer will be all zeros for the consumer key being released

### 5. Delay

Pauses execution for a specified amount of time.

```json
{
	"type": "delay",
	"ms": 300
}
```

- **type**: Always `"delay"`
- **ms**: The number of milliseconds to pause (integer)

### 6. Type Text

Types a string of text.

```json
{
	"type": "type_text",
	"text": "Hello, World!"
}
```

- **type**: Always `"type_text"`
- **text**: The text string to type

### 7. Mouse Move

Moves the mouse cursor by a relative amount.

```json
{
	"type": "mouse_move",
	"x": 10,
	"y": -5
}
```

- **type**: Always `"mouse_move"`
- **x**: Horizontal movement in pixels (positive = right, negative = left)
- **y**: Vertical movement in pixels (positive = down, negative = up)

### 8. Mouse Button Press

Simulates pressing a mouse button.

```json
{
	"type": "mouse_button_press",
	"button": 1
}
```

- **type**: Always `"mouse_button_press"`
- **button**: The button to press (1 = left, 2 = right, 3 = middle)

### 9. Mouse Button Release

Simulates releasing a mouse button.

```json
{
	"type": "mouse_button_release",
	"button": 1
}
```

- **type**: Always `"mouse_button_release"`
- **button**: The button to release (1 = left, 2 = right, 3 = middle)

### 10. Mouse Wheel

Simulates scrolling the mouse wheel.

```json
{
	"type": "mouse_wheel",
	"amount": 1
}
```

- **type**: Always `"mouse_wheel"`
- **amount**: The amount to scroll (positive = down, negative = up)

### 11. Execute Macro

Executes another macro as a sub-macro.

```json
{
	"type": "execute_macro",
	"macroId": "another_macro_id"
}
```

- **type**: Always `"execute_macro"`
- **macroId**: The ID of the macro to execute

## Common Modifier Keys

When creating key press commands, you can use the following modifier values in the first byte of the report:

| Modifier    | Hex Value | Description                 |
| ----------- | --------- | --------------------------- |
| None        | 0x00      | No modifier keys            |
| Ctrl        | 0x01      | Left Control                |
| Shift       | 0x02      | Left Shift                  |
| Alt         | 0x04      | Left Alt                    |
| GUI         | 0x08      | Left GUI (Windows/Command)  |
| Right Ctrl  | 0x10      | Right Control               |
| Right Shift | 0x20      | Right Shift                 |
| Right Alt   | 0x40      | Right Alt                   |
| Right GUI   | 0x80      | Right GUI (Windows/Command) |

## Common Key Codes

Here are some common key codes for reference:

| Key       | Hex Value | Description                  |
| --------- | --------- | ---------------------------- |
| A-Z       | 0x04-0x1D | Letters A through Z          |
| 1-9       | 0x1E-0x26 | Numbers 1 through 9          |
| 0         | 0x27      | Number 0                     |
| Enter     | 0x28      | Enter/Return                 |
| Escape    | 0x29      | Escape                       |
| Backspace | 0x2A      | Backspace                    |
| Tab       | 0x2B      | Tab                          |
| Space     | 0x2C      | Space                        |
| -         | 0x2D      | Minus/Hyphen                 |
| =         | 0x2E      | Equals                       |
| [         | 0x2F      | Left Square Bracket          |
| ]         | 0x30      | Right Square Bracket         |
| \         | 0x31      | Backslash                    |
| ;         | 0x33      | Semicolon                    |
| '         | 0x34      | Quote                        |
| `         | 0x35      | Grave Accent                 |
| ,         | 0x36      | Comma                        |
| .         | 0x37      | Period                       |
| /         | 0x38      | Forward Slash                |
| Caps Lock | 0x39      | Caps Lock                    |
| F1-F12    | 0x3A-0x45 | Function Keys F1 through F12 |

## Example Macros

### Open iTerm via Spotlight

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

This macro:

1. Presses Command+Space to open Spotlight
2. Waits 300ms
3. Types "iterm"
4. Waits 200ms
5. Presses Enter to launch iTerm

### Type Hello World

```json
{
	"id": "text_hello",
	"name": "Type Hello World",
	"description": "Types 'Hello, World!' with delays between characters",
	"commands": [
		{
			"type": "type_text",
			"text": "H"
		},
		{
			"type": "delay",
			"ms": 100
		},
		{
			"type": "type_text",
			"text": "e"
		},
		{
			"type": "delay",
			"ms": 100
		},
		{
			"type": "type_text",
			"text": "l"
		},
		{
			"type": "delay",
			"ms": 100
		},
		{
			"type": "type_text",
			"text": "l"
		},
		{
			"type": "delay",
			"ms": 100
		},
		{
			"type": "type_text",
			"text": "o"
		},
		{
			"type": "delay",
			"ms": 100
		},
		{
			"type": "type_text",
			"text": ", "
		},
		{
			"type": "delay",
			"ms": 100
		},
		{
			"type": "type_text",
			"text": "W"
		},
		{
			"type": "delay",
			"ms": 100
		},
		{
			"type": "type_text",
			"text": "o"
		},
		{
			"type": "delay",
			"ms": 100
		},
		{
			"type": "type_text",
			"text": "r"
		},
		{
			"type": "delay",
			"ms": 100
		},
		{
			"type": "type_text",
			"text": "l"
		},
		{
			"type": "delay",
			"ms": 100
		},
		{
			"type": "type_text",
			"text": "d"
		},
		{
			"type": "delay",
			"ms": 100
		},
		{
			"type": "type_text",
			"text": "!"
		}
	]
}
```

This macro types "Hello, World!" with a 100ms delay between each character, creating a typing effect.

## Tips for Creating Macros

1. **Use delays appropriately**: Add delays between commands to ensure they execute in the correct order and with enough time for the target application to respond.

2. **Test your macros**: Always test your macros to ensure they work as expected.

3. **Keep macros simple**: Break complex actions into multiple macros for better organization and reusability.

4. **Use the execute_macro command**: For complex sequences, create sub-macros and use the execute_macro command to call them.

5. **Check key codes**: Use the key code reference to ensure you're using the correct codes for your keys.

6. **Consider platform differences**: Some key combinations may work differently on different operating systems.
