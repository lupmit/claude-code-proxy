# Express TypeScript Gemini Test API

Project Node.js + Express + TypeScript, using `@lupmit/gemini-api` and loading env from `.env`.

## 1) Setup

```bash
npm install
cp .env.example .env
```

Fill in your real values in `.env`:

- `SECURE_1PSID`
- `SECURE_1PSIDTS`

## 2) Run

```bash
npm run dev
```

Build and run production:

```bash
npm run build
npm start
```

## 3) API Endpoints

### Health check

```bash
curl -X GET http://localhost:3000/api/health
```

### Test generate content

```bash
curl -X POST http://localhost:3000/api/test/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Xin chao, gioi thieu ngan gon ve Node.js",
    "model": "gemini-3-flash"
  }'
```

Example response:

```json
{
  "success": true,
  "data": {
    "prompt": "Xin chao, gioi thieu ngan gon ve Node.js",
    "model": "gemini-3-flash",
    "reply": "..."
  }
}
```

## Notes

- If model is omitted, default model from library flow is used.
- API validates `prompt` before requesting Gemini.
- `.env` is excluded from git via `.gitignore`.
