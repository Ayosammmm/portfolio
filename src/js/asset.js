/**
 * Préfixe un chemin de public/ ("/assets/...") avec la base du site
 * (import.meta.env.BASE_URL, ex. "/portfolio/" sur GitHub Pages, "/" en dev).
 * Les URL externes (https://, //...) et relatives sont renvoyées telles quelles.
 */
export function asset(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return path;
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}
