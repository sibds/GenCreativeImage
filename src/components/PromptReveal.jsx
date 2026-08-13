import React, { useState } from 'react';
import { FileText, Copy, Check, ChevronDown } from 'lucide-react';

export default function PromptReveal({ prompt }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-paper hover:bg-linen text-ink font-medium text-xs transition-colors border border-forest/25"
      >
        <FileText className="w-4 h-4" />
        {open ? 'Скрыть промпт' : 'Показать промпт'}
        <ChevronDown className={`w-3.5 h-3.5 text-forest transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="rounded-xl border border-forest/20 bg-linen overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-forest/15">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-forest">
              Промпт генерации
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium text-forest hover:text-ink hover:bg-paper transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Скопировано' : 'Копировать'}
            </button>
          </div>
          <pre className="p-3 text-[11px] leading-relaxed text-ink whitespace-pre-wrap break-words max-h-56 overflow-y-auto font-mono">
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
}
