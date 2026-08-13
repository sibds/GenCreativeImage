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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-500/20 bg-slate-950/60">
          <div>
            <h2 className="font-serif font-bold text-lg text-white">Настройки</h2>
            <p className="text-xs text-slate-400">Ключ OpenRouter хранится только на сервере</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" /> OpenRouter
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              API-ключ и модели задаются в <span className="text-amber-300 font-mono font-bold">OPENROUTER_*</span> на сервере
              (локально — <span className="font-mono">.env</span>, на Vercel — Environment Variables).
              Браузер ключ не получает.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Send className="w-4 h-4" /> Имя Telegram-бота печати:
            </label>
            <input
              type="text"
              value={telegramConfig.botUsername}
              onChange={(e) => setTelegramConfig({ ...telegramConfig, botUsername: e.target.value })}
              placeholder="KamaPrintGenBot"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSaved ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                <CheckCircle className="w-4 h-4" /> Конфигурация сохранена!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold text-xs shadow-lg transition-all"
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
