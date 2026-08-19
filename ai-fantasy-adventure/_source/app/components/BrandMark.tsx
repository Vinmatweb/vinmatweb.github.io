export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img">
        <path d="M24 3 41 13v22L24 45 7 35V13L24 3Z" fill="currentColor" opacity=".16" />
        <path d="m24 6 14 8.2v19.6L24 42 10 33.8V14.2L24 6Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m24 11 4.1 8.3 9.2 1.3-6.7 6.5 1.6 9.2-8.2-4.4-8.2 4.4 1.6-9.2-6.7-6.5 9.2-1.3L24 11Z" fill="currentColor" />
      </svg>
      {!compact && <span className="sr-only">AI Fantasy Adventure</span>}
    </span>
  );
}
