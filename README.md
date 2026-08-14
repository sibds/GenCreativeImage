# Творчество Прикамье

Веб-приложение для генерации семейных гербов и геометрических орнаментов Прикамья. Картинки рисует модель через OpenRouter; ключ живёт только на сервере.

Репозиторий: [sibds/GenCreativeImage](https://github.com/sibds/GenCreativeImage)

© ООО «СибСР»

## Что умеет

Два режима с общего лаунчера:

| | Герб семьи | Орнамент Прикамья |
|---|---|---|
| Холст | 3:4 | 1:1 |
| Параметры | тотем (10), народность (7), стихия (4), форма щита (5), девиз | символы (5, минимум 1), композиция (4) |
| Стиль | плоский этнографический folk, не европейская геральдика | плоский 2D-вектор, палитра охра / белый / тёмно-зелёный / бордовый |

После генерации: скачать PNG, печать из браузера, заявка в Telegram-бот / email (см. [Печать](#печать)).

## Стек

- React 19 + Vite 8, Tailwind 4
- OpenRouter (`/images`, fallback на `/chat/completions`)
- Vercel Serverless (`api/generate.js`, `maxDuration: 300`) + `@vercel/blob` для job-store в проде
- Vitest, Oxlint

## Как устроена генерация

Клиент **не** ходит в OpenRouter. Vite в деве кидает, если в бандл просочился `VITE_OPENROUTER_API_KEY`.

```
UI  →  POST /api/generate { prompt, mode: "crest"|"ornament" }
    ←  202 { jobId, status: "pending" }

UI  →  GET /api/generate?job=<uuid>   (poll ~2s, таймаут 4 мин)
    ←  pending | { success, imageUrl, prompt, source } | { error }
```

Сервер (`server/generate.js`):

1. Валидация: `prompt` ≤ 4000, `mode` ∈ `{crest, ornament}`.
2. Rate limit: 8 запросов / 10 мин на IP (loopback не режется).
3. Опционально прогоняет промпт через `OPENROUTER_TEXT_MODEL` (enhance, 12s timeout; при фейле остаётся сырой).
4. Основной вызов: `POST {endpoint}/images` — JPEG 1K, aspect по mode. Таймаут 270s.
5. Fallback на chat completions с `modalities: ["image","text"]`, если images отдал 400/404/405.

Job-store: in-memory локально, Vercel Blob на `VERCEL=1`. TTL записей 10 мин.

Локально тот же `/api/generate` поднимает Vite-плагин `server/vitePlugin.js` (и на `vite preview`).

## Быстрый старт

Нужен Node 20+.

```bash
npm install
copy .env.example .env   # Windows
npm run dev              # http://localhost:5173
```

В `.env` обязателен рабочий `OPENROUTER_API_KEY`. Без него API отвечает 503.

## Переменные окружения

Серверные. Префикс `VITE_` для ключа **запрещён** — Vite упадёт при старте.

| Переменная | Default | Зачем |
|---|---|---|
| `OPENROUTER_API_KEY` | — | ключ OpenRouter |
| `OPENROUTER_IMAGE_MODEL` | `google/gemini-3-pro-image` | модель картинки |
| `OPENROUTER_TEXT_MODEL` | пусто = skip enhance | LLM для доработки промпта |
| `OPENROUTER_ENDPOINT` | `https://openrouter.ai/api/v1` | база API |
| `BLOB_STORE_ID` | — | store id Vercel Blob (прод) |
| `BLOB_READ_WRITE_TOKEN` | — | токен Blob, если не из Vercel env |

На Vercel те же имена в Environment Variables. Функции: `api/generate.js` → `maxDuration` 300.

## Скрипты

```bash
npm run dev       # Vite + локальный /api/generate
npm run build
npm run preview   # прод-сборка + тот же API-плагин
npm test          # vitest run
npm run lint      # oxlint
```

## Промпты

Собираются на клиенте, enhance (если задан text-model) — на сервере.

**Герб** — `src/data/crestData.js` → `buildOpenRoadCrestPrompt`

- Животные: медведь, волк, орёл, лис, рысь, лось, сокол, сова, олень, бобр
- Народности: русские, татары, удмурты, башкиры, марийцы, коми, чуваши
- Стихии: огонь, вода, земля, воздух
- Щиты: варяжский, прямоугольный, славянский, каплевидный, круглый тарч

**Орнамент** — `src/data/ornamentData.js` → `buildOpenRoadOrnamentPrompt`

Порядок блоков (композиция **раньше** символов и стиля):

1. `COMPOSITION TYPE`
2. Пространственная геометрия холста
3. Выбранные символы + иерархия
4. Стиль Прикамья + палитра
5. Visual style + Avoid + негатив конкретной композиции

| Композиция | Холст | Пустое |
|---|---|---|
| Плитка (`tile`) | 95–100%, бесшовный раппорт | нет |
| Лента (`border`) | полоса 20–30% высоты | много сверху/снизу |
| Медальон (`medallion`) | 60–70% | ≥15% вокруг |
| Рамка (`frame`) | 15–25% по краям | 65–75% центра пусто |

Символы: ромб, волна/река, солнечный крест, елочка/папас, двойной ромб (шудо).

Спека по композициям: [`docs/Требования к промптам для композиций орнамента.md`](docs/Требования%20к%20промптам%20для%20композиций%20орнамента.md)

## API

`POST /api/generate`

```json
{ "prompt": "...", "mode": "crest" }
```

`202`:

```json
{ "jobId": "uuid", "status": "pending" }
```

`GET /api/generate?job=<uuid>`

- `200 { "status": "pending" }`
- `200 { "success": true, "imageUrl": "...", "prompt": "...", "source": "OpenRouter — …", "message": "…" }`
- `200 { "success": false, "error": "…" }`
- `400` кривой job id, `404` нет задачи

Ошибки старта: `400` (нет/длинный prompt, плохой mode), `429`, `503` (нет ключа), `504` (таймаут модели).

## Печать

`PrintModal`: Telegram, email, download/print.

- Download и `window.print()` — рабочие.
- Telegram: прямой `sendPhoto`, если в localStorage лежит `botToken`; иначе симуляция + deep-link на `KamaPrintGenBot` (имя бота правится в Настройках).
- Email — симуляция очереди, реального SMTP нет.

Имя бота: `localStorage.telegram_bot_config`.

## Структура

```
api/generate.js              Vercel handler (waitUntil + poll)
server/generate.js           OpenRouter, rate limit, enhance
server/jobs.js               UUID-джобы
server/jobStore.js           memory | Vercel Blob
server/vitePlugin.js         /api/generate в dev/preview
src/data/crestData.js
src/data/ornamentData.js
src/services/openRoadService.js   POST + poll
src/services/telegramService.js
src/components/{crest,ornament,print,settings}/
docs/                        требования к промптам орнамента
```

## Тесты

```
server/generate.test.js
server/jobs.test.js
server/jobStore.test.js
src/data/ornamentData.test.js
src/services/openRoadService.test.js
```

OpenRouter в тестах мокается; ключ не нужен.
