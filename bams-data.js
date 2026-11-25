// Long-form service content. Each service page renders these sections (and the
// FAQ answers feed the FAQPage JSON-LD that scripts/build.mjs injects), so keep
// the copy factual: what BAMS actually does, no invented numbers.
const serviceDetails = {
  'ai-integration': {
    directQuestion: 'What is BAMS Technology\'s AI integration service?',
    directAnswer: 'BAMS Technology\'s AI integration service builds AI chatbots, internal assistants and workflow automation into the systems a business already uses. It connects models from providers such as OpenAI, Anthropic and Azure OpenAI to your data through their APIs, with access controls, logging and a human fallback built in.',
    relatedServices: ['custom-software', 'managed-it', 'cybersecurity'],
    challengesHeading: 'Why AI projects stall.',
    challenges: [
      { title: 'Pilots that never reach production', desc: 'A chatbot demo is easy. Wiring it into your real data, permissions and workflows is where most AI projects stop.' },
      { title: 'Knowledge scattered across systems', desc: 'Answers live in email, file shares, CRMs and PDFs, so an AI model has nothing reliable to work from.' },
      { title: 'No rules for data handling', desc: 'Staff paste customer data into public AI tools with no policy on what can be shared or where it ends up.' },
      { title: 'Repetitive work still done by hand', desc: 'Data entry, inbox triage and document handling eat hours that automation could take over.' },
    ],
    capabilities: [
      { title: 'AI Chatbots & Assistants', description: 'Customer-facing and internal assistants grounded in your own documents and data, with a clear handoff to a person when a question needs one.', items: ['Website Chat', 'Internal Knowledge Assistants', 'Search Over Your Documents', 'Human Handoff'] },
      { title: 'Workflow & Process Automation', description: 'We automate the repetitive steps between your systems, such as intake, routing, data entry and follow-ups, with AI handling the parts that need judgment.', items: ['Email & Document Triage', 'Data Extraction', 'Approval Flows', 'Scheduled Jobs'] },
      { title: 'LLM Integration', description: 'We connect models from providers such as OpenAI, Anthropic and Azure OpenAI to the applications you already run, through their APIs.', items: ['OpenAI', 'Anthropic Claude', 'Azure OpenAI', 'CRM & API Integration', 'Prompt & Output Testing'] },
      { title: 'Internal AI Tooling', description: 'Purpose-built tools that put AI where your staff already work, instead of adding yet another separate app.', items: ['Report Generation', 'Internal Search', 'Dashboards', 'Microsoft 365 Integration'] },
      { title: 'Governance & Security', description: 'Access controls, logging and data-handling rules so AI use fits your security and compliance requirements.', items: ['Access Controls', 'Usage Logging', 'Data Handling Policies', 'Vendor Review'] },
    ],
    whyChoose: [
      { title: 'Security First', desc: 'Built by a team that also runs cybersecurity, so data access and permissions are designed in from the start.' },
      { title: 'Built on Your Systems', desc: 'We integrate with the tools you already use instead of asking you to switch platforms.' },
      { title: 'Model-Agnostic', desc: 'We pick the AI provider that fits the job and your data rules.' },
      { title: 'Engineers, Not Just Advisors', desc: 'The team that scopes the project also builds and maintains it.' },
    ],
    process4: [
      { n: '1', title: 'Discover', desc: 'Find the workflows where AI saves real time, and confirm what data it can safely use.' },
      { n: '2', title: 'Prototype', desc: 'Build a working version on your real data and test it with the people who will use it.' },
      { n: '3', title: 'Integrate', desc: 'Connect it to your systems with access controls, logging and a clear human fallback.' },
      { n: '4', title: 'Support', desc: 'Monitor answer quality, update models and prompts, and extend it as your needs change.' },
    ],
    faqs: [
      { q: 'What kinds of AI integration does BAMS Technology build?', a: 'We build AI chatbots and internal assistants, workflow and document automation, and integrations that connect large language models such as OpenAI, Anthropic Claude and Azure OpenAI to the systems you already run, including your CRM, Microsoft 365, databases and line-of-business applications.' },
      { q: 'Is our data safe when we use AI tools?', a: 'It can be, when the system is designed for it. We set up access controls, logging and data-handling rules, and choose providers and configurations that match your requirements, such as business API terms. Sensitive data is only connected when there is a clear need and your approval.' },
      { q: 'Do we need to replace our current software to use AI?', a: 'No. Most of our AI work plugs into your existing systems through their APIs, so your team keeps the tools they already know. Where no API exists, we build a small custom integration or a lightweight internal tool around the workflow instead.' },
      { q: 'How does an AI project with BAMS start?', a: 'It starts with a free assessment. We review your workflows, pick one or two where automation or an assistant would save real time, and build a working prototype on your data before anything goes into production. That keeps the first phase small and the results easy to judge.' },
      { q: 'Who maintains the AI system after launch?', a: 'We can. BAMS monitors answer quality, updates prompts and models as providers release new versions, and extends the system as your needs grow. If you would rather run it in-house, we document how everything is set up and hand it over to your team.' },
    ],
  },
  'cybersecurity': {
    directQuestion: 'What is BAMS Technology\'s managed cybersecurity (MSSP) service?',
    directAnswer: 'BAMS Technology is a managed security service provider (MSSP). It protects businesses with 24/7 SOC monitoring through its security partners, endpoint detection and response, email and identity protection, vulnerability scanning, penetration testing and incident response, including removing malware and backdoors and restoring clean systems after an attack.',
    relatedServices: ['managed-it', 'security-cameras', 'tech-advisory'],
    challengesHeading: 'Why attackers keep getting in.',
    challenges: [
      { title: 'Phishing that looks legitimate', desc: 'Lookalike domains and convincing emails slip past filters and catch busy employees.' },
      { title: 'Stolen and reused passwords', desc: 'One compromised login without multi-factor authentication can open email, files and financial accounts.' },
      { title: 'Hidden backdoors on websites and servers', desc: 'Outdated plugins and leftover access let attackers come back long after a quick cleanup.' },
      { title: 'No one watching after hours', desc: 'Most small teams have no way to spot or respond to an alert at night or over a weekend.' },
    ],
    capabilities: [
      { title: 'Security Operations & Monitoring', description: 'Around-the-clock SOC monitoring through our security partners, with alerts triaged and escalated to people who can act on them.', items: ['24/7 SOC', 'SIEM & Log Correlation', 'Threat Detection', 'Alert Triage'] },
      { title: 'Endpoint & Email Protection', description: 'Endpoint detection and response on every device, plus email filtering against phishing, malware and impersonation.', items: ['EDR/XDR', 'Email Security', 'Anti-Phishing', 'Patch Management'] },
      { title: 'Identity & Access', description: 'Multi-factor authentication, least-privilege access and conditional access policies, so a stolen password alone is not enough to get in.', items: ['Multi-Factor Authentication', 'Conditional Access', 'Privileged Access', 'Account Reviews'] },
      { title: 'Testing & Assessment', description: 'Vulnerability scanning, penetration testing and security assessments that show where you are exposed and what to fix first.', items: ['Vulnerability Scanning', 'Penetration Testing', 'Website Security Review', 'Risk Assessment'] },
      { title: 'Incident Response & Recovery', description: 'When something goes wrong, we contain it, remove the attacker\'s access, restore clean systems and document what happened.', items: ['Incident Response', 'Malware & Backdoor Removal', 'Root-Cause Review', 'Recovery Planning', 'IR Policies'] },
    ],
    whyChoose: [
      { title: 'Certified Expertise', desc: 'Backed by CISSP/CCSP-level security expertise.' },
      { title: 'Enterprise Partner Stack', desc: 'We work with established vendors such as Palo Alto Networks, Check Point, Proofpoint and Group-IB.' },
      { title: 'Hands-On Remediation', desc: 'We fix the problem, from removing malware to hardening the setting that let it in.' },
      { title: 'Plain-English Reporting', desc: 'Clear findings and next steps that owners and auditors can follow.' },
    ],
    process4: [
      { n: '1', title: 'Assess', desc: 'Review your systems, accounts and exposure to find the gaps that matter most.' },
      { n: '2', title: 'Harden', desc: 'Close those gaps with MFA, endpoint protection, email security and safer configurations.' },
      { n: '3', title: 'Monitor', desc: 'Watch endpoints, identities and logs around the clock to catch threats early.' },
      { n: '4', title: 'Respond', desc: 'Contain incidents, remove the attacker\'s access and restore normal operations.' },
    ],
    faqs: [
      { q: 'What does a managed security service provider (MSSP) do?', a: 'An MSSP monitors and protects your systems on an ongoing basis. BAMS Technology provides 24/7 SOC monitoring through our security partners, endpoint and email protection, identity security, vulnerability testing and incident response, so you get a security team without having to hire and staff one yourself.' },
      { q: 'Can BAMS help if we have already been hacked?', a: 'Yes. We contain the incident, remove the attacker\'s access, including malware and hidden backdoors on websites and servers, restore clean systems and close the gap that let them in. Afterward we document what happened and put monitoring in place so a repeat attempt is caught sooner.' },
      { q: 'Does a small business really need 24/7 security monitoring?', a: 'Attackers often target small businesses because nobody is watching overnight or on weekends. Building an in-house SOC is out of reach for most companies, so we provide around-the-clock monitoring as a service, with alerts reviewed by security analysts instead of landing in an unread inbox.' },
      { q: 'Do you offer penetration testing?', a: 'Yes. We run vulnerability scans and penetration tests against your network, cloud services and web applications, then deliver prioritized findings in plain English. Each finding comes with a recommended fix, and we can carry out the remediation and retest to confirm the issue is closed.' },
      { q: 'Can BAMS help with HIPAA and other compliance requirements?', a: 'We put in place the technical safeguards that frameworks such as HIPAA expect, including access controls, encryption, logging, backups and documented incident response policies. We work alongside your compliance lead or auditor; we do not issue certifications or legal opinions ourselves.' },
    ],
  },
  'tech-advisory': {
    directQuestion: 'What is BAMS Technology\'s technology procurement and advisory service?',
    directAnswer: 'BAMS Technology\'s procurement and advisory service helps businesses choose and buy technology without vendor bias. Through its partnership with Advanced Interface Solutions, it compares options from 400+ supplier partners, reviews contracts and pricing, and coordinates rollout and renewals, at no added cost because providers compensate the advisor.',
    relatedServices: ['managed-it', 'cybersecurity', 'security-cameras'],
    challengesHeading: 'Why technology buying goes wrong.',
    challenges: [
      { title: 'Too many vendors, no time to compare', desc: 'Every category has dozens of providers, and the sales pitches all sound the same.' },
      { title: 'Contracts that lock you in', desc: 'Auto-renewals, early termination fees and vague SLAs show up after you have signed.' },
      { title: 'Paying for what you do not use', desc: 'Overlapping licenses and forgotten services quietly add to the monthly bill.' },
      { title: 'No one owns the vendor relationship', desc: 'When something breaks, it is unclear who to call or what the contract actually promises.' },
    ],
    capabilities: [
      { title: 'Vendor-Neutral Sourcing', description: 'Through our partnership with Advanced Interface Solutions (AIS), we source options from a network of 400+ supplier partners and compare them side by side.', items: ['Internet & Connectivity', 'Cloud & Hosting', 'Voice & UCaaS', 'Contact Center', 'Security Services'] },
      { title: 'Contract & Pricing Review', description: 'We review terms, renewal dates and pricing so you know exactly what you are committing to before you sign.', items: ['Contract Review', 'Renewal Tracking', 'Pricing Comparison', 'SLA Review'] },
      { title: 'Cost Optimization', description: 'We look at what you already pay for and find overlap, unused services and better-fit plans.', items: ['Bill Review', 'License Review', 'Consolidation', 'Budget Planning'] },
      { title: 'Implementation Coordination', description: 'We coordinate the move between providers so installs, cutovers and number ports happen on schedule.', items: ['Project Coordination', 'Cutover Planning', 'Vendor Escalation'] },
      { title: 'Ongoing Vendor Management', description: 'After you sign, we stay on as your point of contact for escalations, renewals and changes.', items: ['Escalation Support', 'Renewal Management', 'Account Reviews'] },
    ],
    whyChoose: [
      { title: 'No Added Cost', desc: 'Our advisory partners are compensated by the provider, not by you.' },
      { title: 'Vendor-Neutral', desc: 'We compare options across hundreds of suppliers instead of pushing one brand.' },
      { title: 'Technical and Commercial', desc: 'Engineers who understand the technology review the deal, not just the price.' },
      { title: 'One Point of Contact', desc: 'One team for sourcing, implementation and escalations.' },
    ],
    process4: [
      { n: '1', title: 'Discover', desc: 'Map what you have today, what it costs, and what the business needs next.' },
      { n: '2', title: 'Compare', desc: 'Source options from our supplier network and lay out pricing and tradeoffs side by side.' },
      { n: '3', title: 'Negotiate', desc: 'Review terms and pricing with you before anything is signed.' },
      { n: '4', title: 'Manage', desc: 'Coordinate the rollout, then stay on for escalations and renewals.' },
    ],
    faqs: [
      { q: 'How can technology advisory be offered at no cost?', a: 'Our advisory partners are compensated by the technology providers you choose, much like a broker, so there is no added cost to you. You pay the provider its standard pricing, and we compare options across a network of 400+ supplier partners so you are not limited to a single brand.' },
      { q: 'What kinds of technology can BAMS source?', a: 'Internet and connectivity, cloud hosting, voice and unified communications, contact center platforms, security services, managed services and other business technology. If a provider in our partner network sells it, we can compare options, review the contract and coordinate the rollout for you.' },
      { q: 'Are your recommendations unbiased?', a: 'We are vendor-neutral and compare several providers for every request, with pricing, terms and tradeoffs laid out side by side. Our job is to find the right fit for your requirements and budget, and you make the final decision on which provider to use.' },
      { q: 'What happens after we sign with a provider?', a: 'We stay involved. BAMS coordinates installation and cutover, escalates issues with the provider on your behalf, tracks renewal dates and reviews the account when the contract comes up again, so you are never left on hold alone with a vendor.' },
      { q: 'Do we have to switch vendors to work with you?', a: 'No. The first step is often reviewing what you already have. Sometimes the best outcome is renegotiating or right-sizing an existing contract instead of moving, and we will tell you when staying with your current provider is the better choice.' },
    ],
  },
  'managed-it': {
    directQuestion: 'What is BAMS Technology\'s managed IT service?',
    directAnswer: 'BAMS Technology\'s managed IT service is an outsourced IT department for a flat monthly fee. It covers 24/7 monitoring, unlimited help desk support, patching, Microsoft 365 and Google Workspace administration, backups, network management and vendor coordination, delivered remotely across the US with onsite visits when needed.',
    relatedServices: ['cybersecurity', 'security-cameras', 'tech-advisory'],
    challenges: [
      { title: 'Your network has too many blind spots', desc: 'Hybrid offices, cloud apps, and remote logins create gaps that are nearly impossible to track by hand.' },
      { title: 'Every device is a target', desc: 'Laptops, servers, and phones are always on and always exposed — the easiest way in for ransomware and malware.' },
      { title: 'Phishing never stops', desc: 'Convincing fake emails and lookalike sites slip past filters and prey on busy employees.' },
      { title: 'Credentials are the weak link', desc: 'Stolen or reused passwords are behind almost every breach we investigate.' },
    ],
    capabilities: [
      { title: 'Network & Infrastructure', description: 'We design and manage a secure, resilient network — segmented to contain problems instead of letting them spread, on-prem, hybrid, or cloud.', items: ['Next-Gen Firewalls', 'Network Segmentation', 'SD-WAN', 'LAN / WLAN / NAC', 'Hybrid Cloud Connectivity', 'DNS / DHCP Management'] },
      { title: 'Endpoint Management', description: 'Every laptop, server, and phone gets prevention, detection, and rapid response — on or off your network.', items: ['Endpoint Detection & Response', 'Patch & Vulnerability Management', 'Device & App Control', 'Mobile Device Management', 'Asset Tracking'] },
      { title: 'Cloud & Productivity', description: "Microsoft 365 and Google Workspace, configured, monitored, and backed up — so your team's tools just work.", items: ['Microsoft 365 & Google Workspace', 'Email Security & Filtering', 'Cloud Backup', 'Data Loss Prevention', 'Identity & Access Management'] },
      { title: 'Help Desk & Support', description: 'A real engineer answers — unlimited help desk support for every employee, every day.', items: ['Unlimited Help Desk', 'Remote & Onsite Support', 'Onboarding / Offboarding', 'Vendor Management'] },
      { title: 'Monitoring & Response', description: '24/7 monitoring and alerting without the overhead of building your own team.', items: ['24/7 Monitoring', 'Automated Alerting', 'Incident Response', 'Reporting & Compliance'] },
    ],
    whyChoose: [
      { title: 'Always-On Support', desc: '24/7 monitoring with a 30-minute contractual response SLA.' },
      { title: 'Flat-Rate Pricing', desc: 'One predictable monthly fee, no surprise line items.' },
      { title: 'Certified Engineers', desc: 'Backed by CISSP/CCSP-level expertise.' },
      { title: 'Nationwide Coverage', desc: 'Remote and onsite support wherever you operate.' },
    ],
    process4: [
      { n: '1', title: 'Identify', desc: 'Assess your environment to uncover risks, vulnerabilities, and compliance gaps.' },
      { n: '2', title: 'Secure', desc: 'Put the right measures in place across networks, endpoints, email, and identities.' },
      { n: '3', title: 'Monitor', desc: 'Watch systems and traffic in real time to catch threats early.' },
      { n: '4', title: 'Respond', desc: 'Contain incidents, limit impact, and restore operations quickly.' },
    ],
    faqs: [
      { q: 'What is included in BAMS Technology\'s managed IT services?', a: 'Managed IT covers 24/7 monitoring, unlimited help desk support, endpoint and patch management, Microsoft 365 or Google Workspace administration, backups, network management and vendor management, all for a predictable monthly fee. Onsite support is arranged when a problem cannot be fixed remotely.' },
      { q: 'How is managed IT priced?', a: 'We quote a flat monthly fee after a free assessment of your users, devices and systems. The proposal lists exactly what is included, so routine support and maintenance do not show up later as surprise line items on your invoice.' },
      { q: 'Can BAMS migrate us to Microsoft 365?', a: 'Yes. We plan and run migrations into Microsoft 365 from on-premises servers, Google Workspace or other email providers, including mailboxes, files and user accounts. We schedule the cutover to keep disruption low, then manage the tenant, security settings and backups afterward.' },
      { q: 'Does managed IT replace our in-house IT person?', a: 'It does not have to. Some businesses use BAMS as their entire IT department, while others use us to back up an in-house person with help desk coverage, monitoring, security tools and project support. We fit around the team you already have.' },
      { q: 'Do you support businesses outside your local area?', a: 'Yes. BAMS Technology supports businesses across the United States. Most help desk and maintenance work is done remotely, monitoring covers every location around the clock, and we arrange onsite visits for installs, hardware failures and larger projects when they are needed.' },
    ],
  },
  'custom-software': {
    directQuestion: 'What is BAMS Technology\'s custom software service?',
    directAnswer: 'BAMS Technology\'s custom software service designs, builds and supports web applications, portals, integrations and dashboards around how a business actually works. It also modernizes legacy systems in phases with sandbox testing so live operations keep running, and provides hosting, security updates and ongoing feature work after launch.',
    relatedServices: ['ai-integration', 'managed-it', 'cybersecurity'],
    challengesHeading: 'Why off-the-shelf software falls short.',
    challenges: [
      { title: 'Software that does not fit the workflow', desc: 'Generic tools force your team into workarounds, spreadsheets and double entry.' },
      { title: 'Legacy systems no one wants to touch', desc: 'Critical apps run on outdated code that is fragile, hard to change and risky to replace.' },
      { title: 'Systems that do not talk to each other', desc: 'Data gets retyped between your CRM, accounting and operations tools.' },
      { title: 'Compliance that generic tools miss', desc: 'Regulated workflows, such as patient records or lending, need rules most packaged software does not enforce.' },
    ],
    capabilities: [
      { title: 'Web Applications', description: 'Custom web apps and portals for customers, patients or staff, built around how your business actually works.', items: ['Customer Portals', 'Internal Apps', 'Scheduling & Booking', 'Mobile-Friendly Web'] },
      { title: 'Legacy Modernization', description: 'We upgrade or rebuild aging systems in phases, with sandbox testing, so the business keeps running during the move.', items: ['Database Migrations', 'Backend Upgrades', 'Phased Rollouts', 'Sandbox Testing'] },
      { title: 'Integrations & APIs', description: 'We connect your systems through APIs so data moves automatically instead of being retyped.', items: ['Third-Party APIs', 'CRM Integration', 'EMR Integration', 'Payment Integration'] },
      { title: 'Automation & Dashboards', description: 'Scheduled jobs, automated workflows and dashboards that show what is happening across the business.', items: ['Workflow Automation', 'Reporting Dashboards', 'Data Pipelines', 'Notifications'] },
      { title: 'Support & Maintenance', description: 'We host, monitor, patch and extend the software after launch, so it does not become the next legacy system.', items: ['Hosting', 'Monitoring', 'Security Updates', 'Feature Updates'] },
    ],
    whyChoose: [
      { title: 'Security Built In', desc: 'A cybersecurity team reviews how the app handles data, access and logins.' },
      { title: 'Zero-Disruption Delivery', desc: 'Phased rollouts and sandbox testing keep live systems running while we build.' },
      { title: 'Regulated-Industry Experience', desc: 'We have built software for healthcare and financial services workflows with compliance requirements.' },
      { title: 'One Team, End to End', desc: 'Design, development, hosting and support from the same team.' },
    ],
    process4: [
      { n: '1', title: 'Discover', desc: 'Map the workflow, the systems involved and every dependency before writing code.' },
      { n: '2', title: 'Design', desc: 'Agree on scope, screens and integrations in a written proposal.' },
      { n: '3', title: 'Build & Test', desc: 'Develop in short cycles and test in a sandbox isolated from production.' },
      { n: '4', title: 'Launch & Support', desc: 'Roll out in phases, then host, monitor and keep improving it.' },
    ],
    faqs: [
      { q: 'What kind of custom software does BAMS Technology build?', a: 'We build web applications, customer and patient portals, internal tools, workflow automation, dashboards and integrations between existing systems. Past projects include modernizing a legacy website backend, rewriting a medical practice\'s EMR onto a new database and building a compliant lending platform with a custom CRM.' },
      { q: 'Can you modernize a legacy system without downtime?', a: 'In most cases, yes. We map every dependency first, test upgrades in a sandbox isolated from production and roll changes out in phases, validating each stage before moving on. That approach has let us migrate a live, revenue-critical website backend with no unplanned downtime.' },
      { q: 'Can custom software integrate with the tools we already use?', a: 'Yes. Most modern platforms, including CRMs, accounting tools, payment processors and many EMRs, offer APIs we can connect to. Where an API is limited or missing, we use exports, webhooks or a small middleware service to keep data in sync without anyone retyping it.' },
      { q: 'How much does custom software cost?', a: 'It depends on scope. We start with a free assessment, then provide a written proposal with the features, timeline and price before any work begins. Starting with a focused first version keeps cost down and gets something useful in front of your team sooner.' },
      { q: 'Who supports the software after launch?', a: 'BAMS does. We offer hosting, monitoring, security updates and ongoing feature work so the application stays current. Because we also provide managed IT and cybersecurity, the same team can support both the application and the servers, network and accounts it runs on.' },
    ],
  },
  'security-cameras': {
    directQuestion: 'What is BAMS Technology\'s security camera service?',
    directAnswer: 'BAMS Technology\'s security camera service designs, installs and supports IP camera systems for businesses nationwide. Systems include network video recorders, fixed and PTZ cameras, secure remote viewing from any device, optional cloud recording, AI person and vehicle detection, and access control, all set up on a secured network segment.',
    relatedServices: ['managed-it', 'cybersecurity', 'tech-advisory'],
    challengesHeading: 'Why older camera systems let you down.',
    challenges: [
      { title: 'Footage you cannot find when you need it', desc: 'Old DVRs make it slow to search, export or share video after an incident.' },
      { title: 'No remote view', desc: 'Owners cannot check on a location from a phone, or the app only works on the office network.' },
      { title: 'Blind spots and poor image quality', desc: 'Badly placed or low-resolution cameras miss faces, plates and the moments that matter.' },
      { title: 'Cameras that quietly stop recording', desc: 'A failed drive or offline camera often goes unnoticed until the footage is needed.' },
    ],
    capabilities: [
      { title: 'Site Survey & Design', description: 'We walk the site, map coverage and choose camera types and placements for entrances, registers, parking areas and storage rooms.', items: ['Coverage Planning', 'Camera Selection', 'Network Planning'] },
      { title: 'Installation', description: 'Professional installation of IP cameras, cabling and recorders, with clean wiring and a fully tested system at handoff.', items: ['IP Cameras', 'PTZ & Fixed Cameras', 'NVR Setup', 'PoE Cabling'] },
      { title: 'Remote Viewing & Cloud', description: 'Secure live and recorded viewing from a phone or desktop, with optional offsite cloud recording.', items: ['Mobile App Access', 'Cloud Recording', 'Secure Remote Access', 'Multi-Site Viewing'] },
      { title: 'AI Analytics & Alerts', description: 'Person and vehicle detection with smart alerts, so you review events instead of hours of footage.', items: ['Person Detection', 'Vehicle Detection', 'Smart Alerts', 'Fast Search'] },
      { title: 'Access Control & Support', description: 'Badge and mobile access control that works alongside your cameras, plus ongoing health monitoring and support.', items: ['Badge Access', 'Mobile Credentials', 'Health Monitoring', 'Ongoing Support'] },
    ],
    whyChoose: [
      { title: 'Network-First Installs', desc: 'Cameras go on a secured network segment, never on default passwords.' },
      { title: 'Nationwide Installation', desc: 'Installed and supported for businesses across the US.' },
      { title: 'One Vendor for IT and Cameras', desc: 'The team that runs your network also supports your cameras.' },
      { title: 'Built for Real Businesses', desc: 'Systems designed for storefronts, offices and medical practices.' },
    ],
    process4: [
      { n: '1', title: 'Survey', desc: 'Walk the site and agree on what each camera needs to see.' },
      { n: '2', title: 'Design', desc: 'Choose cameras, recording and network setup, with a clear quote.' },
      { n: '3', title: 'Install', desc: 'Install, configure and test every camera, then train your team on the app.' },
      { n: '4', title: 'Support', desc: 'Monitor system health and handle issues and expansions.' },
    ],
    faqs: [
      { q: 'What security camera systems does BAMS Technology install?', a: 'We install IP camera systems with network video recorders, fixed and pan-tilt-zoom cameras, optional cloud recording, AI person and vehicle detection, and access control. Each system is designed around the site, covering entrances, registers, parking areas and storage rooms where it matters most.' },
      { q: 'Can I view my security cameras from my phone?', a: 'Yes. We set up secure remote viewing so you can watch live and recorded video from a phone, tablet or computer, for one location or several. Remote access is configured so the recorder is not left exposed directly to the internet.' },
      { q: 'Does BAMS install security cameras nationwide?', a: 'Yes. BAMS Technology installs and supports camera systems for businesses across the United States. We handle the site survey, design and installation, then provide remote support and system health monitoring afterward, so you have one contact for every location you operate.' },
      { q: 'Can you upgrade our existing camera system?', a: 'Often, yes. We assess your current cameras, cabling and recorder, keep what still performs and replace what does not. Reusing sound cabling where possible lowers the cost of moving from an older DVR-based system to modern IP cameras with remote viewing and smart search.' },
      { q: 'How do you keep security cameras from becoming a cyber risk?', a: 'We place cameras on a separate network segment, change every default password, keep firmware updated and set up remote access securely. Poorly configured cameras are a common way into a business network, so we protect them like any other device we manage.' },
    ],
  },
};

const serviceList = [
  { icon: 'sparkles', number: '01', title: 'AI Integration', description: 'Modernize workflows with AI — custom chatbots, process automation, and intelligent tooling built into the systems you already run.', tags: ['AI Chatbots', 'Workflow Automation', 'LLM Integration', 'Internal Tools'], key: 'ai-integration', file: '/ai-integration' },
  { icon: 'shield', number: '02', title: 'Cybersecurity (MSSP)', description: '24/7 SOC, endpoint protection, penetration testing, and incident response. We stop threats before they become breaches.', tags: ['SOC 24/7', 'EDR/XDR', 'Pen Testing', 'SIEM'], key: 'cybersecurity', file: '/cybersecurity' },
  { icon: 'briefcase', number: '03', title: 'Technology Procurement & Advisory', description: 'Vendor-neutral guidance to source the right technology from a network of trusted providers — we manage evaluation, negotiation, and every step in between, at no added cost to you.', tags: ['Vendor Sourcing', 'Contract Negotiation', 'Unbiased Guidance', 'Vendor Management'], key: 'tech-advisory', file: '/tech-advisory' },
  { icon: 'monitor', number: '04', title: 'Managed IT (MSP)', description: 'Full-stack IT management with proactive monitoring, help desk, and cloud services — for a predictable monthly fee.', tags: ['Help Desk', 'Cloud', 'Backup', 'Microsoft 365'], key: 'managed-it', file: '/managed-it' },
  { icon: 'code', number: '05', title: 'Custom Software', description: 'Bespoke web apps, automation, and integrations built for your exact workflow — no off-the-shelf compromises.', tags: ['Web Apps', 'Automation', 'API Integrations', 'Dashboards'], key: 'custom-software', file: '/custom-software' },
  { icon: 'camera', number: '06', title: 'Security Cameras', description: 'Enterprise IP camera systems installed and managed nationwide — remote monitoring, AI analytics, and 24/7 support.', tags: ['IP Cameras', 'AI Analytics', 'Access Control'], key: 'security-cameras', file: '/security-cameras' },
];

export const services = serviceList.map((s) => ({ ...s, ...serviceDetails[s.key] }));

// Case studies stay anonymous: industry and problem only, no client names or
// identifying details, and no numbers we can't back up.
export const caseStudies = [
  { key: 'publishing', industry: 'Publishing / Media', title: "Modernizing a Publishing House's Legacy Website", summary: 'A major publishing house was running severely dated backend technology and needed a modernization path with minimal downtime.', result: 'Zero-downtime backend migration across a live production site',
    challenge: "The client's website ran on an outdated backend stack that was increasingly fragile and hard to patch. The site couldn't go down: it was the publisher's primary revenue channel, so every upgrade had to happen against live production traffic, with a clear way back if something failed.",
    approach: ['Audited the existing stack and mapped every dependency, including server software, libraries, plugins, integrations and scheduled jobs', 'Built a sandbox copy of the site, isolated from production, to test each upgrade against real content before it went live', 'Designed a phased upgrade schedule with a rollback plan for every stage, instead of a single risky cutover', 'Rolled changes out incrementally, validating pages, integrations and performance at each stage before proceeding', 'Documented the upgraded environment so future patches follow the same tested path'],
    outcome: "The backend was fully modernized with no unplanned downtime and no disruption to the publisher's live traffic. The site now runs on supported software that can be patched on a normal schedule, with a sandbox and a documented process for future changes." },
  { key: 'cardiology', industry: 'Healthcare', title: "Rebuilding a Cardiology Practice's EMR", summary: 'A cardiologist office needed their custom-built EMR rewritten into a new database — without breaking any of the systems it depended on.', result: 'HIPAA-compliant rewrite, zero functionality loss',
    challenge: 'A cardiology practice depended on a custom-built EMR that needed a full database rewrite. Every integration with third-party programs had to keep working through the change, and the office also had gaps in physical security, its phone system, desktop support and HIPAA documentation.',
    approach: ['Rewrote the EMR onto a new database while keeping every workflow clinicians relied on functionally the same', 'Mapped each dependency on integrated third-party programs and tested it against the new database before cutover', 'Brought the practice into HIPAA compliance and authored incident-response policies for staff to follow', 'Installed a security camera system and upgraded the office phone system', 'Provided ongoing desktop support for clinical and front-office staff'],
    outcome: 'The practice runs on a modern, HIPAA-compliant EMR with the same functionality clinicians relied on and its third-party integrations intact, backed by documented incident-response policies and an office hardened across cameras, phones and desktops.' },
  { key: 'pawn-shop', industry: 'Financial Services', title: 'Building Compliant Loan Software for a Pawn Shop', summary: "Existing financial software couldn't handle the client's lending workflow or compliance needs, so we built a custom platform.", result: 'Custom AI-driven CRM with compliant repayment and disbursement flows',
    challenge: "The client's existing financial software couldn't reliably manage loan repayment, borrower disbursement or the compliance requirements around both, so the lending workflow depended on software that didn't fit how the business actually operated.",
    approach: ['Mapped the full lending workflow, from loan origination through repayment and disbursement, along with the compliance rules at each step', 'Designed a compliant lending workflow from the ground up, with those rules enforced by the software rather than by staff memory', 'Built an AI-driven platform to handle loan repayment and disbursement to borrowers', "Integrated the platform into a custom CRM built for the client's operation, so customer records and loans live in one place"],
    outcome: 'The client now runs loan repayment and borrower disbursement through one compliant, purpose-built platform integrated directly into their CRM, with a single system of record for customers and loans.' },
];

export const partnersRaw = [
  ['Group-IB', '/assets/partners/group-ib.webp'],
  ['Palo Alto Networks', '/assets/partners/palo-alto-networks.webp'],
  ['Microsoft', '/assets/partners/microsoft.webp'],
  ['Trend Micro', '/assets/partners/trend-micro.webp'],
  ['Cisco', '/assets/partners/cisco.webp'],
  ['Aikido', '/assets/partners/aikido.webp'],
  ['Check Point', '/assets/partners/check-point.webp'],
  ['Dragos', '/assets/partners/dragos.svg'],
  ['Sekoia', '/assets/partners/sekoia.webp'],
  ['Proofpoint', '/assets/partners/proofpoint.webp'],
  ['Sandfly Security', '/assets/partners/sandfly-security.webp'],
  ['Magic Sword', '/assets/partners/magic-sword.webp'],
  ['CyberArk', '/assets/partners/cyberark.png'],
  ['Voxility', '/assets/partners/voxility.webp'],
  ['SIXPAC', '/assets/partners/sixpac-logo.webp'],
  ['Jungle Creatives', '/assets/partners/jungle-creatives-logo.svg'],
];

export const featuresMap = {
  'managed-it': ['24/7 Proactive Monitoring', 'Unlimited Help Desk', 'Cloud Infrastructure', 'Microsoft 365 & Google Workspace'],
  'cybersecurity': ['24/7 SOC Monitoring', 'Endpoint Detection & Response', 'Penetration Testing', 'Incident Response'],
  'security-cameras': ['Nationwide Installation', 'AI-Powered Analytics', 'Remote Live Monitoring', 'Access Control Integration'],
  'custom-software': ['Custom Web Applications', 'Workflow Automation', 'Third-Party API Integrations', 'Internal Dashboards'],
  'ai-integration': ['Custom AI Chatbots', 'Workflow & Process Automation', 'LLM Integrations', 'Internal AI Tooling'],
  'tech-advisory': ['Vendor-Neutral Sourcing', 'Contract Negotiation Support', 'Cost & Contract Review', 'Ongoing Vendor Management'],
};

export const diagramMap = {
  'managed-it': { center: { label: '24/7 NOC', sublabel: 'MONITORING & ALERTING' }, satellites: [{ label: 'CLOUD', sublabel: 'AWS · Azure · GCP' }, { label: 'SERVERS', sublabel: 'On-Prem · Virtual' }, { label: 'ENDPOINTS', sublabel: 'Laptops · Mobile · IoT' }, { label: 'NETWORK', sublabel: 'Switches · WiFi · VPN' }] },
  'cybersecurity': { center: { label: 'SOC', sublabel: 'THREAT DETECTION' }, satellites: [{ label: 'SIEM', sublabel: 'Log Correlation' }, { label: 'EDR/XDR', sublabel: 'Endpoint Defense' }, { label: 'FIREWALL', sublabel: 'Perimeter Control' }, { label: 'IAM', sublabel: 'Identity & Access' }] },
  'security-cameras': { center: { label: 'NVR HUB', sublabel: 'VIDEO MANAGEMENT' }, satellites: [{ label: 'CAMERAS', sublabel: 'IP · PTZ · Fixed' }, { label: 'CLOUD', sublabel: 'Offsite Recording' }, { label: 'AI ENGINE', sublabel: 'Analytics & Alerts' }, { label: 'ACCESS', sublabel: 'Badge · Mobile' }] },
  'custom-software': { center: { label: 'API CORE', sublabel: 'BUSINESS LOGIC' }, satellites: [{ label: 'DATABASE', sublabel: 'Postgres · Redis' }, { label: 'FRONTEND', sublabel: 'Web · Mobile' }, { label: 'INTEGRATIONS', sublabel: '3rd-Party APIs' }, { label: 'AUTOMATION', sublabel: 'Workflows · Jobs' }] },
  'ai-integration': { center: { label: 'AI ENGINE', sublabel: 'MODEL ORCHESTRATION' }, satellites: [{ label: 'CHATBOTS', sublabel: 'Support · Sales · Internal' }, { label: 'WORKFLOWS', sublabel: 'Automated Processes' }, { label: 'LLM APIs', sublabel: 'OpenAI · Anthropic · Azure' }, { label: 'DATA', sublabel: 'Knowledge Bases · CRM' }] },
  'tech-advisory': { center: { label: 'SOURCING HUB', sublabel: 'VENDOR EVALUATION' }, satellites: [{ label: 'SUPPLIERS', sublabel: 'Vetted Partner Network' }, { label: 'CONTRACTS', sublabel: 'Terms & Pricing' }, { label: 'BUDGET', sublabel: 'Cost Analysis' }, { label: 'SUPPORT', sublabel: 'Ongoing Management' }] },
};

export const processSteps = [
  { n: '01', title: 'Free Assessment', desc: 'We audit your environment, identify gaps, and map a clear path forward.' },
  { n: '02', title: 'Custom Proposal', desc: 'A tailored plan with transparent, flat-rate pricing.' },
  { n: '03', title: 'Rapid Onboarding', desc: 'Deploys tools and gets you covered within 1–2 business days.' },
  { n: '04', title: 'Ongoing Protection', desc: '24/7 monitoring and a dedicated engineer who knows your business.' },
];

// Capability statements, not live metrics: this strip is static, so it must not
// show numbers that look like a real-time feed.
export const tickerItems = ['24/7/365 SOC MONITORING', '30-MINUTE CONTRACTUAL RESPONSE SLA', 'ENDPOINT, NETWORK & CLOUD COVERAGE', 'NATIONWIDE ONSITE DISPATCH'];

export const advisoryStats = [{ value: '400+', label: 'Supplier Partners' }, { value: '$0', label: 'Cost to You' }, { value: 'CISSP/CCSP', label: 'Certified Architects' }];

export const partnerPrograms = [
  { name: 'AIFS', logoUrl: '/assets/partners/ais-logo.webp', logoHeight: '100px', href: 'https://www.aifsllc.com/',
    tagline: 'An unbiased second opinion, at no cost to you.',
    description: 'Through our partnership with Advanced Interface Solutions (AIS), you get a dedicated technology advisor sourcing unbiased recommendations from 400+ supplier partners — compensated by the vendor, not by you.',
    highlights: [{ value: '400+', label: 'Supplier Partners' }, { value: '$0', label: 'Cost to You' }, { value: 'CISSP/CCSP', label: 'Certified Architects' }] },
  { name: 'SIXPAC', logoUrl: '/assets/partners/sixpac-logo.webp', href: 'https://sixpac.com',
    tagline: 'SIXPAC does it all for $18/mo.',
    description: 'Payment processing, CRM, scheduling, memberships, invoicing, and inventory in one platform — no contract, and your price is locked in for life.',
    highlights: [{ value: '$18/mo', label: 'Starting Price' }, { value: 'No Contract', label: 'Locked-In Pricing' }, { value: '1.85%', label: 'Avg Processing Rate' }] },
  { name: 'We Secure', logoUrl: '/assets/partners/we-secure.svg', href: 'https://we-secure.eu/',
    tagline: 'Enterprise-grade cybersecurity, backed by 20+ years of expertise.',
    description: 'We Secure delivers managed security services, incident response, and continuous protection for networks, endpoints, and cloud environments — backed by two decades defending critical industries.',
    highlights: [{ value: '24/7', label: 'SOC Monitoring' }, { value: '20+ Years', label: 'Expertise' }, { value: 'EU & US', label: 'Coverage' }] },
  { name: 'Enlight Engineering', logoUrl: '/assets/partners/enlight-logo.jpg', logoHeight: '60px', href: 'https://www.enlight-engineering.com/',
    tagline: 'Custom software engineering, delivered by a dedicated nearshore team.',
    description: 'A Swiss company driving software engineering excellence from its Serbia-based R&D center — custom software, QA, DevOps, and long-term team extension for complex technical projects.',
    highlights: [{ value: '4 Years', label: 'Avg Engagement' }, { value: 'ISO 27001', label: 'Certified' }, { value: 'Swiss-Led', label: 'Delivery' }] },
  { name: 'Jungle Creatives', logoUrl: '/assets/partners/jungle-creatives-logo.svg', href: 'https://junglecreatives.com/',
    tagline: 'A 360° creative agency for brands ready to grow online.',
    description: 'Jungle Creatives handles branding, web & app development, digital marketing, and strategy for clients who need more than IT — a full creative partner to build and grow their digital presence.',
    highlights: [{ value: '360°', label: 'Full-Service Agency' }, { value: 'Branding', label: 'Web · Marketing · Strategy' }, { value: 'Global', label: 'Client Roster' }] },
];

export const pageFiles = {
  'home': '/', 'managed-it': '/managed-it', 'cybersecurity': '/cybersecurity',
  'security-cameras': '/security-cameras', 'custom-software': '/custom-software', 'ai-integration': '/ai-integration',
  'tech-advisory': '/tech-advisory',
  'partners': '/partners', 'case-studies': '/case-studies',
  'privacy-policy': '/privacy-policy', 'terms-of-service': '/terms-of-service',
  'contact-us': '/contact-us',
  'visitconnect': '/visitconnect',
};

export function navItemsFor() {
  const serviceLinks = services.map((s) => ({ label: s.title, href: s.file }));
  return [
    { label: 'HOME', href: '/', hasDropdown: false, notDropdown: true, dropdownItems: [] },
    { label: 'SERVICES', href: '/#services-section', hasDropdown: true, notDropdown: false, dropdownItems: serviceLinks },
    { label: 'PARTNERS', href: '/partners', hasDropdown: false, notDropdown: true, dropdownItems: [] },
    { label: 'CASE STUDIES', href: '/case-studies', hasDropdown: false, notDropdown: true, dropdownItems: [] },
    { label: 'VISITCONNECT', href: '/visitconnect', hasDropdown: false, notDropdown: true, dropdownItems: [] },
    { label: 'CONTACT', href: '/contact-us', hasDropdown: false, notDropdown: true, dropdownItems: [] },
  ];
}

export function footerCompanyItems() {
  return [
    { label: 'Services', href: '/#services-section' },
    { label: 'Partners', href: '/partners' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'VisitConnect', href: '/visitconnect' },
    { label: 'Contact', href: '/contact-us' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ];
}
