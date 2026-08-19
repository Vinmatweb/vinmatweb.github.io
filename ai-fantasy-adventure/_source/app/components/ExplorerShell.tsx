import Link from "next/link";
import { gameData } from "../data";

function NavLink({ href, currentPath, children }: { href: string; currentPath: string; children: React.ReactNode }) {
  const active = currentPath === href;
  return (
    <Link href={href} className={active ? "explorer-nav__link is-active" : "explorer-nav__link"} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}

function ExplorerNav({ currentPath }: { currentPath: string }) {
  const heroesOpen = currentPath.includes("/hrdinove");
  const bestiaryOpen = currentPath.includes("/bestiar");
  const equipmentOpen = currentPath.includes("/vybaveni");
  const magicOpen = currentPath.includes("/magie");

  return (
    <nav className="explorer-nav" aria-label="Explorer světa">
      <div className="explorer-nav__heading">
        <span>Svět v1.0</span>
        <strong>AI Fantasy Adventure</strong>
      </div>
      <NavLink href="/explorer" currentPath={currentPath}>Přehled světa</NavLink>

      <details open={heroesOpen}>
        <summary>Hrdinové <span>{gameData.heroes.length}</span></summary>
        <div className="explorer-nav__branch">
          <details open={currentPath.includes("/hrdinove/rasy")}>
            <summary>Rasy <span>{gameData.races.length}</span></summary>
            <div className="explorer-nav__branch">
              <NavLink href="/explorer/hrdinove/rasy" currentPath={currentPath}>Všechny rasy</NavLink>
              {gameData.races.map((race) => (
                <NavLink href={`/explorer/hrdinove/rasy/${race.slug}`} currentPath={currentPath} key={race.slug}>{race.name}</NavLink>
              ))}
            </div>
          </details>
          <details open={currentPath.includes("/hrdinove/povolani")}>
            <summary>Povolání <span>{gameData.classes.length}</span></summary>
            <div className="explorer-nav__branch">
              <NavLink href="/explorer/hrdinove/povolani" currentPath={currentPath}>Všechna povolání</NavLink>
              {gameData.classes.map((item) => (
                <NavLink href={`/explorer/hrdinove/povolani/${item.slug}`} currentPath={currentPath} key={item.slug}>{item.name}</NavLink>
              ))}
            </div>
          </details>
          <NavLink href="/explorer/hrdinove" currentPath={currentPath}>30 kombinací</NavLink>
        </div>
      </details>

      <details open={bestiaryOpen}>
        <summary>Bestiář <span>{gameData.bestiary.length}</span></summary>
        <div className="explorer-nav__branch">
          <NavLink href="/explorer/bestiar" currentPath={currentPath}>Všichni tvorové</NavLink>
          {gameData.bestiaryCategories.map((category) => (
            <NavLink href={`/explorer/bestiar/kategorie/${category.slug}`} currentPath={currentPath} key={category.slug}>
              {category.name} <small>{category.count}</small>
            </NavLink>
          ))}
        </div>
      </details>

      <details open={equipmentOpen}>
        <summary>Vybavení <span>{gameData.equipment.length}</span></summary>
        <div className="explorer-nav__branch">
          <NavLink href="/explorer/vybaveni" currentPath={currentPath}>Celý katalog</NavLink>
          {gameData.equipmentCategories.map((category) => (
            <NavLink href={`/explorer/vybaveni/kategorie/${category.slug}`} currentPath={currentPath} key={category.slug}>
              {category.name} <small>{category.count}</small>
            </NavLink>
          ))}
        </div>
      </details>

      <details open={magicOpen}>
        <summary>Magie <span>{gameData.spells.length}</span></summary>
        <div className="explorer-nav__branch">
          <NavLink href="/explorer/magie" currentPath={currentPath}>Všechny školy</NavLink>
          {gameData.magicSchools.map((school) => (
            <NavLink href={`/explorer/magie/${school.slug}`} currentPath={currentPath} key={school.slug}>
              <span aria-hidden="true">{school.symbol}</span> {school.name}
            </NavLink>
          ))}
        </div>
      </details>

      <NavLink href="/explorer/pravidla" currentPath={currentPath}>Pravidla</NavLink>
      <NavLink href="/explorer/vaelor" currentPath={currentPath}>Vaelor</NavLink>
    </nav>
  );
}

export function ExplorerShell({ currentPath, children }: { currentPath: string; children: React.ReactNode }) {
  return (
    <div className="explorer-layout">
      <input type="checkbox" id="explorer-sidebar-toggle" className="sidebar-toggle" />
      <aside className="explorer-sidebar">
        <label htmlFor="explorer-sidebar-toggle" className="sidebar-close" aria-label="Zavřít navigaci">×</label>
        <ExplorerNav currentPath={currentPath} />
      </aside>
      <label htmlFor="explorer-sidebar-toggle" className="sidebar-scrim" aria-hidden="true" />
      <div className="explorer-main">
        <label htmlFor="explorer-sidebar-toggle" className="sidebar-open button button--ghost button--small">
          <span aria-hidden="true">☰</span> Obsah světa
        </label>
        {children}
      </div>
    </div>
  );
}
