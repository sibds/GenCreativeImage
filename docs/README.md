# Документация

Веб-приложение **Творчество Прикамье**: генерация семейных гербов и геометрических орнаментов через OpenRouter. Ключ API живёт только на сервере.

Продуктовый обзор и основные функции — в [корневом README](../README.md).

| Документ | О чём |
|---|---|
| [Архитектура](architecture.md) | стек, поток генерации, job-store, структура репозитория |
| [API](api.md) | `POST/GET /api/generate`, `GET/POST /api/dispatch` |
| [Переменные окружения](environment.md) | OpenRouter, Blob, киоск, Telegram, SMTP |
| [Киоск](kiosk.md) | полноэкранный режим, idle-сброс, `?kiosk=1` |
| [Печать](print.md) | Telegram / SMTP / fallback в браузере |
| [Промпты](prompts.md) | как собираются тексты для герба и орнамента |
| [Требования к композициям орнамента](Требования%20к%20промптам%20для%20композиций%20орнамента.md) | спека геометрии холста по типам композиции |
| [Разработка](development.md) | скрипты, тесты, скриншоты, Vercel |

Демо: [gencreativeimage.vercel.app](https://gencreativeimage.vercel.app) · репозиторий: [sibds/GenCreativeImage](https://github.com/sibds/GenCreativeImage)
