/* =========================================================
   ⚡ FlashCompetitions — FAST Checkout + Slider v13 (JS)
   - Livewire-safe, idempotent
   - Adds .fc-comp-page on /competition/
   - Sticky bar v13 id
   - Default tickets ~£1 (one-time) on paid comps
   ========================================================= */

(() => {
  const CFG = {
    pageMatch: /\/competition\//i,
    pageClass: "fc-comp-page",
    panelFlag: "data-fc-fast-v13",
    bundleFlag: "data-fc-bundle-ui-v13",
    stickyId: "fcStickyBuyFastV13",
    defaultCheckoutGBP: 1.00,
    defaultFlag: "data-fc-default-applied-v13",
  };

  const prefersReduced = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
  const txt = (el) => clean(el?.textContent || "");

  function ensurePageClass(){
    if (CFG.pageMatch.test(location.pathname)) document.documentElement.classList.add(CFG.pageClass);
    else document.documentElement.classList.remove(CFG.pageClass);
  }

  function parseTicketPrice(raw){
    const s = clean(raw).toLowerCase();
    if (!s) return null;
    if (s.includes("free")) return 0;

    const pound = s.match(/£\s*([0-9]+(?:\.[0-9]{1,2})?)/);
    if (pound) return Number(pound[1]);

    const pence = s.match(/(^|[^0-9])([0-9]+(?:\.[0-9]+)?)\s*p\b/);
    if (pence) return Number(pence[2]) / 100;

    const any = s.match(/([0-9]+(?:\.[0-9]{1,2})?)/);
    return any ? Number(any[1]) : null;
  }

  function formatGBP(n){
    const v = Number.isFinite(n) ? n : 0;
    return "£" + v.toFixed(2);
  }

  function getTicketPrice(){
    const priceP = document.querySelector(".flex.justify-between.gap-x-5.flex-wrap.items-center p.text-3xl");
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
    return document.querySelector(".lg\\:col-span-6 .bg-gray-800.p-5.mt-5.rounded-lg.border-2.border-gray-700");
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

  // FREE -> force 1. Paid -> min 1.
  function setTickets(panel, next){
    const input = getTicketInput(panel);
    if (!input) return;

    const maxUser = Number(input.getAttribute("max")) || 1000;

    if (isFreeComp()){
      if (String(input.value) === "1") return;
      input.value = "1";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }

    const safe = clamp(next, 1, maxUser);
    if (String(input.value) === String(safe)) return;

    input.value = String(safe);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function getMaxTicketsTotal(panel){
    const progressRow = panel.querySelector(".bg-gray-700.p-2.w-full.grid.grid-cols-12.rounded-xl");
    const progressText = panel.querySelector("#obsidian-progress");

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

    const oldOdds = panel.querySelector("span.min-w-52.text-sm.text-center.font-bold.bg-primary-500");
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

    bar = document.createElement("div");
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
    const m = t.match(/buy\s+(\d+)\s+get\s+(\d+)\s+free/i);
    if (!m) return null;
    const buy = Number(m[1]);
    const free = Number(m[2]);
    return { buy, free, total: buy + free, ratio: buy ? (free / buy) : 0 };
  }

  function ensureBundleHost(panel, wrap){
    let host = wrap.querySelector(".fcBundleHost");
    if (host) return host;

    host = document.createElement("div");
    host.className = "fcBundleHost";
    host.innerHTML = `
      <div class="fcBundleHostTitle">
        <div class="t">Bundles</div>
        <div class="h">Tap a deal to apply</div>
      </div>
      <div class="fcBundleSlot"></div>
    `;

    const sliderWrap = wrap.querySelector(".fcSliderWrap");
    if (sliderWrap) wrap.insertBefore(host, sliderWrap);
    else wrap.appendChild(host);

    return host;
  }

  function moveBundlesIntoHost(panel, wrap){
    const grid = panel.querySelector(".grid.grid-cols-1.sm\\:grid-cols-2.gap-3.pb-2");
    if (!grid) return null;

    const host = ensureBundleHost(panel, wrap);
    const slot = host.querySelector(".fcBundleSlot");
    if (!slot) return null;

    if (!slot.contains(grid)) slot.appendChild(grid);
    return grid;
  }

  function markBestValue(labels){
    labels.forEach(l => l.classList.remove("fcBestValue"));
    if (!labels.length) return;

    const parsed = labels.map(label => {
      const span = [...label.querySelectorAll("span")].find(s => !s.classList.contains("sr-only"));
      const info = parseBundle(span?.textContent || "");
      return { label, info };
    }).filter(x => x.info);

    if (!parsed.length) return;

    parsed.sort((a,b) => (b.info.ratio - a.info.ratio) || (b.info.total - a.info.total) || (b.info.free - a.info.free));
    parsed[0].label.classList.add("fcBestValue");
  }

  function enhanceBundles(grid){
    const labels = [...grid.querySelectorAll("label")];
    if (!labels.length) return;

    markBestValue(labels);

    labels.forEach(label => {
      const span = [...label.querySelectorAll("span")].find(s => !s.classList.contains("sr-only"));
      const info = parseBundle(span?.textContent || "");
      if (!info) return;

      if (label.getAttribute(CFG.bundleFlag) === "1") return;
      label.setAttribute(CFG.bundleFlag, "1");

      const ui = document.createElement("div");
      ui.className = "fcBundleUI";
      ui.innerHTML = `
        <div class="fcBundleRow">
          <div class="fcBundleBuy">
            <span class="w">Buy</span>
            <span class="n">${info.buy}</span>
          </div>
          <div class="fcBundleFree">
            <span>+ </span><strong>${info.free}</strong><span> Free</span>
          </div>
        </div>
        <div class="fcBundleGet">
          <span class="tickets">You get <b>${info.total}</b> tickets</span>
        </div>
      `;

      if (span) label.insertBefore(ui, span);
      else label.insertBefore(ui, label.firstChild);
    });
  }

  function ensureOddsUnderTotal(wrap){
    const total = wrap.querySelector(".fcTotalCenter");
    if (!total) return null;

    let pill = total.querySelector(".fcOddsUnderTotal");
    if (!pill){
      pill = document.createElement("div");
      pill.className = "fcOddsUnderTotal";
      pill.innerHTML = `
        <span class="dot" aria-hidden="true"></span>
        <span class="label">Odds</span>
        <span class="odds" data-fc-odds-under>—/1</span>
      `;
      total.appendChild(pill);
    }
    return pill.querySelector("[data-fc-odds-under]");
  }

  function ensureFreePill(wrap){
    const total = wrap.querySelector(".fcTotalCenter");
    if (!total) return null;

    let pill = total.querySelector(".fcFreePill");
    if (!pill){
      pill = document.createElement("div");
      pill.className = "fcFreePill";
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

    const kicker = wrap.querySelector(".fcFastKicker");
    if (kicker) kicker.textContent = "Free entry. Good luck.";

    const subEl = wrap.querySelector("[data-fc-sub]");
    if (subEl) subEl.innerHTML = `1 ticket × <span class="amt">Free</span>`;

    const sliderWrap = wrap.querySelector(".fcSliderWrap");
    const chips = wrap.querySelector("[data-fc-chips]");
    const oddsPill = wrap.querySelector(".fcOddsUnderTotal");
    const bundleHost = wrap.querySelector(".fcBundleHost");

    if (sliderWrap) sliderWrap.style.display = "none";
    if (chips) chips.style.display = "none";
    if (oddsPill) oddsPill.style.display = "none";
    if (bundleHost) bundleHost.style.display = "none";

    const freePill = ensureFreePill(wrap);
    if (freePill) freePill.style.display = "inline-flex";

    const totalEl = wrap.querySelector("[data-fc-total]");
    if (totalEl) totalEl.textContent = "";

    const sticky = document.getElementById(CFG.stickyId);
    if (sticky) sticky.style.display = "none";
  }

  function setPaidModeUI(wrap){
    const sliderWrap = wrap.querySelector(".fcSliderWrap");
    const chips = wrap.querySelector("[data-fc-chips]");
    const oddsPill = wrap.querySelector(".fcOddsUnderTotal");
    const bundleHost = wrap.querySelector(".fcBundleHost");
    const freePill = wrap.querySelector(".fcFreePill");

    if (sliderWrap) sliderWrap.style.display = "";
    if (chips) chips.style.display = "";
    if (oddsPill) oddsPill.style.display = "";
    if (bundleHost) bundleHost.style.display = "";
    if (freePill) freePill.style.display = "none";

    const kicker = wrap.querySelector(".fcFastKicker");
    if (kicker) kicker.textContent = "Enter now. Win in a flash";

    const sticky = document.getElementById(CFG.stickyId);
    if (sticky) sticky.style.display = "";
  }

  function enhancePanel(){
    const panel = findTicketPanel();
    if (!panel) return;

    const input = getTicketInput(panel);
    const submit = getSubmit(panel);
    if (!input || !submit) return;

    let wrap = panel.querySelector(".fcFastWrap");
    if (!wrap){
      const maxUser = Number(input.getAttribute("max")) || 1000;
      const toggleRow = panel.querySelector(".flex.justify-center.mb-4.rounded-md.shadow-sm");

      wrap = document.createElement("div");
      wrap.className = "fcFastWrap";
      wrap.innerHTML = `
        <div class="fcFastTop">
          <div class="fcFastKicker">Enter now. Win in a flash</div>
          <div class="fcFastSub"><span data-fc-sub></span></div>
        </div>

        <div class="fcSliderWrap">
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

      if (toggleRow) toggleRow.insertAdjacentElement("afterend", wrap);
      else panel.insertBefore(wrap, panel.firstChild);
    }

    const grid = moveBundlesIntoHost(panel, wrap);
    if (grid) enhanceBundles(grid);

    ensureOddsUnderTotal(wrap);
    ensureFreePill(wrap);

    if (panel.getAttribute(CFG.panelFlag) === "1") return;
    panel.setAttribute(CFG.panelFlag, "1");

    const maxUser = Number(input.getAttribute("max")) || 1000;
    const subEl = wrap.querySelector("[data-fc-sub]");
    const totalEl = wrap.querySelector("[data-fc-total]");
    const tvEl = wrap.querySelector("[data-fc-tv]");
    const slider = wrap.querySelector("input.fcTicketSlider");
    const oddsUnder = wrap.querySelector("[data-fc-odds-under]");

    const applyDefaultOnce = () => {
      if (panel.getAttribute(CFG.defaultFlag) === "1") return;
      panel.setAttribute(CFG.defaultFlag, "1");

      if (isFreeComp()){
        setTickets(panel, 1);
        if (slider){
          slider.min = "1"; slider.max = "1"; slider.value = "1";
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

    const chips = wrap.querySelector("[data-fc-chips]");
    if (chips && !chips.getAttribute("data-built")){
      chips.setAttribute("data-built","1");
      const defs = [
        { label:"+5", add:5 },
        { label:"+10", add:10 },
        { label:"+25", add:25 },
        { label:"+50", add:50 },
        { label:"+100", add:100 },
        { label:"Max", max:true },
      ];
      defs.forEach(d => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "fcFastChip";
        b.textContent = d.label;
        b.addEventListener("click", () => {
          if (isFreeComp()){ setTickets(panel, 1); return; }
          const cur = getTickets(panel);
          const next = d.max ? maxUser : (cur + d.add);
          setTickets(panel, next);
        });
        chips.appendChild(b);
      });
    }

    const sticky = buildSticky();
    const stickyAmt = sticky?.querySelector(".amt");
    const stickyBtn = sticky?.querySelector("button");
    if (stickyBtn){
      stickyBtn.addEventListener("click", () => {
        if (isFreeComp()){ setTickets(panel, 1); }
        try { panel.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "center" }); } catch(e){}
        setTimeout(() => submit.click(), prefersReduced() ? 0 : 200);
      });
    }

    if (slider){
      slider.min = "1";
      slider.max = String(maxUser);

      slider.addEventListener("input", () => {
        if (isFreeComp()) return;
        setTickets(panel, slider.value);
      }, { passive:true });
    }

    const update = () => {
      applyDefaultOnce();

      if (isFreeComp()){
        setFreeModeUI(panel, wrap);
        if (tvEl) tvEl.textContent = "1";
        if (slider) slider.value = "1";
        return;
      }

      setPaidModeUI(wrap);

      const price = getTicketPrice();
      const t = clamp(getTickets(panel), 1, maxUser);
      const total = t * price;

      if (subEl) subEl.innerHTML = `${t} ticket${t===1?"":"s"} × <span class="amt">${formatGBP(price)}</span>`;
      if (tvEl) tvEl.textContent = String(t);
      if (totalEl) totalEl.textContent = formatGBP(total);
      if (stickyAmt) stickyAmt.textContent = formatGBP(total);

      const maxTotal = getMaxTicketsTotal(panel);
      if (oddsUnder){
        if (maxTotal && Number.isFinite(maxTotal) && maxTotal > 0){
          const odds = Math.max(1, Math.round(maxTotal / t));
          oddsUnder.textContent = `${odds}/1`;
        } else {
          oddsUnder.textContent = `—/1`;
        }
      }

      if (slider && document.activeElement !== slider){
        slider.value = String(t);
      }

      const grid2 = panel.querySelector(".fcBundleHost .grid.grid-cols-1.sm\\:grid-cols-2.gap-3.pb-2");
      if (grid2) {
        const labels = [...grid2.querySelectorAll("label")];
        if (labels.length) markBestValue(labels);
      }
    };

    input.addEventListener("input", update, { passive:true });
    input.addEventListener("change", update, { passive:true });
    panel.addEventListener("click", () => setTimeout(update, 0), { passive:true });

    update();
  }

  function init(){
    ensurePageClass();
    if (!document.documentElement.classList.contains(CFG.pageClass)) return;
    enhancePanel();
  }

  init();

  const mo = new MutationObserver(() => {
    clearTimeout(init._t);
    init._t = setTimeout(init, 60);
  });
  mo.observe(document.documentElement, { childList:true, subtree:true });

  window.addEventListener("popstate", () => setTimeout(init, 80));

})();

(function(){
  function enhance(){
    // Find any grid wrapper that contains your list cards (data-fc-card-meta)
    var grids = document.querySelectorAll('div.grid.grid-cols-2');
    grids.forEach(function(g){
      if (g.classList.contains('fcListsGrid')) return;
      if (g.querySelector('[data-fc-card-meta]')) g.classList.add('fcListsGrid');
    });
  }

  enhance();

  // Lightweight re-run for dynamic loads (Rafflex/Livewire)
  var t;
  var mo = new MutationObserver(function(){
    clearTimeout(t);
    t = setTimeout(enhance, 60);
  });
  mo.observe(document.documentElement, {subtree:true, childList:true});
})();

/* Scope class only. No DOM edits. */
(function(){
  function apply(){
    if(location.pathname.indexOf('/competition/') === -1) return;
    var root = document.querySelector('.pb-16.pt-3.sm\\:pt-6.sm\\:pb-20');
    if(!root) return;
    root.classList.add('fcCompTopProV2');
  }
  apply();
  var mo = new MutationObserver(apply);
  mo.observe(document.documentElement, {subtree:true, childList:true});
  setTimeout(function(){ mo.disconnect(); }, 6000);
})();

(function(){
  // Prevent double init across live navigation
  if (window.__fcFooterV6) return;
  window.__fcFooterV6 = true;

  /* =========================================================
     ✅ EASY CUSTOMIZATION (edit only this block)
  ========================================================= */
  var CFG = {
    header: {
      brand: "FLASH COMPETITIONS",
      kicker: "Quick links & support"
    },
    sections: [
      {
        title: "Page Links",
        links: [
          { label: "Acceptable Use Policy", url: "https://flashcompetitions.com/i/acceptable-use-policy" },
          { label: "Flash Affiliates",       url: "https://flashcompetitions.com/i/affiliate" },
          { label: "How it Works",           url: "https://flashcompetitions.com/i/how-it-works" },
          { label: "Responsible Play",       url: "https://flashcompetitions.com/i/responsible-play" }
        ]
      },
      {
        title: "Support",
        links: [
          { label: "About",                 url: "https://flashcompetitions.com/about" },
          { label: "Contact",               url: "https://flashcompetitions.com/contact" },
          { label: "Privacy Policy",         url: "https://flashcompetitions.com/privacy" },
          { label: "Terms & Conditions",     url: "https://flashcompetitions.com/terms" }
        ]
      }
    ],
    socials: [
      { label:"Instagram", url:"https://www.instagram.com/flashcompetitions" },
      { label:"Facebook",  url:"https://www.facebook.com/flashcompetitions" },
      { label:"TikTok",    url:"https://www.tiktok.com/@flashcompetitions" },
      // { label:"X",       url:"https://x.com/yourhandle" },
    ]
  };

  function qs(sel, root){ return (root||document).querySelector(sel); }
  function el(tag, cls){ var n=document.createElement(tag); if(cls) n.className=cls; return n; }

  // Simple inline SVGs
  var ICONS = {
    Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9A3.5 3.5 0 0 0 20 16.5v-9A3.5 3.5 0 0 0 16.5 4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.8-2.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg>',
    Facebook:  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7.5v3H10v8h3.5Z"/></svg>',
    TikTok:    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 3c.6 2.8 2.7 4.8 5 5v3c-1.8 0-3.4-.6-5-1.7v6.7c0 3.9-3.2 7-7 7s-7-3.1-7-7 3.2-7 7-7c.4 0 .8 0 1.2.1v3.3c-.4-.2-.8-.3-1.2-.3-2.1 0-3.8 1.7-3.8 3.8S7.9 19.7 10 19.7s3.8-1.6 3.8-3.9V3h2.2Z"/></svg>',
    X:        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.7 2H22l-7.2 8.2L23 22h-6.5l-5.1-6.7L5.6 22H2.3l7.8-8.9L1 2h6.7l4.6 6.1L18.7 2Zm-1.1 18h1.8L6.7 3.9H4.8L17.6 20Z"/></svg>'
  };

  function build(){
    var wrap = qs('div.mx-auto.max-w-7xl.px-6.pb-8.pt-20');
    if(!wrap) return false;

    // find links grid
    var linksGrid = qs('.grid.grid-cols-2.gap-8', wrap);
    if(!linksGrid) return false;

    // Build header (once)
    if(!qs('.fcFooterHdr', wrap)){
      var hdr = el('div','fcFooterHdr');
      hdr.innerHTML =
        '<div class="fcFooterBrand"></div>' +
        '<div class="fcFooterKicker"></div>';
      hdr.querySelector('.fcFooterBrand').textContent  = (CFG.header && CFG.header.brand)  ? CFG.header.brand  : '';
      hdr.querySelector('.fcFooterKicker').textContent = (CFG.header && CFG.header.kicker) ? CFG.header.kicker : '';
      wrap.insertBefore(hdr, linksGrid);
    }

    // Rebuild the two sections from CFG (easy editing)
    if(CFG.sections && CFG.sections.length){
      var cols = linksGrid.children;
      // ensure exactly 2 columns exist
      while(linksGrid.children.length < 2) linksGrid.appendChild(el('div'));
      while(linksGrid.children.length > 2) linksGrid.removeChild(linksGrid.lastElementChild);

      for(var i=0;i<2;i++){
        var col = linksGrid.children[i];
        col.innerHTML = '';

        var sec = CFG.sections[i] || { title:'', links:[] };
        var h = el('h3');
        h.textContent = sec.title || '';
        col.appendChild(h);

        var ul = el('ul');
        ul.setAttribute('role','list');

        (sec.links || []).forEach(function(l){
          if(!l || !l.url) return;
          var li = el('li');
          var a  = el('a');
          a.href = l.url;
          a.textContent = l.label || l.url;
          li.appendChild(a);
          ul.appendChild(li);
        });

        col.appendChild(ul);
      }
    }

    // Social row (once)
    if(!qs('.fcFooterSocial', wrap)){
      var row = el('div','fcFooterSocial');
      row.setAttribute('aria-label','Social links');

      (CFG.socials || []).forEach(function(s){
        if(!s || !s.url) return;
        var a = el('a');
        a.href = s.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', s.label || 'Social');

        var key = (s.label || '').trim();
        a.innerHTML = ICONS[key] || ICONS.Instagram;

        row.appendChild(a);
      });

      linksGrid.insertAdjacentElement('afterend', row);
    }

    // Keep Powered by Rafflex untouched — we only center it via CSS (already done)
    return true;
  }

  // Try now + retries for dynamic loads
  var tries = 0;
  var iv = setInterval(function(){
    tries++;
    if(build() || tries > 25) clearInterval(iv);
  }, 300);

  // Livewire-ish navigation safety
  var mo = new MutationObserver(function(){ build(); });
  mo.observe(document.documentElement, { childList:true, subtree:true });
})();

(function(){
  // one global guard (still safe with Livewire rerenders)
  if(window.__fcListsV4) return;
  window.__fcListsV4 = true;

  /* =========================================================
     EASY CUSTOMIZATION (edit text only)
  ========================================================= */
  var CFG = {
    kicker: "TRANSPARENCY",
    title:  "Live Ticket Lists",
    sub:    "Realtime entry lists so everyone can verify their tickets and stay in the loop."
  };

  function normPath(p){ return (p || '').replace(/\/+$/,''); }
  function $(sel, root){ return (root||document).querySelector(sel); }
  function $all(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }

  function isListsPage(){
    return normPath(location.pathname) === '/lists';
  }

  function removeOldInjected(root){
    // hard remove any older injected nodes that might look “weird”
    $all('.fcCardCorner,.fcListSignal,.fcTLSectionHdr,.fcListsHeaderWrap', root).forEach(function(n){ n.remove(); });
  }

  function buildHero(root){
    var grid = $('.grid.grid-cols-2.my-10', root);
    if(!grid) return;

    // If hero already exists (ours), keep
    if($('.fcListsHero', root)) return;

    var hero = document.createElement('div');
    hero.className = 'fcListsHero';
    hero.innerHTML =
      '<div class="fcListsHeroFrame">' +
        '<div class="fcListsKicker"></div>' +
        '<h2 class="fcListsTitle"></h2>' +
        '<div class="fcListsSub"></div>' +
        '<div class="fcListsDivider" aria-hidden="true"></div>' +
      '</div>';

    hero.querySelector('.fcListsKicker').textContent = CFG.kicker || '';
    hero.querySelector('.fcListsTitle').textContent  = CFG.title  || '';
    hero.querySelector('.fcListsSub').textContent    = CFG.sub    || '';

    // Insert hero DIRECTLY above the grid so it always shows
    grid.parentNode.insertBefore(hero, grid);
  }

  function rebuildMeta(card){
    var meta = $('.fcLists-meta', card);
    if(!meta) return;
    if(meta.getAttribute('data-fc-spec') === '1') return;

    var spans = $all('.fcLists-pill', meta);
    if(!spans.length) return;

    var items = [];
    spans.forEach(function(s){
      var txt = (s.textContent || '').replace(/\s+/g,' ').trim();
      var m = txt.match(/^(Price|Ends)\s+(.+)$/i);
      if(m) items.push({ key: m[1], val: m[2] });
    });

    // Build spec row
    var specWrap = document.createElement('div');
    specWrap.className = 'fcSpecs';

    items.forEach(function(it){
      var key = (it.key || '').toLowerCase();
      var isPrice = key === 'price';
      var isFree  = isPrice && String(it.val||'').toLowerCase().indexOf('free') !== -1;

      var el = document.createElement('span');
      el.className = 'fcSpec' + (isPrice ? ' fcSpec--price' : '') + (isFree ? ' fcSpec--free' : '');
      el.innerHTML =
        '<span class="fcSpecKey"></span>' +
        '<span class="fcSpecVal"></span>';

      el.querySelector('.fcSpecKey').textContent = (it.key || '').toUpperCase();
      el.querySelector('.fcSpecVal').textContent = it.val || '';

      specWrap.appendChild(el);
    });

    meta.appendChild(specWrap);
    meta.setAttribute('data-fc-spec','1');
  }

  function apply(){
    if(!isListsPage()) return;

    var root = document.querySelector('[wire\\:id][wire\\:snapshot][data-fc-lists-init]');
    if(!root) return;

    if(!root.classList.contains('fcListsV4')) root.classList.add('fcListsV4');

    removeOldInjected(root);
    buildHero(root);

    var grid = $('.grid.grid-cols-2.my-10', root);
    if(!grid) return;

    $all('[data-fc-card-meta]', grid).forEach(function(card){
      // ensure old weird elements are removed if nested
      $all('.fcCardCorner,.fcListSignal', card).forEach(function(n){ n.remove(); });
      rebuildMeta(card);
    });
  }

  apply();

  // Livewire-safe reruns
  var t;
  var mo = new MutationObserver(function(){
    clearTimeout(t);
    t = setTimeout(apply, 60);
  });
  mo.observe(document.documentElement, {subtree:true, childList:true});
})();

(function(){
  function norm(p){ return (p||'').replace(/\/+$/,''); }
  function isEntryList(){
    var p = norm(location.pathname);
    return (p.indexOf('/lists/') === 0 && p !== '/lists');
  }
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function txt(n){ return n ? (n.textContent||'').replace(/\s+/g,' ').trim() : ''; }

  function enforceCols(table){
    // Hide by header label (robust) but keep Ticket #, Customer, Admin
    var ths = qsa('thead th', table);
    if(!ths.length) return;

    var keep = { 'ticket #': true, 'customer': true, 'admin': true };

    ths.forEach(function(th, idx){
      var label = txt(th).toLowerCase();
      var col = idx + 1;
      var shouldKeep = !!keep[label];

      qsa('thead th:nth-child('+col+')', table).forEach(function(x){
        x.style.display = shouldKeep ? '' : 'none';
      });
      qsa('tbody td:nth-child('+col+')', table).forEach(function(x){
        x.style.display = shouldKeep ? '' : 'none';
      });
    });

    // Fix empty state colspan
    var emptyTd = qs('tbody td[colspan]', table);
    if(emptyTd) emptyTd.setAttribute('colspan','3');
  }

  function apply(){
    if(!isEntryList()) return;

    var search = document.querySelector('input[placeholder="Search ticket number"]');
    if(!search) return;

    // Base host container from your markup
    var host = search.closest('.px-3.mx-auto.py-5.lg\\:py-10.max-w-7xl.sm\\:px-6.lg\\:px-8');
    if(!host) return;

    // Mark host + wrap into width controller once (non-destructive)
    host.classList.add('fcELv10');

    if(!host.querySelector(':scope > .fcEL10-wide')){
      var wide = document.createElement('div');
      wide.className = 'fcEL10-wide';
      while(host.firstChild) wide.appendChild(host.firstChild);
      host.appendChild(wide);
    }
    var wideHost = host.querySelector(':scope > .fcEL10-wide');
    if(!wideHost) return;

    // Find live nodes
    var header = wideHost.querySelector('.mx-auto.max-w-2xl.text-center');
    var productCard = wideHost.querySelector('[data-flux-card].mb-6');
    var controls = search.closest('.flex.flex-col.sm\\:flex-row.gap-3.mb-4');
    var tableWrap = wideHost.querySelector('.relative.overflow-x-auto.rounded-lg.border.border-gray-700.bg-gray-950');
    var pager = wideHost.querySelector('.pt-4.flex.flex-col.sm\\:flex-row.justify-between.items-start');

    if(!productCard || !controls || !tableWrap) return;

    // If shell exists but nodes got swapped by Livewire, rebuild
    var existing = wideHost.querySelector(':scope > .fcEL10-shell');
    if(existing){
      if(!existing.contains(productCard) || !existing.contains(controls) || !existing.contains(tableWrap)){
        existing.remove();
      }else{
        var tbl1 = tableWrap.querySelector('table');
        if(tbl1) enforceCols(tbl1);
        return;
      }
    }

    // Build shell
    var shell = document.createElement('div');
    shell.className = 'fcEL10-shell';

    var h1 = header ? header.querySelector('h1') : null;
    var p  = header ? header.querySelector('p.mt-2') : null;

    var hero = document.createElement('section');
    hero.className = 'fcEL10-hero';
    hero.innerHTML =
      '<div class="fcEL10-kicker"><span class="dot" aria-hidden="true"></span>LIVE TICKET LIST</div>' +
      '<div class="fcEL10-title"></div>' +
      '<div class="fcEL10-sub"></div>';
    hero.querySelector('.fcEL10-title').textContent = txt(h1) || 'Ticket List';
    hero.querySelector('.fcEL10-sub').textContent   = txt(p)  || 'Ticket #, Customer';

    var left = document.createElement('section');
    left.className = 'fcEL10-left';
    left.innerHTML =
      '<div class="fcEL10-leftTop">' +
        '<div class="fcEL10-secK">COMPETITION</div>' +
        '<div class="fcEL10-secT">Overview</div>' +
      '</div>' +
      '<div class="fcEL10-leftBody"></div>';

    var right = document.createElement('section');
    right.className = 'fcEL10-right';
    right.innerHTML =
      '<div class="fcEL10-rightTop">' +
        '<div class="fcEL10-secK">TICKETS</div>' +
        '<div class="fcEL10-secT">Search & verify</div>' +
      '</div>' +
      '<div class="fcEL10-rightBody"></div>';

    shell.appendChild(hero);
    shell.appendChild(left);
    shell.appendChild(right);

    wideHost.insertBefore(shell, wideHost.firstChild);

    // Re-parent nodes (same nodes, no logic changes)
    qs('.fcEL10-leftBody', left).appendChild(productCard);

    var rb = qs('.fcEL10-rightBody', right);
    rb.appendChild(controls);
    rb.appendChild(tableWrap);
    if(pager) rb.appendChild(pager);

    // Force only Ticket # / Customer / Admin visible
    var tbl = tableWrap.querySelector('table');
    if(tbl) enforceCols(tbl);

    // Make empty message nicer once
    var empty = wideHost.querySelector('tbody td.text-center.text-gray-400');
    if(empty && !empty.getAttribute('data-fc-el10-empty')){
      var current = txt(empty);
      if(/no tickets yet/i.test(current)){
        empty.textContent = 'No tickets yet';
      }
      empty.setAttribute('data-fc-el10-empty','1');
    }
  }

  apply();

  var t;
  var mo = new MutationObserver(function(){
    clearTimeout(t);
    t = setTimeout(apply, 120);
  });
  mo.observe(document.documentElement, {subtree:true, childList:true});
})();

