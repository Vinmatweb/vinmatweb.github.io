import Link from "next/link";
import { gameData } from "../data";
import { BrandMark } from "./BrandMark";

export function SiteFooter({ locale = "cs" }: { locale?: "cs" | "en" }) {
  const english = locale === "en";
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <BrandMark compact />
          <div>
            <strong>AI Fantasy Adventure</strong>
            <span>{english ? "Cooperative storytelling RPG with an AI Game Master" : "Kooperativní vyprávěcí RPG s AI Pánem jeskyně"}</span>
          </div>
        </div>
        <div className="site-footer__links">
          <Link href={english ? "/en#play" : "/start"}>{english ? "Start playing" : "Začít hrát"}</Link>
          <Link href="/explorer">{english ? "Encyclopedia" : "Encyklopedie"}</Link>
          <a href="/downloads/AI_Fantasy_Adventure_v1_0_complete.zip" download>
            {english ? "Complete package" : "Kompletní balíček"}
          </a>
        </div>
        <div className="site-footer__meta">
          <span>{english ? "Rules" : "Pravidla"} v{gameData.meta.version}</span>
          <span>© 2026 VinMat</span>
        </div>
      </div>
    </footer>
  );
}
