import React from 'react';
import { Shield, Grid, Home, Printer, Sparkles } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, onOpenPrint, hasGeneratedImage }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-amber-500/20 px-4 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveView('launcher')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-rose-300">
              Прикамье Творчество
            </h1>
            <p className="text-xs text-amber-300/70 font-sans tracking-wide">
              Генератор гербов & орнаментов (OpenRouter AI)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-full border border-slate-800">
          <button
            onClick={() => setActiveView('launcher')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeView === 'launcher'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Главное меню</span>
          </button>

          <button
            onClick={() => setActiveView('crest')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeView === 'crest'
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 text-white shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-300" />
            Герб Семьи
          </button>

          <button
            onClick={() => setActiveView('ornament')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeView === 'ornament'
                ? 'bg-gradient-to-r from-emerald-600 to-rose-700 text-white shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Grid className="w-4 h-4 text-emerald-300" />
            Орнамент Прикамья
          </button>
        </nav>

        <div className="flex items-center gap-3 min-w-[9rem] justify-end">
          {hasGeneratedImage && (
            <button
              onClick={onOpenPrint}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-900/60 to-rose-800/60 hover:from-rose-800 hover:to-rose-700 text-rose-200 border border-rose-500/30 text-xs md:text-sm font-medium transition-all shadow-lg hover:shadow-rose-900/40"
              title="Отправить сгенерированное изображение на печать"
            >
              <Printer className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Печать / Telegram</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
