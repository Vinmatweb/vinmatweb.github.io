/* eslint-disable @next/next/no-img-element -- curated WebP assets are pre-sized and manually optimized */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetSlot } from "../../components/AssetSlot";
import { AttributeGrid } from "../../components/AttributeGrid";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { CollectionSearch, type SearchItem } from "../../components/CollectionSearch";
import { ExplorerShell } from "../../components/ExplorerShell";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import {
  findBestiaryEntry,
  findClass,
  findEquipment,
  findHero,
  findRace,
  findSchool,
  findSpell,
  gameData,
  type BestiaryEntry,
  type CharacterClass,
  type EquipmentItem,
  type Hero,
  type MagicSchool,
  type Race,
  type Spell,
} from "../../data";

type PageProps = { params: Promise<{ slug?: string[] }> };

function currentPath(segments: string[]) {
  return `/explorer${segments.length ? `/${segments.join("/")}` : ""}`;
}

function pageMetadata(segments: string[]): Metadata {
  let title = "Explorer světa";
  let description = "Prozkoumejte hrdiny, bestiář, vybavení, magii, pravidla a AI Pána jeskyně světa AI Fantasy Adventure.";
  if (segments[0] === "hrdinove") {
    title = "Hrdinové";
    description = "Pět ras, šest povolání a všech 30 základních hrdinů AI Fantasy Adventure.";
    if (segments[1] === "rasy" && segments[2]) {
      const item = findRace(segments[2]);
      if (item) { title = item.name; description = item.description; }
    } else if (segments[1] === "povolani" && segments[2]) {
      const item = findClass(segments[2]);
      if (item) { title = item.name; description = item.description; }
    } else if (segments[1] && !["rasy", "povolani"].includes(segments[1])) {
      const item = findHero(segments[1]);
      if (item) { title = item.name; description = `Přesné počáteční vlastnosti, Životy, schopnosti a vybavení hrdiny ${item.name}.`; }
    }
  } else if (segments[0] === "bestiar") {
    title = "Bestiář";
    if (segments[1] && segments[1] !== "kategorie") {
      const item = findBestiaryEntry(segments[1]);
      if (item) { title = item.name; description = `${item.category}, obtížnost ${item.difficulty}, ${item.stats.hp} Ž a ${item.xp} XP — přesný statblok z Bestiáře v1.0.`; }
    }
  } else if (segments[0] === "vybaveni") {
    title = "Katalog vybavení";
    if (segments[1] && segments[1] !== "kategorie") {
      const item = findEquipment(segments[1]);
      if (item) { title = item.name; description = `${item.category}: přesné schválené údaje položky ${item.name}.`; }
    }
  } else if (segments[0] === "magie") {
    title = "Magie a kouzla";
    if (segments[1]) {
      const school = findSchool(segments[1]);
      const spell = segments[2] ? findSpell(segments[2], segments[1]) : undefined;
      if (spell) { title = spell.name; description = `${spell.school}: ${spell.effect}`; }
      else if (school) { title = school.name; description = school.description; }
    }
  } else if (segments[0] === "pravidla") {
    title = "Stručná pravidla";
  } else if (segments[0] === "vaelor") {
    title = "Vaelor, též zvaný Oryn";
    description = "Ten, který zná všechny příběhy — AI Pán jeskyně světa AI Fantasy Adventure.";
  }
  return {
    title,
    description,
    alternates: { canonical: currentPath(segments) },
    openGraph: { title, description, type: "website", images: ["/og-image.jpg"] },
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  return pageMetadata(slug);
}

function EncyclopediaHeader({ eyebrow, title, description, count }: { eyebrow: string; title: string; description: string; count?: string }) {
  return (
    <header className="encyclopedia-header">
      <div><p className="kicker">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>
      {count && <strong className="encyclopedia-header__count">{count}</strong>}
    </header>
  );
}

function FutureAssetLinks({ label = "Další materiály" }: { label?: string }) {
  return (
    <div className="future-assets" aria-label={label}>
      <span>Barevný obrázek</span><span>Omalovánka</span><span>Karta</span><span>Další aktivita</span>
    </div>
  );
}

function ExplorerOverview() {
  const portals = [
    ["Hrdinové", "5 ras, 6 povolání a 30 přesných kombinací", gameData.meta.counts.heroes, "/explorer/hrdinove", "♜"],
    ["Bestiář", "Zvířata, NPC, humanoidi, nemrtví, nestvůry a bossové", gameData.meta.counts.bestiary, "/explorer/bestiar", "◉"],
    ["Vybavení", "Zbraně, zbroje, nástroje, lektvary a magické předměty", gameData.meta.counts.equipment, "/explorer/vybaveni", "⚔"],
    ["Magie", "Jedenáct škol a úplný katalog referenčních kouzel", gameData.meta.counts.spells, "/explorer/magie", "✦"],
  ] as const;
  return (
    <>
      <EncyclopediaHeader eyebrow="Encyklopedie v1.0" title="Explorer světa" description="Všechna schválená herní data na jednom místě — propojená, vyhledatelná a připravená na budoucí ilustrace, omalovánky a karty." count={`${gameData.meta.counts.heroes + gameData.meta.counts.bestiary + gameData.meta.counts.equipment + gameData.meta.counts.spells} položek`} />
      <div className="explorer-portal-grid">
        {portals.map(([title, body, count, href, symbol]) => (
          <Link href={href} className="explorer-portal" key={href}>
            <span className="explorer-portal__symbol" aria-hidden="true">{symbol}</span>
            <small>{count} položek</small><h2>{title}</h2><p>{body}</p><strong>Prozkoumat →</strong>
          </Link>
        ))}
      </div>
      <div className="source-banner">
        <span aria-hidden="true">✓</span>
        <div><strong>Obsah vychází z finálních dokumentů v1.0</strong><p>Manuál, Bestiář, Magie a Katalog vybavení ze dne 19. srpna 2026. Přesná data mají přednost před obecnými popisy.</p></div>
      </div>
    </>
  );
}

function HeroItems(items: Hero[]): SearchItem[] {
  return items.map((hero) => {
    const race = findRace(hero.raceSlug)!;
    const cls = findClass(hero.classSlug)!;
    return {
      href: `/explorer/hrdinove/${hero.slug}`,
      title: hero.name,
      eyebrow: `${race.name} • ${cls.name}`,
      description: `${hero.strong} silná / ${hero.weak} slabá • ${hero.raceAbility.name} + ${hero.classAbility.name}`,
      meta: `S ${hero.stats.strength} · O ${hero.stats.agility} · CH ${hero.stats.intelligence} · CHA ${hero.stats.charisma} · Š ${hero.stats.luck}`,
      badge: `${hero.hp} Ž`,
    };
  });
}

function HeroesOverview() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Hrdinové" }]} />
      <EncyclopediaHeader eyebrow="5 ras × 6 povolání" title="30 základních hrdinů" description="Každá kombinace používá přesné počáteční vlastnosti a Životy z kontrolní matice Manuálu v1.0." count="30 hrdinů" />
      <div className="editorial-image"><img src="/assets/illustrations/classes-lineup.webp" width="1672" height="941" alt="Šest hrdinů představuje bojovníka, hraničáře, kouzelníka, zloděje, léčitele a barda" /></div>
      <CollectionSearch items={HeroItems(gameData.heroes)} placeholder="Hledat rasu nebo povolání…" />
    </>
  );
}

function RaceList() {
  const items: SearchItem[] = gameData.races.map((race) => ({
    href: `/explorer/hrdinove/rasy/${race.slug}`,
    title: race.name,
    eyebrow: `Silná ${race.strong} • slabá ${race.weak}`,
    description: race.tagline,
    meta: race.ability.name,
    badge: "6 povolání",
  }));
  return (
    <>
      <Breadcrumbs items={[{ label: "Hrdinové", href: "/explorer/hrdinove" }, { label: "Rasy" }]} />
      <EncyclopediaHeader eyebrow="Hrdinové" title="Pět hratelných ras" description="Rasa určuje úpravy vlastností, jednu silnou a jednu slabou vlastnost a rasovou schopnost." count="5 ras" />
      <div className="editorial-image"><img src="/assets/illustrations/races-lineup.webp" width="1536" height="1024" alt="Pět hratelných ras AI Fantasy Adventure" /></div>
      <CollectionSearch items={items} placeholder="Hledat rasu…" />
    </>
  );
}

function RaceDetail({ race }: { race: Race }) {
  const heroes = gameData.heroes.filter((hero) => hero.raceSlug === race.slug);
  return (
    <>
      <Breadcrumbs items={[{ label: "Hrdinové", href: "/explorer/hrdinove" }, { label: "Rasy", href: "/explorer/hrdinove/rasy" }, { label: race.name }]} />
      <div className="detail-hero">
        <div className="detail-hero__copy"><p className="kicker">Hratelná rasa</p><h1>{race.name}</h1><p className="lead">{race.tagline}</p><p>{race.description}</p><div className="pill-row"><span>Silná: {race.strong}</span><span>Slabá: {race.weak}</span></div></div>
        <AssetSlot title={race.name} eyebrow="Připraveno pro vlastní ilustraci" symbol={race.name.charAt(0)}><p>Samostatný barevný obraz a ženská varianta mohou být přidány bez změny stránky.</p></AssetSlot>
      </div>
      <section className="detail-section"><div className="detail-section__heading"><span>01</span><div><h2>Úpravy vlastností</h2><p>Všechny ostatní vlastnosti jsou normální; povolání kategorii silná/slabá nemění.</p></div></div><AttributeGrid values={race.modifiers} modifiers /></section>
      <section className="detail-grid-two"><article className="info-panel"><span className="panel-kicker">Rasová schopnost</span><h2>{race.ability.name}</h2><p>{race.ability.effect}</p></article><article className="info-panel"><span className="panel-kicker">Tematicky vhodná povolání</span><h2>Dobré výchozí směry</h2><div className="link-chips">{race.recommendedClassSlugs.map((slug) => { const item = findClass(slug)!; return <Link href={`/explorer/hrdinove/povolani/${slug}`} key={slug}>{item.name}</Link>; })}</div><p className="fine-print">Jde o tematický tip podle schválených vlastností, nikoli o omezení pravidel.</p></article></section>
      <section className="detail-section"><div className="detail-section__heading"><span>02</span><div><h2>Šest kombinací</h2><p>Vyber povolání a otevři přesné počáteční statistiky hrdiny.</p></div></div><CollectionSearch items={HeroItems(heroes)} placeholder={`Hledat ${race.name.toLocaleLowerCase("cs")} povolání…`} /></section>
      <FutureAssetLinks />
    </>
  );
}

function ClassList() {
  const items: SearchItem[] = gameData.classes.map((item) => ({
    href: `/explorer/hrdinove/povolani/${item.slug}`,
    title: item.name,
    eyebrow: item.ability.name,
    description: item.tagline,
    meta: item.playStyle,
    badge: "5 ras",
  }));
  return (
    <>
      <Breadcrumbs items={[{ label: "Hrdinové", href: "/explorer/hrdinove" }, { label: "Povolání" }]} />
      <EncyclopediaHeader eyebrow="Hrdinové" title="Šest povolání" description="Povolání přidává přesně +3 body vlastností, vlastní schopnost a doporučenou počáteční sestavu." count="6 povolání" />
      <div className="editorial-image"><img src="/assets/illustrations/classes-lineup.webp" width="1672" height="941" alt="Šest povolání AI Fantasy Adventure" /></div>
      <CollectionSearch items={items} placeholder="Hledat povolání…" />
    </>
  );
}

function ClassDetail({ item }: { item: CharacterClass }) {
  const heroes = gameData.heroes.filter((hero) => hero.classSlug === item.slug);
  return (
    <>
      <Breadcrumbs items={[{ label: "Hrdinové", href: "/explorer/hrdinove" }, { label: "Povolání", href: "/explorer/hrdinove/povolani" }, { label: item.name }]} />
      <div className="detail-hero">
        <div className="detail-hero__copy"><p className="kicker">Povolání</p><h1>{item.name}</h1><p className="lead">{item.tagline}</p><p>{item.description}</p><div className="pill-row"><span>{item.playStyle}</span></div></div>
        <AssetSlot title={item.name} eyebrow="Připraveno pro vlastní ilustraci" symbol={item.name.charAt(0)}><p>Asset slot je připravený pro samostatnou postavu a její budoucí levelové varianty.</p></AssetSlot>
      </div>
      <section className="detail-section"><div className="detail-section__heading"><span>01</span><div><h2>Bonusy povolání</h2><p>Povolání mění hodnoty, nikoli kategorii silné a slabé vlastnosti.</p></div></div><AttributeGrid values={item.modifiers} modifiers /></section>
      <section className="detail-grid-two"><article className="info-panel"><span className="panel-kicker">Schopnost povolání</span><h2>{item.ability.name}</h2><p>{item.ability.effect}</p></article><article className="info-panel"><span className="panel-kicker">Počáteční sestava</span><h2>Aktivní vybavení</h2><ul>{item.startingEquipment.active.map((value) => <li key={value}>{value}</li>)}</ul><h3>V inventáři</h3><p>{item.startingEquipment.inventory.join(" • ")}</p>{item.startingEquipment.note && item.startingEquipment.note !== "—" && <p className="fine-print">{item.startingEquipment.note}</p>}</article></section>
      <section className="detail-section"><div className="detail-section__heading"><span>02</span><div><h2>Pět ras</h2><p>Otevři přesné počáteční statistiky každé kombinace.</p></div></div><CollectionSearch items={HeroItems(heroes)} placeholder={`Hledat rasu pro ${item.name.toLocaleLowerCase("cs")}…`} /></section>
      <FutureAssetLinks />
    </>
  );
}

function HeroDetail({ hero }: { hero: Hero }) {
  const race = findRace(hero.raceSlug)!;
  const cls = findClass(hero.classSlug)!;
  return (
    <>
      <Breadcrumbs items={[{ label: "Hrdinové", href: "/explorer/hrdinove" }, { label: hero.name }]} />
      <div className="detail-hero detail-hero--character">
        <div className="detail-hero__copy"><p className="kicker">Základní hrdina • Level 1</p><h1>{hero.name}</h1><p className="lead">{race.tagline}</p><p>{hero.description}</p><div className="pill-row"><Link href={`/explorer/hrdinove/rasy/${race.slug}`}>{race.name}</Link><Link href={`/explorer/hrdinove/povolani/${cls.slug}`}>{cls.name}</Link><strong>{hero.hp} Ž</strong></div></div>
        <AssetSlot title={hero.name} eyebrow="Asset slot postavy" symbol="✦"><p>Připraveno pro barevnou ilustraci, omalovánku, kartu i budoucí Lv10/Lv20 varianty.</p></AssetSlot>
      </div>
      <section className="detail-section"><div className="detail-section__heading"><span>01</span><div><h2>Počáteční vlastnosti</h2><p>Počítáno přesně jako základ 5 + rasa + povolání.</p></div></div><AttributeGrid values={hero.stats} /><div className="derived-stats"><div><span>Silná vlastnost</span><strong>{hero.strong}</strong></div><div><span>Slabá vlastnost</span><strong>{hero.weak}</strong></div><div><span>Maximální Životy</span><strong>{hero.hp} Ž</strong></div></div></section>
      <section className="detail-grid-two"><article className="info-panel"><span className="panel-kicker">Rasa • {race.name}</span><h2>{hero.raceAbility.name}</h2><p>{hero.raceAbility.effect}</p></article><article className="info-panel"><span className="panel-kicker">Povolání • {cls.name}</span><h2>{hero.classAbility.name}</h2><p>{hero.classAbility.effect}</p></article></section>
      <section className="detail-section"><div className="detail-section__heading"><span>02</span><div><h2>Počáteční vybavení</h2><p>Doporučená sestava z finálního Katalogu vybavení v1.0.</p></div></div><div className="loadout-grid"><article><span>Aktivní</span>{hero.startingEquipment.active.map((value) => <strong key={value}>{value}</strong>)}</article><article><span>Inventář</span>{hero.startingEquipment.inventory.map((value) => <strong key={value}>{value}</strong>)}</article></div></section>
      <FutureAssetLinks />
    </>
  );
}

function bestiaryItems(entries: BestiaryEntry[]): SearchItem[] {
  return entries.map((entry) => ({
    href: `/explorer/bestiar/${entry.slug}`,
    title: entry.name,
    eyebrow: entry.category,
    description: entry.ability.name === "—" ? "Bez zvláštní schopnosti" : entry.ability.name,
    meta: `FÚ ${entry.stats.physicalAttack} · FO ${entry.stats.physicalDefense} · MÚ ${entry.stats.magicAttack} · MO ${entry.stats.magicDefense}`,
    badge: entry.isBoss ? `BOSS • ${entry.xp} XP` : `${entry.stats.hp} Ž • ${entry.xp} XP`,
  }));
}

function BestiaryList({ categorySlug }: { categorySlug?: string }) {
  const category = categorySlug ? gameData.bestiaryCategories.find((item) => item.slug === categorySlug) : undefined;
  if (categorySlug && !category) notFound();
  const entries = category ? gameData.bestiary.filter((entry) => entry.categorySlug === category.slug) : gameData.bestiary;
  return (
    <>
      <Breadcrumbs items={category ? [{ label: "Bestiář", href: "/explorer/bestiar" }, { label: category.name }] : [{ label: "Bestiář" }]} />
      <EncyclopediaHeader eyebrow="Bestiář v1.0" title={category ? category.name : "Tvorové, NPC a bossové"} description={category ? `Schválená kategorie Bestiáře: ${category.name}.` : "62 závazných referenčních statbloků. Vaelor jejich hodnoty během střetu svévolně nemění."} count={`${entries.length} položek`} />
      {!category && <div className="editorial-image"><img src="/assets/illustrations/bestiary-hero.webp" width="1672" height="941" alt="Výběr tvorů z bestiáře" /></div>}
      {!category && <div className="category-strip">{gameData.bestiaryCategories.map((item) => <Link href={`/explorer/bestiar/kategorie/${item.slug}`} key={item.slug}><strong>{item.name}</strong><span>{item.count}</span></Link>)}</div>}
      <CollectionSearch items={bestiaryItems(entries)} placeholder="Hledat tvora, kategorii nebo schopnost…" />
    </>
  );
}

function BestiaryDetail({ entry }: { entry: BestiaryEntry }) {
  const statRows = [
    ["S", entry.stats.strength], ["O", entry.stats.agility], ["CH", entry.stats.intelligence], ["CHA", entry.stats.charisma], ["Š", entry.stats.luck], ["Ž", entry.stats.hp],
    ["FÚ", entry.stats.physicalAttack], ["FO", entry.stats.physicalDefense], ["MÚ", entry.stats.magicAttack], ["MO", entry.stats.magicDefense], ["BŠ", entry.stats.luckBonus], ["XP", entry.xp],
  ];
  return (
    <>
      <Breadcrumbs items={[{ label: "Bestiář", href: "/explorer/bestiar" }, { label: entry.name }]} />
      <div className="detail-hero">
        <div className="detail-hero__copy"><p className="kicker">{entry.category} • obtížnost {entry.difficulty}</p><h1>{entry.name}</h1><p className="lead">{entry.ability.name === "—" ? "Referenční protivník bez zvláštní schopnosti." : entry.ability.name}</p><p>{entry.ability.effect}</p><div className="pill-row">{entry.isBoss && <strong>Referenční boss</strong>}<span>Silná {entry.strong}</span><span>Slabá {entry.weak}</span></div></div>
        <AssetSlot title={entry.name} eyebrow="Asset slot bestiáře" symbol={entry.isBoss ? "♛" : "◉"} tone={entry.isBoss ? "ember" : "earth"}><p>Připraveno pro barevnou ilustraci, omalovánku a kartu bestie.</p></AssetSlot>
      </div>
      <section className="detail-section"><div className="detail-section__heading"><span>01</span><div><h2>Statblok</h2><p>Přesné schválené hodnoty z Bestiáře v1.0.</p></div></div><div className="stat-table">{statRows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><details className="mechanics-details"><summary>Výzbroj, ochrana a další parametry</summary><dl><div><dt>Útočná vlastnost</dt><dd>{entry.attackAttribute}</dd></div><div><dt>Útok</dt><dd>{entry.weapon} (bonus {entry.weaponBonus})</dd></div><div><dt>Ochrana</dt><dd>{entry.armor} (bonus {entry.armorBonus})</dd></div><div><dt>Štít</dt><dd>{entry.shield || "—"} (bonus {entry.shieldBonus})</dd></div><div><dt>Bonus kouzla</dt><dd>{entry.spellBonus}</dd></div><div><dt>Magická ochrana</dt><dd>{entry.magicProtection}</dd></div></dl></details></section>
      <section className="detail-grid-two"><article className="info-panel"><span className="panel-kicker">Zvláštní schopnost</span><h2>{entry.ability.name}</h2><p>{entry.ability.effect}</p></article><article className="info-panel"><span className="panel-kicker">Doporučený počet</span><h2>Podle velikosti družiny</h2><div className="group-counts"><span>2 hráči <strong>{entry.recommendedGroups["2"] ?? "—"}</strong></span><span>3 hráči <strong>{entry.recommendedGroups["3"] ?? "—"}</strong></span><span>4 hráči <strong>{entry.recommendedGroups["4"] ?? "—"}</strong></span></div></article></section>
      {entry.defenseSpecialization && <section className="notice"><strong>{entry.defenseSpecialization.name}</strong><p>{entry.defenseSpecialization.effect}</p><span>{entry.defenseSpecialization.resistanceType}</span>{entry.defenseSpecialization.weakness && entry.defenseSpecialization.weakness !== "—" && <p><b>Chytré řešení:</b> {entry.defenseSpecialization.weakness}</p>}</section>}
      {entry.boss && <section className="boss-panel"><div><span className="panel-kicker">Základní boss</span><h2>Jak použít {entry.name}</h2><p>{entry.boss.adventureType}</p></div><dl><div><dt>Charakteristická schopnost</dt><dd>{entry.boss.signatureAbility}</dd></div><div><dt>Slabina / výhoda</dt><dd>{entry.boss.weakness}</dd></div><div><dt>Alternativní řešení</dt><dd>{entry.boss.alternativeSolutions}</dd></div><div><dt>Poznámka</dt><dd>{entry.boss.note}</dd></div></dl></section>}
      <FutureAssetLinks />
    </>
  );
}

function equipmentItems(entries: EquipmentItem[]): SearchItem[] {
  return entries.map((item) => ({
    href: `/explorer/vybaveni/${item.slug}`,
    title: item.name,
    eyebrow: item.category,
    description: String(item.fields["Herní účinek"] ?? item.fields["Poznámka"] ?? item.fields["Zvláštní schopnost / výpočet"] ?? "Schválená položka katalogu"),
    meta: Object.entries(item.fields).filter(([key]) => ["FÚ", "FO", "Bonus", "Požadavek", "Min.", "Min. Síla"].includes(key)).map(([key, value]) => `${key} ${value}`).join(" · "),
    badge: String(item.fields["Cena"] ?? item.fields["Hodnota"] ?? "—"),
  }));
}

function EquipmentList({ categorySlug }: { categorySlug?: string }) {
  const category = categorySlug ? gameData.equipmentCategories.find((item) => item.slug === categorySlug) : undefined;
  if (categorySlug && !category) notFound();
  const entries = category ? gameData.equipment.filter((entry) => entry.categorySlug === category.slug) : gameData.equipment;
  return (
    <>
      <Breadcrumbs items={category ? [{ label: "Vybavení", href: "/explorer/vybaveni" }, { label: category.name }] : [{ label: "Vybavení" }]} />
      <EncyclopediaHeader eyebrow="Katalog vybavení v1.0" title={category ? category.name : "Výzbroj, nástroje a odměny"} description={category ? `Schválená kategorie Katalogu vybavení: ${category.name}.` : "Přesné ceny, požadavky, bonusy, sloty a účinky. Základní bonusy upravuje koeficient povolání, dodatečné bonusy nikoli."} count={`${entries.length} položek`} />
      {!category && <div className="category-strip category-strip--wide">{gameData.equipmentCategories.map((item) => <Link href={`/explorer/vybaveni/kategorie/${item.slug}`} key={item.slug}><strong>{item.name}</strong><span>{item.count}</span></Link>)}</div>}
      <CollectionSearch items={equipmentItems(entries)} placeholder="Hledat zbraň, nástroj, lektvar nebo předmět…" />
    </>
  );
}

function EquipmentDetail({ item }: { item: EquipmentItem }) {
  return (
    <>
      <Breadcrumbs items={[{ label: "Vybavení", href: "/explorer/vybaveni" }, { label: item.name }]} />
      <div className="detail-hero">
        <div className="detail-hero__copy"><p className="kicker">{item.category}</p><h1>{item.name}</h1><p className="lead">Přesná položka Katalogu vybavení v1.0</p><p>{String(item.fields["Herní účinek"] ?? item.fields["Poznámka"] ?? item.fields["Zvláštní schopnost / výpočet"] ?? "Referenční vybavení pro dobrodružství.")}</p><div className="pill-row">{item.fields["Cena"] && <strong>{String(item.fields["Cena"])}</strong>}{item.fields["Hodnota"] && <strong>{String(item.fields["Hodnota"])}</strong>}{item.fields["Slot"] && <span>{String(item.fields["Slot"])}</span>}</div></div>
        <AssetSlot title={item.name} eyebrow="Asset slot vybavení" symbol="⚔" tone="ember"><p>Samostatný produktový obrázek lze doplnit bez zásahu do dat.</p></AssetSlot>
      </div>
      <section className="detail-section"><div className="detail-section__heading"><span>01</span><div><h2>Schválené údaje</h2><p>Web zobrazuje pouze pole, která položka skutečně obsahuje.</p></div></div><dl className="definition-table">{Object.entries(item.fields).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>)}</dl></section>
      <div className="notice"><strong>Pravidlo specificity</strong><p>Přesný řádek této položky má přednost před obecným vzorcem pouze v tom, co výslovně uvádí. Vaelor nepřidává další skryté bonusy.</p></div>
      <FutureAssetLinks />
    </>
  );
}

function MagicList() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Magie" }]} />
      <EncyclopediaHeader eyebrow="Magie v1.0" title="Jedenáct škol magie" description="Každá škola obsahuje přesně deset referenčních kouzel. Min. CH a případný Min. Level umožňují kouzlo naučit, ale postava je musí skutečně získat." count="110 kouzel" />
      <div className="editorial-image"><img src="/assets/illustrations/magic-hero.webp" width="1672" height="941" alt="Magická kniha s jedenácti různými kouzelnými efekty" /></div>
      <div className="school-grid">{gameData.magicSchools.map((school) => <Link href={`/explorer/magie/${school.slug}`} className={`school-card school-card--${school.tone}`} key={school.slug}><span>{school.symbol}</span><small>10 kouzel</small><h2>{school.name}</h2><p>{school.description}</p><strong>Otevřít školu →</strong></Link>)}</div>
    </>
  );
}

function spellItems(spells: Spell[]): SearchItem[] {
  return spells.map((spell) => ({
    href: `/explorer/magie/${spell.schoolSlug}/${spell.slug}`,
    title: spell.name,
    eyebrow: spell.type,
    description: spell.effect,
    meta: `Min. CH ${spell.minIntelligence} · Min. Level ${spell.minLevel}`,
    badge: spell.bonus,
  }));
}

function SchoolDetail({ school }: { school: MagicSchool }) {
  const spells = gameData.spells.filter((spell) => spell.schoolSlug === school.slug);
  return (
    <>
      <Breadcrumbs items={[{ label: "Magie", href: "/explorer/magie" }, { label: school.name }]} />
      <div className={`school-hero school-hero--${school.tone}`}><span className="school-hero__symbol" aria-hidden="true">{school.symbol}</span><div><p className="kicker">Škola magie • 10 kouzel</p><h1>{school.name}</h1><p>{school.description}</p></div></div>
      <CollectionSearch items={spellItems(spells)} placeholder={`Hledat v ${school.name.toLocaleLowerCase("cs")}…`} />
    </>
  );
}

function SpellDetail({ spell }: { spell: Spell }) {
  const school = findSchool(spell.schoolSlug)!;
  return (
    <>
      <Breadcrumbs items={[{ label: "Magie", href: "/explorer/magie" }, { label: school.name, href: `/explorer/magie/${school.slug}` }, { label: spell.name }]} />
      <div className={`detail-hero spell-detail spell-detail--${school.tone}`}>
        <div className="detail-hero__copy"><p className="kicker">{school.name} • {spell.type}</p><h1>{spell.name}</h1><p className="lead">{spell.effect}</p><div className="pill-row"><span>Min. CH {spell.minIntelligence}</span><span>Min. Level {spell.minLevel}</span><strong>{spell.bonus}</strong></div></div>
        <AssetSlot title={spell.name} eyebrow="Vizuální efekt kouzla" symbol={school.symbol} tone={school.tone}><p>Připraveno pro efektovou ilustraci a kartu kouzla.</p></AssetSlot>
      </div>
      <section className="detail-section"><div className="detail-section__heading"><span>01</span><div><h2>Parametry kouzla</h2><p>Přesný řádek z katalogu 110 kouzel.</p></div></div><dl className="definition-table"><div><dt>Škola</dt><dd>{spell.school}</dd></div><div><dt>Typ</dt><dd>{spell.type}</dd></div><div><dt>Min. Chytrost</dt><dd>{spell.minIntelligence}</dd></div><div><dt>Min. Level</dt><dd>{spell.minLevel}</dd></div><div><dt>Bonus</dt><dd>{spell.bonus}</dd></div><div><dt>Cíl</dt><dd>{spell.target}</dd></div><div><dt>Trvání</dt><dd>{spell.duration}</dd></div><div><dt>Omezení</dt><dd>{spell.limitations}</dd></div><div className="definition-table__wide"><dt>Přesný účinek</dt><dd>{spell.effect}</dd></div></dl></section>
      <div className="notice"><strong>Znát nestačí splnit požadavek</strong><p>Min. CH a Min. Level pouze dovolují kouzlo se naučit. Postava je musí skutečně získat při levelování, od učitele, z knihy, svitku, odměny, nálezu nebo příběhu.</p></div>
      <FutureAssetLinks />
    </>
  );
}

function RulesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Pravidla" }]} />
      <EncyclopediaHeader eyebrow="Stručný průvodce" title="Pravidla bez studování manuálu" description="Toto je rychlé webové vysvětlení. Pro vedení hry a všechny výjimky vždy použijte úplný Manuál v1.0." />
      <div className="rule-chapters">
        <article><span>01</span><div><h2>Co je AI Fantasy Adventure</h2><p>Kooperativní vyprávěcí fantasy RPG pro děti přibližně 5–10 let. Hráč říká, co chce udělat; Vaelor popíše svět a následky.</p></div></article>
        <article><span>02</span><div><h2>Jak vznikne postava</h2><p>Každá vlastnost začíná na 5. Přičtou se úpravy rasy a povolání. Rasa určí silnou/slabou vlastnost a schopnost, povolání přidá další schopnost a vybavení.</p><p><code>Maximální Ž = {gameData.rules.hpFormula}</code></p></div></article>
        <article><span>03</span><div><h2>Virtuální kostka</h2><p>{gameData.rules.virtualDie}</p></div></article>
        <article><span>04</span><div><h2>Průběh dobrodružství</h2><p>Výchozí dobrodružství má přibližně 5–8 scén. Neúspěch příběh nezastaví a boj nikdy nemusí být jediným řešením.</p><div className="scene-flow">{gameData.rules.adventureScenes.map((scene, index) => <span key={scene}><small>{index + 1}</small>{scene}</span>)}</div></div></article>
        <article><span>05</span><div><h2>Souboj</h2><p>{gameData.rules.combat}</p><p><code>BŠ = {gameData.rules.luckBonusFormula}</code></p></div></article>
        <article><span>06</span><div><h2>Magie</h2><p>{gameData.rules.magic}</p><p>Plošné kouzlo zasáhne nejvýše 3 cíle. Sesilatel může v jednom souboji použít nejvýše jedno kouzlo obnovující Ž a udržuje nejvýše jedno soustředění.</p></div></article>
        <article><span>07</span><div><h2>XP a Levely</h2><p>{gameData.rules.leveling}</p><p><code>XP do dalšího Levelu = 200 + 100 × aktuální Level</code></p></div></article>
        <article><span>08</span><div><h2>Jednoduchý režim</h2><p>{gameData.rules.simpleMode}</p></div></article>
      </div>
      <div className="manual-cta"><div><p className="kicker">Úplná pravidla</p><h2>Manuál v1.0</h2><p>Soubojové vzorce, XP tabulky, přenos kampaně a přesné instrukce pro Vaelora.</p></div><a href="/downloads/AI_Fantasy_Adventure_Manual_v1_0.docx" download className="button button--gold">Stáhnout Manuál</a></div>
    </>
  );
}

function VaelorPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Vaelor" }]} />
      <div className="vaelor-page-hero"><img src="/assets/illustrations/vaelor.webp" width="1536" height="1152" alt="Vaelor, AI Pán jeskyně, s knihou a magickou kostkou" /><div><p className="kicker">AI Pán jeskyně</p><h1>Vaelor, též zvaný Oryn</h1><p className="vaelor-title">Ten, který zná všechny příběhy</p><p>Vaelor vytváří svět, nabízí srozumitelné možnosti, vyhodnocuje nejisté akce a vypráví následky. Hráči však vždy rozhodují za své hrdiny sami.</p></div></div>
      <section className="detail-grid-two vaelor-functions"><article className="info-panel"><span className="panel-kicker">Během hry</span><h2>Co Vaelor dělá</h2><ul><li>popisuje prostředí a následky voleb;</li><li>hraje NPC a protivníky;</li><li>vede statistiky, Životy, XP, vybavení a stav kampaně;</li><li>počítá FÚ, FO, MÚ, MO a zranění;</li><li>provádí virtuální hody a tajné hody nepřátel;</li><li>připomíná schopnosti, kouzla a předměty.</li></ul></article><article className="info-panel"><span className="panel-kicker">Jasná hranice</span><h2>Co Vaelor nedělá</h2><ul><li>nerozhoduje za hrdiny;</li><li>neupravuje náhodu podle žádoucího výsledku;</li><li>nemění schválené statbloky uprostřed střetu;</li><li>nepřidává skryté bonusy;</li><li>netlačí hráče do boje jako jediného řešení;</li><li>nezastaví příběh jedním neúspěchem.</li></ul></article></section>
      <div className="quote-panel"><span aria-hidden="true">“</span><blockquote>Každý příběh má mnoho cest. Já znám pravidla světa — ale volbu nechávám hrdinům.</blockquote><small>Vaelorův princip vedení hry</small></div>
      <Link href="/start" className="button button--gold button--large">Zahájit dobrodružství s Vaelorem</Link>
    </>
  );
}

function resolveContent(segments: string[]) {
  if (segments.length === 0) return <ExplorerOverview />;
  if (segments[0] === "hrdinove") {
    if (segments.length === 1) return <HeroesOverview />;
    if (segments[1] === "rasy") {
      if (segments.length === 2) return <RaceList />;
      const race = findRace(segments[2]); if (!race) notFound(); return <RaceDetail race={race} />;
    }
    if (segments[1] === "povolani") {
      if (segments.length === 2) return <ClassList />;
      const item = findClass(segments[2]); if (!item) notFound(); return <ClassDetail item={item} />;
    }
    const hero = findHero(segments[1]); if (!hero) notFound(); return <HeroDetail hero={hero} />;
  }
  if (segments[0] === "bestiar") {
    if (segments.length === 1) return <BestiaryList />;
    if (segments[1] === "kategorie") return <BestiaryList categorySlug={segments[2]} />;
    const entry = findBestiaryEntry(segments[1]); if (!entry) notFound(); return <BestiaryDetail entry={entry} />;
  }
  if (segments[0] === "vybaveni") {
    if (segments.length === 1) return <EquipmentList />;
    if (segments[1] === "kategorie") return <EquipmentList categorySlug={segments[2]} />;
    const item = findEquipment(segments[1]); if (!item) notFound(); return <EquipmentDetail item={item} />;
  }
  if (segments[0] === "magie") {
    if (segments.length === 1) return <MagicList />;
    const school = findSchool(segments[1]); if (!school) notFound();
    if (segments.length === 2) return <SchoolDetail school={school} />;
    const spell = findSpell(segments[2], school.slug); if (!spell) notFound(); return <SpellDetail spell={spell} />;
  }
  if (segments[0] === "pravidla") return <RulesPage />;
  if (segments[0] === "vaelor") return <VaelorPage />;
  notFound();
}

export default async function ExplorerPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const path = currentPath(slug);
  return (
    <>
      <SiteHeader />
      <main className="explorer-page">
        <ExplorerShell currentPath={path}>{resolveContent(slug)}</ExplorerShell>
      </main>
      <SiteFooter />
    </>
  );
}
