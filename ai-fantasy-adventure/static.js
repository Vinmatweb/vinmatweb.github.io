(() => {
  const basePath = '/ai-fantasy-adventure';
  const footerVersion = document.querySelector('.site-footer__meta span:first-child');
  if (footerVersion && /^(Rules|Pravidla)\b/.test((footerVersion.textContent || '').trim())) footerVersion.remove();
  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (textWalker.nextNode()) textNodes.push(textWalker.currentNode);
  for (const node of textNodes) {
    const previousText = (() => {
      let sibling = node.previousSibling;
      while (sibling && sibling.nodeType !== Node.TEXT_NODE) sibling = sibling.previousSibling;
      return sibling;
    })();
    if (/^\s*1\.0\s*$/.test(node.nodeValue || '') && previousText && /v\s*$/i.test(previousText.nodeValue || '')) {
      previousText.nodeValue = (previousText.nodeValue || '').replace(/v\s*$/i, '');
      node.nodeValue = '';
    } else {
      node.nodeValue = (node.nodeValue || '').replace(/v1\.0\b/gi, '');
    }
  }
  const isEnglish = document.documentElement.lang === 'en';
  if (isEnglish) {
    const englishDownloads = {
    "AI_Fantasy_Adventure_Manual_v1_0.docx": "AI_Fantasy_Adventure_Manual_v1_0_EN.docx",
    "AI_Fantasy_Adventure_Bestiar_v1_0.xlsx": "AI_Fantasy_Adventure_Bestiary_v1_0_EN.xlsx",
    "AI_Fantasy_Adventure_Magie_a_katalog_kouzel_v1_0.docx": "AI_Fantasy_Adventure_Magic_and_Spell_Catalogue_v1_0_EN.docx",
    "AI_Fantasy_Adventure_Katalog_vybaveni_v1_0.docx": "AI_Fantasy_Adventure_Equipment_Catalogue_v1_0_EN.docx",
    "AI_Fantasy_Adventure_v1_0_complete.zip": "AI_Fantasy_Adventure_v1_0_complete_EN.zip"
};
    document.querySelectorAll('a[href]').forEach((link) => {
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith(basePath + '/downloads/')) return;
      const filename = url.pathname.slice((basePath + '/downloads/').length);
      if (englishDownloads[filename]) link.href = basePath + '/downloads/en/' + englishDownloads[filename] + url.search + url.hash;
    });
  }

  const explorerNav = document.querySelector('.explorer-nav');
  if (explorerNav) explorerNav.setAttribute('aria-label', isEnglish ? 'World guide' : 'Průvodce světem');
  const worldName = document.querySelector('.explorer-nav__heading strong');
  if (worldName) worldName.textContent = 'Elaria';
  const worldHeading = document.querySelector('.explorer-nav__heading');
  if (worldHeading && !worldHeading.querySelector('a')) {
    const worldLink = document.createElement('a');
    worldLink.href = basePath + (isEnglish ? '/en/explorer/' : '/explorer/');
    worldLink.setAttribute('aria-label', isEnglish ? 'The world of Elaria – World guide' : 'Svět Elaria – Průvodce světem');
    worldLink.style.cssText = 'display:flex;flex-direction:column;color:inherit;text-decoration:none';
    while (worldHeading.firstChild) worldLink.appendChild(worldHeading.firstChild);
    worldHeading.appendChild(worldLink);
  }
  const rawRoute = location.pathname.replace(basePath, '').replace(/\/+$/, '') || '/';
  const currentRoute = isEnglish
    ? (rawRoute === '/' ? '/en' : (rawRoute.startsWith('/en/') ? rawRoute : '/en' + rawRoute))
    : (rawRoute.replace(/^\/cs(?=\/|$)/, '') || '/');
  const representativeHeroes = { clovek: 'clovek-bard', trpaslik: 'trpaslik-hranicar', ork: 'ork-bojovnik' };
  const isRaceIndex = currentRoute === '/explorer/hrdinove/rasy' || currentRoute === '/en/explorer/heroes/races';
  if (isRaceIndex) {
    document.querySelectorAll('.collection-card[href]').forEach((card) => {
      const href = card.getAttribute('href') || '';
      const race = Object.keys(representativeHeroes).find((slug) => href.includes('/' + slug + '/'));
      const image = card.querySelector('img');
      if (race && image) image.src = basePath + '/assets/heroes/' + representativeHeroes[race] + '.webp';
    });
  } else {
    const raceMatch = currentRoute.match(/(?:\/explorer\/hrdinove\/rasy|\/en\/explorer\/heroes\/races)\/(clovek|trpaslik|ork)$/);
    if (raceMatch) {
      const image = document.querySelector('.detail-hero img');
      if (image) image.src = basePath + '/assets/heroes/' + representativeHeroes[raceMatch[1]] + '.webp';
    }
  }
  const encyclopediaLink = document.querySelector('.site-nav a[href$="/explorer"], .site-nav a[href$="/explorer/"]');
  if (encyclopediaLink) encyclopediaLink.textContent = isEnglish ? 'World guide' : 'Průvodce světem';
  const guidePath = basePath + (isEnglish ? '/en/explorer' : '/explorer');
  const overviewLink = [...document.querySelectorAll('.explorer-nav a')].find((link) => {
    const path = new URL(link.href, location.href).pathname.replace(/\/$/, '');
    return path === guidePath;
  });
  if (overviewLink) overviewLink.textContent = isEnglish ? 'World guide' : 'Průvodce světem';
  if (explorerNav) {
    const directLinks = [...explorerNav.querySelectorAll(':scope > a.explorer-nav__link')];
    directLinks.forEach((link) => {
      const path = new URL(link.href, location.href).pathname.replace(/\/$/, '');
      if (path === guidePath || path.endsWith('/printable-samples') || path.endsWith('/tiskove-vzory')) link.remove();
    });
    const infoPath = basePath + (isEnglish ? '/en/explorer/more-information/' : '/explorer/dalsi-informace/');
    let infoLink = [...explorerNav.querySelectorAll(':scope > a.explorer-nav__link')].find((link) => new URL(link.href, location.href).pathname.replace(/\/$/, '') === infoPath.replace(/\/$/, ''));
    if (!infoLink) {
      infoLink = document.createElement('a');
      infoLink.className = 'explorer-nav__link';
      infoLink.href = infoPath;
      infoLink.textContent = isEnglish ? 'More information' : 'Další informace';
    }
    const magicGroup = [...explorerNav.querySelectorAll(':scope > details')].find((group) => /^(Magic|Magie)/.test((group.querySelector('summary')?.textContent || '').trim()));
    if (magicGroup) magicGroup.insertAdjacentElement('afterend', infoLink);
    const findDirect = (suffixes) => [...explorerNav.querySelectorAll(':scope > a.explorer-nav__link')].find((link) => suffixes.some((suffix) => new URL(link.href, location.href).pathname.replace(/\/$/, '').endsWith(suffix)));
    const vaelor = findDirect(['/explorer/vaelor']);
    let adventures = findDirect(isEnglish ? ['/explorer/adventures'] : ['/explorer/dobrodruzstvi']);
    if (!adventures) {
      adventures = document.createElement('a');
      adventures.className = 'explorer-nav__link';
      adventures.href = basePath + (isEnglish ? '/en/explorer/adventures/' : '/explorer/dobrodruzstvi/');
      adventures.textContent = isEnglish ? 'Sample adventures' : 'Ukázková dobrodružství';
    }
    const rules = findDirect(isEnglish ? ['/explorer/rules'] : ['/explorer/pravidla']);
    if (vaelor) explorerNav.appendChild(vaelor);
    explorerNav.appendChild(adventures);
    if (rules) explorerNav.appendChild(rules);
  }
  const siteNav = document.querySelector('.site-nav');
  if (siteNav) {
    const anchors = [...siteNav.querySelectorAll('a')];
    const pathEndsWith = (link, suffix) => new URL(link.href, location.href).pathname.replace(/\/$/, '').endsWith(suffix);
    const vaelor = anchors.find((link) => pathEndsWith(link, '/explorer/vaelor'));
    const rules = anchors.find((link) => pathEndsWith(link, isEnglish ? '/explorer/rules' : '/explorer/pravidla'));
    let adventures = anchors.find((link) => pathEndsWith(link, isEnglish ? '/explorer/adventures' : '/explorer/dobrodruzstvi'));
    if (!adventures) {
      adventures = document.createElement('a');
      adventures.href = basePath + (isEnglish ? '/en/explorer/adventures/' : '/explorer/dobrodruzstvi/');
      adventures.textContent = isEnglish ? 'Sample adventures' : 'Ukázková dobrodružství';
    }
    if (vaelor) siteNav.appendChild(vaelor);
    siteNav.appendChild(adventures);
    if (rules) siteNav.appendChild(rules);
  }
  document.querySelectorAll('.breadcrumbs a[href$="/explorer"], .breadcrumbs a[href$="/explorer/"], .breadcrumbs a[href$="/en/explorer"], .breadcrumbs a[href$="/en/explorer/"]').forEach((link) => {
    link.textContent = isEnglish ? 'World Guide' : 'Průvodce světem';
  });
  const footerLinks = document.querySelector('.site-footer__links');
  if (footerLinks) {
    [...footerLinks.querySelectorAll('a')].forEach((link) => {
      const label = (link.textContent || '').trim();
      if (['Start playing', 'Začít hrát', 'World overview', 'World guide', 'Encyklopedie', 'Průvodce světem'].includes(label) || link.hasAttribute('download') || /\.zip(?:$|\?)/i.test(link.href)) link.remove();
    });
    if (![...footerLinks.querySelectorAll('a')].some((link) => /\/support\/?$/.test(new URL(link.href, location.href).pathname))) {
      const support = document.createElement('a');
      support.href = basePath + (isEnglish ? '/en/support/' : '/support/');
      support.textContent = isEnglish ? 'Support' : 'Podpora';
      footerLinks.insertBefore(support, footerLinks.firstChild);
    }
    for (const [href, label] of [['https://vinmat.eu/privacy.html', isEnglish ? 'Privacy' : 'Soukromí'], ['https://vinmat.eu/terms.html', isEnglish ? 'Terms' : 'Podmínky']]) {
      if (![...footerLinks.querySelectorAll('a')].some((link) => new URL(link.href, location.href).href === href)) {
        const legal = document.createElement('a');
        legal.href = href;
        legal.textContent = label;
        footerLinks.appendChild(legal);
      }
    }
  }
  const bestiaryEnglishToCzech = { animals: 'zvirata', people: 'lide-npc', 'fantasy-humanoids': 'fantasy-humanoidi', undead: 'nemrtvi', monsters: 'nestvury' };
  const bestiaryCzechToEnglish = Object.fromEntries(Object.entries(bestiaryEnglishToCzech).map(([en, cs]) => [cs, en]));
  const equipmentEnglishToCzech = { 'melee-weapons': 'weapons-melee', 'ranged-weapons': 'weapons-ranged', armor: 'armor', shields: 'shields', 'adventure-gear': 'adventure-gear', instruments: 'instruments', potions: 'potions', 'magic-items': 'magic-items' };
  const equipmentCzechToEnglish = Object.fromEntries(Object.entries(equipmentEnglishToCzech).map(([en, cs]) => [cs, en]));
  const bestiaryCategoryBySlug = {"krysa":"zvirata","netopyr":"zvirata","divoka-kocka":"zvirata","toulavy-pes":"zvirata","liska":"zvirata","vlk":"zvirata","divoke-prase":"zvirata","jedovaty-had":"zvirata","medved":"zvirata","krokodyl":"zvirata","orel":"zvirata","jelen":"zvirata","vesnican":"lide-npc","obchodnik":"lide-npc","kovar":"lide-npc","lovec":"lide-npc","zlodej":"lide-npc","bandita":"lide-npc","vudce-banditu":"lide-npc","zoldner":"lide-npc","vojak":"lide-npc","lucistnik":"lide-npc","rytir":"lide-npc","kouzelnik":"lide-npc","lecitel":"lide-npc","slechtic":"lide-npc","kral-kralovna":"lide-npc","goblin":"fantasy-humanoidi","goblin-lucistnik":"fantasy-humanoidi","kobold":"fantasy-humanoidi","hobgoblin":"fantasy-humanoidi","bugbear":"fantasy-humanoidi","gnom":"fantasy-humanoidi","kentaur":"fantasy-humanoidi","minotaur":"fantasy-humanoidi","obr":"fantasy-humanoidi","troll":"fantasy-humanoidi","kostlivec":"nemrtvi","kostlivec-lucistnik":"nemrtvi","zombie":"nemrtvi","ghul":"nemrtvi","duch":"nemrtvi","prizrak":"nemrtvi","mumie":"nemrtvi","upir":"nemrtvi","nekromant":"nemrtvi","obri-had":"nestvury","obri-pavouk":"nestvury","harpyje":"nestvury","gryfon":"nestvury","bazilisek":"nestvury","kamenny-golem":"nestvury","elemental":"nestvury","chimera":"nestvury","hydra":"nestvury","wyverna":"nestvury","mlady-drak":"nestvury","dospely-drak":"nestvury","prastary-drak":"nestvury","goblini-nacelnik":"fantasy-humanoidi","orci-nacelnik":"fantasy-humanoidi","arcimag":"lide-npc"};
  const equipmentCategoryBySlug = {"dyka":"weapons-melee","bojova-hul":"weapons-melee","kyj":"weapons-melee","kratky-mec":"weapons-melee","kopi":"weapons-melee","rapir":"weapons-melee","jednorucni-mec":"weapons-melee","palcat":"weapons-melee","jednorucni-sekera":"weapons-melee","halapartna":"weapons-melee","obourucni-mec":"weapons-melee","valecne-kladivo":"weapons-melee","obourucni-sekera":"weapons-melee","vrhaci-nuz":"weapons-ranged","prak":"weapons-ranged","ostep":"weapons-ranged","kratky-luk":"weapons-ranged","kuse":"weapons-ranged","dlouhy-luk":"weapons-ranged","bez-zbroje":"armor","prosivana-zbroj":"armor","kozena-zbroj":"armor","krouzkova-zbroj":"armor","supinova-zbroj":"armor","platova-zbroj":"armor","maly-stit":"shields","stredni-stit":"shields","velky-stit":"shields","batoh":"adventure-gear","spaci-vak-deka":"adventure-gear","provaz":"adventure-gear","pochoden":"adventure-gear","lucerna":"adventure-gear","olej-do-lucerny":"adventure-gear","kresadlo":"adventure-gear","mech-na-vodu":"adventure-gear","cestovni-jidlo":"adventure-gear","krida":"adventure-gear","paklice":"adventure-gear","pacidlo":"adventure-gear","lezecka-souprava":"adventure-gear","lopatka":"adventure-gear","kompas":"adventure-gear","mapa-oblasti":"adventure-gear","lecitelska-brasna":"adventure-gear","prevlekova-souprava":"adventure-gear","toulec":"adventure-gear","mesec":"adventure-gear","hak-s-lanem":"adventure-gear","dalekohled":"adventure-gear","obvazy":"adventure-gear","prazdna-lahvicka":"adventure-gear","pergamen":"adventure-gear","brk":"adventure-gear","inkoust":"adventure-gear","mech-s-vinem":"adventure-gear","loutna":"instruments","mandolina":"instruments","harfa":"instruments","dudy":"instruments","maly-buben":"instruments","pistalka":"instruments","maly-lecivy-lektvar":"potions","lecivy-lektvar":"potions","velky-lecivy-lektvar":"potions","protijed":"potions","lektvar-sily":"potions","lektvar-obratnosti":"potions","lektvar-chytrosti":"potions","lektvar-charismatu":"potions","lektvar-stesti":"potions","celenka-jasne-mysli":"magic-items","helma-strazce":"magic-items","amulet-svetla":"magic-items","talisman-ducha":"magic-items","plast-sucha":"magic-items","plast-stinu":"magic-items","roba-ohne":"magic-items","kozena-zbroj-poutnika":"magic-items","rukavice-prilnavosti":"magic-items","natepniky-lucistnika":"magic-items","prsten-tepla":"magic-items","prsten-stesteny":"magic-items","mec-presnosti":"magic-items","hul-prirody":"magic-items","kouzelnicka-hul":"magic-items","stit-ochrany":"magic-items","opasek-sily":"magic-items","opasek-lecitele":"magic-items","boty-lehkeho-kroku":"magic-items","boty-obratnosti":"magic-items","luk-vetru":"magic-items"};
  const cleanPath = (value) => value.replace(/\/$/, '') || '/';
  const toCzech = (path, hash) => {
    path = cleanPath(path.replace(/^\/ai-fantasy-adventure(?=\/|$)/, ''));
    if (path === '/en') return '/';
    if (path === '/en/support') return '/support';
    if (path === '/en/start') return '/start';
    if (path === '/en/explorer/adventures') return '/explorer/dobrodruzstvi';
    if (path === '/en/explorer/more-information') return '/explorer/dalsi-informace';
    if (path === '/en/explorer') {
      const section = (hash || '').replace(/^#/, '');
      return ({ heroes: '/explorer/hrdinove', bestiary: '/explorer/bestiar', equipment: '/explorer/vybaveni', magic: '/explorer/magie', rules: '/explorer/pravidla', vaelor: '/explorer/vaelor' })[section] || '/explorer';
    }
    const heroes = '/en/explorer/heroes';
    if (path === heroes) return '/explorer/hrdinove';
    if (path.startsWith(heroes + '/')) {
      const rest = path.slice(heroes.length + 1).split('/');
      if (rest[0] === 'races') return '/explorer/hrdinove/rasy' + (rest[1] ? '/' + rest[1] : '');
      if (rest[0] === 'classes') return '/explorer/hrdinove/povolani' + (rest[1] ? '/' + rest[1] : '');
      return '/explorer/hrdinove/' + rest.join('/');
    }
    const bestiary = '/en/explorer/bestiary';
    if (path === bestiary) {
      const category = bestiaryEnglishToCzech[(hash || '').replace(/^#/, '')];
      return category ? '/explorer/bestiar/kategorie/' + category : '/explorer/bestiar';
    }
    if (path.startsWith(bestiary + '/')) {
      const rest = path.slice(bestiary.length + 1).split('/');
      if (rest.length > 1) return '/explorer/bestiar/' + rest[1];
      const category = bestiaryEnglishToCzech[rest[0]];
      return category ? '/explorer/bestiar/kategorie/' + category : '/explorer/bestiar';
    }
    const equipment = '/en/explorer/equipment';
    if (path === equipment) return '/explorer/vybaveni';
    if (path.startsWith(equipment + '/')) {
      const rest = path.slice(equipment.length + 1).split('/');
      if (rest.length > 1) return '/explorer/vybaveni/' + rest[1];
      const category = equipmentEnglishToCzech[rest[0]];
      return category ? '/explorer/vybaveni/kategorie/' + category : '/explorer/vybaveni';
    }
    const magic = '/en/explorer/magic';
    if (path === magic) return '/explorer/magie';
    if (path.startsWith(magic + '/')) return '/explorer/magie/' + path.slice(magic.length + 1);
    if (path === '/en/explorer/rules') return '/explorer/pravidla';
    if (path === '/en/explorer/vaelor') return '/explorer/vaelor';
    return '/explorer';
  };
  const toEnglish = (path, hash) => {
    path = cleanPath(path.replace(/^\/ai-fantasy-adventure(?=\/|$)/, ''));
    if (path === '/') return '/en';
    if (path === '/support') return '/en/support';
    if (path === '/start') return '/en/start';
    if (path === '/explorer/dobrodruzstvi') return '/en/explorer/adventures';
    if (path === '/explorer/dalsi-informace') return '/en/explorer/more-information';
    if (path === '/explorer') return '/en/explorer';
    if (path === '/explorer/vybaveni') return '/en/explorer/equipment';
    const heroes = '/explorer/hrdinove';
    if (path === heroes) return '/en/explorer/heroes';
    if (path.startsWith(heroes + '/')) {
      const rest = path.slice(heroes.length + 1).split('/');
      if (rest[0] === 'rasy') return '/en/explorer/heroes/races' + (rest[1] ? '/' + rest[1] : '');
      if (rest[0] === 'povolani') return '/en/explorer/heroes/classes' + (rest[1] ? '/' + rest[1] : '');
      return '/en/explorer/heroes/' + rest.join('/');
    }
    const bestiary = '/explorer/bestiar';
    if (path === bestiary) return '/en/explorer/bestiary';
    if (path.startsWith(bestiary + '/kategorie/')) {
      const category = path.slice((bestiary + '/kategorie/').length);
      return '/en/explorer/bestiary/' + (bestiaryCzechToEnglish[category] || '');
    }
    if (path.startsWith(bestiary + '/')) {
      const slug = path.slice(bestiary.length + 1);
      const category = bestiaryCzechToEnglish[bestiaryCategoryBySlug[slug]];
      return category ? '/en/explorer/bestiary/' + category + '/' + slug : '/en/explorer/bestiary';
    }
    const equipment = '/explorer/vybaveni';
    if (path.startsWith(equipment + '/kategorie/')) {
      const category = path.slice((equipment + '/kategorie/').length);
      return '/en/explorer/equipment/' + (equipmentCzechToEnglish[category] || 'melee-weapons');
    }
    if (path.startsWith(equipment + '/')) {
      const slug = path.slice(equipment.length + 1);
      const category = equipmentCzechToEnglish[equipmentCategoryBySlug[slug]];
      return category ? '/en/explorer/equipment/' + category + '/' + slug : '/en/explorer/equipment/melee-weapons';
    }
    const magic = '/explorer/magie';
    if (path === magic) return '/en/explorer/magic';
    if (path.startsWith(magic + '/')) return '/en/explorer/magic/' + path.slice(magic.length + 1);
    if (path === '/explorer/pravidla') return '/en/explorer/rules';
    if (path === '/explorer/vaelor') return '/en/explorer/vaelor';
    return '/en';
  };
  const languageLink = [...document.querySelectorAll('.language-switch:not(.language-switch--fixed) a')].find((link) => (link.textContent || '').trim() === (isEnglish ? 'CZ' : 'EN'));
  if (languageLink) {
    const destination = isEnglish
      ? '/cs' + toCzech(basePath + currentRoute, location.hash)
      : toEnglish(basePath + currentRoute, location.hash).replace(/^\/en(?=\/|$)/, '') || '/';
    languageLink.href = basePath + destination;
  }

  const fold = (value) => value.toLocaleLowerCase('cs');
  document.querySelectorAll('.collection-search').forEach((root) => {
    const input = root.querySelector('input');
    const count = root.querySelector('.search-count');
    const cards = [...root.querySelectorAll('.collection-card')];
    if (!input || !count) return;
    input.addEventListener('input', () => {
      const query = fold(input.value.trim());
      let visible = 0;
      cards.forEach((card) => {
        const show = !query || fold(card.textContent || '').includes(query);
        card.hidden = !show;
        if (show) visible += 1;
      });
      count.textContent = String(visible);
    });
  });

  document.querySelectorAll('.copy-prompt').forEach((root) => {
    const button = root.querySelector('button');
    const quote = root.querySelector('blockquote');
    if (!button || !quote) return;
    const original = button.textContent;
    button.addEventListener('click', async () => {
      const text = (quote.textContent || '').trim().replace(/^„|“$/g, '');
      await navigator.clipboard.writeText(text);
      button.textContent = document.querySelector('main[lang="en"]') ? 'Copied' : 'Zkopírováno';
      window.setTimeout(() => { button.textContent = original; }, 1800);
    });
  });

  // Put English pages at the primary URL and Czech pages under /cs/.
  const isSharedPath = (pathname) => [basePath + '/assets/', basePath + '/downloads/', basePath + '/aifa/'].some((prefix) => pathname.startsWith(prefix))
    || [basePath + '/manifest.webmanifest', basePath + '/favicon.svg', basePath + '/og-image.jpg'].includes(pathname);
  document.querySelectorAll('a[href]').forEach((link) => {
    if (link.matches('.language-switch a, .language-switch--fixed a')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith(basePath) || isSharedPath(url.pathname)) return;
    if (isEnglish) {
      url.pathname = url.pathname.replace(/^\/ai-fantasy-adventure\/en(?=\/|$)/, basePath) || basePath + '/';
    } else {
      let route = url.pathname.slice(basePath.length) || '/';
      if (route === '/cs' || route.startsWith('/cs/')) return;
      if (route === '/en' || route.startsWith('/en/')) route = toCzech(basePath + route, url.hash);
      if (!route.startsWith('/cs/')) route = '/cs' + (route === '/' ? '/' : route);
      url.pathname = basePath + route;
    }
    link.href = url.href;
  });

  const englishRoute = isEnglish
    ? (currentRoute.replace(/^\/en(?=\/|$)/, '') || '/')
    : (toEnglish(basePath + currentRoute, location.hash).replace(/^\/en(?=\/|#|$)/, '').split('#')[0] || '/');
  const czechRoute = isEnglish
    ? toCzech(basePath + currentRoute, location.hash)
    : currentRoute;
  const routeHref = (route) => basePath + (route === '/' ? '/' : route.replace(/^\//, '') + (route.endsWith('/') ? '' : '/'));
  const canonical = document.querySelector('link[rel="canonical"]') || document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'canonical' }));
  canonical.href = location.origin + (isEnglish ? routeHref(englishRoute) : routeHref('/cs' + (czechRoute === '/' ? '/' : czechRoute)));
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => link.remove());
  const addAlternate = (lang, route) => {
    const link = document.createElement('link'); link.rel = 'alternate'; link.hreflang = lang; link.href = location.origin + routeHref(route); document.head.appendChild(link);
  };
  addAlternate('en', englishRoute);
  addAlternate('cs-CZ', '/cs' + (czechRoute === '/' ? '/' : czechRoute));
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.content = isEnglish ? 'en_US' : 'cs_CZ';
})();
