/** Ürün detayından simülasyona geçişte yavaş açılış bayrağı */
import { openSimulationSplash } from '@/lib/simulationSplash';

export const SIMULATION_LAUNCH_FLAG = 'bn-simulation-launch';
export const SIMULATION_LAUNCH_AT_KEY = 'bn-simulation-launch-at';
export const SIMULATION_LAUNCH_LABEL_KEY = 'bn-simulation-launch-label';

export const SIMULATION_AUDIO_SRC = '/audio/simulation-launch.mp3';
export const SIMULATION_AUDIO_DURATION_S = 8;
export const SIMULATION_AUDIO_MAX_VOLUME = 0.11;
export const SIMULATION_AUDIO_FADE_START_S = 5;

/** Logo bekleme süresi — ürün sayfasında tam bu kadar beklenir */
export const SIMULATION_SPLASH_DURATION_MS = 5000;
export const SIMULATION_NAVIGATE_DELAY_MS = SIMULATION_SPLASH_DURATION_MS;
/** Simülasyon sayfasına geçince kısa netleşme */
export const SIMULATION_REVEAL_DURATION_MS = 550;
export const SIMULATION_SPLASH_EXIT_MS = 450;

/** SPA geçişinde sessionStorage kaybına karşı bellek yedegi */
let pendingLaunchAt: number | null = null;

let activeAudio: HTMLAudioElement | null = null;
let stopTimer: number | null = null;
let fadeTimer: number | null = null;
let fadeRaf: number | null = null;

export function stopSimulationLaunchSound() {
  if (typeof window === 'undefined') return;
  if (fadeTimer !== null) {
    window.clearTimeout(fadeTimer);
    fadeTimer = null;
  }
  if (fadeRaf !== null) {
    window.cancelAnimationFrame(fadeRaf);
    fadeRaf = null;
  }
  if (stopTimer !== null) {
    window.clearTimeout(stopTimer);
    stopTimer = null;
  }
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
}

function fadeOutAudio(audio: HTMLAudioElement, fromVolume: number, durationMs: number) {
  const start = performance.now();

  const tick = (now: number) => {
    if (activeAudio !== audio) return;

    const elapsed = now - start;
    if (elapsed >= durationMs) {
      audio.volume = 0;
      stopSimulationLaunchSound();
      return;
    }

    const progress = elapsed / durationMs;
    audio.volume = Math.max(0, fromVolume * (1 - progress));
    fadeRaf = window.requestAnimationFrame(tick);
  };

  fadeRaf = window.requestAnimationFrame(tick);
}

/** Simülasyon açılış müziği — 8 sn, 5. sn'den itibaren yavaşça kısılır */
export function playSimulationLaunchSound() {
  if (typeof window === 'undefined') return;

  stopSimulationLaunchSound();

  const audio = new Audio(SIMULATION_AUDIO_SRC);
  audio.volume = SIMULATION_AUDIO_MAX_VOLUME;
  audio.preload = 'auto';
  activeAudio = audio;

  void audio.play().catch(() => undefined);

  const fadeDelayMs = SIMULATION_AUDIO_FADE_START_S * 1000;
  const fadeDurationMs = SIMULATION_AUDIO_DURATION_S * 1000 - fadeDelayMs;

  fadeTimer = window.setTimeout(() => {
    fadeTimer = null;
    if (activeAudio !== audio) return;
    fadeOutAudio(audio, audio.volume, fadeDurationMs);
  }, fadeDelayMs);

  stopTimer = window.setTimeout(() => {
    stopSimulationLaunchSound();
  }, SIMULATION_AUDIO_DURATION_S * 1000 + 80);
}

export function markSimulationLaunch(label = 'Önizleme') {
  if (typeof window === 'undefined') return;
  pendingLaunchAt = Date.now();
  try {
    sessionStorage.setItem(SIMULATION_LAUNCH_FLAG, '1');
    sessionStorage.setItem(SIMULATION_LAUNCH_AT_KEY, String(pendingLaunchAt));
    sessionStorage.setItem(SIMULATION_LAUNCH_LABEL_KEY, label);
  } catch {
    /* ignore */
  }
  openSimulationSplash(label);
}

export function peekSimulationLaunch(): {
  launched: boolean;
  launchAt: number | null;
  label: string;
} {
  if (typeof window === 'undefined') return { launched: false, launchAt: null, label: 'Simülasyon' };

  if (pendingLaunchAt !== null) {
    return {
      launched: true,
      launchAt: pendingLaunchAt,
      label: readLaunchLabel(),
    };
  }

  try {
    const launched = sessionStorage.getItem(SIMULATION_LAUNCH_FLAG) === '1';
    const raw = sessionStorage.getItem(SIMULATION_LAUNCH_AT_KEY);
    const launchAt = raw ? Number(raw) : null;
    if (launched && Number.isFinite(launchAt)) {
      pendingLaunchAt = launchAt;
      return { launched: true, launchAt, label: readLaunchLabel() };
    }
    return { launched: false, launchAt: null, label: 'Simülasyon' };
  } catch {
    return { launched: false, launchAt: null, label: 'Simülasyon' };
  }
}

function readLaunchLabel() {
  try {
    return sessionStorage.getItem(SIMULATION_LAUNCH_LABEL_KEY) ?? 'Simülasyon';
  } catch {
    return 'Simülasyon';
  }
}

export function clearSimulationLaunch() {
  pendingLaunchAt = null;
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SIMULATION_LAUNCH_FLAG);
    sessionStorage.removeItem(SIMULATION_LAUNCH_AT_KEY);
    sessionStorage.removeItem(SIMULATION_LAUNCH_LABEL_KEY);
  } catch {
    /* ignore */
  }
}

export function takeSimulationLaunch(): boolean {
  const { launched } = peekSimulationLaunch();
  if (launched) clearSimulationLaunch();
  return launched;
}
