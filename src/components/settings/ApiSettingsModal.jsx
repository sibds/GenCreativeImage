import React, { useState } from 'react';
import { getOpenRouterEnvConfig, saveOpenRouterLocalConfig } from '../../services/openRoadService';
import { getTelegramConfig, saveTelegramConfig } from '../../services/telegramService';
import { Settings, X, Save, CheckCircle, Key, Server, Cpu, Send, Sparkles, FileText, Info } from 'lucide-react';

export default function ApiSettingsModal({ onClose }) {
  const envConfig = getOpenRouterEnvConfig();
  const [openRoadConfig, setOpenRoadConfig] = useState(envConfig);
  const [telegramConfig, setTelegramConfig] = useState(getTelegramConfig());
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveOpenRouterLocalConfig(openRoadConfig);
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
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-500/20 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-slate-950 font-bold flex items-center justify-center shadow-lg">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                Конфигурация `.env` & OpenRouter API
              </h2>
              <p className="text-xs text-slate-400">Настройки ключа, генерации изображений и Текстовой LLM</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          
          {/* File .env Alert Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-amber-400" /> Файл конфигурации `.env`
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Вы можете настроить параметры генерации прямо в файле <span className="text-amber-300 font-mono font-bold">.env</span> в корне проекта:
            </p>
            <div className="bg-slate-900 p-3 rounded-xl font-mono text-[11px] text-amber-200 border border-slate-800 space-y-1">
              <div>VITE_OPENROUTER_API_KEY={openRoadConfig.apiKey ? `${openRoadConfig.apiKey.substring(0, 10)}...` : 'sk-or-v1-...'}</div>
              <div>VITE_OPENROUTER_IMAGE_MODEL={openRoadConfig.imageModel}</div>
              <div>VITE_OPENROUTER_TEXT_MODEL={openRoadConfig.textModel}</div>
            </div>
          </div>

          {/* Form Fields for Manual Override */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-400" /> Ключ API OpenRouter (переопределение):
              </label>
              <input
                type="password"
                value={openRoadConfig.apiKey}
                onChange={(e) => setOpenRoadConfig({ ...openRoadConfig, apiKey: e.target.value })}
                placeholder="sk-or-v1-..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-rose-400" /> Модель Изображений:
                </label>
                <input
                  type="text"
                  value={openRoadConfig.imageModel}
                  onChange={(e) => setOpenRoadConfig({ ...openRoadConfig, imageModel: e.target.value })}
                  placeholder="google/gemini-3-pro-image"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Текстовая модель LLM:
                </label>
                <input
                  type="text"
                  value={openRoadConfig.textModel}
                  onChange={(e) => setOpenRoadConfig({ ...openRoadConfig, textModel: e.target.value })}
                  placeholder="openai/gpt-4o-mini"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Section 2: Telegram Bot Username */}
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

          {/* Save Button */}
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
