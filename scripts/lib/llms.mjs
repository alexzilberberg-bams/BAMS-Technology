// Generates /llms.txt (a short index for AI crawlers, per llmstxt.org) and
// /llms-full.txt (every service, capability, FAQ and case study as plain
// Markdown) from the same data the pages render, so they never drift apart.

import { COMPANY, SITE } from './schema.mjs';

const PHONE = '(754) 444-7773';

export const OVERVIEW = `${COMPANY.name} is a US technology services company that provides managed IT, cybersecurity, AI integration, custom software, security camera systems and vendor-neutral technology procurement for businesses, with nationwide coverage across the United States. BAMS also builds VisitConnect, online patient booking and front-desk workflow software for medical practices.`;

const ABOUT = `Most support is delivered remotely, with onsite work arranged for installs, hardware and projects. Every engagement starts with a free assessment. Contact: ${PHONE}, ${COMPANY.email}.`;

const url = (path) => SITE + path;
const oneLine = (s) => String(s).replace(/\s+/g, ' ').trim();

/**
 * @param data  the bams-data.js module
 * @param pages rendered pages from build(): { route, meta, components }
 */
function context(data, pages) {
  const page = (route) => pages.find((p) => p.route === route);
  const vc = page('/visitconnect');
  return {
    services: data.services,
    caseStudies: data.caseStudies,
    partners: data.partnerPrograms || [],
    vcMeta: vc ? vc.meta : { description: '' },
    vcVals: (vc && vc.components[0] && vc.components[0].vals) || {},
  };
}

export function llmsIndex(data, pages) {
  const { services, caseStudies, partners, vcMeta } = context(data, pages);
  const lines = [
    `# ${COMPANY.shortName}`,
    '',
    `> ${OVERVIEW}`,
    '',
    ABOUT,
    '',
    '## Services',
    '',
    ...services.map((s) => `- [${s.title}](${url(s.file)}): ${oneLine(s.directAnswer || s.description)}`),
    '',
    '## Products',
    '',
    `- [VisitConnect](${url('/visitconnect')}): ${oneLine(vcMeta.description)} It connects with the EMR where the EMR provider supports it, and otherwise staff attach a single PDF. VisitConnect Voice is an optional add-on.`,
    '',
    '## Case studies',
    '',
    ...caseStudies.map((c) => `- [${c.title}](${url('/case-study/' + c.key)}): ${oneLine(c.summary)} Result: ${oneLine(c.result)}.`),
    '',
    '## Partner programs',
    '',
    ...partners.map((p) => `- [${p.name}](${p.href}): ${oneLine(p.tagline)}`),
    '',
    '## Company',
    '',
    `- [Case Studies](${url('/case-studies')}): Anonymized examples of BAMS client work.`,
    `- [Partners](${url('/partners')}): Technology, security and procurement partners BAMS works with.`,
    `- [Contact](${url('/contact-us')}): Book a free assessment or a VisitConnect walkthrough. Phone ${PHONE}, email ${COMPANY.email}.`,
    '',
    '## Optional',
    '',
    `- [Full text for LLMs](${url('/llms-full.txt')}): Every service, capability, FAQ and case study on one page.`,
    '',
  ];
  return lines.join('\n');
}

export function llmsFull(data, pages) {
  const { services, caseStudies, partners, vcMeta, vcVals } = context(data, pages);
  const out = [`# ${COMPANY.shortName}: full site content`, '', `> ${OVERVIEW}`, '', ABOUT, '', `Website: ${SITE}`, ''];

  out.push('## Services', '');
  for (const s of services) {
    out.push(`### ${s.title}`, '', `URL: ${url(s.file)}`, '');
    if (s.directQuestion && s.directAnswer) out.push(`**${s.directQuestion}** ${oneLine(s.directAnswer)}`, '');
    out.push(oneLine(s.description), '');
    if (s.challenges) {
      out.push('#### Problems this solves', '');
      for (const c of s.challenges) out.push(`- **${c.title}.** ${oneLine(c.desc)}`);
      out.push('');
    }
    if (s.capabilities) {
      out.push('#### Capabilities', '');
      for (const c of s.capabilities) out.push(`- **${c.title}:** ${oneLine(c.description)} (${c.items.join(', ')})`);
      out.push('');
    }
    if (s.whyChoose) {
      out.push('#### Why BAMS', '');
      for (const w of s.whyChoose) out.push(`- **${w.title}:** ${oneLine(w.desc)}`);
      out.push('');
    }
    if (s.process4) {
      out.push('#### How it works', '');
      for (const p of s.process4) out.push(`${p.n}. **${p.title}:** ${oneLine(p.desc)}`);
      out.push('');
    }
    if (s.faqs) {
      out.push('#### FAQ', '');
      for (const f of s.faqs) out.push(`**Q: ${f.q}**`, '', oneLine(f.a), '');
    }
  }

  out.push('## VisitConnect', '', `URL: ${url('/visitconnect')}`, '', oneLine(vcMeta.description), '');
  if (vcVals.workflows) {
    out.push('### Features', '');
    for (const w of vcVals.workflows) out.push(`- **${w.title}:** ${oneLine(w.description)}`);
    out.push('');
  }
  if (vcVals.rolloutSteps) {
    out.push('### Rollout', '');
    for (const r of vcVals.rolloutSteps) out.push(`${Number(r.n)}. **${r.title}:** ${oneLine(r.desc)}`);
    out.push('');
  }
  out.push('VisitConnect Voice is an optional add-on for calls that still come in, scoped separately based on call volume and phone system.', '');
  if (vcVals.faqs) {
    out.push('### FAQ', '');
    for (const f of vcVals.faqs) out.push(`**Q: ${f.q}**`, '', oneLine(f.a), '');
  }

  out.push('## Case studies', '');
  for (const c of caseStudies) {
    out.push(`### ${c.title}`, '', `URL: ${url('/case-study/' + c.key)}`, `Industry: ${c.industry}`, `Result: ${oneLine(c.result)}`, '');
    out.push(`**Challenge:** ${oneLine(c.challenge)}`, '', '**Approach:**', '');
    for (const a of c.approach) out.push(`- ${oneLine(a)}`);
    out.push('', `**Outcome:** ${oneLine(c.outcome)}`, '');
  }

  if (partners.length) {
    out.push('## Partner programs', '');
    for (const p of partners) out.push(`- **${p.name}** (${p.href}): ${oneLine(p.description)}`);
    out.push('');
  }

  out.push('## Contact', '', `- Phone: ${PHONE}`, `- Email: ${COMPANY.email}`, `- Contact form: ${url('/contact-us')}`, '');
  return out.join('\n');
}
