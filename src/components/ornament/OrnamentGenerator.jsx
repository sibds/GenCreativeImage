import React, { useState } from 'react';
import { KAMA_PALETTE, MAIN_SYMBOLS, COMPOSITION_TYPES, buildOpenRoadOrnamentPrompt } from '../../data/ornamentData';
import { generateCreativeImage } from '../../services/openRoadService';
import { Grid, Sparkles, RefreshCw, Printer, Check, Wand2, Cpu, AlertCircle, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';

function buildPrintPayload({ selectedSymbols, composition, imageUrl }) {
  const symbolNames = selectedSymbols.map(id => MAIN_SYMBOLS.find(s => s.id === id)?.name).filter(Boolean).join(', ');
  const compObj = COMPOSITION_TYPES.find(c => c.id === composition);
  return {
    title: 'Традиционный орнамент Прикамья',
    imageUrl,
    metadata: `Символы: ${symbolNames}. Композиция: ${compObj?.name}. Палитра: Охра, Белый, Тёмно-зелёный, Бордовый.`,
    type: 'ornament'
  };
}

export default function OrnamentGenerator({ onOpenPrint, onGenerated }) {
  const [selectedSymbols, setSelectedSymbols] = useState(['rhombus', 'wave', 'cross']);
  const [composition, setComposition] = useState('tile');
  const [repeatCount, setRepeatCount] = useState(4);
  const [strokeWidth, setStrokeWidth] = useState(3);

  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleSymbol = (id) => {
    if (selectedSymbols.includes(id)) {
      if (selectedSymbols.length > 1) setSelectedSymbols(selectedSymbols.filter(s => s !== id));
    } else {
      setSelectedSymbols([...selectedSymbols, id]);
    }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setErrorMessage('');
    setGeneratedResult(null);
    onGenerated?.(null);
    setStatusMessage('Подготовка запроса...');

    const prompt = buildOpenRoadOrnamentPrompt({
      symbols: selectedSymbols,
      composition,
      density: repeatCount,
      strokeWidth
    });

    try {
      const result = await generateCreativeImage({
        prompt,
        mode: 'ornament',
        onStatusUpdate: (msg) => setStatusMessage(msg)
      });

      if (result.success) {
        setGeneratedResult(result);
        onGenerated?.(buildPrintPayload({
          selectedSymbols,
          composition,
          imageUrl: result.imageUrl
        }));
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#C88A35', '#FFFFFF', '#1C4524', '#7A1C2C'] });
      } else {
        setErrorMessage(result.error || 'Не удалось сгенерировать изображение');
      }
    } catch (err) {
      setErrorMessage(`Ошибка: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setStatusMessage('');
    }
  };

  const handlePrintClick = () => {
    if (!generatedResult?.imageUrl) return;
    onOpenPrint(buildPrintPayload({
      selectedSymbols,
      composition,
      imageUrl: generatedResult.imageUrl
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-emerald-500/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
          <Grid className="w-4 h-4" /> Приложение 2
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Генерация орнамента Прикамья
        </h1>
        <p className="text-slate-400 text-sm mt-1">2D графика без людей, четкая геометрия, палитра: охра, белый, тёмно-зелёный, бордовый</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Controls */}
        <div className="lg:col-span-6 space-y-6 bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-emerald-500/15 shadow-2xl">

          {/* Palette */}
          <div>
            <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Палитра (по ТЗ):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(KAMA_PALETTE).map(c => (
                <div key={c.hex} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg border border-white/20 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                  <div>
                    <div className="text-[11px] font-bold text-white">{c.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono">{c.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Symbols */}
          <div>
            <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-3">Символы:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {MAIN_SYMBOLS.map(sym => {
                const sel = selectedSymbols.includes(sym.id);
                return (
                  <button key={sym.id} onClick={() => toggleSymbol(sym.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      sel ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{sym.icon}</span>
                      {sel && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="font-bold text-xs">{sym.name}</div>
                    <div className="text-[10px] text-amber-300/80 mt-0.5">{sym.meaning}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Composition */}
          <div>
            <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-3">Композиция:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COMPOSITION_TYPES.map(comp => (
                <button key={comp.id} onClick={() => setComposition(comp.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all text-xs ${
                    composition === comp.id
                      ? 'bg-emerald-600/25 border-emerald-400 text-emerald-200 shadow-md font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}>
                  {comp.name}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button onClick={handleGenerateAI} disabled={isGenerating}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-rose-700 hover:from-emerald-400 hover:to-rose-600 text-white font-bold text-lg shadow-xl shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {isGenerating
              ? <><RefreshCw className="w-6 h-6 animate-spin" /> Генерация...</>
              : <><Wand2 className="w-6 h-6" /> Сгенерировать орнамент</>
            }
          </button>
        </div>

        {/* Right: Result Area */}
        <div className="lg:col-span-6 flex flex-col items-center sticky top-24">
          <div className="w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-emerald-500/15 shadow-2xl overflow-hidden">

            {/* Loading */}
            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-24 px-8">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
                  <Cpu className="w-8 h-8 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-emerald-200 text-sm font-medium text-center animate-pulse">{statusMessage}</p>
                <p className="text-slate-500 text-xs mt-2">Это может занять 10–30 секунд...</p>
              </div>
            )}

            {/* Error */}
            {!isGenerating && errorMessage && (
              <div className="flex flex-col items-center justify-center py-16 px-8">
                <AlertCircle className="w-14 h-14 text-rose-400 mb-4" />
                <p className="text-rose-300 text-sm font-medium text-center mb-2">Ошибка генерации</p>
                <p className="text-slate-400 text-xs text-center max-w-md">{errorMessage}</p>
                <button onClick={handleGenerateAI}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-colors">
                  Попробовать снова
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isGenerating && !errorMessage && !generatedResult && (
              <div className="flex flex-col items-center justify-center py-24 px-8">
                <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-slate-700 flex items-center justify-center mb-6">
                  <Grid className="w-16 h-16 text-slate-700" />
                </div>
                <p className="text-slate-400 text-sm font-medium text-center">Выберите параметры и нажмите</p>
                <p className="text-emerald-400 text-base font-bold mt-1">«Сгенерировать орнамент»</p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="w-3 h-3 rounded-full bg-[#C88A35]" />
                  <span className="w-3 h-3 rounded-full bg-white border border-slate-600" />
                  <span className="w-3 h-3 rounded-full bg-[#1C4524]" />
                  <span className="w-3 h-3 rounded-full bg-[#7A1C2C]" />
                  <span className="text-xs text-slate-500 ml-1">Палитра Прикамья</span>
                </div>
              </div>
            )}

            {/* Success */}
            {!isGenerating && generatedResult && generatedResult.success && (
              <div className="flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <Sparkles className="w-4 h-4" /> {generatedResult.source || 'OpenRouter AI'}
                  </div>
                  <span className="text-[10px] text-slate-500">{generatedResult.message}</span>
                </div>

                <div className="p-4 flex justify-center bg-slate-950/50">
                  <img src={generatedResult.imageUrl} alt="Сгенерированный орнамент"
                    className="max-w-full max-h-[520px] object-contain rounded-2xl shadow-2xl border border-emerald-500/20" />
                </div>

                <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
                  <button onClick={handlePrintClick}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg transition-all">
                    <Printer className="w-5 h-5" /> Отправить на печать
                  </button>
                  <button onClick={handleGenerateAI}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors border border-slate-700">
                    <RefreshCw className="w-4 h-4" /> Сгенерировать заново
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
