import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/soundscape';

export const Header: React.FC = () => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const toggleSoundscape = async () => {
    if (isPlayingSound) {
      soundEngine.stop();
      setIsPlayingSound(false);
    } else {
      await soundEngine.start();
      setIsPlayingSound(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/60 dark:bg-slate-900/60 border-b border-sky-100/60 dark:border-sky-900/30">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-sky-950 dark:text-sky-50 whitespace-nowrap shrink-0"
        >
          青い季節の真ん中へ
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#lyrics-section"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            歌詞プレイヤー
          </a>
          <a
            href="#gallery-section"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            情景ギャラリー
          </a>
          <a
            href="#mixer-section"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            音の調合
          </a>
          <a
            href="#colors-section"
            className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0"
          >
            色彩標本
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSoundscape}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 rounded-xl shadow-md shadow-sky-500/20 active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            {isPlayingSound ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>サウンド停止</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>清涼サウンド再生</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
