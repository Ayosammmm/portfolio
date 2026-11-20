#!/usr/bin/env node
/**
 * Génère plusieurs tailles (WebP) de chaque image PNG/JPG de public/assets,
 * pour les utiliser dans des srcset.
 *
 *   public/assets/projects/vergil/cover.jpg (2400px)
 *   → public/assets/projects/vergil/_sizes/cover-320.webp
 *   → public/assets/projects/vergil/_sizes/cover-640.webp
 *   → ... (seulement les largeurs inférieures à l'original)
 *
 * Écrit aussi src/data/images.json (dimensions + tailles disponibles),
 * lu par le composant <Img> pour construire srcset/sizes.
 *
 * Usage :
 *   npm run images              génère les tailles manquantes ou obsolètes
 *   npm run images -- --force   régénère tout
 *
 * Options : --widths=320,640,960,1280,1920,2560  --quality=80  --dir=public/assets
 */
import { readdir, stat, mkdir, unlink, rmdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const PUBLIC = path.resolve('public');
const ROOT = path.resolve(args.dir ?? 'public/assets');
const MANIFEST = path.resolve('src/data/images.json');
const WIDTHS = String(args.widths ?? '320,640,960,1280,1920,2560').split(',').map(Number).sort((a, b) => a - b);
const QUALITY = Number(args.quality ?? 80);
const FORCE = Boolean(args.force);
const SIZES_DIR = '_sizes';
const EXT = /\.(png|jpe?g)$/i;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== SIZES_DIR) yield* walk(full);
    } else if (EXT.test(entry.name)) {
      yield full;
    }
  }
}

async function mtime(file) {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
}

const variantPath = (src, w) =>
  path.join(path.dirname(src), SIZES_DIR, `${path.parse(src).name}-${w}.webp`);

const manifest = {};
const expected = new Set();
const counts = { generated: 0, skipped: 0, failed: 0, removed: 0 };

console.log(`Tailles [${WIDTHS.join(', ')}] en WebP q${QUALITY}${FORCE ? ' [force]' : ''}`);

for await (const src of walk(ROOT)) {
  const rel = path.relative(ROOT, src);
  try {
    const meta = await sharp(src).metadata();
    const { width, height } = meta.autoOrient ?? meta;
    const widths = WIDTHS.filter((w) => w < width);
    const srcTime = await mtime(src);
    let made = 0;

    for (const w of widths) {
      const dest = variantPath(src, w);
      expected.add(dest);
      if (!FORCE && (await mtime(dest)) >= srcTime) continue;
      await mkdir(path.dirname(dest), { recursive: true });
      await sharp(src).rotate().resize({ width: w }).webp({ quality: QUALITY }).toFile(dest);
      made++;
    }

    manifest['/' + path.relative(PUBLIC, src).split(path.sep).join('/')] = { width, height, widths };
    if (made) {
      counts.generated += made;
      console.log(`  ✓ ${rel} (${width}px → ${widths.join(', ') || 'aucune réduction'})`);
    } else {
      counts.skipped++;
    }
  } catch (err) {
    counts.failed++;
    console.error(`  ! ${rel} : ${err.message}`);
  }
}

// Supprime les tailles qui ne correspondent plus à aucune image / largeur.
async function clean(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name !== SIZES_DIR) {
      await clean(full);
      continue;
    }
    for (const f of await readdir(full)) {
      const file = path.join(full, f);
      if (!expected.has(file)) {
        await unlink(file);
        counts.removed++;
        console.log(`  ✗ ${path.relative(ROOT, file)}`);
      }
    }
    if ((await readdir(full)).length === 0) await rmdir(full);
  }
}
if (!counts.failed) await clean(ROOT);

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');

console.log(
  `\n${counts.generated} fichier(s) généré(s), ${counts.skipped} image(s) à jour, ` +
    `${counts.removed} supprimé(s), ${counts.failed} erreur(s)\n→ ${path.relative(process.cwd(), MANIFEST)}`
);
process.exitCode = counts.failed ? 1 : 0;
