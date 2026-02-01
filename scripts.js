
document.addEventListener("DOMContentLoaded", function() {
    // Select the admin edit button
    const button = document.querySelector('a[href*="/admin/products/"][href$="/edit"]');

    if (button) {
        // Replace text with cog emoji
        button.textContent = "⚙️ Manage Competition";

        // Style button for site theme + importance
        button.style.display = "inline-flex";
        button.style.alignItems = "center";
        button.style.gap = "0.5rem";
        button.style.fontWeight = "700";
        button.style.background = "linear-gradient(90deg, #8181ec, #4f3ff7)"; // blue → purple
        button.style.color = "#ffffff";
        button.style.boxShadow = "0 4px 12px rgba(129, 129, 236, 0.5)";
        button.style.transition = "all 0.3s ease";
        button.style.borderRadius = "0.75rem";
        button.style.padding = "0.5rem 1rem";
        button.style.border = "2px solid #8181ec";

        // Hover effect: glow + scale
        button.addEventListener("mouseover", () => {
            button.style.transform = "scale(1.05)";
            button.style.boxShadow = "0 6px 20px rgba(129, 129, 236, 0.8)";
        });
        button.addEventListener("mouseout", () => {
            button.style.transform = "scale(1)";
            button.style.boxShadow = "0 4px 12px rgba(129, 129, 236, 0.5)";
        });
    }
});


(function () {
  // Prevent double-run if injection executes twice
  if (window.__FLASH_LIVE_BADGE_ADDED__) return;
  window.__FLASH_LIVE_BADGE_ADDED__ = true;

  function addLiveBadgeOnce() {
    var a = document.querySelector('#header-instant-list');
    if (!a) return false;

    // Already added? stop
    if (a.querySelector('.flash-live-wrap')) return true;

    // Find where your text is
    var span = a.querySelector('span');
    if (!span || !span.parentElement) return false;

    // Create wrap
    var wrap = document.createElement('span');
    wrap.className = 'flash-live-wrap';
    wrap.setAttribute('aria-hidden', 'true');

    // Dot
    var dot = document.createElement('span');
    dot.className = 'flash-live-dot';

    // LIVE text
    var txt = document.createElement('span');
    txt.className = 'flash-live-text';
    txt.textContent = 'LIVE';

    wrap.appendChild(dot);
    wrap.appendChild(txt);

    // Insert before the actual text
    span.parentElement.insertBefore(wrap, span);

    return true;
  }

  // Try immediately
  if (addLiveBadgeOnce()) return;

  // Lightweight retries (max 20 attempts over ~5 seconds) then STOP
  var tries = 0;
  var maxTries = 20;

  var t = setInterval(function () {
    tries++;

    if (addLiveBadgeOnce() || tries >= maxTries) {
      clearInterval(t);
    }
  }, 250);
})();

(() => {
  // Ensure we have a reliable hide class
  const styleId = "js-injection-hide-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = ".js-hide{display:none!important;}";
    document.head.appendChild(style);
  }

  function getOddsEl() {
    // Best anchor: exact x-text function
    return document.querySelector('span[x-text="calculateOdds()"]')
      // Fallback: any span that contains "Odds" (in case markup changes)
      || Array.from(document.querySelectorAll("span")).find(s =>
        (s.textContent || "").trim().startsWith("Odds ")
      );
  }

  function apply() {
    const el = getOddsEl();
    if (!el) return;

    const txt = (el.textContent || "").trim();

    // Hide when Infinity/1 (also covers weird whitespace)
    const isInfinity = /(^|\b)Odds\s+Infinity\s*\/\s*1\b/i.test(txt);

    if (isInfinity) {
      el.classList.add("js-hide");
    } else {
      // ✅ Reappear automatically when not Infinity/1
      el.classList.remove("js-hide");
    }
  }

  // Run now + after Alpine initializes
  apply();
  setTimeout(apply, 50);
  setTimeout(apply, 250);
  setTimeout(apply, 1000);

  // Watch for Alpine/dynamic updates
  new MutationObserver(apply).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true
  });

  // Fallback polling
  setInterval(apply, 300);
})();

(() => {
  // Add a strong "hidden" class in case your CSS doesn't include Tailwind's `hidden`
  const style = document.createElement("style");
  style.textContent = ".js-hide-ticket-total{display:none!important;}";
  document.head.appendChild(style);

  function getTicketTotalEl() {
    // Best: target the specific x-text expression
    return document.querySelector('p[x-text*="Tickets Total"]')
      // Fallback: any <p> that starts with Tickets Total:
      || Array.from(document.querySelectorAll("p")).find(p =>
        p.textContent && p.textContent.trim().startsWith("Tickets Total:")
      );
  }

  function parsePounds(text) {
    // Extract the first £ number like £0.00, £12.30, etc.
    const m = text.match(/£\s*([0-9]+(?:\.[0-9]{1,2})?)/);
    if (!m) return null;
    return Number(m[1]);
  }

  function apply() {
    const p = getTicketTotalEl();
    if (!p) return;

    const container = p.closest("div") || p.parentElement;
    const amount = parsePounds(p.textContent || "");

    if (amount === null) return;

    if (amount === 0) {
      container.classList.add("js-hide-ticket-total");
    } else {
      container.classList.remove("js-hide-ticket-total");
    }
  }

  // Run now + shortly after (covers Alpine init timing)
  apply();
  setTimeout(apply, 50);
  setTimeout(apply, 250);
  setTimeout(apply, 1000);

  // React to Alpine DOM updates
  const obs = new MutationObserver(apply);
  obs.observe(document.documentElement, { subtree: true, childList: true, characterData: true });

  // Fallback polling (lightweight)
  setInterval(apply, 300);
})();

//SOCIALS
(function () {
  // Prevent duplicates (important if injector runs twice)
  if (window.__FLASH_SOCIAL_ICONS__) return;
  window.__FLASH_SOCIAL_ICONS__ = true;

  // ===== EDIT LINKS HERE =====
  var FACEBOOK_URL  = "https://www.facebook.com/";   // <-- your Facebook link
  var INSTAGRAM_URL = "https://www.instagram.com/flashcompetitionsni";  // <-- your Instagram link
  // ===========================

  // Finds your navbar container
  function getNavContainer(){
    // These cover most setups (header/nav)
    return document.querySelector('header nav')
        || document.querySelector('header')
        || document.querySelector('nav');
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

    // Instagram icon
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

    // Find the actual menu area (fallbacks)
    var menu =
      nav.querySelector("[data-flux-navbar-items]") ||
      nav.querySelector("ul") ||
      nav.querySelector("div");

    if (!menu) return false;

    // Insert BEFORE navbar items (to the left)
    menu.parentElement.insertBefore(buildIcons(), menu);
    return true;
  }

  // Try now + quick retries (max ~5s), then stop forever
  if (insertOnce()) return;

  var tries = 0, maxTries = 20;
  var t = setInterval(function(){
    tries++;
    if (insertOnce() || tries >= maxTries) clearInterval(t);
  }, 250);
})();





