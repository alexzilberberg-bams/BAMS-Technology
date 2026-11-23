// Zero-dependency renderer for the site's <x-dc> templates.
//
// The live site renders <x-dc> templates in the browser with support.js
// (React + a small template language: {{ expr }}, <sc-for>, <sc-if>,
// <dc-import>, <helmet>). Crawlers that don't run JavaScript only ever see the
// raw template. This module reproduces the same rendering at build time so
// every page ships real HTML. The semantics mirror support.js (src/compile.ts
// and src/expr.ts); keep the two in step if the runtime changes.

const VOID = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title']);

// ---------------------------------------------------------------------------
// Parsing

const TAG_OPEN_RE = /<([a-zA-Z][\w:.-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/y;
const TAG_CLOSE_RE = /<\/([a-zA-Z][\w:.-]*)\s*>/y;
const ATTR_RE = /([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

export function parseAttrs(src) {
  const attrs = [];
  ATTR_RE.lastIndex = 0;
  let m;
  while ((m = ATTR_RE.exec(src))) {
    const raw = m[2] ?? m[3] ?? m[4];
    attrs.push({ name: m[1], value: raw ?? '', bare: raw === undefined });
  }
  return attrs;
}

/** Parse an HTML fragment into a light tree: {type:'el'|'text', ...}. */
export function parse(src) {
  const root = { type: 'root', tag: '#root', children: [] };
  const stack = [root];
  let i = 0;
  const top = () => stack[stack.length - 1];
  while (i < src.length) {
    const lt = src.indexOf('<', i);
    if (lt === -1) {
      pushText(top(), src.slice(i));
      break;
    }
    if (lt > i) pushText(top(), src.slice(i, lt));
    i = lt;
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      i = end === -1 ? src.length : end + 3;
      continue;
    }
    if (src[i + 1] === '!' || src[i + 1] === '?') {
      const end = src.indexOf('>', i);
      i = end === -1 ? src.length : end + 1;
      continue;
    }
    TAG_CLOSE_RE.lastIndex = i;
    let m = TAG_CLOSE_RE.exec(src);
    if (m) {
      const name = m[1].toLowerCase();
      const idx = stack.map((n) => n.tag).lastIndexOf(name);
      if (idx > 0) {
        for (let k = stack.length - 1; k >= idx; k--) stack[k].innerEnd ??= i;
        stack.length = idx;
      }
      i += m[0].length;
      continue;
    }
    TAG_OPEN_RE.lastIndex = i;
    m = TAG_OPEN_RE.exec(src);
    if (!m) {
      pushText(top(), '<');
      i += 1;
      continue;
    }
    const tag = m[1].toLowerCase();
    const selfClose = /\/\s*$/.test(m[2]);
    const node = {
      type: 'el',
      tag,
      srcTag: m[1],
      attrs: parseAttrs(selfClose ? m[2].replace(/\/\s*$/, '') : m[2]),
      children: [],
      selfClose,
      start: i,
      innerStart: i + m[0].length,
    };
    top().children.push(node);
    i += m[0].length;
    if (VOID.has(tag) || selfClose) continue;
    if (RAW_TEXT.has(tag)) {
      const close = new RegExp('</' + tag + '\\s*>', 'ig');
      close.lastIndex = i;
      const cm = close.exec(src);
      const end = cm ? cm.index : src.length;
      if (end > i) node.children.push({ type: 'text', text: src.slice(i, end) });
      node.innerEnd = end;
      i = cm ? end + cm[0].length : src.length;
      continue;
    }
    stack.push(node);
  }
  return root;
}

function pushText(parent, text) {
  if (!text) return;
  const last = parent.children[parent.children.length - 1];
  if (last && last.type === 'text') last.text += text;
  else parent.children.push({ type: 'text', text });
}

// ---------------------------------------------------------------------------
// Expressions (port of support.js src/expr.ts)

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*/;
const NUMBER_RE = /^-?\d+(\.\d+)?$/;

export function resolve(vals, src) {
  const expr = String(src).trim();
  if (!expr) return undefined;
  if (expr[0] === '(' && expr[expr.length - 1] === ')' && parensWrapWhole(expr)) return resolve(vals, expr.slice(1, -1));
  const eq = findTopLevelEquality(expr);
  if (eq) {
    const lv = resolve(vals, expr.slice(0, eq.index));
    const rv = resolve(vals, expr.slice(eq.index + eq.op.length));
    switch (eq.op) {
      case '===': return lv === rv;
      case '!==': return lv !== rv;
      case '==': return lv == rv; // eslint-disable-line eqeqeq
      default: return lv != rv; // eslint-disable-line eqeqeq
    }
  }
  if (expr[0] === '!') return !resolve(vals, expr.slice(1));
  if (expr === 'true') return true;
  if (expr === 'false') return false;
  if (expr === 'null') return null;
  if (expr === 'undefined') return undefined;
  if (NUMBER_RE.test(expr)) return Number(expr);
  if (expr.length >= 2 && (expr[0] === '"' || expr[0] === "'") && expr[expr.length - 1] === expr[0]) return expr.slice(1, -1);
  return resolvePath(vals, expr);
}

function parensWrapWhole(expr) {
  let depth = 0;
  for (let i = 0; i < expr.length - 1; i++) {
    if (expr[i] === '(') depth++;
    else if (expr[i] === ')') {
      depth--;
      if (depth === 0) return false;
    }
  }
  return true;
}

function findTopLevelEquality(expr) {
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth--;
    else if (depth === 0 && (c === '=' || c === '!') && expr[i + 1] === '=') {
      if (i > 0 && (expr[i - 1] === '=' || expr[i - 1] === '!')) continue;
      if (!expr.slice(0, i).trim()) continue;
      const op = expr[i + 2] === '=' ? c + '==' : c + '=';
      return { index: i, op };
    }
  }
  return null;
}

function resolvePath(vals, expr) {
  const head = expr.match(IDENT_RE);
  if (!head) return undefined;
  let cur = vals == null ? undefined : vals[head[0]];
  let i = head[0].length;
  while (i < expr.length) {
    if (expr[i] === '.') {
      const m = expr.slice(i + 1).match(IDENT_RE) || expr.slice(i + 1).match(/^\d+/);
      if (!m) return undefined;
      cur = cur == null ? undefined : cur[m[0]];
      i += 1 + m[0].length;
    } else if (expr[i] === '[') {
      let depth = 1;
      let j = i + 1;
      while (j < expr.length && depth > 0) {
        if (expr[j] === '[') depth++;
        else if (expr[j] === ']') {
          depth--;
          if (depth === 0) break;
        }
        j++;
      }
      if (depth !== 0) return undefined;
      const key = resolve(vals, expr.slice(i + 1, j));
      cur = cur == null ? undefined : cur[key];
      i = j + 1;
    } else {
      return undefined;
    }
  }
  return cur;
}

// ---------------------------------------------------------------------------
// Rendering

export const escapeText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const escapeAttr = (s) => escapeText(s).replace(/"/g, '&quot;');

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
export function decodeEntities(s) {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? all;
  });
}

const INTERP_RE = /\{\{([\s\S]+?)\}\}/g;
const WHOLE_RE = /^\s*\{\{([\s\S]+?)\}\}\s*$/;

/** Evaluate an attribute value the way support.js compileAttr() does. */
export function evalAttr(raw, vals) {
  const whole = raw.match(WHOLE_RE);
  if (whole) return resolve(vals, decodeEntities(whole[1]));
  if (raw.includes('{{')) {
    return raw.split(INTERP_RE).map((s, i) => (i & 1 ? resolve(vals, decodeEntities(s)) ?? '' : decodeEntities(s))).join('');
  }
  return decodeEntities(raw);
}

function textValue(v) {
  if (v === undefined || v === null || typeof v === 'boolean' || typeof v === 'function') return '';
  if (Array.isArray(v)) return v.map(textValue).join('');
  return escapeText(String(v));
}

function renderText(text, vals) {
  if (!text.includes('{{')) {
    // support.js drops whitespace-only text nodes that hold no plain space.
    if (!text.trim() && !text.includes(' ')) return '';
    return text;
  }
  return text.split(INTERP_RE).map((p, i) => (i & 1 ? textValue(resolve(vals, decodeEntities(p))) : p)).join('');
}

function renderAttrs(node, vals) {
  let out = '';
  let textareaValue;
  for (const a of node.attrs) {
    const lname = a.name.toLowerCase();
    // Event handlers are bound by React at runtime; the static page has none.
    if (lname.startsWith('on') || lname.startsWith('hint-') || lname === 'sc-name' || lname.startsWith('style-')) continue;
    if (a.bare) {
      out += ' ' + a.name;
      continue;
    }
    if (!a.value.includes('{{')) {
      if (node.tag === 'textarea' && lname === 'value') textareaValue = decodeEntities(a.value);
      else out += ' ' + a.name + '="' + a.value + '"';
      continue;
    }
    let v = evalAttr(a.value, vals);
    if ((lname === 'value' || lname === 'checked') && v === undefined) v = lname === 'checked' ? false : '';
    if (node.tag === 'textarea' && lname === 'value') {
      textareaValue = v == null ? '' : String(v);
      continue;
    }
    if (v === undefined || v === null || v === false || typeof v === 'function' || typeof v === 'object') continue;
    if (v === true) {
      out += ' ' + a.name;
      continue;
    }
    out += ' ' + a.name + '="' + escapeAttr(v) + '"';
  }
  return { attrs: out, textareaValue };
}

/**
 * Render a parsed template.
 * ctx: { helmets: string[], src: string, renderComponent(name, props, ctx) => string }
 */
export function render(node, vals, ctx) {
  if (node.type === 'text') return renderText(node.text, vals);
  if (node.type === 'root') return renderChildren(node, vals, ctx);
  switch (node.tag) {
    case 'sc-for': {
      const listAttr = node.attrs.find((a) => a.name.toLowerCase() === 'list');
      const asAttr = node.attrs.find((a) => a.name.toLowerCase() === 'as');
      const list = listAttr ? evalAttr(listAttr.value, vals) : undefined;
      if (!Array.isArray(list)) return '';
      const asName = asAttr ? asAttr.value : 'item';
      return list.map((item, i) => renderChildren(node, { ...vals, [asName]: item, $index: i }, ctx)).join('');
    }
    case 'sc-if': {
      const valueAttr = node.attrs.find((a) => a.name.toLowerCase() === 'value');
      return valueAttr && evalAttr(valueAttr.value, vals) ? renderChildren(node, vals, ctx) : '';
    }
    case 'helmet':
      ctx.helmets.push(ctx.src.slice(node.innerStart, node.innerEnd ?? node.innerStart));
      return '';
    case 'dc-import':
    case 'x-import': {
      const props = {};
      let name = '';
      for (const a of node.attrs) {
        const lname = a.name.toLowerCase();
        if (lname === 'name' || lname === 'component') {
          name = a.value;
          continue;
        }
        if (lname === 'hint-size' || lname === 'style') continue;
        props[lname.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = evalAttr(a.value, vals);
      }
      return ctx.renderComponent(name, props, ctx);
    }
    default: {
      const { attrs, textareaValue } = renderAttrs(node, vals);
      const open = '<' + node.srcTag + attrs;
      if (VOID.has(node.tag)) return open + '>';
      if (node.selfClose) return open + '/>';
      let inner;
      if (node.tag === 'textarea') inner = textareaValue !== undefined ? escapeText(textareaValue) : renderChildren(node, vals, ctx);
      else if (RAW_TEXT.has(node.tag)) inner = node.children.map((c) => c.text).join('');
      else inner = renderChildren(node, vals, ctx);
      return open + '>' + inner + '</' + node.srcTag + '>';
    }
  }
}

function renderChildren(node, vals, ctx) {
  return node.children.map((c) => render(c, vals, ctx)).join('');
}
