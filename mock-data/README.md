# Mock Data

This directory contains JSON mock data files used for development and testing of the Modular Macropad Configuration Tool.

## Directory Structure

- `/config/`: Device configuration mock data
  - `info.json`: Basic device information and settings
  - `components.json`: Hardware components configuration
  - `actions.json`: Key mappings and action definitions
  - `leds.json`: LED configuration and effects
  - `reports.json`: Device reporting settings
  - `example.json`: Example configuration template
- `/macros/`: Sample macro configurations
  - `iterm_hello_world.json`: Example macro for iTerm

## Usage

These mock data files are used during development to simulate the data that would normally be retrieved from or sent to the actual macropad device. They allow for testing the UI without needing to connect to a physical device.

### In API Requests

The mock data is used in the API layer when in development mode:

```typescript
// Example API function using mock data
async function getConfig(section: string) {
	if (MOCK_MODE) {
		// Load mock data instead of making a real request
		const mockData = await import(`/mock-data/config/${section}.json`);
		return mockData;
	}

	// Real API request code
	return fetch(`${API_URL}/config/${section}`).then((res) => res.json());
}
```

## File Format

### Configuration Files

Each configuration file follows a specific schema depending on its purpose. Below are general descriptions of each file type:

#### Info (`info.json`)

Contains basic device information such as:

- Device name
- Firmware version
- Hardware version
- Serial number
- Connection information

#### Components (`components.json`)

Defines the physical components of the macropad:

- Buttons
- Encoders
- Display
- LEDs

#### Actions (`actions.json`)

Maps physical inputs to actions:

- Key press actions
- Encoder rotation actions
- Encoder press actions
- Layer switches

#### LEDs (`leds.json`)

Configures the RGB lighting:

- Color schemes
- Animation effects
- Brightness
- Per-key colors

#### Reports (`reports.json`)

Configures device reporting and notifications:

- USB HID reports
- Serial output
- Debug information

## Modifying Mock Data

When modifying mock data files:

1. Ensure the data follows the correct schema
2. Keep the data realistic to match what would come from a real device
3. Test the application with the modified data to ensure it renders correctly
4. Consider adding edge cases to test error handling
