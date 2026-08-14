import React, { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import LauncherScreen from './components/LauncherScreen';
import CrestGenerator from './components/crest/CrestGenerator';
import OrnamentGenerator from './components/ornament/OrnamentGenerator';
import PrintModal from './components/print/PrintModal';
import ApiSettingsModal from './components/settings/ApiSettingsModal';
import EdgeOrnament from './components/ornament/EdgeOrnament';
import KioskBar from './components/kiosk/KioskBar';
import { getKioskConfig, persistKiosk } from './kiosk/config.js';
import { useKioskIdle } from './kiosk/useKioskIdle.js';
import { useKioskFit } from './kiosk/useKioskFit.js';
import { dispatchPrint, fetchDispatchConfig, hasDispatchChannels } from './services/dispatchService.js';
import background from './assets/background.png';
import { AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';

export default function App() {
  const [config] = useState(() => getKioskConfig());
  const [kiosk, setKiosk] = useState(config.kiosk);
  const [session, setSession] = useState(0);
  const [activeView, setActiveView] = useState('launcher'); // 'launcher' | 'crest' | 'ornament'
  const [printItem, setPrintItem] = useState(null);
  const [generatedPrintItem, setGeneratedPrintItem] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [dispatchConfig, setDispatchConfig] = useState({ telegram: false, email: false });
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const dispatchSendingRef = useRef(false);

  useEffect(() => {
    fetchDispatchConfig().then(setDispatchConfig);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('kiosk', kiosk);
    return () => document.documentElement.classList.remove('kiosk');
  }, [kiosk]);

  useEffect(() => {
    if (!dispatchStatus || dispatchStatus.sending || !dispatchStatus.success) return undefined;
    const t = setTimeout(() => setDispatchStatus(null), 5000);
    return () => clearTimeout(t);
  }, [dispatchStatus]);

  const handleSetView = (view) => {
    setActiveView(view);
    setGeneratedPrintItem(null);
  };

  const handleOpenPrint = async (item) => {
    const payload = item || generatedPrintItem;
    if (!payload?.imageUrl) return;
    if (dispatchSendingRef.current) return;

    if (hasDispatchChannels(dispatchConfig)) {
      dispatchSendingRef.current = true;
      setDispatchStatus({ sending: true, success: false, message: 'Отправка на печать...' });
      try {
        const res = await dispatchPrint(payload);
        setDispatchStatus({ sending: false, ...res });
      } finally {
        dispatchSendingRef.current = false;
      }
      return;
    }

    setPrintItem(payload);
  };

  const handleReset = useCallback(() => {
    setSession((s) => s + 1);
    setPrintItem(null);
    setGeneratedPrintItem(null);
    setShowSettings(false);
    setDispatchStatus(null);
    dispatchSendingRef.current = false;
  }, []);

  const enterKiosk = () => {
    persistKiosk(true);
    setKiosk(true);
  };

  const exitKiosk = () => {
    persistKiosk(false);
    setKiosk(false);
  };

  const countdown = useKioskIdle({
    enabled: kiosk,
    hasResult: !!generatedPrintItem?.imageUrl,
    idleMs: config.idleMs,
    onReset: handleReset
  });

  const { ref: fitRef } = useKioskFit(
    kiosk,
    `${session}-${activeView}-${generatedPrintItem?.imageUrl || ''}`
  );

  const shellClass = kiosk
    ? 'h-dvh overflow-hidden flex flex-col'
    : 'min-h-screen flex flex-col';

  const dispatchPartial = Boolean(
    dispatchStatus?.success
    && (
      (dispatchStatus.telegram && !dispatchStatus.telegram.ok)
      || (dispatchStatus.email && !dispatchStatus.email.ok)
    )
  );

  return (
    <div className={`relative text-ink font-sans selection:bg-ochre selection:text-ink ${kiosk ? 'h-dvh overflow-hidden' : 'min-h-screen'}`}>
      <div className="app-bg fixed inset-0 z-0 bg-linen" aria-hidden="true">
        <img
          src={background}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-bottom opacity-40"
        />
        <div className="absolute inset-0 bg-linen/70" />
      </div>

      <div className={`relative z-10 ${shellClass}`}>
        <EdgeOrnament />

        {!kiosk && (
          <Navbar
            activeView={activeView}
            setActiveView={handleSetView}
            onOpenSettings={() => setShowSettings(true)}
            onOpenPrint={() => handleOpenPrint()}
            hasGeneratedImage={!!generatedPrintItem?.imageUrl}
            printBusy={!!dispatchStatus?.sending}
            showKioskButton={config.controls}
            onEnterKiosk={enterKiosk}
          />
        )}

        {kiosk && (
          <KioskBar
            showExit={config.controls}
            onExit={exitKiosk}
          />
        )}

        <main className={kiosk ? 'flex-1 min-h-0 overflow-hidden' : 'flex-1'}>
          <div ref={kiosk ? fitRef : undefined} className={kiosk ? 'h-full w-full overflow-hidden' : undefined}>
            {activeView === 'launcher' && (
              <LauncherScreen
                key={`launcher-${session}`}
                kiosk={kiosk}
                onSelectApp={(appId) => handleSetView(appId)}
              />
            )}

            {activeView === 'crest' && (
              <CrestGenerator
                key={`crest-${session}`}
                kiosk={kiosk}
                countdown={countdown}
                countdownWarnMs={config.countdownMs}
                onReset={handleReset}
                onOpenPrint={handleOpenPrint}
                onGenerated={setGeneratedPrintItem}
              />
            )}

            {activeView === 'ornament' && (
              <OrnamentGenerator
                key={`ornament-${session}`}
                kiosk={kiosk}
                countdown={countdown}
                countdownWarnMs={config.countdownMs}
                onReset={handleReset}
                onOpenPrint={handleOpenPrint}
                onGenerated={setGeneratedPrintItem}
              />
            )}
          </div>
        </main>

        {dispatchStatus && (
          <div className="fixed bottom-6 left-1/2 z-[60] w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 print:hidden">
            <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              dispatchStatus.sending
                ? 'bg-paper border-forest/25 text-charcoal'
                : dispatchPartial
                  ? 'bg-ochre/15 border-ochre/40 text-charcoal'
                  : dispatchStatus.success
                    ? 'bg-forest/10 border-forest/30 text-charcoal'
                    : 'bg-burgundy/10 border-burgundy/30 text-burgundy'
            }`}>
              {dispatchStatus.sending ? (
                <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin text-forest" />
              ) : dispatchStatus.success && !dispatchPartial ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-forest" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="flex-1 text-sm font-medium pt-0.5">{dispatchStatus.message}</p>
              {!dispatchStatus.sending && (
                <button
                  type="button"
                  onClick={() => setDispatchStatus(null)}
                  className="p-1 rounded-lg hover:bg-linen/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
        {printItem && (
          <PrintModal
            kiosk={kiosk}
            printItem={printItem}
            onClose={() => setPrintItem(null)}
          />
        )}

        {showSettings && (
          <ApiSettingsModal
            onClose={() => setShowSettings(false)}
          />
        )}

        
          <footer className="border-t border-forest/15 bg-linen/80 py-6 px-4 text-center text-xs text-forest">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                © ООО "СибСР", {new Date().getFullYear()} • Генератор гербов и орнаментов
              </div>
              {!kiosk && (
              <div className="flex items-center gap-4 text-charcoal">
                <button onClick={() => handleSetView('crest')} className="hover:text-ochre">
                  Герб семьи
                </button>
                <span className="text-forest/40">•</span>
                <button onClick={() => handleSetView('ornament')} className="hover:text-ochre">
                  Орнамент Прикамья
                </button>
              </div>
              )}
            </div>
          </footer>
        
      </div>
    </div>
  );
}
