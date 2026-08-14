# Переменные окружения

Серверные OpenRouter / Blob / Telegram / SMTP — **без** `VITE_`. Префикс `VITE_` для ключа OpenRouter **запрещён**: Vite упадёт при старте.

Киоск — `VITE_KIOSK_*` (не секреты, попадают в клиентский бандл). После смены перезапусти Vite / пересобери.

Локально: `copy .env.example .env`. На Vercel — те же имена в Environment Variables.

| Переменная | Default | Зачем |
|---|---|---|
| `OPENROUTER_API_KEY` | — | ключ OpenRouter. Без него API отвечает 503 |
| `OPENROUTER_IMAGE_MODEL` | `google/gemini-3-pro-image` | модель картинки |
| `OPENROUTER_TEXT_MODEL` | пусто = skip enhance | LLM для доработки промпта |
| `OPENROUTER_ENDPOINT` | `https://openrouter.ai/api/v1` | база API |
| `BLOB_STORE_ID` | — | store id Vercel Blob (прод) |
| `BLOB_READ_WRITE_TOKEN` | — | токен Blob, если не из Vercel env |
| `VITE_KIOSK_CONTROLS` | `0` | кнопки «Киоск» / «Обычный режим»; по умолчанию скрыты |
| `VITE_KIOSK` | `0` | стартовать сразу в киоске |
| `VITE_KIOSK_IDLE_MS` | `600000` | видимый отсчёт «Сброс через …» после успешной генерации (10 мин) |
| `VITE_KIOSK_COUNTDOWN_MS` | `30000` | с этой отметки кнопка «Сброс» подсвечивается бордовым |
| `TELEGRAM_BOT_TOKEN` | — | токен бота для `sendPhoto` в группу |
| `TELEGRAM_CHAT_ID` | — | `-100…` супергруппы или `@PublicGroup` |
| `SMTP_HOST` | — | SMTP-сервер |
| `SMTP_PORT` | `465` | 465/TLS на Vercel надёжнее, чем 587 |
| `SMTP_SECURE` | по порту | `1`/`true` — TLS; `0`/`false` — нет; иначе `port === 465` |
| `SMTP_USER` / `SMTP_PASS` | — | логин SMTP |
| `DISPATCH_EMAIL_FROM` | = `SMTP_USER` | From |
| `DISPATCH_EMAIL_TO` | — | ящик печати |

`$` в `SMTP_PASS` (и других секретах из списка) Vite больше не разворачивает: [`server/envSecrets.js`](../server/envSecrets.js) перекрывает dotenv-expand. Значения читаются литерально.

Киоск подробно — [Киоск](kiosk.md). Печать — [Печать](print.md).
