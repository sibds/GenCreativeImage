import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { RotateCcw, X } from 'lucide-react';
import { formatKioskCountdown } from '../../kiosk/config.js';

export default function KioskResetButton({ countdown, warnMs = 0, onReset }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const warn = countdown != null && countdown * 1000 <= warnMs;

  const handleConfirm = () => {
    setConfirmOpen(false);
    onReset?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-colors ${
          warn
            ? 'bg-burgundy hover:bg-burgundy/90 text-linen'
            : 'bg-charcoal hover:bg-forest text-linen'
        }`}
      >
        <RotateCcw className="w-5 h-5" />
        {countdown != null ? `Сброс через ${formatKioskCountdown(countdown)}` : 'Сброс'}
      </button>

      {confirmOpen && createPortal(
        <div
          className="fixed inset-0 z-50 bg-charcoal/70 flex items-center justify-center p-4 print:hidden"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="paper-card border border-forest/15 rounded-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-forest/15 bg-linen/60">
              <h2 className="font-serif font-bold text-lg text-ink">Сбросить?</h2>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="p-2 rounded-xl text-forest hover:text-ink hover:bg-linen transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm text-forest leading-relaxed">
                Результат и выбранные параметры будут сброшены. Это нельзя отменить.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-paper hover:bg-linen text-ink font-medium text-sm border border-forest/25 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy/90 text-linen font-bold text-sm transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Сбросить
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
