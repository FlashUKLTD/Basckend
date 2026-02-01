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
  hrefIncludes: "/live",

  // Badge text (set "" to hide text, dot still shows)
  text: "LIVE",

  // Visuals
  dotColor: "#F87171", // red-ish
  textColor: "rgba(255,255,255,0.92)",
  glow: "rgba(248,113,113,0.35)"
};

/* =========================================================
   STOP ✋ END OF EDITABLE SETTINGS
   ========================================================= */

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
