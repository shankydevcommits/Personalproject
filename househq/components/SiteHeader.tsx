import Link from "next/link";

export default function SiteHeader() {
  return (
    <header>
      <nav className="wrap">
        <Link href="/" className="logo">
          <span className="logo-mark">✓</span>HouseHQ
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
  );
}
