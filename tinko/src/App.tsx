import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ICONS, CAREER_DATA, GOVT_JOBS, BUSINESS_DATA, FARMING_DATA, FINANCIAL_BASICS } from './constants';
import { supabase } from './lib/supabase';

// --- Types ---
interface AccessState {
  isPaid: boolean;
  paymentId: string | null;
}

// --- Components ---

const Navbar = ({ activeTab, setActiveTab, isPaid }: { activeTab: string, setActiveTab: (t: string) => void, isPaid: boolean }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'careers', label: 'Careers', icon: 'GraduationCap' },
    { id: 'business', label: 'Business', icon: 'Building2' },
    { id: 'farming', label: 'Farming', icon: 'Sprout' },
    { id: 'apply', label: 'Apply Now', icon: 'ExternalLink' },
    { id: 'compare', label: 'Compare Tool', icon: 'TrendingUp' },
    { id: 'finance', label: 'Finance', icon: 'IndianRupee' },
    { id: 'decision', label: 'Career Quiz', icon: 'Zap' },
    { id: 'counselor', label: 'Ask Tinko', icon: 'Heart' },
    { id: 'resources', label: 'Resource Library', icon: 'Search' },
    { id: 'parents', label: 'Parent\'s Corner', icon: 'Users' },
    { id: 'scholarships', label: 'Scholarships', icon: 'IndianRupee' },
    { id: 'tracker', label: 'Skill Tracker', icon: 'CheckCircle2' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 mr-8">
        <div className="bg-orange-600 p-1.5 rounded-lg">
          <ICONS.Briefcase className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-gray-900 whitespace-nowrap">Tinko</span>
      </div>
      <div className="flex gap-1">
        {tabs.map((tab) => {
          const Icon = ICONS[tab.icon as keyof typeof ICONS];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {!isPaid && tab.id !== 'dashboard' && tab.id !== 'decision' && (
                <ICONS.ShieldCheck className="w-3 h-3 text-gray-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const PaymentGate = ({ onPaymentSuccess }: { onPaymentSuccess: (id: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');

    // If keys are missing, allow a mock "Free Unlock" for testing
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    if (!razorpayKey) {
      setLoading(true);
      try {
        const mockPayId = 'mock_pay_' + Date.now();
        const verifyRes = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: 'mock_order_' + Date.now(),
            razorpay_payment_id: mockPayId,
            email: email,
            isMock: true
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.status === 'success') {
          onPaymentSuccess(mockPayId);
        } else {
          setError('Failed to grant mock access. Please try again.');
        }
      } catch (err) {
        console.error(err);
        setError('Connection error. Is the server running?');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      const orderRes = await fetch('/api/payment/create-order', { method: 'POST' });
      const orderData = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Tinko',
        description: 'Full Access to Career, Business & Farming Insights',
        order_id: orderData.id,
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              email: email
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.status === 'success') {
            onPaymentSuccess(response.razorpay_payment_id);
          }
        },
        prefill: {
          email: email,
          contact: '9999999999'
        },
        theme: { color: '#ea580c' }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-orange-100 rounded-3xl p-8 text-center shadow-xl max-w-lg mx-auto my-12">
      <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <ICONS.ShieldCheck className="w-8 h-8 text-orange-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Unlock Full Access</h2>
      <p className="text-gray-600 mb-8">
        Get complete roadmaps, profit timelines, government schemes, and the comparison tool for just ₹99.
      </p>
      <div className="space-y-4 mb-8">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            placeholder="Enter your email to receive access"
            className={`w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500 ${error ? 'border-red-500' : 'border-gray-200'}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex items-center gap-3 text-left bg-gray-50 p-3 rounded-xl">
          <ICONS.CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium">100+ Career Roadmaps & Salaries</span>
        </div>
        <div className="flex items-center gap-3 text-left bg-gray-50 p-3 rounded-xl">
          <ICONS.CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium">Business Profit & Risk Analysis</span>
        </div>
        <div className="flex items-center gap-3 text-left bg-gray-50 p-3 rounded-xl">
          <ICONS.CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium">Farming ROI & Govt Subsidies</span>
        </div>
      </div>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
      >
        {loading ? 'Processing...' : (import.meta.env.VITE_RAZORPAY_KEY_ID ? 'Pay ₹99 to Unlock Everything' : 'Unlock for Free (Demo Mode)')}
        <ICONS.ArrowRight className="w-5 h-5" />
      </button>
      <p className="text-xs text-gray-400 mt-4">One-time payment. Lifetime access.</p>
    </div>
  );
};

const Card = ({ children, title, icon: IconComponent, className = "", locked = false }: any) => (
  <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative ${className}`}>
    {locked && (
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
        <div className="bg-white p-3 rounded-full shadow-lg border border-gray-100">
          <ICONS.ShieldCheck className="w-6 h-6 text-orange-600" />
        </div>
      </div>
    )}
    {title && (
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
        {IconComponent && <IconComponent className="w-4 h-4 text-orange-600" />}
        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">{title}</h3>
      </div>
    )}
    <div className="p-4">
      {children}
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
    {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

// --- Modules ---

const ApplyNow = ({ isPaid }: { isPaid: boolean }) => {
  const [apps, setApps] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', '10th', '12th', 'degree', 'govt', 'abroad'];

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/data/applications');
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesFilter = filter === 'All' || app.category === filter;
    const matchesSearch = (app.title?.toLowerCase() || '').includes(search.toLowerCase()) || 
                          (app.description?.toLowerCase() || '').includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const urgentApps = apps
    .filter(app => app.deadline && new Date(app.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  if (loading) return <div className="py-12 text-center">Loading opportunities...</div>;

  return (
    <div className="space-y-8">
      <SectionHeader title="Apply Now" subtitle="Direct links to exams, courses, and jobs." />

      {/* Urgent Deadlines */}
      {urgentApps.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
            <ICONS.AlertCircle className="w-5 h-5" />
            <span>Urgent Deadlines</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {urgentApps.map((app, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-red-100">
                <h4 className="font-bold text-gray-900 text-sm">{app.title}</h4>
                <p className="text-red-600 text-xs font-semibold mt-1">
                  Deadline: {new Date(app.deadline).toLocaleDateString()}
                </p>
                <a 
                  href={app.apply_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-bold text-orange-600 hover:underline"
                >
                  Apply Fast →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search exams, courses..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filter === cat ? 'bg-orange-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-500'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Application Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredApps.map((app, i) => (
          <Card key={i} title={app.title} icon={app.type === 'exam' ? ICONS.GraduationCap : ICONS.Briefcase}>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{app.description}</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-400 uppercase">Eligibility</p>
                  <p className="font-bold text-gray-700">{app.eligibility}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase">Difficulty</p>
                  <p className={`font-bold ${
                    app.difficulty_level === 'Hard' ? 'text-red-600' : 
                    app.difficulty_level === 'Moderate' ? 'text-orange-600' : 'text-green-600'
                  }`}>{app.difficulty_level}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {app.deadline ? `Deadline: ${new Date(app.deadline).toLocaleDateString()}` : 'No deadline'}
                </span>
                <a 
                  href={app.apply_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  Apply Now <ICONS.ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Card>
        ))}
        {filteredApps.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No opportunities found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

const CompareTool = () => {
  const [selections, setSelections] = useState<any[]>([]);
  
  const allOptions = [
    ...CAREER_DATA.science.map(c => ({ ...c, type: 'Career' })),
    ...BUSINESS_DATA.map(b => ({ ...b, title: b.type, type: 'Business' })),
    ...FARMING_DATA.map(f => ({ ...f, title: f.type, type: 'Farming' }))
  ];

  const addToCompare = (opt: any) => {
    if (selections.length < 3 && !selections.find(s => s.title === opt.title)) {
      setSelections([...selections, opt]);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Compare Options" subtitle="Select up to 3 paths to see a side-by-side comparison." />
      
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {allOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => addToCompare(opt)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm whitespace-nowrap hover:border-orange-500 transition-colors"
          >
            + {opt.title}
          </button>
        ))}
      </div>

      {selections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selections.map((sel, i) => (
            <Card key={i} title={sel.title} icon={ICONS.TrendingUp}>
              <button 
                onClick={() => setSelections(selections.filter((_, idx) => idx !== i))}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <ICONS.XCircle className="w-4 h-4" />
              </button>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase">Type</p>
                  <p className="font-bold text-orange-600">{sel.type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Income Potential</p>
                  <p className="font-bold">{sel.salary || sel.income || 'Varies'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Risk Level</p>
                  <p className="font-bold text-red-500">{sel.risks || sel.risk || 'Moderate'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Investment</p>
                  <p className="font-bold">{sel.cost || sel.investment || 'Minimal'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const CareerCounselor = () => {
  return (
    <div className="space-y-6 text-center py-20">
      <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <ICONS.Heart className="w-10 h-10 text-orange-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900">Ask Tinko AI</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Our AI career counselor is currently undergoing maintenance to provide even better advice. 
      </p>
      <div className="inline-block px-6 py-2 bg-orange-600 text-white rounded-full font-bold text-sm animate-pulse">
        COMING SOON 🚀
      </div>
    </div>
  );
};

const CareerQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [result, setResult] = useState<string | null>(null);

  const questions = [
    {
      id: 'interest',
      q: 'What interests you most?',
      options: [
        { label: 'Building Tech & Solving Logic', value: 'tech' },
        { label: 'Healthcare & Saving Lives', value: 'medical' },
        { label: 'Business, Finance & Startups', value: 'business' },
        { label: 'Research, Science & Discovery', value: 'research' },
        { label: 'Global Exposure & Moving Abroad', value: 'abroad' },
        { label: 'Nature, Farming & Sustainability', value: 'nature' }
      ]
    },
    {
      id: 'risk',
      q: 'How do you feel about risk?',
      options: [
        { label: 'I want stability (Safe Job)', value: 'low' },
        { label: 'I can take moderate risks', value: 'mid' },
        { label: 'High risk, high reward (Entrepreneurship)', value: 'high' }
      ]
    },
    {
      id: 'education',
      q: 'Current education level?',
      options: [
        { label: '10th / 12th Student', value: 'school' },
        { label: 'College Graduate', value: 'grad' },
        { label: 'Professional / Working', value: 'pro' }
      ]
    }
  ];

  const handleSelect = (val: string) => {
    const newAnswers = { ...answers, [questions[step].id]: val };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (ans: any) => {
    if (ans.interest === 'tech') setResult('Software Engineering / Data Science (JEE/BITSAT)');
    else if (ans.interest === 'medical') setResult('Medicine / MBBS / Specialist (NEET)');
    else if (ans.interest === 'research') setResult('Research Scientist (IISER/IISc via IAT)');
    else if (ans.interest === 'abroad') setResult('Study & Settle Abroad (IELTS/GRE/SAT)');
    else if (ans.interest === 'business' && ans.risk === 'high') setResult('E-commerce Startup / Retail Business');
    else if (ans.interest === 'nature') setResult('Organic Farming / Agrotech');
    else setResult('Management / Banking / Govt Services (UPSC/SSC)');
  };

  if (result) {
    return (
      <Card className="text-center py-8">
        <ICONS.CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Your Suggested Path:</h3>
        <p className="text-2xl text-orange-600 font-bold mb-6">{result}</p>
        <button 
          onClick={() => { setStep(0); setResult(null); setAnswers({}); }}
          className="text-gray-500 hover:text-orange-600 text-sm font-medium"
        >
          Retake Quiz
        </button>
      </Card>
    );
  }

  return (
    <Card title={`Step ${step + 1} of ${questions.length}`}>
      <div className="space-y-6">
        <h4 className="text-lg font-bold text-gray-800">{questions[step].q}</h4>
        <div className="grid grid-cols-1 gap-3">
          {questions[step].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt.value)}
              className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
            >
              <span className="font-medium text-gray-700 group-hover:text-orange-700">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

const FinancePlanner = () => {
  const [salary, setSalary] = useState<number>(500000);
  
  const calculateTax = (inc: number) => {
    // Simplified 2024-25 New Tax Regime (Budget 2024)
    if (inc <= 300000) return 0;
    if (inc <= 700000) return (inc - 300000) * 0.05;
    if (inc <= 1000000) return 20000 + (inc - 700000) * 0.10;
    if (inc <= 1200000) return 50000 + (inc - 1000000) * 0.15;
    if (inc <= 1500000) return 80000 + (inc - 1200000) * 0.20;
    return 140000 + (inc - 1500000) * 0.30;
  };

  const tax = calculateTax(salary);
  const takeHome = salary - tax;

  return (
    <div className="space-y-8">
      <SectionHeader title="Finance Planner" subtitle="Simple tax and savings calculator for Indian salaries." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Tax Calculator (New Regime)">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income (₹)</label>
              <input 
                type="number" 
                value={salary} 
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated Annual Tax:</span>
                <span className="font-bold text-red-600">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900">Annual Take Home:</span>
                <span className="text-green-600">₹{takeHome.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-4 italic">*Based on 2024-25 New Tax Regime. Standard deduction of ₹75,000 not included.</p>
            </div>
          </div>
        </Card>
        <Card title="Financial Basics">
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-bold text-blue-800 text-sm flex items-center gap-2">
                <ICONS.ShieldCheck className="w-4 h-4" /> 50-30-20 Rule
              </h4>
              <p className="text-xs text-blue-700 mt-1">50% Needs, 30% Wants, 20% Savings/Debt Repayment.</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-bold text-green-800 text-sm flex items-center gap-2">
                <ICONS.TrendingUp className="w-4 h-4" /> Emergency Fund
              </h4>
              <p className="text-xs text-green-700 mt-1">Save at least 6 months of basic expenses before investing.</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-bold text-orange-800 text-sm flex items-center gap-2">
                <ICONS.IndianRupee className="w-4 h-4" /> PPF & SIP
              </h4>
              <p className="text-xs text-orange-700 mt-1">Start early to benefit from compounding. Even ₹500/month helps.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const CareersExplorer = () => {
  const [stream, setStream] = useState<'science' | 'commerce' | 'arts' | 'creative' | 'abroad'>('science');
  
  // Note: For now we use science data from constants, in real app we'd have all streams
  const data = (CAREER_DATA as any)[stream] || CAREER_DATA.science;

  return (
    <div className="space-y-6">
      <SectionHeader title="Career Explorer" subtitle="Find the right roadmap for your future." />
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {['science', 'commerce', 'arts', 'creative', 'abroad'].map((s) => (
          <button
            key={s}
            onClick={() => setStream(s as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              stream === s ? 'bg-orange-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-500'
            }`}
          >
            {s === 'abroad' ? 'Study Abroad ✈️' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((c: any) => (
          <Card key={c.id} title={c.title} icon={ICONS.GraduationCap}>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Roadmap</p>
                <p className="text-sm text-gray-800 font-medium">{c.roadmap}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Starting Salary</p>
                  <p className="text-sm font-bold text-green-600">{c.salary?.split('|')[0] || 'Varies'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Growth</p>
                  <p className="text-sm font-bold text-orange-600">{c.growth || 'High'}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-50">
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Key Skills</p>
                <div className="flex flex-wrap gap-1">
                  {c.skills?.map((s: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const BusinessPathways = () => {
  return (
    <div className="space-y-6">
      <SectionHeader title="Business Pathways" subtitle="Start your own venture with practical guides." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BUSINESS_DATA.map((b, i) => (
          <Card key={i} title={b.type} icon={ICONS.Building2}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Investment</p>
                  <p className="text-sm font-bold text-gray-800">{b.investment}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Profit Start</p>
                  <p className="text-sm font-bold text-green-600">{b.profit_timeline}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Setup Guide</p>
                <p className="text-sm text-gray-600 leading-relaxed">{b.guide}</p>
              </div>
              <div className="p-2 bg-orange-50 rounded text-[10px] text-orange-700">
                <strong>Legal:</strong> {b.legal}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const FarmingAdvisor = () => {
  return (
    <div className="space-y-6">
      <SectionHeader title="Farming Advisor" subtitle="Modern agriculture for sustainable income." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FARMING_DATA.map((f, i) => (
          <Card key={i} title={f.type} icon={ICONS.Sprout}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Monthly Income</p>
                  <p className="text-sm font-bold text-green-600">{f.income}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">ROI</p>
                  <p className="text-sm font-bold text-orange-600">{f.roi}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Steps to Start</p>
                <p className="text-sm text-gray-600 leading-relaxed">{f.setup}</p>
              </div>
              <div className="p-2 bg-green-50 rounded text-[10px] text-green-700">
                <strong>Govt Support:</strong> {f.subsidies}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ParentsCorner = () => {
  const [selectedPath, setSelectedPath] = useState('engineering');

  const paths = {
    engineering: { roi: 'High', risk: 'Low to Moderate', cost: '₹5L - ₹20L', timeline: '4 Years', advice: 'Focus on skills beyond the degree. Networking and projects matter more than grades.' },
    medical: { roi: 'Very High (Long term)', risk: 'Low', cost: '₹50L - ₹1.5Cr (Private)', timeline: '10+ Years', advice: 'Financial planning is crucial if opting for private colleges. Long residency period requires family support.' },
    business: { roi: 'Unlimited but volatile', risk: 'High', cost: '₹50k - ₹50L+', timeline: '2-5 Years to profit', advice: 'Encourage small experiments before big investments. Mentorship is more valuable than capital.' },
    abroad: { roi: 'High (Global standard)', risk: 'Moderate', cost: '₹20L - ₹60L', timeline: '2-3 Years (MS/MBA)', advice: 'Check visa success rates and local job markets. Post-study work permits are key to ROI.' }
  };

  const current = (paths as any)[selectedPath];

  return (
    <div className="space-y-6">
      <SectionHeader title="Parent's Corner" subtitle="Practical insights for parents to support their child's future." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          {Object.keys(paths).map(p => (
            <button
              key={p}
              onClick={() => setSelectedPath(p)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                selectedPath === p ? 'bg-orange-50 border-orange-200 text-orange-700 font-bold shadow-sm' : 'bg-white border-gray-100 text-gray-600 hover:border-orange-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <div className="md:col-span-2 space-y-6">
          <Card title={`${selectedPath.toUpperCase()} - ROI & Risk Analysis`} icon={ICONS.ShieldCheck}>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-[10px] text-green-700 uppercase font-bold mb-1">Return on Investment</p>
                <p className="text-lg font-bold text-green-900">{current.roi}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl">
                <p className="text-[10px] text-red-700 uppercase font-bold mb-1">Risk Level</p>
                <p className="text-lg font-bold text-red-900">{current.risk}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-[10px] text-blue-700 uppercase font-bold mb-1">Est. Total Cost</p>
                <p className="text-lg font-bold text-blue-900">{current.cost}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl">
                <p className="text-[10px] text-orange-700 uppercase font-bold mb-1">Time to Earn</p>
                <p className="text-lg font-bold text-orange-900">{current.timeline}</p>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Expert Advice for Parents:</h4>
              <p className="text-sm text-gray-600 leading-relaxed italic">"{current.advice}"</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ResourceLibrary = () => {
  const [category, setCategory] = useState('all');
  
  const resources = [
    { title: 'CS50: Introduction to Computer Science', platform: 'Harvard (Free)', link: 'https://pll.harvard.edu/course/cs50-introduction-computer-science', type: 'Course', cat: 'engineering', partner: false },
    { title: 'Khan Academy: MCAT Prep', platform: 'Khan Academy (Free)', link: 'https://www.khanacademy.org/test-prep/mcat', type: 'Medical', cat: 'medical', partner: false },
    { title: 'Y Combinator: How to Start a Startup', platform: 'YouTube', link: 'https://www.youtube.com/playlist?list=PL5q_lef6zV74pPAt1mXm5z8W0y5UvX1rG', type: 'Business', cat: 'business', partner: false },
    { title: 'MIT OpenCourseWare', platform: 'MIT', link: 'https://ocw.mit.edu/', type: 'All Streams', cat: 'all', partner: false },
    { title: 'Full Stack Web Dev Bootcamp', platform: 'Udemy (Paid)', link: 'https://www.udemy.com/', type: 'Course', cat: 'engineering', partner: true, badge: 'Best Seller' },
    { title: 'Premium IELTS Masterclass', platform: 'LeapScholar', link: 'https://leapscholar.com/', type: 'Abroad', cat: 'abroad', partner: true, badge: 'Partner' },
    { title: 'JEE/NEET Comprehensive Prep', platform: 'Unacademy', link: 'https://unacademy.com/', type: 'Exam Prep', cat: 'science', partner: true, badge: 'Popular' },
    { title: 'FreeCodeCamp', platform: 'Web', link: 'https://www.freecodecamp.org/', type: 'Tech', cat: 'engineering', partner: false },
  ];

  const filtered = category === 'all' ? resources : resources.filter(r => r.cat === category || r.cat === 'all');

  return (
    <div className="space-y-6">
      <SectionHeader title="Resource Library" subtitle="High-quality learning materials from global top universities and partners." />
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {['all', 'engineering', 'medical', 'business', 'abroad'].map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === c ? 'bg-orange-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-500'
            }`}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((r, i) => (
          <Card key={i} title={r.title} icon={ICONS.ExternalLink} className={r.partner ? 'border-orange-200 bg-orange-50/30' : ''}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${r.partner ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {r.type}
                  </span>
                  {r.partner && (
                    <span className="text-[10px] font-bold text-orange-700 flex items-center gap-1">
                      <ICONS.ShieldCheck className="w-3 h-3" /> {r.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{r.platform}</span>
              </div>
              <a 
                href={r.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`block w-full text-center py-2 rounded-lg text-xs font-bold transition-colors ${
                  r.partner ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {r.partner ? 'View Offer' : 'Access Resource'}
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ScholarshipFinder = () => {
  const [filter, setFilter] = useState('all');

  const scholarships = [
    { title: 'KVPY (Kishore Vaigyanik Protsahan Yojana)', type: 'Research/Science', amount: '₹5k - ₹7k/month', eligibility: '11th, 12th, 1st year UG', link: 'http://kvpy.iisc.ernet.in/', cat: 'india' },
    { title: 'INSPIRE Scholarship', type: 'Science/Research', amount: '₹80k/year', eligibility: 'Top 1% in 12th Board', link: 'https://online-inspire.gov.in/', cat: 'india' },
    { title: 'Tata Scholarship (Cornell University)', type: 'Undergraduate', amount: 'Full Tuition', eligibility: 'Indian Citizen admitted to Cornell', link: 'https://admissions.cornell.edu/apply/international-students/tata-scholarship', cat: 'abroad' },
    { title: 'Fullbright-Nehru Fellowships', type: 'Masters/PhD', amount: 'Full funding + Stipend', eligibility: 'Graduates with work exp', link: 'https://www.usief.org.in/Fellowships/Fullbright-Nehru-Fellowships.aspx', cat: 'abroad' },
    { title: 'Dhirubhai Ambani Scholarship', type: 'Undergraduate', amount: 'Significant support', eligibility: 'Merit-cum-Means', link: 'https://www.reliancefoundation.org/dhirubhai-ambani-scholarship', cat: 'india' },
    { title: 'DAAD Scholarship (Germany)', type: 'Masters/PhD', amount: 'Full Tuition + €934/month', eligibility: 'Graduates with 2yr work exp', link: 'https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/', cat: 'abroad' }
  ];

  const filtered = filter === 'all' ? scholarships : scholarships.filter(s => s.cat === filter);

  return (
    <div className="space-y-6">
      <SectionHeader title="Scholarship Finder" subtitle="Find financial support for your education in India and abroad." />
      <div className="flex gap-2">
        {['all', 'india', 'abroad'].map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === c ? 'bg-orange-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-500'
            }`}
          >
            {c === 'all' ? 'All' : c === 'india' ? 'India 🇮🇳' : 'Abroad ✈️'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((s, i) => (
          <Card key={i} title={s.title} icon={ICONS.IndianRupee}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase">{s.type}</span>
                <span className="text-sm font-bold text-green-600">{s.amount}</span>
              </div>
              <p className="text-xs text-gray-600"><strong>Eligibility:</strong> {s.eligibility}</p>
              <a 
                href={s.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center py-2 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 transition-colors"
              >
                View Details
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SkillTracker = () => {
  const [selectedPath, setSelectedPath] = useState('engineering');
  const [completed, setCompleted] = useState<string[]>(() => {
    const saved = localStorage.getItem('tinko_skills');
    return saved ? JSON.parse(saved) : [];
  });

  const skillsData = {
    engineering: ['Logic & Algorithms', 'Data Structures', 'Web Development', 'System Design', 'Soft Skills'],
    medical: ['Biology Fundamentals', 'Anatomy', 'Clinical Practice', 'Medical Ethics', 'Empathy & Communication'],
    business: ['Market Research', 'Financial Literacy', 'Sales & Marketing', 'Operations', 'Leadership'],
    research: ['Scientific Writing', 'Statistical Analysis', 'Laboratory Skills', 'Grant Writing', 'Critical Thinking']
  };

  const currentSkills = (skillsData as any)[selectedPath];

  const toggleSkill = (skill: string) => {
    const newCompleted = completed.includes(skill) 
      ? completed.filter(s => s !== skill)
      : [...completed, skill];
    setCompleted(newCompleted);
    localStorage.setItem('tinko_skills', JSON.stringify(newCompleted));
  };

  const progress = Math.round((currentSkills.filter((s: string) => completed.includes(s)).length / currentSkills.length) * 100);

  return (
    <div className="space-y-6">
      <SectionHeader title="Skill Tracker" subtitle="Track your progress as you master the skills needed for your path." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          {Object.keys(skillsData).map(p => (
            <button
              key={p}
              onClick={() => setSelectedPath(p)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                selectedPath === p ? 'bg-orange-50 border-orange-200 text-orange-700 font-bold' : 'bg-white border-gray-100 text-gray-600 hover:border-orange-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <div className="md:col-span-2">
          <Card title={`${selectedPath.toUpperCase()} Progress`}>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 font-medium">Completion</span>
                <span className="text-orange-600 font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-orange-600 h-full"
                />
              </div>
            </div>
            <div className="space-y-3">
              {currentSkills.map((s: string, i: number) => (
                <div 
                  key={i} 
                  onClick={() => toggleSkill(s)}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    completed.includes(s) ? 'bg-green-500 border-green-500' : 'border-gray-200 group-hover:border-orange-500'
                  }`}>
                    {completed.includes(s) && <ICONS.CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${completed.includes(s) ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>{s}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [access, setAccess] = useState<AccessState>({ isPaid: false, paymentId: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPaymentId = localStorage.getItem('bcg_payment_id');
    if (savedPaymentId) {
      checkAccess(savedPaymentId);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAccess = async (id: string) => {
    try {
      const res = await fetch(`/api/payment/check-access?paymentId=${id}`);
      const data = await res.json();
      if (data.access) {
        setAccess({ isPaid: true, paymentId: id });
        localStorage.setItem('bcg_payment_id', id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (id: string) => {
    setAccess({ isPaid: true, paymentId: id });
    localStorage.setItem('bcg_payment_id', id);
    setActiveTab('dashboard');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const renderContent = () => {
    if (!access.isPaid && activeTab !== 'dashboard' && activeTab !== 'decision') {
      return <PaymentGate onPaymentSuccess={handlePaymentSuccess} />;
    }

    switch (activeTab) {
      case 'dashboard': return (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">Plan Your Future, Practically.</h1>
              <p className="text-orange-100 text-lg mb-6">
                Choose between Job, Business, or Farming based on real data, risks, and financial outcomes.
              </p>
              {!access.isPaid && (
                <button 
                  onClick={() => setActiveTab('careers')}
                  className="bg-white text-orange-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-50 transition-colors"
                >
                  Unlock Full Access ₹99 <ICONS.ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
            <ICONS.Briefcase className="absolute -right-12 -bottom-12 w-64 h-64 text-white/10 rotate-12" />
          </div>
          {/* Rest of dashboard content... */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Career Explorer" icon={ICONS.GraduationCap}>
              <p className="text-sm text-gray-600 mb-4">Detailed roadmaps for Science, Commerce, Arts, and Creative fields.</p>
              <button onClick={() => setActiveTab('careers')} className="text-orange-600 font-semibold text-sm flex items-center gap-1">Explore <ICONS.ArrowRight className="w-3 h-3" /></button>
            </Card>
            <Card title="Business Pathways" icon={ICONS.Building2}>
              <p className="text-sm text-gray-600 mb-4">From small shops to tech startups. Investment, risks, and legal guides.</p>
              <button onClick={() => setActiveTab('business')} className="text-orange-600 font-semibold text-sm flex items-center gap-1">View Ideas <ICONS.ArrowRight className="w-3 h-3" /></button>
            </Card>
            <Card title="Farming Advisor" icon={ICONS.Sprout}>
              <p className="text-sm text-gray-600 mb-4">Dairy, Poultry, and Organic farming. ROI timelines and govt subsidies.</p>
              <button onClick={() => setActiveTab('farming')} className="text-orange-600 font-semibold text-sm flex items-center gap-1">Learn More <ICONS.ArrowRight className="w-3 h-3" /></button>
            </Card>
            <Card title="Ask Tinko (AI)" icon={ICONS.Heart} className="bg-orange-50 border-orange-100">
              <p className="text-sm text-gray-600 mb-4">Our AI counselor is currently undergoing maintenance.</p>
              <div className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold inline-block">COMING SOON</div>
            </Card>
            <Card title="Free Resources" icon={ICONS.Search}>
              <p className="text-sm text-gray-600 mb-4">Access top-tier courses from Harvard, MIT, and more for free.</p>
              <button onClick={() => setActiveTab('resources')} className="text-orange-600 font-semibold text-sm flex items-center gap-1">Browse Library <ICONS.ArrowRight className="w-3 h-3" /></button>
            </Card>
            <Card title="Parent's Corner" icon={ICONS.Users}>
              <p className="text-sm text-gray-600 mb-4">Insights for parents on ROI, risk, and financial planning.</p>
              <button onClick={() => setActiveTab('parents')} className="text-orange-600 font-semibold text-sm flex items-center gap-1">View Guide <ICONS.ArrowRight className="w-3 h-3" /></button>
            </Card>
            <Card title="Scholarships" icon={ICONS.IndianRupee}>
              <p className="text-sm text-gray-600 mb-4">Find financial aid for your studies in India and Abroad.</p>
              <button onClick={() => setActiveTab('scholarships')} className="text-orange-600 font-semibold text-sm flex items-center gap-1">Find Aid <ICONS.ArrowRight className="w-3 h-3" /></button>
            </Card>
            <Card title="Skill Tracker" icon={ICONS.CheckCircle2}>
              <p className="text-sm text-gray-600 mb-4">Track your mastery of key skills for your chosen career.</p>
              <button onClick={() => setActiveTab('tracker')} className="text-orange-600 font-semibold text-sm flex items-center gap-1">Start Tracking <ICONS.ArrowRight className="w-3 h-3" /></button>
            </Card>
          </div>
        </div>
      );
      case 'careers': return <CareersExplorer />;
      case 'business': return <BusinessPathways />;
      case 'farming': return <FarmingAdvisor />;
      case 'apply': return <ApplyNow isPaid={access.isPaid} />;
      case 'compare': return <CompareTool />;
      case 'finance': return <FinancePlanner />;
      case 'decision': return <div className="max-w-xl mx-auto py-12"><CareerQuiz /></div>;
      case 'counselor': return <CareerCounselor />;
      case 'resources': return <ResourceLibrary />;
      case 'parents': return <ParentsCorner />;
      case 'scholarships': return <ScholarshipFinder />;
      case 'tracker': return <SkillTracker />;
      default: return <div>Dashboard</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isPaid={access.isPaid} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="border-t border-gray-200 bg-white mt-12 py-8 px-4 text-center">
        <p className="text-sm text-gray-500">© 2026 Tinko. Practical Guidance for Indian Students.</p>
      </footer>
    </div>
  );
}
