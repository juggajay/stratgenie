import Link from "next/link";
import "./landing-v2-styles.css";

// SVG Icons as components
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const DollarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const MessageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const SimpleCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function LandingPage() {
  return (
    <main className="landing-v2">
      {/* HEADER */}
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <Link href="/" className="logo-link">
              <span className="logo-text">Strata<span>Genie</span></span>
            </Link>
            <Link href="/sign-in" className="header-cta">Sign In</Link>
          </div>
        </div>
      </header>

      {/* SECTION A: THE HOOK */}
      <section className="hero">
        <div className="hero-decor hero-decor-1"></div>
        <div className="hero-decor hero-decor-2"></div>

        <div className="container">
          <div className="hero-grid">
            <div className="hero-text">
              {/* Pre-headline: Call out the audience */}
              <div className="pre-headline animate-fade-up">
                For Self-Managed Strata Committees
              </div>

              {/* H1: Dream Outcome */}
              <h1 className="animate-fade-up delay-1">
                Self-Manage With <em>Confidence</em>, Not Anxiety
              </h1>

              {/* Sub-headline */}
              <p className="hero-sub animate-fade-up delay-2">
                You chose to self-manage. Now get the backup you deserve. StrataGenie tracks every deadline, answers every bylaw question, and makes sure you <strong>never miss a compliance requirement</strong>. So you can finally stop worrying.
              </p>

              {/* CTA Group */}
              <div className="cta-group animate-fade-up delay-3">
                <a href="#offer" className="cta-primary">
                  See How It Works
                  <ArrowRightIcon />
                </a>
                <Link href="/sign-up" className="cta-secondary">
                  Start Free Trial
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="trust-row animate-fade-up delay-4">
                <div className="trust-item">
                  <CheckIcon />
                  No credit card required
                </div>
                <div className="trust-item">
                  <CheckIcon />
                  Setup in 5 minutes
                </div>
                <div className="trust-item">
                  <CheckIcon />
                  Cancel anytime
                </div>
              </div>
            </div>

            {/* Hero Visual: Product UI */}
            <div className="hero-visual">
              <div className="float-card top-left">
                <div className="float-value accent">0</div>
                <div className="float-label">Missed Deadlines</div>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-header">
                  <span className="dashboard-title">Compliance Status</span>
                  <span className="status-badge">
                    <CheckIcon />
                    All Clear
                  </span>
                </div>

                <div className="compliance-list">
                  <div className="compliance-row">
                    <div className="compliance-left">
                      <div className="compliance-icon active">
                        <CalendarIcon />
                      </div>
                      <div>
                        <div className="compliance-name">Annual General Meeting</div>
                        <div className="compliance-date">March 15, 2026</div>
                      </div>
                    </div>
                    <span className="compliance-status upcoming">Upcoming</span>
                  </div>

                  <div className="compliance-row">
                    <div className="compliance-left">
                      <div className="compliance-icon">
                        <FileIcon />
                      </div>
                      <div>
                        <div className="compliance-name">Strata Hub Report</div>
                        <div className="compliance-date">June 15, 2026</div>
                      </div>
                    </div>
                    <span className="compliance-status soon">Due Soon</span>
                  </div>

                  <div className="compliance-row">
                    <div className="compliance-left">
                      <div className="compliance-icon">
                        <DollarIcon />
                      </div>
                      <div>
                        <div className="compliance-name">Financial Year End</div>
                        <div className="compliance-date">December 31, 2025</div>
                      </div>
                    </div>
                    <span className="compliance-status done">Complete</span>
                  </div>
                </div>
              </div>

              <div className="float-card bottom-right">
                <div className="float-value">Instant</div>
                <div className="float-label accent">Expert Answers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="social-proof-bar">
        <div className="container">
          <div className="proof-flex">
            <div className="proof-stat">
              <div className="proof-number">500+</div>
              <div className="proof-label">Schemes Using StrataGenie</div>
            </div>
            <div className="proof-divider"></div>
            <div className="proof-stat">
              <div className="proof-number">$180K</div>
              <div className="proof-label">Fines Prevented</div>
            </div>
            <div className="proof-divider"></div>
            <div className="proof-stat">
              <div className="proof-number">4.9/5</div>
              <div className="proof-label">Committee Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: THE ARGUMENT */}
      <section className="argument">
        <div className="container">

          {/* Problem Section */}
          <div className="problem-section">
            <span className="section-label">The Hard Truth</span>
            <h2 className="section-headline">
              Self-managing is <em>lonely</em>. And that&apos;s the problem.
            </h2>
            <p className="problem-description">
              You made the right choice to self-manage. But now you&apos;re on your own—Googling at midnight, second-guessing every decision, and hoping you haven&apos;t missed something that could cost your building thousands.
            </p>

            <div className="problem-grid">
              <div className="problem-card">
                <div className="problem-number">01</div>
                <h3>No One to Ask</h3>
                <p>&ldquo;Can they install that? Is this bylaw enforceable? When is the AGM actually due?&rdquo; You&apos;re making decisions alone with no expert to call when you&apos;re unsure.</p>
              </div>

              <div className="problem-card">
                <div className="problem-number">02</div>
                <h3>Constant Second-Guessing</h3>
                <p>Did you file that form correctly? Is the Strata Hub Report due in 3 months or 4? You&apos;re always worried you&apos;ve forgotten something critical.</p>
              </div>

              <div className="problem-card">
                <div className="problem-number">03</div>
                <h3>Fear of the Invisible Mistake</h3>
                <p>The Strata Schemes Management Act has 271 sections. You can&apos;t know them all. What if there&apos;s a deadline you don&apos;t even know exists?</p>
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div className="solution-section">
            <div className="solution-content">
              <span className="section-label">Your Backup Team</span>
              <h3 className="solution-headline">
                Like having a compliance expert on call. 24/7.
              </h3>
              <p className="solution-description">
                StrataGenie is the safety net self-managed committees deserve. We watch every deadline so you don&apos;t have to remember. We answer bylaw questions in seconds so you never feel unsure. You&apos;re not alone anymore.
              </p>

              <div className="benefit-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <CheckIcon />
                  </div>
                  <div className="benefit-text">
                    <h4>Never Miss a Deadline Again</h4>
                    <p>AGM, Strata Hub, AFSS—all tracked automatically with advance reminders</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <MessageIcon />
                  </div>
                  <div className="benefit-text">
                    <h4>Ask Anything, Anytime</h4>
                    <p>Guardian AI answers bylaw questions instantly with citations from your actual documents</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <div className="benefit-icon">
                    <ShieldIcon />
                  </div>
                  <div className="benefit-text">
                    <h4>Know You&apos;re Covered</h4>
                    <p>Every compliance requirement tracked. Nothing slips through the cracks.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="solution-visual">
              <div className="feature-card">
                <div className="feature-header">
                  <div className="feature-badge">
                    <MessageIcon />
                  </div>
                  <div>
                    <div className="feature-title">Guardian AI</div>
                    <div className="feature-subtitle">Your bylaw expert on demand</div>
                  </div>
                </div>

                <div className="chat-bubbles">
                  <div className="chat-bubble user">
                    Can residents install air conditioning on their balcony?
                  </div>
                  <div className="chat-bubble ai">
                    According to By-law 7.3, owners may install air conditioning units on balconies subject to committee approval. The unit must not exceed 65 decibels and must match the building&apos;s color scheme. Submit Form B-2 to the committee at least 14 days before installation.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION C: THE TRUST */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-header">
            <span className="section-label">You&apos;re Not Alone</span>
            <h2 className="section-headline" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              500+ committees stopped <em>worrying</em> and started knowing
            </h2>
          </div>

          {/* Featured Testimonial */}
          <div className="testimonial-featured">
            <p className="testimonial-quote">
              &ldquo;Before StrataGenie, I was Googling strata law at 11pm and still not sure I was right. Now I just ask Guardian AI and get an answer in seconds—<em>with the exact bylaw reference</em>. Last month it reminded me about our Strata Hub report I&apos;d completely forgotten. I finally feel like I know what I&apos;m doing.&rdquo;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SM</div>
              <div className="author-info">
                <h4>Sarah Mitchell</h4>
                <p>Secretary, Harbourview Apartments (32 units) — Self-managed since 2021</p>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">500+</div>
              <div className="metric-label">Self-Managed Schemes</div>
              <div className="metric-description">Trust StrataGenie as their compliance safety net</div>
            </div>

            <div className="metric-card">
              <div className="metric-value">0</div>
              <div className="metric-label">Compliance Fines</div>
              <div className="metric-description">Across all active schemes. Not one. Ever.</div>
            </div>

            <div className="metric-card">
              <div className="metric-value">30 sec</div>
              <div className="metric-label">Average Answer Time</div>
              <div className="metric-description">For bylaw questions via Guardian AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D: THE CLOSER */}
      <section className="closer" id="offer">
        <div className="container">
          <div className="closer-grid">

            {/* Offer Recap */}
            <div className="offer-card">
              <span className="offer-badge">Early Bird Offer</span>
              <h3 className="offer-title">Start Your Free 14-Day Trial</h3>
              <p className="offer-subtitle">Full access. No credit card. Cancel anytime.</p>

              <ul className="offer-list">
                <li>
                  <SimpleCheckIcon />
                  Automatic AGM & Strata Hub deadline tracking
                </li>
                <li>
                  <SimpleCheckIcon />
                  AI-powered invoice processing
                </li>
                <li>
                  <SimpleCheckIcon />
                  Guardian AI for instant bylaw Q&A
                </li>
                <li>
                  <SimpleCheckIcon />
                  Levy calculator & strata roll management
                </li>
                <li>
                  <SimpleCheckIcon />
                  Compliance document vault
                </li>
              </ul>

              <div className="price-row">
                <span className="price-current">$14.99</span>
                <span className="price-period">/ month per lot</span>
              </div>

              <Link href="/sign-up" className="offer-cta">
                Start Free Trial
                <ArrowRightIcon />
              </Link>

              {/* Guarantee */}
              <div className="guarantee-box">
                <div className="guarantee-text">
                  <strong>30-Day Money-Back Guarantee</strong>
                  <span>If StrataGenie doesn&apos;t save you time, full refund. No questions.</span>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="faq-section">
              <h3 className="faq-title">Common Questions</h3>

              <div className="faq-list">
                <div className="faq-item">
                  <div className="faq-question">We&apos;ve been self-managing for years. Do we really need this?</div>
                  <p className="faq-answer">If you&apos;ve never worried about missing a deadline at 2am, no. But most self-managed committees tell us the anxiety never fully goes away—until they have a system watching their back. StrataGenie gives you certainty.</p>
                </div>

                <div className="faq-item">
                  <div className="faq-question">How does Guardian AI actually work?</div>
                  <p className="faq-answer">Upload your bylaws once. Then ask questions in plain English like &ldquo;Can residents have dogs?&rdquo; Guardian AI reads your actual documents and gives you the answer with the exact clause reference. No more Googling or guessing.</p>
                </div>

                <div className="faq-item">
                  <div className="faq-question">What if there&apos;s a deadline I don&apos;t even know about?</div>
                  <p className="faq-answer">That&apos;s the point. StrataGenie knows every compliance requirement in the Act—AGM, Strata Hub Reports, AFSS, insurance, all of it. We track what you don&apos;t know you&apos;re missing.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <h2>Stop worrying. <em>Start knowing.</em></h2>
          <p>Join 500+ self-managed committees who finally have the backup they deserve.</p>

          <Link href="/sign-up" className="cta-primary">
            Start My Free Trial
            <ArrowRightIcon />
          </Link>

          <div className="final-trust">
            <ShieldIcon />
            No credit card required. No commitment. No risk.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 StrataGenie. Built for Australian strata committees.</p>
        </div>
      </footer>
    </main>
  );
}
