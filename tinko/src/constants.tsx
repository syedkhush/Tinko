import { 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  Sprout, 
  IndianRupee, 
  ShieldCheck, 
  AlertTriangle, 
  Heart, 
  Search, 
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Building2,
  Globe,
  Zap,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const ICONS = {
  Briefcase,
  GraduationCap,
  TrendingUp,
  Sprout,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Search,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Building2,
  Globe,
  Zap,
  AlertCircle,
  ExternalLink
};

export const CAREER_DATA = {
  science: [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      roadmap: '10th (Science) → 12th (PCM) → JEE Main/Advanced/BITSAT → B.Tech/B.E (CS/IT) → Internships → Job',
      skills: ['Logic', 'Programming', 'Problem Solving', 'Continuous Learning'],
      cost: '₹4L - ₹20L (Private) | ₹1L - ₹5L (Govt)',
      salary: 'Entry: ₹3L-₹12L | Mid: ₹15L-₹40L | Senior: ₹50L+',
      growth: 'High. Transition to Architect, Manager, or CTO.',
      risks: 'Burnout, rapid tech obsolescence, sedentary lifestyle.',
      balance: 'Moderate to Poor (Product companies) | Good (MNCs).',
      who: 'Logical thinkers who enjoy building things and solving puzzles.'
    },
    {
      id: 'medical-doctor',
      title: 'Medical Doctor (MBBS)',
      roadmap: '10th (Science) → 12th (PCB) → NEET UG → MBBS → NEET PG → MD/MS → Residency → Specialist Job',
      skills: ['Memory', 'Empathy', 'Stamina', 'Precision'],
      cost: '₹5L - ₹1Cr+ (Private) | ₹50k - ₹5L (Govt)',
      salary: 'Entry: ₹6L-₹12L | Specialist: ₹15L-₹60L | Private Practice: Unlimited',
      growth: 'Stable. Always in demand. Specialization is key.',
      risks: 'High stress, long hours, legal liabilities, physical exhaustion.',
      balance: 'Poor. Frequent night shifts and emergencies.',
      who: 'Service-oriented individuals with high academic endurance.'
    },
    {
      id: 'research-scientist',
      title: 'Research Scientist',
      roadmap: '10th (Science) → 12th (PCM/PCB) → IAT/NEST → BS-MS (IISER/IISc) → PhD → PostDoc → Scientist (ISRO/DRDO/Academic)',
      skills: ['Critical Thinking', 'Patience', 'Data Analysis', 'Curiosity'],
      cost: '₹1L - ₹5L (Mostly subsidized + Stipends available)',
      salary: 'Entry (Post PhD): ₹8L-₹15L | Senior Scientist: ₹20L-₹45L',
      growth: 'Moderate. Focus on publications, patents, and breakthroughs.',
      risks: 'Long duration of study (10+ years), funding dependencies, limited positions.',
      balance: 'Good to Moderate. Mostly academic or lab-based hours.',
      who: 'Deep thinkers who want to discover new things and advance human knowledge.'
    }
  ],
  abroad: [
    {
      id: 'study-abroad',
      title: 'Study & Settle Abroad (USA/UK/Germany)',
      roadmap: '12th/Degree → IELTS/TOEFL/GRE/GMAT → Application → Visa → MS/MBA Abroad → OPT/Job Search → PR',
      skills: ['Adaptability', 'Language Proficiency', 'Networking', 'Financial Planning'],
      cost: '₹20L - ₹60L (Self-funded) | ₹0 (Full Scholarships like DAAD/Fulbright)',
      salary: 'Entry: $60k-$100k (USA) | €40k-€60k (Germany) | £30k-£50k (UK)',
      growth: 'High global mobility. Better work-life balance and infrastructure.',
      risks: 'High initial debt, visa policy changes, cultural adjustment, homesickness.',
      balance: 'Generally Good. Strong labor laws in Europe/North America.',
      who: 'Ambitious individuals seeking global exposure and better quality of life.'
    }
  ],
  commerce: [
    {
      id: 'chartered-accountant',
      title: 'Chartered Accountant (CA)',
      roadmap: '10th (Any) → 12th → CA Foundation → Inter → Articleship → Final',
      skills: ['Accounting', 'Taxation', 'Law', 'Attention to Detail'],
      cost: '₹2L - ₹5L (Total including coaching)',
      salary: 'Entry: ₹7L-₹15L | Mid: ₹20L-₹45L | Partner: ₹1Cr+',
      growth: 'Very High. Can work in Audit, Tax, Finance, or start own firm.',
      risks: 'Extremely difficult exams (low pass rate), high pressure during tax season.',
      balance: 'Poor during peak seasons (Jan-March, July-Sept) | Good otherwise.',
      who: 'Numbers-driven people who are disciplined and patient.'
    }
  ],
  creative: [
    {
      id: 'content-creator',
      title: 'Content Creator (YouTube/Social Media)',
      roadmap: 'Skill Acquisition → Niche Selection → Consistent Posting → Monetization',
      skills: ['Storytelling', 'Video Editing', 'Marketing', 'Data Analysis'],
      cost: '₹10k (Basic gear) - ₹5L (Pro setup)',
      salary: 'Entry: ₹0 | Mid: ₹50k-₹2L/mo | Top: ₹10L+/mo',
      growth: 'Exponential but volatile. Depends on audience retention.',
      risks: 'Income uncertainty, algorithm changes, public scrutiny, high failure rate.',
      balance: 'Flexible but often 24/7 mental engagement.',
      who: 'Creative risk-takers who enjoy being in the public eye.'
    },
    {
      id: 'film-director',
      title: 'Film Director / Cinematographer',
      roadmap: '12th → Film School (FTII/SRFTI) or Assisting Directors → Short Films → Feature Films',
      skills: ['Visual Storytelling', 'Leadership', 'Technical Camera Knowledge', 'Networking'],
      cost: '₹5L - ₹15L (Film School) | ₹0 (Self-taught/Assisting)',
      salary: 'Assistant: ₹15k-₹50k/project | Director: ₹5L - ₹5Cr+ per film',
      growth: 'High prestige, but extremely competitive. Success depends on "hits".',
      risks: 'Long periods of unemployment, high project-based stress, nepotism.',
      balance: 'Very Poor during shoots (18-hour days) | Good during pre/post-production.',
      who: 'Visual thinkers with strong leadership and a story to tell.'
    },
    {
      id: 'gaming-pro',
      title: 'Professional Gamer / Streamer',
      roadmap: 'Skill Mastery → Tournament Participation → Team Signing or Streaming → Sponsorships',
      skills: ['Reflexes', 'Strategy', 'Consistency', 'Entertaining Personality'],
      cost: '₹50k - ₹2L (Gaming PC/Console + Internet)',
      salary: 'Entry: ₹0 | Pro Player: ₹50k-₹5L/mo | Top Streamer: ₹10L+/mo',
      growth: 'Rapidly growing industry in India (Esports).',
      risks: 'Short career span (reflexes decline), physical strain (eyes/back), high competition.',
      balance: 'Poor. Requires 8-12 hours of practice/streaming daily.',
      who: 'Highly competitive individuals with extreme focus and discipline.'
    }
  ],
  skills: [
    {
      id: 'freelance-dev',
      title: 'Freelance Web/App Developer',
      roadmap: 'Learn MERN/Next.js → Build Portfolio → Upwork/Fiverr → Direct Clients',
      skills: ['Coding', 'Client Communication', 'Time Management', 'Self-Marketing'],
      cost: '₹0 (Self-taught via YouTube/Documentation)',
      salary: 'Entry: ₹20k/mo | Mid: ₹1L-₹3L/mo | Expert: ₹5L+/mo',
      growth: 'Unlimited. Can transition into a service agency.',
      risks: 'Irregular income, isolation, no corporate benefits (PF/Insurance).',
      balance: 'Excellent. You choose your hours.',
      who: 'Self-disciplined learners who prefer working alone and remotely.'
    }
  ]
};

export const GOVT_JOBS = [
  {
    title: 'UPSC (Civil Services)',
    eligibility: 'Any Graduate, Age 21-32',
    pattern: 'Prelims (Objective) → Mains (Written) → Interview',
    roadmap: '1-2 years dedicated prep → Prelims → Mains → Interview',
    timeline: '1.5 years for one full cycle',
    difficulty: 'Extremely High (0.1% success rate)',
    backup: 'State PSC, SSC CGL, Teaching, Private Sector'
  },
  {
    title: 'SSC CGL',
    eligibility: 'Any Graduate',
    pattern: 'Tier I (CBT) → Tier II (CBT)',
    roadmap: '6-12 months prep focusing on Maths & English',
    timeline: '1 year',
    difficulty: 'Moderate to High',
    backup: 'Banking, Railways, State Govt Jobs'
  }
];

export const BUSINESS_DATA = [
  {
    type: 'Small Business (Retail Shop)',
    investment: '₹5L - ₹20L',
    guide: 'Location selection → Supplier tie-ups → Interior setup → Marketing',
    legal: 'GST, Trade License, MSME Registration',
    risk: 'Moderate (Location dependent)',
    profit_timeline: '6 - 18 months',
    failure_rate: '30-40% in first 3 years',
    skills: 'Sales, Inventory Management, Customer Service',
    example: 'Grocery store, Clothing boutique, Mobile repair shop'
  },
  {
    type: 'Online Business (E-commerce)',
    investment: '₹50k - ₹5L',
    guide: 'Product sourcing → Website/Marketplace setup → Digital Marketing → Logistics',
    legal: 'GST (Mandatory for online), MSME',
    risk: 'Low to Moderate (Scalable)',
    profit_timeline: '3 - 12 months',
    failure_rate: '70-80% (High competition)',
    skills: 'Digital Marketing, SEO, Logistics, Tech-savvy',
    example: 'Selling handmade crafts on Instagram/Amazon'
  }
];

export const FARMING_DATA = [
  {
    type: 'Dairy Farming',
    investment: '₹10L - ₹15L (for 10 cows/buffaloes)',
    land: '0.5 - 1 Acre (for shed and fodder)',
    expenses: '₹50k - ₹80k/month (Feed, Vet, Labor)',
    income: '₹1L - ₹1.5L/month (Gross)',
    subsidies: 'NABARD Dairy Entrepreneurship Development Scheme',
    risks: 'Disease outbreaks, milk price fluctuations, high labor dependency',
    setup: 'Shed construction → Animal purchase → Fodder management → Milk supply tie-up',
    roi: '2 - 3 years'
  },
  {
    type: 'Poultry Farming (Broiler)',
    investment: '₹5L - ₹8L (for 5000 birds)',
    land: '0.25 Acre',
    expenses: '₹2L - ₹3L per batch (45 days)',
    income: '₹30k - ₹60k profit per batch',
    subsidies: 'State-specific poultry schemes',
    risks: 'Bird Flu, high feed costs, extreme weather',
    setup: 'Coop construction → Chick sourcing → Feed management → Market tie-up',
    roi: '1.5 - 2 years'
  }
];

export const FINANCIAL_BASICS = {
  tax_basics: [
    { title: 'Income Tax Slabs', desc: 'Progressive tax based on income. New vs Old regime options.' },
    { title: 'Agriculture Income', desc: '100% Tax-free in India (Section 10(1)).' },
    { title: 'GST', desc: 'Required for businesses with turnover > ₹40L (Goods) or ₹20L (Services).' }
  ],
  saving_tips: [
    { title: '80C Deductions', desc: 'Save up to ₹1.5L via PPF, ELSS, LIC, etc.' },
    { title: 'Business Expenses', desc: 'Deduct rent, salaries, and equipment costs from taxable income.' }
  ]
};
