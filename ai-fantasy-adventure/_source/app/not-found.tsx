import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="standalone-page">
        <section className="page-hero">
          <div className="shell page-hero__inner">
            <div>
              <p className="kicker">Ztracená stezka • 404</p>
              <h1>Tudy příběh nevede.</h1>
              <p>Stránka neexistuje nebo byla přesunuta. Vaelor zná jinou cestu.</p>
              <div className="hero-actions">
                <Link href="/explorer" className="button button--gold">Otevřít Explorer</Link>
                <Link href="/" className="button button--outline">Zpět domů</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
