import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, SkipBack, SkipForward, Music, Upload, Sparkles } from 'lucide-react';
import { SONG_LYRICS, SONG_METADATA, JUMP_SECTIONS } from '../data/lyrics';
import { formatTime, getActiveLyricIndex, calculateProgress, progressToTime } from '../utils/lyric-timing';
import { soundEngine } from '../utils/soundscape';
import { AudioVisualizer } from './AudioVisualizer';

export const SyncedLyricPlayer: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'focused' | 'full'>('focused');
  const [customAudioName, setCustomAudioName] = useState<string | null>(null);
  const [isAmbientActive, setIsAmbientActive] = useState<boolean>(true);

  const duration = SONG_METADATA.duration;
  const activeIndex = getActiveLyricIndex(SONG_LYRICS, currentTime);
  const currentLyric = SONG_LYRICS[activeIndex] || SONG_LYRICS[0];

  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeLyricRef = useRef<HTMLDivElement | null>(null);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      const customAudio = soundEngine.getCustomAudio();

      if (customAudio && customAudio.src && !customAudio.paused) {
        // Sync directly to custom audio element
        const updateFromAudio = () => {
          if (!customAudio.paused) {
            setCurrentTime(customAudio.currentTime);
            timerRef.current = requestAnimationFrame(updateFromAudio);
          }
        };
        timerRef.current = requestAnimationFrame(updateFromAudio);
      } else {
        // Simulation / demo timer (synced to 1000ms clock)
        const interval = window.setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= duration) {
              setIsPlaying(false);
              return 0;
            }
            return prev + 0.25;
          });
        }, 250);
        return () => window.clearInterval(interval);
      }
    }

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isPlaying, duration]);

  // Auto scroll lyric into view in full mode
  useEffect(() => {
    if (activeTab === 'full' && activeLyricRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex, activeTab]);

  const togglePlay = async () => {
    const customAudio = soundEngine.getCustomAudio();

    if (!isPlaying) {
      if (isAmbientActive) {
        await soundEngine.start();
      }
      if (customAudio && customAudio.src) {
        customAudio.currentTime = currentTime;
        customAudio.play().catch(() => {});
      }
      setIsPlaying(true);
    } else {
      if (customAudio && customAudio.src) {
        customAudio.pause();
      }
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    const newTime = progressToTime(newProgress, duration);
    setCurrentTime(newTime);

    const customAudio = soundEngine.getCustomAudio();
    if (customAudio && customAudio.src) {
      customAudio.currentTime = newTime;
    }
  };

  const handleJump = (time: number) => {
    setCurrentTime(time);
    const customAudio = soundEngine.getCustomAudio();
    if (customAudio && customAudio.src) {
      customAudio.currentTime = time;
    }
    soundEngine.triggerWaterRippleSound();
  };

  const handleSkip = (deltaSeconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + deltaSeconds));
    setCurrentTime(newTime);
    const customAudio = soundEngine.getCustomAudio();
    if (customAudio && customAudio.src) {
      customAudio.currentTime = newTime;
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    const customAudio = soundEngine.getCustomAudio();
    if (customAudio && customAudio.src) {
      customAudio.currentTime = 0;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      soundEngine.setVolume('master', 0.8);
      setIsMuted(false);
    } else {
      soundEngine.setVolume('master', 0);
      setIsMuted(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await soundEngine.loadUserAudio(file);
      setCustomAudioName(file.name);
      setCurrentTime(0);
      setIsPlaying(false);
    } catch {
      alert('音声ファイルの読み込みに失敗しました。');
    }
  };

  const toggleAmbientSound = async () => {
    const next = !isAmbientActive;
    setIsAmbientActive(next);
    if (next && isPlaying) {
      await soundEngine.start();
    } else if (!next) {
      soundEngine.setVolume('waves', 0);
      soundEngine.setVolume('breeze', 0);
      soundEngine.setVolume('chimes', 0);
      soundEngine.setVolume('chords', 0);
    } else {
      soundEngine.setVolume('waves', 0.6);
      soundEngine.setVolume('breeze', 0.4);
      soundEngine.setVolume('chimes', 0.5);
      soundEngine.setVolume('chords', 0.5);
    }
  };

  return (
    <div id="lyrics-section" className="w-full max-w-4xl mx-auto px-4 py-8 relative z-10">
      {/* Player Card Container with Glassmorphism */}
      <div className="relative backdrop-blur-xl bg-white/45 dark:bg-slate-900/40 rounded-3xl border border-white/70 dark:border-sky-400/20 shadow-[0_16px_48px_-8px_rgba(2,132,199,0.15)] overflow-hidden transition-all duration-300">
        {/* Subtle decorative crystal gradient sheen */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-300 to-transparent opacity-80" />

        {/* Top Header Row of Player */}
        <div className="p-6 md:p-8 border-b border-sky-100/60 dark:border-sky-900/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-sky-700 dark:text-sky-300 tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>サマーソング・エクスペリエンス</span>
                <span aria-hidden="true">·</span>
                <span>BPM 118</span>
                <span aria-hidden="true">·</span>
                <span>爽快な海風と透明な青</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mt-1">
                {SONG_METADATA.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {SONG_METADATA.subtitle}
              </p>
            </div>

            {/* Custom Audio Upload Button */}
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload-input"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-sky-800 dark:text-sky-200 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-sky-200/70 dark:border-sky-700/50 rounded-xl transition-all shadow-sm whitespace-nowrap"
                title="自分のダウンロードした曲ファイルを読み込む"
              >
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>{customAudioName ? '曲変更: ' + customAudioName.slice(0, 10) + '…' : '音源ファイルを読込'}</span>
              </button>

              <button
                onClick={toggleAmbientSound}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-all whitespace-nowrap ${
                  isAmbientActive
                    ? 'bg-sky-500/15 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-500/40'
                    : 'bg-slate-100/60 text-slate-500 border-slate-200'
                }`}
                title="清涼な波風アンビエント音を重ねて再生"
              >
                <Music className="w-3.5 h-3.5 text-sky-500" />
                <span>{isAmbientActive ? '波風アンビエント: ON' : '波風アンビエント: OFF'}</span>
              </button>
            </div>
          </div>

          {/* Audio Visualizer Strip */}
          <div className="mt-5 pt-4 border-t border-sky-100/40 dark:border-sky-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <AudioVisualizer isPlaying={isPlaying} />
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <span className="font-medium text-sky-800 dark:text-sky-300">{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Progress Timeline Scrubber */}
          <div className="mt-3">
            <label htmlFor="lyric-progress" className="sr-only">再生シークバー</label>
            <input
              id="lyric-progress"
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={calculateProgress(currentTime, duration)}
              onChange={handleSeek}
              className="w-full h-1.5 bg-sky-200/60 dark:bg-sky-950/60 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Player Transport Controls */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleRestart}
                className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:bg-sky-50/80 dark:hover:bg-slate-800 transition-colors"
                aria-label="最初から再生"
                title="最初から"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSkip(-5)}
                className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:bg-sky-50/80 dark:hover:bg-slate-800 transition-colors"
                aria-label="5秒巻き戻し"
                title="5秒戻る"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white shadow-md shadow-sky-500/25 transition-transform active:scale-95"
                aria-label={isPlaying ? '一時停止' : '再生'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => handleSkip(5)}
                className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:bg-sky-50/80 dark:hover:bg-slate-800 transition-colors"
                aria-label="5秒早送り"
                title="5秒進む"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 p-1 bg-sky-100/60 dark:bg-slate-800/60 rounded-xl border border-sky-200/50">
                <button
                  onClick={() => setActiveTab('focused')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                    activeTab === 'focused'
                      ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-sky-200 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  情景フォーカス
                </button>
                <button
                  onClick={() => setActiveTab('full')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                    activeTab === 'full'
                      ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-sky-200 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  歌詞全行一覧
                </button>
              </div>

              {/* Mute button */}
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-sky-600 hover:bg-sky-50/80 dark:hover:bg-slate-800 transition-colors"
                aria-label={isMuted ? 'ミュート解除' : 'ミュート'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Section Quick Jump Bar */}
        <div className="px-6 py-3 bg-sky-50/50 dark:bg-slate-800/30 border-b border-sky-100/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">チャプター:</span>
          {JUMP_SECTIONS.map((sec) => {
            const isActive = currentTime >= sec.time && currentTime < (sec.time + 30);
            return (
              <button
                key={sec.label}
                onClick={() => handleJump(sec.time)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-white/80 dark:bg-slate-800/80 text-sky-900 dark:text-sky-200 border border-sky-100 hover:border-sky-300'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Content Area: Focused Scene Card vs Full Lyrics List */}
        <div className="p-6 md:p-8 min-h-[280px]">
          {activeTab === 'focused' ? (
            <div className="flex flex-col items-center justify-center text-center py-4">
              {/* Active Lyric Display */}
              <div className="inline-block px-3 py-1 rounded-full text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-100/60 dark:bg-sky-900/30 mb-3">
                {currentLyric.sceneTitle}
              </div>

              <p className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-relaxed max-w-2xl">
                {currentLyric.text}
              </p>

              {currentLyric.subtext && (
                <p className="text-sm md:text-base text-sky-700/80 dark:text-sky-300/80 mt-2 font-normal italic">
                  {currentLyric.subtext}
                </p>
              )}

              {/* Poetic scene atmosphere box */}
              <div className="mt-6 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/80 dark:border-sky-500/20 max-w-xl text-center">
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentLyric.sceneDescription}
                </p>
              </div>
            </div>
          ) : (
            <div className="max-h-[380px] overflow-y-auto pr-2 space-y-3 scroll-smooth">
              {SONG_LYRICS.map((line, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <div
                    key={line.id}
                    ref={isCurrent ? activeLyricRef : null}
                    onClick={() => handleJump(line.time)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                      isCurrent
                        ? 'bg-gradient-to-r from-sky-500/15 to-cyan-500/15 border-sky-400/60 shadow-sm text-slate-900 dark:text-white'
                        : 'bg-white/30 dark:bg-slate-800/30 border-transparent hover:bg-white/60 hover:border-sky-200/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-mono tabular-nums ${isCurrent ? 'text-sky-700 dark:text-sky-300 font-bold' : 'text-slate-400'}`}>
                        {formatTime(line.time)}
                      </span>
                      <span className="text-[11px] opacity-75">{line.sceneTitle}</span>
                    </div>
                    <p className={`text-base md:text-lg ${isCurrent ? 'font-bold text-sky-900 dark:text-sky-100' : 'font-medium'}`}>
                      {line.text}
                    </p>
                    {line.subtext && (
                      <p className="text-xs opacity-70 mt-0.5">{line.subtext}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
