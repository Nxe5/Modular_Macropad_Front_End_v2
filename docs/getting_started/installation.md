# Installation Guide

This guide provides step-by-step instructions for installing and setting up the Modular Macropad front-end application.

## Prerequisites

Before installing the Modular Macropad front-end, ensure you have the following:

- Node.js (v16 or later)
- npm (v7 or later)
- Git
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- The Modular Macropad firmware installed on your device

## Installation Steps

### 1. Clone the Repository

Clone the Modular Macropad front-end repository:

```bash
git clone https://github.com/yourusername/Modular_Macropad_Front_End_v2.git
cd Modular_Macropad_Front_End_v2
```

### 2. Install Dependencies

Install the required dependencies:

```bash
npm install
```

This will install all the necessary packages defined in `package.json`.

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```
VITE_API_BASE_URL=http://your-macropad-ip-address
VITE_WS_URL=ws://your-macropad-ip-address/ws
```

Replace `your-macropad-ip-address` with the IP address of your Modular Macropad device.

### 4. Build the Application

Build the application for production:

```bash
npm run build
```

This will create a production-ready build in the `build` directory.

### 5. Serve the Application

You can serve the application using a static file server:

```bash
npm run preview
```

This will start a local server and provide a URL to access the application.

## Development Setup

For development, you can use the following commands:

### Start Development Server

```bash
npm run dev
```

This will start a development server with hot module replacement.

### Run Tests

```bash
npm run test
```

This will run the test suite.

### Lint Code

```bash
npm run lint
```

This will lint the code using ESLint.

### Format Code

```bash
npm run format
```

This will format the code using Prettier.

## Deployment

### Deploy to Static Hosting

To deploy the application to a static hosting service (like Netlify, Vercel, or GitHub Pages):

1. Build the application: `npm run build`
2. Upload the contents of the `build` directory to your hosting service

### Deploy to the Device

To deploy the application directly to the Modular Macropad device:

1. Build the application: `npm run build`
2. Use the `build_and_upload_firmware.sh` script to upload the build to the device:

```bash
./build_and_upload_firmware.sh
```

## Troubleshooting

### Common Issues

#### Cannot Connect to the Device

- Ensure the device is powered on and connected to the network
- Verify the IP address in the `.env` file is correct
- Check that the device's API server is running

#### Build Errors

- Ensure all dependencies are installed: `npm install`
- Check for syntax errors in your code
- Verify that you're using a compatible Node.js version

#### Runtime Errors

- Check the browser console for error messages
- Verify that the API endpoints are accessible
- Ensure the WebSocket connection is established

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](../reference/troubleshooting.md) documentation
2. Search for similar issues in the GitHub repository
3. Open a new issue in the GitHub repository with details about your problem

## Next Steps

After installing the Modular Macropad front-end, you may want to:

1. Read the [Quick Start Guide](quick_start.md) to get started with the application
2. Explore the [Architecture Overview](architecture.md) to understand how the application works
3. Check out the [Macro System](../core_concepts/macro_system.md) documentation to learn about creating macros
