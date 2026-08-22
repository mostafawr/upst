/**
 * Central editorial content for the UPSTACK website.
 *
 * Work entries describe live client engagements and each carries a `liveUrl` so
 * the claim is checkable. Describe only work actually performed, and do not add
 * performance figures unless they are independently verifiable.
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

export interface WorkEntry {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly summary: string;
  readonly services: readonly string[];
  readonly outcomeAreas: readonly string[];
  readonly technology: readonly string[];
  /** Live storefront, so every claim on this site is checkable. */
  readonly liveUrl: string;
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
  | "fullName"
  | "email"
  | "phone"
  | "budget"
  | "website"
  | "details";

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
    id: "more-cottons",
    title: "More Cottons",
    category: "Shopify + Odoo",
    summary:
      "A home textiles retailer with a deep catalogue across bedroom, bathroom, and bridal. UPSTACK runs the Shopify storefront and the Odoo operation behind it, so the catalogue and the warehouse agree.",
    services: [
      "Storefront management",
      "Catalogue and merchandising",
      "Odoo implementation",
      "Inventory and fulfillment operations",
      "Reporting",
    ],
    outcomeAreas: [
      "Catalogue depth without confusion",
      "Inventory accuracy",
      "Operational visibility",
      "Reporting the team uses",
    ],
    technology: ["Shopify", "Odoo", "Inventory", "Reporting"],
    liveUrl: "https://morecottons.com",
    featured: true,
  },
  {
    id: "surur",
    title: "Surur",
    category: "Shopify Storefront",
    summary:
      "A modern furniture retailer selling across rooms and collections. Built as a bilingual Shopify storefront where browsing by room and by collection both lead cleanly to the product.",
    services: [
      "Store architecture",
      "Shopify theme build",
      "Bilingual EN/AR setup",
      "Collection and navigation design",
      "Product merchandising",
    ],
    outcomeAreas: [
      "Room-led discovery",
      "Bilingual parity",
      "Collection clarity",
      "Product presentation",
    ],
    technology: ["Shopify", "Liquid", "Bilingual storefront"],
    liveUrl: "https://surureg.com",
  },
  {
    id: "dress-code",
    title: "Dress Code",
    category: "Shopify Storefront",
    summary:
      "An Egyptian fashion label running frequent drops and promotions. Built as a Shopify storefront where new arrivals, campaign offers, and instalment payments stay clear at every step.",
    services: [
      "Store architecture",
      "Shopify theme build",
      "Campaign and promotion setup",
      "Instalment payment integration",
      "Collection merchandising",
    ],
    outcomeAreas: [
      "Fast drop turnaround",
      "Offer clarity",
      "Checkout confidence",
      "Repeat browsing",
    ],
    technology: ["Shopify", "Liquid", "Sympl instalments"],
    liveUrl: "https://dresscodeme.com",
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
    "Work shown on this site is live client work. No performance figures are claimed unless independently verifiable.",
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
    "Live Shopify storefronts and connected Odoo operations, built and run by UPSTACK.",
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

export const budgetChoices = [
  "US$500–1,000",
  "US$1,000–2,000",
  "US$2,000+",
] as const;

export const contactFields = [
  {
    name: "fullName",
    label: "Name",
    kind: "text",
    required: true,
    autoComplete: "name",
  },
  {
    name: "phone",
    label: "Phone",
    kind: "tel",
    required: true,
    autoComplete: "tel",
  },
  {
    name: "email",
    label: "Email",
    kind: "email",
    required: true,
    autoComplete: "email",
  },
  {
    name: "budget",
    label: "Budget",
    kind: "select",
    required: true,
    placeholder: "Select a range",
    options: budgetChoices,
  },
  {
    name: "website",
    label: "Website",
    kind: "url",
    required: false,
    autoComplete: "url",
    placeholder: "example.com",
    helpText: "Optional",
  },
  {
    name: "details",
    label: "What do you need?",
    kind: "textarea",
    required: false,
    rows: 5,
    placeholder:
      "A Shopify store, an Odoo setup, or the connection between them.",
  },
] as const satisfies readonly ContactField[];

export const contactPage = {
  route: "/contact",
  eyebrow: "Book a Call",
  title: "Start with the System.",
  description:
    "Tell us where Shopify, Odoo, or the connection between them is limiting the business. Four fields is all it takes to start.",
  aside: {
    title: "What Happens Next",
    items: [
      "We read your enquiry the same working day",
      "We call or email to understand the priority",
      "You get a focused first conversation",
      "No obligation, no scripted pitch",
    ],
  },
  form: {
    title: "Tell Us What Must Work Better.",
    description:
      "Name, phone, email, and budget are required. Everything else is optional.",
    submitLabel: "Submit Enquiry",
    loadingLabel: "Sending…",
    successTitle: "Enquiry received.",
    successMessage:
      "Thank you. We will be in touch to arrange the first conversation.",
    errorTitle: "The Enquiry Was Not Sent.",
    errorMessage:
      "Please review the form and try again. Keep a copy of your details if the issue continues.",
    privacyNote:
      "We use your contact details only to respond to this enquiry. Do not include passwords, credentials, or sensitive customer data.",
    fields: contactFields,
  },
} as const;

/**
 * Business identity used by the legal pages and structured data.
 * `contactEmail` is optional: when empty, the policies direct people to the
 * enquiry form instead of showing an address that does not exist.
 */
export const legalInfo = {
  entityName: "UPSTACK Commerce Systems",
  location: "Cairo, Egypt",
  jurisdiction: "Egypt",
  contactEmail: "",
  lastUpdated: "22 August 2026",
} as const;

export const legalPages = {
  privacy: {
    route: "/privacy",
    eyebrow: "Legal",
    title: "Privacy Policy.",
    description:
      "What UPSTACK collects when you send an enquiry or browse this site, why, and how to have it removed.",
  },
  terms: {
    route: "/terms",
    eyebrow: "Legal",
    title: "Terms of Use.",
    description:
      "The terms that apply to this website and to enquiries sent through it.",
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
