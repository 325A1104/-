import React from 'react';
import { Play, Sparkles, Compass, Wind } from 'lucide-react';
import { soundEngine } from '../utils/soundscape';

export const Hero: React.FC = () => {
  const handleStartExperience = async () => {
    await soundEngine.start();
    const target = document.getElementById('lyrics-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 pt-12 pb-16 z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Atmospheric Typography */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border border-white/80 dark:border-sky-500/30 text-xs font-semibold text-sky-800 dark:text-sky-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>澄みきった青の世界へ</span>
            <span aria-hidden="true">·</span>
            <span>SUMMER ANTHEM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
            青い季節の<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-400">
              真ん中へ
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
            駅前の風がシャツを揺らし、水面が跳ねる川沿いの道。
            <br className="hidden sm:inline" />
            澄んだ青空と透明な海風に包まれ、今日という一歩を踏み出すための特別な場所。
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleStartExperience}
              className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 rounded-2xl shadow-lg shadow-sky-500/25 active:scale-95 transition-all whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>曲と歌詞を再生する</span>
            </button>

            <a
              href="#gallery-section"
              className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-sky-900 dark:text-sky-200 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800 border border-white/80 dark:border-sky-700/40 rounded-2xl backdrop-blur-md transition-all whitespace-nowrap"
            >
              <Compass className="w-4 h-4 text-sky-600" />
              <span>情景を巡る</span>
            </a>
          </div>

          {/* Quote Card */}
          <div className="p-4 rounded-2xl backdrop-blur-md bg-white/40 dark:bg-slate-900/30 border border-white/60 dark:border-sky-500/20 max-w-lg">
            <p className="text-xs sm:text-sm text-sky-950 dark:text-sky-100 italic leading-relaxed">
              「眩しい空のその向こう 僕らの夏が待っている……少し痛くて、少し不器用。それでも今日を好きでいたい」
            </p>
          </div>
        </div>

        {/* Right Column: High Fidelity Translucent Image Frame */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden backdrop-blur-lg bg-white/30 dark:bg-slate-900/30 p-2 border border-white/70 dark:border-sky-500/30 shadow-2xl shadow-sky-950/10">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sky-100 dark:bg-slate-800">
              <img
                src="/src/assets/images/crystalline_blue_sea_1792126913871.jpg"
                alt="透明感あふれる結晶の青い海"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-white/60 dark:border-sky-500/20 shadow-md">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-sky-500" />
                    透明な潮風と水面
                  </span>
                  <span className="text-sky-600 dark:text-sky-400 font-mono text-[11px]">#0284c7</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5 truncate">
                  遠くの青に目を向けて、今日は今日から始めよう
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Item Unboxed Metadata Strip */}
      <div className="mt-14 pt-6 border-t border-sky-100/60 dark:border-sky-900/40 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">楽曲キー</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono">G Major / E Minor</span>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">テンポ</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums">118 BPM</span>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">色彩構成</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">結晶空青 × 紺碧</span>
        </div>
        <div>
          <span className="text-[11px] font-medium text-slate-400 block">楽曲の主題</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">海風・水面・夏空</span>
        </div>
      </div>
    </section>
  );
};
