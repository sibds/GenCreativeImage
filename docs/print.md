# Печать

Кнопка «Отправить на печать» — на карточке результата и в Navbar (когда есть сгенерированная картинка).

Логика в [`src/App.jsx`](../src/App.jsx) → `handleOpenPrint`:

- Если `GET /api/dispatch` вернул хотя бы один канал (`telegram` или `email`) — модалки нет, сразу `POST /api/dispatch`. Тост снизу: отправка / успех / частичный фейл / ошибка. Успех гаснет через 5 с.
- Если каналов нет — модалка [`PrintModal.jsx`](../src/components/print/PrintModal.jsx): скачать PNG (`{type}_print_{timestamp}.png`) и `window.print()`.

Контракт API — [API](api.md). Env — [Переменные окружения](environment.md).

## Telegram

Нужны `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`. Бот шлёт `sendPhoto` в группу. Caption: заголовок, metadata, дата (`ru-RU`), ≤ 1024 символов. Таймаут 30 с.

Токен живёт только на сервере. Имя группы в Telegram — это `chat.id` (`-100…`), не отображаемое название.

Как снять `TELEGRAM_CHAT_ID`: добавить бота в группу (право слать фото) → любое сообщение в группе → `GET https://api.telegram.org/bot<TOKEN>/getUpdates` → `chat.id`. Для публичной группы можно `@username`.

## SMTP

Нужны `SMTP_HOST` + `DISPATCH_EMAIL_TO` + From (`DISPATCH_EMAIL_FROM` или `SMTP_USER` + `SMTP_PASS`). Вложение JPEG/PNG, тема `Печать: {title}`.

Таймауты nodemailer: connection/greeting 10 с, socket 25 с.

На Vercel для SMTP бери порт **465** (TLS). 587 STARTTLS в serverless часто отваливается. С домашней сети провайдеры часто режут исходящие 25/465 — тогда локально `SMTP_PORT=587` + `SMTP_SECURE=0`. `$` в `SMTP_PASS` литеральный (см. [environment](environment.md)).

## Параллель

Оба канала включены — оба идут через `Promise.allSettled`. Один упал, второй прошёл → HTTP 200, `success: true`, у упавшего `{ ok: false, error }`. Оба упали → 502.
