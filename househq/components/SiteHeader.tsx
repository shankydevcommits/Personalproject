import Link from "next/link";
import HouseHQLogo from "./HouseHQLogo";

export default function SiteHeader() {
  return (
    <>
      <div className="ticker">
        <Link href="/#catalog">
          <div className="ticker-track">
            {[0, 1, 2].map((i) => (
              <span key={i}>
                <span className="hot">🔥 HOT RIGHT NOW —</span>New SMSF
                borrowing rules land 10 August 2026. See what&apos;s changing
                before you buy.
                <span className="gap" />
              </span>
            ))}
          </div>
        </Link>
      </div>

      <header>
        <nav className="wrap">
          <Link href="/" className="logo">
            <span className="logo-mark">
              <HouseHQLogo />
            </span>
            HouseHQ<span className="au-badge">AU ONLY</span>
          </Link>
          <div className="nav-links">
            <Link href="/#catalog">Checklists</Link>
            <Link href="/#about">About</Link>
            <Link href="/#faq">FAQ</Link>
            <Link href="/#agents">For agents</Link>
          </div>
          <Link href="/#contact" className="nav-cta">
            Contact Us
          </Link>
        </nav>
      </header>
    </>
  );
}
