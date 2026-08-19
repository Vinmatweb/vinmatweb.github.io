"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SearchItem = {
  href: string;
  title: string;
  eyebrow: string;
  description?: string;
  meta?: string;
  badge?: string;
};

export function CollectionSearch({ items, placeholder = "Hledat…" }: { items: SearchItem[]; placeholder?: string }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("cs");
    if (!normalized) return items;
    return items.filter((item) =>
      [item.title, item.eyebrow, item.description, item.meta, item.badge]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("cs")
        .includes(normalized),
    );
  }, [items, query]);

  return (
    <div className="collection-search">
      <label className="search-box">
        <span className="sr-only">Hledat v kolekci</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" /></svg>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} />
        <span className="search-count">{filtered.length}</span>
      </label>
      {filtered.length > 0 ? (
        <div className="collection-grid">
          {filtered.map((item) => (
            <Link href={item.href} className="collection-card" key={item.href}>
              <span className="collection-card__eyebrow">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
              <div className="collection-card__footer">
                <span>{item.meta}</span>
                {item.badge && <strong>{item.badge}</strong>}
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">Žádná položka tomuto hledání neodpovídá.</div>
      )}
    </div>
  );
}
