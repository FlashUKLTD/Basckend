/* =========================================================
   🔧 FLASH SCRIPTS — EASY SETTINGS (EDIT HERE ONLY)
   Everything you should customise lives in this block.
   ========================================================= */

window.FLASH_SITE = window.FLASH_SITE || {};

/* -------------------------
   Admin "Edit" helper
   (kept exactly as-is, just configurable)
   ------------------------- */
window.FLASH_SITE.adminEdit = {
  enabled: true,

  // Which link to modify (match by href containing this)
  hrefIncludes: "/admin",

  // Button text
  label: "Edit",

  // Visuals
  bg: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.18)",
  text: "rgba(255,255,255,0.92)",
  hoverBg: "rgba(255,255,255,0.12)"
};

/* -------------------------
   Social buttons injection
   ------------------------- */
window.FLASH_SITE.socials = {
  enabled: true,

  // Where to inject (the script inserts before the first nav item if found)
  navSelector: "nav[data-flux-navlist], [data-flux-navlist]",

  // Links (set "" to hide a button)
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  tiktokUrl: "https://tiktok.com",

  // Visuals
  gapPx: 10,
  iconSizePx: 18,
  btnSizePx: 34,
  radiusPx: 12,

  // Brand accents (Flash)
  accentPurple: "#8B5CFF",
  accentBlue: "#2D7CFF",

  // Button style
  bg: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.14)",
  hoverBg: "rgba(255,255,255,0.10)"
};

/* -------------------------
   LIVE badge injection
   ------------------------- */
window.FLASH_SITE.liveBadge = {
  enabled: true,

  // Which link to badge
  hrefIncludes: "/i/livestream",

  // Badge text (set "" to hide text, dot still shows)
  text: "LIVE",

  // Visuals
  dotColor: "#F87171", // red-ish
  textColor: "rgba(255,255,255,0.92)",
  glow: "rgba(248,113,113,0.35)"
};
/* =========================================================
   🔧 EASY SETTINGS — EDIT HERE ONLY (MOBILE NAV)
   ========================================================= */
window.FC_MOBILE_NAV = {
  enabled: true,

  /* Where to apply (mobile sidebar only) */
  sidebarSelector: '[data-flux-sidebar].lg\\:hidden',
  navSelector: '[data-flux-navlist]',

  /* Optional: show a separator line between items */
  showSeparators: true,

  /* Optional: rename the dropdown label */
  dropdownLabel: "Competitions",

  /* Optional: hide original nav list after rebuild */
  hideOriginalNav: true,

  /* Order + labels + icons
     - id: internal name
     - match: how we find the existing element inside the sidebar nav
       (use ONE of: hrefIncludes, idEquals)
     - label: optional text override
     - icon: SVG string (optional)
     - enabled: true/false
     - type: "link" or "dropdown"
  */
  items: [
    {
      id: "results",
      type: "link",
      match: { idEquals: "header-results" },
      label: "Results",
      enabled: true,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M7 3h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 8h6M9 12h6"/></svg>'
    },
    {
      id: "entrylists",
      type: "link",
      match: { idEquals: "header-entry-list" },
      label: "Entry Lists",
      enabled: true,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h10"/></svg>'
    },
    {
      id: "instant",
      type: "link",
      match: { idEquals: "header-instant-list" },
      label: "Instant Winners",
      enabled: true,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h8l-1 8 11-14h-8l1-6z"/></svg>'
    },
    {
      id: "about",
      type: "link",
      match: { idEquals: "header-about" },
      label: "About",
      enabled: true,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12s4.03-9 9-9 9 4.03 9 9z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 7h.01"/></svg>'
    },

    /* Dropdown (existing ui-dropdown) */
    {
      id: "competitions_dropdown",
      type: "dropdown",
      match: { idEquals: "categories-header" }, /* dropdown trigger button id */
      label: "Competitions",
      enabled: true,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h8l-1 8 11-14h-8l1-6z"/><path d="M9 19l3 3 3-3"/></svg>'
    },

    /* My Account back in list */
    {
      id: "account",
      type: "link",
      match: { hrefIncludes: "/account/settings" },
      label: "My Account",
      enabled: true,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M20 21a8 8 0 0 0-16 0"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"/></svg>'
    }
  ]
};


/* =========================================================
   STOP ✋ END OF EDITABLE SETTINGS
   ========================================================= */


(() => {
  const CFG = window.FC_MOBILE_NAV || {};
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
      return qs('#' + CSS.escape(match.idEquals), nav);
    }
    if(match.hrefIncludes){
      const a = qsa('a[href]', nav).find(x => (x.getAttribute('href') || '').indexOf(match.hrefIncludes) !== -1);
      return a || null;
    }
    return null;
  }

  function ensureInjected(sidebar, nav){
    if(!sidebar || !nav) return false;
    if(sidebar.__fcNavBuilt) return true; // prevent duplicates

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

          const prevI = qs('.fcNavX-ico', btn);
          const prevT = qs('.fcNavX-txt', btn);
          if(prevI) prevI.remove();
          if(prevT) prevT.remove();

          const ico = document.createElement('span');
          ico.className = 'fcNavX-ico';
          ico.innerHTML = it.icon || '';

          const txt = document.createElement('span');
          txt.className = 'fcNavX-txt';
          txt.textContent = it.label || CFG.dropdownLabel || 'Competitions';

          btn.insertBefore(ico, btn.firstChild);
          btn.insertBefore(txt, ico.nextSibling);
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
      txt.textContent = it.label || (a.textContent || '').trim() || '';

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
    }catch(e){
      return false; // never block page
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
})();

(function(){
  "use strict";

  var CFG = window.FLASH_SITE || {};

  /* ======================================================
     1) Admin Edit button styling
     ====================================================== */
  (function(){
    var A = CFG.adminEdit || {};
    if(A.enabled === false) return;

    function injectAdminEditStylesOnce(){
      if(document.getElementById("flash-admin-edit-style")) return;

      var style = document.createElement("style");
      style.id = "flash-admin-edit-style";
      style.textContent = ''
        + '.flash-admin-edit-btn{'
        + 'display:inline-flex;align-items:center;gap:8px;'
        + 'padding:8px 10px;border-radius:12px;'
        + 'background:'+ (A.bg || "rgba(255,255,255,0.08)") +';'
        + 'border:1px solid '+ (A.border || "rgba(255,255,255,0.18)") +';'
        + 'color:'+ (A.text || "rgba(255,255,255,0.92)") +';'
        + 'font-weight:900;font-size:13px;line-height:1;'
        + 'text-decoration:none;'
        + '}'
        + '.flash-admin-edit-btn:hover{background:'+ (A.hoverBg || "rgba(255,255,255,0.12)") +';}';
      document.head.appendChild(style);
    }

    function addEditButton(){
      injectAdminEditStylesOnce();

      var hrefIncludes = String(A.hrefIncludes || "/admin");
      var label = String(A.label || "Edit");

      var link = document.querySelector('a[href*="' + hrefIncludes.replace(/"/g,'') + '"]');
      if(!link) return false;

      // Avoid re-adding
      if(link.classList.contains("flash-admin-edit-btn")) return true;

      link.classList.add("flash-admin-edit-btn");
      link.textContent = label;
      return true;
    }

    function boot(){
      try{ if(addEditButton()) return true; }catch(_){}
      return false;
    }

    // Attempt now + small retries (safe for dynamic content)
    if(boot()) return;
    var tries=0, max=20;
    var t=setInterval(function(){
      tries++;
      if(boot() || tries>=max) clearInterval(t);
    }, 250);

    if(document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", function(){ boot(); }, {once:true});
    }
  })();

  /* ======================================================
     2) Social buttons injection
     ====================================================== */
  (function(){
    var S = CFG.socials || {};
    if(S.enabled === false) return;

    function injectSocialStylesOnce(){
      if(document.getElementById("flash-social-style")) return;

      var style = document.createElement("style");
      style.id = "flash-social-style";

      var bg = S.bg || "rgba(255,255,255,0.06)";
      var border = S.border || "rgba(255,255,255,0.14)";
      var hoverBg = S.hoverBg || "rgba(255,255,255,0.10)";
      var size = Number(S.btnSizePx || 34);
      var r = Number(S.radiusPx || 12);
      var icon = Number(S.iconSizePx || 18);
      var gap = Number(S.gapPx || 10);

      style.textContent = ''
        + '.flash-social-wrap{display:flex;align-items:center;gap:'+gap+'px;margin:10px 0 14px;}'
        + '.flash-social-btn{width:'+size+'px;height:'+size+'px;display:inline-flex;align-items:center;justify-content:center;'
        + 'border-radius:'+r+'px;background:'+bg+';border:1px solid '+border+';'
        + 'color:rgba(255,255,255,.92);text-decoration:none;transition:background .18s ease, transform .18s ease;}'
        + '.flash-social-btn:hover{background:'+hoverBg+';transform:translateY(-1px)}'
        + '.flash-social-btn:active{transform:translateY(0px)}'
        + '.flash-social-btn svg{width:'+icon+'px;height:'+icon+'px;display:block}';
      document.head.appendChild(style);
    }

    function iconSvg(kind){
      // Simple inline icons (no external deps)
      if(kind === "facebook"){
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path stroke-linecap="round" stroke-linejoin="round" d="M14 9h3V6h-3c-1.66 0-3 1.34-3 3v3H8v3h3v6h3v-6h3l1-3h-4V9c0-.55.45-1 1-1z"/></svg>';
      }
      if(kind === "instagram"){
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="7" y="7" width="10" height="10" rx="3"/><path stroke-linecap="round" d="M16.5 7.5h.01"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>';
      }
      // tiktok
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path stroke-linecap="round" stroke-linejoin="round" d="M14 3v10a4 4 0 1 1-4-4"/><path stroke-linecap="round" stroke-linejoin="round" d="M14 7c1.2 1.9 3 3 5 3"/></svg>';
    }

    function buildSocialBtn(kind, url){
      url = String(url || "").trim();
      if(!url) return null;
      var a = document.createElement("a");
      a.className = "flash-social-btn";
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", kind);
      a.innerHTML = iconSvg(kind);
      return a;
    }

    function addSocialsOnce(){
      var nav = document.querySelector(S.navSelector || "nav[data-flux-navlist], [data-flux-navlist]");
      if(!nav) return false;

      // Already injected?
      if(nav.querySelector(".flash-social-wrap")) return true;

      injectSocialStylesOnce();

      var wrap = document.createElement("div");
      wrap.className = "flash-social-wrap";

      var fb = buildSocialBtn("facebook", S.facebookUrl);
      var ig = buildSocialBtn("instagram", S.instagramUrl);
      var tk = buildSocialBtn("tiktok", S.tiktokUrl);

      if(fb) wrap.appendChild(fb);
      if(ig) wrap.appendChild(ig);
      if(tk) wrap.appendChild(tk);

      // If all are empty, do nothing
      if(!wrap.childNodes.length) return true;

      // Insert at top of nav list
      nav.insertBefore(wrap, nav.firstChild);
      return true;
    }

    // Attempt now + retry (safe)
    if(addSocialsOnce()) return;
    var tries=0, max=25;
    var t=setInterval(function(){
      tries++;
      if(addSocialsOnce() || tries>=max) clearInterval(t);
    }, 220);

    if(document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", function(){ addSocialsOnce(); }, {once:true});
    }
  })();

  /* ======================================================
     3) LIVE badge injection
     ====================================================== */
  (function(){
    var L = CFG.liveBadge || {};
    if(L.enabled === false) return;

    function injectLiveStylesOnce(){
      if(document.getElementById("flash-live-style")) return;
      var style = document.createElement("style");
      style.id = "flash-live-style";
      style.textContent = ''
        + '.flash-live-wrap{display:inline-flex;align-items:center;gap:6px;margin-right:10px;}'
        + '.flash-live-dot{width:7px;height:7px;border-radius:999px;background:'+(L.dotColor||"#F87171")+';'
        + 'box-shadow:0 0 18px '+(L.glow||"rgba(248,113,113,0.35)")+';}'
        + '.flash-live-text{font-weight:1000;font-size:11px;letter-spacing:.12em;'
        + 'color:'+(L.textColor||"rgba(255,255,255,0.92)")+';}';
      document.head.appendChild(style);
    }

    function addLiveBadgeOnce(){
      injectLiveStylesOnce();

      var hrefIncludes = String(L.hrefIncludes || "/live");
      var a = document.querySelector('a[href*="' + hrefIncludes.replace(/"/g,'') + '"]');
      if(!a) return false;
      if(a.querySelector('.flash-live-wrap')) return true;

      // Find where your text is
      var span = a.querySelector('span');
      if(!span || !span.parentElement) return false;

      var wrap = document.createElement('span');
      wrap.className = 'flash-live-wrap';
      wrap.setAttribute('aria-hidden', 'true');

      var dot = document.createElement('span');
      dot.className = 'flash-live-dot';

      wrap.appendChild(dot);

      var txtVal = String(L.text || "").trim();
      if(txtVal){
        var txt = document.createElement('span');
        txt.className = 'flash-live-text';
        txt.textContent = txtVal;
        wrap.appendChild(txt);
      }

      span.parentElement.insertBefore(wrap, span);
      return true;
    }

    if(addLiveBadgeOnce()) return;

    var tries = 0, maxTries = 20;
    var t = setInterval(function(){
      tries++;
      if(addLiveBadgeOnce() || tries>=maxTries) clearInterval(t);
    }, 250);

    if(document.readyState === "loading"){
      document.addEventListener("DOMContentLoaded", function(){ addLiveBadgeOnce(); }, {once:true});
    }
  })();

})();
