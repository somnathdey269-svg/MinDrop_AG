// Tiny pub-sub so StoryChrome (header) can display the current beat's
// sub-chapter name (eyebrow) owned by PinnedScene.

type Listener = () => void;

let current: string | null = null;
const listeners = new Set<Listener>();

export function setCurrentBeatEyebrow(value: string | null) {
  if (current === value) return;
  current = value;
  listeners.forEach((l) => l());
}

export function subscribeBeatEyebrow(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getCurrentBeatEyebrow() {
  return current;
}
