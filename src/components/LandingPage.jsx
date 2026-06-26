import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

/* ── Counter hook for animated numbers ── */
function useCounter(target, duration = 1600, trigger) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return val;
}

const LandingPage = ({ isLoggedIn }) => {
  const [faqOpen, setFaqOpen] = useState(0);
  const [ringVisible, setRingVisible] = useState(false);
  const ringRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRingVisible(true); }, { threshold: 0.3 });
    if (ringRef.current) obs.observe(ringRef.current);
    return () => obs.disconnect();
  }, []);

  const c1 = useCounter(128, 1400, ringVisible);
  const c2 = useCounter(94, 1600, ringVisible);
  const c3 = useCounter(30, 1200, ringVisible);

  const faqs = [
    { q: 'How does brandsparkx capture leads?', a: 'Leads flow in automatically from your website forms, ads, WhatsApp, and LinkedIn — all routed into one secure dashboard with zero manual entry.' },
    { q: 'Can my whole team use it at once?', a: 'Yes. Every team member sees the same live pipeline in real time, so nothing falls through the cracks and ownership is always clear.' },
    { q: 'Do I need technical skills to set it up?', a: 'Not at all. The capture form and dashboard work out of the box. Assign owners, change statuses, and export reports with a click.' },
    { q: 'Is my data safe?', a: 'All leads are stored in your own secure database. You control access, and you can export everything to CSV anytime.' },
  ];

  const testimonials = [
    { name: 'Meera Nair', role: 'Founder, PixelCraft Agency', text: 'We stopped losing leads in WhatsApp overnight. Conversions jumped 30% in the first month.', initial: 'M' },
    { name: 'Arjun Rao', role: 'Growth Lead, ScaleUp Media', text: 'The dashboard is so clean my whole team actually uses it. Best CRM decision we made.', initial: 'A' },
    { name: 'Divya Shetty', role: 'Director, BrandLoop', text: 'Capturing from 4 channels into one place saved us hours every week. Worth every rupee.', initial: 'D' },
  ];

  return (
    <div className="land">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">⚡ Built for digital marketing agencies</div>
          <h1 className="hero-h1">
            Turn scattered enquiries into <span className="hero-grad">confirmed clients.</span>
          </h1>
          <p className="hero-sub">
            brandsparkx CRM captures every lead from your website, ads, WhatsApp, and LinkedIn — then tracks each one through to a closed deal. No more leads lost in DMs.
          </p>
          <div className="hero-cta">
            <Link to="/capture" className="cta-primary">Capture a Lead →</Link>
            <Link to={isLoggedIn ? '/admin/dashboard' : '/login'} className="cta-ghost">
              {isLoggedIn ? 'Go to Dashboard' : 'Agency Login'}
            </Link>
          </div>
          <div className="hero-trust">
            <span>★★★★★</span> Trusted by 200+ agencies across India
          </div>
        </div>

        {/* ── KANBAN HERO VISUAL ── */}
        <div className="hero-visual">
          <div className="kb-board">
            <div className="kb-col">
              <div className="kb-col-header kb-new">New</div>
              <div className="kb-card kb-card-1">
                <div className="kb-avatar kb-av-blue">R</div>
                <div className="kb-info"><div className="kb-name">Riya Mehta</div><div className="kb-src">Website</div></div>
                <div className="kb-tag hot">Hot</div>
              </div>
              <div className="kb-card kb-card-2">
                <div className="kb-avatar kb-av-purple">K</div>
                <div className="kb-info"><div className="kb-name">Kiran Shah</div><div className="kb-src">LinkedIn</div></div>
                <div className="kb-tag warm">Warm</div>
              </div>
            </div>
            <div className="kb-col">
              <div className="kb-col-header kb-prog">In Progress</div>
              <div className="kb-card kb-card-3">
                <div className="kb-avatar kb-av-green">A</div>
                <div className="kb-info"><div className="kb-name">Arjun Patel</div><div className="kb-src">Ads</div></div>
                <div className="kb-tag hot">Hot</div>
              </div>
              <div className="kb-card kb-card-glide">
                <div className="kb-avatar kb-av-amber">S</div>
                <div className="kb-info"><div className="kb-name">Sneha Roy</div><div className="kb-src">WhatsApp</div></div>
                <div className="kb-tag warm">Warm</div>
              </div>
            </div>
            <div className="kb-col">
              <div className="kb-col-header kb-closed">Closed ✓</div>
              <div className="kb-card kb-card-4">
                <div className="kb-avatar kb-av-rose">D</div>
                <div className="kb-info"><div className="kb-name">Dev Kumar</div><div className="kb-src">Referral</div></div>
                <div className="kb-check">✓</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAT STRIP ── */}
      <section className="stat-strip">
        <div className="ss-item"><div className="ss-num">100%</div><div className="ss-lbl">Lead capture rate</div></div>
        <div className="ss-item"><div className="ss-num">4</div><div className="ss-lbl">Channels unified</div></div>
        <div className="ss-item"><div className="ss-num">30%</div><div className="ss-lbl">Higher conversions</div></div>
        <div className="ss-item"><div className="ss-num">0</div><div className="ss-lbl">Leads lost</div></div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section">
        <h2 className="sec-title">Everything you need to close more deals</h2>
        <p className="sec-sub">One platform to capture, track, and convert — built for speed.</p>
        <div className="features">
          <div className="feat"><div className="feat-ico ico-1">⚡</div><h3>Instant Capture</h3><p>Public forms route incoming inquiries straight into your secure database — no manual copy-paste.</p></div>
          <div className="feat"><div className="feat-ico ico-2">📊</div><h3>Live Dashboard</h3><p>Real-time stats, source breakdowns, and conversion rates keep your whole team on the same page.</p></div>
          <div className="feat"><div className="feat-ico ico-3">⚙️</div><h3>Smart Workflows</h3><p>Assign ownership, change status, and log next steps from a dedicated lead processing board.</p></div>
          <div className="feat"><div className="feat-ico ico-4">🏷️</div><h3>Priority Tags</h3><p>Mark leads Hot, Warm, or Cold so your team always works the highest-value opportunities first.</p></div>
          <div className="feat"><div className="feat-ico ico-5">📝</div><h3>Notes & History</h3><p>Keep call summaries and a full activity timeline on every lead — never lose context again.</p></div>
          <div className="feat"><div className="feat-ico ico-6">↓</div><h3>CSV Export</h3><p>Export your entire pipeline to a spreadsheet in one click for reports and analysis.</p></div>
        </div>
      </section>

      {/* ── CHANNEL FUNNEL ── */}
      <section className="section funnel-section">
        <h2 className="sec-title">Every channel. One pipeline.</h2>
        <p className="sec-sub">Leads pour in from everywhere — brandsparkx catches every single one.</p>
        <div className="funnel-wrap">
          <div className="funnel-sources">
            <div className="fsrc fsrc-1"><span>🌐</span>Website</div>
            <div className="fsrc fsrc-2"><span>📢</span>Ads</div>
            <div className="fsrc fsrc-3"><span>💬</span>WhatsApp</div>
            <div className="fsrc fsrc-4"><span>💼</span>LinkedIn</div>
          </div>
          <div className="funnel-arrows">
            <div className="farrow farrow-1"></div>
            <div className="farrow farrow-2"></div>
            <div className="farrow farrow-3"></div>
            <div className="farrow farrow-4"></div>
          </div>
          <div className="funnel-center">
            <div className="funnel-logo">b</div>
            <div className="funnel-label">brandsparkx CRM</div>
          </div>
          <div className="funnel-out-arrow"></div>
          <div className="funnel-result">
            <span className="funnel-check">✓</span> Confirmed Client
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section">
        <h2 className="sec-title">Simple, transparent pricing</h2>
        <p className="sec-sub">Start free. Upgrade when you grow.</p>
        <div className="pricing">
          <div className="price-card">
            <div className="price-name">Starter</div>
            <div className="price-amt">₹0<span>/mo</span></div>
            <div className="price-desc">For solo founders getting started</div>
            <ul className="price-list">
              <li>✓ Up to 100 leads</li>
              <li>✓ Lead capture form</li>
              <li>✓ Basic dashboard</li>
              <li>✓ CSV export</li>
            </ul>
            <Link to="/capture" className="price-btn ghost">Get started</Link>
          </div>
          <div className="price-card featured">
            <div className="price-tag">Most popular</div>
            <div className="price-name">Growth</div>
            <div className="price-amt">₹1,499<span>/mo</span></div>
            <div className="price-desc">For growing agencies</div>
            <ul className="price-list">
              <li>✓ Unlimited leads</li>
              <li>✓ Priority tags & notes</li>
              <li>✓ Workflow automation</li>
              <li>✓ Team collaboration</li>
              <li>✓ Advanced analytics</li>
            </ul>
            <Link to={isLoggedIn?'/admin/dashboard':'/login'} className="price-btn primary">Start free trial</Link>
          </div>
          <div className="price-card">
            <div className="price-name">Enterprise</div>
            <div className="price-amt">Custom</div>
            <div className="price-desc">For large teams & studios</div>
            <ul className="price-list">
              <li>✓ Everything in Growth</li>
              <li>✓ Dedicated support</li>
              <li>✓ Custom integrations</li>
              <li>✓ SLA & onboarding</li>
            </ul>
            <a href="#contact" className="price-btn ghost">Contact sales</a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <h2 className="sec-title">Loved by agencies like yours</h2>
        <p className="sec-sub">Don't take our word for it.</p>
        <div className="testimonials">
          {testimonials.map((t,i)=>(
            <div className="tcard" key={i}>
              <div className="tstars">★★★★★</div>
              <p className="ttext">"{t.text}"</p>
              <div className="tauthor">
                <div className="tavatar">{t.initial}</div>
                <div><div className="tname">{t.name}</div><div className="trole">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONVERSION RING ── */}
      <section className="section ring-section" ref={ringRef}>
        <h2 className="sec-title">Results that speak</h2>
        <p className="sec-sub">Agencies using brandsparkx see measurable impact from day one.</p>
        <div className="ring-grid">
          <div className="ring-card">
            <svg className="ring-svg" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="url(#rg1)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray="314"
                strokeDashoffset={ringVisible ? 314 * (1 - 128/150) : 314}
                style={{transition:'stroke-dashoffset 1.6s ease',transformOrigin:'center',transform:'rotate(-90deg)'}}/>
              <defs><linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="var(--primary)"/><stop offset="100%" stopColor="var(--primary-2)"/></linearGradient></defs>
            </svg>
            <div className="ring-num">{c1}+</div>
            <div className="ring-lbl">Leads captured monthly</div>
          </div>
          <div className="ring-card">
            <svg className="ring-svg" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="url(#rg2)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray="314"
                strokeDashoffset={ringVisible ? 314 * (1 - 94/100) : 314}
                style={{transition:'stroke-dashoffset 1.6s ease',transformOrigin:'center',transform:'rotate(-90deg)'}}/>
              <defs><linearGradient id="rg2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#34d399"/></linearGradient></defs>
            </svg>
            <div className="ring-num">{c2}%</div>
            <div className="ring-lbl">Zero-loss capture rate</div>
          </div>
          <div className="ring-card">
            <svg className="ring-svg" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="url(#rg3)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray="314"
                strokeDashoffset={ringVisible ? 314 * (1 - 30/50) : 314}
                style={{transition:'stroke-dashoffset 1.6s ease',transformOrigin:'center',transform:'rotate(-90deg)'}}/>
              <defs><linearGradient id="rg3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient></defs>
            </svg>
            <div className="ring-num">+{c3}%</div>
            <div className="ring-lbl">Higher conversions avg.</div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section faq-section">
        <h2 className="sec-title">Frequently asked questions</h2>
        <div className="faq">
          {faqs.map((f,i)=>(
            <div className={`faq-item ${faqOpen===i?'open':''}`} key={i} onClick={()=>setFaqOpen(faqOpen===i?-1:i)}>
              <div className="faq-q">{f.q}<span className="faq-chev">{faqOpen===i?'−':'+'}</span></div>
              {faqOpen===i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner" id="contact">
        <h2>Ready to stop losing leads?</h2>
        <p>Join 200+ agencies converting more enquiries with brandsparkx.</p>
        <Link to="/capture" className="cta-primary lg">Capture your first lead →</Link>
      </section>
    </div>
  );
};

export default LandingPage;
