import type { Metadata } from "next";
import Link from "next/link";
import { CopyPrompt } from "../components/CopyPrompt";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Jak začít hrát",
  description: "Stáhněte čtyři dokumenty, nahrajte je do AI chatu a začněte vlastní fantasy dobrodružství bez kostek a znalosti RPG pravidel.",
  alternates: { canonical: "/start" },
};

const files = [
  { title: "Manuál v1.0", body: "Tvorba postavy, virtuální kostka, souboje, XP, Levely a vedení příběhu.", href: "/downloads/AI_Fantasy_Adventure_Manual_v1_0.docx", type: "DOCX" },
  { title: "Bestiář v1.0", body: "62 přesných statbloků, doporučené skupiny, 9 bossů a XP protivníků.", href: "/downloads/AI_Fantasy_Adventure_Bestiar_v1_0.xlsx", type: "XLSX" },
  { title: "Magie a katalog kouzel v1.0", body: "Pravidla magie, 11 škol a 110 referenčních kouzel.", href: "/downloads/AI_Fantasy_Adventure_Magie_a_katalog_kouzel_v1_0.docx", type: "DOCX" },
  { title: "Katalog vybavení v1.0", body: "Zbraně, zbroje, štíty, nástroje, lektvary, sloty a počáteční sestavy.", href: "/downloads/AI_Fantasy_Adventure_Katalog_vybaveni_v1_0.docx", type: "DOCX" },
];

export default function StartPage() {
  return (
    <>
      <SiteHeader />
      <main className="standalone-page">
        <section className="page-hero page-hero--start">
          <div className="shell page-hero__inner">
            <div>
              <p className="kicker">Příprava zabere několik minut</p>
              <h1>Jak začít hrát</h1>
              <p>AI Fantasy Adventure je navrženo tak, aby rodič ani dítě nemuseli znát Dračí doupě, Dungeons &amp; Dragons ani jiný RPG systém.</p>
            </div>
            <div className="start-orbit" aria-hidden="true"><span>1</span><span>2</span><span>3</span><span>4</span><strong>✦</strong></div>
          </div>
        </section>

        <section className="section shell guide-layout">
          <div className="guide-main">
            <div className="notice notice--important">
              <strong>Pro plnou hru nahrajte všechny čtyři dokumenty.</strong>
              <p>Manuál určuje obecná pravidla a tři katalogy obsahují přesné hodnoty. Vaelor je používá jako jeden systém.</p>
            </div>
            {[
              ["1", "Stáhněte kompletní balíček", "ZIP obsahuje všechny čtyři finální dokumenty v1.0. Rozbalte jej do jedné složky, ať je můžete vybrat najednou."],
              ["2", "Otevřete nový AI chat", "Vytvořte nový chat v nástroji, který umí přijímat soubory. Pro nejlepší kontinuitu používejte jeden chat pro jednu kampaň."],
              ["3", "Nahrajte všechny dokumenty", "Počkejte, až se načtou Manuál, Bestiář, Magie a Vybavení. Pokud chat omezuje počet souborů, nahrajte je postupně před zahájením hry."],
              ["4", "Napište úvodní větu", "Uveďte počet hráčů, jejich přibližný věk a případně délku či tón hry. Vaelor se zeptá už jen na to, co opravdu potřebuje."],
              ["5", "Vytvořte hrdiny a hrajte", "Vaelor doporučí rasu a povolání, vypočítá vlastnosti a Životy a zahájí první scénu. Hráči jen popisují, co chtějí udělat."],
            ].map(([number, title, body]) => (
              <article className="guide-step" key={number}>
                <span>{number}</span><div><h2>{title}</h2><p>{body}</p>{number === "4" && <CopyPrompt>Chceme začít nové dobrodružství pro dva hráče ve věku 7 a 9 let.</CopyPrompt>}</div>
              </article>
            ))}
            <div className="notice">
              <strong>Při virtuálním hodu stačí číslo 1–6.</strong>
              <p>Vaelor před každým hodem tajně promíchá výsledky. Hráč řekne pouze jedno číslo a AI odhalí skutečný hod i výsledek akce.</p>
            </div>
          </div>

          <aside className="guide-aside">
            <div className="download-panel download-panel--sticky">
              <div className="download-panel__top"><span className="download-rune">✦</span><div><strong>Všechno v jednom</strong><small>AI Fantasy Adventure v1.0</small></div></div>
              <a href="/downloads/AI_Fantasy_Adventure_v1_0_complete.zip" download className="button button--gold button--full">Stáhnout ZIP balíček</a>
              <span className="file-note">4 soubory • přibližně 205 KB</span>
            </div>
          </aside>
        </section>

        <section className="section section--surface">
          <div className="shell">
            <div className="section-heading"><p className="kicker">Samostatné soubory</p><h2>Čtyři zdroje pravdy</h2><p>Stahujte jednotlivě pouze tehdy, když už část balíčku máte.</p></div>
            <div className="file-grid">
              {files.map((file, index) => (
                <a href={file.href} download className="file-card" key={file.title}>
                  <span className="file-card__index">0{index + 1}</span>
                  <span className="file-card__type">{file.type}</span>
                  <h3>{file.title}</h3><p>{file.body}</p><strong>Stáhnout soubor ↓</strong>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell next-step">
          <div><p className="kicker">Než začnete</p><h2>Chcete si nejdřív vybrat hrdinu?</h2><p>V Exploreru můžete porovnat všech 30 kombinací ras a povolání i jejich přesné počáteční vlastnosti.</p></div>
          <Link href="/explorer/hrdinove" className="button button--outline button--large">Prohlédnout hrdiny</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
