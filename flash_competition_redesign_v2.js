(function(){
  if (!location.pathname.startsWith('/competition/')) return;

  (() => {
    const CFG = {
      pageMatch: /\/competition\//i,
      pageClass: 'fc-comp-page',
      rootClass: 'fc-comp-separator-v2',
      panelFlag: 'data-fc-fast-v14',
      bundleFlag: 'data-fc-bundle-ui-v14',
      stickyId: 'fcStickyBuyFastV14',
      defaultCheckoutGBP: 1.00,
      defaultFlag: 'data-fc-default-applied-v14'
    };

    const prefersReduced = () =>
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
    const txt = (el) => clean(el?.textContent || '');
    const sanitizeTitle = (s) => clean(String(s || '').replace(/[\u2600-\u27BF\u{1F300}-\u{1FAFF}]+/gu, '').replace(/[◆◇🔸🔹🔶🔷💎⭐✨⚡]+/gu, ''));

    function safeInsertBefore(parent, node, before){
      if (!parent || !node) return;
      if (!before || before.parentNode !== parent){
        parent.appendChild(node);
        return;
      }
      parent.insertBefore(node, before);
    }

    function ensurePageClass(){
      const onPage = CFG.pageMatch.test(location.pathname);
      document.documentElement.classList.toggle(CFG.pageClass, onPage);
      document.body?.classList.toggle(CFG.pageClass, onPage);

      const root = document.querySelector('.pb-16.pt-3.sm\\:pt-6.sm\\:pb-20');
      if (root) root.classList.toggle(CFG.rootClass, onPage);
    }

    function parseTicketPrice(raw){
      const s = clean(raw).toLowerCase();
      if (!s) return null;
      if (s.includes('free')) return 0;

      const pound = s.match(/£\s*([0-9]+(?:\.[0-9]{1,2})?)/);
      if (pound) return Number(pound[1]);

      const pence = s.match(/(^|[^0-9])([0-9]+(?:\.[0-9]+)?)\s*p\b/);
      if (pence) return Number(pence[2]) / 100;

      const any = s.match(/([0-9]+(?:\.[0-9]{1,2})?)/);
      return any ? Number(any[1]) : null;
    }

    function formatGBP(n){
      const v = Number.isFinite(n) ? n : 0;
      return '£' + v.toFixed(2);
    }

    function getTicketPrice(){
      const priceP = document.querySelector('.flex.justify-between.gap-x-5.flex-wrap.items-center p.text-3xl');
      const n = parseTicketPrice(txt(priceP));
      return Number.isFinite(n) ? n : 0;
    }

    function isFreeComp(){
      const p = getTicketPrice();
      return Number.isFinite(p) && p <= 0;
    }

    function getDefaultTicketsForGBP(price, gbp){
      const p = Number(price);
      if (!Number.isFinite(p) || p <= 0) return 1;
      return Math.max(1, Math.ceil(Number(gbp) / p));
    }

    function findTicketPanel(){
      return document.querySelector('.lg\\:col-span-6 .bg-gray-800.p-5.mt-5.rounded-lg.border-2.border-gray-700');
    }

    function getTicketInput(panel){
      return panel?.querySelector('input[type="number"][x-model="tickets"], input[type="number"][wire\\:model="tickets"], input[type="number"][name="tickets"]') || null;
    }

    function getSubmit(panel){
      return panel?.querySelector('button[type="submit"].mt-8') || panel?.querySelector('button[type="submit"]') || null;
    }

    function getTickets(panel){
      const input = getTicketInput(panel);
      const v = Number(input?.value);
      return Number.isFinite(v) && v > 0 ? v : 1;
    }

    function clamp(n, min, max){
      n = Number(n);
      if (!Number.isFinite(n)) n = min;
      return Math.max(min, Math.min(max, n));
    }

    function setTickets(panel, next){
      const input = getTicketInput(panel);
      if (!input) return;

      const maxUser = Number(input.getAttribute('max')) || 1000;

      if (isFreeComp()){
        if (String(input.value) === '1') return;
        input.value = '1';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }

      const safe = clamp(next, 1, maxUser);
      if (String(input.value) === String(safe)) return;

      input.value = String(safe);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function getMaxTicketsTotal(panel){
      const progressRow = panel.querySelector('.bg-gray-700.p-2.w-full.grid.grid-cols-12.rounded-xl');
      const progressText = panel.querySelector('#obsidian-progress');

      const candidates = [];
      if (progressText) candidates.push(txt(progressText));
      if (progressRow) candidates.push(txt(progressRow));

      for (const c of candidates){
        const m = c.match(/(\d+)\s*\/\s*(\d+)/);
        if (m){
          const max = Number(m[2]);
          if (Number.isFinite(max) && max > 0) return max;
        }
      }

      const oldOdds = panel.querySelector('span.min-w-52.text-sm.text-center.font-bold.bg-primary-500');
      const oldTxt = txt(oldOdds);
      const om = oldTxt.match(/odds\s+(\d+)\s*\/\s*1/i);
      if (om){
        const odds = Number(om[1]);
        const t = getTickets(panel);
        const max = odds * t;
        if (Number.isFinite(max) && max > 0) return max;
      }

      return null;
    }

    function buildSticky(){
      let bar = document.getElementById(CFG.stickyId);
      if (bar) return bar;

      bar = document.createElement('div');
      bar.id = CFG.stickyId;
      bar.innerHTML = `
        <div class="in">
          <div class="l">
            <div class="k">Total</div>
            <div class="v"><span class="amt">£0.00</span></div>
          </div>
          <button type="button">Add to basket</button>
        </div>
      `;
      document.body.appendChild(bar);
      return bar;
    }

    function parseBundle(text){
      const t = clean(text);
      if (!t) return null;

      let m = t.match(/buy\s*(\d+)\s*get\s*(\d+)\s*free/i);
      if (!m) m = t.match(/(\d+)\s*\+\s*(\d+)\s*free/i);
      if (!m) m = t.match(/(\d+)\s*tickets?\s*\+\s*(\d+)\s*free/i);
      if (!m) m = t.match(/bundle\s*(\d+)\s*\+\s*(\d+)/i);
      if (!m) return null;

      const buy = Number(m[1]);
      const free = Number(m[2]);
      if (!Number.isFinite(buy) || !Number.isFinite(free) || buy <= 0) return null;
      return { buy, free, total: buy + free, ratio: buy ? (free / buy) : 0 };
    }

    function findBundleGrid(panel){
      return panel.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.gap-3.pb-2');
    }

    function getBundleLabels(grid){
      if (!grid) return [];
      return [...grid.querySelectorAll('label')].filter((label) => {
        const visibleBits = [...label.querySelectorAll('span, div, p')]
          .filter((el) => !el.classList.contains('sr-only'))
          .map((el) => txt(el))
          .filter(Boolean)
          .join(' ');
        const source = visibleBits || txt(label);
        return !!parseBundle(source);
      });
    }

    function syncBundleVisibility(panel, wrap){
      const host = wrap?.querySelector('.fcBundleHost');
      const grid = findBundleGrid(panel);
      const labels = getBundleLabels(grid);
      const hasBundles = labels.length > 0;

      wrap?.classList.toggle('fc-no-bundles', !hasBundles);
      wrap?.classList.toggle('fc-has-bundles', hasBundles);
      panel?.classList.toggle('fc-no-bundles', !hasBundles);
      panel?.classList.toggle('fc-has-bundles', hasBundles);

      if (host) host.style.display = hasBundles ? '' : 'none';
      if (grid && !hasBundles) grid.style.display = 'none';
      if (grid && hasBundles) grid.style.display = '';

      return { grid, labels, hasBundles };
    }

    function ensureBundleHost(wrap){
      let host = wrap.querySelector('.fcBundleHost');
      if (host) return host;

      host = document.createElement('div');
      host.className = 'fcBundleHost';
      host.innerHTML = `
        <div class="fcSectionTitle">
          <span class="fcSectionText">Bundles</span>
        </div>
        <div class="fcBundleSlot"></div>
      `;

      const sliderWrap = wrap.querySelector('.fcSliderWrap');
      if (sliderWrap) safeInsertBefore(wrap, host, sliderWrap);
      else wrap.appendChild(host);

      return host;
    }

    function moveBundlesIntoHost(panel, wrap){
      const grid = findBundleGrid(panel);
      if (!grid) return null;

      const labels = getBundleLabels(grid);
      if (!labels.length){
        syncBundleVisibility(panel, wrap);
        return null;
      }

      const host = ensureBundleHost(wrap);
      const slot = host.querySelector('.fcBundleSlot');
      if (!slot) return null;

      if (!slot.contains(grid)) slot.appendChild(grid);
      grid.style.display = '';
      host.style.display = '';
      syncBundleVisibility(panel, wrap);
      return grid;
    }

    function markBestValue(labels){
      labels.forEach((l) => l.classList.remove('fcBestValue'));
      if (!labels.length) return;

      const parsed = labels.map((label) => {
        const span = [...label.querySelectorAll('span')].find((s) => !s.classList.contains('sr-only'));
        const info = parseBundle(span?.textContent || '');
        return { label, info };
      }).filter((x) => x.info);

      if (!parsed.length) return;

      parsed.sort((a, b) => (b.info.ratio - a.info.ratio) || (b.info.total - a.info.total) || (b.info.free - a.info.free));
      parsed[0].label.classList.add('fcBestValue');
    }

    function enhanceBundles(grid){
      const labels = getBundleLabels(grid);
      if (!labels.length) return;

      markBestValue(labels);

      labels.forEach((label) => {
        const span = [...label.querySelectorAll('span')].find((s) => !s.classList.contains('sr-only'));
        const info = parseBundle(span?.textContent || '');
        if (!info) return;
        if (label.getAttribute(CFG.bundleFlag) === '1') return;
        label.setAttribute(CFG.bundleFlag, '1');

        const ui = document.createElement('div');
        ui.className = 'fcBundleUI';
        ui.innerHTML = `
          <div class="fcBundleTopline">
            <span class="fcBundleMeta">Buy ${info.buy}</span>
            <span class="fcBundleMeta fcBundleAccent">+${info.free} Free</span>
          </div>
          <div class="fcBundleMain">${info.total} Tickets</div>
        `;

        if (span) safeInsertBefore(label, ui, span);
        else safeInsertBefore(label, ui, label.firstChild);
      });
    }

    function ensureOddsUnderTotal(wrap){
      const total = wrap.querySelector('.fcTotalCenter');
      if (!total) return null;

      let pill = total.querySelector('.fcOddsUnderTotal');
      if (!pill){
        pill = document.createElement('div');
        pill.className = 'fcOddsUnderTotal';
        pill.innerHTML = `
          <span class="dot" aria-hidden="true"></span>
          <span class="label">Odds</span>
          <span class="odds" data-fc-odds-under>—/1</span>
        `;
        total.appendChild(pill);
      }
      return pill.querySelector('[data-fc-odds-under]');
    }

    function ensureFreePill(wrap){
      const total = wrap.querySelector('.fcTotalCenter');
      if (!total) return null;

      let pill = total.querySelector('.fcFreePill');
      if (!pill){
        pill = document.createElement('div');
        pill.className = 'fcFreePill';
        pill.innerHTML = `
          <span class="dot" aria-hidden="true"></span>
          <span class="b">FREE ENTRY</span>
          <span class="sep">•</span>
          <span>1 TICKET</span>
        `;
        total.appendChild(pill);
      }
      return pill;
    }

    function setFreeModeUI(panel, wrap){
      setTickets(panel, 1);

      const kicker = wrap.querySelector('.fcFastKicker');
      if (kicker) kicker.textContent = 'Free entry. Good luck.';

      const subEl = wrap.querySelector('[data-fc-sub]');
      if (subEl) subEl.innerHTML = `1 ticket × <span class="amt">Free</span>`;

      const sliderWrap = wrap.querySelector('.fcSliderWrap');
      const chips = wrap.querySelector('[data-fc-chips]');
      const oddsPill = wrap.querySelector('.fcOddsUnderTotal');
      const bundleHost = wrap.querySelector('.fcBundleHost');

      if (sliderWrap) sliderWrap.style.display = 'none';
      if (chips) chips.style.display = 'none';
      if (oddsPill) oddsPill.style.display = 'none';
      if (bundleHost) bundleHost.style.display = 'none';

      const freePill = ensureFreePill(wrap);
      if (freePill) freePill.style.display = 'inline-flex';

      const totalEl = wrap.querySelector('[data-fc-total]');
      if (totalEl) totalEl.textContent = '';

      const sticky = document.getElementById(CFG.stickyId);
      if (sticky) sticky.style.display = 'none';
    }

    function setPaidModeUI(panel, wrap){
      const sliderWrap = wrap.querySelector('.fcSliderWrap');
      const chips = wrap.querySelector('[data-fc-chips]');
      const oddsPill = wrap.querySelector('.fcOddsUnderTotal');
      const freePill = wrap.querySelector('.fcFreePill');

      if (sliderWrap) sliderWrap.style.display = '';
      if (chips) chips.style.display = '';
      if (oddsPill) oddsPill.style.display = '';
      if (freePill) freePill.style.display = 'none';

      const kicker = wrap.querySelector('.fcFastKicker');
      if (kicker) kicker.textContent = 'Enter now. Win in a flash';

      syncBundleVisibility(panel, wrap);

      const sticky = document.getElementById(CFG.stickyId);
      if (sticky) sticky.style.display = '';
    }


    function formatDisplayPrice(raw){
      const n = parseTicketPrice(raw);
      if (n === 0) return 'Free Entry';
      if (!Number.isFinite(n)) return clean(raw);
      if (n < 1) return `${Math.round(n * 100)}p per ticket`;
      return `£${n.toFixed(2)} per ticket`;
    }

    function enhanceHeroInfo(){
      const infoCol = document.querySelector('.lg\\:col-span-6.lg\\:col-start-7');
      const imageCol = document.querySelector('.lg\\:col-span-6.lg\\:col-start-1.lg\\:row-span-3.lg\\:row-start-1');
      if (!infoCol || !imageCol) return;

      const titleRow = infoCol.querySelector('.flex.justify-between.gap-x-5.flex-wrap.items-center');
      const dateRow = infoCol.querySelector(':scope > .mt-2');
      const titleEl = titleRow?.querySelector('h1');
      const priceEl = titleRow?.querySelector('p.text-3xl');
      const dateEl = dateRow?.querySelector('p');
      if (!titleEl || !priceEl || !dateEl) return;

      infoCol.classList.add('fc-info-col');
      titleRow.classList.add('fc-hero-original');
      if (dateRow) dateRow.classList.add('fc-hero-original-date');

      const formattedPrice = formatDisplayPrice(priceEl.textContent || '');
      priceEl.innerHTML = `<span class="fcPricePrefix">Price</span><span class="fcPriceValue">${formattedPrice}</span>`;

      let hero = imageCol.querySelector('.fcHeroMeta');
      if (!hero){
        hero = document.createElement('div');
        hero.className = 'fcHeroMeta';
        imageCol.insertBefore(hero, imageCol.firstChild);
      }

      hero.innerHTML = `
        <div class="fcHeroName">${sanitizeTitle(titleEl.textContent || '')}</div>
        <div class="fcHeroPrice"><span class="fcPricePrefix">Price</span><span class="fcPriceValue">${formattedPrice}</span></div>
        <div class="fcHeroDate">${dateEl.textContent || ''}</div>
      `;
    }

    function enhancePanel(){
      const panel = findTicketPanel();
      if (!panel) return;

      const input = getTicketInput(panel);
      const submit = getSubmit(panel);
      if (!input || !submit) return;

      let wrap = panel.querySelector('.fcFastWrap');
      if (!wrap){
        const maxUser = Number(input.getAttribute('max')) || 1000;
        const toggleRow = panel.querySelector('.flex.justify-center.mb-4.rounded-md.shadow-sm');

        wrap = document.createElement('div');
        wrap.className = 'fcFastWrap';
        wrap.innerHTML = `
          <div class="fcSliderWrap">
            <div class="fcSectionTitle fcSectionTitleSmall">
              <span class="fcSectionText">Ticket Selector</span>
            </div>
            <div class="fcSliderTop">
              <div class="fcSliderLabel">Drag to set tickets</div>
              <div class="fcSliderValue"><span data-fc-tv>1</span> / <span data-fc-tmax>${maxUser}</span></div>
            </div>
            <input class="fcTicketSlider" type="range" min="1" max="${maxUser}" step="1" value="1" />
            <div class="fcTotalCenter">
              <div>Total <span class="amt" data-fc-total>£0.00</span></div>
            </div>
          </div>

          <div class="fcFastChips" data-fc-chips></div>
        `;

        if (toggleRow) toggleRow.insertAdjacentElement('afterend', wrap);
        else safeInsertBefore(panel, wrap, panel.firstChild);
      }

      const grid = moveBundlesIntoHost(panel, wrap);
      if (grid) enhanceBundles(grid);
      syncBundleVisibility(panel, wrap);

      ensureOddsUnderTotal(wrap);
      ensureFreePill(wrap);

      if (panel.getAttribute(CFG.panelFlag) === '1') return;
      panel.setAttribute(CFG.panelFlag, '1');

      const maxUser = Number(input.getAttribute('max')) || 1000;
      const subEl = wrap.querySelector('[data-fc-sub]');
      const totalEl = wrap.querySelector('[data-fc-total]');
      const tvEl = wrap.querySelector('[data-fc-tv]');
      const slider = wrap.querySelector('input.fcTicketSlider');
      const oddsUnder = wrap.querySelector('[data-fc-odds-under]');

      const applyDefaultOnce = () => {
        if (panel.getAttribute(CFG.defaultFlag) === '1') return;
        panel.setAttribute(CFG.defaultFlag, '1');

        if (isFreeComp()){
          setTickets(panel, 1);
          if (slider){
            slider.min = '1';
            slider.max = '1';
            slider.value = '1';
          }
          return;
        }

        const price = getTicketPrice();
        const defTickets = clamp(getDefaultTicketsForGBP(price, CFG.defaultCheckoutGBP), 1, maxUser);
        const cur = getTickets(panel);

        if (cur <= 1 && defTickets > 1){
          setTickets(panel, defTickets);
          if (slider) slider.value = String(defTickets);
        }
      };

      const chips = wrap.querySelector('[data-fc-chips]');
      if (chips && !chips.getAttribute('data-built')){
        chips.setAttribute('data-built', '1');
        const defs = [
          { label: '+5', add: 5 },
          { label: '+10', add: 10 },
          { label: '+25', add: 25 },
          { label: '+50', add: 50 },
          { label: '+100', add: 100 },
          { label: 'Max', max: true }
        ];

        defs.forEach((d) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'fcFastChip';
          b.textContent = d.label;
          b.addEventListener('click', () => {
            if (isFreeComp()){
              setTickets(panel, 1);
              return;
            }
            const cur = getTickets(panel);
            const next = d.max ? maxUser : (cur + d.add);
            setTickets(panel, next);
          });
          chips.appendChild(b);
        });
      }

      const sticky = buildSticky();
      const stickyAmt = sticky?.querySelector('.amt');
      const stickyBtn = sticky?.querySelector('button');

      if (stickyBtn && !stickyBtn.getAttribute('data-fc-bound')){
        stickyBtn.setAttribute('data-fc-bound', '1');
        stickyBtn.addEventListener('click', () => {
          if (isFreeComp()) setTickets(panel, 1);
          try {
            panel.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'center' });
          } catch (e) {}
          setTimeout(() => submit.click(), prefersReduced() ? 0 : 200);
        });
      }

      if (slider && !slider.getAttribute('data-fc-bound')){
        slider.setAttribute('data-fc-bound', '1');
        slider.min = '1';
        slider.max = String(maxUser);
        slider.addEventListener('input', () => {
          if (isFreeComp()) return;
          setTickets(panel, slider.value);
        }, { passive: true });
      }

      const update = () => {
        applyDefaultOnce();

        if (isFreeComp()){
          setFreeModeUI(panel, wrap);
          if (tvEl) tvEl.textContent = '1';
          if (slider) slider.value = '1';
          return;
        }

        setPaidModeUI(panel, wrap);

        const price = getTicketPrice();
        const t = clamp(getTickets(panel), 1, maxUser);
        const total = t * price;

        if (subEl) subEl.innerHTML = `${t} ticket${t===1?'':'s'} × <span class="amt">${formatGBP(price)}</span>`;
        if (tvEl) tvEl.textContent = String(t);
        if (totalEl) totalEl.textContent = formatGBP(total);
        if (stickyAmt) stickyAmt.textContent = formatGBP(total);

        const maxTotal = getMaxTicketsTotal(panel);
        if (oddsUnder){
          if (maxTotal && Number.isFinite(maxTotal) && maxTotal > 0){
            const odds = Math.max(1, Math.round(maxTotal / t));
            oddsUnder.textContent = `${odds}/1`;
          } else {
            oddsUnder.textContent = '—/1';
          }
        }

        if (slider && document.activeElement !== slider){
          slider.value = String(t);
        }

        const grid2 = panel.querySelector('.fcBundleHost .grid.grid-cols-1.sm\\:grid-cols-2.gap-3.pb-2');
        if (grid2){
          const labels = getBundleLabels(grid2);
          if (labels.length) markBestValue(labels);
        }

        syncBundleVisibility(panel, wrap);
      };

      if (!input.getAttribute('data-fc-bound')){
        input.setAttribute('data-fc-bound', '1');
        input.addEventListener('input', update, { passive: true });
        input.addEventListener('change', update, { passive: true });
      }

      if (!panel.getAttribute('data-fc-click-bound')){
        panel.setAttribute('data-fc-click-bound', '1');
        panel.addEventListener('click', () => setTimeout(update, 0), { passive: true });
      }

      update();
    }

    function enhanceMeta(){
      const headingWrap = document.querySelector('.lg\\:col-span-6.lg\\:col-start-7');
      const titleRow = headingWrap?.querySelector('.flex.justify-between.gap-x-5.flex-wrap.items-center');
      if (!headingWrap || !titleRow) return;
      if (!headingWrap.querySelector('.fcHeroLine')){
        const line = document.createElement('div');
        line.className = 'fcHeroLine';
        titleRow.insertAdjacentElement('afterend', line);
      }
    }

    let queued = false;
    let settleTimer = null;

    function queueEnhance(){
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        ensurePageClass();
        if (!document.documentElement.classList.contains(CFG.pageClass)) return;
        enhanceMeta();
        enhanceHeroInfo();
      enhancePanel();
      enhanceSectionHeadings();
      });
    }

    queueEnhance();

    const mo = new MutationObserver(() => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(queueEnhance, 80);
    });

    mo.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('popstate', () => setTimeout(queueEnhance, 100));
    window.addEventListener('pageshow', queueEnhance);
  })();
})();

/* v11 safe heading patch */
(() => {
  const FLAG = 'data-fc-v11-headings';
  const isCompetitionPage = () => /\/competition\//i.test(location.pathname);

  function textOf(el){ return (el?.textContent || '').replace(/\s+/g,' ').trim(); }

  function markMajorHeadings(root=document){
    if (!isCompetitionPage()) return;
    const nodes = root.querySelectorAll('h1,h2,h3,h4,p,div');
    nodes.forEach((el) => {
      const txt = textOf(el);
      if (!txt) return;
      if (/^instant wins$/i.test(txt)) {
        el.classList.add('fcMajorSectionTitle');
      }
      if (/^more information$/i.test(txt) || /^more details$/i.test(txt)) {
        el.classList.add('fcMajorSectionTitle','fcMoreDetailsTitle');
        if (txt !== 'MORE DETAILS') el.textContent = 'MORE DETAILS';
      }
    });

    const moreBox = [...root.querySelectorAll('.wysiwyg, .competition-content, [class*="more"], [class*="information"]')]
      .find(el => /what'?s up for grabs|we'?re going live|site credit/i.test(textOf(el)));
    if (moreBox) moreBox.classList.add('fcMoreDetailsBody');
  }

  function init(){
    if (document.documentElement.hasAttribute(FLAG)) return;
    document.documentElement.setAttribute(FLAG,'true');
    markMajorHeadings(document);
    const mo = new MutationObserver(() => markMajorHeadings(document));
    mo.observe(document.body, {subtree:true, childList:true, characterData:true});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();
