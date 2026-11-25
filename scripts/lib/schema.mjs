// JSON-LD structured data for every page. Facts about the company live here in
// one place; page-specific values (titles, descriptions, FAQs) come from the
// pages and bams-data.js at build time.

export const SITE = 'https://bamstechnology.com';
export const ORG_ID = SITE + '/#organization';

export const COMPANY = {
  name: 'BAMS Technology Inc.',
  shortName: 'BAMS Technology',
  url: SITE,
  logo: SITE + '/BAMS_Logo_Blue.png',
  image: SITE + '/assets/og-image.png',
  telephone: '+1-754-444-7773',
  email: 'info@bamstechnology.com',
  founder: 'Alex Zilberberg',
  areaServed: 'US',
  // Only profiles that really belong to the company. Add LinkedIn / Google
  // Business Profile URLs here once they exist.
  sameAs: ['https://www.dnb.com/business-directory/company-profiles/bams-technology-inc.b9a0ed9a3f9939a60897632311e5bf40'],
  knowsAbout: [
    'Managed IT Services', 'Cybersecurity', 'SOC Monitoring', 'Penetration Testing', 'Incident Response',
    'AI Integration', 'Custom Software Development', 'IP Security Cameras', 'Access Control',
    'Microsoft 365', 'Technology Procurement', 'Patient Scheduling Software',
  ],
};

// Fields shared by the Organization and ProfessionalService entities.
const entityFields = () => ({
  name: COMPANY.name,
  legalName: COMPANY.name,
  alternateName: COMPANY.shortName,
  url: COMPANY.url,
  logo: { '@type': 'ImageObject', url: COMPANY.logo },
  image: COMPANY.image,
  telephone: COMPANY.telephone,
  email: COMPANY.email,
  founder: { '@type': 'Person', name: COMPANY.founder },
  areaServed: COMPANY.areaServed,
  knowsAbout: COMPANY.knowsAbout,
  sameAs: COMPANY.sameAs,
});

const providerRef = () => ({ '@type': 'Organization', '@id': ORG_ID, name: COMPANY.name, url: COMPANY.url });

export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    ...entityFields(),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY.telephone,
      email: COMPANY.email,
      contactType: 'sales',
      areaServed: COMPANY.areaServed,
      availableLanguage: 'English',
    },
  };
}

export function professionalService(services, description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': SITE + '/#business',
    ...entityFields(),
    description,
    parentOrganization: { '@id': ORG_ID },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'BAMS Technology services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, url: SITE + s.file, description: s.description },
      })),
    },
  };
}

export function website() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE + '/#website',
    name: COMPANY.shortName,
    url: SITE + '/',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbs(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

export function service(svc, description, url) {
  const out = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': url + '#service',
    name: svc.title,
    serviceType: svc.title.replace(/\s*\(.*\)$/, ''),
    description,
    url,
    provider: providerRef(),
    areaServed: COMPANY.areaServed,
    category: svc.tags,
  };
  if (svc.directAnswer) out.disambiguatingDescription = svc.directAnswer;
  if (svc.capabilities && svc.capabilities.length) {
    out.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: svc.title + ' capabilities',
      itemListElement: svc.capabilities.map((c) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: c.title, description: c.description, serviceType: c.items.join(', ') },
      })),
    };
  }
  return out;
}

export function faqPage(faqs, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': url + '#faq',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function softwareApplication(description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': url + '#software',
    name: 'VisitConnect',
    alternateName: 'VisitConnect by BAMS Technology',
    applicationCategory: 'HealthApplication',
    applicationSubCategory: 'Patient scheduling and intake',
    operatingSystem: 'Web',
    description,
    url,
    image: COMPANY.image,
    provider: providerRef(),
    publisher: providerRef(),
    offers: {
      '@type': 'Offer',
      url: SITE + '/contact-us?product=visitconnect',
      availability: 'https://schema.org/InStock',
      seller: providerRef(),
      description: 'Pricing is scoped per practice. Book a walkthrough for a quote.',
    },
  };
}

export function article({ headline, description, url, section, about, datePublished, dateModified }) {
  const org = { ...providerRef(), logo: { '@type': 'ImageObject', url: COMPANY.logo } };
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url + '#article',
    headline,
    description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: COMPANY.image,
    articleSection: section,
    about,
    author: org,
    publisher: org,
    datePublished,
    dateModified,
  };
}

export function itemList(name, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: it.url, name: it.name })),
  };
}

export function webPage(type, { name, description, url }) {
  const page = { '@context': 'https://schema.org', '@type': type, name, description, isPartOf: { '@id': SITE + '/#website' }, publisher: { '@id': ORG_ID } };
  if (url) page.url = url;
  return page;
}

/** Serialize for a <script> block; escape "<" so the JSON can't close the tag. */
export const toScript = (obj) => '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, '\\u003c') + '</script>';
