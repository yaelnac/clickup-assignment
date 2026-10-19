import { useId } from "react";

/** ClickUp's mark, drawn as two strokes: a chevron over a smile. */
export function ClickUpMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}-top`} x1="8" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff02f0" />
          <stop offset="1" stopColor="#ffc800" />
        </linearGradient>
        <linearGradient id={`${id}-bottom`} x1="8" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8930fd" />
          <stop offset="1" stopColor="#49ccf9" />
        </linearGradient>
      </defs>
      <path d="M11 23 L24 12 L37 23" fill="none" stroke={`url(#${id}-top)`} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 31 Q24 44 37 31" fill="none" stroke={`url(#${id}-bottom)`} strokeWidth="6.5" strokeLinecap="round" />
    </svg>
  );
}
