import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LauncherScreen from './components/LauncherScreen';
import CrestGenerator from './components/crest/CrestGenerator';
import OrnamentGenerator from './components/ornament/OrnamentGenerator';
import PrintModal from './components/print/PrintModal';
import ApiSettingsModal from './components/settings/ApiSettingsModal';
import EdgeOrnament from './components/ornament/EdgeOrnament';

export default function App() {
  const [activeView, setActiveView] = useState('launcher'); // 'launcher' | 'crest' | 'ornament'
  const [printItem, setPrintItem] = useState(null);
  const [generatedPrintItem, setGeneratedPrintItem] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleSetView = (view) => {
    setActiveView(view);
    setGeneratedPrintItem(null);
  };

  const handleOpenPrint = (item) => {
    const payload = item || generatedPrintItem;
    if (payload?.imageUrl) setPrintItem(payload);
  };

  return (
    <div className="min-h-screen bg-linen text-ink flex flex-col font-sans selection:bg-ochre selection:text-ink">
      <EdgeOrnament />

      <Navbar
        activeView={activeView}
        setActiveView={handleSetView}
        onOpenSettings={() => setShowSettings(true)}
        onOpenPrint={() => handleOpenPrint()}
        hasGeneratedImage={!!generatedPrintItem?.imageUrl}
      />

      <main className="flex-1">
        {activeView === 'launcher' && (
          <LauncherScreen onSelectApp={(appId) => handleSetView(appId)} />
        )}

        {activeView === 'crest' && (
          <CrestGenerator
            onOpenPrint={handleOpenPrint}
            onGenerated={setGeneratedPrintItem}
          />
        )}

        {activeView === 'ornament' && (
          <OrnamentGenerator
            onOpenPrint={handleOpenPrint}
            onGenerated={setGeneratedPrintItem}
          />
        )}
      </main>

      {printItem && (
        <PrintModal
          printItem={printItem}
          onClose={() => setPrintItem(null)}
        />
      )}

      {showSettings && (
        <ApiSettingsModal
          onClose={() => setShowSettings(false)}
        />
      )}

      <footer className="border-t border-forest/15 bg-linen py-6 px-4 text-center text-xs text-forest">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Прикамье Творчество © {new Date().getFullYear()} • Генератор гербов и орнаментов (OpenRoad Engine)
          </div>
          <div className="flex items-center gap-4 text-charcoal">
            <button onClick={() => handleSetView('crest')} className="hover:text-ochre">
              Герб Семьи
            </button>
            <span className="text-forest/40">•</span>
            <button onClick={() => handleSetView('ornament')} className="hover:text-ochre">
              Орнамент Прикамья
            </button>
            <span className="text-forest/40">•</span>
            <button onClick={() => setShowSettings(true)} className="hover:text-ochre">
              API OpenRoad
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
