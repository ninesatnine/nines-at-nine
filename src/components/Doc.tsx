import Link from "next/link";
import type { ReactNode } from "react";

import { COMPANY, DOC_VERSION } from "@/lib/company";

export function DocBack() {
  return (
    <Link href="/" className="doc-back">
      ← Back to Nines at Nine
    </Link>
  );
}

/** Title block for a legal page: eyebrow, title, standfirst, version and company. */
export function DocHead({
  id,
  eyebrow,
  title,
  sub,
  showMeta = true,
}: {
  id: string;
  eyebrow: string;
  title: string;
  sub: ReactNode;
  showMeta?: boolean;
}) {
  return (
    <header className="doc-head">
      <DocBack />
      <span className="eyebrow">{eyebrow}</span>
      <h1 id={id} tabIndex={-1}>
        {title}
      </h1>
      <p className="doc-sub">{sub}</p>
      {showMeta ? (
        <>
          <dl className="doc-meta">
            <div>
              <dt>Effective</dt>
              <dd>{DOC_VERSION.effective}</dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>{DOC_VERSION.version}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{DOC_VERSION.updated}</dd>
            </div>
          </dl>
          <dl className="doc-kv doc-company">
            <KV term="Company" detail={COMPANY.name} />
            <KV term="CIN" detail={COMPANY.cin} />
            <KV term="GSTIN" detail={COMPANY.gstin} />
            <KV term="Grievance Officer" detail={`${COMPANY.grievanceOfficer}, Co-founder`} />
            <KV term="Contact" detail={<Mail />} />
          </dl>
        </>
      ) : null}
    </header>
  );
}

export function KV({ term, detail }: { term: string; detail: ReactNode }) {
  return (
    <div>
      <dt>{term}</dt>
      <dd>{detail}</dd>
    </div>
  );
}

export function Mail({ address = COMPANY.email }: { address?: string }) {
  return <a href={`mailto:${address}`}>{address}</a>;
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="doc-callout">
      <div className="doc-callout-t">{title}</div>
      {children}
    </aside>
  );
}

/** Collapsible contents list. `items` are [anchor id, label] in document order. */
export function Toc({ items }: { items: [string, string][] }) {
  return (
    <details className="doc-toc">
      <summary>Contents</summary>
      <ol>
        {items.map(([id, label], i) => (
          <li key={id}>
            <a className="toc-link" href={`#${id}`}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}

export function Clause({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <h2 className="doc-h" id={id}>
      <span className="doc-n">{String(n).padStart(2, "0")}</span>
      {children}
    </h2>
  );
}

export function Sub({ children }: { children: ReactNode }) {
  return <h3 className="doc-h3">{children}</h3>;
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="doc-list">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function DocTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="doc-table">
      <table>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocEnd() {
  return (
    <p className="doc-end">
      Nines at Nine is a product of {COMPANY.name}. This document is published at ninesatnine.com and
      the version there governs. Version {DOC_VERSION.version}, effective {DOC_VERSION.effective}.
    </p>
  );
}
