# backend

WS:
mobileApp
admoniApp

Rest API:
webApp

# Client connection

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
ws.send(JSON.stringify({ type: 'desktop' })); // type: admin | mobile
console.log('Connected as desktop client');
};

# File system

1. src/controllers/
   Purpose: Contains logic to handle WebSocket events for different clients.
   Files:
   desktopController.ts: Handles WebSocket messages specific to the desktop admin app.
   mobileController.ts: Handles WebSocket messages specific to the mobile app.
2. src/middlewares/
   Purpose: Middleware functions for reusable logic like authentication, rate limiting, etc.
   Files:
   authMiddleware.ts: Checks if a WebSocket client is authenticated.
3. src/models/
   Purpose: Defines data models or classes to manage connections.
   Files:
   Client.ts: A class or interface representing a connected WebSocket client.
4. src/services/
   Purpose: Contains services that handle WebSocket communication, broadcasting, etc.
   Files:
   websocketService.ts: Manages WebSocket connections, broadcasts messages, and handles client groups.
5. src/utils/
   Purpose: Utility functions and helpers.
   Files:
   logger.ts: A simple logger utility for debugging.
6. src/types/
   Purpose: TypeScript type definitions and interfaces.
   Files:
   websocketTypes.ts: Defines types for WebSocket messages, client types, etc.
7. src/config/
   Purpose: Configuration files, such as environment variables and constants.
   Files:
   config.ts: Centralized configuration (e.g., port numbers, API keys).
8. src/index.ts
   Purpose: The entry point that initializes the WebSocket server.
9. src/server.ts
   Purpose: Sets up and starts the WebSocket server.
