/**
 * Lazy-loaded Web Audio manager for real MP3 sound effects (page-flip & stamp)
 * with instant procedural Web Audio fallback.
 * Audio files (~114 KB total) are NOT downloaded until the user enables sound.
 * OFF by default, persisted in localStorage, and silenced when reduced motion is preferred.
 */

const STORAGE_KEY = 'ali-portfolio-sound';

type SoundClipKey = 'pageFlip' | 'stamp';

const CLIP_URLS: Record<SoundClipKey, string> = {
  pageFlip: '/assets/audio/page-flip.mp3',
  stamp: '/assets/audio/stamp.mp3',
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = false;
  private lastPlayAt = 0;
  private buffers: Partial<Record<SoundClipKey, AudioBuffer>> = {};
  private loadingClips = false;

  constructor() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // Off by default until explicit user opt-in; respect reduced motion
      if (saved === 'on' && !this.isReducedMotion()) {
        this.enabled = true;
        this.bindLazyUnlock();
      }
    } catch {
      this.enabled = false;
    }
  }

  private bindLazyUnlock(): void {
    const unlock = () => {
      if (this.isEnabled()) {
        const ctx = this.ensureContext();
        if (ctx) void this.preloadClips();
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true, once: true });
    window.addEventListener('keydown', unlock, { passive: true, once: true });
  }

  private isReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  public isEnabled(): boolean {
    return this.enabled && !this.isReducedMotion();
  }

  /** True when the OS reduced-motion preference silences all sound. */
  public isBlockedByReducedMotion(): boolean {
    return this.isReducedMotion();
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    try {
      window.localStorage.setItem(STORAGE_KEY, this.enabled ? 'on' : 'off');
    } catch {
      // Ignore storage failures
    }
    if (this.enabled) {
      this.ensureContext();
      void this.preloadClips().then(() => {
        if (this.isEnabled()) this.playPaperFlip();
      });
    }
    return this.isEnabled();
  }

  private ensureContext(): AudioContext | null {
    if (!this.isEnabled()) return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private async preloadClips(): Promise<void> {
    if (this.loadingClips) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.loadingClips = true;

    await Promise.all(
      (Object.keys(CLIP_URLS) as SoundClipKey[]).map(async (key) => {
        if (this.buffers[key]) return;
        try {
          const res = await fetch(CLIP_URLS[key]);
          if (!res.ok) return;
          const arrayBuf = await res.arrayBuffer();
          this.buffers[key] = await ctx.decodeAudioData(arrayBuf);
        } catch {
          // Keep procedural fallback if offline or decode fails
        }
      })
    );
  }

  private playDecodedClip(key: SoundClipKey, volume: number): boolean {
    const ctx = this.ensureContext();
    const buffer = this.buffers[key];
    if (!ctx || !buffer) return false;

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    src.connect(gain).connect(ctx.destination);
    src.start();
    return true;
  }

  private canTrigger(cooldownMs = 95): boolean {
    const now = performance.now();
    if (now - this.lastPlayAt < cooldownMs) return false;
    this.lastPlayAt = now;
    return true;
  }

  /** Plays real page-flip.mp3 (or procedural fallback while loading). */
  public playPaperFlip(): void {
    if (!this.canTrigger(180)) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    void this.preloadClips();
    if (this.playDecodedClip('pageFlip', 0.85)) return;

    const dur = 0.14;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.45;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2800, ctx.currentTime + dur);
    filter.Q.value = 1.1;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
  }

  /** Soft cardboard folder open/close thump. */
  public playFolderThump(): void {
    if (!this.canTrigger(180)) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(48, now + 0.13);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  /** Plays real stamp.mp3 (or procedural fallback while loading). */
  public playStampSlam(): void {
    if (!this.canTrigger(220)) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    void this.preloadClips();
    if (this.playDecodedClip('stamp', 0.8)) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(175, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.19);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.36, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }
}

export const soundEngine = new SoundEngine();
