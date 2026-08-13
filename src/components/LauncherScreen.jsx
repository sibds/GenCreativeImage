import React from 'react';
import { Shield, Grid, Sparkles, ArrowRight, Palette, Award, Feather, Send } from 'lucide-react';

export default function LauncherScreen({ onSelectApp }) {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-600/15 via-rose-600/10 to-emerald-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Title Header */}
      <div className="relative z-10 max-w-4xl text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Единый стартовый центр генерации
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
          Творческое наследие <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-emerald-300">
            Рода и Прикамья
          </span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-sans font-light leading-relaxed">
          Выберите приложение для генерации цифрового искусства на базе движка <span className="text-amber-300 font-medium">OpenRoad AI</span>. Создайте свой семейный герб или традиционный 2D орнамент с возможностью мгновенной отправки на печать в Telegram-бот.
        </p>
      </div>

      {/* App Choice Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        
        {/* App 1 Card: Family Crest Generator */}
        <div
          onClick={() => onSelectApp('crest')}
          className="group relative rounded-3xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 shadow-2xl hover:shadow-amber-500/20 backdrop-blur-xl overflow-hidden flex flex-col justify-between"
        >
          {/* Subtle card background pattern */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />

          <div>
            {/* Icon Header */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-600 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Shield className="w-9 h-9 text-slate-950" />
            </div>

            <div className="inline-block px-3 py-1 rounded-md bg-amber-400/10 text-amber-300 text-xs font-medium mb-3">
              Приложение 1
            </div>

            <h2 className="font-serif text-2xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
              Генерация герба своей семьи
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Создайте величественный геральдический герб рода с символом тотемного животного, народными узорами и стихией.
            </p>

            {/* Feature tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-amber-400" /> 10 животных
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-rose-400" /> 6 народностей
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> 4 стихии
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
            <span className="text-xs text-amber-300/80 font-medium">Запустить геральдику</span>
            <div className="w-10 h-10 rounded-full bg-amber-500/20 group-hover:bg-amber-500 text-amber-300 group-hover:text-slate-950 flex items-center justify-center transition-all">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* App 2 Card: Kama Ornament Generator */}
        <div
          onClick={() => onSelectApp('ornament')}
          className="group relative rounded-3xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 shadow-2xl hover:shadow-emerald-500/20 backdrop-blur-xl overflow-hidden flex flex-col justify-between"
        >
          {/* Background aura */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />

          <div>
            {/* Icon Header */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-rose-700 to-amber-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <Grid className="w-9 h-9 text-white" />
            </div>

            <div className="inline-block px-3 py-1 rounded-md bg-emerald-400/10 text-emerald-300 text-xs font-medium mb-3">
              Приложение 2
            </div>

            <h2 className="font-serif text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
              Генерация орнамента Прикамья
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Традиционный 2D орнамент народов Прикамья без людей, с четкими геометрическими контурами в палитре охра, белый, тёмно-зеленый и бордовый.
            </p>

            {/* Feature tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" /> Традиционная палитра
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs">
                Ромб (плодородие)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs">
                Волна (жизнь/вода)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs">
                Крест (ось мира)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
            <span className="text-xs text-emerald-300/80 font-medium">Запустить геометрию узора</span>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 text-emerald-300 group-hover:text-slate-950 flex items-center justify-center transition-all">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

      </div>

      {/* Footer Banner */}
      <div className="relative z-10 mt-12 flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
        <Send className="w-4 h-4 text-rose-400" />
        В каждом приложении есть встроенная кнопка <span className="text-white font-medium">«Отправить на печать»</span> в Telegram-бот или Email.
      </div>
    </div>
  );
}
