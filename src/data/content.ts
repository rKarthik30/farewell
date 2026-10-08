/* =============================================================================
 *  ✏️  CONTENT FILE — EDIT ME
 * -----------------------------------------------------------------------------
 *  Every piece of personal text on the site lives in this one file.
 *  You never need to touch the components to change the words.
 * ============================================================================= */

/* ---------------------------------------------------------------------------
 *  PROFILE — used in the hero, message signature, footer and terminal.
 * ------------------------------------------------------------------------- */
export const profile = {
  name: 'Karthik R',
  handle: 'karthik',
  role: 'Senior Software Developer · Frontend & AI',
  company: 'SM Netserv → Accionlabs',
  tenure: '4+ years',
  lastDay: '23 Oct 2026',
};

/* ---------------------------------------------------------------------------
 *  HERO
 * ------------------------------------------------------------------------- */
// Lines printed by the boot sequence before the headline appears.
export const bootLines = [
  'initializing farewell.exe',
  `mounting ${profile.tenure} of memories`,
  'loading projects ...... rapit ✓  evolution2 ✓  qaconnector ✓',
  'embedding goodbyes into vector store',
];

// The big headline. Each string is its own line (scramble-revealed in order).
export const heroHeadline = ['I came to write code.', "I'm leaving with a family."];

// Small stats row under the headline.
export const heroStats = [
  { value: '4.8', label: 'years' },
  { value: '3', label: 'products' },
  { value: '20+', label: 'teammates' },
  { value: '∞', label: 'chai' },
];

/* ---------------------------------------------------------------------------
 *  THE JOURNEY — timeline entries, oldest first.
 *  kind controls the dot colour + badge:
 *    'join' | 'milestone' | 'promotion' | 'project' | 'farewell'
 * ------------------------------------------------------------------------- */
export type TimelineKind = 'join' | 'milestone' | 'promotion' | 'project' | 'farewell';

export type TimelineEntry = {
  date: string;
  title: string;
  kind: TimelineKind;
  description: string;
  tags?: string[];
};

export const timeline: TimelineEntry[] = [
  {
    date: 'Dec 2021',
    title: 'Day one — Software Trainee (Frontend)',
    kind: 'join',
    description:
      "Joined SM Netserv Technologies. Under Mali's supervision I built Rapit, a resource management application, and my first real production code.",
    tags: ['React', 'Redux', 'Ant Design', 'SQL', 'LDAP'],
  },
  {
    date: 'Apr 2022',
    title: 'Promoted to Software Engineer',
    kind: 'promotion',
    description:
      'Trainee badge retired. I joined the Evolution 2 team under Sucharita Paul, the best manager I have had, and learned from Anush Narayana how a real team works: git, code reviews and everything in between.',
  },
  {
    date: 'Apr 2022 – Nov 2024',
    title: 'Evolution 2',
    kind: 'project',
    description:
      'Frontend developer on a resource, customer and project management platform, in a team of about 20: Pavan Kumar, Sushmitha Nala, Veena, Vinod and many more.',
    tags: ['Frontend', 'Team of 20+'],
  },
  {
    date: 'Dec 2024',
    title: 'QAConnector, and the AI chapter begins',
    kind: 'project',
    description:
      'A new test-management tool, managed by Saju. I built the frontend from scratch all the way to production, with AI built in. Pranathi Patel taught me the backbone of AI, and my first experiment was a RAG-powered HR chatbot. Built alongside Pavan Kumar, Sanjeev and others.',
    tags: ['Next.js', 'KendoReact', 'AI', 'RAG'],
  },
  {
    date: 'Apr 2025',
    title: 'Promoted to Senior Software Developer',
    kind: 'promotion',
    description: 'Now spanning frontend, AI backend and .NET backend. Full stack, with an AI twist.',
    tags: ['Frontend', 'AI backend', '.NET'],
  },
  {
    date: 'Sep 2025',
    title: 'SM Netserv merges with Accionlabs',
    kind: 'milestone',
    description: 'Same people, same mission, a bigger stage.',
    tags: ['Accionlabs'],
  },
  {
    date: '23 Oct 2026',
    title: 'git commit -m "goodbye"',
    kind: 'farewell',
    description: 'Last working day. Handing over the keys and leaving the codebase a little better than I found it.',
  },
];

/* ---------------------------------------------------------------------------
 *  WHAT I BUILT — 3 to 5 projects work best.
 *  image: optional. Drop a PNG/JPG/GIF into /public/projects and set
 *         image: '/projects/my-shot.png'. Without one, a generated
 *         gradient visual is shown instead.
 *  accent: 'cyan' | 'violet' | 'pink' | 'lime'
 * ------------------------------------------------------------------------- */
export type Accent = 'cyan' | 'violet' | 'pink' | 'lime';

export type Project = {
  title: string;
  tagline: string;
  description: string;
  impact: string;
  stack: string[];
  accent: Accent;
  year: string;
  image?: string;
  link?: string;
};

export const projects: Project[] = [
  {
    title: 'Rapit',
    tagline: 'Where it all started.',
    description:
      "A resource management application, built as a trainee under Mali's supervision. Enterprise login via LDAP, with data backed by SQL.",
    impact: 'My first production app · learned the full frontend workflow',
    stack: ['React', 'Redux', 'Ant Design', 'SQL', 'LDAP'],
    accent: 'lime',
    year: 'Dec 2021',
  },
  {
    title: 'Evolution 2',
    tagline: 'Resources, customers and projects in one place.',
    description:
      'A resource, customer and project management platform. I was a frontend developer here, inside a 20-member team.',
    impact: 'Where I learned how great teams ship together',
    stack: ['React', 'Redux', 'REST APIs'], // ✏️ adjust to the real stack
    accent: 'violet',
    year: 'Apr 2022',
  },
  {
    title: 'QAConnector',
    tagline: 'Test management, rebuilt from scratch.',
    description:
      'A testing-tool management platform managed by Saju. I owned the frontend from the first commit to production deployment, and built the AI features into it with guidance from Pranathi Patel.',
    impact: 'Built from zero to production · AI-assisted testing workflows',
    stack: ['Next.js', 'KendoReact', 'TypeScript', 'LLMs'],
    accent: 'cyan',
    year: 'Dec 2024',
  },
  {
    title: 'HR Chatbot (RAG)',
    tagline: 'Ask HR anything, at any hour.',
    description:
      'My first AI project, built while Pranathi Patel was teaching me the fundamentals. HR documents are embedded into a vector store and retrieved to answer employee questions in natural language.',
    impact: 'The side project that started my AI journey',
    stack: ['LangChain', 'RAG', 'Vector DB', 'Embeddings', 'React'],
    accent: 'pink',
    year: 'Side project', // ✏️ set the month + year, e.g. 'Feb 2025'
  },
];

/* ---------------------------------------------------------------------------
 *  SKILLS & STACK — rendered as orbiting rings (inner → outer).
 *  Keep each ring to roughly 4–7 items so they don't overlap.
 * ------------------------------------------------------------------------- */
export const skillOrbits: { label: string; accent: Accent; items: string[] }[] = [
  { label: 'Frontend', accent: 'cyan', items: ['React', 'Next.js', 'TypeScript', 'Redux', 'JavaScript'] },
  {
    label: 'UI & Backend',
    accent: 'violet',
    items: ['KendoReact', 'Ant Design', '.NET', 'SQL', 'LDAP', 'FastAPI'],
  },
  {
    label: 'AI',
    accent: 'pink',
    items: ['LangChain', 'LangGraph', 'LlamaIndex', 'RAG', 'GPT-4', 'Embeddings', 'LangSmith'],
  },
];

// "What I'm building next". Shown beside the orbit.
export const buildingNext = [
  { title: 'Agentic workflows', detail: 'Multi-step AI agents with LangGraph that plan, act and explain.' },
  { title: 'Production-grade RAG', detail: 'Retrieval with citations, evals and tracing, so you can trust it.' },
  { title: 'Streaming, AI-native UIs', detail: 'Interfaces that feel real-time because they are.' },
  { title: 'Cloud-native AI on Azure', detail: 'Freshly AZ-900 certified, and taking it to production next.' },
];

/* ---------------------------------------------------------------------------
 *  MESSAGE TO THE TEAM — typed out after the "decrypt" interaction.
 *  Each string in `paragraphs` becomes its own paragraph.
 * ------------------------------------------------------------------------- */
export const farewellMessage = {
  greeting: 'Hey team,',
  paragraphs: [
    "In December 2021 I walked in as a frontend trainee, nervously building Rapit under Mali's watchful eye. Almost five years, three products and one merger later, today, 23 October 2026, is my last working day.",
    'Sucharita, you were the best manager I could have asked for. Anush, you were the first person who really taught me how a team works: git, clean code, and how to ask the right questions. The Evolution 2 crew (Pavan, Sushmitha, Veena, Vinod and everyone else in that 20-strong team) showed me what shipping together actually feels like.',
    'QAConnector was the most fun I have had building something: from an empty repo to production, with AI built in. Saju, thank you for steering the project and trusting me with it. Pranathi, you taught me the backbone of AI, and everything I build next stands on that. Pavan, Sanjeev and the whole team, thank you for the late fixes and the good laughs.',
    'Sridharan (SBJ) and Sumit (PMO), you supported me every single time I needed it. That kind of backing is rare, and I never took it for granted.',
    "To everyone who answered my 'quick question' messages, reviewed my PRs or shared a chai break: thank you. The code will be refactored someday. What I learned from you won't.",
    "This isn't goodbye, it's a context switch. My inbox and my LinkedIn stay open, so please keep in touch.",
  ],
  signoff: 'With gratitude and one last approved PR,',
};

/* ---------------------------------------------------------------------------
 *  SIGN-OFF FINALE — starts when the reader clicks "I've read it. Sign off" under the message:
 *  the page glitches and scrambles, then shows these lines.
 * ------------------------------------------------------------------------- */
export const signOff = {
  headline: 'Thank you.',
  typed: 'signing off...',
};

/* ---------------------------------------------------------------------------
 *  CONTACT — clicking a card copies `copy` to the clipboard and shows `toast`.
 *  icon: 'mail' | 'linkedin' | 'github' | 'phone'
 * ------------------------------------------------------------------------- */
export const contact = {
  headline: "Let's stay in touch.",
  sub: 'Open to collaborating on AI-native products, modern frontends and anything that makes the web feel a little magical.',
  links: [
    {
      icon: 'mail',
      label: 'Email',
      display: 'kirthikrishna30@gmail.com',
      copy: 'kirthikrishna30@gmail.com',
      toast: 'Email copied',
    },
    {
      icon: 'linkedin',
      label: 'LinkedIn',
      display: 'in/karthik-r-774709115',
      copy: 'https://www.linkedin.com/in/karthik-r-774709115',
      toast: 'LinkedIn profile copied',
    },
    // Add GitHub later, e.g.:
    // { icon: 'github', label: 'GitHub', display: 'github.com/you', copy: 'https://github.com/you', toast: 'GitHub profile copied' },
  ] as { icon: 'mail' | 'linkedin' | 'github' | 'phone'; label: string; display: string; copy: string; toast: string }[],
};
