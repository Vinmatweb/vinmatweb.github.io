(() => {
  const fold = (value) => value.toLocaleLowerCase('cs');
  const illustratedSpellSchools = new Set(["obecna", "ohen", "voda", "vzduch", "zeme", "mysl", "duch", "svetla", "temna", "prirodni"]);
  const spellRouteFromPath = (pathname) => {
    const parts = pathname.split("/").filter(Boolean);
    const magicIndex = parts.findIndex((part, index) => part === "magie" && parts[index - 1] === "explorer");
    if (magicIndex < 0) return null;
    const school = parts[magicIndex + 1];
    const spell = parts[magicIndex + 2];
    if (!illustratedSpellSchools.has(school) || !spell) return null;
    const prefixParts = parts.slice(0, magicIndex - 1);
    return {
      school,
      spell,
      prefix: prefixParts.length ? "/" + prefixParts.join("/") : "",
    };
  };
  const spellImagePath = (route) =>
    route.prefix + "/assets/magic/spells/" + route.school + "/" + route.spell + ".webp";

  const currentSpell = spellRouteFromPath(location.pathname);
  if (currentSpell) {
    const slot = document.querySelector(".asset-slot");
    const image = slot?.querySelector(".asset-slot__image");
    const title = slot?.querySelector(".asset-slot__copy strong")?.textContent?.trim();
    const eyebrow = slot?.querySelector(".asset-slot__copy > span");
    if (image) {
      image.src = spellImagePath(currentSpell);
      image.alt = title ? "Ilustrace kouzla " + title : "Ilustrace kouzla";
    }
    if (eyebrow) eyebrow.textContent = "Ilustrace konkrétního kouzla";
    slot?.querySelectorAll(".asset-slot__copy p").forEach((paragraph) => {
      if ((paragraph.textContent || "").startsWith("Společný motiv školy")) paragraph.remove();
    });
  }

  document.querySelectorAll(".collection-card").forEach((card) => {
    const href = card.getAttribute("href");
    if (!href || card.querySelector(".collection-card__image")) return;
    const route = spellRouteFromPath(new URL(href, location.href).pathname);
    if (!route) return;
    const figure = document.createElement("span");
    figure.className = "collection-card__image";
    const image = document.createElement("img");
    image.src = spellImagePath(route);
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    figure.append(image);
    card.classList.add("collection-card--image");
    card.insertBefore(figure, card.firstChild);
  });
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
