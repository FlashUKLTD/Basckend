
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
