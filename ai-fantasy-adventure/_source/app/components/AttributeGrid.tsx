import { attributeLabels, formatModifier, type AttributeSet } from "../data";

export function AttributeGrid({ values, modifiers = false }: { values: AttributeSet; modifiers?: boolean }) {
  return (
    <div className="attribute-grid" aria-label="Vlastnosti">
      {attributeLabels.map(([key, name, short]) => (
        <div className="attribute" key={key}>
          <span className="attribute__short">{short}</span>
          <strong>{modifiers ? formatModifier(values[key]) : values[key]}</strong>
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
}
