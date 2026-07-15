/**
 * Central editorial content for the UPSTACK website.
 *
 * The work examples describe concept or representative engagement patterns.
 * They deliberately contain no client identities, testimonials, or performance
 * claims. Keep that disclosure visible anywhere the examples are rendered.
 */

export const routeHrefs = [
  "/",
  "/capabilities",
  "/work",
  "/process",
  "/about",
  "/contact",
] as const;

export type RouteHref = (typeof routeHrefs)[number];
export type RouteKey =
  | "home"
  | "capabilities"
  | "work"
  | "process"
  | "about"
  | "contact";
export type InternalHref = RouteHref | `/${string}#${string}`;

export interface Cta {
  readonly label: string;
  readonly href: InternalHref;
}

export interface NavigationItem {
  readonly label: string;
  readonly href: RouteHref;
  readonly isPrimary?: boolean;
}

export interface SiteRoute {
  readonly key: RouteKey;
  readonly label: string;
  readonly href: RouteHref;
  readonly title: string;
  readonly description: string;
}

export interface ProofCategory {
  readonly index: string;
  readonly title: string;
  readonly description: string;
}

export interface CoreCapability {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly href: InternalHref;
}

export interface CapabilityDetail {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly deck: string;
  readonly whatItIs: string;
  readonly problemItSolves: string;
  readonly deliverables: readonly string[];
  readonly cta: Cta;
}

export type WorkDisclosure =
  | "Concept Case Study"
  | "Representative Engagement";

export interface WorkEntry {
  readonly id: string;
  readonly disclosure: WorkDisclosure;
  readonly title: string;
  readonly category: string;
  readonly summary: string;
  readonly services: readonly string[];
  readonly outcomeAreas: readonly string[];
  readonly technology: readonly string[];
  readonly evidenceNote: string;
  readonly featured?: boolean;
}

export interface ProcessStep {
  readonly number: string;
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly outputs: readonly string[];
}

export interface EditorialListItem {
  readonly title: string;
  readonly description: string;
}

export type ContactFieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "company"
  | "website"
  | "phone"
  | "engagementType"
  | "servicesNeeded"
  | "timeline"
  | "budget"
  | "details"
  | "referralSource";

interface ContactFieldBase {
  readonly name: ContactFieldName;
  readonly label: string;
  readonly required: boolean;
  readonly helpText?: string;
}

export type ContactField =
  | (ContactFieldBase & {
      readonly kind: "text" | "email" | "url" | "tel";
      readonly placeholder?: string;
      readonly autoComplete?: string;
      readonly options?: never;
      readonly rows?: never;
    })
  | (ContactFieldBase & {
      readonly kind: "select" | "checkbox-group";
      readonly options: readonly string[];
      readonly placeholder?: string;
      readonly autoComplete?: never;
      readonly rows?: never;
    })
  | (ContactFieldBase & {
      readonly kind: "textarea";
      readonly placeholder?: string;
      readonly rows: number;
      readonly options?: never;
      readonly autoComplete?: never;
    });

export const siteMeta = {
  name: "UPSTACK",
  descriptor: "Commerce Systems",
  titleTemplate: "%s — UPSTACK",
  defaultTitle: "UPSTACK — Shopify Storefronts & Odoo Systems",
  description:
    "UPSTACK designs high-converting Shopify storefronts, implements Odoo operational systems, and connects commerce infrastructure for growth.",
  positioning: "Systems That Sell.",
  platformLine: "Shopify storefronts. Odoo operations. One connected system.",
  edition: "Edition 01",
  location: "Cairo + Remote",
} as const;

export const siteRoutes = [
  {
    key: "home",
    label: "Home",
    href: "/",
    title: "Systems That Sell",
    description:
      "Shopify storefronts that convert, Odoo systems that run operations, and connected commerce infrastructure built to scale.",
  },
  {
    key: "capabilities",
    label: "Capabilities",
    href: "/capabilities",
    title: "Shopify, Odoo & Commerce Systems Capabilities",
    description:
      "Storefront design and development, Odoo implementation, integration, optimization, reporting, and ongoing support.",
  },
  {
    key: "work",
    label: "Work",
    href: "/work",
    title: "Selected Commerce Systems Work",
    description:
      "Concept case studies and representative engagements across Shopify, Odoo, integration, and optimization.",
  },
  {
    key: "process",
    label: "Process",
    href: "/process",
    title: "How UPSTACK Works",
    description:
      "A six-stage method for discovering, architecting, designing, building, integrating, and growing connected commerce systems.",
  },
  {
    key: "about",
    label: "About",
    href: "/about",
    title: "About UPSTACK",
    description:
      "A specialized commerce systems partner connecting customer-facing Shopify experiences with Odoo operations.",
  },
  {
    key: "contact",
    label: "Book a Call",
    href: "/contact",
    title: "Book a Strategy Call",
    description:
      "Tell UPSTACK about your Shopify, Odoo, integration, or optimization priorities.",
  },
] as const satisfies readonly SiteRoute[];

export const navigation = [
  { label: "Work", href: "/work" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Book a Call", href: "/contact", isPrimary: true },
] as const satisfies readonly NavigationItem[];

export const proofCategories = [
  {
    index: "01",
    title: "Shopify Commerce",
    description:
      "Customer-facing storefronts designed for clarity, conversion, and performance.",
  },
  {
    index: "02",
    title: "Odoo Operations",
    description:
      "Connected workflows for sales, inventory, finance, fulfillment, CRM, and reporting.",
  },
  {
    index: "03",
    title: "Platform Integration",
    description:
      "Reliable data flow between Shopify, Odoo, payments, fulfillment, and analytics.",
  },
  {
    index: "04",
    title: "Continuous Optimization",
    description:
      "Structured improvement across conversion, efficiency, margin, and customer value.",
  },
] as const satisfies readonly ProofCategory[];

export const coreCapabilities = [
  {
    id: "shopify-commerce-systems",
    index: "01",
    title: "Shopify Commerce Systems",
    description:
      "High-converting storefronts built for performance, clarity, and scale.",
    href: "/capabilities#shopify-commerce-systems",
  },
  {
    id: "odoo-operational-infrastructure",
    index: "02",
    title: "Odoo Operational Infrastructure",
    description:
      "Integrated back-office systems for inventory, sales, finance, fulfillment, CRM, and reporting.",
    href: "/capabilities#odoo-operational-infrastructure",
  },
  {
    id: "yield-maximization",
    index: "03",
    title: "Yield Maximization",
    description:
      "Data-led optimization that improves conversion, efficiency, margin, and customer value.",
    href: "/capabilities#yield-maximization",
  },
] as const satisfies readonly CoreCapability[];

export const capabilityDetails = [
  {
    id: "shopify-commerce-systems",
    index: "01",
    title: "Shopify Commerce Systems",
    deck: "Customer-facing commerce engineered to convert.",
    whatItIs:
      "Strategy, design, and development for Shopify storefronts that make buying clear, fast, and dependable.",
    problemItSolves:
      "Complex journeys, rigid themes, and slow experiences reduce customer confidence and limit growth.",
    deliverables: [
      "UX strategy",
      "Store architecture",
      "Theme design",
      "Custom Shopify development",
      "Checkout optimization",
      "Performance optimization",
      "Analytics configuration",
      "Launch support",
    ],
    cta: { label: "Discuss Your Shopify Store", href: "/contact" },
  },
  {
    id: "odoo-operational-infrastructure",
    index: "02",
    title: "Odoo Operational Infrastructure",
    deck: "The operational layer behind dependable commerce.",
    whatItIs:
      "Discovery, configuration, extension, and adoption support for an Odoo system shaped around the business.",
    problemItSolves:
      "Disconnected tools and manual handoffs obscure inventory, delay decisions, and make growth difficult to control.",
    deliverables: [
      "Operational discovery",
      "Odoo solution architecture",
      "ERP configuration",
      "CRM and sales",
      "Inventory and purchasing",
      "Finance and accounting",
      "Manufacturing when relevant",
      "Reporting",
      "Training and support",
    ],
    cta: { label: "Plan Your Odoo System", href: "/contact" },
  },
  {
    id: "platform-integration",
    index: "03",
    title: "Platform Integration",
    deck: "Shopify and Odoo connected as one commerce system.",
    whatItIs:
      "Integration architecture that moves orders, customers, products, inventory, payments, and status data between platforms.",
    problemItSolves:
      "Duplicate records, delayed updates, and fragile point-to-point connections create operational risk and customer friction.",
    deliverables: [
      "Systems architecture",
      "Data mapping",
      "Shopify–Odoo integration",
      "API and middleware design",
      "Workflow automation",
      "Data synchronization",
      "Error handling",
      "Reliability monitoring",
    ],
    cta: { label: "Connect Your Platforms", href: "/contact" },
  },
  {
    id: "yield-maximization",
    index: "04",
    title: "Yield Maximization",
    deck: "A disciplined program for stronger commercial performance.",
    whatItIs:
      "Data-led optimization across the storefront, offer, merchandising, operations, margin, and customer lifecycle.",
    problemItSolves:
      "Growth stalls when teams optimize isolated metrics without a shared view of conversion, cost, margin, and customer value.",
    deliverables: [
      "Conversion review",
      "Experiment roadmap",
      "Merchandising strategy",
      "Pricing and margin analysis",
      "Inventory optimization",
      "Customer value analysis",
      "Operational efficiency review",
      "Continuous improvement plan",
    ],
    cta: { label: "Identify Growth Levers", href: "/contact" },
  },
  {
    id: "data-and-reporting",
    index: "05",
    title: "Data & Reporting",
    deck: "Clear reporting for commercial and operational decisions.",
    whatItIs:
      "A consistent measurement layer across Shopify, Odoo, and the tools required to understand performance.",
    problemItSolves:
      "Conflicting definitions and scattered reports slow decisions and conceal the relationship between demand, operations, and profit.",
    deliverables: [
      "Data modeling",
      "KPI framework",
      "Reporting dashboards",
      "Commerce funnel reporting",
      "Inventory and margin reporting",
      "Forecasting inputs",
      "Data quality controls",
      "Decision cadence",
    ],
    cta: { label: "Build a Clearer View", href: "/contact" },
  },
  {
    id: "ongoing-support",
    index: "06",
    title: "Ongoing Support",
    deck: "Steady stewardship after launch.",
    whatItIs:
      "Ongoing Shopify, Odoo, integration, and optimization support aligned to a shared operating roadmap.",
    problemItSolves:
      "Without accountable ownership, storefronts drift, operational workflows weaken, and integration issues accumulate.",
    deliverables: [
      "Shopify iteration",
      "Odoo administration",
      "Integration monitoring",
      "Incident triage",
      "Release management",
      "Performance reviews",
      "Team training",
      "Roadmap planning",
    ],
    cta: { label: "Establish Ongoing Support", href: "/contact" },
  },
] as const satisfies readonly CapabilityDetail[];

export const workEntries = [
  {
    id: "connected-commerce-foundation",
    disclosure: "Concept Case Study",
    title: "Connected Commerce Foundation",
    category: "Shopify + Odoo Integration",
    summary:
      "A concept blueprint for replacing a fragmented storefront and manual operations with one connected Shopify and Odoo system.",
    services: [
      "Commerce strategy",
      "Shopify UX and architecture",
      "Odoo solution design",
      "Integration architecture",
      "Reporting plan",
    ],
    outcomeAreas: [
      "Customer journey clarity",
      "Order-to-fulfillment continuity",
      "Operational visibility",
      "Scalable delivery planning",
    ],
    technology: ["Shopify", "Odoo", "API integration", "Analytics"],
    evidenceNote:
      "Illustrative scope only; no client identity or measured result is implied.",
    featured: true,
  },
  {
    id: "storefront-performance-system",
    disclosure: "Representative Engagement",
    title: "Storefront Performance System",
    category: "Shopify + Optimization",
    summary:
      "A representative engagement pattern for clarifying product discovery, strengthening Shopify performance, and creating an evidence-led optimization roadmap.",
    services: [
      "UX review",
      "Store architecture",
      "Theme development",
      "Performance optimization",
      "Measurement planning",
    ],
    outcomeAreas: [
      "Product discovery",
      "Checkout clarity",
      "Storefront performance",
      "Optimization readiness",
    ],
    technology: ["Shopify", "Liquid", "Web performance", "Analytics"],
    evidenceNote:
      "Representative scope only; no named client or performance claim is presented.",
  },
  {
    id: "operational-control-layer",
    disclosure: "Representative Engagement",
    title: "Operational Control Layer",
    category: "Odoo Implementation",
    summary:
      "A representative Odoo implementation model for bringing sales, inventory, purchasing, finance, fulfillment, and reporting into a governed operating system.",
    services: [
      "Operational discovery",
      "Odoo configuration",
      "Workflow design",
      "Data migration planning",
      "Training",
    ],
    outcomeAreas: [
      "Process consistency",
      "Inventory visibility",
      "Financial control",
      "Team adoption",
    ],
    technology: ["Odoo", "CRM", "Inventory", "Accounting", "Reporting"],
    evidenceNote:
      "Representative scope only; no named client or performance claim is presented.",
  },
  {
    id: "commerce-intelligence-layer",
    disclosure: "Concept Case Study",
    title: "Commerce Intelligence Layer",
    category: "Data + Yield Maximization",
    summary:
      "A concept measurement system linking Shopify demand signals with Odoo inventory, fulfillment, and margin data for more informed decisions.",
    services: [
      "KPI design",
      "Data modeling",
      "Dashboard planning",
      "Margin analysis",
      "Optimization roadmap",
    ],
    outcomeAreas: [
      "Shared performance definitions",
      "Commercial visibility",
      "Inventory decision support",
      "Prioritized improvement",
    ],
    technology: ["Shopify", "Odoo", "Data integration", "Reporting"],
    evidenceNote:
      "Illustrative scope only; no client identity or measured result is implied.",
  },
] as const satisfies readonly WorkEntry[];

export const processSteps = [
  {
    number: "01",
    id: "discover",
    title: "Discover",
    summary:
      "Understand the business, customer journey, current systems, and operational constraints.",
    outputs: ["Business context", "System audit", "Priority brief"],
  },
  {
    number: "02",
    id: "architect",
    title: "Architect",
    summary:
      "Define the Shopify storefront, Odoo modules, integrations, data flows, and delivery plan.",
    outputs: ["Solution architecture", "Data map", "Delivery roadmap"],
  },
  {
    number: "03",
    id: "design",
    title: "Design",
    summary:
      "Create the commerce experience and the operational workflows that support it.",
    outputs: ["Commerce UX", "Interface system", "Workflow design"],
  },
  {
    number: "04",
    id: "build",
    title: "Build",
    summary:
      "Develop the Shopify storefront and configure or extend the Odoo environment.",
    outputs: ["Shopify build", "Odoo configuration", "Quality assurance"],
  },
  {
    number: "05",
    id: "integrate",
    title: "Integrate",
    summary:
      "Connect ecommerce, inventory, payments, accounting, CRM, fulfillment, and reporting.",
    outputs: ["Platform connections", "Workflow automation", "Reliability controls"],
  },
  {
    number: "06",
    id: "grow",
    title: "Grow",
    summary:
      "Measure performance, improve conversion, automate processes, and support ongoing growth.",
    outputs: ["Performance review", "Optimization backlog", "Support roadmap"],
  },
] as const satisfies readonly ProcessStep[];

export const aboutPrinciples = [
  {
    title: "Systems Before Features",
    description:
      "Every decision should strengthen the whole commerce system, not add isolated complexity.",
  },
  {
    title: "Operational Clarity",
    description:
      "Customer experience, data, and internal workflows should be understandable and accountable.",
  },
  {
    title: "Measured Improvement",
    description:
      "Priorities are set through evidence, commercial relevance, and practical constraints.",
  },
  {
    title: "Long-Term Stewardship",
    description:
      "The work is designed for adoption, maintainability, and disciplined evolution after launch.",
  },
] as const satisfies readonly EditorialListItem[];

export const aboutAudiences = [
  {
    title: "Growing Commerce Brands",
    description:
      "Teams that need a stronger Shopify experience and an operating model ready for scale.",
  },
  {
    title: "Wholesalers & Distributors",
    description:
      "Businesses connecting ecommerce demand with inventory, purchasing, sales, and fulfillment.",
  },
  {
    title: "Manufacturers with Commerce",
    description:
      "Operators coordinating product, production, stock, orders, and customer-facing channels.",
  },
  {
    title: "Established Ecommerce Teams",
    description:
      "Organizations improving conversion, reliability, reporting, and operational efficiency.",
  },
] as const satisfies readonly EditorialListItem[];

export const aboutReasons = [
  {
    title: "Specialized Shopify + Odoo Focus",
    description:
      "One partner can shape both the customer-facing storefront and the operational layer behind it.",
  },
  {
    title: "End-to-End Capability",
    description:
      "Strategy, design, development, implementation, integration, optimization, and support remain connected.",
  },
  {
    title: "Commerce and Operational Fluency",
    description:
      "Decisions account for the customer journey, internal workflows, data integrity, and commercial performance.",
  },
  {
    title: "Clear Delivery Discipline",
    description:
      "Defined scope, visible priorities, documented decisions, and maintainable systems support confident execution.",
  },
] as const satisfies readonly EditorialListItem[];

export const platformExpertise = [
  {
    title: "Shopify Commerce Layer",
    description:
      "Commerce strategy, UX, store architecture, theme design, custom development, checkout, performance, analytics, and launch.",
  },
  {
    title: "Odoo Operational Layer",
    description:
      "CRM, sales, inventory, purchasing, accounting, fulfillment, manufacturing when relevant, reporting, training, and support.",
  },
  {
    title: "Connected Systems Layer",
    description:
      "Shopify–Odoo integration, APIs, middleware, data synchronization, workflow automation, monitoring, and decision reporting.",
  },
] as const satisfies readonly EditorialListItem[];

export const globalCta = {
  eyebrow: "The Next Edition",
  title: "Build the Growth Engine.",
  description: "Systems that connect. Data that informs. Operations that scale.",
  primary: { label: "Book a Strategy Call", href: "/contact" },
  secondary: { label: "Review Capabilities", href: "/capabilities" },
} as const satisfies {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly primary: Cta;
  readonly secondary: Cta;
};

export const footerContent = {
  statement:
    "UPSTACK builds Shopify storefronts and Odoo operational systems as one connected commerce infrastructure.",
  platformLine: "Shopify commerce. Odoo operations. Connected for growth.",
  sections: [
    {
      title: "Explore",
      links: [
        { label: "Work", href: "/work" },
        { label: "Capabilities", href: "/capabilities" },
        { label: "Process", href: "/process" },
      ],
    },
    {
      title: "UPSTACK",
      links: [
        { label: "About", href: "/about" },
        { label: "Book a Strategy Call", href: "/contact" },
      ],
    },
  ],
  legalLine:
    "No client identities, testimonials, or unverified performance claims are presented on this site.",
} as const;

export const homePage = {
  route: "/",
  mastheadMeta: [
    "UPSTACK Commerce Systems",
    "Cairo + Remote",
    "Shopify + Odoo",
    "Edition 01",
  ],
  hero: {
    eyebrow: "Connected Commerce Infrastructure",
    title: "Systems That Sell.",
    description:
      "High-converting Shopify storefronts. Integrated Odoo operations. One commerce system built to scale.",
    pillars: [
      "Shopify storefronts that convert.",
      "Odoo systems that run operations.",
      "Strategy and optimization that drive growth.",
    ],
    primaryCta: { label: "Book a Strategy Call", href: "/contact" },
    secondaryCta: { label: "View Our Work", href: "/work" },
  },
  capabilitiesIntro: {
    eyebrow: "Core Capabilities",
    title: "The storefront, the operation, and the system between them.",
    description:
      "UPSTACK connects the customer-facing Shopify layer with the Odoo operational layer, then improves the whole system over time.",
  },
  featuredWork: {
    eyebrow: "Selected Work",
    title: "Connected Commerce Foundation",
    description:
      "A concept case study showing how Shopify experience, Odoo operations, integration, and reporting can work as one system.",
    entryId: "connected-commerce-foundation",
    cta: { label: "Review Selected Work", href: "/work" },
  },
} as const;

export const capabilitiesPage = {
  route: "/capabilities",
  eyebrow: "Capabilities",
  title: "Commerce, Connected End to End.",
  description:
    "UPSTACK designs Shopify storefronts, implements Odoo, connects the platforms, and improves the commercial system around them.",
  editorialNote:
    "Each engagement is shaped around the customer journey, operational reality, and the decisions required for sustainable growth.",
} as const;

export const workPage = {
  route: "/work",
  eyebrow: "Work",
  title: "Selected Systems.",
  description:
    "Representative Shopify, Odoo, integration, data, and optimization scopes presented without fabricated client names or results.",
  disclosure:
    "The entries below are labeled Concept Case Study or Representative Engagement. They describe illustrative or representative scopes and do not claim named clients, testimonials, or measured outcomes.",
  outcomeLabel: "Outcome Areas",
  technologyLabel: "Technology",
  servicesLabel: "Services",
} as const;

export const processPage = {
  route: "/process",
  eyebrow: "Process",
  title: "From Strategy to Scale.",
  description:
    "A disciplined six-stage process for Shopify storefronts, Odoo operations, and the integration between them.",
  note:
    "The sequence is structured, but not rigid: discovery continues as evidence improves and operational constraints become clearer.",
} as const;

export const aboutPage = {
  route: "/about",
  eyebrow: "About UPSTACK",
  title: "One Partner for the Full Commerce System.",
  description:
    "UPSTACK is a specialized commerce systems partner connecting storefront experience with business operations.",
  whatWeDo: {
    title: "What We Do",
    description:
      "Shopify handles the customer-facing commerce layer. Odoo manages the operational layer. UPSTACK designs, builds, integrates, and improves the connected system across both.",
  },
  statement:
    "The aim is simple: a clearer buying experience, a more dependable operation, and a system the business can continue to improve.",
} as const;

export const engagementChoices = [
  "Shopify Store Design",
  "Shopify Development",
  "Odoo Implementation",
  "Shopify–Odoo Integration",
  "Conversion Optimization",
  "Ongoing Support",
  "Not Sure Yet",
] as const;

export const servicesNeededChoices = [
  "Ecommerce & Operational Strategy",
  "Shopify UX & Store Architecture",
  "Shopify Design",
  "Shopify Development",
  "Odoo Implementation",
  "Shopify–Odoo Integration",
  "Data & Reporting",
  "Conversion & Performance Optimization",
  "Ongoing Systems Support",
] as const;

export const timelineChoices = [
  "Ready to begin",
  "Within 1–3 months",
  "Within 3–6 months",
  "More than 6 months",
  "Exploring options",
] as const;

export const budgetChoices = [
  "Below US$15,000",
  "US$15,000–30,000",
  "US$30,000–60,000",
  "US$60,000–100,000",
  "US$100,000+",
  "Prefer to discuss",
] as const;

export const referralChoices = [
  "Search engine",
  "Professional referral",
  "Existing relationship",
  "Shopify community",
  "Odoo community",
  "Social media or publication",
  "Event or conference",
  "Other",
] as const;

export const contactFields = [
  {
    name: "firstName",
    label: "First name",
    kind: "text",
    required: true,
    autoComplete: "given-name",
  },
  {
    name: "lastName",
    label: "Last name",
    kind: "text",
    required: true,
    autoComplete: "family-name",
  },
  {
    name: "email",
    label: "Work email",
    kind: "email",
    required: true,
    autoComplete: "email",
    placeholder: "name@company.com",
  },
  {
    name: "company",
    label: "Company",
    kind: "text",
    required: true,
    autoComplete: "organization",
  },
  {
    name: "website",
    label: "Website",
    kind: "url",
    required: true,
    autoComplete: "url",
    placeholder: "https://",
  },
  {
    name: "phone",
    label: "Phone",
    kind: "tel",
    required: false,
    autoComplete: "tel",
    helpText: "Optional",
  },
  {
    name: "engagementType",
    label: "Engagement type",
    kind: "select",
    required: true,
    placeholder: "Select one",
    options: engagementChoices,
  },
  {
    name: "servicesNeeded",
    label: "Services needed",
    kind: "checkbox-group",
    required: true,
    helpText: "Select all that apply.",
    options: servicesNeededChoices,
  },
  {
    name: "timeline",
    label: "Project timeline",
    kind: "select",
    required: true,
    placeholder: "Select a timeline",
    options: timelineChoices,
  },
  {
    name: "budget",
    label: "Budget range",
    kind: "select",
    required: false,
    placeholder: "Select a range",
    helpText: "Optional",
    options: budgetChoices,
  },
  {
    name: "details",
    label: "Project details",
    kind: "textarea",
    required: true,
    rows: 7,
    placeholder:
      "Describe the current storefront, operational system, priority, and constraint.",
  },
  {
    name: "referralSource",
    label: "How did you hear about UPSTACK?",
    kind: "select",
    required: true,
    placeholder: "Select a source",
    options: referralChoices,
  },
] as const satisfies readonly ContactField[];

export const contactPage = {
  route: "/contact",
  eyebrow: "Book a Call",
  title: "Start with the System.",
  description:
    "Tell us where Shopify, Odoo, or the connection between them is limiting the business. We will use the brief to prepare a focused first conversation.",
  aside: {
    title: "A Useful Brief Includes",
    items: [
      "The commercial priority",
      "The current Shopify and Odoo setup",
      "Operational constraints",
      "Timing and decision context",
    ],
  },
  form: {
    title: "Project Brief",
    description:
      "Required fields are marked. Phone and budget range are optional.",
    submitLabel: "Send Project Brief",
    loadingLabel: "Sending Project Brief…",
    successTitle: "Brief Received.",
    successMessage:
      "Thank you. Your project context has been recorded for review.",
    errorTitle: "The Brief Was Not Sent.",
    errorMessage:
      "Please review the form and try again. Keep a copy of your project details if the issue continues.",
    privacyNote:
      "Submit only the information needed to evaluate the engagement. Do not include passwords, credentials, or sensitive customer data.",
    fields: contactFields,
  },
} as const;

export const siteContent = {
  meta: siteMeta,
  routes: siteRoutes,
  navigation,
  proofCategories,
  globalCta,
  footer: footerContent,
  home: {
    ...homePage,
    coreCapabilities,
  },
  capabilities: {
    ...capabilitiesPage,
    entries: capabilityDetails,
  },
  work: {
    ...workPage,
    entries: workEntries,
  },
  process: {
    ...processPage,
    steps: processSteps,
  },
  about: {
    ...aboutPage,
    principles: aboutPrinciples,
    audiences: aboutAudiences,
    reasons: aboutReasons,
    platformExpertise,
  },
  contact: contactPage,
} as const;
