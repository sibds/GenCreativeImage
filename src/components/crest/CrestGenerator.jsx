import React, { useState } from 'react';
import { ANIMALS, NATIONALITIES, ELEMENTS, SHIELD_STYLES, buildOpenRoadCrestPrompt } from '../../data/crestData';
import { generateCreativeImage } from '../../services/openRoadService';
import { Shield, Sparkles, RefreshCw, Printer, Check, Wand2, Cpu, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import UiOrnament from '../ornament/UiOrnament';
import PromptReveal from '../PromptReveal';

const CONFETTI_COLORS = ['#C9953D', '#17241E', '#762F34', '#425B43'];

function CrestIcon({ src, label, className }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={label || ''}
      draggable={false}
      className={`object-contain ${className}`}
    />
  );
}

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
        setGeneratedResult({ ...result, prompt: result.prompt || prompt });
        onGenerated?.(buildPrintPayload({
          motto,
          selectedAnimal,
          selectedNat,
          selectedElement,
          imageUrl: result.imageUrl
        }));
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
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
  const currentShieldObj = SHIELD_STYLES.find(s => s.id === shieldStyle);
  const previewActive = isGenerating || !!generatedResult || !!errorMessage;

  const chipClass = (selected) =>
    `p-2.5 rounded-xl border text-center transition-colors flex flex-col items-center gap-1 ${
      selected
        ? 'bg-ochre border-ochre text-ink shadow-sm'
        : 'bg-paper border-forest/20 text-forest hover:border-ochre/50'
    }`;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">

      <div className="mb-8 pb-6 border-b border-forest/15">        
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Генерация герба своей семьи
        </h1>        
        <p className="text-forest text-sm mt-1">Выберите параметры герба и запустите генерацию</p>
      </div>

      <div className={`grid grid-cols-1 gap-8 items-start transition-[grid-template-columns] duration-500 ease-out ${
        previewActive
          ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'
          : 'lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]'
      }`}>

        <div className="min-w-0 space-y-6 paper-card border border-forest/15 p-6 rounded-2xl">

          <div>
            <label className="block text-sm font-semibold text-forest uppercase tracking-wider mb-3">1. Животное-тотем</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ANIMALS.map(a => (
                <button key={a.id} onClick={() => setSelectedAnimal(a.id)}
                  className={chipClass(selectedAnimal === a.id)}>
                  <CrestIcon src={a.icon} label={a.name} className="w-11 h-11" />
                  <span className="text-[11px] font-semibold leading-tight">{a.name}</span>
                </button>
              ))}
            </div>
            {currentAnimalObj && <p className="mt-2 text-xs text-forest bg-linen p-2 rounded-lg border border-forest/15"><span className="text-ink font-medium">{currentAnimalObj.heraldicTerm}:</span> {currentAnimalObj.desc}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-forest uppercase tracking-wider mb-3">2. Народность</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {NATIONALITIES.map(n => (
                <button key={n.id} onClick={() => setSelectedNat(n.id)}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    selectedNat === n.id
                      ? 'bg-ochre border-ochre text-ink'
                      : 'bg-paper border-forest/20 text-forest hover:border-ochre/50'
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{n.name}</span>
                    {selectedNat === n.id && <Check className="w-4 h-4 text-ink" />}
                  </div>
                  <p className="text-[10px] text-ink/60 line-clamp-1">{n.subtitle}</p>
                </button>
              ))}
            </div>            
          </div>

          <div>
            <label className="block text-sm font-semibold text-forest uppercase tracking-wider mb-3">3. Стихия</label>
            <div className="grid grid-cols-4 gap-2">
              {ELEMENTS.map(el => (
                <button key={el.id} onClick={() => setSelectedElement(el.id)}
                  className={`p-3 rounded-xl border text-center transition-colors flex flex-col items-center gap-1 ${
                    selectedElement === el.id
                      ? 'bg-ochre border-ochre text-ink'
                      : 'bg-paper border-forest/20 text-forest hover:border-ochre/50'
                  }`}>
                  <CrestIcon src={el.icon} label={el.name} className="w-10 h-10" />
                  <span className="font-semibold text-xs">{el.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-forest uppercase tracking-wider mb-3">Форма щита</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SHIELD_STYLES.map(s => (
                <button key={s.id} onClick={() => setShieldStyle(s.id)}
                  className={chipClass(shieldStyle === s.id)}>
                  <CrestIcon src={s.icon} label={s.name} className="w-11 h-11" />
                  <span className="text-[11px] font-semibold leading-tight">{s.name}</span>
                </button>
              ))}
            </div>
            {currentShieldObj && <p className="mt-2 text-xs text-forest bg-linen p-2 rounded-lg border border-forest/15">{currentShieldObj.desc}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-forest mb-1.5">Фамилия / Девиз семьи:</label>
            <input type="text" value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="Семья Ивановых"
              className="w-full px-4 py-2.5 rounded-xl bg-linen border border-forest/25 text-ink text-sm focus:outline-none focus:border-ochre" />
          </div>

          <button onClick={handleGenerateAI} disabled={isGenerating}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-charcoal hover:bg-forest text-linen font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isGenerating
              ? <><RefreshCw className="w-6 h-6 animate-spin" /> Генерация...</>
              : <><Wand2 className="w-6 h-6" /> Сгенерировать герб</>
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
                <p className="text-forest text-xs mt-2">Это может занять 10–30 секунд...</p>
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
                  <Shield className="w-16 h-16 text-forest/30" />
                </div>
                <p className="text-forest text-sm font-medium text-center">Выберите параметры и нажмите</p>
                <p className="text-charcoal text-base font-bold mt-1">«Сгенерировать герб»</p>
                <div className="flex items-center gap-2 mt-4 text-xs text-forest">
                  <span className="inline-flex items-center gap-1">
                    <CrestIcon src={currentAnimalObj?.icon} label="" className="w-5 h-5" />
                    {currentAnimalObj?.name}
                  </span>
                  <span>•</span>
                  <span>{currentNatObj?.name}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <CrestIcon src={currentElObj?.icon} label="" className="w-5 h-5" />
                    {currentElObj?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-forest">                                    
                  <span className="inline-flex items-center gap-1">
                    <CrestIcon src={currentShieldObj?.icon} label="" className="w-5 h-5" />
                    {currentShieldObj?.name}
                  </span>
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
                  <img src={generatedResult.imageUrl} alt="Сгенерированный герб"
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
