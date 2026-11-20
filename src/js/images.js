// Manifeste généré par `npm run images` (scripts/images.js).
import manifest from '../data/images.json';
import { asset } from './asset';

const variant = (src, w) => src.replace(/\/([^/]+)\.(png|jpe?g)$/i, `/_sizes/$1-${w}.webp`);

/** Valeur srcset pour une image de public/, ou undefined si elle n'a pas de tailles générées. */
export function srcSetFor(src) {
  const m = manifest[src];
  if (!m || !m.widths.length) return undefined;
  return [...m.widths.map((w) => `${asset(variant(src, w))} ${w}w`), `${asset(src)} ${m.width}w`].join(', ');
}

/** URL de la plus petite version d'au moins `minWidth` px (pour les background-image CSS). */
export function imageFor(src, minWidth) {
  const w = manifest[src]?.widths.find((w) => w >= minWidth);
  return asset(w ? variant(src, w) : src);
}
