import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation, useParams, Link } from "react-router-dom";
import GrowthMarketing from "./GrowthMarketing.jsx";
import DashboardStudio from "./DashboardStudio.jsx";
import InquiryModal from "./components/InquiryModal.jsx";

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
  {
    slug: "paid-media-crm-attribution",
    title: "Paid Media Without CRM Data Is Just Expensive Guesswork",
    date: "May 2026",
    readTime: "5 min read",
    tag: "Marketing Ops",
    coverKind: "chart",
    visual: "crmQuiz",
    content: [
      { type: "intro", text: "Most marketers report on leads. The platform tells them which campaign won. They reallocate budget. They feel productive. None of it is connected to actual money." },
      { type: "visual", key: "crmQuiz" },
      { type: "heading", text: "Here's what the platform sees" },
      { type: "paragraph", text: "Google, Meta, Microsoft. They only see what fires on your website. A form fill. A button click. They cannot see what happens 60 days later when your sales team confirms the booking. So they optimise for what they can measure. Form fills are not customers." },
      { type: "visual", key: "crmConvertSlider" },
      { type: "heading", text: "Go deeper. The campaign is hiding the truth." },
      { type: "visual", key: "crmZoomStack" },
      { type: "pullquote", text: "The minimum decision-making unit isn't the campaign. It's the ad group." },
      { type: "heading", text: "Your turn. How much are you wasting?" },
      { type: "paragraph", text: "Plug in your numbers. This is the back-of-envelope math I use when CEOs ask whether a CRM integration is \"worth it.\"" },
      { type: "visual", key: "crmCalculator" },
      { type: "heading", text: "The four-step plumbing" },
      { type: "paragraph", text: "You don't need a five-figure attribution tool. You need clean UTMs, a CRM that captures them, one fuzzy-matching script, and a dashboard that reads from the result. Hover each step to see how it works." },
      { type: "visual", key: "crmPlumbing" },
      { type: "heading", text: "What this unlocked at a luxury travel brand I work with" },
      { type: "paragraph", text: "One audit. Six months of data. CRM connected to Google Ads at the ad group level. Watch the numbers count up." },
      { type: "visual", key: "crmResults" },
      { type: "heading", text: "The takeaway" },
      { type: "paragraph", text: "If your CRM and your paid channels aren't connected, you're optimising for noise. Start with the UTMs. Tag every ad, every channel, every variant. Then connect them to the CRM. Then look at performance one layer deeper than the campaign." },
      { type: "paragraph", text: "The first time you see your \"best\" campaign turn out to be your worst by actual revenue, you'll never go back." },
    ]
  },
  {
    slug: "solo-paid-media-stack",
    title: "How I Run a Multi-Channel Paid Media Account With Zero Agency Help",
    date: "May 2026",
    readTime: "9 min read",
    tag: "Marketing Ops",
    visual: "channelGrid",
    content: [
      { type: "intro", text: "Most companies spend €5,000 to €15,000 a month on an agency to run their paid media. I run €1.89M in spend across four platforms by myself. Not because I'm a unicorn. Because the actual work isn't what people think it is." },
      { type: "paragraph", text: "When I joined French Side Travel in June 2023, I expected to inherit an agency setup. That's how most mid-size companies handle paid media. You write a brief, someone in another city pulls the levers, you get a monthly deck. I didn't get that. The CEO wanted paid media in-house. I had three months as an intern to prove it could work." },
      { type: "paragraph", text: "Three years later, I'm still the only person on it. Google, Meta, Bing, Pinterest. €1.89M in annual spend. 13.8x ROI months. Zero agency invoices. People ask me how that's possible. The answer is unglamorous, so I'll just walk you through it." },
      { type: "heading", text: "First, the part nobody admits" },
      { type: "paragraph", text: "Agencies aren't slow because the work is hard. They're slow because the work is split across three people who don't talk to each other every day. An account manager who reads your brief. A media buyer who clicks the buttons. A reporting analyst who builds the deck. Add timezone gaps and weekly handoffs and the lag adds up." },
      { type: "paragraph", text: "In-house, I am all three people. I read the brief from myself. I click the buttons. I build the report. The handoff time is zero. That's the entire trick. Most of what people call \"skill\" in paid media is actually just compressed handoff time." },
      { type: "paragraph", text: "The real question is whether one person can hold four platforms in their head. The answer is yes, but only with a specific stack and a specific rhythm. That's what this post is about." },
      { type: "visual", key: "channelGrid" },
      { type: "heading", text: "The weekly rhythm is the whole job" },
      { type: "paragraph", text: "People think running paid ads is about clever bidding strategies and creative tests. Most of it isn't. Most of it is showing up at the same time every week and doing the same boring checks. The week has a shape, and the shape is the job." },
      { type: "paragraph", text: "Monday is for damage. I check spend pacing against month-to-date budget. I look at search terms from the weekend. I pause anything bleeding. Forty-five minutes, no thinking required." },
      { type: "paragraph", text: "Tuesday and Wednesday are for movement. New campaigns. Creative refreshes. Audience tests. This is where I actually use my brain. Two slots of two hours each, no meetings during them." },
      { type: "paragraph", text: "Thursday is for reporting. The dashboard does most of the work. I just write the commentary. What changed, why it changed, what I'm doing about it." },
      { type: "paragraph", text: "Friday is for the boring stuff that compounds. UTM hygiene. Naming conventions. Folder cleanup in Google Ads Editor. The kind of work an agency would never do because nobody pays for it." },
      { type: "visual", key: "weeklyRhythm" },
      { type: "pullquote", text: "Most of what people call 'skill' in paid media is actually just compressed handoff time." },
      { type: "heading", text: "The stack I actually use" },
      { type: "paragraph", text: "The fancy tools agencies sell you mostly don't matter. Triple Whale, Northbeam, all the attribution platforms with five-figure annual contracts. I don't pay for any of them. Here's what's actually on my computer." },
      { type: "visual", key: "stackLayers" },
      { type: "paragraph", text: "The layer that made everything else possible is the dashboard. Before I built it, leadership had no unified view of performance. Data lived in four separate platforms. Comparing channels meant manual CSV exports every week. I was losing four hours every Thursday to reporting that nobody read carefully." },
      { type: "paragraph", text: "So I built a single-page dashboard. HTML and CSS frontend. Supabase backend. Python scripts pulling from each platform's API every night. Now Thursday is 90 minutes of writing commentary, not building tables. The dashboard is the unsexy reason the whole solo setup works." },
      { type: "heading", text: "Where AI actually helps. And where it doesn't." },
      { type: "paragraph", text: "I get asked about AI in paid media constantly. The honest answer is more boring than people want." },
      { type: "paragraph", text: "AI does not run my campaigns. It writes my UTM scripts. It cleans up messy search term reports into pivot tables. It drafts the first version of a campaign brief so I can edit instead of write. It explains what a weird quality score drop probably means. It writes the Python that pulls Pinterest API data into Supabase. It is, basically, a tireless intern who never asks for context." },
      { type: "paragraph", text: "What AI does not do: decide where the budget goes. Decide which audience is worth testing. Read the CEO's mood in a Monday morning meeting. Notice that the booking team has been complaining about lead quality. Tell me that the €240 CPA on Pinterest is fine because those leads convert to €4,000 trips. The strategic layer is still mine. AI just removed the typing." },
      { type: "visual", key: "deathOfReports" },
      { type: "heading", text: "When this falls apart" },
      { type: "paragraph", text: "I am not telling you to fire your agency. I want to be honest about when this in-house model breaks." },
      { type: "paragraph", text: "It breaks when the company has no internal data discipline. If your CRM is a mess, your conversion tracking is half-broken, and nobody knows which bookings came from where, you don't have a paid media problem. You have a plumbing problem. An agency won't fix that either, but at least they'll hand you a polished report." },
      { type: "paragraph", text: "It breaks when leadership wants someone to blame. Agencies serve a real political function. When numbers go bad, you can fire the agency. You can't fire the in-house person as easily. Some companies need that escape valve more than they need efficiency." },
      { type: "paragraph", text: "And it breaks when the operator can't say no. If I said yes to every \"quick request\" from sales, every \"can you also handle social?\" from marketing, every \"while you're at it\" from leadership, this stack would collapse in a month. The reason it works is that I treat my calendar like a budget. Tuesday morning is not negotiable. Friday hygiene is not negotiable. The rhythm is the job." },
      { type: "pullquote", text: "An agency won't fix bad plumbing either. They'll just hand you a polished report about it." },
      { type: "heading", text: "The honest comparison" },
      { type: "paragraph", text: "I'm not going to pretend solo in-house is always better. Here's the actual trade-off." },
      { type: "visual", key: "soloVsAgency" },
      { type: "paragraph", text: "Bus factor of one is the real one. If I get hit by a bus, French Side Travel has a problem. They mitigate that by being able to hire an agency tomorrow if needed. The dashboard, the documented playbook, the clean campaign structure, all of it is also a handover document. That part is intentional." },
      { type: "heading", text: "If you're trying to do this" },
      { type: "paragraph", text: "Three things I'd tell a marketer trying to set up solo in-house from scratch." },
      { type: "paragraph", text: "First, build the reporting layer before you launch a single campaign. I know this sounds backwards. It isn't. Reporting is where solo operators die. If you can't see all four platforms in one view by Thursday afternoon, you'll spend every Thursday building decks instead of running campaigns. Even a janky version-one dashboard beats spreadsheet wrangling. Mine started as 200 lines of HTML and a Google Sheet." },
      { type: "paragraph", text: "Second, write your UTM convention down before you launch a single ad. Get this wrong and you'll waste six months untangling it. I use source / medium / campaign / channel / creative. Five fields, lowercase, hyphenated. Yes it's boring. That's the point." },
      { type: "paragraph", text: "Third, protect your calendar like it's a paid media budget. Tuesday and Wednesday deep work blocks are non-negotiable. The day someone books a meeting in those slots is the day the wheels start coming off. I block them as \"Campaign build, do not move\". Nobody has questioned it in three years." },
      { type: "paragraph", text: "That's it. There's no secret. Run paid media like the unglamorous operational job it actually is. The clever stuff comes from doing the boring stuff consistently. The boring stuff is the moat." },
    ]
  },
  {
    slug: "cdi-france-in-3-months",
    title: "How I Got a CDI in France in 3 Months",
    date: "May 2026",
    readTime: "8 min read",
    tag: "Career",
    visual: "experienceStack",
    content: [
      { type: "intro", text: "Most non-EU students in France spend the last semester of their Master's in panic mode. Refreshing the prefecture site. Drafting APS applications. Waiting for a CDI offer that may never come. I want to be honest with you. I didn't have that experience. My internship started in June 2023. By September, my boss had made me a CDI offer. I want to tell you exactly why, because the reason matters more than the result." },
      { type: "heading", text: "The thing I figured out before I ever landed in France" },
      { type: "paragraph", text: "I didn't come to France as a fresh graduate. I came with 3.5 years of actual marketing experience. Two years at a Toyota dealership in India doing sales, CRM, and customer engagement. Then 1.5 years at Writes India, a digital agency, running multi-client campaigns across the US, UK, and Australia. Six-figure monthly ad budgets. Real accounts. Real results." },
      { type: "paragraph", text: "By the time I started the M.Sc. at Neoma Business School, I wasn't there to learn marketing from scratch. I was there for the visa, the European market exposure, and the credential. The work itself, the campaigns, the dashboards, the data, I already knew that part." },
      { type: "paragraph", text: "This matters. Because when I walked into that internship in Marseille in June 2023, I wasn't performing the role of an intern. I was just doing my job. The difference was visible from week one." },
      { type: "visual", key: "experienceStack" },
      { type: "heading", text: "What actually happened in those 3 months" },
      { type: "paragraph", text: "The company hired me as a marketing intern in June 2023. Internship pay was around €1,000 a month, which is above the legal minimum but still nowhere close to a real salary. That's fine, that's the point of an internship. But it means you're not negotiating from a strong financial place. The leverage you have is your work, not the contract." },
      { type: "paragraph", text: "Within a few weeks, I wasn't doing intern work anymore. I was running paid campaigns. Pulling reports. Asking why a campaign was set up the way it was, then suggesting how to restructure it. My manager started looping me into conversations that didn't usually include interns." },
      { type: "paragraph", text: "The CDI talk started organically, somewhere in the second or third month. Both sides brought it up. Them in passing, like \"you'll be here past the internship, right?\". Me directly, like \"are we planning a CDI conversion?\". At some point I asked properly, and they said yes. My boss made the offer." },
      { type: "paragraph", text: "I didn't have to fight for it. I didn't have to chase it. I made it the obvious next step." },
      { type: "visual", key: "payJump" },
      { type: "pullquote", text: "I wasn't trying to prove I deserved a CDI. I was just doing the job I'd already been doing for years. The conversation came up because the work made it come up." },
      { type: "heading", text: "Why this worked. Three things, not luck." },
      { type: "visual", key: "realUnlock" },
      { type: "heading", text: "If you're a fresh grad reading this, don't despair" },
      { type: "paragraph", text: "I want to be careful here. I don't want this post to make a 23-year-old fresh graduate feel like the system is rigged against them because they don't have 3.5 years of experience." },
      { type: "paragraph", text: "The system isn't rigged. But it does reward signal. A French employer looking at your internship sees either a regular intern doing intern things (who will require management bandwidth and may or may not work out), or someone who walks in operating at a senior-junior level, ships things, asks the right questions, doesn't need handholding." },
      { type: "paragraph", text: "I was Option B because of my prior work. You can be Option B even as a fresh grad, but you have to manufacture the signal. That means: build something real before your Master's. Internships during your undergrad. Freelance projects. Side gigs in your domain. A portfolio site. Even one real client. The version of you who walks into a French internship having already managed even small campaigns or shipped one real project, that person gets a CDI offer faster." },
      { type: "paragraph", text: "Use the Master's year to build a portfolio, not just collect grades. Anything you can show. A blog. A tool. A case study. A dashboard. French employers don't read transcripts. They look at evidence." },
      { type: "paragraph", text: "Pick the internship strategically. Don't go for the prestige name that won't sponsor you. Go for the medium-size company with international hires and a real HR function. A no-name SME that converts beats a luxury house that won't." },
      { type: "heading", text: "The technical stuff you still need to know" },
      { type: "paragraph", text: "Even if your story goes smoothly like mine did, you need to understand the system. Because the moment your employer says \"yes, CDI\", the paperwork begins. And the paperwork has rules." },
      { type: "paragraph", text: "When you switch from a student visa to a salaried CDI in France as a non-EU candidate, your employer has to offer you a salary at or above a specific legal minimum. This is higher than the regular French minimum wage. The rule is 1.5× SMIC for the standard non-EU salaried route (Carte de Séjour Salarié or Travailleur Temporaire). SMIC is revised every January, so always confirm the current number. But the principle holds. France won't approve your work permit if your employer is paying you what a French junior could legally be paid." },
      { type: "visual", key: "salaryFloor" },
      { type: "paragraph", text: "If a company offers you €24K to €28K and won't move, that offer will fail at the DREETS (labour ministry) stage. Sometimes the company doesn't know this. You'll have to be the one who knows." },
      { type: "paragraph", text: "Even when the salary clears, sponsoring a non-EU candidate means the company has to file paperwork showing no EU candidate could have filled the role. A surprising number of French companies, even ones that interview you for hours, will quietly back out at this stage. Not because they don't like you. Often because the HR person doesn't want to deal with the file. Ask about visa sponsorship in the first or second interview. Not the offer call. Find out if they've sponsored before, who handles it internally, how long it usually takes. Clean answers means experienced. Vague answers means future nightmare." },
      { type: "paragraph", text: "If the CDI doesn't materialize, the fallback is the APS (Autorisation Provisoire de Séjour). A post-study residence permit that gives you around a year to either land a qualifying job or start a business. Even if you're confident in your CDI path, prepare your APS file in parallel. Worst case you don't use it. Best case it lowers your stress massively. Your school's career office will help." },
      { type: "heading", text: "What you're afraid of vs what actually happens" },
      { type: "paragraph", text: "For the version of you reading this in semester 2 of your Master's, here's the honest map." },
      { type: "visual", key: "fearReality" },
      { type: "heading", text: "One last thing" },
      { type: "paragraph", text: "The big lesson from my story isn't \"have 3.5 years of experience before your Master's.\" That's just my path. The lesson is this. Stop thinking of the internship as a probationary period. Think of it as the trial run of a job they're already paying you to do. Walk in operating at the level you want to be at. Don't ask for permission to do real work. Don't wait to be told. The CDI conversation either becomes automatic, or you find out fast that the company was never going to convert anyone. Either way, you stop wasting the panic month on whether they like you. You already know." },
      { type: "paragraph", text: "If you're in the middle of this and want to compare notes, my email is open. The version of me from 2022, about to land in France with a suitcase and a lot of assumptions, would have killed for a 20-minute call with someone who'd just done it. Pay it forward later." },
    ]
  },
  {
    slug: "your-sales-team-hates-your-leads",
    title: "Your Sales Team Hates Your Leads. Here's Why That's Actually Your Fault.",
    date: "April 2026",
    readTime: "7 min read",
    tag: "Marketing Ops",
    visual: "funnelShift",
    content: [
      { type: "intro", text: "It's Monday morning. Marketing sends the weekly lead number. Up 40%. Everyone should be happy. Then sales replies in the Slack thread with four words. \"These leads are garbage.\" Marketing fires back saying sales is too slow. Sales says marketing has no idea what a real buyer looks like. The CEO books an \"alignment meeting\" for Thursday and nobody wants to be there. Here is the uncomfortable truth. Both teams are right. And AI quietly made the whole thing ten times worse." },
      { type: "heading", text: "The Volume Trap" },
      { type: "paragraph", text: "Marketing is measured on leads. Sales is measured on revenue. These are two completely different things, and you can hit one while quietly destroying the other. For most of the last decade this didn't really matter. Getting leads was hard enough that quality came along for the ride. You couldn't spam your way to a thousand MQLs even if you tried." },
      { type: "paragraph", text: "Then 2024 happened. Apollo, Clay, Instantly, and the whole LinkedIn enrichment stack got cheap and fast. A prospecting motion that used to take three SDRs a full week can now be done by one marketer in a weekend. So marketers did the logical thing. They pushed on the metric they control. The leads got cheaper. More numerous. And on average, way worse qualified." },
      { type: "visual", key: "leadsStats" },
      { type: "paragraph", text: "The dashboard is green. The pipeline is red. Leadership hasn't noticed yet but they will." },
      { type: "visual", key: "funnelShift" },
      { type: "heading", text: "Why AI Made It Worse, Not Better" },
      { type: "paragraph", text: "Before AI, prospecting was slow. That slowness was the quality control. Every list you built, every sequence you wrote, every contact you enriched forced you to stop and think about fit. That friction was invisible but it was doing real work." },
      { type: "paragraph", text: "After AI, you can enrich 10,000 contacts over a weekend, personalize outreach with dynamic variables, and pipe \"interested\" replies straight into the CRM. The problem is what \"interested\" means now. It means somebody clicked a link in an automated sequence. That click has about the same predictive value as opening a cold email. Which is to say, almost none." },
      { type: "paragraph", text: "Your MQLs look warm. They're not. Sales finds out thirty minutes into the discovery call, when the prospect says \"I don't actually have budget for this,\" or worse, \"I just clicked to see what it was.\"" },
      { type: "pullquote", text: "Marketing is optimizing for the number on their dashboard. Sales is drowning in the consequence of that number." },
      { type: "visual", key: "aeTimePie" },
      { type: "heading", text: "The Fault Line Nobody Admits" },
      { type: "paragraph", text: "Here is the part that makes marketers uncomfortable. When sales complains about lead quality, marketing's first instinct is to defend. \"Our MQL criteria are met. Look at the dashboard.\" But those MQL criteria were designed for a completely different world. A world where filling out a demo form took actual effort. A world where somebody raising their hand meant they had read your content, understood what you do, and decided on purpose to talk to you." },
      { type: "paragraph", text: "That world is gone. AI can book 200 demos a week without breaking a sweat. The demo form isn't a filter anymore. It's a funnel for anyone with a pulse and a work email. The MQL definition is obsolete, everybody kind of knows it, and nobody is fixing it." },
      { type: "paragraph", text: "Why not? Because fixing it means the lead number drops. And the lead number is the number marketing gets promoted on. So marketing is structurally incentivized to keep a broken definition alive. That is the real fault line. This is not a communication problem. This is not a \"sales and marketing just don't get each other\" problem. It's a metric that was designed for a world that no longer exists, being defended by people whose careers depend on defending it." },
      { type: "visual", key: "mqlGap" },
      { type: "heading", text: "The Feedback Loop That Actually Works" },
      { type: "paragraph", text: "Most \"sales and marketing alignment\" advice is PowerPoint garbage. SLAs, shared OKRs, a quarterly offsite in Lisbon, a consultant with a Miro board. None of it survives first contact with a real Monday morning. What actually works is much smaller and much more operational. Three things. All boring. All cheap. All high leverage." },
      { type: "paragraph", text: "First, the 20 minute Friday sync. Not a meeting. A Loom, or a shared doc updated weekly. Sales drops their five worst leads and five best leads of the week, with one sentence each explaining why. Marketing reads it before Monday. No deck, no agenda, no Slack thread. Do this for four weeks and lead quality visibly shifts, because marketing finally sees what \"good\" actually looks like from the sales seat." },
      { type: "paragraph", text: "Second, close the loop in your CRM. Every closed lead needs a required field called \"reason closed.\" Make it a picklist, not free text. Free text is where good intentions go to die. Marketing needs to see this data on a shared dashboard, not buried in a monthly email. Most companies don't do this because sales data lives in Salesforce and marketing data lives in HubSpot and nobody connected them. That's a three hour Zapier job. It saves roughly 100 hours of sales complaints a quarter." },
      { type: "paragraph", text: "Third, kill the MQL number. Report on accepted pipeline instead. The moment marketing's main metric becomes \"pipeline sales actually accepted and worked,\" the whole incentive structure quietly fixes itself. This is a political change, not a technical one. It needs the CEO to say it out loud in a leadership meeting. Until that happens, the MQL number stays on the dashboard and the turf war continues on schedule." },
      { type: "visual", key: "ninetyDayImpact" },
      { type: "heading", text: "The Turf War Problem" },
      { type: "paragraph", text: "Why doesn't this already happen everywhere? Because suggesting any of it as a marketer basically sounds like you're volunteering for a harder metric. You are. That is the whole point." },
      { type: "paragraph", text: "The marketers who are going to survive the next five years are the ones who stop calling themselves \"demand generation\" and start calling themselves \"revenue contribution.\" The ones who tie their performance review to what sales actually closes, not to what marketing ships over the fence. That takes real courage. It also pays off faster than most people expect." },
      { type: "paragraph", text: "The ones who keep hugging their MQL dashboard are going to be the first cut when the economy tightens. Because leadership eventually notices that leads are up 3x and revenue is flat. That noticing used to take years. AI has shrunk it down to quarters. The CFO is already asking the question at some companies. In most, they'll ask within the next four reporting cycles. Maybe sooner." },
      { type: "pullquote", text: "\"More leads\" is the metric of marketers who will be cut in 2027. \"Accepted pipeline\" is the metric of the ones who will get promoted." },
      { type: "heading", text: "What To Do Monday Morning" },
      { type: "visual", key: "mondayMoves" },
      { type: "paragraph", text: "None of this needs new tools. None of it needs a consultant. It needs the uncomfortable decision to stop defending a number that makes you look good and start reporting a number that actually means something. The best marketers in your industry are already making that switch. The rest are still arguing about volume." },
      { type: "pullquote", text: "Sales and marketing alignment isn't a culture problem. It's a metrics problem. Fix the metrics. The culture follows." },
    ]
  },
  {
    slug: "why-i-architect-instead-of-code",
    title: "Why I Architect Instead of Code",
    date: "April 2026",
    readTime: "8 min read",
    tag: "AI + Building",
    visual: "architectLoops",
    content: [
      { type: "intro", text: "There's a tired debate happening on LinkedIn every week. One side: AI is making developers obsolete. Other side: you still need to know how to code. Both sides: missing the point. I don't write code the way a software engineer writes code. I never will. I don't have a CS degree, I've never touched a LeetCode problem, and I couldn't whiteboard a binary tree to save my life. And yet in the last eighteen months, I've shipped a multi-channel paid media dashboard, an Instagram DM automation SaaS with an AI lead qualification layer, a production portfolio website, an Android companion app, and a full content production pipeline. I didn't do any of this by 'learning to code with AI.' I did it by becoming a product architect and treating AI like an individual contributor on my team." },
      { type: "heading", text: "The Coder's Trap" },
      { type: "paragraph", text: "Most non-technical people who try to build with AI fall into the same trap. They open a chat, describe what they want in plain English, paste the code into a file, it doesn't work, they paste the error back in, the AI fixes it, it breaks something else, and three hours later they have a half-working prototype they don't understand and can't extend." },
      { type: "paragraph", text: "This is the mode I call vibe-coding. It works for tiny scripts and toy projects. It catastrophically fails for anything you plan to ship, maintain, or charge money for." },
      { type: "visual", key: "architectLoops" },
      { type: "paragraph", text: "The reason it fails is not that AI isn't smart enough. It's that vibe-coding treats AI like a magic wand and the human like a customer. Customers describe outcomes. Engineers design systems. If you are describing outcomes to an AI and hoping a system falls out, you are not building — you are wishing." },
      { type: "pullquote", text: "I didn't become a developer. I became something developers already work with every day: an architect." },
      { type: "heading", text: "What an Architect Actually Does" },
      { type: "paragraph", text: "An architect doesn't write every line of code. An architect makes the decisions that determine whether the code will work at all. What the system is actually for, and what it explicitly will not do. How data flows from input to storage to output. Where the boundaries are — what lives in the frontend, what lives in the backend, what lives in a third-party service. What breaks gracefully and what can never be allowed to break. What the interface between components looks like, so that each piece can be swapped out later." },
      { type: "visual", key: "decisionStack" },
      { type: "paragraph", text: "None of this requires knowing how to write a for-loop in seven languages. It requires knowing what the system needs to do and having strong opinions about how the pieces should fit together." },
      { type: "paragraph", text: "When I built the ads dashboard at work, nobody handed me a spec. I had a CEO who wanted a way to see all our ad performance in one place, a manager who wanted less time in Excel, and an ads account leaking money across four platforms. My job was not to write SQL. My job was to decide what the dashboard was actually for, who opens it, on what day, and what decision they make after. The answers determined everything that came next — the data schema, the caching strategy, the auth model, the visual hierarchy of the UI. Once those answers existed, the code was almost downstream of the thinking. AI could write the code. AI could not do the thinking." },
      { type: "heading", text: "AI as Your IC, Not Your Collaborator" },
      { type: "paragraph", text: "The second shift is how you talk to the AI. Most people talk to AI like it's a friend, a coach, or a search engine. They ramble, they ask vague questions, they accept the first answer, they move on. This is fine for casual use and disastrous for building." },
      { type: "paragraph", text: "When I'm building, I treat the AI like an individual contributor reporting to me. I write specs, not wishes. I review the work — every line. I push back when it's confidently wrong. I own the architecture. The AI fills in the implementation inside the boundaries I've drawn." },
      { type: "visual", key: "specLadder" },
      { type: "paragraph", text: "This is exactly how a good technical lead works with a junior or mid-level engineer. You don't micromanage their syntax. You set direction, you review output, you catch mistakes, and you hold the line on quality. The difference is that my IC works for roughly twenty dollars a month and doesn't get tired." },
      { type: "heading", text: "Why This Is More Defensible Than Learning to Code" },
      { type: "paragraph", text: "There's a lot of pressure right now on non-technical people to just learn to code with AI. I think this is bad advice because it aims at the wrong target. If you are a marketing analyst, or a PM, or an operator, or a designer, the fastest way for AI to make you obsolete is to turn you into a mediocre developer. There are already millions of better developers than you will ever be, and AI is getting better at replacing them specifically, not you." },
      { type: "pullquote", text: "Every product I've shipped started with a problem I understood better than anyone else on my team. That context is the moat. The code is commodity." },
      { type: "paragraph", text: "The defensible position is the opposite direction. Become the person who understands the business problem deeply enough to design the system, spec the work, review the output, and own the result. That is a role AI cannot replace, because AI does not have context. It does not know what your company actually needs. It does not know which trade-offs matter. It does not know which shortcuts will haunt you in six months. You do." },
      { type: "heading", text: "How I Actually Run a Build" },
      { type: "paragraph", text: "Concretely, here is how I work." },
      { type: "visual", key: "buildProcess" },
      { type: "paragraph", text: "I refuse to open the editor before the architecture is clear. I pick a boring stack on purpose — React, Vite, Supabase — because boring stacks mean more of my time goes to the actual problem. I write specs in layers, from high-level purpose down to exact props and schema. I read everything the AI writes, because code I can't read is code I can't own. And I ship small and fix fast. Every build goes live quickly, even if ugly. I'd rather have something real in the world to react to than a perfect plan in my head." },
      { type: "heading", text: "The Title I'd Give Myself" },
      { type: "paragraph", text: "If I had to put a word on what I do, it would not be developer. It would not be engineer. It would not even be 'technical marketer,' which is the label the industry keeps reaching for. The closest honest description is product architect. I decide what gets built, what it's for, and how the pieces fit. I use AI as my engineering team. I use my actual career — years of running campaigns, reading data, sitting inside the business problems — as the context that makes the system correct instead of just functional." },
      { type: "pullquote", text: "Stop apologizing for not coding. Start owning the design of the systems you wish existed. AI is not going to give you that role. You have to take it." },
      { type: "paragraph", text: "I think this is a real role. I think there are more people who should be doing it and fewer who should be trying to become developers. And I think the next few years will be very good for the people who figure out they're architects, and very uncomfortable for everyone else. If you're somewhere in the middle — analyst, operator, marketer, designer, PM — that's the job." },
    ]
  },
  { slug: "ai-search-2026-playbook", title: "How to Make Your Brand Appear in AI Search Results (The 2026 Playbook)", date: "April 2026", readTime: "8 min read", tag: "AI Marketing", visual: "aiSearch",
    content: [
      { type: "intro", text: "Google clicks are dropping. In 2026, around 60% of searches end without a single click — the user gets their answer directly from an AI-generated summary and moves on. ChatGPT processes over a billion queries a day. Perplexity's user base grew 600% last year. Google AI Overviews now appear on the majority of searches. If your brand isn't showing up inside those AI-generated answers, you're becoming invisible to a growing share of your audience." },
      { type: "heading", text: "What Actually Changed — SEO vs. GEO" },
      { type: "paragraph", text: "Traditional SEO gets you ranked in a list of blue links. Generative Engine Optimization (GEO) gets you cited inside the AI's answer itself. That's the fundamental shift. When someone asks ChatGPT \"best luxury travel agency for a France trip\" or types it into Google's AI Mode, the AI doesn't show ten links. It reads dozens of sources, synthesizes a single answer, and names a few brands directly. If you're named, you exist. If you're not, there's no page 2 to scroll to." },
      { type: "visual", key: "seoVsGeo" },
      { type: "paragraph", text: "Gartner projects that traditional search traffic to commercial websites will drop 25% by end of 2026. A Princeton research study on GEO found that the right optimization techniques can boost AI visibility by 30–40%. The window to build citation authority is right now — most competitors haven't even started." },
      { type: "heading", text: "How AI Search Decides Who to Cite" },
      { type: "paragraph", text: "AI platforms use a process called Retrieval-Augmented Generation (RAG). When a user asks a question, the AI breaks it into sub-queries, searches the web for each, scores the results for relevance and authority, reads the top-scoring pages, and synthesizes a combined answer. Then it attributes specific claims to specific sources with inline citations." },
      { type: "paragraph", text: "Three things determine whether your content gets picked: first, whether AI can actually find and read your content (crawlability); second, whether your content is structured so the AI can extract clean answers (structure); and third, whether the AI trusts you enough to cite you (authority)." },
      { type: "visual", key: "ragPipeline" },
      { type: "heading", text: "The 7-Step GEO Playbook" },
      { type: "paragraph", text: "Step 1: Audit your AI visibility. Go to ChatGPT, Perplexity, and Google AI Overviews right now. Search for queries your customers would ask. Are you mentioned? Are your competitors? Screenshot everything — this is your baseline." },
      { type: "paragraph", text: "Step 2: Make content answer-first. Every important page should state its direct answer in the first 40–60 words, then expand with supporting detail. AI systems parse opening content first." },
      { type: "paragraph", text: "Step 3: Increase information density. Add real statistics, specific numbers, named sources, and concrete examples. Aim for 2–3 data points per 300 words. Research shows pages with stats and structured lists get 30–40% higher visibility in AI responses." },
      { type: "paragraph", text: "Step 4: Use descriptive headings. Use H2s and H3s that match how people phrase questions. \"How Long Does a Custom France Trip Take?\" gets extracted. \"Our Approach\" tells AI nothing." },
      { type: "paragraph", text: "Step 5: Add schema markup. Implement FAQPage, Article/BlogPosting, LocalBusiness, and Service schema. It removes ambiguity — AI understands exactly what your page is about." },
      { type: "paragraph", text: "Step 6: Build off-site presence. AI cross-references your brand across LinkedIn, YouTube, Reddit, review platforms, and directories. Unlinked brand mentions carry weight." },
      { type: "paragraph", text: "Step 7: Keep content fresh. AI has a strong recency bias — content older than 3 months sees citation rates drop significantly. Update key pages quarterly." },
      { type: "pullquote", text: "The brands that start building citation authority now are the ones AI will recommend in 2027 and beyond. Citation authority compounds — just like domain authority did a decade ago." },
      { type: "heading", text: "Each AI Platform Works Differently" },
      { type: "visual", key: "geoStats" },
      { type: "paragraph", text: "Google AI Overviews pull heavily from pages already ranking in Google's top 10, though the overlap between rank and citation has dropped from 76% to about 38%. ChatGPT favors encyclopedic, well-structured content and cross-references with Bing rankings — 87% of its citations correspond to top Bing results. Perplexity rewards recency and community-sourced content from Reddit, forums, and YouTube." },
      { type: "paragraph", text: "The good news: the core principles — answer-first structure, high information density, authoritative presence — work across all platforms. Optimize once, show up everywhere." },
      { type: "heading", text: "Why This Is Great News for Small Businesses" },
      { type: "paragraph", text: "GEO isn't just for big brands with content teams. It's actually an equalizer. The original Princeton GEO research found that because AI models evaluate content quality and structure rather than pure backlink volume, smaller creators can compete effectively against larger sites." },
      { type: "paragraph", text: "If you're a freelancer or small business, start here: write 10–15 FAQ-style pages answering the most common questions in your industry. Structure each with answer-first format, add real data from your own experience, implement FAQ schema, and publish consistently. You don't need a GEO agency. You need clear, expert, structured content — and the discipline to keep it updated." },
      { type: "visual", key: "geoChecklist" },
      { type: "heading", text: "The Window Is Open. Most Haven't Started." },
      { type: "paragraph", text: "Fewer than 12% of marketing teams have a documented GEO strategy. That means 88% of your competitors are asleep. The shift from ranked links to AI-generated answers is the biggest change in search since Google itself. But the fundamentals haven't changed — strong content, real expertise, and a trustworthy brand still win. What's new is how you structure that content so AI can find it, read it, trust it, and cite it." },
      { type: "pullquote", text: "The competitive window won't stay open forever. Start this week. Audit your visibility. Fix your structure. Show up where AI is looking." },
    ]
  },
  { slug: "8500-wasted-google-ads-spend", title: "How I Found €8,500/Month in Wasted Google Ads Spend", date: "March 2025", readTime: "6 min read", tag: "Google Ads", visual: "audit",
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
  { slug: "never-copy-competitor-marketing-strategy", title: "Never Copy a Competitor's Marketing Strategy. Here's Why.", date: "March 2025", readTime: "5 min read", tag: "Strategy", visual: "competitor",
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
  { slug: "ai-wont-replace-marketers", title: "AI Won't Replace Marketers. But Marketers Who Use AI Will Replace Those Who Don't.", date: "March 2025", readTime: "5 min read", tag: "Marketing + AI", visual: "ai",
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
  useEffect(() => {
    const el = ref.current; if (!el) return;
    // Safety net: if for any reason the observer doesn't fire (short screens,
    // element already in viewport at load, browsers throttling, etc.),
    // reveal after a short delay so content is NEVER permanently hidden.
    const safety = setTimeout(() => setV(true), 800);

    // If element is already in (or near) the viewport on mount, reveal immediately.
    const rect = el.getBoundingClientRect();
    const winH = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < winH && rect.bottom > 0) { setV(true); clearTimeout(safety); return () => {}; }

    // Otherwise observe — use rootMargin so it triggers a bit before the element enters view.
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); clearTimeout(safety); }
    }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
    o.observe(el);
    return () => { o.disconnect(); clearTimeout(safety); };
  }, [t]);
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

/* ═══════════════════════════════════════════
   BLOG VISUALS — EXISTING
   ═══════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════
   BLOG VISUALS — NEW (AI SEARCH POST)
   ═══════════════════════════════════════════ */

function BlogVisualSeoVsGeo() {
  const boxStyle = (isGeo) => ({ padding: "20px 18px", background: isGeo ? "rgba(200,168,85,0.06)" : cream, border: `1px solid ${isGeo ? "rgba(200,168,85,0.25)" : "rgba(200,168,85,0.1)"}`, flex: "1 1 220px", minWidth: 200 });
  const labelStyle = { fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 12 };
  const titleStyle = (isGeo) => ({ fontFamily: "'Playfair Display',serif", fontSize: 18, color: isGeo ? gold : espresso, fontWeight: 600, marginBottom: 14 });
  const rowStyle = { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 };
  const dotStyle = (isGeo) => ({ width: 6, height: 6, borderRadius: "50%", background: isGeo ? gold : lightGray, marginTop: 5, flexShrink: 0 });
  const textStyle = { fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: warmGray, lineHeight: 1.6 };
  
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>The Fundamental Shift</p>
      <div className="grid-competitor" style={{ display: "flex", gap: 16, flexWrap: "wrap", maxWidth: 580, margin: "0 auto" }}>
        <div style={boxStyle(false)}>
          <p style={labelStyle}>Traditional SEO</p>
          <p style={titleStyle(false)}>Rank in a List</p>
          <div style={rowStyle}><div style={dotStyle(false)}/><p style={textStyle}>User sees 10 blue links</p></div>
          <div style={rowStyle}><div style={dotStyle(false)}/><p style={textStyle}>Compete for click-through</p></div>
          <div style={rowStyle}><div style={dotStyle(false)}/><p style={textStyle}>Page 2 still exists</p></div>
          <div style={rowStyle}><div style={dotStyle(false)}/><p style={textStyle}>Backlinks = authority signal</p></div>
          <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(180,80,60,0.06)", border: "1px solid rgba(180,80,60,0.12)" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgb(160,70,50)", fontWeight: 600 }}>25% traffic decline projected</p>
          </div>
        </div>
        <div style={boxStyle(true)}>
          <p style={labelStyle}>GEO (New)</p>
          <p style={titleStyle(true)}>Get Cited in the Answer</p>
          <div style={rowStyle}><div style={dotStyle(true)}/><p style={textStyle}>AI names your brand directly</p></div>
          <div style={rowStyle}><div style={dotStyle(true)}/><p style={textStyle}>No links to scroll through</p></div>
          <div style={rowStyle}><div style={dotStyle(true)}/><p style={textStyle}>You're either cited or invisible</p></div>
          <div style={rowStyle}><div style={dotStyle(true)}/><p style={textStyle}>Content structure = authority</p></div>
          <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(200,168,85,0.08)", border: `1px solid rgba(200,168,85,0.2)` }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: gold, fontWeight: 600 }}>30–40% visibility boost with GEO</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(200,168,85,0.12)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, color: espresso, fontStyle: "italic" }}>"SEO gets you ranked. GEO gets you recommended."</p>
      </div>
    </div>
  );
}

function BlogVisualRagPipeline() {
  const steps = [
    { num: "1", title: "Query", desc: "User asks a conversational question", icon: "?" },
    { num: "2", title: "Fan-Out", desc: "AI breaks into sub-queries & searches each", icon: "⑂" },
    { num: "3", title: "Score", desc: "Reads top sources, scores relevance & authority", icon: "⊕" },
    { num: "4", title: "Cite", desc: "Synthesizes answer, attributes claims to sources", icon: "✦" },
  ];
  const factors = [
    { title: "Crawlability", desc: "Can AI bots find & read your pages?", detail: "robots.txt · indexing · no bot-blocking" },
    { title: "Structure", desc: "Is your content easy to extract?", detail: "headings · answer-first · fact density" },
    { title: "Authority", desc: "Does AI trust you enough to cite?", detail: "E-E-A-T · reviews · brand mentions" },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: espresso, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>How AI Search Works — The RAG Pipeline</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
        {steps.map((s, i) => (
          <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ padding: "16px 14px", background: i === 3 ? "rgba(200,168,85,0.12)" : "rgba(200,168,85,0.05)", border: `1px solid ${i === 3 ? "rgba(200,168,85,0.35)" : "rgba(200,168,85,0.15)"}`, textAlign: "center", minWidth: 120 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 18, color: gold, marginBottom: 4 }}>{s.icon}</p>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: "#FFFDF9", fontWeight: 600, marginBottom: 4 }}>{s.title}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9.5, color: "#9A8C7A", lineHeight: 1.4 }}>{s.desc}</p>
            </div>
            {i < 3 && <span style={{ color: "rgba(200,168,85,0.4)", fontSize: 18 }}>→</span>}
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 16, fontWeight: 600, textAlign: "center" }}>Three Factors That Determine Citation</p>
      <div className="grid-competitor" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {factors.map(f => (
          <div key={f.title} style={{ padding: "16px 18px", background: "rgba(200,168,85,0.04)", border: "1px solid rgba(200,168,85,0.12)", flex: "1 1 160px", minWidth: 150 }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: gold, fontWeight: 600, marginBottom: 6 }}>{f.title}</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#9A8C7A", marginBottom: 6 }}>{f.desc}</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9.5, color: "#6B5E4B" }}>{f.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogVisualGeoStats() {
  const stats = [
    { num: "60%", label: "of searches end without a click" },
    { num: "25%", label: "drop in traditional search traffic (Gartner)" },
    { num: "1B+", label: "daily queries on ChatGPT alone" },
    { num: "40%", label: "visibility boost from GEO optimization" },
    { num: "600%", label: "Perplexity user growth YoY" },
    { num: "88%", label: "of marketers lack a GEO strategy" },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: espresso, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>The Numbers That Matter in 2026</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, maxWidth: 580, margin: "0 auto" }}>
        {stats.map(s => (
          <div key={s.num} style={{ padding: "18px 14px", background: "rgba(200,168,85,0.05)", border: "1px solid rgba(200,168,85,0.12)", textAlign: "center" }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: gold, fontWeight: 700, marginBottom: 6 }}>{s.num}</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#9A8C7A", lineHeight: 1.4 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogVisualGeoChecklist() {
  const onPage = ["Direct answer in first 40–60 words", "2–3 data points per 300 words", "Descriptive H2/H3s (question format)", "Short paragraphs (2–3 sentences max)", "Named author with credentials", "Content updated within last 3 months"];
  const offSite = ["AI crawlers not blocked in robots.txt", "FAQPage + Article schema added", "Consistent NAP across directories", "Active LinkedIn & YouTube presence", "Google reviews (volume + recency)", "Brand mentions on 3rd-party sites"];
  const colStyle = { flex: "1 1 220px", minWidth: 200 };
  const checkRow = (text) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
      <div style={{ width: 16, height: 16, border: `1.5px solid rgba(200,168,85,0.4)`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: gold, fontWeight: 700 }}>✓</span>
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: warmGray, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>GEO Content Checklist — Save & Use</p>
      <div className="grid-competitor" style={{ display: "flex", gap: 28, flexWrap: "wrap", maxWidth: 580, margin: "0 auto" }}>
        <div style={colStyle}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: espresso, fontWeight: 600, marginBottom: 16 }}>On-Page Optimization</p>
          {onPage.map(t => <div key={t}>{checkRow(t)}</div>)}
          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(200,168,85,0.06)", border: "1px solid rgba(200,168,85,0.12)" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: gold, fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>PRO TIP</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, color: lightGray, lineHeight: 1.5 }}>Write like you're answering a friend's question — clear, direct, no filler. AI rewards that.</p>
          </div>
        </div>
        <div style={colStyle}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: espresso, fontWeight: 600, marginBottom: 16 }}>Technical & Off-Site</p>
          {offSite.map(t => <div key={t}>{checkRow(t)}</div>)}
          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(200,168,85,0.06)", border: "1px solid rgba(200,168,85,0.12)" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: gold, fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>WEEKLY HABIT</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, color: lightGray, lineHeight: 1.5 }}>Every Friday: test 5 queries in ChatGPT, Perplexity & Google AI. Track what changed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BLOG VISUALS — NEW (ARCHITECT POST)
   ═══════════════════════════════════════════ */

function BlogVisualArchitectLoops() {
  const loopSteps = [
    { label: "Describe outcome", sub: "'build me a form'" },
    { label: "Paste code", sub: "don't really read it" },
    { label: "Error", sub: "paste it back, hope" },
  ];
  const linearSteps = [
    { label: "Think", sub: "what, for whom, why" },
    { label: "Spec", sub: "schema, states, edges" },
    { label: "Implement (AI)", sub: "AI fills the boundaries" },
    { label: "Review", sub: "read every line" },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 28, fontWeight: 600, textAlign: "center" }}>Vibe-Coding vs Architecting</p>
      <div className="grid-competitor" style={{ display: "flex", gap: 20, justifyContent: "center", maxWidth: 560, margin: "0 auto", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 220px", minWidth: 200 }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: "rgb(160,70,50)", fontWeight: 700, marginBottom: 16, textAlign: "center" }}>The vibe-coder loop</p>
          {loopSteps.map((s) => (
            <div key={s.label} style={{ position: "relative", padding: "12px 14px", background: "rgba(180,80,60,0.05)", border: "1px solid rgba(180,80,60,0.15)", marginBottom: 8 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: espresso, fontWeight: 600, marginBottom: 2 }}>{s.label}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: warmGray, fontStyle: "italic" }}>{s.sub}</p>
            </div>
          ))}
          <div style={{ textAlign: "center", fontSize: 16, color: "rgba(180,80,60,0.5)", margin: "4px 0" }}>↻</div>
          <div style={{ padding: "12px 14px", border: "1px dashed rgba(180,80,60,0.35)", textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgb(160,70,50)", fontWeight: 600 }}>Half-working thing</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, color: warmGray, fontStyle: "italic", marginTop: 2 }}>can't ship, can't extend</p>
          </div>
        </div>
        <div style={{ flex: "1 1 220px", minWidth: 200 }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: gold, fontWeight: 700, marginBottom: 16, textAlign: "center" }}>The architect loop</p>
          {linearSteps.map((s) => (
            <div key={s.label} style={{ padding: "10px 14px", background: "rgba(200,168,85,0.06)", border: "1px solid rgba(200,168,85,0.2)", marginBottom: 6 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: espresso, fontWeight: 600, marginBottom: 2 }}>{s.label}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: warmGray, fontStyle: "italic" }}>{s.sub}</p>
            </div>
          ))}
          <div style={{ textAlign: "center", fontSize: 14, color: gold, margin: "4px 0" }}>↓</div>
          <div style={{ padding: "12px 14px", background: gold, textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: espresso, fontWeight: 700 }}>Shippable system</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, color: espresso, fontStyle: "italic", marginTop: 2, opacity: 0.8 }}>owned, maintainable</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(200,168,85,0.12)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, color: espresso, fontStyle: "italic" }}>"One spins in place. The other moves forward."</p>
      </div>
    </div>
  );
}

function BlogVisualDecisionStack() {
  const layers = [
    { title: "Interfaces", sub: "how the pieces talk, so any one can be swapped", w: 50 },
    { title: "Failure modes", sub: "what breaks gracefully, what must not break", w: 60 },
    { title: "Boundaries", sub: "frontend / backend / third-party", w: 70 },
    { title: "Data flow", sub: "input → storage → transform → output", w: 80 },
    { title: "Users & jobs", sub: "who opens this, when, and to decide what", w: 90 },
    { title: "Purpose", sub: "what is this for, and what it will NOT do", w: 100 },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>What The Architect Decides (Before Any Code)</p>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {layers.map((layer) => (
          <div key={layer.title} style={{ width: `${layer.w}%`, margin: "0 auto 6px", padding: "12px 18px", background: "rgba(200,168,85,0.06)", border: "1px solid rgba(200,168,85,0.2)", textAlign: "center" }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: espresso, fontWeight: 600, marginBottom: 3 }}>{layer.title}</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: warmGray, fontStyle: "italic" }}>{layer.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(200,168,85,0.12)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, color: espresso, fontStyle: "italic" }}>"No code exists yet. Once this stack is clear, code is downstream of the thinking."</p>
      </div>
    </div>
  );
}

function BlogVisualSpecLadder() {
  const rungs = [
    { level: "Spec", code: '<MultiStepForm steps={5} persistKey="signup" onSubmit={supabasePost}/>', note: "Component signature + state model + schema.", tone: "top" },
    { level: "Brief", code: '"multi-step form, 5 steps, progressive disclosure, validation per step, persisted state"', note: "Shape is clear. AI can do useful work.", tone: "good" },
    { level: "Request", code: '"build me a signup form with email and password"', note: "Better. Still missing validation, errors, storage.", tone: "mid" },
    { level: "Wish", code: '"build me a form"', note: "AI guesses. You get generic code you don't own.", tone: "bad" },
  ];
  const toneBg = { top: "rgba(200,168,85,0.15)", good: "rgba(200,168,85,0.08)", mid: "rgba(180,80,60,0.05)", bad: "rgba(180,80,60,0.1)" };
  const toneBorder = { top: gold, good: "rgba(200,168,85,0.3)", mid: "rgba(180,80,60,0.2)", bad: "rgba(180,80,60,0.35)" };
  const toneLabelBg = { top: gold, good: "rgba(200,168,85,0.5)", mid: "rgba(180,80,60,0.5)", bad: "rgb(160,70,50)" };
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 8, fontWeight: 600, textAlign: "center" }}>From Wish to Spec</p>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: warmGray, marginBottom: 24, textAlign: "center", fontStyle: "italic" }}>how "build me a form" becomes something AI can actually build</p>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {rungs.map((r, i) => (
          <div key={r.level} style={{ display: "flex", marginBottom: 8, background: toneBg[r.tone], border: `1px solid ${toneBorder[r.tone]}` }}>
            <div style={{ flex: "0 0 90px", background: toneLabelBg[r.tone], padding: "14px 8px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: r.tone === "top" || r.tone === "bad" ? "#fff" : espresso, fontWeight: 700, letterSpacing: 1 }}>{r.level}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: r.tone === "top" || r.tone === "bad" ? "rgba(255,255,255,0.8)" : "rgba(44,36,23,0.6)", marginTop: 2 }}>level {4 - i}</p>
            </div>
            <div style={{ flex: 1, padding: "14px 18px" }}>
              <p style={{ fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace", fontSize: 11, color: espresso, marginBottom: 6, lineHeight: 1.5 }}>{r.code}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: warmGray, fontStyle: "italic" }}>→ {r.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(200,168,85,0.12)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, color: espresso, fontStyle: "italic" }}>"The higher you climb, the less AI guesses — and the more the system is actually yours."</p>
      </div>
    </div>
  );
}

function BlogVisualBuildProcess() {
  const steps = [
    { num: "1", title: "Architect before you open the editor", sub: "write down what it's for, who uses it, what data, what integrations — or don't build yet" },
    { num: "2", title: "Pick a boring stack on purpose", sub: "match the tool to the problem, not to the trend — more time for the work that matters" },
    { num: "3", title: "Write the spec in layers", sub: "purpose → components & data → exact props and schema — get more specific each pass" },
    { num: "4", title: "Read every line the AI writes", sub: "code you can't read is code you can't own — and code you don't own will break on you later" },
    { num: "5", title: "Ship small, fix fast", sub: "shipping is the only thing that generates real feedback — everything else is theater" },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 8, fontWeight: 600, textAlign: "center" }}>How I Actually Run a Build</p>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: warmGray, marginBottom: 28, textAlign: "center", fontStyle: "italic" }}>five moves, in order — the thinking comes before the typing</p>
      <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
        <div style={{ position: "absolute", left: 26, top: 20, bottom: 20, width: 1, background: "rgba(200,168,85,0.3)" }}/>
        {steps.map((s) => (
          <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, position: "relative" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: espresso, fontWeight: 700 }}>{s.num}</span>
            </div>
            <div style={{ flex: 1, padding: "14px 18px", background: cream, border: "1px solid rgba(200,168,85,0.2)" }}>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: espresso, fontWeight: 600, marginBottom: 4 }}>{s.title}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: warmGray, lineHeight: 1.5 }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BLOG VISUALS — MARKETING OPS POST
   ═══════════════════════════════════════════ */

function BlogVisualLeadsStats() {
  const rust = "#A04632";
  const stats = [
    { num: "10x", label: "Lead Volume", color: gold },
    { num: "+2%", label: "Revenue Lift", color: rust },
    { num: "23%", label: "Sales Time Wasted", color: rust },
  ];
  return (
    <div style={{ margin: "32px 0", display: "flex", gap: 12, flexWrap: "wrap" }}>
      {stats.map((s, i) => (
        <div key={i} style={{ flex: "1 1 150px", background: paperWhite, border: "1px solid rgba(200,168,85,0.15)", padding: "22px 18px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: s.color, lineHeight: 1.1, marginBottom: 8 }}>{s.num}</p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: lightGray, fontWeight: 500 }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function BlogVisualFunnelShift() {
  return (
    <div style={{ margin: "32px 0", padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>Same Revenue. Different Funnel Shape.</p>
      <svg viewBox="0 0 520 280" style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto" }}>
        <text x="110" y="20" textAnchor="middle" fill={warmGray} fontSize="11" fontFamily="DM Sans, sans-serif" letterSpacing="2" fontWeight="600">2022, PRE AI</text>
        <polygon points="50,40 170,40 150,90 70,90" fill="rgba(200,168,85,0.35)" stroke={gold} strokeWidth="1"/>
        <polygon points="70,90 150,90 135,140 85,140" fill="rgba(200,168,85,0.45)" stroke={gold} strokeWidth="1"/>
        <polygon points="85,140 135,140 125,190 95,190" fill="rgba(200,168,85,0.65)" stroke={gold} strokeWidth="1"/>
        <polygon points="95,190 125,190 120,235 100,235" fill={gold} stroke={gold} strokeWidth="1"/>
        <text x="110" y="68" textAnchor="middle" fill={espresso} fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="600">200 leads</text>
        <text x="110" y="118" textAnchor="middle" fill={espresso} fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="600">80 MQL</text>
        <text x="110" y="168" textAnchor="middle" fill={espresso} fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="600">45 SQL</text>
        <text x="110" y="218" textAnchor="middle" fill={cream} fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="700">12 won</text>
        <text x="110" y="260" textAnchor="middle" fill={espresso} fontSize="13" fontFamily="Playfair Display, serif" fontWeight="700">€240K pipeline</text>

        <line x1="260" y1="40" x2="260" y2="240" stroke="rgba(200,168,85,0.2)" strokeWidth="1" strokeDasharray="3,4"/>

        <text x="410" y="20" textAnchor="middle" fill={espresso} fontSize="11" fontFamily="DM Sans, sans-serif" letterSpacing="2" fontWeight="700">2026, AI FLOODED</text>
        <polygon points="290,40 510,40 480,90 320,90" fill="rgba(160,70,50,0.2)" stroke="rgba(160,70,50,0.5)" strokeWidth="1"/>
        <polygon points="320,90 480,90 430,140 370,140" fill="rgba(160,70,50,0.28)" stroke="rgba(160,70,50,0.5)" strokeWidth="1"/>
        <polygon points="370,140 430,140 420,190 380,190" fill="rgba(200,168,85,0.55)" stroke={gold} strokeWidth="1"/>
        <polygon points="380,190 420,190 415,235 385,235" fill={gold} stroke={gold} strokeWidth="1"/>
        <text x="400" y="68" textAnchor="middle" fill="#A04632" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="700">2,000 leads</text>
        <text x="400" y="118" textAnchor="middle" fill="#A04632" fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="700">450 MQL</text>
        <text x="400" y="168" textAnchor="middle" fill={espresso} fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="600">50 SQL</text>
        <text x="400" y="218" textAnchor="middle" fill={cream} fontSize="10" fontFamily="DM Sans, sans-serif" fontWeight="700">13 won</text>
        <text x="400" y="260" textAnchor="middle" fill={espresso} fontSize="13" fontFamily="Playfair Display, serif" fontWeight="700">€260K pipeline</text>
      </svg>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", marginTop: 20, letterSpacing: 0.5, fontStyle: "italic" }}>Ten times the leads. Basically the same revenue. Sales burned a quarter of their year on 1,800 ghosts.</p>
    </div>
  );
}

function BlogVisualAETimePie() {
  return (
    <div style={{ margin: "32px 0", padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>Where One AE's Week Actually Goes</p>
      <svg viewBox="0 0 520 280" style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto" }}>
        <path d="M 160 140 L 160 50 A 90 90 0 0 1 233.8 182.6 Z" fill="rgba(160,70,50,0.75)" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M 160 140 L 233.8 182.6 A 90 90 0 0 1 109.5 214.5 Z" fill="rgba(200,168,85,0.35)" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M 160 140 L 109.5 214.5 A 90 90 0 0 1 71.5 90.9 Z" fill={gold} stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M 160 140 L 71.5 90.9 A 90 90 0 0 1 160 50 Z" fill={espresso} stroke="#FFFFFF" strokeWidth="2"/>

        <text x="160" y="136" textAnchor="middle" fill={espresso} fontSize="10" fontFamily="DM Sans, sans-serif" letterSpacing="1.5" fontWeight="600">ONE AE</text>
        <text x="160" y="152" textAnchor="middle" fill={warmGray} fontSize="9" fontFamily="DM Sans, sans-serif">40 hour week</text>

        <rect x="300" y="60" width="14" height="14" fill="rgba(160,70,50,0.75)"/>
        <text x="322" y="72" fill={espresso} fontSize="13" fontFamily="DM Sans, sans-serif" fontWeight="700">52%</text>
        <text x="322" y="86" fill={warmGray} fontSize="11" fontFamily="DM Sans, sans-serif">Chasing unqualified leads</text>

        <rect x="300" y="110" width="14" height="14" fill="rgba(200,168,85,0.35)"/>
        <text x="322" y="122" fill={espresso} fontSize="13" fontFamily="DM Sans, sans-serif" fontWeight="700">23%</text>
        <text x="322" y="136" fill={warmGray} fontSize="11" fontFamily="DM Sans, sans-serif">CRM admin and logging</text>

        <rect x="300" y="160" width="14" height="14" fill={gold}/>
        <text x="322" y="172" fill={espresso} fontSize="13" fontFamily="DM Sans, sans-serif" fontWeight="700">16%</text>
        <text x="322" y="186" fill={warmGray} fontSize="11" fontFamily="DM Sans, sans-serif">Actually selling to real buyers</text>

        <rect x="300" y="210" width="14" height="14" fill={espresso}/>
        <text x="322" y="222" fill={espresso} fontSize="13" fontFamily="DM Sans, sans-serif" fontWeight="700">9%</text>
        <text x="322" y="236" fill={warmGray} fontSize="11" fontFamily="DM Sans, sans-serif">Internal meetings and handoffs</text>
      </svg>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", marginTop: 20, letterSpacing: 0.5, fontStyle: "italic" }}>Only 16% of an AE's week goes to actual selling. The rest gets eaten by bad leads and the paperwork that comes with them.</p>
    </div>
  );
}

function BlogVisualMqlGap() {
  return (
    <div style={{ margin: "32px 0", padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>The Gap Leadership Eventually Notices</p>
      <svg viewBox="0 0 520 260" style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto" }}>
        <line x1="60" y1="30" x2="60" y2="210" stroke="rgba(200,168,85,0.25)" strokeWidth="1"/>
        <line x1="60" y1="210" x2="500" y2="210" stroke="rgba(200,168,85,0.25)" strokeWidth="1"/>
        <line x1="60" y1="150" x2="500" y2="150" stroke="rgba(200,168,85,0.1)" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="60" y1="90" x2="500" y2="90" stroke="rgba(200,168,85,0.1)" strokeWidth="1" strokeDasharray="3,3"/>

        <path d="M 80 180 Q 160 160 220 120 T 380 50 L 480 30 L 480 168 L 380 170 L 280 172 L 180 175 L 80 178 Z" fill="rgba(160,70,50,0.08)"/>

        <path d="M 80 180 Q 160 160 220 120 T 380 50 L 480 30" stroke={gold} strokeWidth="2.5" fill="none"/>
        <circle cx="80" cy="180" r="3.5" fill={gold}/>
        <circle cx="180" cy="145" r="3.5" fill={gold}/>
        <circle cx="280" cy="95" r="3.5" fill={gold}/>
        <circle cx="380" cy="50" r="3.5" fill={gold}/>
        <circle cx="480" cy="30" r="3.5" fill={gold}/>

        <path d="M 80 178 L 180 175 L 280 172 L 380 170 L 480 168" stroke="rgba(160,70,50,0.8)" strokeWidth="2.5" fill="none"/>
        <circle cx="80" cy="178" r="3.5" fill="rgba(160,70,50,0.9)"/>
        <circle cx="180" cy="175" r="3.5" fill="rgba(160,70,50,0.9)"/>
        <circle cx="280" cy="172" r="3.5" fill="rgba(160,70,50,0.9)"/>
        <circle cx="380" cy="170" r="3.5" fill="rgba(160,70,50,0.9)"/>
        <circle cx="480" cy="168" r="3.5" fill="rgba(160,70,50,0.9)"/>

        <text x="475" y="24" textAnchor="end" fill={gold} fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="600">MQLs reported</text>
        <text x="475" y="185" textAnchor="end" fill="rgba(160,70,50,0.9)" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="600">Pipeline accepted</text>

        <text x="80" y="227" textAnchor="middle" fill={lightGray} fontSize="10" fontFamily="DM Sans, sans-serif">Q1</text>
        <text x="180" y="227" textAnchor="middle" fill={lightGray} fontSize="10" fontFamily="DM Sans, sans-serif">Q2</text>
        <text x="280" y="227" textAnchor="middle" fill={lightGray} fontSize="10" fontFamily="DM Sans, sans-serif">Q3</text>
        <text x="380" y="227" textAnchor="middle" fill={lightGray} fontSize="10" fontFamily="DM Sans, sans-serif">Q4</text>
        <text x="480" y="227" textAnchor="middle" fill={lightGray} fontSize="10" fontFamily="DM Sans, sans-serif">Q1+1</text>

        <text x="50" y="30" textAnchor="end" fill={lightGray} fontSize="9" fontFamily="DM Sans, sans-serif">High</text>
        <text x="50" y="210" textAnchor="end" fill={lightGray} fontSize="9" fontFamily="DM Sans, sans-serif">Low</text>

        <text x="260" y="253" textAnchor="middle" fill={espresso} fontSize="11" fontFamily="Playfair Display, serif" fontStyle="italic">One of these lines is the business. The other is theater.</text>
      </svg>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", marginTop: 20, letterSpacing: 0.5, fontStyle: "italic" }}>One is what marketing celebrates. The other is what actually keeps the lights on.</p>
    </div>
  );
}

function BlogVisualNinetyDayImpact() {
  return (
    <div style={{ margin: "32px 0", padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>What Changes After 90 Days of This</p>
      <svg viewBox="0 0 520 280" style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto" }}>
        <text x="70" y="50" textAnchor="end" fill={lightGray} fontSize="9" fontFamily="DM Sans, sans-serif">+100%</text>
        <text x="70" y="110" textAnchor="end" fill={lightGray} fontSize="9" fontFamily="DM Sans, sans-serif">+50%</text>
        <text x="70" y="170" textAnchor="end" fill={lightGray} fontSize="9" fontFamily="DM Sans, sans-serif">0</text>
        <text x="70" y="220" textAnchor="end" fill={lightGray} fontSize="9" fontFamily="DM Sans, sans-serif">-50%</text>

        <line x1="75" y1="167" x2="510" y2="167" stroke="rgba(200,168,85,0.3)" strokeWidth="1"/>
        <line x1="75" y1="47" x2="510" y2="47" stroke="rgba(200,168,85,0.08)" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="75" y1="107" x2="510" y2="107" stroke="rgba(200,168,85,0.08)" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="75" y1="217" x2="510" y2="217" stroke="rgba(200,168,85,0.08)" strokeWidth="1" strokeDasharray="3,3"/>

        <rect x="100" y="167" width="60" height="48" fill="rgba(160,70,50,0.6)" stroke="rgba(160,70,50,0.8)" strokeWidth="1"/>
        <text x="130" y="230" textAnchor="middle" fill="#A04632" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="700">-40%</text>
        <text x="130" y="250" textAnchor="middle" fill={warmGray} fontSize="10" fontFamily="DM Sans, sans-serif">MQL volume</text>
        <text x="130" y="263" textAnchor="middle" fill={lightGray} fontSize="9" fontFamily="DM Sans, sans-serif">(intentional)</text>

        <rect x="195" y="95" width="60" height="72" fill="rgba(200,168,85,0.6)" stroke={gold} strokeWidth="1"/>
        <text x="225" y="85" textAnchor="middle" fill={gold} fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="700">+60%</text>
        <text x="225" y="250" textAnchor="middle" fill={warmGray} fontSize="10" fontFamily="DM Sans, sans-serif">Accepted</text>
        <text x="225" y="263" textAnchor="middle" fill={warmGray} fontSize="10" fontFamily="DM Sans, sans-serif">pipeline</text>

        <rect x="290" y="75" width="60" height="92" fill={gold} stroke={gold} strokeWidth="1"/>
        <text x="320" y="65" textAnchor="middle" fill={gold} fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="700">+85%</text>
        <text x="320" y="250" textAnchor="middle" fill={warmGray} fontSize="10" fontFamily="DM Sans, sans-serif">Time on</text>
        <text x="320" y="263" textAnchor="middle" fill={warmGray} fontSize="10" fontFamily="DM Sans, sans-serif">real buyers</text>

        <rect x="385" y="125" width="60" height="42" fill="rgba(200,168,85,0.75)" stroke={gold} strokeWidth="1"/>
        <text x="415" y="115" textAnchor="middle" fill={gold} fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="700">+28%</text>
        <text x="415" y="250" textAnchor="middle" fill={warmGray} fontSize="10" fontFamily="DM Sans, sans-serif">Close rate</text>

        <rect x="480" y="167" width="28" height="28" fill="rgba(160,70,50,0.6)" stroke="rgba(160,70,50,0.8)" strokeWidth="1"/>
        <text x="494" y="212" textAnchor="middle" fill="#A04632" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="700">-22%</text>
        <text x="494" y="250" textAnchor="middle" fill={warmGray} fontSize="10" fontFamily="DM Sans, sans-serif">CAC</text>
      </svg>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", marginTop: 20, letterSpacing: 0.5, fontStyle: "italic" }}>Based on three B2B teams I've watched make this switch. Less volume. More real work. Better numbers.</p>
    </div>
  );
}

function BlogVisualMondayMoves() {
  return (
    <div style={{ margin: "32px 0", padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>Three Moves. One Morning.</p>
      <svg viewBox="0 0 520 230" style={{ width: "100%", maxWidth: 520, display: "block", margin: "0 auto" }}>
        <rect x="40" y="20" width="440" height="56" rx="2" fill={cream} stroke="rgba(200,168,85,0.2)" strokeWidth="1"/>
        <circle cx="68" cy="48" r="11" fill={gold}/>
        <text x="68" y="52" textAnchor="middle" fill={cream} fontSize="12" fontFamily="DM Sans, sans-serif" fontWeight="700">1</text>
        <text x="92" y="42" fill={espresso} fontSize="12" fontFamily="DM Sans, sans-serif" fontWeight="700">Pull 90 days of closed lost reasons</text>
        <text x="92" y="60" fill={warmGray} fontSize="10.5" fontFamily="DM Sans, sans-serif">If over 30% are "never qualified," you have a definition problem, not a sales problem.</text>

        <rect x="40" y="86" width="440" height="56" rx="2" fill={cream} stroke="rgba(200,168,85,0.2)" strokeWidth="1"/>
        <circle cx="68" cy="114" r="11" fill={gold}/>
        <text x="68" y="118" textAnchor="middle" fill={cream} fontSize="12" fontFamily="DM Sans, sans-serif" fontWeight="700">2</text>
        <text x="92" y="108" fill={espresso} fontSize="12" fontFamily="DM Sans, sans-serif" fontWeight="700">Book 20 minutes with your top AE</text>
        <text x="92" y="126" fill={warmGray} fontSize="10.5" fontFamily="DM Sans, sans-serif">Ask one question. "If I could fix one thing about your leads, what would it be?" Then shut up.</text>

        <rect x="40" y="152" width="440" height="56" rx="2" fill={cream} stroke="rgba(200,168,85,0.2)" strokeWidth="1"/>
        <circle cx="68" cy="180" r="11" fill={gold}/>
        <text x="68" y="184" textAnchor="middle" fill={cream} fontSize="12" fontFamily="DM Sans, sans-serif" fontWeight="700">3</text>
        <text x="92" y="174" fill={espresso} fontSize="12" fontFamily="DM Sans, sans-serif" fontWeight="700">Kill the MQL number in your next weekly report</text>
        <text x="92" y="192" fill={warmGray} fontSize="10.5" fontFamily="DM Sans, sans-serif">Replace it with "pipeline accepted by sales this week." Watch the room go very quiet.</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BLOG VISUALS — CDI FRANCE POST
   ═══════════════════════════════════════════ */

function BlogVisualExperienceStack() {
  const items = [
    { years: "2019 to 2021", role: "Sales & Marketing, Toyota Dealership, India", desc: "CRM, customer engagement, sales funnels, dealership data. The fundamentals.", duration: "2 yrs", note: "experience", highlight: false },
    { years: "2021 to 2022", role: "Performance Marketing, Writes India Agency", desc: "Multi-client campaigns across US, UK, Australia. €100K+ monthly ad budgets.", duration: "1.5 yrs", note: "experience", highlight: false },
    { years: "2022 to 2023", role: "M.Sc. Digital Marketing, Neoma Business School", desc: "The credential and the visa pathway. Not where the marketing skills came from.", duration: "1 yr", note: "study", highlight: true },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>What I Walked In With</p>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {items.map((it, i) => (
          <div key={i} style={{ padding: "18px 22px", background: it.highlight ? "rgba(200,168,85,0.08)" : paperWhite, border: `${it.highlight ? "1.5" : "1"}px solid ${it.highlight ? gold : "rgba(200,168,85,0.2)"}`, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 1.5, color: gold, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{it.years}</p>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: espresso, fontWeight: 600, marginBottom: 3 }}>{it.role}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: warmGray, lineHeight: 1.5 }}>{it.desc}</p>
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: gold, fontWeight: 700, whiteSpace: "nowrap", textAlign: "right" }}>
              {it.duration}
              <small style={{ fontSize: 10, color: lightGray, display: "block", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>{it.note}</small>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 18, padding: "18px 22px", background: espresso, textAlign: "center" }}>
          <p style={{ margin: 0, color: cream, fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Total experience before my French internship</p>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: gold, fontWeight: 700, display: "block", marginTop: 4 }}>3.5 years</span>
        </div>
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", marginTop: 18, fontStyle: "italic" }}>A typical French intern is 22 and has done two short internships. I started my internship at 26 with multi-country agency experience. The conversation was always going to be different.</p>
    </div>
  );
}

function BlogVisualPayJump() {
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>Internship to CDI · The Pay Jump</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, maxWidth: 520, margin: "0 auto", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 140, padding: "24px 18px", textAlign: "center", background: "rgba(180,80,60,0.04)", border: "1px solid rgba(180,80,60,0.2)" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: lightGray, fontWeight: 600, marginBottom: 8 }}>Internship</p>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: espresso, lineHeight: 1, marginBottom: 6 }}>€1,000</p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray }}>per month</p>
        </div>
        <div style={{ fontSize: 24, color: gold, fontWeight: 700 }}>→</div>
        <div style={{ flex: 1, minWidth: 140, padding: "24px 18px", textAlign: "center", background: "rgba(200,168,85,0.08)", border: `1px solid ${gold}` }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 8 }}>CDI Offer</p>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: gold, lineHeight: 1, marginBottom: 6 }}>€2,700+</p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray }}>per month gross</p>
        </div>
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", marginTop: 18, fontStyle: "italic" }}>The CDI threshold for non-EU is at least 1.5× SMIC. The math forces companies to either commit fully or not at all. There's no "junior salary" loophole for your status.</p>
    </div>
  );
}

function BlogVisualSalaryFloor() {
  const rows = [
    { label: "SMIC 2026 (gross, monthly, 35-hr week)", value: "€1,823" },
    { label: "Multiplier for student-to-salarié change of status", value: "1.5×" },
    { label: "Minimum monthly gross salary required", value: "€2,702" },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>Salary Floor · 2026 Figures</p>
      <div style={{ padding: 24, background: paperWhite, border: "1px solid rgba(200,168,85,0.2)", maxWidth: 520, margin: "0 auto" }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(200,168,85,0.1)" }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: warmGray }}>{r.label}</span>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: espresso, fontWeight: 600 }}>{r.value}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 18, marginTop: 6, borderTop: `2px solid ${gold}` }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: espresso, fontWeight: 700 }}>Annual gross floor</span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: gold, fontWeight: 600 }}>~€32,400</span>
        </div>
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", marginTop: 18, fontStyle: "italic" }}>2026 figures, valid from 1 January. SMIC adjusts every January. Confirm before any salary conversation. A €25K offer is fine for a French citizen and a problem for you.</p>
    </div>
  );
}

function BlogVisualRealUnlock() {
  const cards = [
    { num: "01", title: "Prior experience that mattered", desc: "3.5 years of running real campaigns, not coursework. They didn't have to train me, I was already trained." },
    { num: "02", title: "Operating at full-time level immediately", desc: "From week one I was solving problems, not asking what to do next. The output gap between me and a regular intern was visible." },
    { num: "03", title: "Direct conversation, no waiting", desc: "I asked about the CDI in the open. No dramatic moment, no last-month panic. Just a normal 'are we doing this?' between adults." },
    { num: "04", title: "A company that could actually sponsor", desc: "They had hired internationally before. The HR knew the process. Half the battle is picking a company that has done it." },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>The Real Unlock</p>
      <div className="grid-competitor" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 600, margin: "0 auto" }}>
        {cards.map((c) => (
          <div key={c.num} style={{ padding: "20px 18px", background: paperWhite, border: "1px solid rgba(200,168,85,0.18)" }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: gold, fontWeight: 700, lineHeight: 1, marginBottom: 8 }}>{c.num}</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: espresso, fontWeight: 600, marginBottom: 6 }}>{c.title}</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: warmGray, lineHeight: 1.5 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogVisualFearReality() {
  const rust = "#A04632";
  const rows = [
    { fear: '"My visa will expire and I\'ll have to leave"', reality: "Apply on time and you stay legally. You work under a", strong: "récépissé", trailing: " while the decision is pending." },
    { fear: '"No French company will sponsor me"', reality: "Most won't. The ", strong: "10 to 15%", trailing: " that will, will. Filter faster, don't convince harder." },
    { fear: '"My French isn\'t good enough"', reality: "For most marketing, tech and B2B roles, English-working environments exist. ", strong: "B1 to B2 French", trailing: " is enough to start." },
    { fear: '"The salary threshold is impossible at junior level"', reality: "Tight but doable. Push openly for ", strong: "€30K+", trailing: ". Companies that won't move on it weren't going to sponsor anyway." },
    { fear: '"I have no leverage as an intern"', reality: "You have ", strong: "all the leverage", trailing: " if you operate at full-time level from day one." },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "32px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>Fear vs Reality</p>
      <div style={{ maxWidth: 620, margin: "0 auto", display: "grid", gap: 12 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 16, alignItems: "center", padding: "16px 18px", background: paperWhite, border: "1px solid rgba(200,168,85,0.15)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(180,80,60,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1.5px solid rgba(180,80,60,0.3)" }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: rust, fontWeight: 700, fontStyle: "italic" }}>?</span>
            </div>
            <div style={{ display: "grid", gap: 4 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: rust, fontWeight: 600, lineHeight: 1.4, fontStyle: "italic" }}>{r.fear}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: espresso, fontWeight: 500, lineHeight: 1.5 }}>
                {r.reality}<strong style={{ color: gold, fontWeight: 700 }}>{r.strong}</strong>{r.trailing}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", marginTop: 18, fontStyle: "italic" }}>The system is stressful but not arbitrary. People navigate it every year. You will too.</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BLOG VISUALS — SOLO PAID MEDIA POST
   ═══════════════════════════════════════════ */

function BlogVisualChannelGrid() {
  const channels = [
    { name: "Google Ads", spend: "€1.2M", note: "Search, PMax, demand gen. The workhorse." },
    { name: "Meta Ads", spend: "€420K", note: "Advantage+ + retargeting. Mid-funnel." },
    { name: "Pinterest", spend: "€180K", note: "Discovery. The patient channel." },
    { name: "Bing Ads", spend: "€90K", note: "Cheap incremental search demand." },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>— What sits on my plate —</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {channels.map((c, i) => (
          <div key={i} style={{ border: "1px solid rgba(200,168,85,0.2)", padding: "18px 20px", background: cream }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: espresso }}>{c.name}</span>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: gold }}>{c.spend}</span>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: warmGray, lineHeight: 1.5, margin: 0 }}>{c.note}</p>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", marginTop: 22, marginBottom: 0, fontStyle: "italic" }}>€1.89M annual spend. One operator. Four platforms.</p>
    </div>
  );
}

function BlogVisualWeeklyRhythm() {
  const days = [
    { day: "MON", width: 90, dark: false, label: "45 MIN", desc: "Damage check · pacing, search terms, pauses" },
    { day: "TUE", width: 220, dark: true, label: "2 HR DEEP WORK", desc: "Build · new campaigns, creative briefs" },
    { day: "WED", width: 220, dark: true, label: "2 HR DEEP WORK", desc: "Test · audiences, bids, landing pages" },
    { day: "THU", width: 130, dark: false, label: "90 MIN", desc: "Report · commentary on the dashboard" },
    { day: "FRI", width: 130, dark: false, label: "90 MIN", desc: "Hygiene · UTMs, naming, structure" },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 28, fontWeight: 600, textAlign: "center" }}>— The shape of my week —</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {days.map((d, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 16, alignItems: "center" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, color: espresso, letterSpacing: 0.5 }}>{d.day}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ height: 22, background: d.dark ? espresso : gold, width: d.width, maxWidth: "60%", display: "flex", alignItems: "center", paddingLeft: 10, boxSizing: "border-box" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: d.dark ? gold : cream, fontWeight: 700, letterSpacing: 0.5 }}>{d.label}</span>
              </div>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: espresso, lineHeight: 1.4 }}>{d.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", marginTop: 28, marginBottom: 0, fontStyle: "italic" }}>Total active hours per week: about 8. Plus dashboard time which I don't count because the dashboard works on its own.</p>
    </div>
  );
}

function BlogVisualStackLayers() {
  const layers = [
    { label: "LAYER 1", title: "Platforms", desc: "Google Ads Editor, Meta Ads Manager, Pinterest, Bing", cost: "€0", dark: false },
    { label: "LAYER 2", title: "Tracking", desc: "GA4, GTM, Search Console, UTM convention I wrote myself", cost: "€0", dark: false },
    { label: "LAYER 3", title: "Reporting", desc: "Dashboard I built · HTML, Supabase, Python ETL, Vercel", cost: "€12/mo", dark: true },
    { label: "LAYER 4", title: "AI helpers", desc: "Claude for analysis, briefs, scripts · ChatGPT for second opinions", cost: "€20/mo", dark: false },
    { label: "LAYER 5", title: "Spreadsheet", desc: "One sheet, three tabs. Budget allocation, audit, search term log.", cost: "€0", dark: false },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 28, fontWeight: 600, textAlign: "center" }}>— The actual stack —</p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {layers.map((l, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr 90px", gap: 12, alignItems: "center", padding: "16px 20px", background: l.dark ? espresso : cream, color: l.dark ? cream : espresso, border: l.dark ? `1px solid ${espresso}` : "1px solid rgba(200,168,85,0.2)", borderTop: i === 0 ? (l.dark ? `1px solid ${espresso}` : "1px solid rgba(200,168,85,0.2)") : 0 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: gold, fontWeight: 700 }}>{l.label}</span>
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: l.dark ? cream : espresso }}>{l.title}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: l.dark ? "rgba(252,249,244,0.7)" : warmGray, marginTop: 2, lineHeight: 1.5 }}>{l.desc}</div>
            </div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: l.dark ? gold : espresso, textAlign: "right" }}>{l.cost}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid rgba(200,168,85,0.2)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: warmGray, fontWeight: 600 }}>Monthly tooling cost</span>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: gold }}>€32</span>
      </div>
    </div>
  );
}

function BlogVisualDeathOfReports() {
  const rust = "#A04632";
  return (
    <div style={{ margin: "32px 0", padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 28, fontWeight: 600, textAlign: "center" }}>— Where my Thursdays went —</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 50px 1fr", gap: 0, alignItems: "center" }}>
        <div style={{ textAlign: "center", padding: "24px 16px", border: `1px solid rgba(160,70,50,0.3)`, background: "rgba(160,70,50,0.05)" }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: rust, fontWeight: 700, marginBottom: 10 }}>BEFORE</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 700, color: rust, lineHeight: 1 }}>4 hrs</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: warmGray, marginTop: 8, lineHeight: 1.5 }}>CSV exports, pivots, slides, formatting. Every week.</div>
        </div>
        <div style={{ textAlign: "center", fontSize: 20, color: gold }}>→</div>
        <div style={{ textAlign: "center", padding: "24px 16px", border: `1px solid rgba(200,168,85,0.4)`, background: "rgba(200,168,85,0.08)" }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: gold, fontWeight: 700, marginBottom: 10 }}>AFTER</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 700, color: gold, lineHeight: 1 }}>90 min</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: warmGray, marginTop: 8, lineHeight: 1.5 }}>Open dashboard. Write commentary. Done.</div>
        </div>
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", marginTop: 22, marginBottom: 0, fontStyle: "italic" }}>130 hours of Thursdays returned to me per year. That's three working weeks.</p>
    </div>
  );
}

function BlogVisualSoloVsAgency() {
  const rust = "#A04632";
  const sides = [
    { title: "Solo in-house", wins: "Speed. Context. Cost. No deck theater.", risks: "Bus factor of one. Burnout. No external benchmark." },
    { title: "Agency", wins: "Scale. Specialist depth. Continuity. Cover.", risks: "Handoff lag. Cost. Context drift. Junior swaps." },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, marginBottom: 28, fontWeight: 600, textAlign: "center" }}>— Trade-offs, honestly —</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        {sides.map((s, i) => (
          <div key={i} style={{ border: "1px solid rgba(200,168,85,0.25)", padding: "22px 20px", background: cream }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: espresso, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid rgba(200,168,85,0.25)" }}>{s.title}</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: gold, fontWeight: 700, marginBottom: 4 }}>WINS</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: espresso, lineHeight: 1.6 }}>{s.wins}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: rust, fontWeight: 700, marginBottom: 4 }}>RISKS</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: espresso, lineHeight: 1.6 }}>{s.risks}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BLOG VISUALS — CRM ATTRIBUTION POST (INTERACTIVE)
   ═══════════════════════════════════════════ */

function BlogVisualCrmQuiz() {
  const [selected, setSelected] = useState(null);
  const options = [
    { label: "A.", text: "The top campaign. Lower CPL wins.", ok: false, explain: "Lower CPL doesn't mean lower CPA. The campaign with cheaper leads might be filling your funnel with people who never buy. This is the most common mistake in paid media." },
    { label: "B.", text: "Split it. Hedge your bets.", ok: false, explain: "Hedging without data is just slow-bleeding budget. You can't split intelligently if you don't know which side actually wins." },
    { label: "C.", text: "I can't answer this without CRM data.", ok: true, explain: "Right answer. Without CRM data, lead numbers are vanity. The campaign with fewer leads might be the one closing deals — and you'd never know." },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "28px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.18)", borderLeft: `3px solid ${gold}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 700 }}>QUICK GUT CHECK</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, fontStyle: "italic" }}>no wrong answers, only revealing ones</div>
      </div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, lineHeight: 1.3, color: espresso, fontWeight: 600, marginBottom: 20 }}>
        Your top campaign brings 200 leads at €30 CPL. Your bottom one brings 40 leads at €120 CPL. Which one are you funding next quarter?
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isOk = opt.ok;
          return (
            <button key={i} onClick={() => setSelected(i)} style={{
              textAlign: "left", padding: "14px 18px",
              background: selected === null ? cream : (isSelected ? (isOk ? "rgba(200,168,85,0.12)" : "rgba(160,70,50,0.06)") : cream),
              border: `1px solid ${selected === null ? "rgba(200,168,85,0.25)" : (isSelected ? (isOk ? gold : "rgba(160,70,50,0.4)") : "rgba(200,168,85,0.25)")}`,
              fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: espresso, cursor: "pointer",
              opacity: selected !== null && !isSelected ? 0.55 : 1, transition: "all 0.2s"
            }}>
              <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color: gold, marginRight: 10 }}>{opt.label}</span>{opt.text}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div style={{ marginTop: 18, padding: "16px 18px", background: options[selected].ok ? "rgba(200,168,85,0.08)" : "rgba(160,70,50,0.05)", border: `1px solid ${options[selected].ok ? gold : "rgba(160,70,50,0.4)"}`, fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.6, color: espresso }}>
          <strong style={{ fontWeight: 700, color: options[selected].ok ? gold : "#A04632" }}>{options[selected].ok ? "Correct. " : "Common trap. "}</strong>
          {options[selected].explain}
        </div>
      )}
    </div>
  );
}

function BlogVisualCrmConvertSlider() {
  const [pct, setPct] = useState(15);
  const rust = "#A04632";
  const aMult = Math.max(0.4, 1 - (pct - 15) * 0.04);
  const bMult = Math.min(1.8, 1 + (pct - 15) * 0.04);
  const a = Math.round(200 * (pct / 100) * aMult);
  const b = Math.round(40 * (pct / 100) * bMult * 4.5);
  const bWins = b > a;
  const reveal = bWins
    ? <>The "worst" campaign brings <strong style={{ fontWeight: 700, color: gold }}>{b} bookings</strong> vs <strong style={{ fontWeight: 700, color: rust }}>{a}</strong> from the "winner." The platform never told you.</>
    : (b === a)
      ? <>Identical bookings. But B did it with <strong style={{ fontWeight: 700 }}>5x fewer leads</strong>. Cheaper sales cycle.</>
      : <>At {pct}%, A still wins on volume — but only because conversion is low everywhere. Better targeting flips this fast.</>;
  return (
    <div style={{ margin: "32px 0", padding: "28px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.18)" }}>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>— Drag the slider · watch the "winner" flip —</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: warmGray }}>Lead → booking rate</span>
        <input type="range" min="2" max="40" value={pct} step="1" onChange={(e) => setPct(parseInt(e.target.value))} style={{ flex: 1, minWidth: 180, accentColor: gold }} />
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: gold, minWidth: 60, textAlign: "right" }}>{pct}%</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ padding: 18, background: bWins ? cream : "rgba(200,168,85,0.08)", border: `1px solid ${bWins ? "rgba(200,168,85,0.2)" : "rgba(200,168,85,0.4)"}`, transition: "all 0.3s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: lightGray, fontWeight: 700 }}>CAMPAIGN A</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", padding: "3px 8px", background: bWins ? rust : gold, color: cream, fontWeight: 700 }}>{bWins ? "OVERSPENT" : "TRUE WINNER"}</div>
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: espresso }}>200 leads</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: warmGray, margin: "6px 0 12px" }}>CPL €30 · spend €6,000</div>
          <div style={{ height: 1, background: "rgba(200,168,85,0.25)", margin: "10px 0" }} />
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: warmGray, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600 }}>Actual bookings</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: bWins ? rust : gold, marginTop: 4, transition: "color 0.3s" }}>{a}</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: warmGray, marginTop: 4, fontStyle: "italic" }}>€{(a * 4).toLocaleString()}K revenue</div>
        </div>
        <div style={{ padding: 18, background: bWins ? "rgba(200,168,85,0.08)" : cream, border: `1px solid ${bWins ? "rgba(200,168,85,0.4)" : "rgba(200,168,85,0.2)"}`, transition: "all 0.3s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: lightGray, fontWeight: 700 }}>CAMPAIGN B</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", padding: "3px 8px", background: bWins ? gold : lightGray, color: cream, fontWeight: 700 }}>{bWins ? "TRUE WINNER" : "\"WORST\""}</div>
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: espresso }}>40 leads</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: warmGray, margin: "6px 0 12px" }}>CPL €120 · spend €4,800</div>
          <div style={{ height: 1, background: "rgba(200,168,85,0.25)", margin: "10px 0" }} />
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: warmGray, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600 }}>Actual bookings</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: bWins ? gold : espresso, marginTop: 4, transition: "color 0.3s" }}>{b}</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: warmGray, marginTop: 4, fontStyle: "italic" }}>€{(b * 4).toLocaleString()}K revenue</div>
        </div>
      </div>
      <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(44,36,23,0.04)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, lineHeight: 1.6, color: espresso, textAlign: "center", fontStyle: "italic" }}>
        {reveal}
      </div>
    </div>
  );
}

function BlogVisualCrmZoomStack() {
  const [picked, setPicked] = useState(null);
  const rows = [
    { name: "Account", desc: "€87K spend · 1,718 keywords", tag: "FOG", gold: false, detail: <><strong style={{ fontWeight: 700 }}>Account view.</strong> Everything looks fine. CPL acceptable. Spend on target. This is what most monthly reports show. It tells you nothing about what to change.</> },
    { name: "Campaign", desc: "\"France Tours\" · CPL acceptable", tag: "FOG", gold: false, detail: <><strong style={{ fontWeight: 700 }}>Campaign view.</strong> Still hiding the truth. One ad group inside this campaign is carrying everything. The others are leaking budget. The average makes it invisible.</> },
    { name: "Ad Group", desc: "\"Provence Villas\" → 18 of 31 bookings", tag: "TRUTH", gold: true, detail: <><strong style={{ fontWeight: 700, color: gold }}>Ad group view. Now we see it.</strong> "Provence Villas" alone drove 18 of 31 bookings. The other 12 ad groups produced almost nothing.</> },
    { name: "Keyword", desc: "\"luxury provence villa\" → 9 of those 18", tag: "GOLD", gold: false, detail: <><strong style={{ fontWeight: 700 }}>Keyword view.</strong> Half of those 18 bookings came from a single search phrase. This is where you can finally make sharp budget decisions.</> },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "28px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.18)" }}>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>— Click each layer · zoom in on the truth —</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((row, i) => (
          <button key={i} onClick={() => setPicked(i)} style={{
            display: "grid", gridTemplateColumns: "90px 1fr 60px", gap: 14, alignItems: "center",
            padding: "14px 18px",
            background: row.gold ? "rgba(200,168,85,0.08)" : cream,
            border: `1px solid ${row.gold ? "rgba(200,168,85,0.4)" : "rgba(200,168,85,0.25)"}`,
            cursor: "pointer", textAlign: "left", fontFamily: "inherit",
            transform: picked === i ? "translateX(8px)" : "translateX(0)",
            transition: "all 0.25s"
          }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: row.gold ? gold : espresso }}>{row.name}</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: row.gold ? espresso : warmGray, fontWeight: row.gold ? 500 : 400 }}>{row.desc}</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: row.gold ? gold : lightGray, fontWeight: 700, textAlign: "right" }}>{row.tag}</span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 18, padding: "16px 18px", background: "rgba(44,36,23,0.04)", fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.6, color: espresso, minHeight: 60 }}>
        {picked === null ? <><strong style={{ fontWeight: 700 }}>Pick a layer above.</strong> The deeper you zoom, the clearer the money path becomes.</> : rows[picked].detail}
      </div>
    </div>
  );
}

function BlogVisualCrmCalculator() {
  const [spend, setSpend] = useState(50000);
  const [groups, setGroups] = useState(15);
  const [winners, setWinners] = useState(20);
  const rust = "#A04632";
  const waste = Math.round(spend * (1 - winners / 100));
  const annual = waste * 12;
  return (
    <div style={{ margin: "32px 0", padding: "28px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.18)" }}>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>— The waste calculator —</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: espresso, fontWeight: 600 }}>Monthly ad spend</label>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: gold }}>€{(spend / 1000).toFixed(0)}K</span>
          </div>
          <input type="range" min="5000" max="200000" value={spend} step="5000" onChange={(e) => setSpend(parseInt(e.target.value))} style={{ width: "100%", accentColor: gold }} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: espresso, fontWeight: 600 }}>Ad groups in account</label>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: gold }}>{groups}</span>
          </div>
          <input type="range" min="5" max="50" value={groups} step="1" onChange={(e) => setGroups(parseInt(e.target.value))} style={{ width: "100%", accentColor: gold }} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: espresso, fontWeight: 600 }}>% of ad groups actually closing deals</label>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: gold }}>{winners}%</span>
          </div>
          <input type="range" min="10" max="60" value={winners} step="5" onChange={(e) => setWinners(parseInt(e.target.value))} style={{ width: "100%", accentColor: gold }} />
        </div>
      </div>
      <div style={{ marginTop: 28, padding: "22px 20px", background: "rgba(160,70,50,0.06)", border: `1px solid rgba(160,70,50,0.25)`, textAlign: "center" }}>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: rust, fontWeight: 700, marginBottom: 8 }}>PROBABLE MONTHLY WASTE</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 48, fontWeight: 700, color: rust, lineHeight: 1 }}>€{waste.toLocaleString()}</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: warmGray, marginTop: 10, lineHeight: 1.5 }}>
          That's €{(annual / 1000).toFixed(0)}K a year flowing to ad groups that don't close.
        </div>
      </div>
    </div>
  );
}

function BlogVisualCrmPlumbing() {
  const [tipIdx, setTipIdx] = useState(null);
  const steps = [
    { n: "1", title: "UTM out", short: "Tag every ad with 5 params", tip: "Every ad, every channel, every variant. utm_source, utm_medium, utm_campaign, utm_term, utm_content. Inconsistency here breaks everything downstream." },
    { n: "2", title: "CRM capture", short: "Form pushes params to lead", tip: "Hidden form fields capture UTM params from the URL on submit. HubSpot, Pipedrive, Airtable all do this natively. The form is where ad data becomes lead data." },
    { n: "3", title: "Python match", short: "Fuzzy-join bookings + spend", tip: "pandas + fuzzywuzzy. ~80 lines of Python. Joins CRM bookings to ad spend rows even when names don't match exactly. Runs at midnight via cron." },
    { n: "4", title: "Dashboard read", short: "Revenue per ad group", tip: "The output is one view: revenue per ad group, not leads per campaign. The first time you see it, you'll spot 60% of your account bleeding silently." },
  ];
  return (
    <div style={{ margin: "32px 0", padding: "28px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.18)" }}>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>— The plumbing —</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {steps.map((s, i) => (
          <div key={i}
            onMouseEnter={() => setTipIdx(i)}
            onMouseLeave={() => setTipIdx(null)}
            onClick={() => setTipIdx(tipIdx === i ? null : i)}
            style={{
              textAlign: "center", padding: "18px 12px",
              background: i === 3 ? "rgba(200,168,85,0.1)" : cream,
              border: `1px solid ${i === 3 ? "rgba(200,168,85,0.4)" : "rgba(200,168,85,0.25)"}`,
              cursor: "help", transition: "all 0.25s",
              transform: tipIdx === i ? "translateY(-4px)" : "translateY(0)"
            }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: gold, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, color: espresso, fontWeight: 700, margin: "10px 0 6px" }}>{s.title}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: warmGray, lineHeight: 1.5 }}>{s.short}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(44,36,23,0.04)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, lineHeight: 1.6, minHeight: 50, color: tipIdx === null ? warmGray : espresso, fontStyle: tipIdx === null ? "italic" : "normal" }}>
        {tipIdx === null ? "Hover any step above to see how it works." : steps[tipIdx].tip}
      </div>
      <div style={{ marginTop: 16, textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: lightGray, fontStyle: "italic" }}>Total cost: €12/month. Total impact: every budget decision becomes correct.</div>
    </div>
  );
}

function BlogVisualCrmResults() {
  const [ref, vis] = useInView(0.3);
  const [vals, setVals] = useState({ waste: 0, kw: 0, roas: 0 });
  useEffect(() => {
    if (!vis) return;
    const start = performance.now();
    const duration = 1400;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVals({
        waste: Math.round(41000 * eased),
        kw: Math.round(723 * eased),
        roas: parseFloat((6.6 * eased).toFixed(1))
      });
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [vis]);
  const stats = [
    { num: `€${Math.round(vals.waste / 1000)}K`, label: "Wasted on zero-conversion search terms" },
    { num: vals.kw.toLocaleString(), label: "Dead keywords paused" },
    { num: `${vals.roas}x`, label: "Real ROAS · €577K from €87K" },
  ];
  return (
    <div ref={ref} style={{ margin: "32px 0", padding: "28px 24px", background: paperWhite, border: "1px solid rgba(200,168,85,0.18)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: "22px 14px", background: cream, border: "1px solid rgba(200,168,85,0.2)" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 700, color: gold, lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: warmGray, fontWeight: 600, marginTop: 10, lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: lightGray, textAlign: "center", margin: "20px 0 0", fontStyle: "italic" }}>None of this was visible at the campaign level.</p>
    </div>
  );
}

const blogVisuals = {
  audit: <BlogVisualAudit />,
  competitor: <BlogVisualCompetitor />,
  aiTime: <BlogVisualAITime />,
  aiVsHuman: <BlogVisualAIvsHuman />,
  seoVsGeo: <BlogVisualSeoVsGeo />,
  ragPipeline: <BlogVisualRagPipeline />,
  geoStats: <BlogVisualGeoStats />,
  geoChecklist: <BlogVisualGeoChecklist />,
  architectLoops: <BlogVisualArchitectLoops />,
  decisionStack: <BlogVisualDecisionStack />,
  specLadder: <BlogVisualSpecLadder />,
  buildProcess: <BlogVisualBuildProcess />,
  leadsStats: <BlogVisualLeadsStats />,
  funnelShift: <BlogVisualFunnelShift />,
  aeTimePie: <BlogVisualAETimePie />,
  mqlGap: <BlogVisualMqlGap />,
  ninetyDayImpact: <BlogVisualNinetyDayImpact />,
  mondayMoves: <BlogVisualMondayMoves />,
  experienceStack: <BlogVisualExperienceStack />,
  payJump: <BlogVisualPayJump />,
  salaryFloor: <BlogVisualSalaryFloor />,
  realUnlock: <BlogVisualRealUnlock />,
  fearReality: <BlogVisualFearReality />,
  channelGrid: <BlogVisualChannelGrid />,
  weeklyRhythm: <BlogVisualWeeklyRhythm />,
  stackLayers: <BlogVisualStackLayers />,
  deathOfReports: <BlogVisualDeathOfReports />,
  soloVsAgency: <BlogVisualSoloVsAgency />,
  crmQuiz: <BlogVisualCrmQuiz />,
  crmConvertSlider: <BlogVisualCrmConvertSlider />,
  crmZoomStack: <BlogVisualCrmZoomStack />,
  crmCalculator: <BlogVisualCrmCalculator />,
  crmPlumbing: <BlogVisualCrmPlumbing />,
  crmResults: <BlogVisualCrmResults />,
};

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
function Navbar({ active, onOpenForm }) {
  const [sc, setSc] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { const h = () => setSc(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  // When we land on "/" with a pending section (set from another page), scroll to it.
  useEffect(() => {
    if (location.pathname === "/") {
      const pending = sessionStorage.getItem("scrollTarget");
      if (pending) {
        sessionStorage.removeItem("scrollTarget");
        // Wait for sections to render, then scroll
        setTimeout(() => {
          const el = document.getElementById(pending);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      } else if (location.hash) {
        const id = location.hash.replace("#", "");
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    }
  }, [location]);

  const sectionIds = ["about","work","skills","journey","contact"];

  const handleClick = (e, label) => {
    const lower = label.toLowerCase();
    // Route links (separate pages) — let React Router handle
    if (label === "Growth") { e.preventDefault(); navigate("/growth-marketing"); window.scrollTo({top:0,behavior:"instant"}); return; }
    if (label === "Dashboards") { e.preventDefault(); navigate("/dashboard-studio"); window.scrollTo({top:0,behavior:"instant"}); return; }
    if (label === "Blog") { e.preventDefault(); navigate("/blog"); window.scrollTo({top:0,behavior:"instant"}); return; }
    if (label === "Contact") { e.preventDefault(); onOpenForm(); return; }
    // Section links
    if (sectionIds.includes(lower)) {
      e.preventDefault();
      if (location.pathname === "/") {
        // Already home — just scroll
        const el = document.getElementById(lower);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // On another page — remember target, go home, then the effect above scrolls
        sessionStorage.setItem("scrollTarget", lower);
        navigate("/");
      }
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const links = ["About","Work","Skills","Journey","Blog","Growth","Dashboards","Contact"];
  const getHref = (l) => l === "Growth" ? "/growth-marketing" : l === "Dashboards" ? "/dashboard-studio" : l === "Blog" ? "/blog" : `/#${l.toLowerCase()}`;

  return <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: sc?"rgba(252,249,244,0.95)":"transparent", backdropFilter: sc?"blur(16px)":"none", borderBottom: sc?"1px solid rgba(200,168,85,0.12)":"none", transition: "all 0.4s", padding: sc?"10px 0":"18px 0" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <a href="/" onClick={handleLogoClick} style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: gold, textDecoration: "none", fontWeight: 700 }}>&#9670;</a>
      <div className="nav-links" style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        {links.map(l => <a key={l} href={getHref(l)} onClick={(e)=>handleClick(e,l)} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase", color: active===l.toLowerCase()?gold:warmGray, textDecoration: "none", fontWeight: 500, transition: "color 0.3s", borderBottom: active===l.toLowerCase()?`1.5px solid ${gold}`:"1.5px solid transparent", paddingBottom: 2 }}>{l}</a>)}
      </div>
    </div>
  </nav>;
}

/* HERO */
function Hero({ onOpenForm }) {
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
        <button onClick={onOpenForm} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", padding: "15px 38px", background: "transparent", color: espresso, border: `1.5px solid ${gold}`, fontWeight: 600, transition: "all 0.35s", cursor: "pointer" }} onMouseEnter={e=>{e.target.style.background=gold;e.target.style.color=espresso}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color=espresso}}>Get In Touch</button>
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
        <Reveal delay={0.25}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: warmGray, lineHeight: 1.85, marginTop: 18 }}>I hold an M.Sc. in Digital Expertise for Marketing from Neoma Business School. Before France, I worked at a digital marketing agency managing multi-client campaigns with €100K+ monthly budgets. Before that, I was at an authorised Toyota dealership where I built my foundation in sales, CRM, and customer engagement.</p><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: warmGray, lineHeight: 1.85, marginTop: 18 }}>Currently open to new opportunities where marketing, technology, and data intersect.</p><div style={{ marginTop: 28, padding: "18px 22px", borderLeft: `3px solid ${gold}`, background: cream }}><p style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: espresso, fontStyle: "italic", lineHeight: 1.65 }}>"The ability to translate between the language of data and the language of humans. That's the skill that changes careers."</p></div></Reveal>
      </div>
    </div>
  </div></section>;
}

/* HOW I WORK */
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
  // Hooks must run unconditionally — place before any early return
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  const cs = p.caseStudy; if (!cs) return null;
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
      {JOURNEY.map((j,i) => <Reveal key={j.year} delay={i*0.08}><div style={{ position: "relative", marginBottom: 40 }}><div style={{ position: "absolute", left: -40, top: 6, width: 15, height: 15, borderRadius: "50%", background: paperWhite, border: `2px solid ${gold}` }}/><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 4 }}>{j.year}</p><h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: espresso, fontWeight: 600, marginBottom: 4 }}>{j.title}</h3><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: lightGray, fontStyle: "italic", marginBottom: 8 }}>{j.place}</p><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: warmGray, lineHeight: 1.75 }}>{j.desc}</p></div></Reveal>)}
    </div>
  </div></section>;
}

/* BLOG — INDEX PAGE (EDITORIAL GRID) */

/* Category → cover treatment map. Each variant is a distinct editorial cover
   design so the grid feels like a magazine, not a stock-photo page. */
const COVER_VARIANTS = {
  "Career":        { bg: "#F5EFE3", accent: "#C8A855", ink: "#2C2417", kind: "stamp" },
  "Marketing Ops": { bg: "#2C2417", accent: "#C8A855", ink: "#FCF9F4", kind: "grid"  },
  "AI + Building": { bg: "#FCF9F4", accent: "#2C2417", ink: "#2C2417", kind: "rule"  },
  "Google Ads":    { bg: "#E8DFC9", accent: "#8B7355", ink: "#2C2417", kind: "frame" },
  "Strategy":      { bg: "#2C2417", accent: "#FCF9F4", ink: "#FCF9F4", kind: "serif" },
  "Marketing + AI":{ bg: "#FCF9F4", accent: "#C8A855", ink: "#2C2417", kind: "circle"},
  "AI Marketing":  { bg: "#F0E6CC", accent: "#2C2417", ink: "#2C2417", kind: "frame" },
};

function BlogCardCover({ post }) {
  const base = COVER_VARIANTS[post.tag] || COVER_VARIANTS["Career"];
  // Allow per-post override of the cover kind via post.coverKind
  const v = post.coverKind ? { ...base, kind: post.coverKind } : base;
  const num = String((BLOG_POSTS.findIndex(p => p.slug === post.slug) + 1)).padStart(2, "0");
  // Shortened title for visual emphasis - first 4-6 words
  const words = post.title.split(" ");
  const short = words.slice(0, Math.min(6, words.length)).join(" ");

  const baseLayer = {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    padding: 28,
    background: v.bg,
    color: v.ink,
  };

  // -- Variant: STAMP (Career) — big serif quote-mark with circular ink stamp
  if (v.kind === "stamp") {
    return (
      <div style={baseLayer}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: v.accent, fontWeight: 700 }}>№ {num}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: v.ink, opacity: 0.6, fontWeight: 600 }}>{post.tag}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: "auto" }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 120, lineHeight: 0.7, color: v.accent, fontWeight: 700, marginTop: -8 }}>“</span>
          <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 18, lineHeight: 1.3, color: v.ink, margin: "8px 0 0", fontWeight: 500 }}>{short}…</p>
        </div>
        <div style={{ position: "absolute", bottom: 22, right: 22, width: 56, height: 56, border: `1.5px solid ${v.accent}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: v.accent, fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, textAlign: "center", lineHeight: 1.1 }}>Read<br/>Now</div>
      </div>
    );
  }

  // -- Variant: GRID (Marketing Ops) — dark, technical grid pattern with mono numerals
  if (v.kind === "grid") {
    return (
      <div style={baseLayer}>
        <svg viewBox="0 0 200 250" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
          {[...Array(8)].map((_, i) => <line key={`h${i}`} x1="0" y1={i * 35} x2="200" y2={i * 35} stroke={v.accent} strokeWidth="0.4" />)}
          {[...Array(7)].map((_, i) => <line key={`v${i}`} x1={i * 33} y1="0" x2={i * 33} y2="250" stroke={v.accent} strokeWidth="0.4" />)}
        </svg>
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: v.accent, fontWeight: 700 }}>№ {num} / {post.tag}</span>
        </div>
        <div style={{ position: "relative", marginTop: "auto" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 64, lineHeight: 0.9, color: v.accent, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12 }}>{num}.</div>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, lineHeight: 1.25, color: v.ink, margin: 0, fontWeight: 600 }}>{short}</p>
          <div style={{ marginTop: 18, height: 1, background: v.accent, opacity: 0.4 }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, letterSpacing: 2, textTransform: "uppercase", color: v.ink, opacity: 0.7, fontWeight: 600, marginTop: 10 }}>{post.readTime}</p>
        </div>
      </div>
    );
  }

  // -- Variant: RULE (AI + Building) — horizontal ruled lines like a notebook page
  if (v.kind === "rule") {
    return (
      <div style={baseLayer}>
        {/* horizontal rules */}
        <div style={{ position: "absolute", inset: "28px 28px 28px 28px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 14, pointerEvents: "none" }}>
          {[...Array(8)].map((_, i) => <div key={i} style={{ height: 1, background: v.ink, opacity: 0.08 }} />)}
        </div>
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: v.accent, fontWeight: 700, opacity: 0.55 }}>№ {num}</span>
          <span style={{ display: "inline-block", padding: "4px 10px", border: `1px solid ${v.accent}`, fontFamily: "'DM Sans',sans-serif", fontSize: 9.5, letterSpacing: 2, textTransform: "uppercase", color: v.accent, fontWeight: 700 }}>{post.tag}</span>
        </div>
        <div style={{ position: "relative", marginTop: "auto" }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, lineHeight: 1.1, color: v.ink, margin: 0, fontWeight: 700, letterSpacing: "-0.01em" }}>{short}<span style={{ color: gold }}>.</span></p>
        </div>
      </div>
    );
  }

  // -- Variant: FRAME (Google Ads) — bordered frame with centered serif treatment
  if (v.kind === "frame") {
    return (
      <div style={baseLayer}>
        <div style={{ position: "absolute", inset: 18, border: `1px solid ${v.accent}`, opacity: 0.35, pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: v.accent, fontWeight: 700 }}>№ {num}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: v.ink, opacity: 0.6, fontWeight: 600 }}>{post.tag}</span>
        </div>
        <div style={{ position: "relative", textAlign: "center", margin: "auto 0" }}>
          <div style={{ display: "inline-block", padding: "0 18px", background: v.bg }}>
            <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 22, lineHeight: 1.2, color: v.ink, margin: 0, fontWeight: 600 }}>{short}</p>
          </div>
        </div>
        <div style={{ position: "relative", textAlign: "center" }}>
          <span style={{ display: "inline-block", width: 6, height: 6, background: v.accent, transform: "rotate(45deg)" }} />
        </div>
      </div>
    );
  }

  // -- Variant: SERIF (Strategy) — bold all-serif on dark
  if (v.kind === "serif") {
    return (
      <div style={baseLayer}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 700 }}>№ {num}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: v.ink, opacity: 0.5, fontWeight: 600 }}>{post.tag}</span>
        </div>
        <div style={{ marginTop: "auto" }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, lineHeight: 1.0, color: v.ink, margin: 0, fontWeight: 700, letterSpacing: "-0.02em" }}>{short}<span style={{ color: gold }}>.</span></p>
          <div style={{ marginTop: 16, width: 40, height: 2, background: gold }} />
        </div>
      </div>
    );
  }

  // -- Variant: CIRCLE (Marketing + AI) — large outline circle behind text
  if (v.kind === "circle") {
    return (
      <div style={baseLayer}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", border: `1px solid ${v.accent}`, opacity: 0.35, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", border: `1px solid ${v.accent}`, opacity: 0.25, pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: v.accent, fontWeight: 700 }}>№ {num}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: v.ink, opacity: 0.6, fontWeight: 600 }}>{post.tag}</span>
        </div>
        <div style={{ position: "relative", marginTop: "auto" }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, lineHeight: 1.15, color: v.ink, margin: 0, fontWeight: 700, letterSpacing: "-0.01em" }}>{short}</p>
          <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-block", width: 24, height: 1, background: v.accent }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: v.accent, fontWeight: 700 }}>{post.readTime}</span>
          </div>
        </div>
      </div>
    );
  }

  // -- Variant: CHART (data + connection) — small ascending data viz with connecting line
  if (v.kind === "chart") {
    const dark = v.bg === "#2C2417";
    const lineColor = dark ? v.accent : v.accent;
    const dotColor = dark ? v.accent : v.accent;
    const fadedInk = dark ? "rgba(252,249,244,0.5)" : "rgba(44,36,23,0.5)";
    return (
      <div style={baseLayer}>
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: v.accent, fontWeight: 700 }}>№ {num}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: v.ink, opacity: 0.6, fontWeight: 600 }}>{post.tag}</span>
        </div>

        {/* Data viz in the middle */}
        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", margin: "16px 0" }}>
          <svg viewBox="0 0 240 140" style={{ width: "100%", maxWidth: 240, height: "auto" }} preserveAspectRatio="xMidYMid meet">
            {/* dotted baseline grid */}
            <line x1="0" y1="120" x2="240" y2="120" stroke={fadedInk} strokeWidth="0.5" strokeDasharray="2,3" />
            <line x1="0" y1="80" x2="240" y2="80" stroke={fadedInk} strokeWidth="0.5" strokeDasharray="2,3" />
            <line x1="0" y1="40" x2="240" y2="40" stroke={fadedInk} strokeWidth="0.5" strokeDasharray="2,3" />

            {/* ghost line — what the platform shows (flat-ish) */}
            <polyline points="10,90 50,88 90,92 130,86 170,90 210,85 230,84"
              fill="none" stroke={fadedInk} strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="10" y="76" fontFamily="DM Sans, sans-serif" fontSize="7" letterSpacing="1.5" fill={fadedInk} fontWeight="700">PLATFORM SAYS</text>

            {/* real line — climbs steeply (what CRM reveals) */}
            <polyline points="10,110 50,100 90,85 130,65 170,42 210,22 230,15"
              fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* dots on real line */}
            {[
              { x: 10, y: 110 }, { x: 50, y: 100 }, { x: 90, y: 85 },
              { x: 130, y: 65 }, { x: 170, y: 42 }, { x: 210, y: 22 }, { x: 230, y: 15 }
            ].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2.8" fill={dotColor} />
            ))}

            {/* end-point flag */}
            <line x1="230" y1="15" x2="230" y2="5" stroke={lineColor} strokeWidth="1" />
            <text x="230" y="3" fontFamily="DM Sans, sans-serif" fontSize="7" letterSpacing="1" fill={v.accent} fontWeight="700" textAnchor="end">REAL ROI</text>
          </svg>
        </div>

        {/* Title at bottom */}
        <div style={{ position: "relative" }}>
          <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, lineHeight: 1.15, color: v.ink, margin: 0, fontWeight: 700, letterSpacing: "-0.01em" }}>{short}<span style={{ color: v.accent }}>.</span></p>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${dark ? "rgba(252,249,244,0.15)" : "rgba(44,36,23,0.15)"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: v.accent, fontWeight: 700 }}>{post.readTime}</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: v.ink, opacity: 0.5, fontWeight: 600 }}>interactive ↗</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function BlogSection() {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 9;

  // Build unique tag list in the order posts appear
  const allTags = ["All", ...Array.from(new Set(BLOG_POSTS.map(p => p.tag)))];

  const filteredPosts = activeTag === "All"
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.tag === activeTag);

  // Pagination math
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const visiblePosts = filteredPosts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

  // Reset to page 1 whenever filter changes
  useEffect(() => { setCurrentPage(1); }, [activeTag]);

  // Scroll to top of grid when page changes (but not on first load)
  const gridRef = useRef(null);
  const isFirstPageRender = useRef(true);
  useEffect(() => {
    if (isFirstPageRender.current) { isFirstPageRender.current = false; return; }
    if (gridRef.current) {
      const y = gridRef.current.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentPage]);

  const openPost = (slug) => { navigate(`/blog/${slug}`); window.scrollTo({ top: 0, behavior: "instant" }); };

  // ---- Stats for hero strip (computed from real data) ----
  const totalEssays = BLOG_POSTS.length;
  const totalCategories = new Set(BLOG_POSTS.map(p => p.tag)).size;
  const totalMinutes = BLOG_POSTS.reduce((sum, p) => {
    const m = parseInt((p.readTime || "").match(/\d+/)?.[0] || "0", 10);
    return sum + m;
  }, 0);
  // Most recent year from posts (e.g. "May 2026" → "2026")
  const yearShort = (() => {
    const years = BLOG_POSTS.map(p => parseInt((p.date || "").match(/\d{4}/)?.[0] || "0", 10)).filter(Boolean);
    const max = years.length ? Math.max(...years) : new Date().getFullYear();
    return String(max);
  })();

  return <section id="blog" style={{ background: cream, minHeight: "100vh", paddingBottom: 120 }}>

    {/* ===== HERO — ARCHIVE INDEX ===== */}
    <div className="writing-hero" style={{ position: "relative", padding: "72px 32px 48px", overflow: "hidden", borderTop: `4px solid ${espresso}`, borderBottom: `1px solid rgba(200,168,85,0.30)` }}>
      {/* soft background ornaments */}
      <div aria-hidden style={{ position: "absolute", top: -60, right: -60, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, rgba(200,168,85,0.10) 0%, rgba(200,168,85,0) 70%)`, pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: -40, left: -80, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, rgba(200,168,85,0.07) 0%, rgba(200,168,85,0) 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", textAlign: "center" }}>
        <Reveal>
          {/* kicker with dashes */}
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, margin: "0 0 20px", fontWeight: 700 }}>
            — Insights &amp; Essays —
          </p>

          {/* monster title — sized for laptop comfort, scales up on big screens */}
          <h1 className="writing-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(64px, 10vw, 140px)", color: espresso, margin: 0, fontWeight: 700, lineHeight: 0.85, letterSpacing: "-0.04em" }}>
            Writing<span style={{ color: gold }}>.</span>
          </h1>

          {/* italic descriptor */}
          <p className="writing-descriptor" style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: "clamp(16px, 1.4vw, 20px)", lineHeight: 1.5, color: warmGray, margin: "24px auto 32px", maxWidth: 640, fontWeight: 400 }}>
            Notes on marketing, AI, analytics, and the space where they meet — written for people who actually run campaigns.
          </p>

          {/* stat strip */}
          <div className="writing-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, maxWidth: 760, margin: "0 auto", borderTop: `1px solid ${espresso}`, borderBottom: `1px solid ${espresso}`, padding: "20px 0" }}>
            <div style={{ textAlign: "center", borderRight: `1px solid rgba(44,36,23,0.15)` }}>
              <div className="stat-num" style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: espresso, fontWeight: 700, lineHeight: 1 }}>{String(totalEssays).padStart(2, "0")}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: warmGray, marginTop: 8, fontWeight: 600 }}>Essays</div>
            </div>
            <div style={{ textAlign: "center", borderRight: `1px solid rgba(44,36,23,0.15)` }}>
              <div className="stat-num" style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: espresso, fontWeight: 700, lineHeight: 1 }}>{String(totalCategories).padStart(2, "0")}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: warmGray, marginTop: 8, fontWeight: 600 }}>Categories</div>
            </div>
            <div style={{ textAlign: "center", borderRight: `1px solid rgba(44,36,23,0.15)` }}>
              <div className="stat-num" style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: espresso, fontWeight: 700, lineHeight: 1 }}>{totalMinutes}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: warmGray, marginTop: 8, fontWeight: 600 }}>Min Reading</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="stat-num" style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, color: gold, fontWeight: 700, lineHeight: 1 }}>{yearShort}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: warmGray, marginTop: 8, fontWeight: 600 }}>Updated</div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>

    {/* ===== CATEGORY FILTER BAR ===== */}
    <div style={{ borderBottom: `1px solid rgba(200,168,85,0.20)`, background: "rgba(255,255,255,0.4)", padding: "18px 32px", marginBottom: 56, position: "sticky", top: 0, zIndex: 5, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: lightGray, fontWeight: 600, marginRight: 12 }}>Filter</span>
        {allTags.map(tag => {
          const isActive = activeTag === tag;
          return <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 12.5,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              fontWeight: 600,
              padding: "9px 18px",
              border: isActive ? `1.5px solid ${gold}` : `1.5px solid rgba(200,168,85,0.25)`,
              background: isActive ? gold : "transparent",
              color: isActive ? cream : warmGray,
              cursor: "pointer",
              transition: "all 0.25s ease",
              borderRadius: 999,
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = espresso; } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(200,168,85,0.25)"; e.currentTarget.style.color = warmGray; } }}
          >{tag}</button>;
        })}
      </div>
    </div>

    {/* ===== UNIFORM 3-COLUMN EDITORIAL GRID ===== */}
    <div ref={gridRef} style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px" }}>
      <Reveal>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40, flexWrap: "wrap" }}>
          <span style={{ display: "inline-block", width: 32, height: 1, background: gold }} />
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: gold, margin: 0, fontWeight: 600 }}>
            {activeTag === "All" ? `All Essays · ${filteredPosts.length}` : `${filteredPosts.length} ${filteredPosts.length === 1 ? "Essay" : "Essays"} in ${activeTag}`}
          </p>
          {totalPages > 1 && (
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: lightGray, fontWeight: 500 }}>
              · Page {safePage} of {totalPages}
            </span>
          )}
        </div>
      </Reveal>

      {visiblePosts.length === 0 ? (
        <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 20, color: lightGray, textAlign: "center", padding: "60px 0" }}>
          No essays in this category yet. Check back soon.
        </p>
      ) : (
        <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 48 }}>
          {visiblePosts.map((post, idx) => (
            <Reveal key={post.slug} delay={idx * 0.06}>
              <article
                onClick={() => openPost(post.slug)}
                className="blog-card"
                style={{ cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" }}
              >
                {/* Editorial cover */}
                <div className="blog-card-visual" style={{ position: "relative", aspectRatio: "4/5", border: `1px solid rgba(200,168,85,0.18)`, overflow: "hidden", marginBottom: 24, transition: "transform 0.4s ease, box-shadow 0.4s ease" }}>
                  <BlogCardCover post={post} />
                </div>

                {/* Meta */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: gold, fontWeight: 700 }}>{post.tag}</span>
                  <span style={{ display: "inline-block", width: 3, height: 3, borderRadius: "50%", background: lightGray }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: lightGray, letterSpacing: 0.5 }}>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: espresso, margin: "0 0 14px", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{post.title}</h3>

                {/* Excerpt */}
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: warmGray, lineHeight: 1.7, margin: "0 0 18px", flex: 1 }}>
                  {post.content[0].text.length > 140 ? post.content[0].text.slice(0, 140) + "…" : post.content[0].text}
                </p>

                {/* Date + CTA */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid rgba(200,168,85,0.20)` }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: lightGray, letterSpacing: 0.5 }}>{post.date}</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: espresso, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    Read <span style={{ color: gold }}>→</span>
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="blog-pagination" style={{ marginTop: 72, paddingTop: 40, borderTop: `1px solid rgba(200,168,85,0.20)`, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {/* « Previous */}
          <button
            onClick={() => safePage > 1 && setCurrentPage(safePage - 1)}
            disabled={safePage === 1}
            style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase",
              fontWeight: 600, padding: "10px 16px",
              background: "transparent",
              border: `1px solid ${safePage === 1 ? "rgba(200,168,85,0.15)" : "rgba(200,168,85,0.35)"}`,
              color: safePage === 1 ? lightGray : warmGray,
              cursor: safePage === 1 ? "not-allowed" : "pointer",
              opacity: safePage === 1 ? 0.5 : 1,
              transition: "all 0.2s ease",
              marginRight: 4,
            }}
            onMouseEnter={e => { if (safePage > 1) { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = espresso; } }}
            onMouseLeave={e => { if (safePage > 1) { e.currentTarget.style.borderColor = "rgba(200,168,85,0.35)"; e.currentTarget.style.color = warmGray; } }}
          >
            ← Prev
          </button>

          {/* Numbered page buttons with ellipsis */}
          {(() => {
            const pages = [];
            const showAround = 1; // pages to show on each side of current
            for (let i = 1; i <= totalPages; i++) {
              const isEdge = i === 1 || i === totalPages;
              const isNear = Math.abs(i - safePage) <= showAround;
              if (isEdge || isNear) {
                pages.push(i);
              } else if (pages[pages.length - 1] !== "…") {
                pages.push("…");
              }
            }
            return pages.map((p, idx) => {
              if (p === "…") {
                return <span key={`e${idx}`} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: lightGray, padding: "0 6px", fontWeight: 600 }}>…</span>;
              }
              const isActive = p === safePage;
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 15,
                    fontWeight: 700,
                    minWidth: 40,
                    height: 40,
                    padding: "0 10px",
                    background: isActive ? gold : "transparent",
                    border: `1px solid ${isActive ? gold : "rgba(200,168,85,0.25)"}`,
                    color: isActive ? cream : espresso,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = gold; e.currentTarget.style.background = "rgba(200,168,85,0.08)"; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(200,168,85,0.25)"; e.currentTarget.style.background = "transparent"; } }}
                  aria-label={`Go to page ${p}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {p}
                </button>
              );
            });
          })()}

          {/* Next » */}
          <button
            onClick={() => safePage < totalPages && setCurrentPage(safePage + 1)}
            disabled={safePage === totalPages}
            style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase",
              fontWeight: 600, padding: "10px 16px",
              background: "transparent",
              border: `1px solid ${safePage === totalPages ? "rgba(200,168,85,0.15)" : "rgba(200,168,85,0.35)"}`,
              color: safePage === totalPages ? lightGray : warmGray,
              cursor: safePage === totalPages ? "not-allowed" : "pointer",
              opacity: safePage === totalPages ? 0.5 : 1,
              transition: "all 0.2s ease",
              marginLeft: 4,
            }}
            onMouseEnter={e => { if (safePage < totalPages) { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = espresso; } }}
            onMouseLeave={e => { if (safePage < totalPages) { e.currentTarget.style.borderColor = "rgba(200,168,85,0.35)"; e.currentTarget.style.color = warmGray; } }}
          >
            Next →
          </button>
        </div>
      )}
    </div>

    {/* Component-scoped styles for hover + responsive */}
    <style>{`
      .blog-card:hover .blog-card-visual {
        transform: translateY(-6px);
        box-shadow: 0 18px 40px rgba(44,36,23,0.10);
      }
      .blog-card:hover h3 { color: ${gold}; }
      .blog-card h3 { transition: color 0.25s ease; }

      /* SHORT-LAPTOP screens (height-based, e.g. 1366x768, 1440x900):
         compress hero so the grid peeks above the fold and signals scroll */
      @media (max-height: 820px) {
        .writing-hero { padding: 40px 32px 32px !important; }
        .writing-hero .writing-title { font-size: clamp(56px, 8vw, 96px) !important; }
        .writing-hero .writing-descriptor { margin: 18px auto 22px !important; font-size: 15px !important; }
        .writing-hero .writing-stats { padding: 14px 0 !important; }
        .writing-hero .writing-stats .stat-num { font-size: 26px !important; }
      }

      /* TABLET — 2 columns */
      @media (max-width: 900px) {
        .blog-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; }
      }
      /* MOBILE — 1 column + stack stats 2x2 */
      @media (max-width: 640px) {
        .blog-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        .writing-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 16px 0 !important; padding: 20px 0 !important; }
        .writing-stats > div:nth-child(2) { border-right: 0 !important; }
        .writing-stats > div:nth-child(3) { border-right: 1px solid rgba(44,36,23,0.15) !important; }
      }
    `}</style>
  </section>;
}

/* BLOG — SINGLE POST PAGE */
function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [slug]);

  if (!post) {
    return <section style={{ padding: "180px 32px 100px", background: cream, minHeight: "100vh", textAlign: "center" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>404</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, color: espresso, marginBottom: 16, fontWeight: 700 }}>Post Not Found</h1>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: warmGray, marginBottom: 32 }}>This post might have moved or doesn't exist yet.</p>
        <button onClick={() => navigate("/blog")} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "12px 28px", background: espresso, color: cream, border: "none", fontWeight: 600, cursor: "pointer" }}>← Back to Blog</button>
      </div>
    </section>;
  }

  return <section style={{ padding: "120px 32px 100px", background: cream, minHeight: "100vh" }}>
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <Reveal>
        <button onClick={() => { navigate("/blog"); window.scrollTo({ top: 0, behavior: "instant" }); }} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", background: "none", border: "none", color: warmGray, cursor: "pointer", fontWeight: 500, marginBottom: 32, padding: 0, display: "inline-flex", alignItems: "center", gap: 6, transition: "color 0.3s" }} onMouseEnter={e=>{e.target.style.color=gold}} onMouseLeave={e=>{e.target.style.color=warmGray}}>← Back to All Posts</button>

        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: gold, fontWeight: 600, padding: "4px 12px", border: `1px solid ${gold}` }}>{post.tag}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: lightGray }}>By Ruby Patra</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: lightGray }}>&bull; {post.date}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: lightGray }}>&bull; {post.readTime}</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(34px, 5vw, 52px)", color: espresso, marginBottom: 32, fontWeight: 700, lineHeight: 1.15 }}>{post.title}</h1>
      </Reveal>

      <Reveal delay={0.1}>
        <article className="blog-article" style={{ background: paperWhite, padding: "48px 48px 56px", border: "1px solid rgba(200,168,85,0.12)" }}>
          {post.content.map((b, i) => {
            if (b.type === "intro") return <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: warmGray, lineHeight: 1.85, marginBottom: 18, fontWeight: 400 }}>{b.text}</p>;
            if (b.type === "heading") return <h2 key={i} style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: espresso, marginTop: 36, marginBottom: 14, fontWeight: 600, lineHeight: 1.3 }}>{b.text}</h2>;
            if (b.type === "pullquote") return <PullQuote key={i} text={b.text}/>;
            if (b.type === "visual" && blogVisuals[b.key]) return <div key={i}>{blogVisuals[b.key]}</div>;
            return <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: warmGray, lineHeight: 1.85, marginBottom: 16 }}>{b.text}</p>;
          })}

          <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid rgba(200,168,85,0.15)", textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: warmGray, margin: 0 }}>Written by <strong style={{ fontFamily: "'Playfair Display',serif", color: espresso, fontWeight: 600, fontSize: 16 }}>Ruby Patra</strong></p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: lightGray, letterSpacing: 1, marginTop: 6, fontStyle: "italic" }}>{post.date} &bull; Marseille, France</p>
          </div>
        </article>
      </Reveal>

      <Reveal delay={0.2}>
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <button onClick={() => { navigate("/blog"); window.scrollTo({ top: 0, behavior: "instant" }); }} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "14px 32px", background: "transparent", color: espresso, border: `1.5px solid ${gold}`, fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }} onMouseEnter={e=>{e.target.style.background=gold;e.target.style.color=espresso}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color=espresso}}>← Back to All Posts</button>
        </div>
      </Reveal>
    </div>
  </section>;
}

/* CONTACT */
function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "contact@rubypatra.com";
  const handleCopy = async () => { try { await navigator.clipboard.writeText(email); } catch { const t=document.createElement("textarea");t.value=email;document.body.appendChild(t);t.select();document.execCommand("copy");document.body.removeChild(t); } setCopied(true); setTimeout(()=>setCopied(false),2500); };
  return <section id="contact" style={{ padding: "100px 32px", background: espresso, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: "15%", right: "8%", width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(200,168,85,0.06)" }}/>
    <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
      <Reveal><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Let's Connect</p><h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, color: cream, marginBottom: 24, fontWeight: 600, lineHeight: 1.15 }}>Open to new<br/><span style={{ color: gold, fontStyle: "italic" }}>opportunities</span></h2><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "#B0A594", lineHeight: 1.75, marginBottom: 40, maxWidth: 460, margin: "0 auto 40px" }}>Based in Marseille, France. Looking for roles where marketing, data, and technology converge.</p></Reveal>
      <Reveal delay={0.15}><div className="contact-buttons" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
        <button onClick={handleCopy} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", padding: "14px 36px", background: copied?"#4CAF50":gold, color: copied?"#fff":espresso, fontWeight: 600, transition: "all 0.3s", border: "none", cursor: "pointer", minWidth: 180 }} onMouseEnter={e=>{if(!copied)e.target.style.background=cream}} onMouseLeave={e=>{if(!copied)e.target.style.background=gold}}>{copied?"✓ Email Copied!":"Copy Email"}</button>
        <a href="https://www.linkedin.com/in/ruby-patra/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", padding: "14px 36px", border: "1.5px solid rgba(200,168,85,0.35)", color: gold, textDecoration: "none", fontWeight: 500, transition: "all 0.3s" }} onMouseEnter={e=>{e.target.style.borderColor=gold;e.target.style.background="rgba(200,168,85,0.08)"}} onMouseLeave={e=>{e.target.style.borderColor="rgba(200,168,85,0.35)";e.target.style.background="transparent"}}>LinkedIn</a>
      </div><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#8B7B65", marginBottom: 20 }}>contact@rubypatra.com &bull; +33 6 51 41 09 84</p></Reveal>
    </div>
  </section>;
}

function Footer() { return <footer style={{ padding: "28px 32px", background: "#1E1A12", textAlign: "center" }}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: "#5A5040", letterSpacing: 1 }}>© 2026 Ruby Patra &bull; Built with purpose, deployed with Vercel</p></footer>; }

/* APP */
export default function Portfolio() {
  const [active, setActive] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  useEffect(() => {
    const ids = ["about", "work", "skills", "journey", "contact"];
    const o = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        setActive(e.target.id);
        if (window.location.hash !== `#${e.target.id}`) {
          window.history.replaceState(null, "", `#${e.target.id}`);
        }
      }
    }), { threshold: 0.25 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) o.observe(el); });
    return () => o.disconnect();
  }, []);
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
   <Routes>
      <Route path="/" element={
        <>
          <Navbar active={active} onOpenForm={() => setFormOpen(true)}/>
          <Hero onOpenForm={() => setFormOpen(true)}/>
          <MetricsBanner/>
          <About/>
          <HowIWork/>
          <Work/>
          <SkillsSection/>
          <SoftSkillsSection/>
          <JourneyTimeline/>
          <Contact/>
          <Footer/>
        </>
      }/>
      <Route path="/blog" element={
        <>
          <Navbar active={active} onOpenForm={() => setFormOpen(true)}/>
          <BlogSection/>
          <Footer/>
        </>
      }/>
      <Route path="/blog/:slug" element={
        <>
          <Navbar active={active} onOpenForm={() => setFormOpen(true)}/>
          <BlogPostPage/>
          <Footer/>
        </>
      }/>
      <Route path="/growth-marketing" element={
        <>
          <Navbar active={active} onOpenForm={() => setFormOpen(true)}/>
          <GrowthMarketing/>
        </>
      }/>
     <Route path="/dashboard-studio" element={
  <>
    <Navbar active={active} onOpenForm={() => setFormOpen(true)}/>
    <DashboardStudio/>
  </>
}/>
    </Routes>
    <InquiryModal open={formOpen} onClose={() => setFormOpen(false)}/>
  </div>;
}
