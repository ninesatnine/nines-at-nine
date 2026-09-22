/** The numbered arch that marks each step of "How it works". */
export function StepMark({ number }: { number: number }) {
  return (
    <div className="step-mark">
      <svg viewBox="0 0 86 56" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M4 50 A39 39 0 0 1 82 50" />
          <path d="M12 50 A31 31 0 0 1 74 50" />
          <path d="M43 19V11M31 22L26 14M55 22L60 14M22 30L15 25M64 30L71 25M18 41L10 39M68 41L76 39" />
          <path d="M22 54H64" />
        </g>
        <circle cx="43" cy="37" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <text x="43" y="37" textAnchor="middle" dominantBaseline="central">
          {number}
        </text>
      </svg>
    </div>
  );
}

/** Gold diamond between two tapering hairlines. */
export function DiamondRule() {
  return (
    <div className="rule" aria-hidden="true">
      <i />
    </div>
  );
}

/** Full-width section break. */
export function SectionRule({ marginTop }: { marginTop?: number }) {
  return (
    <div className="divider" style={marginTop ? { marginTop } : undefined} aria-hidden="true">
      <i />
    </div>
  );
}
