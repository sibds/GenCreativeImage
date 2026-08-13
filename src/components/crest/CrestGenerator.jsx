import React, { useState } from 'react';
import { ANIMALS, NATIONALITIES, ELEMENTS, SHIELD_STYLES, buildOpenRoadCrestPrompt } from '../../data/crestData';
import { generateCreativeImage } from '../../services/openRoadService';
import { Shield, Sparkles, RefreshCw, Printer, Check, Wand2, Cpu, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

function buildPrintPayload({ motto, selectedAnimal, selectedNat, selectedElement, imageUrl }) {
  const animalObj = ANIMALS.find(a => a.id === selectedAnimal);
  const natObj = NATIONALITIES.find(n => n.id === selectedNat);
  const elObj = ELEMENTS.find(e => e.id === selectedElement);
  return {
    title: `Семейный герб: «${motto || 'Наш Род'}»`,
    imageUrl,
    metadata: `Тотем: ${animalObj?.name}, Народность: ${natObj?.name}, Стихия: ${elObj?.name}`,
    type: 'crest'
  };
}

export default function CrestGenerator({ onOpenPrint, onGenerated }) {
  const [selectedAnimal, setSelectedAnimal] = useState('bear');
  const [selectedNat, setSelectedNat] = useState('russian');
  const [selectedElement, setSelectedElement] = useState('fire');
  const [shieldStyle, setShieldStyle] = useState('classic');
  const [motto, setMotto] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [generatedResult, setGeneratedResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setErrorMessage('');
    setGeneratedResult(null);
    onGenerated?.(null);
    setStatusMessage('Подготовка запроса...');

    const prompt = buildOpenRoadCrestPrompt({
      animal: selectedAnimal,
      nationality: selectedNat,
      element: selectedElement,
      motto: motto || ELEMENTS.find(e => e.id === selectedElement)?.motto || '',
      shieldStyle
    });

    try {
      const result = await generateCreativeImage({
        prompt,
        mode: 'crest',
        onStatusUpdate: (msg) => setStatusMessage(msg)
      });

      if (result.success) {
        setGeneratedResult(result);
        onGenerated?.(buildPrintPayload({
          motto,
          selectedAnimal,
          selectedNat,
          selectedElement,
          imageUrl: result.imageUrl
        }));
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors: ['#FFD700', '#D4AF37', '#CC0000', '#00A86B'] });
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
      motto,
      selectedAnimal,
      selectedNat,
      selectedElement,
      imageUrl: generatedResult.imageUrl
    }));
  };

  const currentAnimalObj = ANIMALS.find(a => a.id === selectedAnimal);
  const currentNatObj = NATIONALITIES.find(n => n.id === selectedNat);
  const currentElObj = ELEMENTS.find(e => e.id === selectedElement);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-amber-500/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <Shield className="w-4 h-4" /> Приложение 1
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Генерация герба своей семьи
        </h1>
        <p className="text-slate-400 text-sm mt-1">Выберите параметры герба и запустите генерацию через OpenRouter AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Controls */}
        <div className="lg:col-span-6 space-y-6 bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-amber-500/15 shadow-2xl">

          {/* Animals */}
          <div>
            <label className="block text-sm font-semibold text-amber-300 uppercase tracking-wider mb-3">1. Животное-тотем</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ANIMALS.map(a => (
                <button key={a.id} onClick={() => setSelectedAnimal(a.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    selectedAnimal === a.id
                      ? 'bg-amber-500/15 border-amber-400 text-amber-200 shadow-lg scale-[1.03]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-amber-500/40'
                  }`}>
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-[11px] font-semibold leading-tight">{a.name}</span>
                </button>
              ))}
            </div>
            {currentAnimalObj && <p className="mt-2 text-xs text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60"><span className="text-amber-300 font-medium">{currentAnimalObj.heraldicTerm}:</span> {currentAnimalObj.desc}</p>}
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-semibold text-amber-300 uppercase tracking-wider mb-3">2. Народность</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NATIONALITIES.map(n => (
                <button key={n.id} onClick={() => setSelectedNat(n.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedNat === n.id
                      ? 'bg-amber-900/40 border-amber-400 text-white shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{n.name}</span>
                    {selectedNat === n.id && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{n.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Element */}
          <div>
            <label className="block text-sm font-semibold text-amber-300 uppercase tracking-wider mb-3">3. Стихия</label>
            <div className="grid grid-cols-4 gap-2">
              {ELEMENTS.map(el => (
                <button key={el.id} onClick={() => setSelectedElement(el.id)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    selectedElement === el.id
                      ? 'bg-rose-950/50 border-rose-500 text-rose-200 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}>
                  <span className="text-xl">{el.icon}</span>
                  <span className="font-semibold text-xs">{el.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Motto & Shield */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Фамилия / Девиз семьи:</label>
              <input type="text" value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="Семья Ивановых"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-white text-sm focus:outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Форма щита:</label>
              <select value={shieldStyle} onChange={(e) => setShieldStyle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-white text-sm focus:outline-none focus:border-amber-400">
                {SHIELD_STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button onClick={handleGenerateAI} disabled={isGenerating}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-bold text-lg shadow-xl shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {isGenerating
              ? <><RefreshCw className="w-6 h-6 animate-spin" /> Генерация...</>
              : <><Wand2 className="w-6 h-6" /> Сгенерировать герб</>
            }
          </button>
        </div>

        {/* Right: Result Area */}
        <div className="lg:col-span-6 flex flex-col items-center sticky top-24">
          <div className="w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/15 shadow-2xl overflow-hidden">

            {/* Loading State */}
            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-24 px-8">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
                  <Cpu className="w-8 h-8 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-amber-200 text-sm font-medium text-center animate-pulse">{statusMessage}</p>
                <p className="text-slate-500 text-xs mt-2">Это может занять 10–30 секунд...</p>
              </div>
            )}

            {/* Error State */}
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
                  <Shield className="w-16 h-16 text-slate-700" />
                </div>
                <p className="text-slate-400 text-sm font-medium text-center">Выберите параметры и нажмите</p>
                <p className="text-amber-400 text-base font-bold mt-1">«Сгенерировать герб»</p>
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                  <span>{currentAnimalObj?.icon} {currentAnimalObj?.name}</span>
                  <span>•</span>
                  <span>{currentNatObj?.name}</span>
                  <span>•</span>
                  <span>{currentElObj?.icon} {currentElObj?.name}</span>
                </div>
              </div>
            )}

            {/* Success: Generated Image */}
            {!isGenerating && generatedResult && generatedResult.success && (
              <div className="flex flex-col">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <Sparkles className="w-4 h-4" /> {generatedResult.source || 'OpenRouter AI'}
                  </div>
                  <span className="text-[10px] text-slate-500">{generatedResult.message}</span>
                </div>

                <div className="p-4 flex justify-center bg-slate-950/50">
                  <img src={generatedResult.imageUrl} alt="Сгенерированный герб"
                    className="max-w-full max-h-[520px] object-contain rounded-2xl shadow-2xl border border-amber-500/20" />
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
