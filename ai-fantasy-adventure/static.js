(() => {
  const basePath = '/ai-fantasy-adventure';
  const bestiaryEnglishToCzech = { animals: 'zvirata', people: 'lide-npc', 'fantasy-humanoids': 'fantasy-humanoidi', undead: 'nemrtvi', monsters: 'nestvury' };
  const bestiaryCzechToEnglish = Object.fromEntries(Object.entries(bestiaryEnglishToCzech).map(([en, cs]) => [cs, en]));
  const equipmentEnglishToCzech = { 'melee-weapons': 'weapons-melee', 'ranged-weapons': 'weapons-ranged', armor: 'armor' };
  const equipmentCzechToEnglish = Object.fromEntries(Object.entries(equipmentEnglishToCzech).map(([en, cs]) => [cs, en]));
  const bestiaryCategoryBySlug = {"krysa":"zvirata","netopyr":"zvirata","divoka-kocka":"zvirata","toulavy-pes":"zvirata","liska":"zvirata","vlk":"zvirata","divoke-prase":"zvirata","jedovaty-had":"zvirata","medved":"zvirata","krokodyl":"zvirata","orel":"zvirata","jelen":"zvirata","vesnican":"lide-npc","obchodnik":"lide-npc","kovar":"lide-npc","lovec":"lide-npc","zlodej":"lide-npc","bandita":"lide-npc","vudce-banditu":"lide-npc","zoldner":"lide-npc","vojak":"lide-npc","lucistnik":"lide-npc","rytir":"lide-npc","kouzelnik":"lide-npc","lecitel":"lide-npc","slechtic":"lide-npc","kral-kralovna":"lide-npc","goblin":"fantasy-humanoidi","goblin-lucistnik":"fantasy-humanoidi","kobold":"fantasy-humanoidi","hobgoblin":"fantasy-humanoidi","bugbear":"fantasy-humanoidi","gnom":"fantasy-humanoidi","kentaur":"fantasy-humanoidi","minotaur":"fantasy-humanoidi","obr":"fantasy-humanoidi","troll":"fantasy-humanoidi","kostlivec":"nemrtvi","kostlivec-lucistnik":"nemrtvi","zombie":"nemrtvi","ghul":"nemrtvi","duch":"nemrtvi","prizrak":"nemrtvi","mumie":"nemrtvi","upir":"nemrtvi","nekromant":"nemrtvi","obri-had":"nestvury","obri-pavouk":"nestvury","harpyje":"nestvury","gryfon":"nestvury","bazilisek":"nestvury","kamenny-golem":"nestvury","elemental":"nestvury","chimera":"nestvury","hydra":"nestvury","wyverna":"nestvury","mlady-drak":"nestvury","dospely-drak":"nestvury","prastary-drak":"nestvury","goblini-nacelnik":"fantasy-humanoidi","orci-nacelnik":"fantasy-humanoidi","arcimag":"lide-npc"};
  const equipmentCategoryBySlug = {"dyka":"weapons-melee","bojova-hul":"weapons-melee","kyj":"weapons-melee","kratky-mec":"weapons-melee","kopi":"weapons-melee","rapir":"weapons-melee","jednorucni-mec":"weapons-melee","palcat":"weapons-melee","jednorucni-sekera":"weapons-melee","halapartna":"weapons-melee","obourucni-mec":"weapons-melee","valecne-kladivo":"weapons-melee","obourucni-sekera":"weapons-melee","vrhaci-nuz":"weapons-ranged","prak":"weapons-ranged","ostep":"weapons-ranged","kratky-luk":"weapons-ranged","kuse":"weapons-ranged","dlouhy-luk":"weapons-ranged","bez-zbroje":"armor","prosivana-zbroj":"armor","kozena-zbroj":"armor","krouzkova-zbroj":"armor","supinova-zbroj":"armor","platova-zbroj":"armor","maly-stit":"shields","stredni-stit":"shields","velky-stit":"shields","batoh":"adventure-gear","spaci-vak-deka":"adventure-gear","provaz":"adventure-gear","pochoden":"adventure-gear","lucerna":"adventure-gear","olej-do-lucerny":"adventure-gear","kresadlo":"adventure-gear","mech-na-vodu":"adventure-gear","cestovni-jidlo":"adventure-gear","krida":"adventure-gear","paklice":"adventure-gear","pacidlo":"adventure-gear","lezecka-souprava":"adventure-gear","lopatka":"adventure-gear","kompas":"adventure-gear","mapa-oblasti":"adventure-gear","lecitelska-brasna":"adventure-gear","prevlekova-souprava":"adventure-gear","toulec":"adventure-gear","mesec":"adventure-gear","hak-s-lanem":"adventure-gear","dalekohled":"adventure-gear","obvazy":"adventure-gear","prazdna-lahvicka":"adventure-gear","pergamen":"adventure-gear","brk":"adventure-gear","inkoust":"adventure-gear","mech-s-vinem":"adventure-gear","loutna":"instruments","mandolina":"instruments","harfa":"instruments","dudy":"instruments","maly-buben":"instruments","pistalka":"instruments","maly-lecivy-lektvar":"potions","lecivy-lektvar":"potions","velky-lecivy-lektvar":"potions","protijed":"potions","lektvar-sily":"potions","lektvar-obratnosti":"potions","lektvar-chytrosti":"potions","lektvar-charismatu":"potions","lektvar-stesti":"potions","celenka-jasne-mysli":"magic-items","helma-strazce":"magic-items","amulet-svetla":"magic-items","talisman-ducha":"magic-items","plast-sucha":"magic-items","plast-stinu":"magic-items","roba-ohne":"magic-items","kozena-zbroj-poutnika":"magic-items","rukavice-prilnavosti":"magic-items","natepniky-lucistnika":"magic-items","prsten-tepla":"magic-items","prsten-stesteny":"magic-items","mec-presnosti":"magic-items","hul-prirody":"magic-items","kouzelnicka-hul":"magic-items","stit-ochrany":"magic-items","opasek-sily":"magic-items","opasek-lecitele":"magic-items","boty-lehkeho-kroku":"magic-items","boty-obratnosti":"magic-items","luk-vetru":"magic-items"};
  const cleanPath = (value) => value.replace(/\/$/, '') || '/';
  const toCzech = (path, hash) => {
    path = cleanPath(path.replace(/^\/ai-fantasy-adventure(?=\/|$)/, ''));
    if (path === '/en') return '/';
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
    if (path.startsWith(equipment + '/')) {
      const rest = path.slice(equipment.length + 1).split('/');
      if (rest.length > 1) return '/explorer/vybaveni/' + rest[1];
      const category = equipmentEnglishToCzech[rest[0]];
      return category ? '/explorer/vybaveni/kategorie/' + category : '/explorer/vybaveni';
    }
    return '/explorer';
  };
  const toEnglish = (path, hash) => {
    path = cleanPath(path.replace(/^\/ai-fantasy-adventure(?=\/|$)/, ''));
    if (path === '/') return '/en';
    if (path === '/start') return '/en#play';
    if (path === '/explorer') return '/en/explorer';
    if (path === '/explorer/vybaveni') return '/en/explorer/equipment/melee-weapons';
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
    if (path.startsWith('/explorer/magie')) return '/en/explorer#magic';
    if (path.startsWith('/explorer/pravidla')) return '/en/explorer#rules';
    if (path.startsWith('/explorer/vaelor')) return '/en/explorer#vaelor';
    return '/en';
  };
  const isEnglish = document.documentElement.lang === 'en';
  const languageLink = [...document.querySelectorAll('.language-switch a')].find((link) => (link.textContent || '').trim() === (isEnglish ? 'CZ' : 'EN'));
  if (languageLink) {
    const destination = isEnglish ? toCzech(location.pathname, location.hash) : toEnglish(location.pathname, location.hash);
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
})();
