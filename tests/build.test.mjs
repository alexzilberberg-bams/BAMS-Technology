import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, listPages, routeFor, STATIC_ASSETS } from '../scripts/build.mjs';
import { evalAttr, parse, render, resolve as resolveExpr } from '../scripts/lib/template.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let out;
let pages;

before(async () => {
  out = mkdtempSync(join(tmpdir(), 'bams-dist-'));
  await build({ srcDir: ROOT, outDir: out, log: () => {} });
  pages = listPages(ROOT);
});
after(() => rmSync(out, { recursive: true, force: true }));

const read = (file) => readFileSync(join(out, file), 'utf8');
// What a non-JS crawler sees: drop inert <template>, scripts and styles.
const visible = (html) => html
  .replace(/<template[\s\S]*?<\/template>/gi, '')
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '');
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const jsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const types = (blocks) => blocks.flatMap((b) => [].concat(b['@type']));

describe('template renderer', () => {
  test('resolves paths, indexes, literals and equality like support.js', () => {
    const vals = { a: { b: [{ c: 'x' }] }, k: 'b', n: 2 };
    assert.equal(resolveExpr(vals, 'a.b.0.c'), 'x');
    assert.equal(resolveExpr(vals, 'a[k][0].c'), 'x');
    assert.equal(resolveExpr(vals, "n === 2"), true);
    assert.equal(resolveExpr(vals, '!missing'), true);
    assert.equal(resolveExpr(vals, "'lit'"), 'lit');
  });

  test('expands sc-for / sc-if and escapes interpolated values', () => {
    const tpl = '<ul><sc-for list="{{ items }}" as="it"><sc-if value="{{ it.show }}"><li class="{{ it.cls }}">{{ it.label }}</li></sc-if></sc-for></ul>';
    const html = render(parse(tpl), { items: [{ show: true, cls: 'a', label: '<b>&' }, { show: false, label: 'hidden' }] }, { helmets: [], src: tpl });
    assert.equal(html, '<ul><li class="a">&lt;b&gt;&amp;</li></ul>');
  });

  test('drops event handlers and keeps mixed attribute interpolation', () => {
    const tpl = '<button onClick="{{ go }}" style="color:{{ c }};margin:0">Go</button>';
    assert.equal(render(parse(tpl), { go: () => {}, c: '#fff' }, { helmets: [], src: tpl }), '<button style="color:#fff;margin:0">Go</button>');
    assert.equal(evalAttr('{{ x }}', { x: 3 }), 3);
  });
});

describe('dist output', () => {
  test('every page is built, plus all static assets', () => {
    assert.ok(pages.length >= 17, `expected all site pages, got ${pages.length}`);
    for (const p of pages) assert.ok(existsSync(join(out, p)), `${p} missing from dist`);
    for (const a of STATIC_ASSETS) assert.ok(existsSync(join(out, a)), `${a} missing from dist`);
  });

  test('every page has rendered <h1> text and no unrendered template syntax', () => {
    for (const p of pages) {
      const html = visible(read(p));
      const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
      assert.ok(h1 && text(h1[1]).length > 3, `${p}: no rendered <h1>`);
      assert.ok(!html.includes('{{'), `${p}: unrendered {{ }} placeholder`);
      assert.ok(!/<sc-(for|if)\b/i.test(html), `${p}: leftover <sc-for>/<sc-if>`);
      assert.ok(!/<x-dc\b/i.test(html), `${p}: raw <x-dc> outside <template>`);
    }
  });

  test('pre-rendered pages keep nav, main and footer as real HTML', () => {
    for (const p of pages.filter((f) => f !== '404.html')) {
      const html = visible(read(p));
      assert.match(html, /<nav\b/, `${p}: no <nav>`);
      assert.match(html, /<main\b/, `${p}: no <main>`);
      assert.match(html, /<footer\b[\s\S]*href="\/privacy-policy"/, `${p}: footer links not rendered`);
    }
  });

  test('pre-rendered pages still boot support.js for interactivity', () => {
    for (const p of pages.filter((f) => f !== '404.html')) {
      const html = read(p);
      assert.match(html, /<script src="\/support\.js"><\/script>/, `${p}: support.js not loaded`);
      assert.match(html, /<template id="dc-src"><x-dc[\s\S]*<\/x-dc><\/template>/, `${p}: template not preserved`);
      if (readFileSync(join(ROOT, p), 'utf8').includes('data-dc-script')) {
        assert.match(html, /<script type="text\/x-dc" data-dc-script/, `${p}: component logic missing`);
      }
    }
  });

  test('every page has valid JSON-LD, a unique title, a description and a canonical', () => {
    const titles = new Map();
    for (const p of pages) {
      const html = read(p);
      const blocks = jsonLd(html);
      assert.ok(blocks.length > 0, `${p}: no JSON-LD`);
      for (const b of blocks) assert.equal(b['@context'], 'https://schema.org', `${p}: bad @context`);
      const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
      assert.ok(title, `${p}: no <title>`);
      assert.ok(!titles.has(title), `${p}: title duplicates ${titles.get(title)}`);
      titles.set(title, p);
      assert.match(html, /<meta name="description" content="[^"]{30,}">/, `${p}: no meta description`);
      if (p === '404.html') continue; // served at arbitrary URLs and noindex, so no canonical
      const canon = [...html.matchAll(/<link rel="canonical" href="([^"]+)">/g)].map((m) => m[1]);
      assert.ok(canon.length >= 1, `${p}: no canonical`);
      assert.equal(new Set(canon).size, 1, `${p}: conflicting canonicals`);
      assert.equal(canon[0], 'https://bamstechnology.com' + routeFor(p), `${p}: canonical points elsewhere`);
    }
  });

  test('BreadcrumbList on every indexable page', () => {
    for (const p of pages.filter((f) => f !== '404.html')) {
      const crumbs = jsonLd(read(p)).find((b) => b['@type'] === 'BreadcrumbList');
      assert.ok(crumbs, `${p}: no BreadcrumbList`);
      assert.equal(crumbs.itemListElement[0].item, 'https://bamstechnology.com/');
    }
  });

  test('homepage has Organization and ProfessionalService for BAMS Technology Inc.', () => {
    const blocks = jsonLd(read('index.html'));
    const org = blocks.find((b) => b['@type'] === 'Organization');
    assert.equal(org.name, 'BAMS Technology Inc.');
    assert.equal(org.telephone, '+1-754-444-7773');
    assert.equal(org.email, 'info@bamstechnology.com');
    assert.equal(org.founder.name, 'Alex Zilberberg');
    assert.equal(org.areaServed, 'US');
    assert.ok(org.sameAs.some((u) => u.startsWith('https://www.dnb.com/')));
    assert.ok(blocks.find((b) => b['@type'] === 'ProfessionalService'));
  });

  test('service pages have Service + FAQPage built from bams-data.js', () => {
    for (const key of ['managed-it', 'cybersecurity', 'ai-integration', 'tech-advisory', 'custom-software', 'security-cameras']) {
      const html = read(key + '.html');
      const blocks = jsonLd(html);
      const svc = blocks.find((b) => b['@type'] === 'Service');
      assert.ok(svc, `${key}: no Service schema`);
      assert.equal(svc.provider.name, 'BAMS Technology Inc.');
      assert.equal(svc.areaServed, 'US');
      const faq = blocks.find((b) => b['@type'] === 'FAQPage');
      assert.ok(faq && faq.mainEntity.length >= 4, `${key}: FAQPage missing or short`);
      // Each FAQ answer is also visible on the page (Google requires it).
      for (const q of faq.mainEntity) assert.ok(text(visible(html)).includes(q.acceptedAnswer.text), `${key}: FAQ answer not visible`);
      // Every service now has its own sections instead of the generic fallback.
      assert.match(html, /\/\/ THE PROBLEM/, `${key}: no challenges section`);
      assert.match(html, /\/\/ CORE CAPABILITIES/, `${key}: no capabilities section`);
      assert.match(html, /href="\/contact-us"[^>]*>BOOK A FREE ASSESSMENT/, `${key}: bottom CTA not pointing at contact`);
    }
  });

  test('VisitConnect has SoftwareApplication + FAQPage and CTAs to the contact page', () => {
    const html = read('visitconnect.html');
    const t = types(jsonLd(html));
    assert.ok(t.includes('SoftwareApplication') && t.includes('FAQPage'));
    const app = jsonLd(html).find((b) => b['@type'] === 'SoftwareApplication');
    assert.equal(app.applicationCategory, 'HealthApplication');
    assert.equal(app.operatingSystem, 'Web');
    const ctas = [...visible(html).matchAll(/<a href="([^"]+)"[^>]*>BOOK A 15-MINUTE WALKTHROUGH/g)].map((m) => m[1]);
    assert.ok(ctas.length >= 2 && ctas.every((h) => h === '/contact-us?product=visitconnect'), 'walkthrough CTAs');
    assert.match(visible(html), /href="mailto:info@bamstechnology\.com/, 'mailto fallback link');
  });

  test('homepage links to /visitconnect and no longer repeats the stats block', () => {
    const html = visible(read('index.html'));
    assert.match(html, /href="\/visitconnect"/);
    assert.ok(!html.includes('TECHNOLOGY IMPACT'));
    assert.equal((html.match(/Average Uptime/g) || []).length, 1);
  });

  test('case studies have Article schema', () => {
    for (const p of pages.filter((f) => f.startsWith('case-study/'))) {
      const art = jsonLd(read(p)).find((b) => b['@type'] === 'Article');
      assert.ok(art && art.headline && art.description && art.publisher.name === 'BAMS Technology Inc.', `${p}: Article schema`);
      assert.match(art.datePublished, /^\d{4}-\d{2}-\d{2}$/);
    }
  });

  test('no relative asset links; every local link and asset resolves (nested pages included)', () => {
    const routes = new Set(pages.map(routeFor));
    for (const p of pages) {
      const html = read(p);
      const body = visible(html.slice(0, html.indexOf('</head>'))) + visible(html.slice(html.indexOf('</head>')));
      for (const [, attr, url] of body.matchAll(/\s(src|href)="([^"]*)"/g)) {
        if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(url)) continue;
        assert.ok(url.startsWith('/'), `${p}: relative ${attr}="${url}" breaks on nested routes`);
        const path = url.split(/[?#]/)[0];
        if (routes.has(path) || path === '/') continue;
        assert.ok(existsSync(join(out, posix.normalize(path))), `${p}: ${attr}="${url}" does not exist in dist`);
      }
    }
  });

  test('sitemap lastmod dates are real dates and llms.txt ships', () => {
    const xml = read('sitemap.xml');
    const mods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
    assert.ok(mods.length >= 16);
    for (const d of mods) assert.match(d, /^\d{4}-\d{2}-\d{2}$/);
    const llms = read('llms.txt');
    assert.match(llms, /^# BAMS Technology/);
    for (const path of ['/managed-it', '/cybersecurity', '/ai-integration', '/tech-advisory', '/custom-software', '/security-cameras', '/visitconnect', '/case-studies', '/partners', '/contact-us']) {
      assert.ok(llms.includes('https://bamstechnology.com' + path), `llms.txt missing ${path}`);
    }
  });
});
