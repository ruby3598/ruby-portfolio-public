import { useState, useEffect, useRef, useCallback } from "react";

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

/* ANIMATED STAT */
function AnimatedStat({ target, suffix = "", label, context }) {
  const [ref, vis] = useInView(0.4);
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!vis || done) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = eased * target;
      setCurrent(target % 1 === 0 ? Math.floor(v) : parseFloat(v.toFixed(1)));
      if (p < 1) requestAnimationFrame(tick);
      else { setCurrent(target); setDone(true); }
    };
    requestAnimationFrame(tick);
  }, [vis, done, target]);
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "40px 24px", background: "rgba(200,168,85,0.04)", border: "1px solid rgba(200,168,85,0.15)", transition: "all 0.4s" }}>
      <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 56, color: gold, fontWeight: 700, lineHeight: 1, marginBottom: 12, minHeight: 60 }}>
        {current}{suffix}
      </p>
      <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, color: cream, fontWeight: 600, marginBottom: 10 }}>{label}</p>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#8B7B65", lineHeight: 1.6 }}>{context}</p>
    </div>
  );
}

/* TOP BAR — minimal for subpage */
function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "10px 0" : "18px 0",
      background: scrolled ? "rgba(252,249,244,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(200,168,85,0.12)" : "none",
      transition: "all 0.4s",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: gold, textDecoration: "none", fontWeight: 700 }}>◆</a>
        <a href="/" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase", color: warmGray, textDecoration: "none", fontWeight: 500, transition: "color 0.3s" }}
           onMouseEnter={e => e.target.style.color = gold}
           onMouseLeave={e => e.target.style.color = warmGray}>
          ← Back to Home
        </a>
      </div>
    </nav>
  );
}

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
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 }}>Growth Marketing</p>
        </div>
        <div style={anim(0.4)}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(40px, 6.5vw, 68px)", fontWeight: 600, color: espresso, lineHeight: 1.15, marginBottom: 28 }}>
            Ads are easy.<br/>
            <em style={{ fontStyle: "italic", color: gold }}>Knowing what's actually working</em><br/>
            is the job.
          </h1>
        </div>
        <div style={anim(0.55)}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 19, color: bodyDark, lineHeight: 1.75, maxWidth: 660, margin: "0 auto 44px", fontWeight: 400 }}>
            I've managed over €3.5M in ad spend across luxury travel, automotive and agency work. In one audit I found €8,500 a month getting burned on keywords that never made a single sale.{" "}
            <span style={{ color: warmGray }}>That's the kind of thing I look for.</span>
          </p>
        </div>
        <div className="hero-buttons" style={{ ...anim(0.7), display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onOpenForm} style={btnPrimary}>
            Let's Talk <span style={{ marginLeft: 4 }}>→</span>
          </button>
          <a href="#services" style={btnSecondary}>See What I Do</a>
        </div>
      </div>
    </section>
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

/* SERVICES */
function Services() {
  const services = [
    {
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="6" y="10" width="32" height="24" rx="2" stroke={gold} strokeWidth="1.5" opacity="0.8"/>
          <line x1="12" y1="18" x2="20" y2="18" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
          <line x1="12" y1="24" x2="28" y2="24" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          <circle cx="32" cy="20" r="2" fill={gold} opacity="0.7"/>
        </svg>
      ),
      title: "Paid media, managed properly",
      desc: "Google, Meta, Pinterest, Bing. I don't hand campaigns to algorithms and hope. Every test has a reason. Every euro ties back to a lead, a booking, or a decision you can actually make."
    },
    {
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="14" stroke={gold} strokeWidth="1.5" opacity="0.8"/>
          <circle cx="22" cy="22" r="7" stroke={gold} strokeWidth="1.5" opacity="0.5"/>
          <circle cx="22" cy="22" r="2" fill={gold}/>
          <line x1="22" y1="4" x2="22" y2="10" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
          <line x1="22" y1="34" x2="22" y2="40" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
          <line x1="4" y1="22" x2="10" y2="22" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
          <line x1="34" y1="22" x2="40" y2="22" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        </svg>
      ),
      title: "Tracking that tells the truth",
      desc: "Clean UTMs, conversion events that fire when they should, attribution that works for sales cycles longer than a click. You'll know which ad brought the €50K booking, even three months later."
    },
    {
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="8" y="26" width="5" height="12" fill={gold} opacity="0.4"/>
          <rect x="16" y="18" width="5" height="20" fill={gold} opacity="0.6"/>
          <rect x="24" y="22" width="5" height="16" fill={gold} opacity="0.4"/>
          <rect x="32" y="12" width="5" height="26" fill={gold} opacity="0.7"/>
          <path d="M8 22 L18 14 L26 18 L36 8" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" fill="none"/>
          <circle cx="36" cy="8" r="2.5" fill={gold}/>
        </svg>
      ),
      title: "Reporting built for decisions",
      desc: "The reports I build are for the people who sign off on budget. Founders, marketing directors, finance. Not a dump of every metric the platform offers. The story, the number, and what to do next."
    },
    {
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="10" y="10" width="24" height="24" rx="2" stroke={gold} strokeWidth="1.5" opacity="0.8"/>
          <path d="M16 22 L20 26 L28 18" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M34 8 L38 4 M38 4 L38 8 M38 4 L34 4" stroke={gold} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        </svg>
      ),
      title: "Fixing where leads fall off",
      desc: "Traffic is the easy half. I audit landing pages, forms, checkout flows, wherever qualified visitors quietly leave. Then I fix the drop-offs with tests you can trust, not opinions."
    }
  ];

  return (
    <section id="services" style={{ padding: "100px 32px", background: paperWhite }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><p style={eyebrowStyle}>What I Do</p></Reveal>
        <Reveal><h2 style={sectionTitle}>Four pieces that only work together</h2></Reveal>
        <Reveal><p style={sectionSub}>Paid media without tracking is guessing. Tracking without reporting is data nobody reads. Reporting without CRO is a story with no next chapter. Here's the full loop.</p></Reveal>

        <div className="grid-services" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {services.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div
                style={{ padding: "36px 28px", background: paperWhite, border: "1px solid rgba(200,168,85,0.12)", transition: "transform 0.3s, box-shadow 0.3s", height: "100%" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(44,36,23,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: 48, height: 48, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: espresso, fontWeight: 600, marginBottom: 12, lineHeight: 1.2 }}>{s.title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: bodyDark, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* SYSTEM LOOP 2x2 DIAGRAM */}
        <Reveal delay={0.2}>
          <div style={{ marginTop: 60, padding: "40px 24px", background: cream, border: "1px solid rgba(200,168,85,0.12)" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 600, textAlign: "center", marginBottom: 28 }}>How the pieces connect</p>
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              <svg viewBox="0 0 560 480" style={{ width: "100%", height: "auto", display: "block", margin: "0 auto" }} xmlns="http://www.w3.org/2000/svg">
                <path d="M 80 120 Q 20 120 20 240 Q 20 360 80 360 L 480 360 Q 540 360 540 240 Q 540 120 480 120 Z" stroke={gold} strokeWidth="1.5" fill="none" opacity="0.2" strokeDasharray="5 5"/>

                <circle cx="160" cy="120" r="78" fill={cream} stroke={gold} strokeWidth="2"/>
                <text x="160" y="100" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="10" fontWeight="600" fill={gold} letterSpacing="2">01</text>
                <text x="160" y="124" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="18" fontWeight="600" fill={espresso}>Paid Media</text>
                <text x="160" y="144" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="12" fill={warmGray}>&amp; Strategy</text>

                <path d="M 248 120 L 312 120 M 304 114 L 313 120 L 304 126" stroke={gold} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

                <circle cx="400" cy="120" r="78" fill={cream} stroke={gold} strokeWidth="2"/>
                <text x="400" y="100" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="10" fontWeight="600" fill={gold} letterSpacing="2">02</text>
                <text x="400" y="124" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="18" fontWeight="600" fill={espresso}>Tracking</text>
                <text x="400" y="144" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="12" fill={warmGray}>&amp; Attribution</text>

                <path d="M 400 208 L 400 272 M 394 264 L 400 273 L 406 264" stroke={gold} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

                <circle cx="400" cy="360" r="78" fill={cream} stroke={gold} strokeWidth="2"/>
                <text x="400" y="340" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="10" fontWeight="600" fill={gold} letterSpacing="2">03</text>
                <text x="400" y="364" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="18" fontWeight="600" fill={espresso}>Reporting</text>
                <text x="400" y="384" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="12" fill={warmGray}>&amp; Insight</text>

                <path d="M 312 360 L 248 360 M 256 354 L 247 360 L 256 366" stroke={gold} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

                <circle cx="160" cy="360" r="78" fill={cream} stroke={gold} strokeWidth="2"/>
                <text x="160" y="340" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="10" fontWeight="600" fill={gold} letterSpacing="2">04</text>
                <text x="160" y="364" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="18" fontWeight="600" fill={espresso}>CRO</text>
                <text x="160" y="384" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="12" fill={warmGray}>&amp; Testing</text>

                <path d="M 160 272 L 160 208 M 154 216 L 160 207 L 166 216" stroke={gold} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>

                <text x="280" y="236" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="10" letterSpacing="2" fill={lightGray} fontWeight="600">THE LOOP</text>
                <text x="280" y="252" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="13" fill={warmGray} fontStyle="italic">insights feed</text>
                <text x="280" y="268" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="13" fill={warmGray} fontStyle="italic">back into strategy</text>
              </svg>
            </div>
            <p style={{ textAlign: "center", marginTop: 24, fontFamily: "'Playfair Display',serif", fontSize: 14, color: espresso, fontStyle: "italic" }}>Skip one piece and the others stop working. That's what I mean by a system.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* WHO I WORK WITH */
function Who() {
  const items = [
    { num: "01", title: "High ticket, long sales cycles", desc: "When one closed deal is worth months of ad spend, you can't afford sloppy attribution. Six months later you still need to know which ad brought the booking in, or you're flying blind on every budget decision." },
    { num: "02", title: "Premium brands where lead quality matters more than volume", desc: "Fifty good leads beats five hundred bad ones. Your sales team doesn't have time for tire-kickers and your brand doesn't belong in a spray-and-pray funnel." },
    { num: "03", title: "You're spending on ads but can't prove it worked", desc: "Six figures into paid media and the reports still feel like fiction. You need someone who can connect spend to revenue, not just leads, clicks or impressions." },
    { num: "04", title: "You've outgrown spreadsheets", desc: "Four ad platforms, a CRM, and a CEO asking questions no platform dashboard can answer. You need reporting built around your decisions, not the tools' defaults." },
  ];
  return (
    <section style={{ padding: "100px 32px", background: cream }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><p style={eyebrowStyle}>Who This Is For</p></Reveal>
        <Reveal><h2 style={sectionTitle}>We'll get along if you're here</h2></Reveal>
        <Reveal><p style={sectionSub}>Not every business needs this kind of work. Here's where I actually move the needle, described by where you are right now instead of what industry you're in.</p></Reveal>

        <div className="grid-who" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {items.map((item, i) => (
            <Reveal key={item.num} delay={i * 0.08}>
              <div
                style={{ padding: "32px 30px", background: paperWhite, borderLeft: `3px solid ${gold}`, borderTop: "1px solid rgba(200,168,85,0.12)", borderRight: "1px solid rgba(200,168,85,0.12)", borderBottom: "1px solid rgba(200,168,85,0.12)", transition: "transform 0.3s", height: "100%" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
              >
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 10 }}>{item.num}</p>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: espresso, fontWeight: 600, marginBottom: 10, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: bodyDark, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* RESULTS */
function Results() {
  return (
    <section style={{ padding: "100px 32px", background: espresso, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(200,168,85,0.08)" }}/>
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Reveal><p style={eyebrowStyle}>Results</p></Reveal>
        <Reveal><h2 style={{ ...sectionTitle, color: cream }}>What this work tends to shift</h2></Reveal>
        <Reveal><p style={{ ...sectionSub, color: "#B0A594" }}>Representative outcomes from recent engagements. Every account is different. These are the kinds of moves this system consistently produces.</p></Reveal>

        <div className="grid-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginBottom: 64 }}>
          <Reveal delay={0}><AnimatedStat target={3} suffix="×" label="ROAS Improvement" context="By rebuilding campaigns around confirmed revenue instead of last-click leads." /></Reveal>
          <Reveal delay={0.1}><AnimatedStat target={40} suffix="%" label="Reduction in Wasted Spend" context="Keyword and ad-group audits that catch the leaks nobody was looking at." /></Reveal>
          <Reveal delay={0.2}><AnimatedStat target={2} suffix="×" label="Lead Quality Improvement" context="Audience rebuilds and funnel tightening so fewer tire-kickers slip through." /></Reveal>
        </div>

        {/* WASTE VISUAL */}
        <Reveal delay={0.2}>
          <div style={{ background: "rgba(200,168,85,0.04)", border: "1px solid rgba(200,168,85,0.15)", padding: "40px 32px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 10 }}>Real case • Luxury Travel Account</p>
              <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: cream, marginBottom: 8, fontWeight: 600 }}>€8,500 a month, found in one audit</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#8B7B65", fontStyle: "italic" }}>One ad group. 115 leads. Zero confirmed bookings.</p>
            </div>

            <div className="waste-compare" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24, alignItems: "center", maxWidth: 720, margin: "0 auto" }}>
              <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,168,85,0.12)" }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, marginBottom: 14, textAlign: "center", color: "#C46A55" }}>Before</p>
                <div style={wasteBar}><div style={{ ...wasteFill, width: "75%", background: "rgba(180,80,60,0.55)" }}>€8,500 wasted</div></div>
                <div style={wasteLabelRow}><span>Luxury Vacation ad group</span><span>0 bookings</span></div>
                <div style={{ ...wasteBar, marginTop: 12 }}><div style={{ ...wasteFill, width: "28%", background: "rgba(200,168,85,0.25)", color: "#E8DFD0" }}>€3,100</div></div>
                <div style={wasteLabelRow}><span>Working campaigns</span><span>starved</span></div>
              </div>

              <div className="waste-arrow" style={{ fontSize: 32, color: gold, textAlign: "center" }}>→</div>

              <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,168,85,0.12)" }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, marginBottom: 14, textAlign: "center", color: gold }}>After</p>
                <div style={wasteBar}><div style={{ ...wasteFill, width: "88%", background: gold, color: espresso }}>€8,500 reallocated</div></div>
                <div style={wasteLabelRow}><span>Destination-specific groups</span><span>40% ROI</span></div>
                <div style={{ ...wasteBar, marginTop: 12 }}><div style={{ ...wasteFill, width: "100%", background: gold, color: espresso, opacity: 0.85 }}>Brand campaign: 60× ROI</div></div>
                <div style={wasteLabelRow}><span>Finally funded properly</span><span>scaled up</span></div>
              </div>
            </div>

            <p style={{ textAlign: "center", marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(200,168,85,0.15)", fontFamily: "'Playfair Display',serif", fontSize: 13, color: "#B0A594", fontStyle: "italic" }}>Same total budget. Same platform. Different decisions.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const wasteBar = { height: 32, background: "rgba(255,255,255,0.04)", position: "relative", marginBottom: 10, overflow: "hidden" };
const wasteFill = { height: "100%", display: "flex", alignItems: "center", padding: "0 10px", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, color: "white" };
const wasteLabelRow = { display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, color: "#8B7B65", marginTop: 4 };

/* CTA */
function CTA({ onOpenForm }) {
  return (
    <section style={{ padding: "100px 32px", background: espresso, textAlign: "center", position: "relative", overflow: "hidden", borderTop: "1px solid rgba(200,168,85,0.15)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <Reveal>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, color: cream, marginBottom: 24, lineHeight: 1.2, fontWeight: 600 }}>
            Let's find <em style={{ fontStyle: "italic", color: gold }}>what's actually working</em>.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "#B0A594", lineHeight: 1.75, marginBottom: 40, maxWidth: 540, margin: "0 auto 40px" }}>
            Tell me where you are right now. Platforms, budget, what's confusing you. I'll read it properly and come back honestly on whether this is a fit, what the first thirty days would look like, and what it'd cost.
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
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
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

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(44,36,23,0.7)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="modal-body"
        style={{ background: paperWhite, maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "48px 44px", position: "relative" }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ position: "absolute", top: 18, right: 22, fontSize: 28, color: lightGray, background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
        >×</button>

        {status !== "success" ? (
          <>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: gold, fontWeight: 600, marginBottom: 8 }}>Let's Talk</p>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: espresso, marginBottom: 10, fontWeight: 600 }}>Tell me what's going on</h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: bodyDark, lineHeight: 1.7, marginBottom: 28 }}>
              Short form. I read every one personally and come back within 24 hours with either a real answer or an honest redirect if I'm not the right fit.
            </p>

            {status === "error" && (
              <div style={{ padding: "12px 16px", background: "rgba(180,80,60,0.08)", border: "1px solid rgba(180,80,60,0.25)", color: "rgb(160,70,50)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 16 }}>
                Something went wrong sending your message. Try again, or email me directly at contact@rubypatra.com.
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit}>
              <FormField label="Your name" name="name" type="text" required />
              <FormField label="Email" name="email" type="email" required />
              <FormField label="Company" labelOpt="(optional)" name="company" type="text" />
              <FormSelect label="Monthly ad budget" name="budget" required options={[
                { v: "", t: "Select a range" },
                { v: "<5k", t: "Under €5K / month" },
                { v: "5k-25k", t: "€5K – €25K / month" },
                { v: "25k-100k", t: "€25K – €100K / month" },
                { v: "100k+", t: "€100K+ / month" },
                { v: "unsure", t: "Not sure yet" },
              ]} />
              <FormTextarea label="What's the main thing you want to fix?" name="challenge" required placeholder="e.g. 'Spending €20K/mo on Google Ads, no idea if it's actually driving revenue'" />
              <FormField label="How'd you find me?" labelOpt="(optional)" name="source" type="text" placeholder="LinkedIn, referral, search..." />

              {/* honeypot */}
              <input type="text" name="_gotcha" style={{ display: "none" }} tabIndex="-1" autoComplete="off" />
              <input type="hidden" name="_subject" value="New growth marketing inquiry from rubypatra.com" />

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  width: "100%", padding: "16px 28px",
                  background: status === "sending" ? lightGray : espresso,
                  color: cream, fontFamily: "'DM Sans',sans-serif", fontSize: 13,
                  letterSpacing: 2, textTransform: "uppercase", fontWeight: 700,
                  transition: "all 0.3s", marginTop: 8, border: "none",
                  cursor: status === "sending" ? "not-allowed" : "pointer",
                }}
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
              Your message just landed in my inbox. I'll read it properly and come back within 24 hours, usually sooner.
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

/* FORM FIELD HELPERS */
function FormField({ label, labelOpt, ...props }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={fieldLabel}>{label}{labelOpt && <span style={fieldLabelOpt}> {labelOpt}</span>}</label>
      <input {...props} style={fieldInput} onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = paperWhite; }} onBlur={e => { e.target.style.borderColor = "rgba(200,168,85,0.12)"; e.target.style.background = cream; }} />
    </div>
  );
}
function FormTextarea({ label, labelOpt, ...props }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={fieldLabel}>{label}{labelOpt && <span style={fieldLabelOpt}> {labelOpt}</span>}</label>
      <textarea {...props} style={{ ...fieldInput, resize: "vertical", minHeight: 96, lineHeight: 1.6 }} onFocus={e => { e.target.style.borderColor = gold; e.target.style.background = paperWhite; }} onBlur={e => { e.target.style.borderColor = "rgba(200,168,85,0.12)"; e.target.style.background = cream; }} />
    </div>
  );
}
function FormSelect({ label, labelOpt, options, ...props }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={fieldLabel}>{label}{labelOpt && <span style={fieldLabelOpt}> {labelOpt}</span>}</label>
      <select {...props} style={{ ...fieldInput, appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4 L6 8 L10 4' stroke='%236B5E4B' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
        {options.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
      </select>
    </div>
  );
}
const fieldLabel = { display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: warmGray, fontWeight: 600, marginBottom: 6 };
const fieldLabelOpt = { fontWeight: 400, textTransform: "none", letterSpacing: 0, color: lightGray, fontSize: 12 };
const fieldInput = { width: "100%", padding: "12px 14px", background: cream, border: "1px solid rgba(200,168,85,0.12)", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: espresso, transition: "border-color 0.2s, background 0.2s", outline: "none", boxSizing: "border-box" };

/* SHARED SECTION STYLES */
const eyebrowStyle = { fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: 5, textTransform: "uppercase", color: gold, marginBottom: 20, fontWeight: 500 };
const sectionTitle = { fontFamily: "'Playfair Display',serif", fontSize: 38, color: espresso, marginBottom: 14, fontWeight: 600, lineHeight: 1.15 };
const sectionSub = { fontFamily: "'DM Sans',sans-serif", fontSize: 17, color: bodyDark, maxWidth: 640, marginBottom: 56, lineHeight: 1.7 };

/* FOOTER */
function Footer() {
  return (
    <footer style={{ padding: "28px 32px", background: espressoDeep, textAlign: "center" }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: "#5A5040", letterSpacing: 1 }}>© 2026 Ruby Patra • Growth Marketing</p>
    </footer>
  );
}

/* MAIN PAGE */
export default function GrowthMarketing() {
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
        @media(max-width:768px){
          section{padding-left:20px !important;padding-right:20px !important}
          h1{font-size:34px !important}
          h2{font-size:28px !important}
          .grid-who{grid-template-columns:1fr !important}
          .grid-stats{grid-template-columns:1fr !important;gap:20px !important}
          .hero-buttons{flex-direction:column !important;align-items:center !important}
          .hero-buttons button,.hero-buttons a{width:100% !important;max-width:300px !important;justify-content:center !important}
          .waste-compare{grid-template-columns:1fr !important;gap:12px !important}
          .waste-arrow{transform:rotate(90deg) !important}
          .modal-body{padding:36px 24px !important}
        }
      `}</style>

      <TopBar />
      <Hero onOpenForm={openForm} />
      <Services />
      <Who />
      <Results />
      <CTA onOpenForm={openForm} />
      <Footer />
      <InquiryModal open={formOpen} onClose={closeForm} />
    </div>
  );
}
