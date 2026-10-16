/**
 * Web Audio API synthesizer for calm summer soundscape & local audio playback.
 * Provides waves, sea breeze, wind chimes, electric piano ambient chords, and frequency analysis.
 */

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Sound channels
  private waveGain: GainNode | null = null;
  private breezeGain: GainNode | null = null;
  private chimeGain: GainNode | null = null;
  private chordGain: GainNode | null = null;

  // Active timers / intervals
  private waveInterval: number | null = null;
  private chimeInterval: number | null = null;
  private chordInterval: number | null = null;

  // State
  private isRunning: boolean = false;
  private customAudio: HTMLAudioElement | null = null;
  private customAudioSource: MediaElementAudioSourceNode | null = null;

  private volumes = {
    master: 0.8,
    waves: 0.6,
    breeze: 0.4,
    chimes: 0.5,
    chords: 0.5,
  };

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.82;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volumes.master;

      this.waveGain = this.ctx.createGain();
      this.waveGain.gain.value = this.volumes.waves;

      this.breezeGain = this.ctx.createGain();
      this.breezeGain.gain.value = this.volumes.breeze;

      this.chimeGain = this.ctx.createGain();
      this.chimeGain.gain.value = this.volumes.chimes;

      this.chordGain = this.ctx.createGain();
      this.chordGain.gain.value = this.volumes.chords;

      // Connect channel gains to master
      this.waveGain.connect(this.masterGain);
      this.breezeGain.connect(this.masterGain);
      this.chimeGain.connect(this.masterGain);
      this.chordGain.connect(this.masterGain);

      // Connect master to analyser and destination
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public async start() {
    this.initContext();
    if (!this.ctx || this.isRunning) return;

    this.isRunning = true;
    this.startBreeze();
    this.startWaves();
    this.startChimes();
    this.startChords();
  }

  public stop() {
    this.isRunning = false;
    if (this.waveInterval) window.clearInterval(this.waveInterval);
    if (this.chimeInterval) window.clearInterval(this.chimeInterval);
    if (this.chordInterval) window.clearInterval(this.chordInterval);
    this.waveInterval = null;
    this.chimeInterval = null;
    this.chordInterval = null;

    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  // --- Ocean Waves Synthesizer ---
  private startWaves() {
    if (!this.ctx || !this.waveGain) return;

    const playWaveCycle = () => {
      if (!this.ctx || !this.waveGain || !this.isRunning) return;

      const bufferSize = this.ctx.sampleRate * 5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink noise algorithm
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const now = this.ctx.currentTime;
      filter.frequency.setValueAtTime(140, now);
      filter.frequency.linearRampToValueAtTime(450, now + 2.2);
      filter.frequency.exponentialRampToValueAtTime(120, now + 5.0);

      const waveEnv = this.ctx.createGain();
      waveEnv.gain.setValueAtTime(0.001, now);
      waveEnv.gain.linearRampToValueAtTime(0.35, now + 2.2);
      waveEnv.gain.exponentialRampToValueAtTime(0.001, now + 5.0);

      noise.connect(filter);
      filter.connect(waveEnv);
      waveEnv.connect(this.waveGain);

      noise.start(now);
      noise.stop(now + 5.0);
    };

    playWaveCycle();
    this.waveInterval = window.setInterval(playWaveCycle, 5500);
  }

  // --- Coastal Summer Breeze ---
  private startBreeze() {
    if (!this.ctx || !this.breezeGain) return;

    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.02;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 350;
    filter.Q.value = 1.2;

    noise.connect(filter);
    filter.connect(this.breezeGain);
    noise.start();
  }

  // --- Sparkling Crystal Wind Chimes ---
  private startChimes() {
    const pentatonicNotes = [
      1046.50, // C6
      1174.66, // D6
      1318.51, // E6
      1567.98, // G6
      1760.00, // A6
      2093.00, // C7
      2349.32, // D7
      2637.02, // E7
    ];

    const playRandomChime = () => {
      if (!this.ctx || !this.chimeGain || !this.isRunning) return;

      const freq = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.chimeGain);

      osc.start(now);
      osc.stop(now + 2.5);
    };

    // Staggered trigger
    this.chimeInterval = window.setInterval(() => {
      if (Math.random() > 0.3) {
        playRandomChime();
        if (Math.random() > 0.6) {
          setTimeout(playRandomChime, 180 + Math.random() * 250);
        }
      }
    }, 2800);
  }

  // --- Ambient Piano / Warm Chords ---
  private startChords() {
    // Gmaj7, D, Em7, Cadd9 progression
    const chordProgression = [
      [196.00, 293.66, 392.00, 493.88], // Gmaj7: G3, D4, G4, B4
      [146.83, 293.66, 369.99, 440.00], // D: D3, D4, F#4, A4
      [164.81, 329.63, 392.00, 493.88], // Em7: E3, E4, G4, B4
      [130.81, 261.63, 329.63, 392.00], // Cadd9: C3, C4, E4, G4
    ];

    let chordStep = 0;
    const playNextChord = () => {
      if (!this.ctx || !this.chordGain || !this.isRunning) return;

      const chord = chordProgression[chordStep % chordProgression.length];
      chordStep++;
      const now = this.ctx.currentTime;

      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.chordGain) return;
        const osc = this.ctx.createOscillator();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const noteGain = this.ctx.createGain();
        const noteVol = (idx === 0 ? 0.08 : 0.04) * (1 - idx * 0.12);
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(noteVol, now + 0.4);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

        osc.connect(noteGain);
        noteGain.connect(this.chordGain);

        osc.start(now);
        osc.stop(now + 4.4);
      });
    };

    playNextChord();
    this.chordInterval = window.setInterval(playNextChord, 4500);
  }

  // --- User Custom Audio Playback (e.g. uploaded song file) ---
  public loadUserAudio(file: File): Promise<string> {
    this.initContext();
    return new Promise((resolve, reject) => {
      try {
        const url = URL.createObjectURL(file);
        if (!this.customAudio) {
          this.customAudio = new Audio();
          this.customAudio.crossOrigin = 'anonymous';
        }

        this.customAudio.src = url;

        if (this.ctx && this.masterGain && !this.customAudioSource) {
          this.customAudioSource = this.ctx.createMediaElementSource(this.customAudio);
          this.customAudioSource.connect(this.masterGain);
        }

        this.customAudio.onloadedmetadata = () => {
          resolve(url);
        };
        this.customAudio.onerror = (e) => {
          reject(e);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  public getCustomAudio(): HTMLAudioElement | null {
    return this.customAudio;
  }

  // --- Volume Controls ---
  public setVolume(channel: 'master' | 'waves' | 'breeze' | 'chimes' | 'chords', val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    this.volumes[channel] = clamped;

    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    switch (channel) {
      case 'master':
        this.masterGain?.gain.setTargetAtTime(clamped, now, 0.05);
        break;
      case 'waves':
        this.waveGain?.gain.setTargetAtTime(clamped, now, 0.05);
        break;
      case 'breeze':
        this.breezeGain?.gain.setTargetAtTime(clamped, now, 0.05);
        break;
      case 'chimes':
        this.chimeGain?.gain.setTargetAtTime(clamped, now, 0.05);
        break;
      case 'chords':
        this.chordGain?.gain.setTargetAtTime(clamped, now, 0.05);
        break;
    }
  }

  public getVolumes() {
    return { ...this.volumes };
  }

  // --- Frequency Data for Visualizer ---
  public getFrequencyData(array: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array as unknown as Uint8Array<ArrayBuffer>);
    } else {
      array.fill(0);
    }
  }

  // --- Play Single Water Ripple Chime on Click ---
  public triggerWaterRippleSound() {
    this.initContext();
    if (!this.ctx || !this.chimeGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, now);
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.chimeGain);

    osc.start(now);
    osc.stop(now + 0.8);
  }
}

export const soundEngine = new SoundscapeEngine();
