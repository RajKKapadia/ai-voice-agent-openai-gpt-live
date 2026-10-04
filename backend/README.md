# Run the backend

Requires Bun and an OpenAI API key with access to the models configured in `index.ts`.

From the repository root, install dependencies:

```bash
cd backend
bun install
```

Create or update `backend/.env` with your API key:

```env
OPENAI_API_KEY=your_openai_api_key
```

Start the server:

```bash
bun run index.ts
```

The backend runs at `http://localhost:3000`. Check `http://localhost:3000/health` to confirm it is running, then keep it open while you start the [frontend](../frontend/README.md).
