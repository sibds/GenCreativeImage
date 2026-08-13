import React from 'react';
import { Shield, Grid, ArrowRight, Palette, Award, Feather, Send } from 'lucide-react';
import UiOrnament from './ornament/UiOrnament';

export default function LauncherScreen({ onSelectApp }) {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 overflow-hidden">

      <div className="relative z-10 max-w-4xl text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-paper border border-ochre/40 text-forest text-xs font-semibold uppercase tracking-wider mb-6">
          Единый стартовый центр генерации
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink mb-3 leading-tight">
          Творческое наследие <br />
          <span className="text-charcoal">
            Рода и Прикамья
          </span>
        </h1>

        <UiOrnament variant="h1" className="mx-auto mb-6" />

        <p className="text-forest text-base sm:text-lg max-w-2xl mx-auto font-sans font-light leading-relaxed">
          Выберите приложение для генерации цифрового искусства на базе движка <span className="text-ink font-medium">OpenRoad AI</span>. Создайте свой семейный герб или традиционный 2D орнамент с возможностью мгновенной отправки на печать в Telegram-бот.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        
        <div
          onClick={() => onSelectApp('crest')}
          className="group relative rounded-2xl paper-card border border-ochre/35 hover:border-ochre p-8 cursor-pointer transition-colors overflow-hidden flex flex-col justify-between"
        >
          <UiOrnament variant="h2" className="mx-auto mb-5" />

          <div>
            <div className="w-16 h-16 rounded-xl bg-charcoal flex items-center justify-center mb-6">
              <Shield className="w-9 h-9 text-linen" />
            </div>

            <div className="inline-block px-3 py-1 rounded-md bg-ochre/15 text-ochre text-xs font-medium mb-3">
              Приложение 1
            </div>

            <h2 className="font-serif text-2xl font-bold text-ink mb-3 group-hover:text-charcoal transition-colors">
              Генерация герба своей семьи
            </h2>

            <p className="text-forest text-sm leading-relaxed mb-6">
              Создайте величественный геральдический герб рода с символом тотемного животного, народными узорами и стихией.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-2.5 py-1 rounded-lg bg-linen border border-forest/15 text-forest text-xs flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-ochre" /> 10 животных
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-linen border border-forest/15 text-forest text-xs flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-burgundy" /> 7 народностей
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-linen border border-forest/15 text-forest text-xs flex items-center gap-1.5">
                4 стихии
              </span>
            </div>
          </div>

          <UiOrnament variant="h2" className="mx-auto mb-4" />

          <div className="flex items-center justify-between pt-4 border-t border-forest/15">
            <span className="text-xs text-ochre font-medium">Запустить геральдику</span>
            <div className="w-10 h-10 rounded-lg bg-ochre/20 group-hover:bg-ochre text-charcoal flex items-center justify-center transition-colors">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        <div
          onClick={() => onSelectApp('ornament')}
          className="group relative rounded-2xl paper-card border border-forest/30 hover:border-forest p-8 cursor-pointer transition-colors overflow-hidden flex flex-col justify-between"
        >
          <UiOrnament variant="h2" className="mx-auto mb-5" />

          <div>
            <div className="w-16 h-16 rounded-xl bg-burgundy flex items-center justify-center mb-6">
              <Grid className="w-9 h-9 text-linen" />
            </div>

            <div className="inline-block px-3 py-1 rounded-md bg-forest/10 text-forest text-xs font-medium mb-3">
              Приложение 2
            </div>

            <h2 className="font-serif text-2xl font-bold text-ink mb-3 group-hover:text-charcoal transition-colors">
              Генерация орнамента Прикамья
            </h2>

            <p className="text-forest text-sm leading-relaxed mb-6">
              Традиционный 2D орнамент народов Прикамья без людей, с четкими геометрическими контурами в палитре охра, белый, тёмно-зеленый и бордовый.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-2.5 py-1 rounded-lg bg-linen border border-forest/15 text-forest text-xs flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-ochre" /> Традиционная палитра
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-linen border border-forest/15 text-forest text-xs">
                Ромб (плодородие)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-linen border border-forest/15 text-forest text-xs">
                Волна (жизнь/вода)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-linen border border-forest/15 text-forest text-xs">
                Крест (ось мира)
              </span>
            </div>
          </div>

          <UiOrnament variant="h2" className="mx-auto mb-4" />

          <div className="flex items-center justify-between pt-4 border-t border-forest/15">
            <span className="text-xs text-forest font-medium">Запустить геометрию узора</span>
            <div className="w-10 h-10 rounded-lg bg-forest/15 group-hover:bg-forest text-forest group-hover:text-linen flex items-center justify-center transition-colors">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

      </div>

      <div className="relative z-10 mt-12 flex items-center gap-3 px-6 py-3 rounded-xl bg-paper border border-forest/15 text-forest text-xs">
        <Send className="w-4 h-4 text-burgundy" />
        В каждом приложении есть встроенная кнопка <span className="text-ink font-medium">«Отправить на печать»</span> в Telegram-бот или Email.
      </div>
    </div>
  );
}
