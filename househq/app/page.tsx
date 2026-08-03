import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Storefront from "@/components/Storefront";
import ContactForm from "@/components/ContactForm";
import NotifyForm from "@/components/NotifyForm";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <section className="hero-banner">
        <svg viewBox="0 0 1100 220" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="1100" height="220" rx="6" fill="var(--kraft)" />
          <rect
            x="0"
            y="0"
            width="1100"
            height="220"
            rx="6"
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
          />
          <g transform="translate(70,40) rotate(-6)">
            <rect width="230" height="150" rx="4" fill="var(--white)" stroke="var(--line)" />
          </g>
          <g transform="translate(95,32) rotate(3)">
            <rect width="230" height="150" rx="4" fill="var(--paper)" stroke="var(--line)" />
            <line x1="24" y1="34" x2="180" y2="34" stroke="var(--slate)" strokeWidth="3" opacity="0.35" />
            <line x1="24" y1="52" x2="150" y2="52" stroke="var(--slate)" strokeWidth="3" opacity="0.25" />
            <rect x="24" y="76" width="16" height="16" rx="2" fill="none" stroke="var(--verified)" strokeWidth="2.5" />
            <path d="M27 84 L32 89 L40 79" fill="none" stroke="var(--verified)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="50" y1="84" x2="190" y2="84" stroke="var(--slate)" strokeWidth="3" opacity="0.3" />
            <rect x="24" y="108" width="16" height="16" rx="2" fill="none" stroke="var(--verified)" strokeWidth="2.5" />
            <path d="M27 116 L32 121 L40 111" fill="none" stroke="var(--verified)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="50" y1="116" x2="170" y2="116" stroke="var(--slate)" strokeWidth="3" opacity="0.3" />
          </g>
          <g transform="translate(430,38)">
            <circle cx="72" cy="72" r="70" fill="none" stroke="var(--stamp)" strokeWidth="3" transform="rotate(-8 72 72)" />
            <circle cx="72" cy="72" r="58" fill="none" stroke="var(--stamp)" strokeWidth="1" opacity="0.5" transform="rotate(-8 72 72)" />
            <text x="72" y="52" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fontSize="12" fill="var(--stamp)" letterSpacing="1" transform="rotate(-8 72 72)">VERIFIED</text>
            <text x="72" y="72" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fontSize="10.5" fill="var(--stamp)" letterSpacing="0.3" transform="rotate(-8 72 72)">AUSTRALIAN</text>
            <text x="72" y="86" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fontSize="10.5" fill="var(--stamp)" letterSpacing="0.3" transform="rotate(-8 72 72)">RULES &amp; REGULATIONS</text>
            <text x="72" y="104" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontWeight="500" fontSize="8.5" fill="var(--stamp)" letterSpacing="0.3" transform="rotate(-8 72 72)">UPDATED MONTHLY</text>
          </g>
          <text x="660" y="90" fontFamily="Fraunces, serif" fontWeight="600" fontSize="34" fill="var(--ink)">Property paperwork,</text>
          <text x="660" y="132" fontFamily="Fraunces, serif" fontWeight="600" fontSize="34" fill="var(--ink)">
            <tspan fontStyle="italic" fill="var(--stamp)">sorted</tspan> — nationally.
          </text>
          <text x="660" y="165" fontFamily="IBM Plex Mono, monospace" fontWeight="500" fontSize="12" fill="var(--slate)" letterSpacing="0.5">104 CHECKLISTS · 8 STATES &amp; TERRITORIES</text>
        </svg>
      </section>

      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">The only checklist site built only for Australia</div>
            <h1>Read this before you sign anything.</h1>
            <p>
              We put together checklists for buying, renting, investing and
              selling in Australia. Checked against what your state
              government actually says, not a generic template written for a
              US or UK audience and relabelled.
            </p>
            <div className="hero-actions">
              <a href="#catalog" className="btn-primary">
                Browse All Checklists
              </a>
              <a href="#how-it-works" className="btn-secondary">
                How we fact-check
              </a>
            </div>
            <div className="price-note">
              Under $10 each · built for Australia · instant PDF · no account
              needed
            </div>
          </div>
          <div className="stamp">
            <div className="stamp-text" style={{ fontSize: 9.5 }}>
              Verified
              <span className="big" style={{ fontSize: 11 }}>
                Australian Rules
                <br />
                &amp; Regulations
              </span>
              Updated monthly
            </div>
          </div>
        </div>
      </section>

      <Storefront />

      <section id="how-it-works">
        <div className="section-head">
          <div className="section-label">Why trust this</div>
          <h2>We&apos;re not trying to sell you a loan</h2>
        </div>
        <div className="trust-grid">
          <div className="trust-item">
            <div className="trust-num">01</div>
            <h4>We go to the source</h4>
            <p>
              State Revenue Office, Consumer Affairs, the actual legislation.
              We&apos;re not rewriting some other blog&apos;s blog post.
            </p>
          </div>
          <div className="trust-item">
            <div className="trust-num">02</div>
            <h4>No commission, no agenda</h4>
            <p>
              We&apos;re not a broker or a removalist. There&apos;s nothing
              here written to push you toward a lender or a service we get
              paid for.
            </p>
          </div>
          <div className="trust-item">
            <div className="trust-num">03</div>
            <h4>We update these</h4>
            <p>
              Grants and thresholds change every budget. Each checklist has a
              last-checked date so you know how current it is.
            </p>
          </div>
        </div>
      </section>

      <section id="about">
        <div className="about-wrap">
          <div className="section-head">
            <div className="section-label">Who&apos;s behind this</div>
            <h2>Why we built this</h2>
          </div>
          <p>
            Buying a house, renting a place, sorting out a sale — you end up
            with fifteen tabs open. A mortgage broker&apos;s blog, a
            removalist&apos;s blog, some government page written for lawyers.
            None of it&apos;s written for you, and half of it&apos;s trying to
            sell you something on the way through.
          </p>
          <p>
            That&apos;s basically the whole reason this exists. Every
            checklist here comes from primary sources — state revenue
            offices, tenancy authorities, actual legislation — instead of
            someone else&apos;s article with the wording changed. We&apos;re
            not a brokerage or a real estate agency. We don&apos;t get a
            kickback for pointing you at a particular lender.
          </p>
          <p>
            We started with Victoria, then kept going until every state and
            territory was covered, because &quot;just check your
            state&apos;s rules&quot; is a lot easier to say than to actually
            do.
          </p>
          <div className="about-stats">
            <div className="about-stat">
              <div className="num">104</div>
              <div className="label">Checklists published</div>
            </div>
            <div className="about-stat">
              <div className="num">8</div>
              <div className="label">States &amp; territories covered</div>
            </div>
            <div className="about-stat">
              <div className="num">$0</div>
              <div className="label">
                Commission earned from lenders or brokers
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="agents" className="coming-soon-section">
        <div className="wrap" style={{ padding: "64px 0" }}>
          <div className="section-head">
            <div className="section-label">What&apos;s next</div>
            <h2>What we&apos;re building next</h2>
          </div>
          <div className="cs-grid">
            <div className="cs-card">
              <div className="cs-stamp">Coming soon</div>
              <h3>Property metrics &amp; tools</h3>
              <p>
                Not sure what to actually look for in a property? We&apos;re
                building tools to help you work that out before you buy.
              </p>
              <ul className="cs-list">
                <li>Suburb and comparable sales checklists</li>
                <li>Yield, growth and affordability calculators</li>
                <li>A proper checklist for inspection day</li>
              </ul>
              <NotifyForm list="tools" placeholder="Your email address" />
            </div>
            <div className="cs-card">
              <div className="cs-stamp">Coming soon</div>
              <h3>Agent &amp; broker partnerships</h3>
              <p>
                If you&apos;re an agent or broker, we&apos;re setting up a way
                to hand clients something better than a business card.
              </p>
              <ul className="cs-list">
                <li>Branded checklist bundles for your agency</li>
                <li>Disclosed referral commission per client</li>
                <li>No software to learn, just hand it over</li>
              </ul>
              <NotifyForm list="agents" placeholder="Agency email address" />
            </div>
            <div className="cs-card">
              <div className="cs-stamp">Coming soon</div>
              <h3>More guides, not just checklists</h3>
              <p>
                The 104 checklists cover every state now. Next we&apos;re
                building the deeper stuff a checklist can&apos;t fully cover
                on its own.
              </p>
              <ul className="cs-list">
                <li>An interactive stamp duty &amp; grant calculator</li>
                <li>A free 5-day First Home Buyer email course</li>
                <li>Longer guides on the trickier situations</li>
              </ul>
              <NotifyForm list="guides" placeholder="Your email address" />
            </div>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="faq-wrap">
          <div className="section-head">
            <div className="section-label">Questions</div>
            <h2>Frequently asked questions</h2>
          </div>

          <details className="faq-item" open>
            <summary>Is this legal, financial, or tax advice?</summary>
            <p>
              No, and we&apos;re not going to pretend it is. It&apos;s general
              info, checked against state government sources, and it&apos;s a
              good starting point — but talk to an actual conveyancer,
              solicitor, broker or accountant before you make a real
              decision. They know your situation, we don&apos;t.
            </p>
          </details>

          <details className="faq-item">
            <summary>How do you make sure it&apos;s actually accurate?</summary>
            <p>
              We check it against the source, not against other websites.
              State Revenue Office, Consumer Affairs, NSW Fair Trading, the
              RTA in Queensland, that kind of thing. Each checklist has a
              date on it showing when it was last checked, and we go back and
              update them as budgets and laws change.
            </p>
          </details>

          <details className="faq-item">
            <summary>
              I live in one state but I&apos;m buying in another — which
              checklist do I need?
            </summary>
            <p>
              Go by where the property is, not where you live. Stamp duty,
              tenancy rules, cooling-off periods — all of it&apos;s set state
              by state, so a Victorian checklist won&apos;t help you much if
              you&apos;re buying in Queensland.
            </p>
          </details>

          <details className="faq-item">
            <summary>What if I want a refund?</summary>
            <p>
              If a file&apos;s broken or won&apos;t open, tell us and
              we&apos;ll fix it or refund you, no argument. What we don&apos;t
              do is refund a checklist just because you changed your mind
              after downloading it — that&apos;s standard for digital
              products. Full details are in the{" "}
              <a href="/legal/refund" className="link-inline">
                Refund Policy
              </a>
              .
            </p>
          </details>

          <details className="faq-item">
            <summary>Why pay when there&apos;s free stuff online?</summary>
            <p>
              Because a lot of that &quot;free stuff&quot; is a broker or a
              removalist trying to sell you something, and the actual useful
              bits are spread across ten different tabs. We&apos;ve put it in
              one place, written it ourselves, and we&apos;re not trying to
              upsell you a loan.
            </p>
          </details>

          <details className="faq-item">
            <summary>Are you selling my details to anyone?</summary>
            <p>
              No. Your email gets used to send you what you bought, and if
              you opt in separately, occasional updates about new
              checklists. That&apos;s it. It&apos;s all in the{" "}
              <a href="/legal/privacy" className="link-inline">
                Privacy Policy
              </a>{" "}
              if you want the fine print.
            </p>
          </details>

          <details className="faq-item">
            <summary>Can agents use these with clients?</summary>
            <p>
              That&apos;s exactly what we&apos;re building — see the agent
              partnership card above. Pop your email in there and
              we&apos;ll let you know when it&apos;s ready to go.
            </p>
          </details>
        </div>
      </section>

      <section id="contact">
        <div className="contact-wrap">
          <div className="section-head">
            <div className="section-label">Get in touch</div>
            <h2>Contact Us</h2>
          </div>
          <p style={{ fontSize: 14, color: "var(--slate)", marginBottom: 8 }}>
            Got a question about a checklist, want to order a batch for your
            agency, or something else entirely — just send it through.
          </p>
          <ContactForm />
        </div>
      </section>

      <section id="disclaimer" className="disclaimer-section">
        <div className="wrap" style={{ padding: "48px 0" }}>
          <div className="disclaimer-wrap">
            <div className="section-label" style={{ marginBottom: 14 }}>
              General information disclaimer
            </div>
            <p>
              <strong>
                Everything on this site and in our checklists is general
                information — nothing more.
              </strong>{" "}
              It&apos;s not financial, legal, tax or personal advice, and it
              doesn&apos;t know anything about your specific situation.
              Property, tax and legal circumstances are different for
              everyone, so before you make a real purchasing, financial or
              legal decision, talk to someone qualified — a conveyancer,
              solicitor, mortgage broker, financial adviser or accountant.
            </p>
            <p style={{ marginTop: 12 }}>
              We check each checklist against current Australian state and
              federal sources when it&apos;s published, and each one shows
              its last-checked date. But grant amounts, thresholds and
              legislation change with every budget, so confirm anything that
              actually matters to your decision with the relevant government
              authority before you rely on it.
            </p>
            <p style={{ marginTop: 12 }}>
              For the full legal terms, see our{" "}
              <a href="/legal/privacy" style={{ color: "var(--ink)" }}>
                Privacy Policy
              </a>
              ,{" "}
              <a href="/legal/terms" style={{ color: "var(--ink)" }}>
                Terms &amp; Conditions
              </a>
              , and{" "}
              <a href="/legal/refund" style={{ color: "var(--ink)" }}>
                Refund Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
