import Image from "next/image";
import Link from "next/link";

import { COMPANY } from "@/lib/company";

export function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col">
            <Link className="wordmark with-mark" href="/" aria-label="Nines at Nine, home">
              <Image className="head-mark" src="/img/logo.png" alt="" width={186} height={240} />
              <span>NINES AT NINE</span>
            </Link>
            <p className="muted" style={{ fontSize: 15 }}>
              Nine dates. One Friday. Three minutes each.
            </p>
          </div>
          <nav className="foot-col" aria-label="Read">
            <h3>READ</h3>
            <Link href="/blog">Blog</Link>
          </nav>
          <nav className="foot-col" aria-label="Legal">
            <h3>LEGAL</h3>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/house-rules">House Rules</Link>
          </nav>
          <div className="foot-col">
            <h3>CONTACT</h3>
            <a href={`mailto:${COMPANY.helpEmail}`}>{COMPANY.helpEmail}</a>
          </div>
        </div>
        <div className="foot-base">
          <span>© 2026 {COMPANY.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
