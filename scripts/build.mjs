#!/usr/bin/env node
// Build bamstechnology.com into dist/.
//
//   npm run build          (node scripts/build.mjs)
//
// Every page is pre-rendered: the <x-dc> template is expanded into plain HTML
// (headings, nav, footer, links, copy) so search engines and AI crawlers that
// don't run JavaScript see the full page. support.js still boots for visitors:
// the original template is kept in an inert <template>, the runtime renders it
// off-screen, and the static copy is swapped out once the live one matches.
//
// Script URLs for bams-data.js and support.js get a ?v=<content hash> in dist/,
// so browsers fetch a fresh copy whenever either file changes (source files
// reference the bare /bams-data.js and /support.js).
//
// The build also injects JSON-LD, writes sitemap.xml with git-based <lastmod>
// dates, and copies static assets. No npm dependencies; Node 18+.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeEntities, escapeAttr, parse, render } from './lib/template.mjs';
import * as schema from './lib/schema.mjs';

const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), '..');

export const STATIC_ASSETS = [
  'assets', 'BAMS_Logo_Blue.png', 'favicon.ico', 'robots.txt', 'llms.txt', '_redirects', '_headers',
  'bams-data.js', 'support.js', 'image-slot.js', 'ServicePage.dc.html',
];

// Files whose URLs carry a content hash in dist/ (cache busting).
export const VERSIONED_ASSETS = ['bams-data.js', 'support.js'];

/** Short content hash for each versioned asset, e.g. { 'bams-data.js': '1a2b3c4d5e' }. */
export function assetVersions(srcDir) {
  const out = {};
  for (const name of VERSIONED_ASSETS) {
    out[name] = createHash('sha256').update(readFileSync(join(srcDir, name))).digest('hex').slice(0, 10);
  }
  return out;
}

/**
 * Point every root-relative reference to a versioned asset at its hashed URL:
 * src="/support.js" -> src="/support.js?v=<hash>", import('/bams-data.js') ->
 * import('/bams-data.js?v=<hash>'). Any older hand-written ?v= is replaced.
 */
export function versionAssetRefs(text, versions) {
  let out = text;
  for (const [name, hash] of Object.entries(versions)) {
    const re = new RegExp(`(["'(])(?:\\.)?/${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\?v=[^"')\\s]*)?(?=["')])`, 'g');
    out = out.replace(re, `$1/${name}?v=${hash}`);
  }
  return out;
}

/** Every HTML page of the site (components such as *.dc.html are not pages). */
export function listPages(srcDir) {
  const pages = readdirSync(srcDir).filter((f) => f.endsWith('.html') && !f.endsWith('.dc.html'));
  const nested = existsSync(join(srcDir, 'case-study'))
    ? readdirSync(join(srcDir, 'case-study')).filter((f) => f.endsWith('.html')).map((f) => 'case-study/' + f)
    : [];
  return [...pages.sort(), ...nested.sort()];
}

export function routeFor(file) {
  if (file === 'index.html') return '/';
  return '/' + file.replace(/\.html$/, '');
}

// ---------------------------------------------------------------------------
// Component execution

class DCLogic {
  constructor(props) {
    this.props = props || {};
    this.state = {};
  }
  setState(update) {
    const patch = typeof update === 'function' ? update(this.state) : update;
    this.state = { ...this.state, ...patch };
  }
  forceUpdate() {}
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  renderVals() {
    return {};
  }
}

function extractDc(source) {
  const open = /<x-dc(?:\s[^>]*)?>/.exec(source);
  if (!open) return null;
  const close = source.lastIndexOf('</x-dc>');
  if (close < open.index) return null;
  const script = /<script\b([^>]*\bdata-dc-script\b[^>]*)>([\s\S]*?)<\/script>/.exec(source);
  let defaults = {};
  if (script) {
    const dp = /\bdata-props="([^"]*)"/.exec(script[1]);
    if (dp) {
      try {
        const meta = JSON.parse(decodeEntities(dp[1]));
        for (const [k, v] of Object.entries(meta)) if (k[0] !== '$' && v && v.default !== undefined) defaults[k] = v.default;
      } catch {
        defaults = {};
      }
    }
  }
  return {
    openTag: open[0],
    start: open.index,
    end: close + '</x-dc>'.length,
    template: source.slice(open.index + open[0].length, close),
    js: script ? script[2] : '',
    defaults,
  };
}

function makeEnv(route, pageSource) {
  const location = new URL(route, schema.SITE);
  const document = {
    title: '',
    querySelector(sel) {
      const m = /^meta\[name=["']?([^"'\]]+)["']?\]$/.exec(sel.trim());
      if (!m) return null;
      const tag = new RegExp('<meta\\b[^>]*\\bname=["\']' + m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\'][^>]*>', 'i').exec(pageSource);
      if (!tag) return null;
      const content = /\bcontent=["']([^"']*)["']/i.exec(tag[0]);
      const value = content ? decodeEntities(content[1]) : '';
      return { content: value, getAttribute: (n) => (n === 'content' ? value : null) };
    },
    querySelectorAll: () => [],
    getElementById: () => null,
  };
  return { location, document, window: { location, document } };
}

async function runLogic(js, props, env, importModule) {
  if (!js.trim()) return { ...props };
  const code = js.replace(/\bimport\s*\(/g, '__dcImport(');
  // eslint-disable-next-line no-new-func
  const factory = new Function(
    'DCLogic', 'StreamableLogic', 'React', 'window', 'document', 'location', '__dcImport',
    code + '\n;return (typeof Component!=="undefined"&&Component)||undefined;',
  );
  const Component = factory(DCLogic, DCLogic, undefined, env.window, env.document, env.location, importModule);
  if (!Component) return { ...props };
  const logic = new Component(props);
  await logic.componentDidMount();
  return { ...props, ...(logic.renderVals() || {}) };
}

// ---------------------------------------------------------------------------
// Page rendering

export async function renderPage(srcDir, file) {
  const source = readFileSync(join(srcDir, file), 'utf8');
  const route = routeFor(file);
  const dc = extractDc(source);
  const result = { file, route, source, dc, html: '', helmets: [], components: [] };
  if (!dc) return result;

  const env = makeEnv(route, source);
  const moduleCache = new Map();
  const importModule = (spec) => {
    const clean = String(spec).split(/[?#]/)[0].replace(/^\.?\//, '');
    const path = join(srcDir, clean);
    if (!moduleCache.has(path)) {
      const code = readFileSync(path, 'utf8');
      moduleCache.set(path, import('data:text/javascript;base64,' + Buffer.from(code).toString('base64')));
    }
    return moduleCache.get(path);
  };

  const renderTemplate = async (name, template, js, props) => {
    const vals = await runLogic(js, props, env, importModule);
    result.components.push({ name, vals });
    // Nested components render asynchronously (their logic may import data),
    // so collect them first, then substitute.
    const pending = [];
    const ctx = {
      helmets: result.helmets,
      src: template,
      renderComponent(childName, childProps) {
        const token = `\u0000dc-${pending.length}\u0000`;
        pending.push({ token, childName, childProps });
        return token;
      },
    };
    let html = render(parse(template), vals, ctx);
    for (const p of pending) {
      const childFile = join(srcDir, p.childName + '.dc.html');
      const child = extractDc(readFileSync(childFile, 'utf8'));
      if (!child) throw new Error(`${file}: <dc-import name="${p.childName}"> has no <x-dc> block`);
      const inner = await renderTemplate(p.childName, child.template, child.js, p.childProps);
      html = html.replace(p.token, `<div class="sc-host" data-sc-name="${escapeAttr(p.childName)}">${inner}</div>`);
    }
    return html;
  };

  const rootName = route === '/' ? 'Root' : route.split('/').pop();
  const inner = await renderTemplate(rootName, dc.template, dc.js, { ...dc.defaults });
  result.html = `<div class="sc-host" data-sc-name="${escapeAttr(rootName)}">${inner}</div>`;
  return result;
}

// Swaps the pre-rendered copy for the live support.js render once it matches.
// Kept tiny and dependency-free; it runs before support.js boots (DOMContentLoaded).
const SWAP_SCRIPT = `<script>(function(){var t=document.getElementById("dc-src"),s=document.getElementById("dc-static");if(!t||!s)return;var x=document.createElement("x-dc");x.innerHTML=t.innerHTML;t.parentNode.replaceChild(x,t);function txt(e){return e?e.textContent.replace(/\\s+/g," ").trim():""}var h=txt(s.querySelector("h1")),n=s.querySelectorAll("a[href]").length,tries=0;(function check(){var r=document.getElementById("dc-root");if(r&&txt(r.querySelector("h1"))===h&&r.querySelectorAll("a[href]").length>=n){r.setAttribute("data-dc-live","");s.parentNode&&s.parentNode.removeChild(s);return}if(++tries<200)setTimeout(check,50)})()})();</script>`;
const SWAP_STYLE = '<style>#dc-root:not([data-dc-live]){display:none!important}#dc-static,#dc-static>.sc-host{min-height:100%}</style>';

function headMeta(source) {
  const title = /<title>([\s\S]*?)<\/title>/i.exec(source);
  const desc = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(source);
  const canonical = /<link\s+rel="canonical"\s+href="([^"]*)"/i.exec(source);
  return {
    title: title ? decodeEntities(title[1].trim()) : '',
    description: desc ? decodeEntities(desc[1]) : '',
    canonical: canonical ? canonical[1] : '',
  };
}

function gitDate(srcDir, files, fallback, mode = 'last') {
  try {
    const args = mode === 'first'
      ? ['log', '--diff-filter=A', '--format=%cs', '--', ...files]
      : ['log', '-1', '--format=%cs', '--', ...files];
    const out = execFileSync('git', args, { cwd: srcDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const dates = out.split('\n').filter(Boolean);
    if (!dates.length) return fallback;
    return mode === 'first' ? dates[dates.length - 1] : dates[0];
  } catch {
    return fallback;
  }
}

/** Source files whose changes change the rendered page (for <lastmod>). */
function pageDeps(page) {
  const deps = [page.file];
  if (/bams-data\.js/.test(page.source)) deps.push('bams-data.js');
  if (/name="ServicePage"/.test(page.source)) deps.push('ServicePage.dc.html', 'bams-data.js');
  return [...new Set(deps)];
}

function buildSchemas(page, meta, data) {
  const url = meta.canonical || schema.SITE + page.route;
  const pageName = meta.title.split(' | ')[0].trim();
  const out = [];
  const crumbs = [{ name: 'Home', url: schema.SITE + '/' }];
  const allVals = page.components.map((c) => c.vals);
  const faqs = allVals.map((v) => v.faqs).find((f) => Array.isArray(f) && f.length);
  const svc = data.services.find((s) => s.file === page.route);
  const study = page.route.startsWith('/case-study/') ? data.caseStudies.find((c) => '/case-study/' + c.key === page.route) : null;

  if (page.route === '/') {
    out.push(schema.organization(), schema.professionalService(data.services, meta.description), schema.website());
  } else if (svc) {
    crumbs.push({ name: 'Services', url: schema.SITE + '/#services-section' }, { name: svc.title, url });
    out.push(schema.service(svc, meta.description, url));
  } else if (study) {
    crumbs.push({ name: 'Case Studies', url: schema.SITE + '/case-studies' }, { name: study.title, url });
    out.push(schema.article({
      headline: study.title,
      description: meta.description,
      url,
      section: 'Case Study',
      about: study.industry,
      datePublished: page.datePublished,
      dateModified: page.lastmod,
    }));
  } else if (page.route === '/visitconnect') {
    crumbs.push({ name: 'VisitConnect', url });
    out.push(schema.softwareApplication(meta.description, url));
  } else if (page.route === '/case-studies') {
    crumbs.push({ name: 'Case Studies', url });
    out.push(schema.itemList('BAMS Technology case studies', data.caseStudies.map((c) => ({ name: c.title, url: schema.SITE + '/case-study/' + c.key }))));
  } else if (page.route === '/contact-us') {
    crumbs.push({ name: 'Contact', url });
    out.push(schema.webPage('ContactPage', { name: pageName, description: meta.description, url }));
  } else if (page.route === '/404') {
    out.push(schema.webPage('WebPage', { name: pageName, description: meta.description }));
    return out; // a 404 has no place in the site hierarchy
  } else {
    crumbs.push({ name: pageName, url });
  }
  if (faqs) out.push(schema.faqPage(faqs, url));
  out.unshift(schema.breadcrumbs(crumbs));
  return out;
}

function assemble(page, meta, schemas) {
  let html = page.source;
  const headExtra = [];
  // <helmet> content is what support.js would add to <head>; put it there now.
  for (const h of page.helmets) {
    for (const line of h.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (/rel="canonical"/.test(trimmed) && /rel="canonical"/.test(html.slice(0, html.indexOf('</head>')))) continue;
      headExtra.push(line);
    }
  }
  if (page.dc) headExtra.push(SWAP_STYLE);
  for (const s of schemas) headExtra.push(schema.toScript(s));
  html = html.replace('</head>', headExtra.join('\n') + '\n</head>');
  if (page.dc) {
    const dc = extractDc(html);
    const block = `<template id="dc-src">${dc.openTag}${dc.template}</x-dc></template>\n<div id="dc-static">${page.html}</div>\n${SWAP_SCRIPT}`;
    html = html.slice(0, dc.start) + block + html.slice(dc.end);
  }
  return html;
}

function writeSitemap(srcDir, outDir, pages) {
  const byRoute = new Map(pages.map((p) => [p.route, p]));
  const src = readFileSync(join(srcDir, 'sitemap.xml'), 'utf8');
  const xml = src.replace(/<url>([\s\S]*?)<\/url>/g, (all, inner) => {
    const loc = /<loc>([^<]+)<\/loc>/.exec(inner)[1];
    const route = new URL(loc).pathname;
    const page = byRoute.get(route);
    if (!page) throw new Error(`sitemap.xml lists ${loc}, which has no page`);
    return all.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${page.lastmod}</lastmod>`);
  });
  writeFileSync(join(outDir, 'sitemap.xml'), xml);
}

export async function build({ srcDir = ROOT, outDir = join(ROOT, 'dist'), buildDate = new Date().toISOString().slice(0, 10), log = console.log } = {}) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const data = await import('data:text/javascript;base64,' + readFileSync(join(srcDir, 'bams-data.js')).toString('base64'));
  const versions = assetVersions(srcDir);

  const pages = [];
  for (const file of listPages(srcDir)) {
    const page = await renderPage(srcDir, file);
    page.lastmod = gitDate(srcDir, pageDeps(page), buildDate);
    page.datePublished = gitDate(srcDir, [file], buildDate, 'first');
    const meta = headMeta(page.source + page.helmets.join('\n'));
    const html = versionAssetRefs(assemble(page, meta, buildSchemas(page, meta, data)), versions);
    const dest = join(outDir, file);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, html);
    pages.push(page);
  }

  for (const asset of STATIC_ASSETS) {
    const from = join(srcDir, asset);
    if (!existsSync(from)) throw new Error(`missing static asset: ${asset}`);
    cpSync(from, join(outDir, asset), { recursive: statSync(from).isDirectory() });
  }
  // Components that support.js fetches at runtime import data too.
  for (const comp of STATIC_ASSETS.filter((a) => a.endsWith('.dc.html'))) {
    const dest = join(outDir, comp);
    writeFileSync(dest, versionAssetRefs(readFileSync(dest, 'utf8'), versions));
  }
  writeSitemap(srcDir, outDir, pages);
  log(`Built ${pages.length} pages into ${relative(process.cwd(), outDir) || outDir}`);
  return { pages };
}

if (process.argv[1] && resolvePath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
