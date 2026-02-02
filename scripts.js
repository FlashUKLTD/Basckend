
/* =========================================================
   🔧 FLASH — EASY CUSTOMISATION (SAFE ONLY)
   👉 EDIT THIS SECTION ONLY
   ========================================================= */

window.FLASH_CUSTOM = {

  /* ---------------- ADMIN BUTTON ---------------- */
  adminButton: {
    label: "⚙️ Manage Competition",
    gradient: "linear-gradient(90deg, #8181ec, #4f3ff7)",
    border: "#8181ec",
    glow: "0 6px 20px rgba(129,129,236,0.8)"
  },

  /* ---------------- LIVE BADGE ---------------- */
  liveBadgeText: "LIVE",

  /* ---------------- SOCIAL LINKS ---------------- */
  socials: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/flashcompetitionsni"
  },

  /* ---------------- MOBILE SIDEBAR ORDER ----------------
     ⚠️ MOBILE ONLY
     ⚠️ EXISTING ELEMENTS ONLY
     ⚠️ DESKTOP IS NEVER TOUCHED
  ------------------------------------------------ */
  mobileNavOrder: [
    "header-results",
    "header-entry-list",
    "header-instant-list",
    "categories-header",
    "/account/settings"
  ]
};

/* =========================================================
   🚫 ORIGINAL CODE — DO NOT EDIT BELOW
   ========================================================= */


/* ---------- ADMIN BUTTON ---------- */
document.addEventListener("DOMContentLoaded", function() {
  const button = document.querySelector('a[href*="/admin/products/"][href$="/edit"]');
  if (!button) return;

  button.textContent = FLASH_CUSTOM.adminButton.label;

  button.style.display = "inline-flex";
  button.style.alignItems = "center";
  button.style.gap = "0.5rem";
  button.style.fontWeight = "700";
  button.style.background = FLASH_CUSTOM.adminButton.gradient;
  button.style.color = "#ffffff";
  button.style.boxShadow = "0 4px 12px rgba(129,129,236,0.5)";
  button.style.transition = "all 0.3s ease";
  button.style.borderRadius = "0.75rem";
  button.style.padding = "0.5rem 1rem";
  button.style.border = "2px solid " + FLASH_CUSTOM.adminButton.border;

  button.addEventListener("mouseover", () => {
    button.style.transform = "scale(1.05)";
    button.style.boxShadow = FLASH_CUSTOM.adminButton.glow;
  });
  button.addEventListener("mouseout", () => {
    button.style.transform = "scale(1)";
    button.style.boxShadow = "0 4px 12px rgba(129,129,236,0.5)";
  });
});


/* ---------- LIVE BADGE ---------- */
(function () {
  if (window.__FLASH_LIVE_BADGE_ADDED__) return;
  window.__FLASH_LIVE_BADGE_ADDED__ = true;

  function addLiveBadgeOnce() {
    var a = document.querySelector('#header-instant-list');
    if (!a || a.querySelector('.flash-live-wrap')) return false;

    var span = a.querySelector('span');
    if (!span || !span.parentElement) return false;

    var wrap = document.createElement('span');
    wrap.className = 'flash-live-wrap';
    wrap.setAttribute('aria-hidden', 'true');

    var dot = document.createElement('span');
    dot.className = 'flash-live-dot';

    var txt = document.createElement('span');
    txt.className = 'flash-live-text';
    txt.textContent = FLASH_CUSTOM.liveBadgeText;

    wrap.appendChild(dot);
    wrap.appendChild(txt);
    span.parentElement.insertBefore(wrap, span);
    return true;
  }

  var tries = 0;
  var t = setInterval(function () {
    tries++;
    if (addLiveBadgeOnce() || tries >= 20) clearInterval(t);
  }, 250);
})();


/* ---------- HIDE INFINITY ODDS ---------- */
(() => {
  const styleId = "js-injection-hide-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = ".js-hide{display:none!important;}";
    document.head.appendChild(style);
  }

  function apply() {
    const el =
      document.querySelector('span[x-text="calculateOdds()"]') ||
      [...document.querySelectorAll("span")].find(s =>
        (s.textContent || "").trim().startsWith("Odds ")
      );
    if (!el) return;

    el.classList.toggle("js-hide", /Infinity\s*\/\s*1/i.test(el.textContent));
  }

  apply();
  new MutationObserver(apply).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true
  });
  setInterval(apply, 300);
})();


/* ---------- HIDE ZERO TICKET TOTAL ---------- */
(() => {
  const style = document.createElement("style");
  style.textContent = ".js-hide-ticket-total{display:none!important;}";
  document.head.appendChild(style);

  function apply() {
    const p =
      document.querySelector('p[x-text*="Tickets Total"]') ||
      [...document.querySelectorAll("p")].find(p =>
        p.textContent && p.textContent.trim().startsWith("Tickets Total:")
      );
    if (!p) return;

    const m = p.textContent.match(/£\s*([\d.]+)/);
    if (!m) return;

    (p.closest("div") || p.parentElement)
      .classList.toggle("js-hide-ticket-total", Number(m[1]) === 0);
  }

  apply();
  new MutationObserver(apply).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true
  });
  setInterval(apply, 300);
})();


/* ---------- SOCIAL ICONS (ORIGINAL — UNTOUCHED) ---------- */
(function () {
  if (window.__FLASH_SOCIAL_ICONS__) return;
  window.__FLASH_SOCIAL_ICONS__ = true;

  var FACEBOOK_URL  = FLASH_CUSTOM.socials.facebook;
  var INSTAGRAM_URL = FLASH_CUSTOM.socials.instagram;

  function getNavContainer(){
    return document.querySelector('header nav')
        || document.querySelector('header')
        || document.querySelector('nav');
  }

  function buildIcons(){
    var wrap = document.createElement("div");
    wrap.className = "flash-socialbar";

    var fb = document.createElement("a");
    fb.href = FACEBOOK_URL;
    fb.target = "_blank";
    fb.rel = "noopener";
    fb.innerHTML = '<svg viewBox="0 0 24 24"><path d="M22 12.06C22 6.504 17.523 2 12 2S2 6.504 2 12.06C2 17.082 5.657 21.245 10.438 22v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.242 0-1.63.776-1.63 1.57v1.887h2.773l-.443 2.91h-2.33V22C18.343 21.245 22 17.082 22 12.06Z"/></svg>';

    var ig = document.createElement("a");
    ig.href = INSTAGRAM_URL;
    ig.target = "_blank";
    ig.rel = "noopener";
    ig.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Z"/></svg>';

    wrap.appendChild(ig);
    wrap.appendChild(fb);
    return wrap;
  }

  function insertOnce(){
    if (document.querySelector(".flash-socialbar")) return true;
    var nav = getNavContainer();
    if (!nav) return false;

    var menu =
      nav.querySelector("[data-flux-navbar-items]") ||
      nav.querySelector("ul") ||
      nav.querySelector("div");

    if (!menu) return false;
    menu.parentElement.insertBefore(buildIcons(), menu);
    return true;
  }

  var tries = 0;
  var t = setInterval(function(){
    tries++;
    if (insertOnce() || tries >= 20) clearInterval(t);
  }, 250);
})();


/* ---------- MOBILE SIDEBAR ORDER (SAFE, EXISTING NODES ONLY) ---------- */
(function(){
  const ORDER = FLASH_CUSTOM.mobileNavOrder;
  if (!ORDER || !ORDER.length) return;

  function apply(){
    const sidebar = document.querySelector('[data-flux-sidebar].lg\\:hidden');
    if (!sidebar || sidebar.__flashReordered) return;

    const nav = sidebar.querySelector('[data-flux-navlist]');
    if (!nav) return;

    const items = [];
    ORDER.forEach(key => {
      let el =
        nav.querySelector('#' + CSS.escape(key)) ||
        [...nav.querySelectorAll('a[href]')].find(a => a.href.includes(key));
      if (el) items.push(el.closest('a') || el);
    });

    items.forEach(el => nav.appendChild(el));
    sidebar.__flashReordered = true;
  }

  let t = setInterval(() => {
    apply();
    if (document.querySelector('[data-flux-sidebar].lg\\:hidden')?.__flashReordered) clearInterval(t);
  }, 300);
})();

