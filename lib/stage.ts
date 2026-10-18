/**
 * Design canvas for landscape stages. Every slide is laid out at this size and scaled.
 * Mirrors --canvas-w / --canvas-h in globals.css.
 */
export const STAGE_W = 1600;
export const STAGE_H = 900;

/** Sets --deck-scale before first paint and keeps it current. Inlined in the root layout. */
export const deckScaleScript = `(function(){var d=document.documentElement;function s(){d.style.setProperty("--deck-scale",String(Math.min(innerWidth/${STAGE_W},innerHeight/${STAGE_H})))}s();addEventListener("resize",s);addEventListener("orientationchange",s)})();`;
