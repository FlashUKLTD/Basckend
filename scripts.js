/* =========================================================
   🔧 FLASH — EASY CUSTOMISATION ZONE
   Edit ONLY this section for future changes
   ========================================================= */

window.FLASH_CONFIG = {

  /* ---------------- ADMIN BUTTON ---------------- */
  adminEdit: {
    enabled: true,
    selector: 'a[href*="/admin/products/"][href$="/edit"]',
    label: "⚙️ Manage Competition",
    gradient: "linear-gradient(90deg, #8181ec, #4f3ff7)",
    borderColor: "#8181ec",
    glow: "0 6px 20px rgba(129,129,236,.8)"
  },

  /* ---------------- LIVE BADGE ---------------- */
  liveBadge: {
    enabled: true,
    targetId: "#header-instant-list",
    text: "LIVE"
  },

  /* ---------------- ODDS HIDING ---------------- */
  hideInfinityOdds: true,

  /* ---------------- TICKET TOTAL ---------------- */
  hideZeroTicketTotal: true,

  /* ---------------- SOCIAL LINKS ---------------- */
  socials: {
    enabled: true,
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/flashcompetitionsni"
  },

  /* ---------------- MOBILE NAV ---------------- */
  mobileNav: {
    enabled: true,
    sidebarSelector: '[data-flux-sidebar].lg\\:hidden',
    navSelector: '[data-flux-navlist]',
    hideOriginalNav: true,
    showSeparators: true,

    items: [
      { match: { idEquals: "header-results" }, label: "Winners" },
      { match: { idEquals: "header-entry-list" }, label: "Entry Lists" },
      { match: { idEquals: "header-instant-list" }, label: "Instant Winners" },
      { match: { idEquals: "categories-header" }, type: "dropdown", label: "Competitions" },
      { match: { hrefIncludes: "/account/settings" }, label: "Settings" }
    ]
  }
};

/* =========================================================
   🚀 FUNCTIONAL CODE — DO NOT EDIT BELOW
   ========================================================= */

/* ---------- ADMIN BUTTON ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const C = FLASH_CONFIG.adminEdit;
  if (!C.enabled) return;

  const btn = document.querySelector(C.selector);
  if (!btn) return;

  btn.textContent = C.label;
  Object.assign(btn.style, {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "700",
    background: C.gradient,
    color: "#fff",
    borderRadius: "0.75rem",
    padding: "0.5rem 1rem",
    border: `2px solid ${C.borderColor}`,
    transition: "all .3s ease",
    boxShadow: "0 4px 12px rgba(129,129,236,.5)"
  });

  btn.onmouseover = () => {
    btn.style.transform = "scale(1.05)";
    btn.style.boxShadow = C.glow;
  };
  btn.onmouseout = () => {
    btn.style.transform = "scale(1)";
    btn.style.boxShadow = "0 4px 12px rgba(129,129,236,.5)";
  };
});

/* ---------- LIVE BADGE ---------- */
(function(){
  if (!FLASH_CONFIG.liveBadge.enabled) return;
  if (window.__FLASH_LIVE__) return;
  window.__FLASH_LIVE__ = true;

  function apply(){
    const a = document.querySelector(FLASH_CONFIG.liveBadge.targetId);
    if (!a || a.querySelector(".flash-live-wrap")) return true;

    const span = a.querySelector("span");
    if (!span) return false;

    const wrap = document.createElement("span");
    wrap.className = "flash-live-wrap";
    wrap.innerHTML =
      '<span class="flash-live-dot"></span>' +
      `<span class="flash-live-text">${FLASH_CONFIG.liveBadge.text}</span>`;

    span.parentElement.insertBefore(wrap, span);
    return true;
  }

  let t = setInterval(() => apply() && clearInterval(t), 250);
})();

/* ---------- HIDE INFINITY ODDS ---------- */
(() => {
  if (!FLASH_CONFIG.hideInfinityOdds) return;

  const style = document.createElement("style");
  style.textContent = ".js-hide{display:none!important}";
  document.head.appendChild(style);

  function apply(){
    const el =
      document.querySelector('span[x-text="calculateOdds()"]') ||
      [...document.querySelectorAll("span")].find(s => s.textContent.startsWith("Odds "));
    if (!el) return;

    el.classList.toggle("js-hide", /Infinity\s*\/\s*1/i.test(el.textContent));
  }

  new MutationObserver(apply).observe(document.documentElement,{subtree:true,childList:true});
  setInterval(apply,300);
})();

/* ---------- HIDE ZERO TICKET TOTAL ---------- */
(() => {
  if (!FLASH_CONFIG.hideZeroTicketTotal) return;

  const style = document.createElement("style");
  style.textContent = ".js-hide-ticket-total{display:none!important}";
  document.head.appendChild(style);

  function apply(){
    const p =
      document.querySelector('p[x-text*="Tickets Total"]') ||
      [...document.querySelectorAll("p")].find(p=>p.textContent.startsWith("Tickets Total:"));
    if (!p) return;

    const m = p.textContent.match(/£\s*([\d.]+)/);
    if (!m) return;

    p.closest("div").classList.toggle("js-hide-ticket-total", Number(m[1]) === 0);
  }

  new MutationObserver(apply).observe(document.documentElement,{subtree:true,childList:true});
  setInterval(apply,300);
})();

/* ---------- SOCIAL ICONS ---------- */
(function(){
  if (!FLASH_CONFIG.socials.enabled) return;
  if (window.__FLASH_SOCIAL__) return;
  window.__FLASH_SOCIAL__ = true;

  function insert(){
    if (document.querySelector(".flash-socialbar")) return true;
    const nav = document.querySelector("header nav, header, nav");
    if (!nav) return false;

    const wrap = document.createElement("div");
    wrap.className = "flash-socialbar";
    wrap.innerHTML =
      `<a href="${FLASH_CONFIG.socials.instagram}" target="_blank">IG</a>
       <a href="${FLASH_CONFIG.socials.facebook}" target="_blank">FB</a>`;
    nav.prepend(wrap);
    return true;
  }

  let t=setInterval(()=>insert()&&clearInterval(t),250);
})();

/* ---------- MOBILE NAV ---------- */
(() => {
  const CFG = FLASH_CONFIG.mobileNav;
  if (!CFG.enabled) return;

  function qs(s,r=document){return r.querySelector(s)}
  function qsa(s,r=document){return [...r.querySelectorAll(s)]}

  function build(){
    const sidebar = qs(CFG.sidebarSelector);
    if (!sidebar || sidebar.__fcBuilt) return;

    const nav = qs(CFG.navSelector, sidebar);
    if (!nav) return;

    const wrap = document.createElement("div");
    wrap.className = "fcNavX";

    let first=true;
    CFG.items.forEach(it=>{
      let el=null;
      if(it.match.idEquals) el=qs("#"+CSS.escape(it.match.idEquals),nav);
      if(it.match.hrefIncludes) el=qsa("a[href]",nav).find(a=>a.href.includes(it.match.hrefIncludes));
      if(!el) return;

      if(CFG.showSeparators && !first){
        const sep=document.createElement("div");
        sep.className="fcNavX-sep";
        wrap.appendChild(sep);
      }
      first=false;

      if(it.type==="dropdown"){
        const dd=el.closest("ui-dropdown");
        if(dd) wrap.appendChild(dd);
      } else {
        wrap.appendChild(el.closest("a"));
      }
    });

    nav.before(wrap);
    if(CFG.hideOriginalNav) nav.style.display="none";
    sidebar.__fcBuilt=true;
  }

  let t=setInterval(build,220);
})();

