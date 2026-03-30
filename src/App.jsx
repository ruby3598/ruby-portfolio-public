import { useState, useEffect, useRef, useCallback } from "react";

const RUBY_PHOTO = "/ruby-photo.png";

const SCREENSHOTS = {
  sendlydm: "/screenshots/sendlydm.jpg",
  audit: "/screenshots/audit.jpg",
  dashboard: "/screenshots/dashboard.jpg",
};

/* DATA */

const JOURNEY = [
  { year: "2019", title: "Started in Sales & Marketing", place: "Toyota Dealership, India", desc: "Learned the fundamentals: CRM, customer engagement, and the power of data in driving sales decisions at an authorised Toyota dealership." },
  { year: "2021", title: "Writes India Agency", place: "Digital Marketing Agency, India", desc: "Shifted to performance marketing. Managed multi-client campaigns with €100K+ monthly budgets across brand awareness and acquisition channels." },
  { year: "2022", title: "Moved to France", place: "Neoma Business School", desc: "M.Sc. in Digital Expertise for Marketing. Immersed in European business culture and advanced analytics." },
  { year: "2023", title: "Joined French Side Travel", place: "Marseille, France", desc: "Started as intern, earned a CDI within 6 months. Took ownership of the entire paid acquisition strategy for a luxury travel brand." },
  { year: "2025", title: "Started Building", place: "Dashboards, Scripts, SaaS, Content", desc: "Built internal reporting dashboards, Python data scripts, shipped an AI-powered SaaS MVP (SendlyDM), and launched braindumped.ai. From analyst to builder." },
  { year: "Next", title: "Ireland", place: "No visa sponsorship required", desc: "Seeking roles where marketing, data, and technology converge. Preference for Cork or Dublin. Ready for a new chapter, no work permit sponsorship needed." },
];

const PROJECTS = [
  { id: "sendlydm", screenshot: "sendlydm", title: "SendlyDM", subtitle: "AI-Powered Instagram DM Automation SaaS", description: "Conceptualised and built a full-stack SaaS MVP for automated Instagram DM workflows and AI-powered WhatsApp lead qualification.", tags: ["React", "Vite", "Tailwind", "Claude API", "Vercel", "GitHub"], link: "https://sendlydm.vercel.app", color: "#C8A855", year: "2025",
    caseStudy: { problem: "Instagram creators and small businesses spend hours manually responding to DMs and qualifying leads. There was no affordable tool combining DM automation with AI-powered lead scoring.", approach: "Designed the product vision with two modules: automated DM flows triggered by keywords/comments, and an AI lead qualifier using Claude API that scores and routes prospects via WhatsApp.", built: "Full frontend deployed on Vercel with GitHub CI/CD. Integrated Claude API for intelligent response generation. Built the entire MVP in 15 days with zero prior coding experience.", result: "Live deployed product at sendlydm.vercel.app. Proved that a marketer with domain expertise can ship real software by combining AI tools with relentless execution." }
  },
  { id: "ads-dashboard", screenshot: "dashboard", title: "Ads Performance Dashboard", subtitle: "French Side Travel, Internal Reporting Tool", description: "Built and deployed a full-stack ads reporting dashboard enabling real-time visibility into €1.89M ad spend across all channels for management.", tags: ["HTML/CSS", "Supabase", "Vercel", "Python", "Google Ads API"], link: null, color: "#8B7355", year: "2025",
    caseStudy: { problem: "With €1.89M in ad spend across four platforms, leadership had no unified view of performance. Data lived in separate platforms (Google, Meta, Bing, Pinterest), making it impossible to compare channels or spot trends without manual exports.", approach: "Designed a single-page dashboard with filterable views by campaign, month, and source. Tracks leads, spend, CPA, confirmed bookings, B2C turnover, ROI, and conversion rates. The KPIs leadership actually cared about.", built: "HTML/CSS frontend with Supabase backend, deployed on Vercel. Python scripts handle data ingestion and transformation. Features monthly data storage, CSV export, ad group reports, and insights. Clean, luxury styled UI matching the FST brand.", result: "Management can now track cross-channel performance in real-time, including 13.8x ROI months and €438K+ B2C turnover. Eliminated weekly manual reporting cycles and enabled faster budget reallocation decisions." }
  },
  { id: "keyword-audit", screenshot: "audit", title: "Google Ads Keyword Audit", subtitle: "French Side Travel, Strategic Cost Analysis", description: "Comprehensive audit across 15+ ad groups identifying €8,500+/month in wasted spend and recommending campaign restructuring.", tags: ["Google Ads", "Data Analysis", "Excel", "Strategy"], link: null, color: "#6B8E7B", year: "2024",
    caseStudy: { problem: "Campaigns had grown organically over time with 1,718 keywords, resulting in bloated ad groups with overlapping terms, poor Quality Scores, and significant budget leaking to non-converting search terms. 723 keywords (42%) had zero impressions in 6 months.", approach: "Audited every keyword across 15+ ad groups. Mapped spend vs. actual confirmed bookings (not just leads), identified €41,383 spent on 8,409 search terms with zero conversions, and analysed Quality Score distribution across ad group sizes.", built: "Detailed spreadsheet analysis with audit findings, inactive keywords tab, search terms analysis, and ad group health metrics. CEO-friendly report showing Google Ads ROAS of 6.6x on €87,624 spend generating €577,497 in B2C turnover from 31 confirmed bookings.", result: "Identified 723 inactive keywords to pause (risk-free cleanup), €41K+ in zero-conversion search term spend, and proved that smaller ad groups (10-20 keywords) averaged Quality Score 6-7 vs. 4-5 for bloated groups of 50-78 keywords. Recommended restructuring into destination-specific ad groups." }
  },
  { id: "braindumped", title: "braindumped.ai", subtitle: "Educational Content Brand", description: "Building an explainer brand covering economics, geopolitics, career skills, and AI for Indian audiences with a humor-forward, data-driven approach.", tags: ["Content Strategy", "Instagram", "YouTube", "TikTok"], link: null, color: "#9B6B8E", year: "2026", caseStudy: null },
  { id: "python-matching", title: "Python Data Matching Engine", subtitle: "French Side Travel, Lead Attribution", description: "Fuzzy matching script connecting ad spend to actual bookings by enriching the confirmed leads database for true ROI measurement.", tags: ["Python", "pandas", "fuzzywuzzy", "Data Engineering"], link: null, color: "#7B8EA6", year: "2024", caseStudy: null },
  { id: "fst-redesign", title: "FST Website Redesign", subtitle: "French Side Travel, Luxury Landing Pages", description: "Produced multiple luxury HTML pages including homepage, About, villa collection, and custom trip form.", tags: ["HTML", "CSS", "UI/UX", "Luxury Design"], link: null, color: "#A68B6B", year: "2025", caseStudy: null }
];

const SKILLS = {
  "Paid Media": ["Google Ads", "Meta Ads", "Bing Ads", "Pinterest Ads", "PMax", "Display", "Google Ads Editor", "Keyword Planner"],
  "Analytics & Tracking": ["Google Analytics 4", "Google Tag Manager", "Google Search Console", "UTM Architecture", "Conversion Tracking", "A/B Testing", "Looker Studio", "Tableau"],
  "Data & Reporting": ["Excel", "Python", "HTML/CSS Dashboards", "pandas", "Data Storytelling", "Stakeholder Reporting", "Performance Reporting"],
  "Strategy & Market Expertise": ["Budget Allocation (€1.89M)", "Luxury & High-Value Marketing", "Long-Funnel Attribution", "Audience Segmentation", "Multilingual Campaigns", "CRM & Lead Management"],
};

const SOFT_SKILLS = [
  { skill: "Data Storytelling", desc: "Translating complex data into clear narratives for leadership" },
  { skill: "Stakeholder Communication", desc: "Presenting insights to CEOs, managers, and cross-functional teams" },
  { skill: "Strategic Thinking", desc: "Seeing the bigger picture behind campaign numbers" },
  { skill: "Problem Solving", desc: "Finding the €8,500/month waste nobody else noticed" },
  { skill: "Cross-functional Collaboration", desc: "Working across marketing, sales, dev, and leadership" },
  { skill: "Adaptability", desc: "From Toyota showrooms to French luxury travel in 4 years" },
  { skill: "Self-starter", desc: "Built a SaaS MVP and dashboards without being asked" },
  { skill: "Fast Learner", desc: "Picked up Python, SQL, and deployment tools in months" },
  { skill: "Attention to Detail", desc: "723 inactive keywords found in a single audit" },
  { skill: "Client Relations", desc: "Managed international accounts across US, UK, and Australia" },
  { skill: "Project Management", desc: "15-day MVP roadmap, executed solo from concept to launch" },
  { skill: "Presentation Skills", desc: "CEO-level reports that make data accessible to anyone" },
];

const INDUSTRIES = ["Luxury Travel", "Automotive", "E-commerce", "Education", "Healthcare", "Real Estate", "Technology", "Finance", "SaaS"];
const MARKETS = ["US", "UK", "Australia", "Europe", "France"];

const LEARNING = [
  { skill: "SQL", progress: 60, note: "SELECT, JOIN, WHERE, GROUP BY, subqueries" },
  { skill: "Advanced Python", progress: 55, note: "APIs, automation scripts, data pipelines" },
  { skill: "Data Storytelling", progress: 75, note: "Presenting insights to non-tech audiences" },
  { skill: "AI Product Building", progress: 70, note: "Claude API, full-stack MVPs" },
];

const CERTIFICATIONS = [
  { name: "Google Analytics Certified", year: "2024" },
  { name: "HubSpot Social Media Certification", year: "2024" },
  { name: "Data Science, Edureka", year: "" },
];

const BLOG_POSTS = [
  { title: "How I Found €8,500/Month in Wasted Google Ads Spend", date: "March 2025", readTime: "6 min read", tag: "Google Ads", visual: "audit",
    content: [
      { type: "intro", text: "When I joined a luxury travel company as the marketing analyst managing all paid campaigns, the Google Ads account looked healthy on the surface. Decent CTR, steady lead flow, manageable CPC. But when I dug into the ad group level, I found something that changed how I think about campaign management forever." },
      { type: "heading", text: "The Problem Nobody Was Looking At" },
      { type: "paragraph", text: "The account had grown organically over two years. New keywords got added, campaigns got duplicated for different seasons, and ad groups kept getting broader. Nobody had done a full keyword-level audit because the top-line numbers looked fine." },
      { type: "pullquote", text: "Top-line numbers hide everything. Keyword-level truth is where the money is." },
      { type: "paragraph", text: "When I pulled every keyword across 15+ ad groups and mapped spend against actual confirmed bookings (not just leads, actual revenue), the picture was very different." },
      { type: "heading", text: "What I Found" },
      { type: "paragraph", text: "The 'Luxury Vacation' ad group was the biggest offender. It had been running across two campaigns, burning through over €8,500 combined with 115 leads and zero confirmed bookings. Not low bookings. Zero." },
      { type: "visual", key: "audit" },
      { type: "paragraph", text: "Meanwhile, several destination-specific keywords in the same account were converting at 40%+ ROI on a fraction of the budget. The brand campaign was delivering 60x ROI on minimal spend, while a brand awareness campaign was getting thousands per month with 0.2x return." },
      { type: "heading", text: "The Lesson" },
      { type: "pullquote", text: "The biggest waste in ad accounts isn't bad campaigns. It's good-looking campaigns with bad keywords hiding inside them." },
      { type: "paragraph", text: "If you manage ad spend and haven't done a keyword-level audit mapped to actual revenue (not just leads) in the last 6 months, you're almost certainly bleeding budget somewhere. The question is how much." },
    ]
  },
  { title: "Never Copy a Competitor's Marketing Strategy. Here's Why.", date: "March 2025", readTime: "5 min read", tag: "Strategy", visual: "competitor",
    content: [
      { type: "intro", text: "I see this mistake all the time. A company looks at a competitor in the same niche, sees their ads running, copies the keywords, mirrors the campaign structure, and expects the same results. It almost never works. And the reason has nothing to do with marketing." },
      { type: "heading", text: "Same Niche Does Not Mean Same Business" },
      { type: "paragraph", text: "Two companies can sell the exact same product to the exact same audience and still need completely different marketing strategies. Why? Because marketing doesn't exist in isolation. It sits on top of your sales team, your website, your budget, and your capacity to handle leads." },
      { type: "visual", key: "competitor" },
      { type: "paragraph", text: "If your competitor has a 20-person sales team and you have 3, copying their lead generation strategy will drown you. They can afford to bring in 500 unqualified leads a month because they have the people to sort through them. You can't." },
      { type: "heading", text: "Your Website Is Not Their Website" },
      { type: "pullquote", text: "Same keywords, same audience, wildly different results. The ads weren't the problem. The destination was." },
      { type: "paragraph", text: "Conversion rate depends heavily on the website experience. Your competitor might have a beautifully optimised landing page. If you send the same traffic to a mediocre page, your cost per lead will be 3x higher even with identical ad copy." },
      { type: "heading", text: "What To Do Instead" },
      { type: "paragraph", text: "Look at competitors for inspiration, not imitation. Build your strategy from your own data, your own conversion rates, your own customer journey." },
      { type: "pullquote", text: "The best marketing strategies aren't copied. They're built from the inside out." },
    ]
  },
  { title: "AI Won't Replace Marketers. But Marketers Who Use AI Will Replace Those Who Don't.", date: "March 2025", readTime: "5 min read", tag: "Marketing + AI", visual: "ai",
    content: [
      { type: "intro", text: "Every few months, someone publishes an article saying AI is about to replace marketers. It makes for a great headline. But after spending two years using AI tools daily to manage real campaigns, build dashboards, and ship actual products, I can tell you the reality is more nuanced than that. AI isn't coming for your job. But the marketer sitting next to you who figured out how to use it properly? They might be." },
      { type: "heading", text: "The Real Threat Isn't AI. It's Speed." },
      { type: "paragraph", text: "The marketer who used to spend 4 hours building a monthly report now does it in 20 minutes. The one who used to take a week to audit 1,700 keywords can now do it in a day. The one who had an idea for an internal tool but needed to wait 3 months for engineering? They built it themselves in 15 days." },
      { type: "paragraph", text: "That's not AI replacing people. That's AI making some people dramatically faster than others. And in a competitive job market, speed matters." },
      { type: "pullquote", text: "The gap isn't between humans and AI. It's between marketers who use AI and those who don't." },
      { type: "heading", text: "What AI Actually Does Well in Marketing" },
      { type: "paragraph", text: "It's not what most people think. The value isn't in asking ChatGPT to write your ad copy. Honestly, AI-generated ad copy is usually mediocre. It lacks the sharp, specific hooks that come from actually understanding your audience." },
      { type: "paragraph", text: "Where AI genuinely helps is the boring stuff. The stuff that eats 60% of your week and adds zero strategic value. Things like cleaning and restructuring messy campaign data, drafting the first version of a report, writing Python scripts to match data between systems, building dashboards, and generating UTM parameters in seconds instead of manually." },
      { type: "visual", key: "aiTime" },
      { type: "pullquote", text: "The value of AI isn't in replacing your thinking. It's in eliminating the hours of manual work that prevent you from thinking." },
      { type: "heading", text: "What AI Can't Do" },
      { type: "paragraph", text: "It can't sit in a meeting with your CEO and explain why the luxury vacation ad group needs to be paused even though it's generating leads. It can't feel that something is off about a campaign's performance before the data confirms it. It can't understand that your client's sales team can only handle 50 leads a month, so generating 500 is actually a problem, not a win." },
      { type: "paragraph", text: "Strategy, judgment, and stakeholder communication are human skills. AI can give you the data faster, but deciding what to do with it still requires experience, context, and the ability to read a room." },
      { type: "visual", key: "aiVsHuman" },
      { type: "heading", text: "The Real Skill to Develop" },
      { type: "paragraph", text: "The marketers who will thrive aren't the ones who know every AI tool. Tools change every 6 months. The real skill is knowing how to think about problems clearly, identify what can be automated, and use whatever tool is available to get to the answer faster." },
      { type: "paragraph", text: "I built a SaaS product, internal dashboards, and data matching scripts not because I'm a developer. I'm not. I built them because I could see the problem clearly and I used AI to bridge the gap between \"I know what needs to exist\" and \"I can make it exist.\"" },
      { type: "pullquote", text: "The marketers who will thrive aren't the ones who know every AI tool. They're the ones who know which problems to solve." },
      { type: "paragraph", text: "That mindset is what separates the marketers who will grow from the ones who will get left behind. Not the specific tools. The willingness to figure it out." },
    ]
  }
];

/* COLORS */
const gold = "#C8A855";
const cream = "#FCF9F4";
const espresso = "#2C2417";
const warmGray = "#6B5E4B";
const lightGray = "#9B8E7B";
const paperWhite = "#FFFFFF";

/* HOOKS */
function useInView(t = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t }); o.observe(el); return () => o.disconnect(); }, [t]);
  return [ref, v];
}

function useTilt(intensity = 8) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("perspective(600px) rotateX(0) rotateY(0) scale(1)");
  const [shadow, setShadow] = useState("0 2px 12px rgba(44,36,23,0.04)");
  const handleMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    setTransform(`perspective(600px) rotateX(${(0.5-y)*intensity}deg) rotateY(${(x-0.5)*intensity}deg) scale(1.02)`);
    setShadow(`${(x-0.5)*-20}px ${(y-0.5)*-20}px 40px rgba(44,36,23,0.1), 0 8px 24px rgba(44,36,23,0.06)`);
  }, [intensity]);
  const handleLeave = useCallback(() => { setTransform("perspective(600px) rotateX(0) rotateY(0) scale(1)"); setShadow("0 2px 12px rgba(44,36,23,0.04)"); }, []);
  return { ref, transform, shadow, handleMove, handleLeave };
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, v] = useInView();
  return <div ref={ref} style={{ ...style, opacity: v?1:0, transform: v?"translateY(0)":"translateY(28px)", transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>;
}

function TiltCard({ children, intensity = 8, style: s = {} }) {
  const { ref, transform, shadow, handleMove, handleLeave } = useTilt(intensity);
  return <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ ...s, transform, boxShadow: shadow, transition: "transform 0.15s ease, box-shadow 0.15s ease", cursor: "default" }}>{children}</div>;
}

/* SVG ICONS */
function IconAnalyse() {
  return <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="28" cy="28" r="18" stroke={gold} strokeWidth="1.5" opacity="0.8"/><line x1="41" y1="41" x2="56" y2="56" stroke={gold} strokeWidth="2" strokeLinecap="round" opacity="0.8"/><rect x="19" y="30" width="4" height="10" rx="1" fill={gold} opacity="0.3"/><rect x="26" y="24" width="4" height="16" rx="1" fill={gold} opacity="0.5"/><rect x="33" y="20" width="4" height="20" rx="1" fill={gold} opacity="0.3"/><path d="M19 33 L26 27 L33 22" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/></svg>;
}
function IconBuild() {
  return <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="12" y="14" width="40" height="28" rx="3" stroke={gold} strokeWidth="1.5" opacity="0.8"/><rect x="16" y="18" width="32" height="20" rx="1" fill={gold} opacity="0.06"/><line x1="20" y1="24" x2="32" y2="24" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/><line x1="20" y1="29" x2="38" y2="29" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/><line x1="24" y1="34" x2="34" y2="34" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/><path d="M8 42 L12 42 L52 42 L56 42 L56 46 C56 47 55 48 54 48 L10 48 C9 48 8 47 8 46 Z" stroke={gold} strokeWidth="1.5" opacity="0.8"/><circle cx="44" cy="20" r="1.5" fill={gold} opacity="0.6"/><line x1="44" y1="16" x2="44" y2="18" stroke={gold} strokeWidth="1" strokeLinecap="round" opacity="0.4"/><line x1="44" y1="22" x2="44" y2="24" stroke={gold} strokeWidth="1" strokeLinecap="round" opacity="0.4"/><line x1="40" y1="20" x2="42" y2="20" stroke={gold} strokeWidth="1" strokeLinecap="round" opacity="0.4"/><line x1="46" y1="20" x2="48" y2="20" stroke={gold} strokeWidth="1" strokeLinecap="round" opacity="0.4"/></svg>;
}
function IconOptimise() {
  return <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><path d="M12 40 A22 22 0 0 1 52 40" stroke={gold} strokeWidth="1.5" opacity="0.8" fill="none"/><line x1="32" y1="40" x2="44" y2="26" stroke={gold} strokeWidth="2" strokeLinecap="round" opacity="0.7"/><circle cx="32" cy="40" r="3" fill={gold} opacity="0.5"/><path d="M50 16 L54 10 L58 16" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/><line x1="54" y1="10" x2="54" y2="22" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/></svg>;
}

/* BLOG VISUALS */
function BlogVisualAudit() {
  return (
    <div style={{ margin: "32px 0", padding: "32px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 600, textAlign: "center" }}>Budget Reallocation Impact</p>
      <svg viewBox="0 0 500 200" style={{ width: "100%", maxWidth: 460, display: "block", margin: "0 auto" }}>
        <text x="125" y="16" textAnchor="middle" fill={warmGray} fontSize="10" fontFamily="DM Sans, sans-serif" letterSpacing="2">BEFORE</text>
        <rect x="30" y="32" width="190" height="24" rx="2" fill="#E8E0D4"/>
        <rect x="30" y="32" width="130" height="24" rx="2" fill="rgba(180,80,60,0.15)"/>
        <rect x="30" y="32" width="130" height="24" rx="2" fill="none" stroke="rgba(180,80,60,0.3)" strokeWidth="1"/>
        <text x="95" y="48" textAnchor="middle" fill="rgb(160,70,50)" fontSize="9" fontFamily="DM Sans, sans-serif" fontWeight="600">€8,500 WASTED</text>
        <rect x="30" y="64" width="190" height="24" rx="2" fill="#E8E0D4"/>
        <rect x="30" y="64" width="60" height="24" rx="2" fill="rgba(200,168,85,0.15)"/>
        <text x="60" y="80" textAnchor="middle" fill={gold} fontSize="8" fontFamily="DM Sans, sans-serif" fontWeight="600">Winners</text>
        <text x="375" y="16" textAnchor="middle" fill={espresso} fontSize="10" fontFamily="DM Sans, sans-serif" letterSpacing="2" fontWeight="600">AFTER</text>
        <line x1="250" y1="55" x2="280" y2="55" stroke={gold} strokeWidth="1.5"/>
        <polygon points="280,50 290,55 280,60" fill={gold}/>
        <rect x="300" y="64" width="190" height="24" rx="2" fill="#E8E0D4"/>
        <rect x="300" y="64" width="170" height="24" rx="2" fill="rgba(200,168,85,0.2)"/>
        <rect x="300" y="64" width="170" height="24" rx="2" fill="none" stroke={gold} strokeWidth="1"/>
        <text x="385" y="80" textAnchor="middle" fill={gold} fontSize="9" fontFamily="DM Sans, sans-serif" fontWeight="600">€8,500 REALLOCATED</text>
        <line x1="30" y1="110" x2="490" y2="110" stroke="rgba(200,168,85,0.15)" strokeWidth="1"/>
        <text x="90" y="138" textAnchor="middle" fill={espresso} fontSize="11" fontFamily="Playfair Display, serif" fontWeight="700">€8,500/mo</text>
        <text x="90" y="152" textAnchor="middle" fill={lightGray} fontSize="8" fontFamily="DM Sans, sans-serif">Waste identified</text>
        <text x="250" y="138" textAnchor="middle" fill={espresso} fontSize="11" fontFamily="Playfair Display, serif" fontWeight="700">723</text>
        <text x="250" y="152" textAnchor="middle" fill={lightGray} fontSize="8" fontFamily="DM Sans, sans-serif">Inactive keywords</text>
        <text x="410" y="138" textAnchor="middle" fill={espresso} fontSize="11" fontFamily="Playfair Display, serif" fontWeight="700">€0</text>
        <text x="410" y="152" textAnchor="middle" fill={lightGray} fontSize="8" fontFamily="DM Sans, sans-serif">Additional spend</text>
      </svg>
    </div>
  );
}

function BlogVisualCompetitor() {
  const items = [
    { label: "Budget", a: "€50K/mo", b: "€5K/mo", aStr: 0.9, bStr: 0.1 },
    { label: "Sales Team", a: "20 people", b: "3 people", aStr: 0.85, bStr: 0.15 },
    { label: "Website CVR", a: "4.0%", b: "0.8%", aStr: 0.8, bStr: 0.2 },
    { label: "Lead Capacity", a: "500/mo", b: "50/mo", aStr: 0.95, bStr: 0.1 },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 28, fontWeight: 600, textAlign: "center" }}>Why Copying Fails</p>
      <div className="grid-competitor" style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: 20, maxWidth: 520, margin: "0 auto", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 180px" }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: espresso, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>Their Company</p>
          {items.map(i => (
            <div key={i.label+"a"} style={{ padding: "10px 14px", background: cream, marginBottom: 8, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: lightGray, textTransform: "uppercase", letterSpacing: 1 }}>{i.label}</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: espresso, fontWeight: 600 }}>{i.a}</span>
              </div>
              <div style={{ height: 3, background: "rgba(200,168,85,0.1)", borderRadius: 2 }}><div style={{ height: "100%", width: `${i.aStr*100}%`, background: gold, borderRadius: 2, opacity: 0.6 }}/></div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 8px", minWidth: 50 }}>
          <div style={{ width: 1, height: 30, background: "rgba(200,168,85,0.2)" }}/>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(180,80,60,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "8px 0" }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "rgba(180,80,60,0.5)" }}>✕</span>
          </div>
          <div style={{ width: 1, height: 30, background: "rgba(200,168,85,0.2)" }}/>
        </div>
        <div style={{ flex: "1 1 180px" }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: espresso, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>Your Company</p>
          {items.map(i => (
            <div key={i.label+"b"} style={{ padding: "10px 14px", background: cream, marginBottom: 8, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: lightGray, textTransform: "uppercase", letterSpacing: 1 }}>{i.label}</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: espresso, fontWeight: 600 }}>{i.b}</span>
              </div>
              <div style={{ height: 3, background: "rgba(200,168,85,0.1)", borderRadius: 2 }}><div style={{ height: "100%", width: `${i.bStr*100}%`, background: "rgba(180,80,60,0.4)", borderRadius: 2 }}/></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(200,168,85,0.12)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, color: espresso, fontStyle: "italic" }}>"Same niche. Same product. Completely different strategy needed."</p>
      </div>
    </div>
  );
}

function PullQuote({ text }) {
  return <div style={{ margin: "36px 0", padding: "28px 32px", borderLeft: `3px solid ${gold}`, background: "rgba(200,168,85,0.04)" }}><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: espresso, fontStyle: "italic", lineHeight: 1.6 }}>"{text}"</p></div>;
}

function BlogVisualAITime() {
  const tasks = [
    { task: "Monthly Report", without: "4 hours", w: "20 min", wPct: 85, aPct: 8 },
    { task: "Keyword Audit (1,700 kw)", without: "1 week", w: "1 day", wPct: 100, aPct: 20 },
    { task: "Build Internal Tool", without: "3 months (wait for dev)", w: "15 days", wPct: 95, aPct: 16 },
    { task: "UTM Parameters (x20)", without: "45 min", w: "2 min", wPct: 50, aPct: 4 },
    { task: "Data Matching Script", without: "Can't do it", w: "1 afternoon", wPct: 70, aPct: 12 },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>The AI Advantage: Time Spent Per Task</p>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 8, background: "rgba(180,80,60,0.25)", borderRadius: 1 }}/><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: lightGray }}>Without AI</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 8, background: gold, borderRadius: 1, opacity: 0.7 }}/><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: lightGray }}>With AI</span></div>
        </div>
        {tasks.map((t,i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: espresso, fontWeight: 600, marginBottom: 6 }}>{t.task}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ flex: 1, height: 14, background: "#F0EBE3", borderRadius: 2, overflow: "hidden" }}><div style={{ width: `${t.wPct}%`, height: "100%", background: "rgba(180,80,60,0.2)", borderRadius: 2 }}/></div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "rgb(160,70,50)", minWidth: 100, textAlign: "right", opacity: 0.7 }}>{t.without}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 14, background: "#F0EBE3", borderRadius: 2, overflow: "hidden" }}><div style={{ width: `${t.aPct}%`, height: "100%", background: gold, borderRadius: 2, opacity: 0.7 }}/></div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: gold, minWidth: 100, textAlign: "right", fontWeight: 600 }}>{t.w}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(200,168,85,0.12)", textAlign: "center" }}><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, color: espresso, fontStyle: "italic" }}>"Based on real tasks from my day-to-day work as a Marketing Analyst."</p></div>
    </div>
  );
}

function BlogVisualAIvsHuman() {
  const aiTasks = ["Data cleaning & restructuring", "First draft of reports", "UTM parameter generation", "Keyword sorting & grouping", "Writing automation scripts", "Pattern detection in datasets"];
  const humanTasks = ["Campaign strategy & direction", "Stakeholder communication", "Judgment calls on budget", "Reading the room in meetings", "Creative positioning", "Understanding business context"];
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 28, fontWeight: 600, textAlign: "center" }}>Where AI Helps vs Where Humans Lead</p>
      <div className="grid-competitor" style={{ display: "flex", maxWidth: 520, margin: "0 auto", gap: 0 }}>
        <div style={{ flex: 1, paddingRight: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(200,168,85,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 12 }}>&#9889;</span></div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: gold, fontWeight: 700 }}>AI Excels At</p>
          </div>
          {aiTasks.map((t,i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: gold, marginTop: 2, flexShrink: 0 }}>&#9662;</span><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: warmGray, lineHeight: 1.5 }}>{t}</p></div>)}
        </div>
        <div style={{ width: 1, background: `linear-gradient(to bottom, transparent, ${gold}, transparent)`, margin: "0 4px", flexShrink: 0 }}/>
        <div style={{ flex: 1, paddingLeft: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(44,36,23,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 12 }}>&#129504;</span></div>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: espresso, fontWeight: 700 }}>Humans Lead On</p>
          </div>
          {humanTasks.map((t,i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: espresso, marginTop: 2, flexShrink: 0 }}>&#9662;</span><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: warmGray, lineHeight: 1.5 }}>{t}</p></div>)}
        </div>
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(200,168,85,0.12)", textAlign: "center" }}><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, color: espresso, fontStyle: "italic" }}>"The best results come from combining both. Not choosing one over the other."</p></div>
    </div>
  );
}

const blogVisuals = { audit: <BlogVisualAudit />, competitor: <BlogVisualCompetitor />, aiTime: <BlogVisualAITime />, aiVsHuman: <BlogVisualAIvsHuman /> };

/* METRIC TICKER */
function AnimatedMetric({ display, label }) {
  const [ref, vis] = useInView(0.3);
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!vis || done) return;
    const m = display.match(/([€]?)([0-9.]+)([A-Za-z+%x]*)/);
    if (!m) { setCurrent(display); setDone(true); return; }
    const [,pre,numStr,suf] = m; const target = parseFloat(numStr); const dec = numStr.includes('.') ? numStr.split('.')[1].length : 0;
    const dur = 1800, start = Date.now();
    const tick = () => { const p = Math.min((Date.now()-start)/dur,1); const e = 1-Math.pow(1-p,3); const v = e*target; setCurrent(pre+(dec>0?v.toFixed(dec):Math.floor(v))+suf); if(p<1) requestAnimationFrame(tick); else { setCurrent(display); setDone(true); } };
    requestAnimationFrame(tick);
  }, [vis, done, display]);
  return <div ref={ref} style={{ textAlign: "center", flex: "1 1 140px" }}><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: gold, fontWeight: 700, marginBottom: 6, minHeight: 42 }}>{current||"\u00A0"}</p><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#B0A594", letterSpacing: 1.5, textTransform: "uppercase", opacity: done?1:0.4, transition: "opacity 0.5s" }}>{label}</p></div>;
}

/* NAVBAR */
function Navbar({ active }) {
  const [sc, setSc] = useState(false);
  useEffect(() => { const h = () => setSc(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const links = ["About","Work","Skills","Journey","Blog","Contact"];
  return <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: sc?"rgba(252,249,244,0.95)":"transparent", backdropFilter: sc?"blur(16px)":"none", borderBottom: sc?"1px solid rgba(200,168,85,0.12)":"none", transition: "all 0.4s", padding: sc?"10px 0":"18px 0" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <a href="#hero" style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: gold, textDecoration: "none", fontWeight: 700 }}>&#9670;</a>
      <div className="nav-links" style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        {links.map(l => <a key={l} href={`#${l.toLowerCase()}`} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase", color: active===l.toLowerCase()?gold:warmGray, textDecoration: "none", fontWeight: 500, transition: "color 0.3s", borderBottom: active===l.toLowerCase()?`1.5px solid ${gold}`:"1.5px solid transparent", paddingBottom: 2 }}>{l}</a>)}
      </div>
    </div>
  </nav>;
}

/* HERO */
function Hero() {
  const [ld, setLd] = useState(false);
  useEffect(() => { setTimeout(() => setLd(true), 150); }, []);
  const a = d => ({ opacity: ld?1:0, transform: ld?"translateY(0)":"translateY(26px)", transition: `all 0.75s cubic-bezier(0.16,1,0.3,1) ${d}s` });
  return <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(168deg, ${cream} 0%, #F5EFE6 25%, #EDE5D8 50%, #F5EFE6 75%, ${cream} 100%)`, backgroundSize: "200% 200%", animation: "subtleShift 12s ease infinite", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "8%", right: "6%", width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(200,168,85,0.1)" }}/>
    <div style={{ position: "absolute", bottom: "12%", left: "4%", width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(200,168,85,0.07)" }}/>
    <div style={{ textAlign: "center", padding: "0 32px", maxWidth: 820, position: "relative", zIndex: 2 }}>
      <div style={a(0.2)}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 28, fontWeight: 500 }}>Marketing Analyst &bull; Builder &bull; Creator</p></div>
      <div style={a(0.4)}><h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(44px,7vw,76px)", fontWeight: 700, color: espresso, lineHeight: 1.08, margin: "0 0 20px" }}>Ruby Patra</h1></div>
      <div style={a(0.55)}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 19, color: warmGray, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 44px" }}>I've managed €3.5M+ in ad spend across luxury travel, automotive, and multi-niche agency campaigns.<br/><span style={{ color: lightGray }}>Marketing analytics meets hands-on building.</span></p></div>
      <div className="hero-buttons" style={{ ...a(0.7), display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <a href="#work" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", padding: "15px 38px", background: espresso, color: cream, textDecoration: "none", fontWeight: 600, transition: "all 0.35s" }} onMouseEnter={e=>{e.target.style.background=gold;e.target.style.color=espresso}} onMouseLeave={e=>{e.target.style.background=espresso;e.target.style.color=cream}}>View My Work</a>
        <a href="#contact" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", padding: "15px 38px", background: "transparent", color: espresso, textDecoration: "none", border: `1.5px solid ${gold}`, fontWeight: 600, transition: "all 0.35s" }} onMouseEnter={e=>{e.target.style.background=gold;e.target.style.color=espresso}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color=espresso}}>Get In Touch</a>
      </div>
    </div>
    <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", opacity: ld?0.45:0, transition: "opacity 1s ease 1.3s", textAlign: "center" }}><div style={{ width: 1, height: 44, background: `linear-gradient(to bottom, ${gold}, transparent)`, margin: "0 auto 8px" }}/><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: 3.5, textTransform: "uppercase", color: warmGray }}>Scroll</p></div>
  </section>;
}

/* METRICS */
function MetricsBanner() {
  return <section style={{ background: espresso, padding: "52px 32px" }}><div className="metrics-row" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "28px 16px" }}>
    <AnimatedMetric display="€3.5M+" label="Career Ad Spend Managed"/>
    <AnimatedMetric display="30K+" label="Conversions Generated"/>
    <AnimatedMetric display="4+" label="Channels Managed"/>
    <AnimatedMetric display="9+" label="Industries Served"/>
    <AnimatedMetric display="5" label="International Markets"/>
  </div></section>;
}

/* ABOUT */
function About() {
  const { ref: photoRef, transform: photoT, shadow: photoS, handleMove: photoM, handleLeave: photoL } = useTilt(6);
  return <section id="about" style={{ padding: "100px 32px", background: paperWhite }}><div style={{ maxWidth: 960, margin: "0 auto" }}>
    <Reveal><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>About</p><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: espresso, marginBottom: 36, fontWeight: 600, lineHeight: 1.15 }}>Where data meets<br/><span style={{ color: gold, fontStyle: "italic" }}>creative building</span></h2></Reveal>
    <div className="grid-photo" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 48, alignItems: "start" }}>
      <Reveal delay={0.1}><div ref={photoRef} onMouseMove={photoM} onMouseLeave={photoL} style={{ position: "relative", overflow: "hidden", transition: "transform 0.2s ease, box-shadow 0.2s ease", transform: photoT, cursor: "default" }}>
        <div style={{ position: "absolute", top: 10, left: 10, right: -10, bottom: -10, border: `2px solid ${gold}`, opacity: 0.25 }}/>
        <img src={RUBY_PHOTO} alt="Ruby Patra" style={{ width: "100%", height: 380, objectFit: "cover", objectPosition: "center center", display: "block", background: "#EDE5D8", position: "relative", zIndex: 1, boxShadow: photoS }} onError={e=>{e.target.style.display="none"}}/>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, marginTop: 14, textAlign: "center", letterSpacing: 1 }}>📍 Marseille, France</p>
      </div></Reveal>
      <div>
        <Reveal delay={0.15}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: warmGray, lineHeight: 1.85 }}>I'm a Marketing Analyst at French Side Travel in Marseille, a luxury travel agency where I manage multi-million euro ad spend across Google Ads, Meta, Bing, and Pinterest, targeting high-net-worth US travellers planning bespoke trips to France.</p><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: warmGray, lineHeight: 1.85, marginTop: 18 }}>But I'm not just an analyst who reads dashboards. I <em>build</em> them. I've created internal reporting tools, written Python scripts for data matching, developed a full SaaS product, and designed landing pages. All while managing seven-figure ad budgets.</p></Reveal>
        <Reveal delay={0.25}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: warmGray, lineHeight: 1.85, marginTop: 18 }}>I hold an M.Sc. in Digital Expertise for Marketing from Neoma Business School. Before France, I worked at a digital marketing agency managing multi-client campaigns with €100K+ monthly budgets. Before that, I was at an authorised Toyota dealership where I built my foundation in sales, CRM, and customer engagement.</p><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: warmGray, lineHeight: 1.85, marginTop: 18 }}>Currently open to opportunities in <strong style={{ color: espresso }}>Ireland</strong> (Cork or Dublin preferred). <strong style={{ color: espresso }}>No visa sponsorship required</strong>. Looking for roles where marketing, technology, and data intersect.</p><div style={{ marginTop: 28, padding: "18px 22px", borderLeft: `3px solid ${gold}`, background: cream }}><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: espresso, fontStyle: "italic", lineHeight: 1.65 }}>"The ability to translate between the language of data and the language of humans. That's the skill that changes careers."</p></div></Reveal>
      </div>
    </div>
  </div></section>;
}

/* HOW I WORK - Fan Out Animation */
function HowIWork() {
  const [ref, vis] = useInView(0.2);
  const steps = [
    { icon: <IconAnalyse/>, num: "01", title: "Analyse", desc: "I dig into the data others skip. Not top-line metrics, but keyword-level, ad-group-level truth. Where is money actually going, and what's it actually returning?" },
    { icon: <IconBuild/>, num: "02", title: "Build", desc: "If a tool doesn't exist, I make it. Dashboards, scripts, automations, even full products. I don't wait for engineering. I ship solutions myself." },
    { icon: <IconOptimise/>, num: "03", title: "Optimise", desc: "Data informs every decision. I restructure, test, measure, and iterate. The goal isn't activity. It's measurable improvement in metrics that matter." },
  ];
  const getCardStyle = (i) => {
    if (!vis) return { opacity: 0, transform: "perspective(800px) translateX(0) translateZ(-50px) scale(0.9)" };
    const transforms = [
      "perspective(800px) translateX(-20px) rotateY(3deg) scale(1)",
      "perspective(800px) translateX(0) translateZ(20px) scale(1.03)",
      "perspective(800px) translateX(20px) rotateY(-3deg) scale(1)",
    ];
    return { opacity: 1, transform: transforms[i] };
  };
  return <section style={{ padding: "100px 32px", background: cream }}><div style={{ maxWidth: 1000, margin: "0 auto" }}>
    <Reveal><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Approach</p><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: espresso, marginBottom: 56, fontWeight: 600 }}>How I Work</h2></Reveal>
    <div ref={ref} className="grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36 }}>
      {steps.map((s, i) => {
        const cardStyle = getCardStyle(i);
        return <TiltCard key={s.num} intensity={12} style={{ ...cardStyle, padding: "40px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)", textAlign: "center", transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>{s.icon}</div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 3, color: gold, marginBottom: 8, fontWeight: 600 }}>{s.num}</p>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: espresso, marginBottom: 14, fontWeight: 600 }}>{s.title}</h3>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: warmGray, lineHeight: 1.75 }}>{s.desc}</p>
        </TiltCard>;
      })}
    </div>
  </div></section>;
}

/* PROJECTS */
function CaseStudyModal({ project: p, onClose }) {
  const cs = p.caseStudy; if (!cs) return null;
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(44,36,23,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "pointer" }}>
    <div className="modal-content" onClick={e=>e.stopPropagation()} style={{ background: paperWhite, maxWidth: 720, width: "100%", maxHeight: "85vh", overflow: "auto", padding: "48px 44px", position: "relative", cursor: "default" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 28, color: lightGray, cursor: "pointer", lineHeight: 1 }}>&times;</button>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 8 }}>Case Study</p>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, color: espresso, marginBottom: 6, fontWeight: 600 }}>{p.title}</h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: lightGray, marginBottom: 32, fontStyle: "italic" }}>{p.subtitle}</p>
      {p.screenshot && SCREENSHOTS[p.screenshot] ? <div style={{ width: "100%", marginBottom: 32, border: "1px solid rgba(200,168,85,0.15)", overflow: "hidden" }}><img src={SCREENSHOTS[p.screenshot]} alt={p.title} style={{ width: "100%", height: "auto", display: "block" }}/></div> : null}
      {[{ l: "The Problem", t: cs.problem },{ l: "The Approach", t: cs.approach },{ l: "What I Built", t: cs.built },{ l: "The Result", t: cs.result }].map(s => <div key={s.l} style={{ marginBottom: 24 }}><h4 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", color: gold, marginBottom: 8, fontWeight: 600 }}>{s.l}</h4><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: warmGray, lineHeight: 1.8 }}>{s.t}</p></div>)}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>{p.tags.map(t => <span key={t} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, padding: "5px 12px", background: cream, color: warmGray }}>{t}</span>)}</div>
    </div>
  </div>;
}

function ProjectCard({ project: p, onOpenCase }) {
  return <TiltCard intensity={10} style={{ background: paperWhite, border: "1px solid rgba(200,168,85,0.12)", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ height: 4, background: p.color, flexShrink: 0 }}/>
    <div style={{ padding: "26px 26px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: gold, fontWeight: 600 }}>{p.year}</p>
        {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: p.color, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, borderBottom: `1px solid ${p.color}`, paddingBottom: 1 }}>Live →</a>}
      </div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 21, color: espresso, marginBottom: 4, fontWeight: 600 }}>{p.title}</h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: lightGray, marginBottom: 12, fontStyle: "italic" }}>{p.subtitle}</p>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: warmGray, lineHeight: 1.7, marginBottom: 18, flex: 1 }}>{p.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: p.caseStudy ? 16 : 0 }}>{p.tags.map(t => <span key={t} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, padding: "4px 10px", background: cream, color: warmGray }}>{t}</span>)}</div>
      {p.caseStudy && <button onClick={()=>onOpenCase(p)} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", background: "none", border: `1px solid ${gold}`, color: gold, padding: "8px 20px", cursor: "pointer", fontWeight: 600, transition: "all 0.3s", alignSelf: "flex-start" }} onMouseEnter={e=>{e.target.style.background=gold;e.target.style.color=espresso}} onMouseLeave={e=>{e.target.style.background="none";e.target.style.color=gold}}>View Case Study</button>}
    </div>
  </TiltCard>;
}

function Work() {
  const [cp, setCp] = useState(null);
  return <section id="work" style={{ padding: "100px 32px", background: cream }}><div style={{ maxWidth: 1100, margin: "0 auto" }}>
    <Reveal><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Portfolio</p><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: espresso, marginBottom: 12, fontWeight: 600 }}>Selected Projects</h2><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: warmGray, marginBottom: 56, maxWidth: 580 }}>From SaaS products to ad campaign strategy. Things I've built, analysed, and shipped. Click "View Case Study" for the full story.</p></Reveal>
    <div className="grid-auto" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>{PROJECTS.map((p,i) => <Reveal key={p.id} delay={i*0.15} style={{ height: "100%" }}><ProjectCard project={p} onOpenCase={setCp}/></Reveal>)}</div>
  </div>{cp && <CaseStudyModal project={cp} onClose={()=>setCp(null)}/>}</section>;
}

/* SKILLS */
function SkillsSection() {
  return <section id="skills" style={{ padding: "100px 32px", background: espresso }}><div style={{ maxWidth: 1000, margin: "0 auto" }}>
    <Reveal><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Expertise</p><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: cream, marginBottom: 56, fontWeight: 600 }}>Skills & Tools</h2></Reveal>
    <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
      {Object.entries(SKILLS).map(([cat, items], i) => <Reveal key={cat} delay={i*0.08}><h3 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 16, fontWeight: 600 }}>{cat}</h3><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{items.map((item,j) => <span key={item} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, padding: "8px 16px", border: "1px solid rgba(200,168,85,0.22)", color: "#E8DFD0", transition: "all 0.3s", cursor: "default", opacity: 0, animation: `fadeIn 0.4s ease ${0.2+i*0.12+j*0.05}s forwards` }} onMouseEnter={e=>{e.target.style.background=gold;e.target.style.color=espresso;e.target.style.borderColor=gold}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color="#E8DFD0";e.target.style.borderColor="rgba(200,168,85,0.22)"}}>{item}</span>)}</div></Reveal>)}
    </div>
    <Reveal delay={0.2}><div style={{ marginTop: 72, paddingTop: 56, borderTop: "1px solid rgba(200,168,85,0.15)" }}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Growth</p><h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: cream, marginBottom: 40, fontWeight: 600 }}>Currently Learning</h3><div style={{ display: "grid", gap: 24, maxWidth: 700 }}>{LEARNING.map((item,i) => <Reveal key={item.skill} delay={0.25+i*0.06}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}><h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: cream, fontWeight: 600 }}>{item.skill}</h4><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: gold, fontWeight: 600 }}>{item.progress}%</span></div><div style={{ width: "100%", height: 3, background: "rgba(200,168,85,0.12)", marginBottom: 8, overflow: "hidden" }}><div style={{ width: `${item.progress}%`, height: "100%", background: `linear-gradient(90deg, ${gold}, #D4B96A)`, animation: `growWidth 1.5s cubic-bezier(0.16,1,0.3,1) ${0.3+i*0.15}s both` }}/></div><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: "#8B7B65" }}>{item.note}</p></Reveal>)}</div></div></Reveal>
    <Reveal delay={0.3}><div className="grid-2col" style={{ marginTop: 72, paddingTop: 56, borderTop: "1px solid rgba(200,168,85,0.15)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
      <div><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Industries</p><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{INDUSTRIES.map(ind => <span key={ind} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, padding: "8px 16px", background: "rgba(200,168,85,0.08)", color: gold, border: "1px solid rgba(200,168,85,0.2)", transition: "all 0.3s", cursor: "default" }} onMouseEnter={e=>{e.target.style.background=gold;e.target.style.color=espresso}} onMouseLeave={e=>{e.target.style.background="rgba(200,168,85,0.08)";e.target.style.color=gold}}>{ind}</span>)}</div></div>
      <div><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Markets</p><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{MARKETS.map(m => <span key={m} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, padding: "8px 16px", background: "rgba(200,168,85,0.08)", color: gold, border: "1px solid rgba(200,168,85,0.2)", transition: "all 0.3s", cursor: "default" }} onMouseEnter={e=>{e.target.style.background=gold;e.target.style.color=espresso}} onMouseLeave={e=>{e.target.style.background="rgba(200,168,85,0.08)";e.target.style.color=gold}}>{m}</span>)}</div></div>
    </div></Reveal>
  </div></section>;
}

/* SOFT SKILLS */
function SoftSkillsSection() {
  return <section style={{ padding: "100px 32px", background: cream }}><div style={{ maxWidth: 1000, margin: "0 auto" }}>
    <Reveal><div style={{ textAlign: "center", marginBottom: 56 }}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Beyond Technical</p><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: espresso, marginBottom: 16, fontWeight: 600 }}>Soft Skills</h2><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: warmGray, maxWidth: 500, margin: "0 auto" }}>The human skills that make the technical ones count.</p></div></Reveal>
    <div className="soft-skills-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>{SOFT_SKILLS.map((item,i) => <Reveal key={item.skill} delay={i*0.06}><TiltCard intensity={8} style={{ padding: "28px 24px", background: paperWhite, borderTop: `2px solid ${gold}`, height: "100%" }}><h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: espresso, marginBottom: 8, fontWeight: 600 }}>{item.skill}</h3><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: warmGray, lineHeight: 1.65 }}>{item.desc}</p></TiltCard></Reveal>)}</div>
  </div></section>;
}

/* JOURNEY */
function JourneyTimeline() {
  return <section id="journey" style={{ padding: "100px 32px", background: paperWhite }}><div style={{ maxWidth: 800, margin: "0 auto" }}>
    <Reveal><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Path</p><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: espresso, marginBottom: 56, fontWeight: 600 }}>My Journey</h2></Reveal>
    <div style={{ position: "relative", paddingLeft: 40 }}><div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 1, background: `linear-gradient(to bottom, ${gold}, rgba(200,168,85,0.1))` }}/>
      {JOURNEY.map((j,i) => <Reveal key={j.year} delay={i*0.08}><div style={{ position: "relative", marginBottom: 40 }}><div style={{ position: "absolute", left: -40, top: 6, width: 15, height: 15, borderRadius: "50%", background: j.year==="Next"?gold:paperWhite, border: `2px solid ${gold}` }}/><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 4 }}>{j.year}</p><h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: espresso, fontWeight: 600, marginBottom: 4 }}>{j.title}</h3><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: lightGray, fontStyle: "italic", marginBottom: 8 }}>{j.place}</p><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: warmGray, lineHeight: 1.75 }}>{j.desc}</p></div></Reveal>)}
    </div>
  </div></section>;
}

/* BLOG */
function BlogSection() {
  const [exp, setExp] = useState(null);
  return <section id="blog" style={{ padding: "100px 32px", background: cream }}><div style={{ maxWidth: 760, margin: "0 auto" }}>
    <Reveal><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Insights</p><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: espresso, marginBottom: 56, fontWeight: 600 }}>Writing</h2></Reveal>
    <div style={{ display: "grid", gap: 28 }}>{BLOG_POSTS.map((post,idx) => <Reveal key={idx} delay={idx*0.12}><article style={{ background: paperWhite, border: "1px solid rgba(200,168,85,0.12)", overflow: "hidden" }}><div style={{ height: 5, background: `linear-gradient(90deg, ${gold}, #D4B96A)` }}/><div className="blog-article" style={{ padding: "36px 40px" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: gold, fontWeight: 600, padding: "4px 12px", border: `1px solid ${gold}` }}>{post.tag}</span><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: lightGray }}>{post.date}</span><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: lightGray }}>&bull; {post.readTime}</span></div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: espresso, marginBottom: 20, fontWeight: 600, lineHeight: 1.25 }}>{post.title}</h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: warmGray, lineHeight: 1.85, marginBottom: 24 }}>{post.content[0].text}</p>
      {exp!==idx ? <button onClick={()=>setExp(idx)} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: espresso, color: cream, border: "none", padding: "12px 28px", cursor: "pointer", fontWeight: 600, transition: "all 0.3s" }} onMouseEnter={e=>{e.target.style.background=gold;e.target.style.color=espresso}} onMouseLeave={e=>{e.target.style.background=espresso;e.target.style.color=cream}}>Continue Reading</button> :
      <div>{post.content.slice(1).map((b,i) => {
        if (b.type==="heading") return <h4 key={i} style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: espresso, marginTop: 32, marginBottom: 12, fontWeight: 600 }}>{b.text}</h4>;
        if (b.type==="pullquote") return <PullQuote key={i} text={b.text}/>;
        if (b.type==="visual" && blogVisuals[b.key]) return <div key={i}>{blogVisuals[b.key]}</div>;
        return <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: warmGray, lineHeight: 1.85, marginBottom: 16 }}>{b.text}</p>;
      })}<button onClick={()=>setExp(null)} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: "none", border: `1px solid rgba(200,168,85,0.3)`, color: warmGray, padding: "10px 24px", cursor: "pointer", fontWeight: 500, marginTop: 16, transition: "all 0.3s" }} onMouseEnter={e=>{e.target.style.borderColor=gold;e.target.style.color=gold}} onMouseLeave={e=>{e.target.style.borderColor="rgba(200,168,85,0.3)";e.target.style.color=warmGray}}>Collapse</button></div>}
    </div></article></Reveal>)}</div>
  </div></section>;
}

/* CONTACT */
function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "rubyspatra@gmail.com";
  const handleCopy = async () => { try { await navigator.clipboard.writeText(email); } catch { const t=document.createElement("textarea");t.value=email;document.body.appendChild(t);t.select();document.execCommand("copy");document.body.removeChild(t); } setCopied(true); setTimeout(()=>setCopied(false),2500); };
  return <section id="contact" style={{ padding: "100px 32px", background: espresso, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "15%", right: "8%", width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(200,168,85,0.06)" }}/>
    <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
      <Reveal><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Let's Connect</p><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, color: cream, marginBottom: 24, fontWeight: 600, lineHeight: 1.15 }}>Open to new<br/><span style={{ color: gold, fontStyle: "italic" }}>opportunities</span></h2><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "#B0A594", lineHeight: 1.75, marginBottom: 12, maxWidth: 460, margin: "0 auto 12px" }}>Currently in Marseille, relocating to Ireland (Cork or Dublin). Looking for roles where marketing, data, and technology converge.</p><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: gold, fontWeight: 600, marginBottom: 40 }}>No visa sponsorship required.</p></Reveal>
      <Reveal delay={0.15}><div className="contact-buttons" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
        <button onClick={handleCopy} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", padding: "14px 36px", background: copied?"#4CAF50":gold, color: copied?"#fff":espresso, fontWeight: 600, transition: "all 0.3s", border: "none", cursor: "pointer", minWidth: 180 }} onMouseEnter={e=>{if(!copied)e.target.style.background=cream}} onMouseLeave={e=>{if(!copied)e.target.style.background=gold}}>{copied?"✓ Email Copied!":"Copy Email"}</button>
        <a href="https://www.linkedin.com/in/ruby-patra/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", padding: "14px 36px", border: "1.5px solid rgba(200,168,85,0.35)", color: gold, textDecoration: "none", fontWeight: 500, transition: "all 0.3s" }} onMouseEnter={e=>{e.target.style.borderColor=gold;e.target.style.background="rgba(200,168,85,0.08)"}} onMouseLeave={e=>{e.target.style.borderColor="rgba(200,168,85,0.35)";e.target.style.background="transparent"}}>LinkedIn</a>
      </div><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#8B7B65", marginBottom: 20 }}>rubyspatra@gmail.com &bull; +33 6 51 41 09 84</p></Reveal>
    </div>
  </section>;
}

function Footer() { return <footer style={{ padding: "28px 32px", background: "#1E1A12", textAlign: "center" }}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: "#5A5040", letterSpacing: 1 }}>© 2026 Ruby Patra &bull; Built with purpose, deployed with Vercel</p></footer>; }

/* APP */
export default function Portfolio() {
  const [active, setActive] = useState("");
  useEffect(() => { const ids=["about","work","skills","journey","blog","contact"]; const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)}),{threshold:0.25}); ids.forEach(id=>{const el=document.getElementById(id);if(el)o.observe(el)}); return()=>o.disconnect(); }, []);
  return <div style={{ background: cream, minHeight: "100vh" }}>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet"/>
    <style>{`
      *,*::before,*::after{box-sizing:border-box;margin:0}
      html{scroll-behavior:smooth}
      body{overflow-x:hidden}
      ::selection{background:rgba(200,168,85,0.25)}
      @keyframes subtleShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes growWidth{from{width:0% !important}}
      @keyframes curtainReveal{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
      @media(max-width:768px){
        section{padding-left:20px !important;padding-right:20px !important}
        h1{font-size:36px !important}h2{font-size:28px !important}
        .nav-links{gap:12px !important;flex-wrap:wrap !important;justify-content:center !important}
        .nav-links a{font-size:9px !important;letter-spacing:1px !important}
        .grid-photo,.grid-3col,.grid-auto,.grid-2col,.soft-skills-grid{grid-template-columns:1fr !important}
        .metrics-row>div{flex:1 1 40% !important}
        .hero-buttons,.contact-buttons{flex-direction:column !important;align-items:center !important}
        .hero-buttons a,.hero-buttons button,.contact-buttons a,.contact-buttons button{width:100% !important;max-width:280px !important;text-align:center !important}
        .blog-article{padding:24px 20px !important}
        .modal-content{padding:28px 20px !important}
        .grid-competitor{flex-direction:column !important}
        .grid-competitor>div:nth-child(2){flex-direction:row !important;padding:8px 0 !important;min-width:auto !important}
        .grid-competitor>div:nth-child(2) div:first-child,.grid-competitor>div:nth-child(2) div:last-child{height:1px !important;width:30px !important}
      }
      @media(max-width:480px){
        section{padding-left:16px !important;padding-right:16px !important}
        h1{font-size:28px !important}h2{font-size:24px !important}
        .nav-links{gap:8px !important}
        .nav-links a{font-size:8px !important;letter-spacing:0.5px !important}
        .metrics-row>div{flex:1 1 100% !important}
      }
    `}</style>
    <Navbar active={active}/>
    <Hero/>
    <MetricsBanner/>
    <About/>
    <HowIWork/>
    <Work/>
    <SkillsSection/>
    <SoftSkillsSection/>
    <JourneyTimeline/>
    <BlogSection/>
    <Contact/>
    <Footer/>
  </div>;
}
