# AI Fantasy Adventure

Datově řízený fantasy web a encyklopedie pro kooperativní rodinné RPG, ve kterém AI přebírá roli Pána jeskyně.

**Produkční web:** [vinmat.eu/ai-fantasy-adventure](https://vinmat.eu/ai-fantasy-adventure/)

## Obsah první verze

- česká homepage a průvodce spuštěním hry;
- anglická vstupní stránka;
- stromový Explorer světa s mobilním drawerem;
- 5 ras, 6 povolání a 30 základních hrdinů;
- 62 tvorů a NPC včetně 9 bossů;
- 92 položek vybavení;
- 11 škol magie a 110 kouzel;
- stručná webová pravidla a samostatná stránka Vaelora;
- čtyři zdrojové dokumenty v1.0 a kompletní ZIP ke stažení;
- dynamická metadata, sitemap, robots.txt, manifest a OpenGraph obrázek.

## Zdroje pravdy

Web používá pouze schválené finální dokumenty z 19. srpna 2026:

1. `AI_Fantasy_Adventure_Manual_v1_0.docx`
2. `AI_Fantasy_Adventure_Bestiar_v1_0.xlsx`
3. `AI_Fantasy_Adventure_Magie_a_katalog_kouzel_v1_0.docx`
4. `AI_Fantasy_Adventure_Katalog_vybaveni_v1_0.docx`

Strukturovaný obsah je uložen v `app/data/game-data.json`. Skript `tools/generate_game_data.py` slouží k opakovatelné regeneraci dat z dokumentů. Herní hodnoty se nemají měnit přímo v prezentačních komponentách.

## Technologie

- Next.js 16 / React 19 přes Vinext
- TypeScript
- statické WebP assety s lazy loadingem
- Cloudflare Worker kompatibilní výstup
- OpenAI Sites lifecycle
- statický GitHub Pages export pro provoz v podsložce hlavního webu VinMat

## Lokální vývoj

Vyžaduje Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

Kontroly:

```bash
npm run lint
npm test
npm run export:github-pages -- /cílová/složka
npm run validate:github-pages -- /cílová/složka
```

## Struktura

```text
app/
  components/        sdílené UI komponenty
  data/              typy a jediný datový model světa
  en/                anglická vstupní stránka
  explorer/          datově generované stránky encyklopedie
  start/             průvodce spuštěním hry
public/
  assets/illustrations/
  downloads/
tools/
  generate_game_data.py
  export_github_pages.mjs
  validate_static_export.mjs
```

## Licence a obsah

Herní dokumenty, texty a obrazové assety jsou součástí projektu AI Fantasy Adventure / VinMat. Před dalším šířením mimo tento projekt ověřte příslušná práva k obsahu.
