
(() => {
  const CFG = {
    thanksUrl: "https://flashcompetitions.com/thanks",
    pageMatch: /\/thanks\/\d+/i,
    rootDone: "data-fct-root-v5",
    heroDone: "data-fct-hero-v5",
    cardDone: "data-fct-card-v5",
    bundleDone: "data-fct-bundle-v5",
    ticketsDone: "data-fct-tickets-v5",
    lootRootFlag: "data-fc-loot-upgraded-v1",
    observerKey: "__fcThanksObserverV5"
  };

  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

  function isThanksPage() {
    return location.href.includes(CFG.thanksUrl) && CFG.pageMatch.test(location.pathname);
  }

  function getRoots() {
    return $$('[wire\\:id][wire\\:snapshot]').filter((el) => {
      const snap = el.getAttribute("wire:snapshot") || "";
      return snap.includes('"name":"tenant.page.thanks"');
    });
  }

  function getProductsSection(root) {
    return root.querySelector('section[aria-labelledby="products-heading"]');
  }

  function getProductCards(root) {
    const section = getProductsSection(root);
    if (!section) return [];
    const list = section.querySelector('.space-y-8');
    if (!list) return [];
    return Array.from(list.children).filter((el) => el && el.tagName === 'DIV');
  }

  function styleRoot(root) {
    if (!root || root.hasAttribute(CFG.rootDone)) return;
    root.setAttribute(CFG.rootDone, "1");
    root.classList.add("fc-thanks-root");
  }

  function injectHero(root) {
    if (!root || root.hasAttribute(CFG.heroDone)) return;
    const center = root.querySelector(':scope > .text-center');
    if (!center) return;

    const hero = document.createElement('div');
    hero.className = 'fc-thanks-hero';
    hero.innerHTML = `
      <div class="fc-thanks-title-wrap">
        <div class="fc-thanks-title">Order Successful</div>
        <div class="fc-thanks-title-line" aria-hidden="true"></div>
      </div>
    `;

    center.parentNode.insertBefore(hero, center);
    root.setAttribute(CFG.heroDone, "1");
  }

  function buildCard(card) {
    if (!card || card.hasAttribute(CFG.cardDone)) return;
    card.setAttribute(CFG.cardDone, "1");
    card.classList.add('fc-thanks-product');

    const inner = card.firstElementChild;
    if (!inner) return;

    card.classList.remove('bg-gray-50');
    inner.classList.remove('bg-gray-50');

    const image = inner.querySelector('img');
    const imageWrap = image ? image.closest('div') : null;
    const titleRow = inner.querySelector('.flex.justify-between');

    if (imageWrap) imageWrap.classList.add('fc-thanks-media');

    if (imageWrap && titleRow && !inner.querySelector('.fc-thanks-top')) {
      const top = document.createElement('div');
      top.className = 'fc-thanks-top';

      const main = document.createElement('div');
      main.className = 'fc-thanks-main';

      imageWrap.parentNode.insertBefore(top, imageWrap);
      top.appendChild(imageWrap);
      top.appendChild(main);

      const moveNodes = [];
      Array.from(inner.children).forEach((child) => {
        if (child !== top) moveNodes.push(child);
      });
      moveNodes.forEach((node) => main.appendChild(node));
    }

    const main = inner.querySelector('.fc-thanks-main');
    if (!main) return;

    const originalTitleRow = main.querySelector('.flex.justify-between');
    if (originalTitleRow && !main.querySelector('.fc-thanks-head')) {
      const h3 = originalTitleRow.querySelector('h3');
      const price = originalTitleRow.querySelector('p');

      const head = document.createElement('div');
      head.className = 'fc-thanks-head';
      head.innerHTML = `
        <div class="fc-thanks-name"></div>
        <div class="fc-thanks-price"></div>
      `;

      if (h3) head.querySelector('.fc-thanks-name').appendChild(h3);
      if (price) head.querySelector('.fc-thanks-price').appendChild(price);

      originalTitleRow.parentNode.insertBefore(head, originalTitleRow);
      originalTitleRow.remove();
    }

    const qtyRow = main.querySelector('.flex.justify-between.flex-wrap');
    if (qtyRow) {
      qtyRow.style.display = 'none';
    }

    const oldMeta = main.querySelector('.fc-thanks-meta');
    if (oldMeta) oldMeta.remove();
  }

  function enhanceBundle(card) {
    if (!card || card.hasAttribute(CFG.bundleDone)) return;

    const inner = card.querySelector('.fc-thanks-main') || card.firstElementChild;
    if (!inner) return;

    const greenParas = Array.from(inner.querySelectorAll('p.text-green-500')).filter((p) => !p.closest('[x-data]'));
    if (greenParas.length < 2) {
      card.setAttribute(CFG.bundleDone, "1");
      return;
    }

    const p1 = greenParas[0];
    const p2 = greenParas[1];
    const txt2 = clean(p2.textContent);

    if (txt2 && !inner.querySelector('.fc-thanks-bundle')) {
      const badge = document.createElement('div');
      badge.className = 'fc-thanks-bundle';
      badge.innerHTML = `<strong>Bundle</strong><span>${txt2}</span>`;
      p1.parentNode.insertBefore(badge, p1);
    }

    p1.style.display = 'none';
    p2.style.display = 'none';
    card.setAttribute(CFG.bundleDone, "1");
  }

  function getNumericTicketSpansBeforeGame(card) {
    const inner = card.querySelector('.fc-thanks-main') || card.firstElementChild;
    if (!inner) return [];

    const gameRoot = inner.querySelector('[x-data^="potDropGame_"]');
    const spans = [];
    let hitGame = false;

    Array.from(inner.children).forEach((child) => {
      if (gameRoot && child === gameRoot) {
        hitGame = true;
        return;
      }
      if (hitGame) return;

      if (child.matches && child.matches('span.font-mono')) {
        const txt = clean(child.textContent);
        if (/^\d+$/.test(txt)) spans.push(child);
      }
    });

    return spans;
  }

  function findQtyText(card) {
    const inner = card.querySelector('.fc-thanks-main') || card.firstElementChild;
    if (!inner) return '';

    const all = Array.from(inner.querySelectorAll('*'));
    const match = all.find((el) => /qty\s*x\s*\d+/i.test(clean(el.textContent)));
    return match ? clean(match.textContent) : '';
  }

  function enhanceTickets(card, idx) {
    if (!card || card.hasAttribute(CFG.ticketsDone)) return;

    const inner = card.querySelector('.fc-thanks-main') || card.firstElementChild;
    if (!inner) return;

    const ticketSpans = getNumericTicketSpansBeforeGame(card);
    if (!ticketSpans.length) return;

    const first = ticketSpans[0];
    const count = ticketSpans.length;
    const qtyText = findQtyText(card) || `Qty x${count}`;
    const openByDefault = count <= 10;

    const shell = document.createElement('div');
    shell.className = 'fc-ticket-shell' + (openByDefault ? ' is-open' : '');
    shell.setAttribute('data-fc-ticket-shell', String(idx));

    shell.innerHTML = `
      <button type="button" class="fc-ticket-toggle" aria-expanded="${openByDefault ? 'true' : 'false'}">
        <span class="fc-ticket-left">
          <span class="fc-ticket-kicker">Ticket Numbers</span>
          <span class="fc-ticket-title">${count} ${count === 1 ? 'ticket' : 'tickets'} secured</span>
          <span class="fc-ticket-sub">${qtyText} • ${openByDefault ? 'Tap to hide' : 'Tap to view all numbers'}</span>
        </span>
        <span class="fc-ticket-right">
          <span class="fc-ticket-count">${count}</span>
          <span class="fc-ticket-chevron">⌄</span>
        </span>
      </button>
      <div class="fc-ticket-panel">
        <div class="fc-ticket-grid"></div>
      </div>
    `;

    inner.insertBefore(shell, first);

    const grid = shell.querySelector('.fc-ticket-grid');
    ticketSpans.forEach((span) => {
      span.classList.add('fc-ticket-pill');
      grid.appendChild(span);
    });

    const btn = shell.querySelector('.fc-ticket-toggle');
    const sub = shell.querySelector('.fc-ticket-sub');

    btn.addEventListener('click', () => {
      const open = shell.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (sub) sub.textContent = `${qtyText} • ${open ? 'Tap to hide' : 'Tap to view all numbers'}`;
    });

    card.setAttribute(CFG.ticketsDone, "1");
  }

  function wrapGame(card) {
    const inner = card.querySelector('.fc-thanks-main') || card.firstElementChild;
    if (!inner) return;

    const game = inner.querySelector('[x-data^="potDropGame_"]');
    if (!game) return;
    if (game.parentElement && game.parentElement.classList.contains('fc-thanks-game-wrap')) return;

    const wrap = document.createElement('div');
    wrap.className = 'fc-thanks-game-wrap';
    game.parentNode.insertBefore(wrap, game);
    wrap.appendChild(game);
  }

  function redesignRepeatCard(root) {
    const duplicateCard = root.querySelector('[data-flux-card]');
    if (duplicateCard) duplicateCard.classList.remove('bg-white');
  }

  function getLootRoots() {
    return $$('[x-data]').filter((el) => {
      const xd = el.getAttribute('x-data') || '';
      return xd.includes('cases:') && xd.includes('openCase(') && xd.includes('hasOpenedCase');
    });
  }

  function upgradeLootRoot(root) {
    if (!root || root.hasAttribute(CFG.lootRootFlag)) return;
    root.setAttribute(CFG.lootRootFlag, '1');
    root.classList.add('fc-loot-upgraded');
  }

  function run() {
    if (!isThanksPage()) return;

    const roots = getRoots();
    if (roots.length) {
      roots.forEach((root) => {
        styleRoot(root);
        injectHero(root);
        redesignRepeatCard(root);

        const cards = getProductCards(root);
        cards.forEach((card, idx) => {
          buildCard(card);
          enhanceBundle(card);
          enhanceTickets(card, idx);
          wrapGame(card);
        });
      });
    }

    getLootRoots().forEach(upgradeLootRoot);
  }

  run();

  let raf = null;
  const queueRun = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(run);
  };

  document.addEventListener('DOMContentLoaded', queueRun);
  document.addEventListener('livewire:load', queueRun);
  document.addEventListener('livewire:navigated', queueRun);

  if (!window[CFG.observerKey]) {
    const obs = new MutationObserver(() => queueRun());
    obs.observe(document.documentElement, { childList: true, subtree: true });
    window[CFG.observerKey] = obs;
  }
})();
