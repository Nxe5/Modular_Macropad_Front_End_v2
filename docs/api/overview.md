# API Overview

This document provides an overview of the Modular Macropad API system, which enables communication between the front-end application and the firmware running on the device.

## API Architecture

The Modular Macropad API is built on a client-server architecture:

- **Client**: The front-end Svelte application that provides the user interface
- **Server**: The firmware running on the ESP32 microcontroller

Communication between the client and server is primarily handled through:

1. **HTTP API**: For configuration, macro management, and device information
2. **WebSocket API**: For real-time updates and bidirectional communication

## API Components

The API system consists of the following components:

### 1. API Client

The `ApiClient` class in `src/lib/api/client.ts` serves as the main interface for all API interactions. It provides methods for:

- Sending HTTP requests to the device
- Managing WebSocket connections
- Handling authentication and error responses
- Providing a unified interface for all API operations

### 2. API Endpoints

The `endpoints.ts` file defines all available API endpoints, including:

- Device information endpoints
- Configuration endpoints
- Macro management endpoints
- System endpoints

### 3. Specialized API Modules

The API is organized into specialized modules for different functionality:

- **Macros API**: Handles macro creation, retrieval, and management
- **Configuration API**: Manages device configuration
- **WebSocket API**: Handles real-time communication

## Authentication

The API uses a simple token-based authentication system:

1. The device generates a unique token on startup
2. The front-end must include this token in all API requests
3. The token is validated on the server side

## Error Handling

The API implements a consistent error handling approach:

1. HTTP errors are returned with appropriate status codes
2. Error responses include a message and error code
3. The client handles errors gracefully and provides user feedback

## WebSocket Communication

The WebSocket API enables real-time bidirectional communication:

1. The client establishes a WebSocket connection to the device
2. The device can send events to the client (e.g., button presses)
3. The client can send commands to the device (e.g., LED control)

## API Usage Examples

### Basic API Request

```typescript
import { apiClient } from '$lib/api/client';
import { ENDPOINTS } from '$lib/api/endpoints';

// Get device information
const deviceInfo = await apiClient.get(ENDPOINTS.DEVICE_INFO);
console.log('Device Info:', deviceInfo);
```

### WebSocket Connection

```typescript
import { socketApi } from '$lib/api/socket';

// Connect to WebSocket
socketApi.connect();

// Listen for events
socketApi.on('buttonPress', (data) => {
	console.log('Button pressed:', data);
});

// Send a command
socketApi.send('setLed', { buttonId: 'button1', color: 'red' });
```

## API Reference

For detailed information about specific API endpoints and methods, refer to:

- [Macros API](macros_api.md)
- [Configuration API](configuration_api.md)
- [WebSocket API](websocket_api.md)
- [Client API](client_api.md)
