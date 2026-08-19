import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function SiteHeader({ locale = "cs" }: { locale?: "cs" | "en" }) {
  const english = locale === "en";
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href={english ? "/en" : "/"} className="site-brand" aria-label={english ? "AI Fantasy Adventure – home" : "AI Fantasy Adventure – domů"}>
          <BrandMark />
          <span className="site-brand__text">
            <strong>AI Fantasy</strong>
            <span>Adventure</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label={english ? "Main navigation" : "Hlavní navigace"}>
          <Link href={english ? "/en#play" : "/start"}>{english ? "Start playing" : "Začít hrát"}</Link>
          <Link href="/explorer">{english ? "World explorer" : "Explorer světa"}</Link>
          <Link href="/explorer/pravidla">{english ? "Rules" : "Pravidla"}</Link>
          <Link href="/explorer/vaelor">Vaelor</Link>
        </nav>
        <div className="site-actions">
          <span className="language-switch" aria-label={english ? "Website language" : "Jazyk webu"}>
            {english ? <Link href="/">CZ</Link> : <strong>CZ</strong>}
            {english ? <strong>EN</strong> : <Link href="/en" title="English edition">EN</Link>}
          </span>
          <Link href={english ? "/en#play" : "/start"} className="button button--small button--gold">
            {english ? "Start playing" : "Začít hrát"}
          </Link>
        </div>
      </div>
    </header>
  );
}
