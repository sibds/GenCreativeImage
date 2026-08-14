import React from 'react';
import { Minimize2 } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function KioskBar({ showExit, onExit }) {
  return (
    <header className="shrink-0 z-40 h-12 bg-linen/90 backdrop-blur-sm border-b border-forest/15 px-4 flex items-center justify-between print:hidden">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
          <img src={logo} alt="" className="w-full h-full object-contain" />
        </div>
        <span className="font-serif font-bold text-base text-ink truncate">
          Творчество Прикамье
        </span>
      </div>

      {showExit && (
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-forest hover:text-ink hover:bg-paper border border-forest/15 transition-colors"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          Обычный режим
        </button>
      )}
    </header>
  );
}
