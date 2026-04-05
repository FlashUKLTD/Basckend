

/* ===== FILE: scripts.js ===== */

/* =========================================================
   ⚡ FLASH COMPETITIONS — SCRIPTS.JS (DROP-IN REPLACEMENT)
   =========================================================
   ✅ EDIT ONLY the CUSTOMISATION section
   ✅ Keeps ALL original functionality, adds:
      - Desktop navbar reorder + rename
      - Mobile sidebar nav rebuild + custom order + icons
      - Prevent socials injecting into mobile
   ========================================================= */


/* =========================================================
   🔧 EASY CUSTOMISATION — EDIT HERE ONLY
   ========================================================= */
window.FLASH_CUSTOM = window.FLASH_CUSTOM || {

  /* =========================
     2) LIVE BADGE (Instant Winners nav item)
     ========================= */
  liveBadge: {
    enabled: true,
    anchorSelector: "#header-instant-list",
    wrapClass: "flash-live-wrap",
    dotClass: "flash-live-dot",
    textClass: "flash-live-text",
    text: "🏆",
    retries: { max: 20, everyMs: 250 }
  },

  /* =========================
     3) HIDE ODDS WHEN "Infinity/1"
     ========================= */
  hideOddsInfinity: {
    enabled: true,
    styleId: "js-injection-hide-style",
    hideClass: "js-hide",
    bestSelector: 'span[x-text="calculateOdds()"]',
    fallbackStartsWith: "Odds ",
    retriesMs: [0, 50, 250, 1000],
    observe: true,
    pollEveryMs: 300
  },

  /* =========================
     4) HIDE "Tickets Total" ROW WHEN £0.00
     ========================= */
  hideTicketTotalZero: {
    enabled: true,
    styleId: "js-injection-hide-ticket-total-style",
    hideClass: "js-hide-ticket-total",
    bestSelector: 'p[x-text*="Tickets Total"]',
    fallbackStartsWith: "Tickets Total:",
    retriesMs: [0, 50, 250, 1000],
    observe: true,
    pollEveryMs: 300
  },

  /* =========================
     5) SOCIAL ICONS (DESKTOP HEADER ONLY)
     ========================= */
  socials: {
    enabled: true,
    facebook: "https://www.facebook.com/flashcompetitions",
    instagram: "https://www.instagram.com/flashcompetitionsuk",

    /* IMPORTANT: keep socials out of mobile sidebar */
    showOnMobile: false,

    desktopTargets: [
      "header nav",
      "header",
      "nav"
    ],

    menuTargets: [
      "nav[data-flux-navbar]",        /* best */
      "[data-flux-navbar-items]",     /* fallback */
      "ul",
      "div"
    ],

    retries: { max: 20, everyMs: 250 }
  },

  /* =========================
     6) DESKTOP NAV REORDER + RENAME
     =========================
     ✅ Moves existing DOM nodes only
     ✅ Dropdown stays functional
     ✅ Wallet is untouched
     ✅ Reorder by rearranging items array
  */
  desktopNav: {
    enabled: true,
    navSelector: 'nav[data-flux-navbar]',
    keepUnmatchedAtEnd: true,

    /* Order you want on desktop */
    items: [
      { id:"competitions", type:"link", match:{ idEquals:"categories-header" }, label:"Competitions", enabled:true },
       { id:"entry", type:"link", match:{ idEquals:"header-entry-list" }, label:"Ticket Lists", enabled:true },
      { id:"instant", type:"link", match:{ idEquals:"header-instant-list" }, label:"Winners", enabled:true },
      { id:"results", type:"link", match:{ idEquals:"header-results" }, label:"Results", enabled:false },
      { id:"about", type:"link", match:{ idEquals:"header-about" }, label:"Mission", enabled:true },
      { id:"account", type:"link", match:{ hrefIncludes:"/account/settings" }, label:"My Profile", enabled:true }
    ]
  },

     /* =========================
     6.5) DESKTOP WALLET POSITION
     =========================
     ✅ Moves the existing #wallet element
     ✅ Desktop only
     ✅ Does not recreate anything (keeps functionality)
  */
  desktopWallet: {
    enabled: true,

    /* Where the wallet currently is */
    walletSelector: '#wallet',

    /* The desktop container that holds nav + wallet */
    desktopBarSelector: '.hidden.lg\\:flex.lg\\:gap-x-8',

    /* Put wallet at the very end (far right) */
    position: 'end' // 'end' | 'start'
  },

   
  /* =========================
     7) MOBILE SIDEBAR NAV REBUILDER (CUSTOM ORDER + ICONS)
     ========================= */
  mobileNav: {
    enabled: true,

    /* Where to apply (mobile sidebar only) */
    sidebarSelector: '[data-flux-sidebar].lg\\:hidden',
    navSelector: '[data-flux-navlist]',

    showSeparators: true,
    dropdownLabel: "Competitions",
    hideOriginalNav: true,

    /* Mobile order + labels + icons */
    items: [
        /* Dropdown trigger (existing ui-dropdown) */
      {
        id: "competitions_dropdown",
        type: "link",
        match: { idEquals: "categories-header" },
        label: "Competitions",
        enabled: true,
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9a2 2 0 0 0 0 6v4h16v-4a2 2 0 0 0 0-6V5H4z"/><path d="M9 8v8"/><path d="M12 8v8"/></svg>'
      },
      {
        id: "results",
        type: "link",
        match: { idEquals: "header-results" },
        label: "Results",
        enabled: false,
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M7 3h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2z"/>' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M9 8h6M9 12h6"/>' +
          '</svg>'
      },
      {
        id: "instant",
        type: "link",
        match: { idEquals: "header-instant-list" },
        label: "Live Winners",
        enabled: true,
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h8l-1 8 11-14h-8l1-6z"/>' +
          '</svg>'
      },
      {
        id: "entrylists",
        type: "link",
        match: { idEquals: "header-entry-list" },
        label: "Ticket Lists",
        enabled: true,
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h10"/>' +
          '</svg>'
      },
      {
        id: "about",
        type: "link",
        match: { idEquals: "header-about" },
        label: "Our Impact",
        enabled: true,
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12s4.03-9 9-9 9 4.03 9 9z"/>' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6"/>' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M12 7h.01"/>' +
          '</svg>'
      },

      /* My Account in list */
      {
        id: "account",
        type: "link",
        match: { hrefIncludes: "/account/settings" },
        label: "My Profile",
        enabled: true,
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M20 21a8 8 0 0 0-16 0"/>' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"/>' +
          '</svg>'
      }
    ]
  }
};



/* =========================================================
   ✅ ORIGINAL FUNCTIONALITY (UNCHANGED BEHAVIOUR)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function() {
  try{
    const CFG = window.FLASH_CUSTOM.adminManage;
    if(!CFG || CFG.enabled === false) return;

    const button = document.querySelector(CFG.selector);

    if (button) {
      button.textContent = CFG.text;

      const s = CFG.styles || {};
      Object.keys(s).forEach((k) => { button.style[k] = s[k]; });

      const h = CFG.hover || {};
      const o = CFG.out || {};

      button.addEventListener("mouseover", () => {
        Object.keys(h).forEach((k) => { button.style[k] = h[k]; });
      });
      button.addEventListener("mouseout", () => {
        Object.keys(o).forEach((k) => { button.style[k] = o[k]; });
      });
    }
  }catch(_){}
});


(function () {
  try{
    const CFG = window.FLASH_CUSTOM.liveBadge;
    if(!CFG || CFG.enabled === false) return;

    if (window.__FLASH_LIVE_BADGE_ADDED__) return;
    window.__FLASH_LIVE_BADGE_ADDED__ = true;

    function addLiveBadgeOnce() {
      var a = document.querySelector(CFG.anchorSelector || '#header-instant-list');
      if (!a) return false;

      if (a.querySelector('.' + (CFG.wrapClass || 'flash-live-wrap'))) return true;

      var span = a.querySelector('span');
      if (!span || !span.parentElement) return false;

      var wrap = document.createElement('span');
      wrap.className = (CFG.wrapClass || 'flash-live-wrap');
      wrap.setAttribute('aria-hidden', 'true');

      var dot = document.createElement('span');
      dot.className = (CFG.dotClass || 'flash-live-dot');

      var txt = document.createElement('span');
      txt.className = (CFG.textClass || 'flash-live-text');
      txt.textContent = (CFG.text || 'LIVE');

      wrap.appendChild(dot);
      wrap.appendChild(txt);

      span.parentElement.insertBefore(wrap, span);

      return true;
    }

    if (addLiveBadgeOnce()) return;

    var tries = 0;
    var maxTries = (CFG.retries && CFG.retries.max) || 20;
    var every = (CFG.retries && CFG.retries.everyMs) || 250;

    var t = setInterval(function () {
      tries++;
      if (addLiveBadgeOnce() || tries >= maxTries) clearInterval(t);
    }, every);
  }catch(_){}
})();


(() => {
  try{
    const CFG = window.FLASH_CUSTOM.hideOddsInfinity;
    if(!CFG || CFG.enabled === false) return;

    const styleId = CFG.styleId || "js-injection-hide-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = "." + (CFG.hideClass || "js-hide") + "{display:none!important;}";
      document.head.appendChild(style);
    }

    function getOddsEl() {
      return document.querySelector(CFG.bestSelector || 'span[x-text="calculateOdds()"]')
        || Array.from(document.querySelectorAll("span")).find(s =>
          (s.textContent || "").trim().startsWith(CFG.fallbackStartsWith || "Odds ")
        );
    }

    function apply() {
      const el = getOddsEl();
      if (!el) return;

      const txt = (el.textContent || "").trim();
      const isInfinity = /(^|\b)Odds\s+Infinity\s*\/\s*1\b/i.test(txt);

      if (isInfinity) el.classList.add(CFG.hideClass || "js-hide");
      else el.classList.remove(CFG.hideClass || "js-hide");
    }

    const times = Array.isArray(CFG.retriesMs) ? CFG.retriesMs : [0,50,250,1000];
    times.forEach((ms) => setTimeout(apply, ms));

    if(CFG.observe !== false){
      new MutationObserver(apply).observe(document.documentElement, {
        subtree: true,
        childList: true,
        characterData: true
      });
    }

    if(CFG.pollEveryMs){
      setInterval(apply, CFG.pollEveryMs);
    }
  }catch(_){}
})();


(() => {
  try{
    const CFG = window.FLASH_CUSTOM.hideTicketTotalZero;
    if(!CFG || CFG.enabled === false) return;

    const styleId = CFG.styleId || "js-injection-hide-ticket-total-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = "." + (CFG.hideClass || "js-hide-ticket-total") + "{display:none!important;}";
      document.head.appendChild(style);
    }

    function getTicketTotalEl() {
      return document.querySelector(CFG.bestSelector || 'p[x-text*="Tickets Total"]')
        || Array.from(document.querySelectorAll("p")).find(p =>
          p.textContent && p.textContent.trim().startsWith(CFG.fallbackStartsWith || "Tickets Total:")
        );
    }

    function parsePounds(text) {
      const m = String(text || "").match(/£\s*([0-9]+(?:\.[0-9]{1,2})?)/);
      if (!m) return null;
      return Number(m[1]);
    }

    function apply() {
      const p = getTicketTotalEl();
      if (!p) return;

      const container = p.closest("div") || p.parentElement;
      const amount = parsePounds(p.textContent || "");

      if (amount === null) return;

      if (amount === 0) container.classList.add(CFG.hideClass || "js-hide-ticket-total");
      else container.classList.remove(CFG.hideClass || "js-hide-ticket-total");
    }

    const times = Array.isArray(CFG.retriesMs) ? CFG.retriesMs : [0,50,250,1000];
    times.forEach((ms) => setTimeout(apply, ms));

    if(CFG.observe !== false){
      new MutationObserver(apply).observe(document.documentElement, {
        subtree: true,
        childList: true,
        characterData: true
      });
    }

    if(CFG.pollEveryMs){
      setInterval(apply, CFG.pollEveryMs);
    }
  }catch(_){}
})();


/*SCRIPTS*/


/* =========================================================
   FLASH – Lists Page Enhancement
   ========================================================= */

(function(){

  function esc(s){
    return String(s||"")
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function initLists(){
    var nodes = document.querySelectorAll('[wire\\:snapshot*="tenant.page.lists"]');

    nodes.forEach(function(root){
      if(root.dataset.fcListsInit === "1") return;
      root.dataset.fcListsInit = "1";

      var container = root.querySelector('.max-w-7xl');
      if(!container) return;

      var cards = container.querySelectorAll('[data-flux-card]');
      cards.forEach(function(card){
        if(card.dataset.fcCardMeta === "1") return;
        card.dataset.fcCardMeta = "1";

        var metaGrid = card.querySelector('.grid.grid-cols-2.gap-3');
        if(!metaGrid) return;

        var priceVal = "";
        var endsVal = "";

        var blocks = metaGrid.querySelectorAll(':scope > div');
        if(blocks[0]){
          var p1 = blocks[0].querySelector('p');
          if(p1) priceVal = p1.textContent.trim();
        }
        if(blocks[1]){
          var p2 = blocks[1].querySelector('p');
          if(p2) endsVal = p2.textContent.trim();
        }

        metaGrid.className = "fcLists-meta";
        metaGrid.innerHTML =
          '<span class="fcLists-pill fcLists-pill--price"><b>Price</b> '+esc(priceVal)+'</span>' +
          '<span class="fcLists-pill fcLists-pill--ends"><b>Ends</b> '+esc(endsVal)+'</span>';
      });
    });
  }

  initLists();
  const obs = new MutationObserver(initLists);
  obs.observe(document.documentElement, { childList:true, subtree:true });

})();

/* =========================================================
   FLASH – Inject Mobile Glass Login Button
   ========================================================= */

(function(){

  const LOGIN_URL = "https://flashcompetitions.com/login";

  function injectButton(){

    const wrap = document.querySelector(
      'div.flex.flex-1.items-center.justify-end.gap-x-1.border.lg\\:ml-12.px-1.py-1.rounded-xl.border-slate-500\\/50'
    );

    if(!wrap) return;

    wrap.classList.add("fc-authwrap");

    if(wrap.querySelector(".fc-mobile-account")) return;

    const btn = document.createElement("a");
    btn.href = LOGIN_URL;
    btn.className = "fc-mobile-account";
    btn.setAttribute("aria-label","Login");

    btn.innerHTML = `
      <svg fill="none" viewBox="0 0 24 24" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M4 20a8 8 0 0116 0" />
      </svg>
      <span>Login</span>
    `;

    wrap.appendChild(btn);
  }

  injectButton();
  document.addEventListener("DOMContentLoaded", injectButton);

  const observer = new MutationObserver(injectButton);
  observer.observe(document.documentElement, { childList:true, subtree:true });

})();

(() => {
  const LOGIN_URL = "https://flashcompetitions.com/login";

  function injectSingleAccountBtn() {
    // Your wrapper div (based on the exact class list you showed)
    const wrap = document.querySelector(
      'div.flex.flex-1.items-center.justify-end.gap-x-1.border.lg\\:ml-12.px-1.py-1.rounded-xl.border-slate-500\\/50'
    );

    if (!wrap) return;

    // Mark wrapper so CSS can target only these original buttons
    if (!wrap.classList.contains("fc-authwrap")) wrap.classList.add("fc-authwrap");

    // Prevent duplicate injection
    if (wrap.querySelector(".fc-mobile-account")) return;

    const btn = document.createElement("a");
    btn.href = LOGIN_URL;
    btn.className = "fc-mobile-account";
    btn.setAttribute("aria-label", "Account (Login)");

    btn.innerHTML = `
  <svg fill="none" viewBox="0 0 24 24" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
    <path stroke-linecap="round" stroke-linejoin="round"
      d="M4 20a8 8 0 0116 0" />
  </svg>
  <span>Login</span>
`;


    wrap.appendChild(btn);
  }

  // Run now + after dynamic page loads
  injectSingleAccountBtn();
  document.addEventListener("DOMContentLoaded", injectSingleAccountBtn);

  // Lightweight observer for SPA-style swaps
  const obs = new MutationObserver(() => injectSingleAccountBtn());
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();


/* =========================================================
   🖥️ SOCIALS (DESKTOP ONLY — NEVER MOBILE SIDEBAR)
   ========================================================= */
(function () {
  try{
    const CFG = window.FLASH_CUSTOM.socials;
    if(!CFG || CFG.enabled === false) return;

    if (window.__FLASH_SOCIAL_ICONS__) return;
    window.__FLASH_SOCIAL_ICONS__ = true;

    var FACEBOOK_URL  = CFG.facebook;
    var INSTAGRAM_URL = CFG.instagram;

    function isMobile(){
      return window.matchMedia && window.matchMedia("(max-width: 1023px)").matches;
    }

    function getNavContainer(){
      if (isMobile() && CFG.showOnMobile === false) return null;

      var targets = Array.isArray(CFG.desktopTargets) ? CFG.desktopTargets : ["header nav","header","nav"];
      for(var i=0;i<targets.length;i++){
        var el = document.querySelector(targets[i]);
        if(el) return el;
      }
      return null;
    }

    function buildIcons(){
      var wrap = document.createElement("div");
      wrap.className = "flash-socialbar";

      var fb = document.createElement("a");
      fb.href = FACEBOOK_URL;
      fb.target = "_blank";
      fb.rel = "noopener";
      fb.setAttribute("aria-label", "Flash Competitions Facebook");
      fb.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M22 12.06C22 6.504 17.523 2 12 2S2 6.504 2 12.06C2 17.082 5.657 21.245 10.438 22v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.242 0-1.63.776-1.63 1.57v1.887h2.773l-.443 2.91h-2.33V22C18.343 21.245 22 17.082 22 12.06Z"></path>' +
        '</svg>';

      var ig = document.createElement("a");
      ig.href = INSTAGRAM_URL;
      ig.target = "_blank";
      ig.rel = "noopener";
      ig.setAttribute("aria-label", "Flash Competitions Instagram");
      ig.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Z"></path>' +
          '<path d="M12 7.2A4.8 4.8 0 1 1 7.2 12 4.806 4.806 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.803 2.803 0 0 0 12 9.2Z"></path>' +
          '<path d="M17.35 6.65a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"></path>' +
        '</svg>';

      wrap.appendChild(ig);
      wrap.appendChild(fb);

      return wrap;
    }

    function insertOnce(){
      if (document.querySelector(".flash-socialbar")) return true;

      var nav = getNavContainer();
      if (!nav) return false;

      var menu = null;
      var menuTargets = Array.isArray(CFG.menuTargets) ? CFG.menuTargets : ["nav[data-flux-navbar]","[data-flux-navbar-items]","ul","div"];
      for(var i=0;i<menuTargets.length;i++){
        var m = nav.querySelector(menuTargets[i]);
        if(m){ menu = m; break; }
      }
      if (!menu) return false;

      menu.parentElement.insertBefore(buildIcons(), menu);
      return true;
    }

    if (insertOnce()) return;

    var tries = 0, maxTries = (CFG.retries && CFG.retries.max) || 20;
    var every = (CFG.retries && CFG.retries.everyMs) || 250;

    var t = setInterval(function(){
      tries++;
      if (insertOnce() || tries >= maxTries) clearInterval(t);
    }, every);
  }catch(_){}
})();


/* =========================================================
   🖥️ DESKTOP WALLET MOVE (FAR RIGHT)
   ========================================================= */
(() => {
  try{
    const CFG = (window.FLASH_CUSTOM && window.FLASH_CUSTOM.desktopWallet) || {};
    if(!CFG.enabled) return;

    const MAX_TRIES = 40;
    const TRY_EVERY = 220;

    const qs = (sel, root=document) => (root || document).querySelector(sel);

    function isDesktop(){
      return window.matchMedia && window.matchMedia("(min-width: 1024px)").matches;
    }

    function apply(){
      if(!isDesktop()) return false;

      const bar = qs(CFG.desktopBarSelector || '.hidden.lg\\:flex.lg\\:gap-x-8');
      if(!bar) return false;

      const wallet = qs(CFG.walletSelector || '#wallet');
      if(!wallet) return false;

      // Already last? (no-op)
      if(CFG.position === 'end'){
        if(bar.lastElementChild === wallet) return true;
        bar.appendChild(wallet);
        return true;
      }

      // Or move to start
      if(CFG.position === 'start'){
        if(bar.firstElementChild === wallet) return true;
        bar.insertBefore(wallet, bar.firstChild);
        return true;
      }

      return false;
    }

    // Try now + retries (for dynamic loads)
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      const ok = apply();
      if(ok || tries >= MAX_TRIES) clearInterval(t);
    }, TRY_EVERY);

    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', apply, { once:true });
    }else{
      apply();
    }

    // Also re-apply if responsive breakpoint changes
    if(window.matchMedia){
      const mq = window.matchMedia("(min-width: 1024px)");
      if(mq && mq.addEventListener){
        mq.addEventListener("change", () => { apply(); });
      }
    }
  }catch(_){}
})();


/* =========================================================
   🖥️ DESKTOP NAV REORDER + RENAME (MOVES EXISTING NODES)
   ========================================================= */
(() => {
  try{
    const CFG = (window.FLASH_CUSTOM && window.FLASH_CUSTOM.desktopNav) || {};
    if(!CFG.enabled) return;

    const MAX_TRIES = 40;
    const TRY_EVERY = 220;

    const qs = (sel, root=document) => (root || document).querySelector(sel);
    const qsa = (sel, root=document) => Array.prototype.slice.call((root || document).querySelectorAll(sel) || []);

    function findNav(){
      return qs(CFG.navSelector || 'nav[data-flux-navbar]');
    }

    function matchEl(nav, match){
      if(!nav || !match) return null;

      if(match.idEquals){
        try{ return qs('#' + CSS.escape(match.idEquals), nav); }
        catch(_){ return qs('#' + match.idEquals, nav); }
      }
      if(match.hrefIncludes){
        return qsa('a[href]', nav).find(x => (x.getAttribute('href') || '').indexOf(match.hrefIncludes) !== -1) || null;
      }
      return null;
    }

    function ensure(nav){
      if(!nav) return false;
      if(nav.__fcDesktopReordered) return true;

      const items = Array.isArray(CFG.items) ? CFG.items : [];
      const children = Array.prototype.slice.call(nav.children || []);
      const used = new Set();

      const frag = document.createDocumentFragment();

      items.forEach((it) => {
        if(!it || it.enabled === false) return;
        const el = matchEl(nav, it.match);
        if(!el) return;

        const node = (it.type === 'dropdown') ? el.closest('ui-dropdown') : el.closest('a');
        if(!node || used.has(node)) return;

        used.add(node);

        // rename safely
        if(it.label){
          const txt = qs('span.text-base', node);
          if(txt) txt.textContent = it.label;
        }

        frag.appendChild(node);
      });

      if(CFG.keepUnmatchedAtEnd !== false){
        children.forEach((c) => { if(!used.has(c)) frag.appendChild(c); });
      }

      nav.appendChild(frag);
      nav.__fcDesktopReordered = true;
      return true;
    }

    function boot(){
      try{
        const nav = findNav();
        if(!nav) return false;
        return ensure(nav);
      }catch(_){
        return false;
      }
    }

    let tries = 0;
    const t = setInterval(() => {
      tries++;
      const ok = boot();
      if(ok || tries >= MAX_TRIES) clearInterval(t);
    }, TRY_EVERY);

    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', () => { boot(); }, { once:true });
    }else{
      boot();
    }
  }catch(_){}
})();



/* =========================================================
   ✅ MOBILE SIDEBAR NAV REBUILDER (CUSTOM ORDER + ICONS)
   - Uses existing elements (moves them) to keep behaviour intact
   - Does NOT touch desktop navbar
   ========================================================= */
(() => {
  try{
    const CFG = (window.FLASH_CUSTOM && window.FLASH_CUSTOM.mobileNav) || {};
    if(!CFG.enabled) return;

    const MAX_TRIES = 40;
    const TRY_EVERY = 220;

    const qs = (sel, root=document) => (root || document).querySelector(sel);
    const qsa = (sel, root=document) => Array.prototype.slice.call((root || document).querySelectorAll(sel) || []);

    function findSidebar(){
      return qs(CFG.sidebarSelector || '[data-flux-sidebar].lg\\:hidden');
    }
    function findNav(sidebar){
      return sidebar ? qs(CFG.navSelector || '[data-flux-navlist]', sidebar) : null;
    }

    function matchEl(nav, match){
      if(!nav || !match) return null;

      if(match.idEquals){
        try{ return qs('#' + CSS.escape(match.idEquals), nav); }
        catch(_){ return qs('#' + match.idEquals, nav); }
      }
      if(match.hrefIncludes){
        const a = qsa('a[href]', nav).find(x => (x.getAttribute('href') || '').indexOf(match.hrefIncludes) !== -1);
        return a || null;
      }
      return null;
    }

    function ensureInjected(sidebar, nav){
      if(!sidebar || !nav) return false;
      if(sidebar.__fcNavBuilt) return true;

      const wrap = document.createElement('div');
      wrap.className = 'fcNavX';
      wrap.setAttribute('data-fc-navx', '1');

      const items = Array.isArray(CFG.items) ? CFG.items : [];
      let first = true;

      items.forEach((it) => {
        if(!it || it.enabled === false) return;

        const el = matchEl(nav, it.match);
        if(!el) return;

        if(CFG.showSeparators && !first){
          const sep = document.createElement('div');
          sep.className = 'fcNavX-sep';
          wrap.appendChild(sep);
        }
        first = false;

        if(it.type === 'dropdown'){
          const dd = el.closest('ui-dropdown');
          if(!dd) return;

          wrap.appendChild(dd);

          const btn = qs('button', dd);
          if(btn){
            btn.classList.add('fcNavX-row');

            const ico = document.createElement('span');
            ico.className = 'fcNavX-ico';
            ico.innerHTML = it.icon || '';

            const txt = document.createElement('span');
            txt.className = 'fcNavX-txt';
            txt.textContent = it.label || CFG.dropdownLabel || 'Competitions';

            const prevI = qs('.fcNavX-ico', btn);
            const prevT = qs('.fcNavX-txt', btn);
            if(prevI) prevI.remove();
            if(prevT) prevT.remove();

            btn.insertBefore(ico, btn.firstChild);
            btn.insertBefore(txt, ico.nextSibling);

            // hide original label inside button so ours shows
            const dc = qs('[data-content] span', btn);
            if(dc) dc.style.display = 'none';
          }
          return;
        }

        const a = el.closest('a') || el;
        if(!a || a.tagName !== 'A') return;

        a.classList.add('fcNavX-row');

        const existingLabelSpan = qs('span.text-base', a);
        if(existingLabelSpan) existingLabelSpan.style.display = 'none';

        const prevI = qs('.fcNavX-ico', a);
        const prevT = qs('.fcNavX-txt', a);
        if(prevI) prevI.remove();
        if(prevT) prevT.remove();

        const ico = document.createElement('span');
        ico.className = 'fcNavX-ico';
        ico.innerHTML = it.icon || '';

        const txt = document.createElement('span');
        txt.className = 'fcNavX-txt';
        txt.textContent = it.label || (a.textContent || "").trim();

        a.insertBefore(ico, a.firstChild);
        a.insertBefore(txt, ico.nextSibling);

        wrap.appendChild(a);
      });

      nav.parentNode.insertBefore(wrap, nav);

      if(CFG.hideOriginalNav){
        nav.style.display = 'none';
      }

      sidebar.__fcNavBuilt = true;
      return true;
    }

    function boot(){
      try{
        const sidebar = findSidebar();
        const nav = findNav(sidebar);
        if(!sidebar || !nav) return false;
        return ensureInjected(sidebar, nav);
      }catch(_){
        return false;
      }
    }

    let tries = 0;
    const t = setInterval(() => {
      tries++;
      const ok = boot();
      if(ok || tries >= MAX_TRIES) clearInterval(t);
    }, TRY_EVERY);

    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', () => { boot(); }, { once:true });
    }else{
      boot();
    }
  }catch(_){}
})();










/* ===== FILE: js_compage.js ===== */

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

/* v12 heading cleanup + Orbitron */
(() => {
  if (!/\/competition\//i.test(location.pathname)) return;
  const FONT_ID = 'fc-orbitron-font-v12';
  const FLAG = 'data-fc-v12-heading-clean';

  function loadFont(){
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_ID;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800&display=swap';
    document.head.appendChild(link);
  }

  function clean(s){
    return (s || '').replace(/\s+/g,' ').trim();
  }

  function textOf(el){
    return clean(el?.textContent || '');
  }

  function patch(){
    loadFont();

    const nodes = document.querySelectorAll('h1,h2,h3,h4,p,div,span');
    nodes.forEach((el) => {
      const txt = textOf(el);
      if (!txt || el.hasAttribute(FLAG)) return;

      if (/^instant wins$/i.test(txt) || /^more information$/i.test(txt) || /^more details$/i.test(txt) || /^information$/i.test(txt)) {
        if (/^instant wins$/i.test(txt)) el.textContent = 'Instant Wins';
        else el.textContent = 'Information';

        el.classList.remove('fc-match-hero-heading','fcSectionTitleMore','fcMoreDetailsTitle');
        el.classList.add('fcMajorSectionTitle','fcV12MajorTitle');
        el.setAttribute(FLAG, 'true');

        [...el.querySelectorAll('*')].forEach((child) => {
          child.classList.remove('fc-match-hero-heading','fcSectionTitleMore','fcMoreDetailsTitle');
        });
      }
    });

    const moreBox = [...document.querySelectorAll('.wysiwyg, .competition-content, [class*="more"], [class*="information"]')]
      .find(el => /what'?s up for grabs|we'?re going live|site credit|main prize/i.test(textOf(el)));
    if (moreBox) moreBox.classList.add('fcMoreDetailsBody');
  }

  function init(){
    patch();
    const mo = new MutationObserver(() => patch());
    mo.observe(document.body, {subtree:true, childList:true, characterData:true});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else {
    init();
  }
})();


/* ===== FILE: flash-thanks-page.js ===== */


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


/* ===== FILE: flash_site_ui_fixed.js ===== */


(function(){
  if(document.getElementById("fcAdminToggle")) return;
  var FC_REDIRECT_URL = "/i/administration";

  function isAdmin(){
    return !!document.querySelector('[wire\\:snapshot*="tenant.global.admin-bar"]');
  }

  function create(){
    if(!isAdmin()) return;
    if(document.getElementById("fcAdminToggle")) return;

    var a = document.createElement("a");
    a.id = "fcAdminToggle";
    a.href = FC_REDIRECT_URL;
    a.setAttribute("aria-label", "Open Admin");

    a.innerHTML =
      '<svg class="fcAdmIcon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<path d="M12 2.25l8.25 4.5v10.5L12 21.75 3.75 17.25V6.75L12 2.25Z" stroke="rgba(255,255,255,.92)" stroke-width="1.6"/>' +
        '<path d="M7.3 11.95h9.4" stroke="rgba(255,255,255,.92)" stroke-width="1.6" stroke-linecap="round"/>' +
        '<path d="M9 8.9h6" stroke="rgba(255,255,255,.78)" stroke-width="1.6" stroke-linecap="round"/>' +
        '<path d="M9 15h6" stroke="rgba(255,255,255,.78)" stroke-width="1.6" stroke-linecap="round"/>' +
      '</svg>' +
      '<span class="fcAdmTag">Admin</span>';

    a.addEventListener("click", function(e){
      e.preventDefault();
      window.location.href = FC_REDIRECT_URL;
    });

    document.body.appendChild(a);
  }

  function boot(){
    create();

    if(window.__fcAdminLauncherV2Obs) return;
    window.__fcAdminLauncherV2Obs = true;

    var obs = new MutationObserver(function(){
      if(document.getElementById("fcAdminToggle")) return;
      create();
    });

    obs.observe(document.documentElement, { childList:true, subtree:true });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  }else{
    boot();
  }
})();

(function(){
  if(window.__FC_MINIMAL_STRIP__) return;
  window.__FC_MINIMAL_STRIP__ = true;

  var CFG = {
    rotateEvery: 7000,
    fadeMs: 200,
  messages: [
    "Secure checkout • Instant entry",
    "2% cashback on every order",
    "Live draws on main prizes",
    "Real winners • Verified draws",
    "Instant confirmation every time",
    "Fast checkout • No delays",
    "Play now • Results soon",
    "Transparent from entry to draw",
    "Premium competitions daily",
    "Entries confirmed instantly",
    "Cashback added automatically",
    "Watch draws live",
    "Limited tickets • High demand",
    "New competitions now live",
    "Enter in seconds",
    "Fair and transparent draws",
    "Secure payments always",
    "Your entries • Instantly active",
    "More chances • More winners",
    "Win real prizes today",
    "Built for speed and trust",
    "Simple entry • Big prizes",
    "Quick play • Real rewards",
    "Daily chances to win",
    "Instant wins available",
    "Play smarter with cashback",
    "New prizes added regularly",
    "Secure • Fast • Transparent",
    "Trusted competition platform",
    "Enter now • Don’t miss out",
    "Live updates • Real results",
    "Winning made simple",
    "More entries • More chances",
    "Play today • Win today",
    "Fair play guaranteed",
    "Fast entry • Instant results",
    "Your chance starts here",
    "Big prizes • Small entry",
    "Always fair • Always clear",
    "Instant access to entries"
  ]
  };

  function esc(s){
    return String(s||"").replace(/[&<>"]/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];
    });
  }

  function styleMessage(text){
    text = esc(text);
    text = text.replace("2% cashback",
      '<span class="fcMin-strong">2% cashback</span>'
    );
    return text;
  }

  function init(){
    if(document.getElementById("fcMinimalStrip")) return;

    var el = document.createElement("div");
    el.id = "fcMinimalStrip";
    el.innerHTML =
      '<div class="fcMin-inner">' +
        '<div class="fcMin-text" aria-live="polite"></div>' +
      '</div>';

    document.body.insertBefore(el, document.body.firstChild);

    var textEl = el.querySelector(".fcMin-text");
    var i = 0;

    function show(){
      el.setAttribute("data-fade","1");

      setTimeout(function(){
        textEl.innerHTML = styleMessage(CFG.messages[i]);
        el.setAttribute("data-fade","0");
      }, CFG.fadeMs);
    }

    show();

    setInterval(function(){
      i = (i + 1) % CFG.messages.length;
      show();
    }, CFG.rotateEvery);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }
})();

(function(){
  const KEY="__fcLogoAnim_v1";
  if(window[KEY]) return; window[KEY]=true;

  function apply(){
    const candidates = [
      document.querySelector('header a[href="/"]'),
      document.querySelector('header a[href="./"]'),
      document.querySelector('header a[href*="flashcompetitions"]'),
      document.querySelector('a[aria-label*="logo" i]'),
      document.querySelector('a[title*="logo" i]'),
      document.querySelector('header img[src*="logo" i]')?.closest('a'),
      document.querySelector('img[alt*="Flash" i]')?.closest('a'),
      document.querySelector('img[src*="tenant" i]')?.closest('a')
    ].filter(Boolean);

    const logoLink = candidates[0];
    if(!logoLink) return;
    if(logoLink.classList.contains('fcLogoAnim')) return;

    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    logoLink.classList.add('fcLogoAnim');
    if(reduce) logoLink.style.animation = "none";
  }

  apply();

  let tries=0;
  const iv=setInterval(()=>{ tries++; apply(); if(tries>=12) clearInterval(iv); }, 600);
})();

(() => {
  const FLAG = "data-fc-basket-v1";
  const OBS = "__fcBasketObserverV1";
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function isBasketPage() {
    return /\/basket\/?$/i.test(location.pathname);
  }

  function getRoots() {
    return $$('[wire\\:id][wire\\:snapshot]').filter((el) => {
      const snap = el.getAttribute('wire:snapshot') || '';
      return snap.includes('"name":"tenant.page.basket"');
    });
  }

  function applyBasketVibe(root) {
    if (!root || root.hasAttribute(FLAG)) return;
    root.setAttribute(FLAG, "1");
    document.body.classList.add('fc-basket-page');
  }

  function run() {
    if (!isBasketPage()) return;
    getRoots().forEach(applyBasketVibe);
  }

  run();

  let raf = null;
  const queue = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(run);
  };

  document.addEventListener("DOMContentLoaded", queue);
  document.addEventListener("livewire:load", queue);
  document.addEventListener("livewire:navigated", queue);

  if (!window[OBS]) {
    const obs = new MutationObserver(queue);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    window[OBS] = obs;
  }
})();

(() => {
  const FLAG = "data-fc-checkout-v2";
  const OBS = "__fcCheckoutV2Observer";
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

  function isCheckoutPage() {
    return /\/checkout\/?$/i.test(location.pathname);
  }

  function getRoots() {
    return $$('[wire\\:id][wire\\:snapshot]').filter((el) => {
      const snap = el.getAttribute('wire:snapshot') || '';
      return snap.includes('"name":"tenant.page.checkout"');
    });
  }

  function makeLabel(text) {
    const el = document.createElement('div');
    el.setAttribute('data-fc-checkout-label', '');
    el.textContent = text;
    return el;
  }

  function ensureLabel(container, text) {
    if (!container) return;
    if (container.querySelector(':scope > [data-fc-checkout-label]')) return;
    container.insertBefore(makeLabel(text), container.firstChild);
  }

  function ensureSummaryShell(root) {
    const basketWrap = root.querySelector('section[aria-labelledby="basket-heading"] .mx-auto.max-w-lg');
    if (!basketWrap) return null;
    if (!basketWrap.hasAttribute('data-fc-summary-shell')) {
      basketWrap.setAttribute('data-fc-summary-shell', '');
    }
    return basketWrap;
  }

  function addTotalsLabel(root) {
    const basketWrap = root.querySelector('section[aria-labelledby="basket-heading"] .mx-auto.max-w-lg');
    if (!basketWrap) return;

    const totalsStart = Array.from(basketWrap.children).find((child) => child.querySelector && child.querySelector('.flex.items-center.justify-between.pt-6'));
    if (!totalsStart) return;

    if (!basketWrap.querySelector('[data-fc-totals-block]')) {
      const block = document.createElement('div');
      block.setAttribute('data-fc-totals-block', '');
      const label = makeLabel('Totals');
      block.appendChild(label);

      const moving = [];
      let started = false;
      Array.from(basketWrap.children).forEach((child) => {
        if (child === totalsStart) started = true;
        if (started) moving.push(child);
      });

      moving.forEach((n) => block.appendChild(n));
      basketWrap.appendChild(block);
    }
  }

  function cleanupBillingDivider(root) {
    const billingDivider = root.querySelector('.mx-auto.max-w-lg.px-4.md\\:p-0');
    if (billingDivider) billingDivider.remove();
  }

  function buildCashbackInline() {
    const totalsBlock = document.querySelector('[data-fc-totals-block]');
    if (!totalsBlock) return;

    const oldCashback = document.querySelector('.mx-auto.max-w-lg.my-8 p');
    if (!oldCashback) return;

    const txt = clean(oldCashback.textContent);
    const match = txt.match(/£\s*([\d.,]+)/);
    const amount = match ? `£${match[1]}` : '';

    let row = totalsBlock.querySelector('[data-fc-cashback-inline]');
    if (!row) {
      row = document.createElement('div');
      row.setAttribute('data-fc-cashback-inline', '');
      row.innerHTML = `
        <div class="fc-cb-left">
          <div class="fc-cb-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m3-9.5c0-1.1-1.34-2-3-2s-3 .9-3 2 1.34 2 3 2 3 .9 3 2-1.34 2-3 2-3-.9-3-2"></path>
            </svg>
          </div>
          <div class="fc-cb-copy">
            <div class="fc-cb-kicker">Instant Cashback</div>
            <div class="fc-cb-text">Added to your balance after checkout</div>
          </div>
        </div>
        <div class="fc-cb-amount"></div>
      `;
      totalsBlock.appendChild(row);
    }

    const amountEl = row.querySelector('.fc-cb-amount');
    if (amountEl && amount) amountEl.textContent = amount;
  }

  function apply(root) {
    if (!root) return;
    document.body.classList.add('fc-checkout-v2');

    const basketWrap = ensureSummaryShell(root);
    const paymentWrap = root.querySelector('section[aria-labelledby="payment-heading"] .mx-auto.max-w-lg');

    if (basketWrap) ensureLabel(basketWrap, 'Order Summary');
    if (paymentWrap) ensureLabel(paymentWrap, 'Payment Details');

    addTotalsLabel(root);
    cleanupBillingDivider(root);
    buildCashbackInline();

    root.setAttribute(FLAG, '1');
  }

  function run() {
    if (!isCheckoutPage()) return;
    getRoots().forEach(apply);
  }

  run();

  let raf = null;
  const queue = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(run);
  };

  document.addEventListener('DOMContentLoaded', queue);
  document.addEventListener('livewire:load', queue);
  document.addEventListener('livewire:navigated', queue);

  if (!window[OBS]) {
    const obs = new MutationObserver(queue);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    window[OBS] = obs;
  }
})();


/* ===== FILE: touchups.js ===== */

(() => {
  const CFG = {
    navSelector: 'nav[aria-label="Global"]',
    underlineClass: 'fcNavSwiftUnderline',
    badgeClass: 'fcNavSwiftBadge',
    lineClass: 'fcNavSwiftLine',
    logoUrl: 'https://static.rafflex.io/custom-twig-images/01KN2S86PQBX7SZ13EB330S7NJ.png'
  };

  function buildUnderline(root){
    if(!root) return;

    let underline = root.querySelector(':scope > .' + CFG.underlineClass);
    if(underline) return;

    underline = document.createElement('div');
    underline.className = CFG.underlineClass;
    underline.setAttribute('aria-hidden', 'true');

    const left = document.createElement('div');
    left.className = CFG.lineClass + ' left';

    const right = document.createElement('div');
    right.className = CFG.lineClass + ' right';

    const badge = document.createElement('div');
    badge.className = CFG.badgeClass;

    const img = document.createElement('img');
    img.src = CFG.logoUrl;
    img.alt = '';

    badge.appendChild(img);
    underline.appendChild(left);
    underline.appendChild(right);
    underline.appendChild(badge);

    root.appendChild(underline);
  }

  function init(){
    document.querySelectorAll(CFG.navSelector).forEach(buildUnderline);
  }

  let raf = null;
  function schedule(){
    if(raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(init);
  }

  init();

  const obs = new MutationObserver(schedule);
  obs.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setTimeout(() => {
    try { obs.disconnect(); } catch (e) {}
  }, 20000);
})();

(() => {
  if (location.pathname !== '/basket') return;

  const apply = () => {
    document.body.classList.add('fc-basket-hide-footer');
  };

  apply();

  const mo = new MutationObserver(() => apply());
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();

(() => {

  const TARGET = "https://flashcompetitions.com/lists";
  const REPLACEMENT = "https://flashcompetitions.com/i/lists";

  function fixLinks(){
    document.querySelectorAll('a[href="https://flashcompetitions.com/lists"]').forEach(el=>{
      el.href = REPLACEMENT;
    });
  }

  // run immediately
  fixLinks();

  // run again if nav reloads (Livewire / Flux)
  const obs = new MutationObserver(fixLinks);
  obs.observe(document.documentElement,{
    childList:true,
    subtree:true
  });

})();

(() => {
  const TARGET = "https://flashcompetitions.com/i/competitions";

  function buildDirectLinkFromButton(btn){
    if (!btn || btn.tagName.toLowerCase() === "a") return;
    if (btn.dataset.fcConverted === "1") return;

    const iconHtml = btn.querySelector(".fcNavX-ico")?.outerHTML || "";
    const txt = "Competitions";

    const link = document.createElement("a");
    link.id = "categories-header";
    link.href = TARGET;
    link.className = (btn.className || "") + " fcCompDirectLink";
    link.dataset.fcConverted = "1";

    link.innerHTML = `
      ${iconHtml}
      <span class="fcNavX-txt">${txt}</span>
    `;

    btn.replaceWith(link);
  }

  function apply(){
    const buttons = [...document.querySelectorAll('button#categories-header')];
    buttons.forEach(buildDirectLinkFromButton);
  }

  apply();

  const mo = new MutationObserver(() => apply());
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();

(() => {
  if (!/\/login\/?$/.test(location.pathname)) return;

  const apply = () => {
    document.body.classList.add('fc-login-page');
  };

  apply();

  const mo = new MutationObserver(() => apply());
  mo.observe(document.documentElement, { childList:true, subtree:true });
})();

(() => {
  if (!/\/register\/?$/.test(location.pathname)) return;

  const apply = () => {
    document.body.classList.add('fc-register-page');
  };

  apply();

  const mo = new MutationObserver(() => apply());
  mo.observe(document.documentElement, { childList:true, subtree:true });
})();

(() => {
  if (!/^\/(login|register)\/?$/.test(location.pathname)) return;

  const apply = () => {
    document.body.classList.add('fc-auth-hide-heading');
  };

  apply();

  const mo = new MutationObserver(() => apply());
  mo.observe(document.documentElement, { childList:true, subtree:true });
})();
