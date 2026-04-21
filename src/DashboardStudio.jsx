import { useState, useEffect, useRef } from "react";

/* COLORS — match main site */
const gold = "#C8A855";
const goldLight = "#D4B96A";
const cream = "#FCF9F4";
const espresso = "#2C2417";
const espressoDeep = "#1E1A12";
const warmGray = "#6B5E4B";
const lightGray = "#9B8E7B";
const paperWhite = "#FFFFFF";
const bodyDark = "#3E3526";

/* HOOKS */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, v] = useInView();
  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* BUTTON STYLES */
const btnBase = {
  fontFamily: "'DM Sans',sans-serif", fontSize: 13, letterSpacing: 2.5, textTransform: "uppercase",
  padding: "18px 42px", fontWeight: 700, transition: "all 0.35s",
  display: "inline-flex", alignItems: "center", gap: 10, minHeight: 54,
  border: "none", cursor: "pointer", textDecoration: "none",
};
const btnPrimary = { ...btnBase, background: espresso, color: cream, boxShadow: "0 4px 20px rgba(44,36,23,0.15)" };
const btnSecondary = { ...btnBase, background: "transparent", color: espresso, border: `1.5px solid ${gold}` };
const btnGold = { ...btnBase, background: gold, color: espresso, boxShadow: "0 4px 20px rgba(200,168,85,0.25)" };

/* SHARED SECTION STYLES */
const eyebrowStyle = { fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 };
const sectionTitle = { fontFamily: "'Playfair Display',serif", fontSize: 38, color: espresso, marginBottom: 14, fontWeight: 600, lineHeight: 1.15 };
const sectionSub = { fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: bodyDark, maxWidth: 640, marginBottom: 56, lineHeight: 1.7 };

/* HERO */
function Hero({ onOpenForm }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 150); }, []);
  const anim = d => ({ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(26px)", transition: `all 0.75s cubic-bezier(0.16,1,0.3,1) ${d}s` });
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(168deg, ${cream} 0%, #F5EFE6 25%, #EDE5D8 50%, #F5EFE6 75%, ${cream} 100%)`,
      backgroundSize: "200% 200%", animation: "subtleShift 12s ease infinite",
      position: "relative", overflow: "hidden", padding: "120px 32px 80px",
    }}>
      <div style={{ position: "absolute", top: "8%", right: "6%", width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(200,168,85,0.1)" }}/>
      <div style={{ position: "absolute", bottom: "12%", left: "4%", width: 160, height: 160, borderRadius: "50%", border: "1px solid rgba(200,168,85,0.07)" }}/>
      <div style={{ maxWidth: 900, textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={anim(0.2)}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Dashboard Studio</p>
        </div>
        <div style={anim(0.4)}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px, 6.5vw, 68px)", fontWeight: 600, color: espresso, lineHeight: 1.15, marginBottom: 28 }}>
            Your data exists.<br/>
            <em style={{ fontStyle: "italic", color: gold }}>You just can't see it</em><br/>
            clearly yet.
          </h1>
        </div>
        <div style={anim(0.55)}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 19, color: bodyDark, lineHeight: 1.75, maxWidth: 660, margin: "0 auto 44px", fontWeight: 400 }}>
            Four ad platforms, a CRM, Google Analytics, Excel exports. It's all there. What's missing is one clean view where the numbers finally tell you what to do.{" "}
            <span style={{ color: warmGray }}>I build that.</span>
          </p>
        </div>
        <div className="hero-buttons" style={{ ...anim(0.7), display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onOpenForm} style={btnPrimary}
            onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = espresso; e.currentTarget.style.boxShadow = "0 8px 28px rgba(200,168,85,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = espresso; e.currentTarget.style.color = cream; e.currentTarget.style.boxShadow = "0 4px 20px rgba(44,36,23,0.15)"; }}
          >
            Let's Build It <span style={{ marginLeft: 4 }}>→</span>
          </button>
          <a href="#how" style={btnSecondary}
            onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = espresso; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = espresso; }}
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}

/* WHAT YOU GET */
function WhatYouGet() {
  const items = [
    {
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="6" y="8" width="32" height="28" rx="2" stroke={gold} strokeWidth="1.5" opacity="0.8"/>
          <rect x="10" y="12" width="9" height="9" fill={gold} opacity="0.4"/>
          <rect x="22" y="12" width="12" height="4" fill={gold} opacity="0.3"/>
          <rect x="22" y="18" width="12" height="3" fill={gold} opacity="0.2"/>
          <rect x="10" y="24" width="24" height="3" fill={gold} opacity="0.3"/>
          <rect x="10" y="29" width="18" height="3" fill={gold} opacity="0.2"/>
        </svg>
      ),
      title: "Custom performance dashboards",
      desc: "Designed around the decisions you make weekly, monthly, quarterly. Not a copy-paste template with everything visible and nothing prioritized."
    },
    {
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="14" cy="14" r="6" stroke={gold} strokeWidth="1.5" opacity="0.8"/>
          <circle cx="30" cy="14" r="6" stroke={gold} strokeWidth="1.5" opacity="0.6"/>
          <circle cx="22" cy="30" r="6" stroke={gold} strokeWidth="1.5" opacity="0.8"/>
          <line x1="18" y1="16" x2="20" y2="26" stroke={gold} strokeWidth="1.5" opacity="0.5"/>
          <line x1="26" y1="16" x2="24" y2="26" stroke={gold} strokeWidth="1.5" opacity="0.5"/>
          <line x1="19" y1="14" x2="25" y2="14" stroke={gold} strokeWidth="1.5" opacity="0.4"/>
        </svg>
      ),
      title: "Ad spend to revenue mapping",
      desc: "Connect what you spent to what you earned. Which campaign, which keyword, which audience, which week. The attribution layer most dashboards quietly skip."
    },
    {
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="6" y="18" width="8" height="8" rx="1" stroke={gold} strokeWidth="1.5" opacity="0.7"/>
          <rect x="18" y="10" width="8" height="8" rx="1" stroke={gold} strokeWidth="1.5" opacity="0.7"/>
          <rect x="18" y="26" width="8" height="8" rx="1" stroke={gold} strokeWidth="1.5" opacity="0.7"/>
          <rect x="30" y="18" width="8" height="8" rx="1" stroke={gold} strokeWidth="1.5" opacity="0.9"/>
          <circle cx="34" cy="22" r="2" fill={gold}/>
          <line x1="14" y1="22" x2="18" y2="14" stroke={gold} strokeWidth="1.2" opacity="0.5"/>
          <line x1="14" y1="22" x2="18" y2="30" stroke={gold} strokeWidth="1.2" opacity="0.5"/>
          <line x1="26" y1="14" x2="30" y2="22" stroke={gold} strokeWidth="1.2" opacity="0.5"/>
          <line x1="26" y1="30" x2="30" y2="22" stroke={gold} strokeWidth="1.2" opacity="0.5"/>
        </svg>
      ),
      title: "Multi-channel integration",
      desc: "Google Ads, Meta, Bing, Pinterest, GA4, your CRM. All pulled into one place automatically. No more exporting CSVs and crying into Excel on the first of every month."
    },
    {
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="14" stroke={gold} strokeWidth="1.5" opacity="0.8"/>
          <path d="M28 20 L22 26 L18 22" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 8 L22 4 M22 40 L22 36 M8 22 L4 22 M40 22 L36 22" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        </svg>
      ),
      title: "Ongoing maintenance & monthly insights",
      desc: "Platforms change their APIs. Metrics get renamed. Something breaks. I keep it running, and once a month I read the numbers with you so nothing worth knowing gets missed."
    }
  ];

  return (
    <section style={{ padding: "100px 32px", background: paperWhite }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><p style={eyebrowStyle}>What You Get</p></Reveal>
        <Reveal><h2 style={sectionTitle}>More than a chart library</h2></Reveal>
        <Reveal><p style={sectionSub}>A dashboard isn't useful because it shows data. It's useful because it answers your questions. Here's what that actually looks like.</p></Reveal>

        <div className="grid-services" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div
                style={{ padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)", transition: "transform 0.3s, box-shadow 0.3s", height: "100%" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(44,36,23,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: 48, height: 48, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: espresso, fontWeight: 600, marginBottom: 12, lineHeight: 1.2 }}>{item.title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: bodyDark, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* HOW IT WORKS */
function HowItWorks() {
  const steps = [
    { num: "1", meta: "Week 1 · Audit", title: "Figure out what you actually need to see", desc: "We sit down (or Zoom) and I ask you the one question that matters: what decisions do you make with this data, and how often? Then I look at what you already have — platforms, tools, spreadsheets, CRMs. We leave with a one-page spec of what the dashboard will answer." },
    { num: "2", meta: "Weeks 2 – 3 · Build", title: "Wire it up, make it yours", desc: "Data connectors, attribution logic, layout, your branding. I build it on a stack that's boring on purpose (Supabase, Vercel, Python where needed) because boring means it won't break in six months. You'll see progress every few days, not at the end." },
    { num: "3", meta: "Week 4 · Deliver", title: "Handover, training, and a running product", desc: "Walk-through session, quick video tutorials for your team, documentation so the next analyst isn't lost. Then an optional monthly retainer if you want me to keep it maintained and read the numbers with you." },
  ];
  return (
    <section id="how" style={{ padding: "100px 32px", background: cream }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><p style={eyebrowStyle}>How It Works</p></Reveal>
        <Reveal><h2 style={sectionTitle}>Three phases, two to four weeks</h2></Reveal>
        <Reveal><p style={sectionSub}>Short and structured. No three-month discovery sprints or 40-slide kickoff decks.</p></Reveal>

        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div className="how-line" style={{ position: "absolute", left: 40, top: 30, bottom: 30, width: 1, background: "rgba(200,168,85,0.3)" }}/>
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.1}>
              <div className="how-step" style={{ display: "flex", gap: 28, marginBottom: 32, position: "relative", alignItems: "flex-start" }}>
                <div className="how-number" style={{ width: 80, height: 80, borderRadius: "50%", background: gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1, boxShadow: "0 4px 16px rgba(200,168,85,0.3)" }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: espresso, fontWeight: 700 }}>{s.num}</span>
                </div>
                <div style={{ flex: 1, padding: "20px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)" }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 6 }}>{s.meta}</p>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: espresso, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: bodyDark, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* DASHBOARD MOCKUP */
function DashboardMockup() {
  return (
    <section style={{ padding: "100px 32px", background: espresso, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(200,168,85,0.08)" }}/>
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Reveal><p style={eyebrowStyle}>What It Looks Like</p></Reveal>
        <Reveal><h2 style={{ ...sectionTitle, color: cream }}>A real dashboard, not a stock screenshot</h2></Reveal>
        <Reveal><p style={{ ...sectionSub, color: "#B0A594" }}>Representative of what I've built for clients. Your data, your KPIs, your brand. The structure stays the same: top-line numbers, trend, channel breakdown, action.</p></Reveal>

        {/* TOP LEVEL DASHBOARD */}
        <Reveal>
          <div style={{ background: "#0F0C08", border: "1px solid rgba(200,168,85,0.2)", borderRadius: 4, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxWidth: 960, margin: "0 auto" }}>
            {/* Title bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#1A1510", borderBottom: "1px solid rgba(200,168,85,0.12)" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C46A55" }}/>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: gold }}/>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7A9B6E" }}/>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#9B8E7B", marginLeft: 12, letterSpacing: 1 }}>paid-media-performance · 2026</span>
            </div>

            <div className="dash-body" style={{ padding: 28 }}>
              {/* Header */}
              <div className="dash-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: cream, fontWeight: 600, marginBottom: 4 }}>Paid Media Performance</h4>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#8B7B65" }}>All channels · Last 30 days · Updated 2 hours ago</p>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["Year","Quarter","30 Days","Week"].map((t,i) => (
                    <div key={t} style={{ padding: "6px 14px", background: i===2 ? "rgba(200,168,85,0.15)" : "rgba(200,168,85,0.08)", color: i===2 ? gold : "#9B8E7B", fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", border: i===2 ? "1px solid rgba(200,168,85,0.3)" : "1px solid transparent" }}>{t}</div>
                  ))}
                </div>
              </div>

              {/* KPI ROW */}
              <div className="kpi-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "Ad Spend", value: "€187K", delta: "▲ 12.4% vs. last", down: false },
                  { label: "Confirmed Bookings", value: "31", delta: "▲ 19.2% vs. last", down: false },
                  { label: "B2C Turnover", value: "€1.26M", delta: "▲ 8.7% vs. last", down: false },
                  { label: "ROAS", value: "6.7×", delta: "▼ 2.1% vs. last", down: true },
                ].map(k => (
                  <div key={k.label} style={{ padding: "16px 18px", background: "rgba(200,168,85,0.04)", border: "1px solid rgba(200,168,85,0.12)" }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#8B7B65", marginBottom: 8 }}>{k.label}</p>
                    <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: cream, fontWeight: 700, marginBottom: 4 }}>{k.value}</p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: k.down ? "#C46A55" : "#7A9B6E" }}>{k.delta}</p>
                  </div>
                ))}
              </div>

              {/* CHARTS ROW */}
              <div className="chart-row" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 24 }}>
                {/* Line chart */}
                <div style={{ padding: 20, background: "rgba(200,168,85,0.03)", border: "1px solid rgba(200,168,85,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: gold, fontWeight: 600 }}>Spend vs. Revenue · Daily</p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#8B7B65" }}>€ thousand</p>
                  </div>
                  <svg viewBox="0 0 500 140" style={{ width: "100%", height: "auto" }} xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(200,168,85,0.08)" strokeWidth="1"/>
                    <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(200,168,85,0.08)" strokeWidth="1"/>
                    <line x1="0" y1="110" x2="500" y2="110" stroke="rgba(200,168,85,0.08)" strokeWidth="1"/>
                    <defs>
                      <linearGradient id="goldFade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C8A855" stopOpacity="0.35"/>
                        <stop offset="100%" stopColor="#C8A855" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M 10 100 L 50 80 L 90 85 L 130 60 L 170 65 L 210 45 L 250 50 L 290 30 L 330 40 L 370 25 L 410 35 L 450 20 L 490 28 L 490 130 L 10 130 Z" fill="url(#goldFade)" opacity="0.5"/>
                    <polyline points="10,100 50,80 90,85 130,60 170,65 210,45 250,50 290,30 330,40 370,25 410,35 450,20 490,28" stroke={gold} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="10,115 50,112 90,110 130,105 170,103 210,98 250,100 290,92 330,95 370,88 410,90 450,85 490,82" stroke="#8B7B65" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" opacity="0.7"/>
                    <circle cx="490" cy="28" r="3" fill={gold}/>
                    <circle cx="490" cy="82" r="3" fill="#8B7B65"/>
                  </svg>
                  <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 2, background: gold }}/><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#8B7B65" }}>Revenue</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 10, height: 2, background: "#8B7B65" }}/><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: "#8B7B65" }}>Spend</span></div>
                  </div>
                </div>

                {/* Bar chart */}
                <div style={{ padding: 20, background: "rgba(200,168,85,0.03)", border: "1px solid rgba(200,168,85,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: gold, fontWeight: 600 }}>Spend by Channel</p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#8B7B65" }}>€ thousand</p>
                  </div>
                  <svg viewBox="0 0 280 140" style={{ width: "100%", height: "auto" }} xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="30" width="40" height="90" fill={gold} opacity="0.85"/>
                    <text x="40" y="135" textAnchor="middle" fontFamily="DM Sans" fontSize="9" fill="#8B7B65">Google</text>
                    <text x="40" y="22" textAnchor="middle" fontFamily="Playfair Display" fontSize="11" fill={cream} fontWeight="600">87</text>
                    <rect x="80" y="50" width="40" height="70" fill={gold} opacity="0.6"/>
                    <text x="100" y="135" textAnchor="middle" fontFamily="DM Sans" fontSize="9" fill="#8B7B65">Meta</text>
                    <text x="100" y="42" textAnchor="middle" fontFamily="Playfair Display" fontSize="11" fill={cream} fontWeight="600">58</text>
                    <rect x="140" y="75" width="40" height="45" fill={gold} opacity="0.45"/>
                    <text x="160" y="135" textAnchor="middle" fontFamily="DM Sans" fontSize="9" fill="#8B7B65">Bing</text>
                    <text x="160" y="67" textAnchor="middle" fontFamily="Playfair Display" fontSize="11" fill={cream} fontWeight="600">28</text>
                    <rect x="200" y="95" width="40" height="25" fill={gold} opacity="0.3"/>
                    <text x="220" y="135" textAnchor="middle" fontFamily="DM Sans" fontSize="9" fill="#8B7B65">Pinterest</text>
                    <text x="220" y="87" textAnchor="middle" fontFamily="Playfair Display" fontSize="11" fill={cream} fontWeight="600">14</text>
                  </svg>
                </div>
              </div>

              {/* TABLE */}
              <div>
                <div className="dash-table-header" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 12, padding: "10px 14px", background: "rgba(200,168,85,0.06)", border: "1px solid rgba(200,168,85,0.12)", fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#8B7B65", fontWeight: 600 }}>
                  <span>Campaign</span><span>Spend</span><span>Bookings</span><span>ROAS</span><span>Status</span>
                </div>
                {[
                  { name: "Brand · Search", spend: "€8,400", book: "12", roas: "38.2×", status: "Healthy", bookCls: "good", roasCls: "good", statCls: "good" },
                  { name: "Destination Packages", spend: "€42,100", book: "14", roas: "9.1×", status: "Scaling", bookCls: "good", roasCls: "good", statCls: "good" },
                  { name: "Luxury Villas · PMax", spend: "€36,800", book: "3", roas: "2.4×", status: "Watch", bookCls: "", roasCls: "", statCls: "dim" },
                  { name: "Generic Travel · Broad", spend: "€12,300", book: "0", roas: "0.0×", status: "Pause", bookCls: "bad", roasCls: "bad", statCls: "bad" },
                ].map((r,i) => {
                  const color = (cls) => cls === "good" ? "#9AB88E" : cls === "bad" ? "#D88B78" : cls === "dim" ? "#8B7B65" : "#D8CFBE";
                  return (
                    <div key={i} className="dash-table-row" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 12, padding: 14, borderBottom: i < 3 ? "1px solid rgba(200,168,85,0.06)" : "none", fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: "#D8CFBE", alignItems: "center" }}>
                      <span style={{ color: cream, fontWeight: 600 }}>{r.name}</span>
                      <span>{r.spend}</span>
                      <span style={{ color: color(r.bookCls) }}>{r.book}</span>
                      <span style={{ color: color(r.roasCls) }}>{r.roas}</span>
                      <span style={{ color: color(r.statCls) }}>{r.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p style={{ textAlign: "center", marginTop: 32, fontFamily: "'Playfair Display',serif", fontSize: 14, color: "#B0A594", fontStyle: "italic", maxWidth: 600, margin: "32px auto 0", lineHeight: 1.7 }}>
            Every tile, chart, and row on this dashboard answers a specific question someone on your team is already asking. That's the difference between data and a dashboard.
          </p>
        </Reveal>

        {/* DRILL DOWN */}
        <DrillDown />
      </div>
    </section>
  );
}

/* DRILL-DOWN HIERARCHY */
function DrillDown() {
  const campaigns = [
    {
      name: "Campaign A",
      sub: "3 ad groups · €22,400 spend · €124,800 revenue",
      roas: "5.6× ROAS", status: "Healthy", statusTone: "good", roasTone: "good",
      flagged: false,
      adgroups: [
        { name: "Ad Group A-1", bar: 72, spend: "€8,100", roas: "6.2× ROAS", tone: "good" },
        { name: "Ad Group A-2", bar: 84, spend: "€9,400", roas: "5.9× ROAS", tone: "good" },
        { name: "Ad Group A-3", bar: 48, spend: "€4,900", roas: "4.1× ROAS", tone: "good" },
      ]
    },
    {
      name: "Campaign B",
      sub: "3 ad groups · €48,300 spend · €96,600 revenue",
      roas: "2.0× ROAS", status: "Watch", statusTone: "dim", roasTone: "dim",
      flagged: true,
      adgroups: [
        { name: "Ad Group B-1", bar: 76, spend: "€12,700", roas: "5.8× ROAS", tone: "good" },
        { name: "Ad Group B-2", bar: 68, spend: "€11,200", roas: "4.7× ROAS", tone: "good" },
        { name: "Ad Group B-3", bar: 92, spend: "€24,400 spend", roas: "0.0× ROAS · 0 conversions", tone: "bad", isLeak: true },
      ]
    },
    {
      name: "Campaign C",
      sub: "3 ad groups · €23,500 spend · €189,000 revenue",
      roas: "8.0× ROAS", status: "Scaling", statusTone: "good", roasTone: "good",
      flagged: false,
      adgroups: [
        { name: "Ad Group C-1", bar: 90, spend: "€10,800", roas: "9.2× ROAS", tone: "good" },
        { name: "Ad Group C-2", bar: 74, spend: "€7,200", roas: "7.8× ROAS", tone: "good" },
        { name: "Ad Group C-3", bar: 55, spend: "€5,500", roas: "6.4× ROAS", tone: "good" },
      ]
    }
  ];

  const toneColor = (t) => t === "good" ? "#9AB88E" : t === "bad" ? "#D88B78" : t === "dim" ? "#D0B585" : "#D8CFBE";
  const toneBg = (t) => t === "good" ? "rgba(154,184,142,0.15)" : t === "bad" ? "rgba(216,139,120,0.15)" : t === "dim" ? "rgba(208,181,133,0.15)" : "rgba(139,123,101,0.15)";
  const barGradient = (t) => t === "good" ? "linear-gradient(90deg, #9AB88E, #7A9B6E)" : t === "bad" ? "linear-gradient(90deg, #D88B78, #C46A55)" : "#B0A594";

  return (
    <div style={{ marginTop: 72, paddingTop: 56, borderTop: "1px solid rgba(200,168,85,0.15)" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 14 }}>And it doesn't stop at campaigns</p>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, color: cream, fontWeight: 600, marginBottom: 14 }}>
            Drill down to the <em style={{ fontStyle: "italic", color: gold }}>exact ad group</em> draining your budget
          </h3>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "#B0A594", maxWidth: 640, margin: "0 auto", lineHeight: 1.7 }}>
            Most teams shut down the whole campaign when ROI dips. But inside that campaign, two ad groups might be crushing it and one is bleeding. The dashboard shows you which is which — so you fix, not kill.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div style={{ maxWidth: 960, margin: "0 auto", background: "#0F0C08", border: "1px solid rgba(200,168,85,0.2)" }}>
          {/* Summary bar */}
          <div className="drill-summary" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", background: "rgba(200,168,85,0.04)", borderBottom: "1px solid rgba(200,168,85,0.15)", flexWrap: "wrap", gap: 12 }}>
            {[
              { label: "Source", value: "Google Ads" },
              { label: "Campaigns", value: "3" },
              { label: "Ad Groups", value: "9" },
              { label: "Total Spend", value: "€94,200" },
              { label: "ROAS", value: "5.2×", good: true },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 100 }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9.5, letterSpacing: 1.5, textTransform: "uppercase", color: "#8B7B65", fontWeight: 600 }}>{s.label}</p>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: s.good ? "#9AB88E" : cream, fontWeight: 600 }}>{s.value}</p>
                </div>
                {i < arr.length - 1 && <div className="drill-divider" style={{ width: 1, height: 32, background: "rgba(200,168,85,0.15)" }}/>}
              </div>
            ))}
          </div>

          {/* Campaigns */}
          {campaigns.map((camp, ci) => (
            <div key={camp.name} style={{
              borderBottom: ci < campaigns.length - 1 ? "1px solid rgba(200,168,85,0.08)" : "none",
              position: "relative",
              background: camp.flagged ? "rgba(216,139,120,0.03)" : "transparent",
              border: camp.flagged ? "1px solid rgba(216,139,120,0.25)" : undefined,
              margin: camp.flagged ? "0 -1px" : undefined,
            }}>
              {camp.flagged && (
                <div className="drill-flag-ribbon" style={{ position: "absolute", top: 12, right: 16, fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#D88B78", fontWeight: 700, padding: "4px 10px", background: "rgba(216,139,120,0.12)", border: "1px solid rgba(216,139,120,0.3)" }}>⚠ Mixed performance</div>
              )}
              <div className="drill-camp-header" style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 28px" }}>
                <div style={{ color: gold, fontSize: 16, flexShrink: 0 }}>▾</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: cream, fontWeight: 600, marginBottom: 4 }}>{camp.name}</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#8B7B65" }}>{camp.sub}</p>
                </div>
                <div className="drill-camp-stats" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: toneColor(camp.roasTone) }}>{camp.roas}</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 10px", fontWeight: 600, background: toneBg(camp.statusTone), color: toneColor(camp.statusTone) }}>{camp.status}</span>
                </div>
              </div>

              <div className="drill-adgroups" style={{ padding: "0 28px 22px" }}>
                {camp.adgroups.map((ag, ai) => (
                  <div key={ag.name} className="drill-adgroup" style={{
                    display: "grid", gridTemplateColumns: "1.6fr 2fr 1.4fr", gap: 20, alignItems: "center",
                    padding: "10px 14px",
                    background: ag.isLeak ? "rgba(216,139,120,0.08)" : "rgba(200,168,85,0.03)",
                    border: ag.isLeak ? "1px solid rgba(216,139,120,0.35)" : "1px solid rgba(200,168,85,0.08)",
                    marginBottom: ai < camp.adgroups.length - 1 ? 6 : 0,
                    animation: ag.isLeak ? "pulseBad 2.4s ease-in-out infinite" : undefined,
                  }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: ag.isLeak ? "#D88B78" : cream, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      {ag.isLeak && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D88B78", animation: "pulseDot 1.6s ease-in-out infinite" }}/>}
                      {ag.name}
                      {ag.isLeak && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", padding: "2px 7px", fontWeight: 700, marginLeft: "auto", background: "#D88B78", color: espresso }}>The leak</span>}
                    </div>
                    <div style={{ height: 6, background: "rgba(200,168,85,0.08)", overflow: "hidden", position: "relative" }}>
                      <div style={{ height: "100%", width: `${ag.bar}%`, background: barGradient(ag.tone) }}/>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, textAlign: "right" }}>
                      <span style={{ color: ag.tone === "bad" ? "#D88B78" : "#8B7B65", fontWeight: ag.tone === "bad" ? 700 : 400 }}>{ag.spend}</span>
                      <span style={{ color: ag.tone === "good" ? "#9AB88E" : ag.tone === "bad" ? "#D88B78" : "#8B7B65", fontWeight: ag.tone === "good" || ag.tone === "bad" ? 600 : 400 }}>{ag.roas}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* INSIGHT CALLOUT */}
      <Reveal delay={0.1}>
        <div className="drill-insight" style={{ maxWidth: 960, margin: "32px auto 0", padding: "32px 36px", background: "rgba(200,168,85,0.06)", border: "1px solid rgba(200,168,85,0.25)", borderLeft: `4px solid ${gold}`, display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 32, alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 10 }}>What this view tells you</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: cream, fontWeight: 600, lineHeight: 1.35, marginBottom: 14 }}>
              Shut down Campaign B and you kill <em style={{ fontStyle: "italic", color: gold }}>2 ad groups that are working</em>.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#B0A594", lineHeight: 1.7 }}>
              Ad Groups B-1 and B-2 are pulling 5× ROAS. The reason Campaign B looks bad is Ad Group B-3 alone, burning €24,400 with zero conversions. Pause B-3. Keep the rest. Save the campaign.
            </p>
          </div>
          <div className="drill-insight-right" style={{ display: "flex", flexDirection: "column", gap: 16, paddingLeft: 28, borderLeft: "1px solid rgba(200,168,85,0.2)" }}>
            <div>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: cream, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>€24,400</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#8B7B65", fontWeight: 600 }}>Budget to reallocate</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: "#9AB88E", fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>2×</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#8B7B65", fontWeight: 600 }}>Campaigns saved from shutdown</p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* CASE STUDY STRIP */
function CaseStudy() {
  return (
    <section style={{ padding: "80px 32px", background: cream }}>
      <Reveal>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "40px 44px", background: paperWhite, borderLeft: `4px solid ${gold}`, borderTop: "1px solid rgba(200,168,85,0.12)", borderRight: "1px solid rgba(200,168,85,0.12)", borderBottom: "1px solid rgba(200,168,85,0.12)" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 12 }}>Real build • Luxury Travel Brand</p>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: espresso, fontWeight: 600, marginBottom: 16 }}>A dashboard that replaced a weekly spreadsheet</h3>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: bodyDark, lineHeight: 1.75, marginBottom: 20 }}>
            One premium travel client was spending hours every Monday exporting CSVs from four ad platforms and pasting them into a Google Sheet nobody trusted. I built a single dashboard that pulls everything automatically, maps spend to confirmed bookings, and shows ROI the way leadership actually wants to see it.
          </p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15.5, color: bodyDark, lineHeight: 1.75, marginBottom: 20 }}>
            It replaced the spreadsheet completely. Monthly reporting that used to take a full day now takes ten minutes. Budget decisions that used to wait a week now happen in real time.
          </p>
          <div className="case-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, paddingTop: 24, borderTop: "1px solid rgba(200,168,85,0.12)" }}>
            {[
              { num: "€1.89M", label: "Ad spend tracked" },
              { num: "4", label: "Platforms unified" },
              { num: "13.8×", label: "Peak monthly ROI" },
              { num: "€438K", label: "B2C revenue surfaced" },
            ].map(s => (
              <div key={s.num} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: gold, fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>{s.num}</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: warmGray, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* CTA */
function CTA({ onOpenForm }) {
  return (
    <section style={{ padding: "100px 32px", background: espresso, textAlign: "center", position: "relative", overflow: "hidden", borderTop: "1px solid rgba(200,168,85,0.15)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Reveal>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, color: cream, marginBottom: 24, lineHeight: 1.2, fontWeight: 600 }}>
            Let's build the view <em style={{ fontStyle: "italic", color: gold }}>you actually need</em>.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "#B0A594", lineHeight: 1.75, marginBottom: 40, maxWidth: 540, margin: "0 auto 40px" }}>
            Tell me what data you already have, what you're trying to answer, and who opens the dashboard. I'll come back with a rough scope, a timeline, and a straight price.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <button
            onClick={onOpenForm}
            style={btnGold}
            onMouseEnter={e => { e.currentTarget.style.background = goldLight; e.currentTarget.style.boxShadow = "0 10px 40px rgba(200,168,85,0.5), 0 0 0 4px rgba(200,168,85,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = gold; e.currentTarget.style.boxShadow = "0 4px 20px rgba(200,168,85,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Start the Conversation <span style={{ marginLeft: 4 }}>→</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* FORM MODAL */
function InquiryModal({ open, onClose }) {
  const [status, setStatus] = useState("idle");
  const formRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setStatus("idle");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const fd = new FormData(formRef.current);
      const res = await fetch("https://formspree.io/f/xbdqawkp", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        formRef.current.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!open) return null;

  const fieldLabel = { display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: warmGray, fontWeight: 600, marginBottom: 6 };
  const fieldLabelOpt = { fontWeight: 400, textTransform: "none", letterSpacing: 0, color: lightGray, fontSize: 12 };
  const fieldInput = { width: "100%", padding: "12px 14px", background: cream, border: "1px solid rgba(200,168,85,0.12)", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: espresso, transition: "border-color 0.2s, background 0.2s", outline: "none", boxSizing: "border-box" };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(44,36,23,0.7)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} className="modal-body" style={{ background: paperWhite, maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "48px 44px", position: "relative" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 18, right: 22, fontSize: 28, color: lightGray, background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}>×</button>

        {status !== "success" ? (
          <>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 8 }}>Let's Build</p>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: espresso, marginBottom: 10, fontWeight: 600 }}>Tell me what you want to see</h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: bodyDark, lineHeight: 1.7, marginBottom: 28 }}>
              Short form. I read every one and come back within 24 hours with a rough scope, timeline, and price — or an honest redirect if I'm not the right fit.
            </p>

            {status === "error" && (
              <div style={{ padding: "12px 16px", background: "rgba(180,80,60,0.08)", border: "1px solid rgba(180,80,60,0.25)", color: "rgb(160,70,50)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 16 }}>
                Something went wrong sending your message. Try again, or email me directly at contact@rubypatra.com.
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit}>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>Your name</label>
                <input name="name" type="text" required style={fieldInput} onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = paperWhite; }} onBlur={e => { e.target.style.borderColor = "rgba(200,168,85,0.12)"; e.target.style.background = cream; }}/>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>Email</label>
                <input name="email" type="email" required style={fieldInput} onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = paperWhite; }} onBlur={e => { e.target.style.borderColor = "rgba(200,168,85,0.12)"; e.target.style.background = cream; }}/>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>Company <span style={fieldLabelOpt}>(optional)</span></label>
                <input name="company" type="text" style={fieldInput} onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = paperWhite; }} onBlur={e => { e.target.style.borderColor = "rgba(200,168,85,0.12)"; e.target.style.background = cream; }}/>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>What data sources do you have?</label>
                <input name="sources" type="text" required placeholder="e.g. Google Ads, Meta, GA4, HubSpot" style={fieldInput} onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = paperWhite; }} onBlur={e => { e.target.style.borderColor = "rgba(200,168,85,0.12)"; e.target.style.background = cream; }}/>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>What's the main thing you want the dashboard to answer?</label>
                <textarea name="goal" required placeholder="e.g. 'Is our ad spend actually generating revenue?' or 'Which channels are we overpaying on?'" style={{ ...fieldInput, resize: "vertical", minHeight: 96, lineHeight: 1.6 }} onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = paperWhite; }} onBlur={e => { e.target.style.borderColor = "rgba(200,168,85,0.12)"; e.target.style.background = cream; }}/>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>Budget range</label>
                <select name="budget" required style={{ ...fieldInput, appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4 L6 8 L10 4' stroke='%236B5E4B' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
                  <option value="">Select a range</option>
                  <option value="<3k">Under €3K (simple build)</option>
                  <option value="3k-8k">€3K – €8K</option>
                  <option value="8k-20k">€8K – €20K</option>
                  <option value="retainer">Ongoing monthly retainer</option>
                  <option value="unsure">Not sure yet</option>
                </select>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>How'd you find me? <span style={fieldLabelOpt}>(optional)</span></label>
                <input name="source" type="text" placeholder="LinkedIn, referral, search..." style={fieldInput} onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = paperWhite; }} onBlur={e => { e.target.style.borderColor = "rgba(200,168,85,0.12)"; e.target.style.background = cream; }}/>
              </div>

              <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex="-1" autoComplete="off"/>
              <input type="hidden" name="_subject" value="New dashboard inquiry from rubypatra.com"/>

              <button
                type="submit"
                disabled={status === "sending"}
                style={{ width: "100%", padding: "16px 28px", background: status === "sending" ? lightGray : espresso, color: cream, fontFamily: "'DM Sans',sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, transition: "all 0.3s", marginTop: 8, border: "none", cursor: status === "sending" ? "not-allowed" : "pointer" }}
                onMouseEnter={e => { if (status !== "sending") { e.currentTarget.style.background = gold; e.currentTarget.style.color = espresso; } }}
                onMouseLeave={e => { if (status !== "sending") { e.currentTarget.style.background = espresso; e.currentTarget.style.color = cream; } }}
              >
                {status === "sending" ? "Sending..." : <>Send it <span style={{ marginLeft: 4 }}>→</span></>}
              </button>

              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: lightGray, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
                Your info goes straight to contact@rubypatra.com. No list, no funnel, no follow-up sequence.
              </p>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: gold, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32, color: espresso, fontWeight: 700 }}>✓</div>
            <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: espresso, fontWeight: 600, marginBottom: 12 }}>Got it.</h4>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: bodyDark, lineHeight: 1.7 }}>
              Your message just landed in my inbox. I'll read it properly and come back within 24 hours with a rough scope and price.
            </p>
            <button
              onClick={onClose}
              style={{ ...btnPrimary, marginTop: 24 }}
              onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = espresso; }}
              onMouseLeave={e => { e.currentTarget.style.background = espresso; e.currentTarget.style.color = cream; }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* FOOTER */
function Footer() {
  return (
    <footer style={{ padding: "28px 32px", background: espressoDeep, textAlign: "center" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: "#5A5040", letterSpacing: 1 }}>© 2026 Ruby Patra • Dashboard Studio</p>
    </footer>
  );
}

/* MAIN PAGE */
export default function DashboardStudio() {
  const [formOpen, setFormOpen] = useState(false);
  const openForm = () => setFormOpen(true);
  const closeForm = () => setFormOpen(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ background: cream, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0}
        html{scroll-behavior:smooth}
        body{overflow-x:hidden}
        ::selection{background:rgba(200,168,85,0.25)}
        @keyframes subtleShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes pulseBad{0%,100%{box-shadow:0 0 0 1px rgba(216,139,120,0.15) inset}50%{box-shadow:0 0 0 1px rgba(216,139,120,0.4) inset,0 0 20px rgba(216,139,120,0.15)}}
        @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.4}}
        @media(max-width:768px){
          section{padding-left:20px !important;padding-right:20px !important}
          h1{font-size:34px !important}
          h2{font-size:28px !important}
          .grid-services{grid-template-columns:1fr !important}
          .hero-buttons{flex-direction:column !important;align-items:center !important}
          .hero-buttons button,.hero-buttons a{width:100% !important;max-width:300px !important;justify-content:center !important}
          .how-step{gap:16px !important}
          .how-number{width:60px !important;height:60px !important}
          .how-number span{font-size:24px !important}
          .how-line{left:30px !important}
          .kpi-row{grid-template-columns:repeat(2,1fr) !important}
          .chart-row{grid-template-columns:1fr !important}
          .dash-table-header,.dash-table-row{grid-template-columns:1.5fr 1fr 1fr !important;font-size:11px !important}
          .dash-table-header > :nth-child(4),.dash-table-header > :nth-child(5),.dash-table-row > :nth-child(4),.dash-table-row > :nth-child(5){display:none !important}
          .dash-body{padding:16px !important}
          .case-stats{grid-template-columns:repeat(2,1fr) !important}
          .drill-summary{padding:16px !important;gap:8px !important}
          .drill-summary .drill-divider{display:none !important}
          .drill-camp-header{flex-wrap:wrap !important;padding:18px 16px !important;gap:10px !important}
          .drill-camp-stats{width:100% !important;justify-content:flex-start !important}
          .drill-adgroups{padding:0 16px 16px !important}
          .drill-adgroup{grid-template-columns:1fr !important;gap:8px !important;padding:10px !important}
          .drill-flag-ribbon{position:static !important;display:inline-block !important;margin:16px 16px 0 !important;font-size:9px !important}
          .drill-insight{grid-template-columns:1fr !important;padding:24px !important;gap:20px !important}
          .drill-insight-right{padding-left:0 !important;padding-top:20px !important;border-left:none !important;border-top:1px solid rgba(200,168,85,0.2) !important;flex-direction:row !important;justify-content:space-between !important}
          .modal-body{padding:36px 24px !important}
        }
      `}</style>

      <Hero onOpenForm={openForm} />
      <WhatYouGet />
      <HowItWorks />
      <DashboardMockup />
      <CaseStudy />
      <CTA onOpenForm={openForm} />
      <Footer />
      <InquiryModal open={formOpen} onClose={closeForm} />
    </div>
  );
}
