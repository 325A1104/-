import React, { useState } from 'react';
import { Palette, Check, Copy } from 'lucide-react';
import { soundEngine } from '../utils/soundscape';

interface ColorSwatch {
  name: string;
  enName: string;
  hex: string;
  rgb: string;
  description: string;
  source: string;
}

const PALETTE: ColorSwatch[] = [
  {
    name: '結晶空青',
    enName: 'Crystalline Sky Blue',
    hex: '#38bdf8',
    rgb: 'rgb(56, 189, 248)',
    description: '見上げた入道雲の隙間から差す、眩しく透明な真夏の空の青。',
    source: '空と光のグラデーション',
  },
  {
    name: '紺碧の浅瀬',
    enName: 'Cerulean Azure',
    hex: '#0284c7',
    rgb: 'rgb(2, 132, 199)',
    description: '澄みきった南国の海のように、深く吸い込まれそうな青。',
    source: 'IMG_0591 海のコントラスト',
  },
  {
    name: '水浅葱の波光',
    enName: 'Aqua Caustic Cyan',
    hex: '#06b6d4',
    rgb: 'rgb(6, 182, 212)',
    description: '波が跳ねるたびにきらめく、淡く透き通るエメラルドシアン。',
    source: '水面のきらめきと光線',
  },
  {
    name: '白砂光',
    enName: 'Sunlit Foam White',
    hex: '#f0f9ff',
    rgb: 'rgb(240, 249, 255)',
    description: '太陽光を反射して白く輝く波頭と、ガラスのような砂浜。',
    source: 'IMG_0386 拡散する白い光の粒子',
  },
  {
    name: '澄明群青',
    enName: 'Deep Horizon Navy',
    hex: '#0c4a6e',
    rgb: 'rgb(12, 74, 110)',
    description: '水平線の向こう側に広がる、穏やかで静謐な深みのある青。',
    source: '彼方の水平線と岩陰',
  },
];

export const ColorPaletteSpecimen: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    soundEngine.triggerWaterRippleSound();
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <section id="colors-section" className="w-full max-w-5xl mx-auto px-4 py-16 relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-300 tracking-wider">
          <Palette className="w-3.5 h-3.5 text-sky-500" />
          <span>色彩標本</span>
          <span aria-hidden="true">·</span>
          <span>COLOR HARMONY</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
          澄み渡る夏のパレット
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          海と空の写真、そして舞い散る光の粒子から抽出された、透明感と落ち着きのある色彩構成です。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {PALETTE.map((color) => {
          const isCopied = copiedHex === color.hex;
          return (
            <div
              key={color.hex}
              onClick={() => handleCopy(color.hex)}
              className="group backdrop-blur-md bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-white/70 dark:border-sky-500/20 p-4 shadow-sm hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Color Block */}
                <div
                  className="w-full h-24 rounded-xl shadow-inner mb-3 transition-transform duration-300 group-hover:scale-98 border border-black/5"
                  style={{ backgroundColor: color.hex }}
                />

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {color.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {color.hex}
                  </span>
                </div>
                <p className="text-[11px] text-sky-700 dark:text-sky-300 font-medium">
                  {color.enName}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {color.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-sky-100/50 dark:border-sky-900/30 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[10px]">{color.source}</span>
                <span className="flex items-center gap-1 text-sky-600 dark:text-sky-300 font-medium text-[11px]">
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      コピー済
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      HEX
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
