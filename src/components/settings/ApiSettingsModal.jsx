import React from 'react';
import { X, Shield } from 'lucide-react';

export default function ApiSettingsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-charcoal/70 flex items-center justify-center p-4">
      <div className="paper-card border border-forest/15 rounded-2xl max-w-xl w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-forest/15 bg-linen/60">
          <div>
            <h2 className="font-serif font-bold text-lg text-ink">Настройки</h2>
            <p className="text-xs text-forest">Ключи и каналы печати хранятся только на сервере</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-forest hover:text-ink hover:bg-linen transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-linen border border-forest/20 space-y-2">
            <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" /> Сервер
            </div>
            <p className="text-xs text-ink leading-relaxed">
              OpenRouter — <span className="font-mono font-bold">OPENROUTER_*</span>.
              Печать — <span className="font-mono font-bold">TELEGRAM_BOT_TOKEN</span>,
              {' '}<span className="font-mono font-bold">TELEGRAM_CHAT_ID</span>,
              {' '}<span className="font-mono font-bold">SMTP_*</span>,
              {' '}<span className="font-mono font-bold">DISPATCH_EMAIL_*</span>
              (локально — <span className="font-mono">.env</span>, на Vercel — Environment Variables).
              Браузер секреты не получает.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
