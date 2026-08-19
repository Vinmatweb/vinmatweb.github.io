type AssetSlotProps = {
  title: string;
  eyebrow?: string;
  symbol?: string;
  tone?: string;
  children?: React.ReactNode;
};

export function AssetSlot({ title, eyebrow = "Ilustrační slot", symbol = "✦", tone = "violet", children }: AssetSlotProps) {
  return (
    <div className={`asset-slot asset-slot--${tone}`}>
      <div className="asset-slot__sigil" aria-hidden="true">{symbol}</div>
      <div className="asset-slot__copy">
        <span>{eyebrow}</span>
        <strong>{title}</strong>
        {children}
      </div>
    </div>
  );
}
