import React, { useState } from 'react';
import { Eye, Waves, Sparkles, X } from 'lucide-react';
import { soundEngine } from '../utils/soundscape';

interface SceneItem {
  id: string;
  title: string;
  lyricSnippet: string;
  imageSrc: string;
  aspect: string;
  tag: string;
  description: string;
  colorName: string;
  colorHex: string;
}

const SCENES: SceneItem[] = [
  {
    id: 'scene-ocean',
    title: '眩しい空のその向こう',
    lyricSnippet: 'ラララ 君と行こう 僕らの夏が待っている',
    imageSrc: '/src/assets/images/crystalline_blue_sea_1792126913871.jpg',
    aspect: 'aspect-video',
    tag: '碧海・水平線',
    description: '底まで透き通る群青とエメラルドの海。太陽の光が水底の白砂に網目のような光の幾何学模様を刻み、果てしない水平線へと繋がっていく。',
    colorName: '結晶海藍 (Cerulean Azure)',
    colorHex: '#0284c7',
  },
  {
    id: 'scene-terrace',
    title: '風渡る丘のテラス',
    lyricSnippet: '駅前の風がシャツを揺らす 雲の切れ間に昼顔が笑う',
    imageSrc: '/src/assets/images/summer_sky_breeze_1792126914377.jpg',
    aspect: 'aspect-4/3',
    tag: '夏の静寂・潮風',
    description: '畳の敷かれた縁側から臨む紺碧の海と入道雲。レースのカーテンが海風に揺れ、涼やかな木陰で静かに時間を忘れられる場所。',
    colorName: '白砂空青 (Sky & Foam)',
    colorHex: '#38bdf8',
  },
  {
    id: 'scene-caustics',
    title: '水面が跳ねる川沿いの道',
    lyricSnippet: '川沿いの道 水面が跳ねる アイスの棒 おみくじみたいに',
    imageSrc: '/src/assets/images/crystal_water_surface_1792126914670.jpg',
    aspect: 'aspect-square',
    tag: '波光・透明感',
    description: '太陽の反射光がガラス細工のように煌めく水面。透き通る浅瀬に小さな波紋が広がり、触れるとひんやりと心地よい夏の冷たさを伝える。',
    colorName: '水浅葱 (Aqua Crystalline)',
    colorHex: '#06b6d4',
  },
];

export const SummerScenesGallery: React.FC = () => {
  const [selectedScene, setSelectedScene] = useState<SceneItem | null>(null);

  const handleSceneClick = (scene: SceneItem) => {
    setSelectedScene(scene);
    soundEngine.triggerWaterRippleSound();
  };

  return (
    <section id="gallery-section" className="w-full max-w-6xl mx-auto px-4 py-16 relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-300 tracking-wider">
          <Waves className="w-3.5 h-3.5 text-sky-500" />
          <span>青い記憶の情景</span>
          <span aria-hidden="true">·</span>
          <span>VISUAL VIGNETTES</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
          透明な夏のフラグメント
        </h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          楽曲に散りばめられた「海風」「水面の跳ねる光」「遠くの青」。
          透き通る色彩で切り取った3つの情景です。
        </p>
      </div>

      {/* Grid of Scenes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {SCENES.map((scene) => (
          <div
            key={scene.id}
            onClick={() => handleSceneClick(scene)}
            className="group relative backdrop-blur-md bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-white/70 dark:border-sky-500/20 overflow-hidden shadow-lg shadow-sky-950/5 hover:shadow-xl hover:shadow-sky-500/15 hover:border-sky-300 transition-all duration-300 cursor-pointer flex flex-col"
          >
            {/* Image Container with Fallback */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-sky-100 dark:bg-slate-800">
              <img
                src={scene.imageSrc}
                alt={scene.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  // Fallback container
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Tag chip */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md text-[11px] font-medium text-slate-800 dark:text-sky-200 border border-white/50">
                {scene.tag}
              </div>

              {/* Preview icon */}
              <div className="absolute bottom-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-sky-700 dark:text-sky-300 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                <Eye className="w-4 h-4" />
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <p className="text-xs font-mono text-sky-600 dark:text-sky-400 mb-1">
                  {scene.colorName}
                </p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                  {scene.title}
                </h3>
                <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-1">
                  「{scene.lyricSnippet}」
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-3 leading-relaxed">
                  {scene.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-sky-100/60 dark:border-sky-900/40 flex items-center justify-between text-xs font-medium text-sky-700 dark:text-sky-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  詳しく見る
                </span>
                <span className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: scene.colorHex }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog for Scene Detail */}
      {selectedScene && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
          onClick={() => setSelectedScene(null)}
        >
          <div
            className="relative w-full max-w-2xl backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 rounded-3xl border border-white/80 dark:border-sky-500/30 shadow-2xl overflow-hidden p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedScene(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 bg-slate-100">
              <img
                src={selectedScene.imageSrc}
                alt={selectedScene.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200">
                  {selectedScene.tag}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {selectedScene.colorName}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {selectedScene.title}
              </h3>

              <blockquote className="p-3 bg-sky-50 dark:bg-slate-800/60 rounded-xl text-sky-900 dark:text-sky-200 text-sm italic border-l-2 border-sky-400">
                「{selectedScene.lyricSnippet}」
              </blockquote>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedScene.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
