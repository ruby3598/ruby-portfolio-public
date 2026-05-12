import { useState, useEffect } from "react";

const gold = "#C8A855";
const cream = "#FCF9F4";
const espresso = "#2C2417";
const warmGray = "#6B5E4B";
const lightGray = "#9B8E7B";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: cream,
  border: "1px solid rgba(200,168,85,0.2)",
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 14,
  color: espresso,
  outline: "none",
  transition: "border-color 0.2s",
};

const labelStyle = {
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: warmGray,
  fontWeight: 600,
  marginBottom: 6,
  display: "block",
};

function FormField({ label, name, type = "text", required = false, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: gold }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = gold)}
        onBlur={(e) => (e.target.style.borderColor = "rgba(200,168,85,0.2)")}
      />
    </div>
  );
}

function FormTextarea({ label, name, required = false, placeholder, rows = 4 }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: gold }}>*</span>}
      </label>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={rows}
        style={{ ...inputStyle, resize: "vertical", fontFamily: "'DM Sans',sans-serif" }}
        onFocus={(e) => (e.target.style.borderColor = gold)}
        onBlur={(e) => (e.target.style.borderColor = "rgba(200,168,85,0.2)")}
      />
    </div>
  );
}

function FormSelect({ label, name, required = false, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: gold }}>*</span>}
      </label>
      <select
        name={name}
        required={required}
        defaultValue=""
        style={{ ...inputStyle, cursor: "pointer" }}
        onFocus={(e) => (e.target.style.borderColor = gold)}
        onBlur={(e) => (e.target.style.borderColor = "rgba(200,168,85,0.2)")}
      >
        <option value="" disabled>Select one...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export default function InquiryModal({ open, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Honeypot — silent drop
    if (data._gotcha) {
      setSubmitted(true);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("https://formspree.io/f/xbdqawkp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          _subject: "New inquiry from rubypatra.com",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json?.errors?.[0]?.message || "Something went wrong. Please try again or email contact@rubypatra.com directly.");
      }
    } catch {
      setError("Network error. Please try again or email contact@rubypatra.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(44,36,23,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        cursor: "pointer",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          maxWidth: 560,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "40px 36px",
          position: "relative",
          cursor: "default",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 20,
            background: "none",
            border: "none",
            fontSize: 28,
            color: lightGray,
            cursor: "pointer",
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          &times;
        </button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(200,168,85,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 28,
                color: gold,
              }}
            >
              ✓
            </div>
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 24,
                color: espresso,
                marginBottom: 12,
                fontWeight: 600,
              }}
            >
              Thanks for reaching out
            </h3>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 15,
                color: warmGray,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              I'll get back to you within 24 hours. In the meantime, feel free to email me directly at contact@rubypatra.com.
            </p>
            <button
              onClick={onClose}
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                padding: "12px 28px",
                background: espresso,
                color: cream,
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 11,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: gold,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Get In Touch
            </p>
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 26,
                color: espresso,
                marginBottom: 8,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              Let's talk about your project
            </h3>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                color: warmGray,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Tell me a bit about what you're working on and I'll reply within 24 hours.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Honeypot */}
              <input
                type="text"
                name="_gotcha"
                tabIndex="-1"
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
                aria-hidden="true"
              />

              <FormField label="Your Name" name="name" required placeholder="Jane Smith" />
              <FormField label="Email" name="email" type="email" required placeholder="jane@company.com" />
              <FormField label="Company" name="company" placeholder="Optional" />
              <FormSelect
                label="Budget Range"
                name="budget"
                required
                options={[
                  "Under €2,000/month",
                  "€2,000 – €5,000/month",
                  "€5,000 – €10,000/month",
                  "€10,000+/month",
                  "One-off project",
                  "Not sure yet",
                ]}
              />
              <FormTextarea
                label="What's the challenge?"
                name="challenge"
                required
                placeholder="A few sentences on what you're working on, what's not working, or what you'd like help with."
                rows={4}
              />
              <FormField label="How did you find me?" name="source" placeholder="Optional" />

              {error && (
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    color: "rgb(160,70,50)",
                    marginBottom: 12,
                    padding: "10px 14px",
                    background: "rgba(180,80,60,0.06)",
                    border: "1px solid rgba(180,80,60,0.2)",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 12,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  padding: "14px 32px",
                  background: submitting ? lightGray : espresso,
                  color: cream,
                  border: "none",
                  fontWeight: 600,
                  cursor: submitting ? "wait" : "pointer",
                  transition: "all 0.3s",
                  width: "100%",
                  marginTop: 8,
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.target.style.background = gold;
                    e.target.style.color = espresso;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting) {
                    e.target.style.background = espresso;
                    e.target.style.color = cream;
                  }
                }}
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>

              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  color: lightGray,
                  textAlign: "center",
                  marginTop: 16,
                  lineHeight: 1.5,
                }}
              >
                Or email directly at{" "}
                <a href="mailto:contact@rubypatra.com" style={{ color: gold, textDecoration: "none" }}>
                  contact@rubypatra.com
                </a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
