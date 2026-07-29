import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="logo" style={{ marginBottom: 12 }}>
            <span className="logo-mark">✓</span>HouseHQ
          </div>
          <p style={{ fontSize: 13, color: "var(--slate)", maxWidth: 240 }}>
            Property checklists checked state by state. General info only,
            not advice.
          </p>
        </div>
        <div>
          <h5>Checklists</h5>
          <ul>
            <li>
              <Link href="/#catalog">First Home Buyers</Link>
            </li>
            <li>
              <Link href="/#catalog">Renters</Link>
            </li>
            <li>
              <Link href="/#catalog">Investors</Link>
            </li>
            <li>
              <Link href="/#catalog">Sellers</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            <li>
              <Link href="/#about">About</Link>
            </li>
            <li>
              <Link href="/#agents">For Agents</Link>
            </li>
            <li>
              <Link href="/#contact">Contact</Link>
            </li>
            <li>
              <Link href="/#faq">FAQ</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5>Legal</h5>
          <ul>
            <li>
              <Link href="/legal/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/legal/terms">Terms &amp; Conditions</Link>
            </li>
            <li>
              <Link href="/legal/refund">Refund Policy</Link>
            </li>
            <li>
              <Link href="/#disclaimer">General Info Disclaimer</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} HouseHQ. ABN [pending registration].</span>
        <span>General information only — not financial, legal or tax advice.</span>
      </div>
    </footer>
  );
}
