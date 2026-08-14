import React from 'react';
import { Shield, Grid, ArrowRight, Palette, Award, Feather, Send } from 'lucide-react';
import UiOrnament from './ornament/UiOrnament';

export default function LauncherScreen({ onSelectApp, kiosk = false }) {
  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden ${
      kiosk ? 'h-full p-4' : 'min-h-[calc(100vh-80px)] p-6'
    }`}>

      <div className={`relative z-10 max-w-4xl text-center animate-fade-in ${kiosk ? 'mb-6' : 'mb-12'}`}>
        <h1 className={`font-serif font-bold tracking-tight text-ink mb-3 leading-tight ${
          kiosk ? 'text-3xl lg:text-4xl' : 'text-4xl sm:text-5xl md:text-6xl'
        }`}>
          Творческое наследие <br />
          <span className="text-charcoal">
            рода и Прикамья
          </span>
        </h1>

        <UiOrnament variant="h1" className={`mx-auto ${kiosk ? 'mb-3' : 'mb-6'}`} />

        <p className={`text-forest max-w-2xl mx-auto font-sans font-light leading-relaxed ${
          kiosk ? 'text-sm' : 'text-base sm:text-lg'
        }`}>
          Выберите приложение для генерации цифрового искусства. Создайте свой семейный герб или традиционный 2D орнамент с возможностью отправки на печать.
        </p>
      </div>

      <div className={`relative z-10 grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full min-h-0 ${
        kiosk ? 'gap-4' : 'gap-8'
      }`}>
        
        <div
          onClick={() => onSelectApp('crest')}
          className={`group relative rounded-2xl paper-card border border-ochre/35 hover:border-ochre cursor-pointer transition-colors overflow-hidden flex flex-col justify-between ${
            kiosk ? 'p-5' : 'p-8'
          }`}
        >
          <UiOrnament variant="h2" className={`mx-auto ${kiosk ? 'mb-3' : 'mb-5'}`} />

          <div>
            <div className={`rounded-xl bg-charcoal flex items-center justify-center ${kiosk ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-6'}`}>
              <Shield className={kiosk ? 'w-7 h-7 text-linen' : 'w-9 h-9 text-linen'} />
            </div>

            <h2 className={`font-serif font-bold text-ink group-hover:text-charcoal transition-colors ${
              kiosk ? 'text-xl mb-2' : 'text-2xl mb-3'
            }`}>
              Генерация герба своей семьи
            </h2>

            <p className={`text-forest text-sm leading-relaxed ${kiosk ? 'mb-3' : 'mb-6'}`}>
              Создайте величественный геральдический герб рода с символом тотемного животного, народными узорами и стихией.
            </p>

            <div className={`flex flex-wrap gap-2 ${kiosk ? 'mb-4' : 'mb-8'}`}>
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

          <div className="flex items-center justify-between pt-4 border-t border-forest/15">
            <span className="text-xs text-ochre font-medium">Запустить геральдику</span>
            <div className="w-10 h-10 rounded-lg bg-ochre/20 group-hover:bg-ochre text-charcoal flex items-center justify-center transition-colors">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        <div
          onClick={() => onSelectApp('ornament')}
          className={`group relative rounded-2xl paper-card border border-forest/30 hover:border-forest cursor-pointer transition-colors overflow-hidden flex flex-col justify-between ${
            kiosk ? 'p-5' : 'p-8'
          }`}
        >
          <UiOrnament variant="h2" className={`mx-auto ${kiosk ? 'mb-3' : 'mb-5'}`} />

          <div>
            <div className={`rounded-xl bg-burgundy flex items-center justify-center ${kiosk ? 'w-12 h-12 mb-3' : 'w-16 h-16 mb-6'}`}>
              <Grid className={kiosk ? 'w-7 h-7 text-linen' : 'w-9 h-9 text-linen'} />
            </div>

            <h2 className={`font-serif font-bold text-ink group-hover:text-charcoal transition-colors ${
              kiosk ? 'text-xl mb-2' : 'text-2xl mb-3'
            }`}>
              Генерация орнамента Прикамья
            </h2>

            <p className={`text-forest text-sm leading-relaxed ${kiosk ? 'mb-3' : 'mb-6'}`}>
              Традиционный 2D орнамент народов Прикамья без людей, с четкими геометрическими контурами в палитре охра, белый, тёмно-зеленый и бордовый.
            </p>

            <div className={`flex flex-wrap gap-2 ${kiosk ? 'mb-4' : 'mb-8'}`}>
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

          <div className="flex items-center justify-between pt-4 border-t border-forest/15">
            <span className="text-xs text-forest font-medium">Запустить геометрию узора</span>
            <div className="w-10 h-10 rounded-lg bg-forest/15 group-hover:bg-forest text-forest group-hover:text-linen flex items-center justify-center transition-colors">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

      </div>

      <div className={`relative z-10 flex items-center gap-3 px-6 py-3 rounded-xl bg-paper border border-forest/15 text-forest text-xs ${
        kiosk ? 'mt-6' : 'mt-12'
      }`}>
        <Send className="w-4 h-4 text-burgundy" />
        В каждом приложении есть встроенная кнопка <span className="text-ink font-medium">«Отправить на печать»</span>.
      </div>
    </div>
  );
}
