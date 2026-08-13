import React, { useState } from 'react';
import { KAMA_PALETTE, MAIN_SYMBOLS, COMPOSITION_TYPES, buildOpenRoadOrnamentPrompt } from '../../data/ornamentData';
import { generateCreativeImage } from '../../services/openRoadService';
import { Grid, Sparkles, RefreshCw, Printer, Check, Wand2, Cpu, AlertCircle, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';
import UiOrnament from './UiOrnament';
import PromptReveal from '../PromptReveal';

const CONFETTI_COLORS = ['#C9953D', '#17241E', '#762F34', '#425B43'];

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
      if (selectedSymbols.length > 1) setSelectedSymbols(selectedSymbols.filter(s => s.id !== id));
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
        setGeneratedResult({ ...result, prompt: result.prompt || prompt });
        onGenerated?.(buildPrintPayload({
          selectedSymbols,
          composition,
          imageUrl: result.imageUrl
        }));
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
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

  const previewActive = isGenerating || !!generatedResult || !!errorMessage;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">

      <div className="mb-8 pb-6 border-b border-forest/15">        
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Генерация орнамента Прикамья
        </h1>        
        <p className="text-forest text-sm mt-1">2D графика без людей, четкая геометрия, палитра: охра, белый, тёмно-зелёный, бордовый</p>
      </div>

      <div className={`grid grid-cols-1 gap-8 items-start transition-[grid-template-columns] duration-500 ease-out ${
        previewActive
          ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'
          : 'lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]'
      }`}>

        <div className="min-w-0 space-y-6 paper-card border border-forest/15 p-6 rounded-2xl">

          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Палитра (по ТЗ):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(KAMA_PALETTE).map(c => (
                <div key={c.hex} className="p-2.5 rounded-xl bg-linen border border-forest/15 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg border border-forest/20 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                  <div>
                    <div className="text-[11px] font-bold text-ink">{c.name}</div>
                    <div className="text-[9px] text-forest font-mono">{c.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-3">Символы:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {MAIN_SYMBOLS.map(sym => {
                const sel = selectedSymbols.includes(sym.id);
                return (
                  <button key={sym.id} onClick={() => toggleSymbol(sym.id)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      sel ? 'bg-ochre border-ochre text-ink' : 'bg-paper border-forest/20 text-forest hover:border-ochre/50'
                    }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xl">{sym.icon}</span>
                      {sel && <Check className="w-4 h-4 text-ink" />}
                    </div>
                    <div className="font-bold text-xs">{sym.name}</div>
                    <div className="text-[10px] text-ink/70 mt-0.5">{sym.meaning}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-3">Композиция:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COMPOSITION_TYPES.map(comp => (
                <button key={comp.id} onClick={() => setComposition(comp.id)}
                  className={`p-2.5 rounded-xl border text-center transition-colors text-xs ${
                    composition === comp.id
                      ? 'bg-ochre border-ochre text-ink font-semibold'
                      : 'bg-paper border-forest/20 text-forest hover:border-ochre/50'
                  }`}>
                  {comp.name}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleGenerateAI} disabled={isGenerating}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-charcoal hover:bg-forest text-linen font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isGenerating
              ? <><RefreshCw className="w-6 h-6 animate-spin" /> Генерация...</>
              : <><Wand2 className="w-6 h-6" /> Сгенерировать орнамент</>
            }
          </button>
        </div>

        <div className="min-w-0 flex flex-col items-center sticky top-24">
          <div className="w-full paper-card border border-forest/15 rounded-2xl overflow-hidden">

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-24 px-8">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-forest/20 border-t-ochre rounded-full animate-spin" />
                  <Cpu className="w-8 h-8 text-charcoal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-charcoal text-sm font-medium text-center">{statusMessage}</p>
                <p className="text-forest text-xs mt-2">Это может занять до 1–2 минут...</p>
              </div>
            )}

            {!isGenerating && errorMessage && (
              <div className="flex flex-col items-center justify-center py-16 px-8">
                <AlertCircle className="w-14 h-14 text-burgundy mb-4" />
                <p className="text-burgundy text-sm font-medium text-center mb-2">Ошибка генерации</p>
                <p className="text-forest text-xs text-center max-w-md">{errorMessage}</p>
                <button onClick={handleGenerateAI}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy/90 text-linen font-semibold text-sm transition-colors">
                  Попробовать снова
                </button>
              </div>
            )}

            {!isGenerating && !errorMessage && !generatedResult && (
              <div className="flex flex-col items-center justify-center py-24 px-8">
                <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-forest/25 flex items-center justify-center mb-6">
                  <Grid className="w-16 h-16 text-forest/30" />
                </div>
                <p className="text-forest text-sm font-medium text-center">Выберите параметры и нажмите</p>
                <p className="text-charcoal text-base font-bold mt-1">«Сгенерировать орнамент»</p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="w-3 h-3 rounded-full bg-[#C88A35]" />
                  <span className="w-3 h-3 rounded-full bg-white border border-forest/20" />
                  <span className="w-3 h-3 rounded-full bg-[#1C4524]" />
                  <span className="w-3 h-3 rounded-full bg-[#7A1C2C]" />
                  <span className="text-xs text-forest ml-1">Палитра Прикамья</span>
                </div>
              </div>
            )}

            {!isGenerating && generatedResult && generatedResult.success && (
              <div className="flex flex-col">
                <div className="p-4 border-b border-forest/15 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-forest font-medium">
                    <Sparkles className="w-4 h-4" /> {generatedResult.source || 'OpenRouter AI'}
                  </div>
                  <span className="text-[10px] text-forest/70">{generatedResult.message}</span>
                </div>

                <div className="p-4 flex justify-center bg-linen">
                  <img src={generatedResult.imageUrl} alt="Сгенерированный орнамент"
                    className="max-w-full max-h-[520px] object-contain rounded-xl border border-forest/15" />
                </div>

                <div className="p-4 border-t border-forest/15 flex flex-col gap-3">
                  <button onClick={handlePrintClick}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-burgundy hover:bg-burgundy/90 text-linen font-bold text-sm transition-colors">
                    <Printer className="w-5 h-5" /> Отправить на печать
                  </button>
                  <button onClick={handleGenerateAI}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-paper hover:bg-linen text-ink font-medium text-xs transition-colors border border-forest/25">
                    <RefreshCw className="w-4 h-4" /> Сгенерировать заново
                  </button>
                  <PromptReveal prompt={generatedResult.prompt} />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
