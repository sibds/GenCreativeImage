# API

Оба маршрута есть на Vercel (`api/*.js`) и локально через Vite-плагин. Клиентские обёртки: [`src/services/openRoadService.js`](../src/services/openRoadService.js), [`src/services/dispatchService.js`](../src/services/dispatchService.js).

## `POST /api/generate`

Старт джоба. Тело:

```json
{ "prompt": "...", "mode": "crest" }
```

`mode`: `"crest"` | `"ornament"`. По умолчанию `"crest"`. Поля `apiKey` / `endpoint` / `imageModel` в теле игнорируются.

`202`:

```json
{ "jobId": "uuid", "status": "pending" }
```

Ошибки старта (пишутся в джоб; клиент увидит их на poll, локально — после завершения `handleGenerate`):

| Код | Когда |
|---|---|
| `400` | нет prompt, prompt > 4000, недопустимый `mode` |
| `429` | больше 8 запросов / 10 мин с одного IP |
| `503` | нет `OPENROUTER_API_KEY` |
| `504` | таймаут модели (270 с) |
| `502` | OpenRouter ответил без картинки / оба пути упали |

Локально кривой JSON → `400` «Некорректный JSON.» Не-POST/GET → `405`.

## `GET /api/generate?job=<uuid>`

| Ответ | Тело |
|---|---|
| `200` | `{ "status": "pending" }` |
| `200` | `{ "success": true, "imageUrl": "...", "prompt": "...", "source": "OpenRouter — …", "message": "…" }` |
| `200` | `{ "success": false, "error": "…" }` |
| `400` | кривой job id |
| `404` | задачи нет (или TTL истёк) |

Клиент поллит ~каждые 2 с, сдаётся через 4 мин.

## `GET /api/dispatch`

Флаги каналов, без секретов:

```json
{ "telegram": true, "email": false }
```

`telegram` — заданы `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.  
`email` — заданы `SMTP_HOST`, `DISPATCH_EMAIL_TO` и From (`DISPATCH_EMAIL_FROM` или пара `SMTP_USER` + `SMTP_PASS`).

## `POST /api/dispatch`

```json
{
  "imageUrl": "data:image/jpeg;base64,...",
  "title": "Семейный герб",
  "metadata": "Тотем: Медведь, …"
}
```

Лимиты: `imageUrl` обязателен (data URL или `http(s)`), картинка ≤ 4 МБ, `title` ≤ 200 (дефолт «Макет»), `metadata` ≤ 1000. Caption в Telegram ≤ 1024.

Rate limit: 10 запросов / 10 мин на IP (loopback не режется).

| Код | Когда |
|---|---|
| `200` | хотя бы один включённый канал ок. Частичный фейл: `success: true` и `email.ok: false` (или наоборот) |
| `400` | нет/кривой `imageUrl`, картинка не скачалась / слишком большая |
| `429` | rate limit |
| `502` | все включённые каналы упали |
| `503` | `{ "error": "no_channels" }` — в env нет ни Telegram, ни SMTP |

Успех:

```json
{
  "success": true,
  "telegram": { "ok": true },
  "email": { "ok": true }
}
```

В ответе только те ключи каналов, которые реально включены в env. Каналы гоняются параллельно (`Promise.allSettled`). Подробности каналов — [Печать](print.md).
