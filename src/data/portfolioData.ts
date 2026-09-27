export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  techStack: string[];
  highlights: string;
  category?: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "lets-play",
    title: "Let's Play (MVP)",
    role: "Lead Project Manager & QA Specialist",
    techStack: ["Expo", "React Native", "Supabase", "Stripe API", "Branch.io"],
    highlights:
      "Directed Agile delivery and full-stack feature ownership. Architected secure MVP financial workflows using Stripe Connect, defining strict escrow periods and automated withdrawals. Designed core matchmaking logic utilizing a swipe-based grammar and 3-list hierarchy, while enforcing strict anti-spam messaging gates at the database level.",
    category: "Mobile / Fintech",
  },
  {
    id: "chedmed",
    title: "ChedMed (Multi-Vendor Marketplace)",
    role: "QA Analyst",
    techStack: ["Flutter", "React/Next.js", "Node.js", "PostgreSQL"],
    highlights:
      "Conducted deep technical root-cause analysis for complex defects, diagnosing React rendering cycle issues and Flutter widget state conflicts. Escalated and resolved critical production blockers including Next.js client-bundle leaks, database schema desynchronization, and authentication API vulnerabilities.",
    category: "Marketplace / Web",
  },
  {
    id: "thinklawn",
    title: "ThinkLawn",
    role: "QA Lead / QA Engineer",
    techStack: ["Android OS", "AI/Computer Vision"],
    highlights:
      "Validated AI-powered computer vision models for agronomic health detection, ensuring accurate multi-label classification. Uncovered critical map rendering blockers and data integrity bugs in complex geospatial polygon plotting. Proposed critical business logic changes to decouple API queries, unblocking weather-aware features across 50+ countries.",
    category: "Computer Vision / AI",
  },
  {
    id: "blueprint",
    title: "Blueprint (Fintech Mobile MVP)",
    role: "Lead QA Engineer",
    techStack: ["iOS", "Android (Smartphones & Tablets)", "Plaid API"],
    highlights:
      "Engineered core validation architecture for a financial MVP mapping full user journeys to backend data flows. Uncovered critical P1 security flaws including OTP bypasses and session management leaks. Diagnosed complex frontend issues such as infinite API fetch loops caused by unmemoized values and faulty dependency arrays in React hooks.",
    category: "Fintech Mobile",
  },
];
