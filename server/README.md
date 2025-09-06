NestMate LLM Proxy

Small Express server that proxies prompt requests from the dashboard to a secure server-side LLM provider.

Features:
- Optional Firebase ID token verification (requires service account JSON in env)
- Rate limiting
- Supports OpenAI via OPENAI_API_KEY or any provider via PROVIDER_URL

Quick start (local):

1. Copy the example env and fill it out:

   cp .env.example .env
   # edit .env and set OPENAI_API_KEY or PROVIDER_URL

2. Install and run:

   cd server
   npm install
   npm run dev

3. Configure the dashboard to call the local endpoint by setting `window.LLM_API_URL = 'http://localhost:3000/api/llm'` in the browser or hosting the server on the same origin.

Security notes:
- Keep API keys server-side. Do not expose the OPENAI_API_KEY in frontend code.
- If you need user-level control, set REQUIRE_FIREBASE_ID=true and provide `FIREBASE_ADMIN_SDK_JSON` to verify tokens.

API contract:
POST /api/llm
Request JSON: { prompt: string, userId?: string }
Response JSON: { reply: string }

