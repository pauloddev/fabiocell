// Troca o SITE_URL em todos os arquivos de uma vez (sem dependências).
// Uso: node scripts/set-site-url.mjs https://seu-projeto.vercel.app
import { readFileSync, writeFileSync } from 'node:fs';
const PLACEHOLDER = 'https://TROCAR-PELO-LINK-DO-VERCEL.vercel.app';
const url = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https:\/\/[^\s/]+\.[^\s/]+$/.test(url)) {
  console.error('Informe a URL completa, sem barra no final. Ex.: node scripts/set-site-url.mjs https://fabiocell.vercel.app');
  process.exit(1);
}
for (const f of ['index.html', 'robots.txt', 'sitemap.xml']) {
  const t = readFileSync(f, 'utf8');
  const n = t.split(PLACEHOLDER).length - 1;
  writeFileSync(f, t.split(PLACEHOLDER).join(url));
  console.log(`${f}: ${n} ocorrência(s) trocada(s)`);
}
