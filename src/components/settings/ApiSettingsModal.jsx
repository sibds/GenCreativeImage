import React, { useState } from 'react';
import { getTelegramConfig, saveTelegramConfig } from '../../services/telegramService';
import { X, Save, CheckCircle, Send, Shield } from 'lucide-react';

export default function ApiSettingsModal({ onClose }) {
  const [telegramConfig, setTelegramConfig] = useState(getTelegramConfig());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveTelegramConfig(telegramConfig);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/70 flex items-center justify-center p-4">
      <div className="paper-card border border-forest/15 rounded-2xl max-w-xl w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-forest/15 bg-linen/60">
          <div>
            <h2 className="font-serif font-bold text-lg text-ink">Настройки</h2>
            <p className="text-xs text-forest">Ключ OpenRouter хранится только на сервере</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-forest hover:text-ink hover:bg-linen transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-linen border border-forest/20 space-y-2">
            <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" /> OpenRouter
            </div>
            <p className="text-xs text-ink leading-relaxed">
              API-ключ и модели задаются в <span className="text-charcoal font-mono font-bold">OPENROUTER_*</span> на сервере
              (локально — <span className="font-mono">.env</span>, на Vercel — Environment Variables).
              Браузер ключ не получает.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest uppercase tracking-wider mb-2 flex items-center gap-2">
              <Send className="w-4 h-4" /> Имя Telegram-бота печати:
            </label>
            <input
              type="text"
              value={telegramConfig.botUsername}
              onChange={(e) => setTelegramConfig({ ...telegramConfig, botUsername: e.target.value })}
              placeholder="KamaPrintGenBot"
              className="w-full px-4 py-2.5 rounded-xl bg-linen border border-forest/25 text-ink text-xs font-mono focus:outline-none focus:border-ochre"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSaved ? (
              <span className="text-xs text-forest font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Конфигурация сохранена!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-charcoal hover:bg-forest text-linen font-bold text-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
