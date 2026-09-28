(() => {
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
