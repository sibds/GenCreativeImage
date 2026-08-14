# Разработка

Нужен Node 20+.

```bash
npm install
copy .env.example .env   # Windows
npm run dev              # http://localhost:5173
```

В `.env` обязателен рабочий `OPENROUTER_API_KEY`. Без него `/api/generate` отвечает 503. Остальные переменные — [environment](environment.md).

## Скрипты

```bash
npm run dev       # Vite + локальный /api/generate и /api/dispatch
npm run build
npm run preview   # прод-сборка + тот же API-плагин
npm test          # vitest run
npm run lint      # oxlint
```

Переснять скрины README (нужны Chrome и `playwright-core`, дев-сервер на `:5173`):

```bash
npm i -D playwright-core
node scripts/capture-screenshots.mjs
```

Скрины кладутся в `docs/screenshots/`.

## Тесты

OpenRouter в тестах мокается; ключ не нужен.

```
server/generate.test.js
server/dispatch.test.js
server/jobs.test.js
server/jobStore.test.js
server/envSecrets.test.js
src/data/ornamentData.test.js
src/services/openRoadService.test.js
src/kiosk/config.test.js
src/kiosk/useKioskIdle.test.js
```

## Vercel

`vercel.json`: `fluid: true`, у `api/generate.js` `maxDuration: 300`. Те же env-имена, что локально. Job-store переключается на Blob при `VERCEL=1`.
