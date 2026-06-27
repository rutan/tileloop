import { readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const distDir = resolve('dist');
const ssrDir = resolve('dist-ssr');
const templatePath = resolve(distDir, 'index.html');
const placeholder = '<!-- SSR_CONTENT -->';

const template = await readFile(templatePath, 'utf8');
const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.mjs')).href);
const appHtml = render();

if (!template.includes(placeholder)) {
  throw new Error(`Prerender placeholder was not found: ${placeholder}`);
}

await writeFile(templatePath, template.replace(placeholder, appHtml));
await rm(ssrDir, { recursive: true, force: true });
