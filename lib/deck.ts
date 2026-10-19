/** Hash <-> index. `#/7` is slide 7 (1-based) and index 6. */
export function parseHash(hash: string, total: number): number | null {
  const clean = hash.trim();
  if (clean === "" || clean === "#" || clean === "#/") return 0; // the bare URL is slide 1
  const match = /^#\/?(\d{1,3})$/.exec(clean);
  if (!match) return null;
  const n = Number(match[1]) - 1;
  if (!Number.isInteger(n) || n < 0 || n >= total) return null;
  return n;
}

export function formatHash(index: number): string {
  return `#/${index + 1}`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Text fields and content-editable regions own every key. */
export function isEditable(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.closest !== "function") return false;
  return el.closest("input, textarea, select, [contenteditable='true'], [contenteditable='']") !== null;
}

/** Buttons and links own Space and Enter. */
export function isInteractive(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.closest !== "function") return false;
  return el.closest("button, a[href], summary, [role='button'], [role='tab'], [role='radio'], [role='option']") !== null;
}

/** Components that handle arrow keys themselves mark their root with data-captures-keys. */
export function capturesKeys(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.closest !== "function") return false;
  return el.closest("[data-captures-keys]") !== null;
}

/** 1 = swipe left (go next), -1 = swipe right (go previous), 0 = not a swipe. */
export function swipeDirection(dx: number, dy: number, dt: number): 1 | -1 | 0 {
  const minDistance = 48;
  const maxTime = 800;
  if (dt > maxTime) return 0;
  if (Math.abs(dx) < minDistance) return 0;
  if (Math.abs(dx) < Math.abs(dy) * 1.4) return 0;
  return dx < 0 ? 1 : -1;
}
