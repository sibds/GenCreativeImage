<p align="center">
  <img src="src/assets/logo.png" width="96" alt="Творчество Прикамье" />
</p>

# Творчество Прикамье

<p align="center">
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" /></a>
  <a href="https://vite.dev"><img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind 4" /></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Vercel-ready-000000?logo=vercel&logoColor=white" alt="Vercel" /></a>
  <a href="https://vitest.dev"><img src="https://img.shields.io/badge/Vitest-passing-6E9F18?logo=vitest&logoColor=white" alt="Vitest" /></a>
  <a href="https://openrouter.ai"><img src="https://img.shields.io/badge/OpenRouter-Gemini-191919" alt="OpenRouter" /></a>
  <a href="https://github.com/sibds/GenCreativeImage"><img src="https://img.shields.io/github/last-commit/sibds/GenCreativeImage" alt="last commit" /></a>
</p>

Веб-приложение для генерации семейных гербов и геометрических орнаментов Прикамья. Картинки рисует модель через OpenRouter; ключ живёт только на сервере.

Репозиторий: [sibds/GenCreativeImage](https://github.com/sibds/GenCreativeImage) · демо: [gencreativeimage.vercel.app](https://gencreativeimage.vercel.app)

© ООО «СибСР»

## Скриншоты

<p align="center">
  <img src="docs/screenshots/launcher.png" alt="Лаунчер: выбор герба или орнамента" width="900" />
</p>

| Герб семьи | Орнамент Прикамья |
|---|---|
| <img src="docs/screenshots/crest.png" alt="Генератор семейного герба" /> | <img src="docs/screenshots/ornament.png" alt="Генератор орнамента Прикамья" /> |

## Основные функции

### Лаунчер

Стартовый экран: две карточки — «Герб семьи» и «Орнамент Прикамья». Navbar (Главное меню / Герб / Орнамент) и футер ведут туда же. В киоске футер-ссылок нет, с лаунчера обратно из приложения не выйти.

### Генератор герба

Холст **3:4**. Параметры:

- тотем — 10 животных (медведь, волк, орёл, лис, рысь, лось, сокол, сова, олень, бобр)
- народность — 7 (русские, татары, удмурты, башкиры, марийцы, коми, чуваши)
- стихия — огонь, вода, земля, воздух
- форма щита — варяжский, прямоугольный, славянский, каплевидный, круглый тарч
- девиз — свободный текст; пустой подменяется девизом стихии

Стиль: плоский этнографический folk, не европейская геральдика. После успеха — картинка, «Отправить на печать», «Сгенерировать заново», «Сброс».

### Генератор орнамента

Холст **1:1**. Символы (минимум один): ромб, волна/река, солнечный крест, елочка/папас, двойной ромб (шудо). Композиция: плитка, лента, медальон, рамка. Палитра фиксирована: охра / белый / тёмно-зелёный / бордовый. Те же кнопки результата, что у герба.

### Генерация картинки

Клиент **не** ходит в OpenRouter. UI шлёт промпт на `POST /api/generate`, потом поллит джоб. Генерация может занять 1–2 минуты. Успех — confetti. Ошибка — панель и «Попробовать снова». Вне киоска можно раскрыть и скопировать итоговый промпт.

### Печать

«Отправить на печать» на карточке результата и в Navbar.

- Если на сервере заданы Telegram и/или SMTP — сразу отправка в группу и/или на email, тост снизу, модалки нет. Оба канала — оба параллельно.
- Если каналов нет — модалка: скачать PNG или печать из браузера.

### Киоск

Полноэкран под Chrome `--kiosk`: без навбара, футера и промпта. Контент вписывается в экран. С лаунчера не вернуться.

После картинки идёт отсчёт «Сброс через M:SS» (по умолчанию 10 мин). Жест перезапускает. В конце — сброс **текущего** экрана (форма и картинка), URL не меняется. Кнопки «Киоск» / «Обычный режим» по умолчанию скрыты; вход без них — `?kiosk=1`.

## Стек

React 19 + Vite 8 + Tailwind 4. OpenRouter (`/images`, fallback на `/chat/completions`). Vercel Serverless + `@vercel/blob`. Vitest, Oxlint.

## Быстрый старт

Нужен Node 20+.

```bash
npm install
copy .env.example .env   # Windows
npm run dev              # http://localhost:5173
```

В `.env` обязателен рабочий `OPENROUTER_API_KEY`. Без него API отвечает 503.

```bash
npm run build
npm run preview   # прод-сборка + тот же API-плагин
npm test
npm run lint
```

## Документация

Подробности — в [`docs/`](docs/README.md):

- [Архитектура](docs/architecture.md) — поток генерации, job-store, структура репо
- [API](docs/api.md) — `/api/generate`, `/api/dispatch`
- [Переменные окружения](docs/environment.md) — OpenRouter, Blob, киоск, Telegram, SMTP
- [Киоск](docs/kiosk.md)
- [Печать](docs/print.md)
- [Промпты](docs/prompts.md)
- [Разработка](docs/development.md) — тесты, скриншоты, Vercel
