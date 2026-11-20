import { srcSetFor } from '../js/images';

/**
 * <img> avec srcset automatique (tailles générées par `npm run images`).
 * `sizes` : largeur d'affichage de l'image, ex. "(max-width: 768px) 100vw, 33vw".
 */
export default function Img({ src, sizes = '100vw', ...props }) {
  const srcSet = srcSetFor(src);
  return <img src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} decoding="async" {...props} />;
}
