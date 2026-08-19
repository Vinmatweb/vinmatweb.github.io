/* eslint-disable @next/next/no-img-element -- curated WebP assets are pre-sized and manually optimized */
import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { CopyPrompt } from "./components/CopyPrompt";
import { gameData } from "./data";

const downloads = [
  ["Manuál", "Pravidla, tvorba postav a vedení hry", "/downloads/AI_Fantasy_Adventure_Manual_v1_0.docx"],
  ["Bestiář", "62 tvorů a NPC, 9 bossů a XP", "/downloads/AI_Fantasy_Adventure_Bestiar_v1_0.xlsx"],
  ["Kniha magie", "110 kouzel v 11 školách", "/downloads/AI_Fantasy_Adventure_Magie_a_katalog_kouzel_v1_0.docx"],
  ["Katalog vybavení", "92 zbraní, předmětů a sestav", "/downloads/AI_Fantasy_Adventure_Katalog_vybaveni_v1_0.docx"],
] as const;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-hero" aria-labelledby="home-title">
          <img
            src="/assets/illustrations/home-hero.webp"
            alt="Pět různých fantasy hrdinů hledí do údolí s hradem a vzdáleným drakem"
            width="1672"
            height="941"
            fetchPriority="high"
          />
          <div className="home-hero__veil" />
          <div className="home-hero__content shell">
            <p className="kicker">Kooperativní fantasy RPG pro děti a rodiče</p>
            <h1 id="home-title"><span>AI Fantasy</span> Adventure</h1>
            <p className="hero-slogan">Každé rozhodnutí otevírá nový příběh.</p>
            <p className="hero-lead">
              Mluvte, rozhodujte se a objevujte. AI vede svět, počítá pravidla a stává se Pánem jeskyně — vy jste hrdinové.
            </p>
            <div className="hero-actions">
              <Link href="/start" className="button button--gold button--large">Začít dobrodružství</Link>
              <Link href="/explorer" className="button button--glass button--large">Prozkoumat svět</Link>
            </div>
            <div className="hero-proof" aria-label="Co ke hře nepotřebujete">
              <span>Bez kostek</span><span>Bez mapy</span><span>Bez zkušeností s RPG</span>
            </div>
          </div>
        </section>

        <section className="world-stats" aria-label="Obsah světa">
          <div className="shell world-stats__inner">
            <div><strong>{gameData.meta.counts.heroes}</strong><span>základních hrdinů</span></div>
            <div><strong>{gameData.meta.counts.bestiary}</strong><span>tvorů a NPC</span></div>
            <div><strong>{gameData.meta.counts.spells}</strong><span>kouzel</span></div>
            <div><strong>{gameData.meta.counts.equipment}</strong><span>položek vybavení</span></div>
          </div>
        </section>

        <section className="start-section section shell" id="start">
          <div className="section-heading section-heading--split">
            <div>
              <p className="kicker">Během několika minut ve hře</p>
              <h2>Začni své dobrodružství</h2>
            </div>
            <p>Všechny čtyři dokumenty tvoří jeden herní systém a jsou pro plnou hru potřeba společně.</p>
          </div>

          <div className="start-layout">
            <div className="start-steps">
              {[
                ["01", "Stáhni čtyři dokumenty", "Nejjednodušší je kompletní balíček se všemi pravidly v1.0."],
                ["02", "Otevři nový AI chat", "Nahraj Manuál, Bestiář, Knihu magie a Katalog vybavení."],
                ["03", "Řekni, kdo chce hrát", "Stačí počet hráčů, přibližný věk a nálada dobrodružství."],
                ["04", "Vaelor vás provede", "Pomůže vytvořit postavy a zahájí první scénu. Všechna čísla hlídá sám."],
              ].map(([number, title, body]) => (
                <article className="step-row" key={number}>
                  <span>{number}</span>
                  <div><h3>{title}</h3><p>{body}</p></div>
                </article>
              ))}
              <CopyPrompt>Chceme začít nové dobrodružství pro dva hráče ve věku 7 a 9 let.</CopyPrompt>
            </div>
            <div className="download-panel">
              <div className="download-panel__top">
                <span className="download-rune" aria-hidden="true">✦</span>
                <div><strong>Kompletní pravidla v1.0</strong><small>4 soubory • jeden systém</small></div>
              </div>
              <a href="/downloads/AI_Fantasy_Adventure_v1_0_complete.zip" download className="button button--gold button--full">
                Stáhnout kompletní balíček
              </a>
              <div className="download-list">
                {downloads.map(([title, description, href]) => (
                  <a href={href} download key={title}>
                    <span><strong>{title}</strong><small>{description}</small></span>
                    <span aria-hidden="true">↓</span>
                  </a>
                ))}
              </div>
              <Link href="/start" className="text-link">Podrobný návod krok za krokem →</Link>
            </div>
          </div>
        </section>

        <section className="feature-section feature-section--image section">
          <div className="shell feature-split">
            <div className="feature-image">
              <img src="/assets/illustrations/races-lineup.webp" loading="lazy" decoding="async" width="1536" height="1024" alt="Člověk, elf, trpaslík, ork a půlčík vedle sebe" />
            </div>
            <div className="feature-copy">
              <p className="kicker">Hrdinové</p>
              <h2>5 ras. 6 povolání. 30 cest.</h2>
              <p>Vyber si člověka, elfa, trpaslíka, orka nebo půlčíka. Potom rozhodni, zda bude bojovníkem, hraničářem, kouzelníkem, zlodějem, léčitelem nebo bardem.</p>
              <ul className="feature-list">
                <li>Každá kombinace má přesné počáteční vlastnosti a Životy.</li>
                <li>Rasa určuje silnou a slabou vlastnost i rasovou schopnost.</li>
                <li>Povolání přidává vlastní schopnost a počáteční vybavení.</li>
              </ul>
              <Link href="/explorer/hrdinove" className="button button--outline">Prohlédnout 30 hrdinů</Link>
            </div>
          </div>
        </section>

        <section className="section shell explorer-preview">
          <div className="section-heading section-heading--split">
            <div><p className="kicker">Explorer světa</p><h2>Encyklopedie dobrodružství</h2></div>
            <p>Všechny položky vznikají ze schválených dokumentů v1.0. Žádné skryté bonusy ani vymyšlené mechaniky.</p>
          </div>
          <div className="portal-grid">
            <Link href="/explorer/bestiar" className="portal portal--bestiary">
              <img src="/assets/illustrations/bestiary-hero.webp" loading="lazy" decoding="async" width="1672" height="941" alt="Výběr tvorů z bestiáře v měsíčním lese" />
              <span className="portal__shade" />
              <div><small>{gameData.meta.counts.bestiary} položek</small><h3>Bestiář</h3><p>Zvířata, NPC, humanoidi, nemrtví, nestvůry a bossové.</p><strong>Otevřít bestiář →</strong></div>
            </Link>
            <Link href="/explorer/magie" className="portal portal--magic">
              <img src="/assets/illustrations/magic-hero.webp" loading="lazy" decoding="async" width="1672" height="941" alt="Kouzelná kniha obklopená symboly škol magie" />
              <span className="portal__shade" />
              <div><small>{gameData.meta.counts.magicSchools} škol • {gameData.meta.counts.spells} kouzel</small><h3>Magie</h3><p>Od Světélka po Hvězdný déšť a Přepis reality.</p><strong>Otevřít knihu magie →</strong></div>
            </Link>
            <Link href="/explorer/vybaveni" className="portal portal--compact portal--equipment">
              <div className="portal__sigil" aria-hidden="true">⚔</div>
              <div><small>{gameData.meta.counts.equipment} položek</small><h3>Vybavení</h3><p>Zbraně, zbroje, nástroje, lektvary a magické předměty.</p><strong>Otevřít katalog →</strong></div>
            </Link>
          </div>
        </section>

        <section className="vaelor-home section">
          <div className="shell vaelor-home__inner">
            <div className="vaelor-home__image">
              <img src="/assets/illustrations/vaelor.webp" loading="lazy" decoding="async" width="1536" height="1152" alt="Vaelor drží knihu příběhů a nad dlaní mu levituje zářící kostka" />
            </div>
            <div className="vaelor-home__copy">
              <p className="kicker">AI Pán jeskyně</p>
              <h2>Vaelor, též zvaný Oryn</h2>
              <p className="vaelor-title">Ten, který zná všechny příběhy</p>
              <p>Vaelor popisuje svět, hraje NPC a protivníky, počítá pravidla, vede virtuální hody a pamatuje si stav dobrodružství. Nikdy však nerozhoduje za hrdiny.</p>
              <div className="vaelor-traits">
                <span>Vypráví</span><span>Počítá</span><span>Naslouchá</span><span>Pamatuje</span>
              </div>
              <Link href="/explorer/vaelor" className="button button--outline">Poznat Vaelora</Link>
            </div>
          </div>
        </section>

        <section className="final-cta section shell">
          <div>
            <p className="kicker">Příběh čeká</p>
            <h2>Stačí říct první větu.</h2>
            <p>Žádné studium pravidel. Žádná příprava mapy. Jen společné rozhodování a svět, který na vás odpovídá.</p>
          </div>
          <Link href="/start" className="button button--gold button--large">Začít hrát</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
