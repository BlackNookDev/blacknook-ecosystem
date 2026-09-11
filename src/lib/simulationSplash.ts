import {
  SIMULATION_REVEAL_DURATION_MS,
  SIMULATION_SPLASH_DURATION_MS,
} from '@/lib/simulationLaunchSound';

export type SplashState = {
  visible: boolean;
  exiting: boolean;
  label: string;
};

type Listener = (state: SplashState) => void;

let state: SplashState = { visible: false, exiting: false, label: 'Simülasyon' };
const listeners = new Set<Listener>();
let exitTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  for (const listener of listeners) listener(state);
}

function clearSplashTimers() {
  if (exitTimer !== null) {
    clearTimeout(exitTimer);
    exitTimer = null;
  }
  if (hideTimer !== null) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

export function subscribeSimulationSplash(listener: Listener) {
  listener(state);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function openSimulationSplash(label = 'Önizleme') {
  if (typeof window === 'undefined') return;

  clearSplashTimers();
  state = { visible: true, exiting: false, label };
  emit();

  exitTimer = setTimeout(() => {
    state = { ...state, visible: true, exiting: true };
    emit();
    exitTimer = null;
  }, SIMULATION_SPLASH_DURATION_MS);

  hideTimer = setTimeout(() => {
    state = { visible: false, exiting: false, label: 'Simülasyon' };
    emit();
    hideTimer = null;
  }, SIMULATION_SPLASH_DURATION_MS + SIMULATION_REVEAL_DURATION_MS + 120);
}

export function closeSimulationSplash() {
  clearSplashTimers();
  state = { visible: false, exiting: false, label: 'Simülasyon' };
  emit();
}
