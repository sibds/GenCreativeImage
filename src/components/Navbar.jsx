import React from 'react';
import { Shield, Grid, Home, Printer, Maximize2 } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Navbar({
  activeView,
  setActiveView,
  onOpenPrint,
  hasGeneratedImage,
  printBusy = false,
  showKioskButton = false,
  onEnterKiosk
}) {
  return (
    <header className="sticky top-0 z-40 bg-linen/90 backdrop-blur-sm border-b border-forest/15 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div 
          onClick={() => setActiveView('launcher')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center group-hover:bg-forest transition-colors">
            <img src={logo} alt="" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg md:text-xl text-ink">
              Творчество Прикамье 
            </h1>
            <p className="text-xs text-forest font-sans tracking-wide">
              Генератор гербов & орнаментов
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-paper p-1.5 rounded-xl border border-forest/15">
          <button
            onClick={() => setActiveView('launcher')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              activeView === 'launcher'
                ? 'bg-ochre text-ink font-semibold'
                : 'text-forest hover:text-ink hover:bg-linen'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Главное меню</span>
          </button>

          <button
            onClick={() => setActiveView('crest')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              activeView === 'crest'
                ? 'bg-ochre text-ink font-semibold'
                : 'text-forest hover:text-ink hover:bg-linen'
            }`}
          >
            <Shield className="w-4 h-4" />
            Герб семьи
          </button>

          <button
            onClick={() => setActiveView('ornament')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              activeView === 'ornament'
                ? 'bg-ochre text-ink font-semibold'
                : 'text-forest hover:text-ink hover:bg-linen'
            }`}
          >
            <Grid className="w-4 h-4" />
            Орнамент Прикамья
          </button>
        </nav>

        <div className="flex items-center gap-3 min-w-[9rem] justify-end">
          {showKioskButton && (
            <button
              onClick={onEnterKiosk}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-paper hover:bg-linen text-forest hover:text-ink text-xs md:text-sm font-medium transition-colors border border-forest/25"
              title="Полноэкранный режим без меню"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Киоск</span>
            </button>
          )}
          {hasGeneratedImage && (
            <button
              onClick={onOpenPrint}
              disabled={printBusy}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-burgundy hover:bg-burgundy/90 text-linen text-xs md:text-sm font-medium transition-colors disabled:opacity-50"
              title="Отправить сгенерированное изображение на печать"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{printBusy ? 'Отправка...' : 'Печать'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
