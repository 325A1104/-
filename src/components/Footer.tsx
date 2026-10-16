import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-sky-100/60 dark:border-sky-900/30 backdrop-blur-md bg-white/40 dark:bg-slate-950/40 relative z-10 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            青い季節の真ん中へ
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
            「眩しい空のその向こう、僕らの夏が待っている」—— 透明な色彩と風の記憶に包まれるWeb体験。
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <a href="#lyrics-section" className="hover:text-sky-600 transition-colors">
            歌詞
          </a>
          <a href="#gallery-section" className="hover:text-sky-600 transition-colors">
            情景
          </a>
          <a href="#mixer-section" className="hover:text-sky-600 transition-colors">
            音の調合
          </a>
          <a href="#colors-section" className="hover:text-sky-600 transition-colors">
            色彩標本
          </a>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-sky-100 dark:border-sky-800 transition-all text-sky-700 dark:text-sky-300 ml-2"
            aria-label="ページ先頭へ戻る"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[11px]">先頭へ</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-sky-100/40 dark:border-sky-900/20 text-center md:text-left text-[11px] text-slate-400">
        © 2026 青い季節の真ん中へ · All rights reserved.
      </div>
    </footer>
  );
};
