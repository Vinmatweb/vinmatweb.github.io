/* eslint-disable @next/next/no-img-element -- curated WebP assets are pre-sized and manually optimized */
import type { Metadata } from "next";
import Link from "next/link";
import { CopyPrompt } from "../components/CopyPrompt";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { gameData } from "../data";

export const metadata: Metadata = {
  title: "Family fantasy RPG with an AI Game Master",
  description: "AI Fantasy Adventure is a cooperative fantasy RPG for children and parents. Talk, choose, and explore while AI runs the world and rules.",
  alternates: { canonical: "/en", languages: { "cs-CZ": "/", en: "/en" } },
  openGraph: { locale: "en_US" },
};

const downloads = [
  ["Manual", "/downloads/AI_Fantasy_Adventure_Manual_v1_0.docx"],
  ["Bestiary", "/downloads/AI_Fantasy_Adventure_Bestiar_v1_0.xlsx"],
  ["Magic & spell catalogue", "/downloads/AI_Fantasy_Adventure_Magie_a_katalog_kouzel_v1_0.docx"],
  ["Equipment catalogue", "/downloads/AI_Fantasy_Adventure_Katalog_vybaveni_v1_0.docx"],
] as const;

export default function EnglishPage() {
  return (
    <>
      <SiteHeader locale="en" />
      <main lang="en">
        <section className="home-hero" aria-labelledby="en-title">
          <img src="/assets/illustrations/home-hero.webp" alt="Five fantasy heroes overlook a valley, a castle, and a distant dragon" width="1672" height="941" fetchPriority="high" />
          <div className="home-hero__veil" />
          <div className="home-hero__content shell">
            <p className="kicker">Cooperative fantasy RPG for children and parents</p>
            <h1 id="en-title"><span>AI Fantasy</span> Adventure</h1>
            <p className="hero-slogan">Every choice opens a new story.</p>
            <p className="hero-lead">Speak, decide, and explore. AI becomes the Game Master, runs the world, and handles every rule — you are the heroes.</p>
            <div className="hero-actions">
              <a href="#play" className="button button--gold button--large">Start your adventure</a>
              <Link href="/explorer" className="button button--glass button--large">Explore the world</Link>
            </div>
            <div className="hero-proof"><span>No dice</span><span>No map</span><span>No RPG experience</span></div>
          </div>
        </section>

        <section className="world-stats" aria-label="World content">
          <div className="shell world-stats__inner">
            <div><strong>{gameData.meta.counts.heroes}</strong><span>starting heroes</span></div>
            <div><strong>{gameData.meta.counts.bestiary}</strong><span>creatures &amp; NPCs</span></div>
            <div><strong>{gameData.meta.counts.spells}</strong><span>spells</span></div>
            <div><strong>{gameData.meta.counts.equipment}</strong><span>equipment items</span></div>
          </div>
        </section>

        <section className="start-section section shell" id="play">
          <div className="section-heading section-heading--split">
            <div><p className="kicker">Playing takes only a few minutes to start</p><h2>Begin your adventure</h2></div>
            <p>The four documents are one game system and should be uploaded together. The approved v1.0 source documents are currently in Czech; the interface is ready for a full English content edition.</p>
          </div>
          <div className="start-layout">
            <div className="start-steps">
              {[
                ["01", "Download the four documents", "The complete package is the easiest way to keep the approved v1.0 sources together."],
                ["02", "Open a new AI chat", "Upload the Manual, Bestiary, Magic book, and Equipment catalogue."],
                ["03", "Say who wants to play", "Share the player count, approximate ages, and preferred adventure mood."],
                ["04", "Vaelor takes over", "The AI Game Master guides character creation and opens the first scene."],
              ].map(([number, title, body]) => <article className="step-row" key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}
              <CopyPrompt label="Copy prompt" copiedLabel="Copied">We want to start a new adventure for two players aged 7 and 9.</CopyPrompt>
            </div>
            <div className="download-panel">
              <div className="download-panel__top"><span className="download-rune" aria-hidden="true">✦</span><div><strong>Complete rules v1.0</strong><small>4 files • one game system</small></div></div>
              <a href="/downloads/AI_Fantasy_Adventure_v1_0_complete.zip" download className="button button--gold button--full">Download complete package</a>
              <div className="download-list">
                {downloads.map(([title, href]) => <a href={href} download key={title}><span><strong>{title}</strong><small>Approved source file v1.0</small></span><span aria-hidden="true">↓</span></a>)}
              </div>
            </div>
          </div>
        </section>

        <section className="vaelor-home section">
          <div className="shell vaelor-home__inner">
            <div className="vaelor-home__image"><img src="/assets/illustrations/vaelor.webp" loading="lazy" width="1536" height="1152" alt="Vaelor holds a storybook and a glowing floating die" /></div>
            <div className="vaelor-home__copy"><p className="kicker">AI Game Master</p><h2>Vaelor, also known as Oryn</h2><p className="vaelor-title">The One Who Knows All Stories</p><p>Vaelor describes the world, controls NPCs and opponents, resolves the rules, performs virtual rolls, and remembers the adventure. The heroes’ choices always belong to the players.</p><Link href="/explorer/vaelor" className="button button--outline">Meet Vaelor</Link></div>
          </div>
        </section>
      </main>
      <SiteFooter locale="en" />
    </>
  );
}
