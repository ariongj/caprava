export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="currentColor" />
    </svg>
  );
}

// The star-and-hairline divider from the CAPRAVA identity.
export function Divider({ side = "left" }: { side?: "left" | "right" }) {
  return (
    <div className={`divider divider-${side}`} aria-hidden="true">
      <SparkleIcon className="divider-star" />
      <span className="divider-line" />
    </div>
  );
}

export function SectionTitle({ eyebrow, title, text, as: Tag = "h2" }: { eyebrow?: string; title: string; text?: string; as?: "h1" | "h2" }) {
  return (
    <header className="section-title">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag>{title}</Tag>
      <span className="title-rule" aria-hidden="true" />
      {text && <p className="lead">{text}</p>}
    </header>
  );
}
