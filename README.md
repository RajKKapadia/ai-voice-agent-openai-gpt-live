# GPT-Live Voice Assistant

A browser-based AI voice assistant for customer support, built with OpenAI's Live API, Bun, React, and TypeScript. Speak through your microphone and hear the assistant's replies over WebRTC.

The backend creates voice sessions and handles tool calls for order details, shipment tracking, product searches, return status, and return requests. These tools use sample data stored in memory.

## Project structure

- `backend/` — Bun server for session creation and support tools.
- `frontend/` — React/Vite app with controls to start and end a conversation.

## Run locally

Requires Bun, an OpenAI API key with access to the models configured in `backend/index.ts`, and a browser with microphone access.

1. Follow the [backend running instructions](backend/README.md) to configure your API key and start the server.
2. In another terminal, follow the [frontend running instructions](frontend/README.md).
3. Open the URL printed by Vite, click **Start Conversation**, and allow microphone access. Click **End Conversation** when finished.

Keep both servers running during the conversation.
