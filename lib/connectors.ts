/** Geometry helpers for the purple connector lines drawn over slides. */

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Layout box of `el` relative to `root`, from offset geometry, so CSS transforms (entrance
 * animations, the scaled canvas) don't skew it. `root` must be positioned.
 */
export function boxWithin(el: HTMLElement, root: HTMLElement): Box | null {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  if (node !== root) return null;
  return { left: x, top: y, width: el.offsetWidth, height: el.offsetHeight };
}

export type Point = [number, number];

export function pathFrom(points: Point[]): string {
  return `M ${points.map(([x, y]) => `${x} ${y}`).join(" L ")}`;
}

/** Points of a small filled arrowhead whose tip is the last point, aligned with the last segment. */
export function arrowHead(points: Point[], length = 9, halfWidth = 4.5): string {
  const [ex, ey] = points[points.length - 1];
  const [px, py] = points[points.length - 2];
  const len = Math.hypot(ex - px, ey - py) || 1;
  const dx = (ex - px) / len;
  const dy = (ey - py) / len;
  const bx = ex - dx * length;
  const by = ey - dy * length;
  return `${ex},${ey} ${bx - dy * halfWidth},${by + dx * halfWidth} ${bx + dy * halfWidth},${by - dx * halfWidth}`;
}
