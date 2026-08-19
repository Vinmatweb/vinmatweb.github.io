/* eslint-disable @next/next/no-img-element -- curated WebP assets are pre-sized and manually optimized */
type AssetSlotProps = {
  title: string;
  eyebrow?: string;
  symbol?: string;
  tone?: string;
  src?: string;
  alt?: string;
  children?: React.ReactNode;
};

export function AssetSlot({ title, eyebrow = "Ilustrační slot", symbol = "✦", tone = "violet", src, alt, children }: AssetSlotProps) {
  return (
    <div className={`asset-slot asset-slot--${tone}${src ? " asset-slot--image" : ""}`}>
      {src ? (
        <img className="asset-slot__image" src={src} alt={alt ?? title} loading="eager" decoding="async" />
      ) : (
        <div className="asset-slot__sigil" aria-hidden="true">{symbol}</div>
      )}
      <div className="asset-slot__copy">
        <span>{eyebrow}</span>
        <strong>{title}</strong>
        {children}
      </div>
    </div>
  );
}
