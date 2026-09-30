# Run the backend

Requires Bun and an OpenAI API key.

From the repository root, install dependencies:

```bash
cd backend
bun install
```

Create a `.env` file in `backend` with your API key:

```env
OPENAI_API_KEY=your_openai_api_key
```

Start the server:

```bash
bun run index.ts
```

The backend runs at `http://localhost:3000`. Keep it running while you start the [frontend](../frontend/README.md).
