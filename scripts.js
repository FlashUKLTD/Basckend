/* =========================================================
   ⚡ FLASH COMPETITIONS — SCRIPTS.JS (DROP-IN REPLACEMENT)
   =========================================================
   ✅ DO NOT EDIT BELOW unless needed
   ✅ EDIT ONLY the CUSTOMISATION section here
   ✅ Keeps ALL original functionality, adds:
      - Mobile sidebar nav rebuild + custom order + icons
      - Prevent socials injecting into mobile
   ========================================================= */


/* =========================================================
   🔧 EASY CUSTOMISATION — EDIT HERE ONLY
   ========================================================= */
window.FLASH_CUSTOM = window.FLASH_CUSTOM || {

  /* =========================
     1) ADMIN MANAGE BUTTON
     ========================= */
  adminManage: {
    enabled: true,
    selector: 'a[href*="/admin/products/"][href$="/edit"]',
    text: "⚙️ Manage Competition",
    styles: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      fontWeight: "700",
      background: "linear-gradient(90deg, #8181ec, #4f3ff7)", // blue → purple
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(129, 129, 236, 0.5)",
      transition: "all 0.3s ease",
      borderRadius: "0.75rem",
      padding: "0.5rem 1rem",
      border: "2px solid #8181ec"
    },
    hover: {
      transform: "scale(1.05)",
      boxShadow: "0 6px 20px rgba(129, 129, 236, 0.8)"
    },
    out: {
      transform: "scale(1)",
      boxShadow: "0 4px 12px rgba(129, 129, 236, 0.5)"
    }
  },

  /* =========================
     2) LIVE BADGE (Instant Winners nav item)
     ========================= */
  liveBadge: {
    enabled: true,
    anchorSelector: "#header-instant-list",
    wrapClass: "flash-live-wrap",
    dotClass: "flash-live-dot",
    textClass: "flash-live-text",
    text: "LIVE",
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
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/flashcompetitionsni",

    /* IMPORTANT:
       - This prevents the socials appearing in mobile sidebar.
       - Leave as false unless you explicitly want socials on mobile.
    */
    showOnMobile: false,

    /* Try these desktop targets first */
    desktopTargets: [
      "header nav",
      "header",
      "nav"
    ],

    /* Inside the nav/header, attempt to locate the menu area */
    menuTargets: [
      "[data-flux-navbar-items]",
      "ul",
      "div"
    ],

    retries: { max: 20, everyMs: 250 }
  },

  /* =========================
     6) MOBILE SIDEBAR NAV REBUILDER (CUSTOM ORDER)
     =========================
     ✅ This ONLY affects the mobile sidebar ([data-flux-sidebar].lg:hidden)
     ✅ Desktop navbar is untouched.
     ✅ You can reorder by changing items array order.
  */
  mobileNav: {
    enabled: true,

    /* Where to apply (mobile sidebar only) */
    sidebarSelector: '[data-flux-sidebar].lg\\:hidden',
    navSelector: '[data-flux-navlist]',

    /* Optional: show a separator line between items */
    showSeparators: true,

    /* Optional: rename dropdown label */
    dropdownLabel: "Competitions",

    /* Optional: hide original nav list after rebuild */
    hideOriginalNav: true,

    /* Order + labels + icons
       - type: "link" or "dropdown"
       - match: { idEquals } OR { hrefIncludes }
       - icon: SVG string
    */
    items: [
      {
        id: "results",
        type: "link",
        match: { idEquals: "header-results" },
        label: "Results",
        enabled: true,
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M7 3h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2z"/>' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M9 8h6M9 12h6"/>' +
          '</svg>'
      },
      {
        id: "entrylists",
        type: "link",
        match: { idEquals: "header-entry-list" },
        label: "Entry Lists",
        enabled: true,
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h10"/>' +
          '</svg>'
      },
      {
        id: "instant",
        type: "link",
        match: { idEquals: "header-instant-list" },
        label: "Instant Winners",
        enabled: true,
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h8l-1 8 11-14h-8l1-6z"/>' +
          '</svg>'
      },
      {
        id: "about",
        type: "link",
        match: { idEquals: "header-about" },
        label: "About",
        enabled: true,
        icon:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12s4.03-9 9-9 9 4.03 9 9z"/>' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6"/>' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M12 7h.01"/>' +
          '</svg>'
      },

      /* Dropdown trigger (existing ui-dropdown) */
      {
        id: "competitions_dropdown",
        type: "dropdown",
        match: { idEquals: "categories-header" },
        label: "Competitions",
        enabled: true,
        icon:
          /* cleaner dropdown/competition-ish icon */
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16"/>' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16"/>' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M4 17h16"/>' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M8 9l-2-2-2 2"/>' +
          '</svg>'
      },

      /* My Account in list */
      {
        id: "account",
        type: "link",
        match: { hrefIncludes: "/account/settings" },
        label: "My Account",
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

    // Select the admin edit button
    const button = document.querySelector(CFG.selector);

    if (button) {
      // Replace text
      button.textContent = CFG.text;

      // Style button
      const s = CFG.styles || {};
      Object.keys(s).forEach((k) => { button.style[k] = s[k]; });

      // Hover effect
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

    // Prevent double-run if injection executes twice
    if (window.__FLASH_LIVE_BADGE_ADDED__) return;
    window.__FLASH_LIVE_BADGE_ADDED__ = true;

    function addLiveBadgeOnce() {
      var a = document.querySelector(CFG.anchorSelector || '#header-instant-list');
      if (!a) return false;

      // Already added? stop
      if (a.querySelector('.' + (CFG.wrapClass || 'flash-live-wrap'))) return true;

      // Find where your text is
      var span = a.querySelector('span');
      if (!span || !span.parentElement) return false;

      // Create wrap
      var wrap = document.createElement('span');
      wrap.className = (CFG.wrapClass || 'flash-live-wrap');
      wrap.setAttribute('aria-hidden', 'true');

      // Dot
      var dot = document.createElement('span');
      dot.className = (CFG.dotClass || 'flash-live-dot');

      // LIVE text
      var txt = document.createElement('span');
      txt.className = (CFG.textClass || 'flash-live-text');
      txt.textContent = (CFG.text || 'LIVE');

      wrap.appendChild(dot);
      wrap.appendChild(txt);

      // Insert before the actual text
      span.parentElement.insertBefore(wrap, span);

      return true;
    }

    // Try immediately
    if (addLiveBadgeOnce()) return;

    // Lightweight retries then STOP
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

    // Ensure we have a reliable hide class
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

    // Add a strong hidden class
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


//SOCIALS (Desktop header only, NOT mobile sidebar)
(function () {
  try{
    const CFG = window.FLASH_CUSTOM.socials;
    if(!CFG || CFG.enabled === false) return;

    // Prevent duplicates
    if (window.__FLASH_SOCIAL_ICONS__) return;
    window.__FLASH_SOCIAL_ICONS__ = true;

    var FACEBOOK_URL  = CFG.facebook;
    var INSTAGRAM_URL = CFG.instagram;

    function isMobile(){
      return window.matchMedia && window.matchMedia("(max-width: 1023px)").matches;
    }

    function getNavContainer(){
      // Block mobile unless explicitly allowed
      if (isMobile() && CFG.showOnMobile === false) return null;

      // Find desktop header/nav
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

      // Facebook icon
      var fb = document.createElement("a");
      fb.href = FACEBOOK_URL;
      fb.target = "_blank";
      fb.rel = "noopener";
      fb.setAttribute("aria-label", "Flash Competitions Facebook");
      fb.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M22 12.06C22 6.504 17.523 2 12 2S2 6.504 2 12.06C2 17.082 5.657 21.245 10.438 22v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.242 0-1.63.776-1.63 1.57v1.887h2.773l-.443 2.91h-2.33V22C18.343 21.245 22 17.082 22 12.06Z"></path>' +
        '</svg>';

      // Instagram icon (restored: NOT a white square)
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
      // stop duplicates
      if (document.querySelector(".flash-socialbar")) return true;

      var nav = getNavContainer();
      if (!nav) return false;

      // Find the actual menu area
      var menu = null;
      var menuTargets = Array.isArray(CFG.menuTargets) ? CFG.menuTargets : ["[data-flux-navbar-items]","ul","div"];
      for(var i=0;i<menuTargets.length;i++){
        var m = nav.querySelector(menuTargets[i]);
        if(m){ menu = m; break; }
      }
      if (!menu) return false;

      // Insert BEFORE navbar items
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
   ✅ MOBILE SIDEBAR NAV REBUILDER (CUSTOM ORDER)
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

      // prevent duplicate work
      if(sidebar.__fcNavBuilt) return true;

      // container
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
          }
          return;
        }

        const a = el.closest('a') || el;
        if(!a || a.tagName !== 'A') return;

        a.classList.add('fcNavX-row');

        // hide existing text span so our controlled label shows
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
