import React, { useState } from 'react';
import { Sliders, Volume2, Wind, Sparkles, RefreshCw } from 'lucide-react';
import { soundEngine } from '../utils/soundscape';

export const SoundMixer: React.FC = () => {
  const [volumes, setVolumes] = useState(soundEngine.getVolumes());
  const [activePreset, setActivePreset] = useState<string>('balanced');

  const updateVol = (channel: 'master' | 'waves' | 'breeze' | 'chimes' | 'chords', val: number) => {
    soundEngine.setVolume(channel, val);
    setVolumes(soundEngine.getVolumes());
    setActivePreset('custom');
  };

  const applyPreset = (preset: 'quiet' | 'breezy' | 'balanced') => {
    setActivePreset(preset);
    if (preset === 'quiet') {
      soundEngine.setVolume('master', 0.7);
      soundEngine.setVolume('waves', 0.7);
      soundEngine.setVolume('breeze', 0.2);
      soundEngine.setVolume('chimes', 0.3);
      soundEngine.setVolume('chords', 0.2);
    } else if (preset === 'breezy') {
      soundEngine.setVolume('master', 0.85);
      soundEngine.setVolume('waves', 0.4);
      soundEngine.setVolume('breeze', 0.7);
      soundEngine.setVolume('chimes', 0.6);
      soundEngine.setVolume('chords', 0.3);
    } else {
      soundEngine.setVolume('master', 0.8);
      soundEngine.setVolume('waves', 0.6);
      soundEngine.setVolume('breeze', 0.4);
      soundEngine.setVolume('chimes', 0.5);
      soundEngine.setVolume('chords', 0.5);
    }
    setVolumes(soundEngine.getVolumes());
  };

  return (
    <section id="mixer-section" className="w-full max-w-4xl mx-auto px-4 py-12 relative z-10">
      <div className="backdrop-blur-xl bg-white/45 dark:bg-slate-900/40 rounded-3xl border border-white/70 dark:border-sky-500/20 p-6 md:p-8 shadow-lg shadow-sky-950/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-300 tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-sky-500" />
              <span>清涼な音の調合</span>
              <span aria-hidden="true">·</span>
              <span>SOUNDSCAPE MIXER</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              夏の環境音ミキサー
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              波音や風、風鈴の響きを自由に調節して、あなただけの安らぐ空間を作れます。
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-sky-100/60 dark:bg-slate-800/60 rounded-xl border border-sky-200/50">
            <button
              onClick={() => applyPreset('quiet')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activePreset === 'quiet'
                  ? 'bg-white dark:bg-slate-700 text-sky-900 dark:text-sky-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              静寂の波打ち際
            </button>
            <button
              onClick={() => applyPreset('breezy')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activePreset === 'breezy'
                  ? 'bg-white dark:bg-slate-700 text-sky-900 dark:text-sky-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              海風の午後
            </button>
            <button
              onClick={() => applyPreset('balanced')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activePreset === 'balanced'
                  ? 'bg-white dark:bg-slate-700 text-sky-900 dark:text-sky-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              透き通る夏
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Waves */}
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/30 border border-white/60 dark:border-sky-900/30">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Volume2 className="w-4 h-4 text-sky-500" />
                波の音 (Ocean Waves)
              </span>
              <span className="font-mono text-sky-700 dark:text-sky-300 tabular-nums">
                {Math.round(volumes.waves * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volumes.waves}
              onChange={(e) => updateVol('waves', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-sky-200/60 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

          {/* Breeze */}
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/30 border border-white/60 dark:border-sky-900/30">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Wind className="w-4 h-4 text-cyan-500" />
                夏の風 (Sea Breeze)
              </span>
              <span className="font-mono text-cyan-700 dark:text-cyan-300 tabular-nums">
                {Math.round(volumes.breeze * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volumes.breeze}
              onChange={(e) => updateVol('breeze', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-sky-200/60 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Chimes */}
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/30 border border-white/60 dark:border-sky-900/30">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Sparkles className="w-4 h-4 text-sky-400" />
                風鈴・クリスタル (Wind Chimes)
              </span>
              <span className="font-mono text-sky-700 dark:text-sky-300 tabular-nums">
                {Math.round(volumes.chimes * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volumes.chimes}
              onChange={(e) => updateVol('chimes', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-sky-200/60 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* Ambient Chords */}
          <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/30 border border-white/60 dark:border-sky-900/30">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <RefreshCw className="w-4 h-4 text-sky-600" />
                ピアノ・和音 (Harmonic Chords)
              </span>
              <span className="font-mono text-sky-700 dark:text-sky-300 tabular-nums">
                {Math.round(volumes.chords * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volumes.chords}
              onChange={(e) => updateVol('chords', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-sky-200/60 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
