import type { ProjectLink } from './projects.ts';
import { AUTHOR_NAME, CONTACT_EMAIL, GITHUB_URL, JOB_TITLE, LINKEDIN_URL, SITE_NAME } from './site.ts';

export type ProjectCategory =
  | 'Cybersecurity & Networking'
  | 'Cybersecurity & Network Security'
  | 'Cybersecurity & Secure Coding'
  | 'Python & Tools';

export type CapabilityIconKey = 'security' | 'python-sql' | 'frontend';

export interface PortfolioProject {
  id: string;
  name: string;
  category: ProjectCategory;
  year: string;
  featured: boolean;
  isCooking?: boolean;
  description: string;
  technologies: string[];
  links: ProjectLink[];
}

export interface CapabilityPillar {
  id: string;
  iconKey: CapabilityIconKey;
  title: string;
  description: string;
  technologies: string[];
}

export interface PortfolioExperienceItem {
  id: string;
  role: string;
  organization: {
    name: string;
    url?: string;
  };
  dates: string;
  location: string;
  summary: string;
  details: string[];
  technologies: string[];
}

/**
 * Edit this file to customize Asheel Mohammad's portfolio bio, skills, projects, and background.
 * Update social links, email, and domain settings in `src/lib/site.ts`, and replace
 * `src/assets/home/portrait.jpg` with your own photo when ready.
 */
export const PORTFOLIO_PROFILE = {
  name: AUTHOR_NAME,
  shortName: SITE_NAME,
  role: JOB_TITLE,
  availability: 'B.Tech CS (Cyber Security) · Open to Collaborate',
  location: 'Open to Remote & Community Collaboration',
  headlineLead: "Hi, I'm",
  headlineAccentName: AUTHOR_NAME,
  headlineMiddle: '. Exploring',
  headlineAccentWork: 'cybersecurity',
  headlineJoin: '&',
  headlineAccentApis: 'frontend development',
  heroSummary:
    'B.Tech Computer Science student specializing in Cyber Security — building practical skills in penetration testing, Kali Linux, Burp Suite, Python, SQL, and modern frontend development.',
  portraitAlt: 'Portrait of Asheel Mohammad',
  portraitCaption: AUTHOR_NAME,
  email: CONTACT_EMAIL,
  githubUrl: GITHUB_URL,
  linkedinUrl: LINKEDIN_URL,
  quickStats: [
    { label: 'Degree', value: 'B.Tech CS (Cyber Security)' },
    { label: 'Security Tools', value: 'Kali Linux & Burp Suite' },
    { label: 'Programming & Web', value: 'Python, SQL & Frontend' },
  ],
  aboutParagraphs: [
    "I'm Asheel Mohammad, a B.Tech Computer Science student specializing in Cyber Security, with a strong interest in cybersecurity, ethical hacking, and frontend development.",
    "I'm building practical skills in areas such as penetration testing and security tools including Kali Linux and Burp Suite. I also have experience with Python, SQL, and frontend development, and enjoy creating projects that combine technology with security.",
    "I'm continuously learning through hands-on projects and real-world problem solving. My goal is to develop strong expertise in cybersecurity and eventually contribute to securing applications and systems.",
    "I'm always open to learning, collaborating on projects, and connecting with people in the cybersecurity and technology community.",
  ],
  preferredRoles: [
    'Cybersecurity Projects & CTFs',
    'Application Security & Pentesting Labs',
    'Frontend + Security Builds',
    'Internships & Collaborative Learning',
  ],
  contactTopics: ['Project Collaboration', 'Cybersecurity Discussion', 'Internship / Opportunity', 'General Hello'],
};

export const CAPABILITY_PILLARS: CapabilityPillar[] = [
  {
    id: 'cybersecurity-pentesting',
    iconKey: 'security',
    title: 'Cyber Security & Ethical Hacking',
    description:
      'Building practical skills in penetration testing, HTTP traffic analysis, and identifying application vulnerabilities in lab environments.',
    technologies: ['Kali Linux', 'Burp Suite', 'Penetration Testing', 'Ethical Hacking', 'AppSec'],
  },
  {
    id: 'python-sql',
    iconKey: 'python-sql',
    title: 'Python & SQL',
    description:
      'Developing automation scripts, security helpers, and structured database queries for real-world problem solving and data inspection.',
    technologies: ['Python', 'SQL', 'Scripting', 'Query Design', 'Automation'],
  },
  {
    id: 'frontend-dev',
    iconKey: 'frontend',
    title: 'Frontend Development',
    description:
      'Creating responsive, accessible web interfaces and combining modern UI engineering with security-conscious web practices.',
    technologies: ['React', 'TypeScript', 'JavaScript', 'HTML & CSS', 'Tailwind CSS'],
  },
];

export const PROJECT_CATEGORIES: readonly ('All' | ProjectCategory)[] = [
  'All',
  'Cybersecurity & Networking',
  'Cybersecurity & Network Security',
  'Cybersecurity & Secure Coding',
  'Python & Tools',
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'network-sniffer-packet-analyzer',
    name: 'Network Sniffer – Packet Analyzer',
    category: 'Cybersecurity & Networking',
    year: '2026',
    featured: true,
    description:
      'Python-based network packet analysis tool for capturing and inspecting network traffic across active interfaces. Analyzes packet headers, IP addresses, MAC addresses, transport protocols, ports, TCP flags, and payload data to understand network communication and data flow.',
    technologies: ['Python', 'Scapy', 'Socket', 'Networking', 'Packet Analysis'],
    links: [
      {
        kind: 'github',
        url: 'https://github.com/MohammadAsheel/NetworkSniffer',
      },
    ],
  },
  {
    id: 'network-intrusion-detection-system',
    name: 'Network Intrusion Detection System (NIDS)',
    category: 'Cybersecurity & Network Security',
    year: '2026',
    featured: true,
    description:
      'Python-based security tool that analyzes network traffic to detect suspicious activities such as port scanning, SYN floods, and ICMP floods. Generates real-time alerts, classifies threats, and logs security events for further investigation.',
    technologies: ['Python', 'Scapy', 'Network Security', 'Intrusion Detection'],
    links: [
      {
        kind: 'github',
        url: 'https://github.com/MohammadAsheel/Network-Intrusion-Detection-System',
      },
    ],
  },
  {
    id: 'ballon-valuation-engine',
    name: 'BALLON Valuation Engine',
    category: 'Python & Tools',
    year: '2025',
    featured: true,
    description:
      'End-to-end machine learning system for predicting football player transfer fees using historical performance data, market valuations, and transfer statistics. Compares predicted values against actual transfer fees.',
    technologies: ['Python', 'Machine Learning', 'Regression', 'Data Analysis'],
    links: [
      { kind: 'github', url: 'https://github.com/MohammadAsheel/Ball-On' },
      { kind: 'demo', url: 'https://ball-on.vercel.app/', label: 'Live Website' },
    ],
  },
  {
    id: 'secure-coding-review',
    name: 'Secure Coding Review',
    category: 'Cybersecurity & Secure Coding',
    year: '2026',
    featured: true,
    description:
      'A cybersecurity project focused on identifying web application vulnerabilities and implementing secure coding practices. Compares an intentionally vulnerable web application with its hardened counterpart to demonstrate improved security and protection against common threats.',
    technologies: ['Python', 'Web Security', 'Secure Coding', 'OWASP'],
    links: [
      {
        kind: 'github',
        url: 'https://github.com/MohammadAsheel/SecureCodingReview',
      },
    ],
  },
];

export const PORTFOLIO_EXPERIENCE: PortfolioExperienceItem[] = [
  {
    id: 'btech-cybersecurity',
    role: 'B.Tech Computer Science (Cyber Security)',
    organization: { name: 'Undergraduate Studies' },
    dates: 'Current Focus',
    location: 'CSE · Cyber Security',
    summary:
      'Pursuing a B.Tech degree in Computer Science with a specialization in Cyber Security, blending core CS theory with practical system security.',
    details: [
      'Studying operating systems, computer networks, database management with SQL, and foundational cryptography and application security.',
      'Applying classroom concepts directly through security labs, Python scripting, and web application projects.',
    ],
    technologies: ['Cyber Security', 'Python', 'SQL', 'Networking', 'Operating Systems'],
  },
  {
    id: 'codealpha-cybersecurity-internship',
    role: 'Cyber Security Internship',
    organization: { name: 'CodeAlpha' },
    dates: 'Completed Internship',
    location: 'Cybersecurity',
    summary:
      'Successfully completed the CodeAlpha Virtual Internship Program in Cyber Security, gaining practical knowledge and experience in cybersecurity concepts and security practices.',
    details: [
      'Developed an understanding of cybersecurity fundamentals, vulnerability assessment, network security, and system security through practical learning and security-focused activities.',
      'Strengthened my technical skills in identifying security risks, analyzing vulnerabilities, and understanding real-world cybersecurity challenges.',
      'Received a **Letter of Recommendation** from CodeAlpha in recognition of my dedication and contributions throughout the internship.',
    ],
    technologies: ['Cybersecurity', 'Vulnerability Assessment', 'Network Security', 'Security Analysis'],
  },
  {
    id: 'security-frontend-projects',
    role: 'Frontend & Security-Focused Builder',
    organization: { name: 'Personal & Collaborative Projects' },
    dates: 'Ongoing',
    location: 'Open to Collaborate',
    summary:
      'Creating projects that combine responsive frontend development with Python, SQL, and cybersecurity concepts.',
    details: [
      'Building clean user interfaces in React and TypeScript alongside Python utilities and SQL-backed analysis tools.',
      'Continuously learning through hands-on problem solving and connecting with peers across the cybersecurity and tech community.',
    ],
    technologies: ['React', 'TypeScript', 'Python', 'SQL', 'Frontend'],
  },
];
