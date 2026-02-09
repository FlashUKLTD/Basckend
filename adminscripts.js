(function(){
  var DESKTOP_MIN = 901;
  var KEY_OPEN = "fcAT_open_v2";
  var KEY_TAB = "fcAT_tab_v2";
  var KEY_HIDE_RAFFLEX = "fcAT_hideRafflex_v2";

  var RAFFLEX_BAR_SELECTOR = 'div[wire\\:id][class*="bg-zinc-900"][class*="border-b"]';

  function isDesktop(){ return (window.innerWidth || 0) >= DESKTOP_MIN; }
  function isCompetitionPage(){ return (location.pathname || "").indexOf("/competition/") === 0; }

  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel) || []); }

  function lsGet(k){ try{ return localStorage.getItem(k); }catch(_){ return null; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(_){ } }

  function hideRafflexBar(shouldHide){
    var bars = qsa(RAFFLEX_BAR_SELECTOR);
    for(var i=0;i<bars.length;i++){
      bars[i].style.display = shouldHide ? "none" : "";
    }
  }

  function buildDock(){
    if(qs(".fcATdock")) return;

    var dock = document.createElement("div");
    dock.className = "fcATdock";
    dock.innerHTML =
      '<div class="fcATfab" aria-label="Open admin tools">' +
        '<div class="fcATfabLeft">' +
          '<div class="fcATbolt">⚙️</div>' +
          '<div class="fcATfabText">' +
            '<b>Employee Menu</b>' +
            '<span class="fcATsub">Click to open • Desktop only</span>' +
          '</div>' +
        '</div>' +
        '<div class="fcATfabRight">' +
          '<span class="fcATpill fcATpath"> 🔗 /</span>' +
          '<span class="fcATchev">▴</span>' +
        '</div>' +
      '</div>' +

      '<div class="fcATpanelWrap">' +
        '<div class="fcATpanel">' +
          '<div class="fcAThead">' +
            '<b class="fcATpanelTitle">Admin shortcuts</b>' +
            '<div class="fcATselectWrap">' +
              '<select class="fcATselect" aria-label="Choose tools section">' +
                '<option value="shortcuts">🧭 Admin shortcuts</option>' +
                '<option value="competition">🏁 Competition Tools</option>' +
                '<option value="prefs">⚙️ Preferences</option>' +
              '</select>' +
            '</div>' +
          '</div>' +
          '<div class="fcATbody"></div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(dock);

    var open = lsGet(KEY_OPEN) === "1";
    var wrap = qs(".fcATpanelWrap", dock);
    var chev = qs(".fcATchev", dock);
    if(wrap) wrap.classList.toggle("is-open", open);
    if(chev) chev.textContent = open ? "▾" : "▴";

    var sel = qs(".fcATselect", dock);
    var savedTab = lsGet(KEY_TAB) || "shortcuts";
    if(sel) sel.value = savedTab;

    updatePathPill();
    renderPanel(savedTab);

    var fab = qs(".fcATfab", dock);
    if(fab){
      fab.addEventListener("click", function(){
        var nowOpen = !(wrap && wrap.classList.contains("is-open"));
        if(wrap) wrap.classList.toggle("is-open", nowOpen);
        if(chev) chev.textContent = nowOpen ? "▾" : "▴";
        lsSet(KEY_OPEN, nowOpen ? "1" : "0");
      });
    }

    if(sel){
      sel.addEventListener("change", function(){
        lsSet(KEY_TAB, sel.value);
        renderPanel(sel.value);
      });
    }

    dock.__body = qs(".fcATbody", dock);
    dock.__title = qs(".fcATpanelTitle", dock);
    dock.__select = sel;
  }

  function setTitle(t){
    var dock = qs(".fcATdock");
    if(!dock) return;
    var el = dock.__title || qs(".fcATpanelTitle", dock);
    if(el) el.textContent = t;
  }
  function setBody(html){
    var dock = qs(".fcATdock");
    if(!dock) return;
    var body = dock.__body || qs(".fcATbody", dock);
    if(body) body.innerHTML = html;
  }
  function updatePathPill(){
    var dock = qs(".fcATdock");
    if(!dock) return;
    var p = qs(".fcATpath", dock);
    if(p) p.textContent = "📍 " + (location.pathname || "/");
  }

  function renderPanel(tab){
    if(tab === "shortcuts"){
      setTitle("🧭 Admin shortcuts");
      setBody(buildShortcutsHTML());
      wireCats();
      return;
    }
    if(tab === "competition"){
      setTitle("🏁 Competition tools");
      setBody(buildCompetitionHTML());
      wireCompetition();
      return;
    }
    setTitle("⚙️ Preferences");
    setBody(buildPrefsHTML());
    wirePrefs();
  }

  function buildShortcutsHTML(){
    var cats = [
      {
        title: "🏁 Competitions",
        links: [
          ["Competitions", "/admin/products", "Manage comps"],
          ["Categories", "/admin/product-categories", "Organise drops"],
          ["Instant Winners", "/admin/instant-winners", "IW prizes"],
          ["Winners", "/admin/winners", "Results log"]
        ]
      },
      {
        title: "🛒 Sales",
        links: [
          ["Orders", "/admin/orders", "Sales & fulfilment"],
          ["Coupons", "/admin/coupons", "Discount codes"]
        ]
      },
      {
        title: "👥 Users",
        links: [
          ["Users", "/admin/users", "Accounts & access"]
        ]
      },
      {
        title: "📄 Content",
        links: [
          ["Dashboard", "/admin", "Admin home"],
          ["Pages", "/admin/pages", "Site pages"]
        ]
      },
      {
        title: "📊 Insights",
        links: [
          ["Analytics", "/admin/analytics", "Performance"]
        ]
      },
      {
        title: "⚙️ Settings",
        links: [
          ["General ⚙️", "/admin/settings/general-settings", "Basics"],
          ["Email ✉️", "/admin/settings/email-settings", "Mail templates"],
          ["Branding 🎨", "/admin/settings/branding-settings", "Logos & style"],
          ["Checkout 🧾", "/admin/settings/checkout-settings", "Payments & flow"],
          ["Marketing 📣", "/admin/settings/marketing-settings", "Promos"],
          ["UX ✨", "/admin/settings/user-experience-settings", "Site feel"],
          ["SEO 🔎", "/admin/settings/seo-settings", "Search settings"],
          ["Advanced 🧠", "/admin/settings/advanced-settings", "Power options"],
          ["Integrations 🔌", "/admin/settings/integration-settings", "Connections"],
          ["Settings (root)", "/admin/settings", "All settings"]
        ]
      }
    ];

    var out = '';
    out += '<div class="fcATx">';
    out +=   '<div class="fcATxHead"><div class="fcATxTitle">🧭 Quick navigation</div><div class="fcATxPill">Grouped</div></div>';

    for(var i=0;i<cats.length;i++){
      out += '<div class="fcATcat" data-fcat="1">';
      out +=   '<button class="fcATcatBtn" type="button"><span>'+cats[i].title+'</span><i>Toggle</i></button>';
      out +=   '<div class="fcATcatBody"><div class="fcATlinks">';
      for(var j=0;j<cats[i].links.length;j++){
        var name = cats[i].links[j][0];
        var href = cats[i].links[j][1];
        var hint = cats[i].links[j][2];
        out += '<a class="fcATlink" href="https://flashcompetitions.com'+href+'"><span>'+name+'</span><small>'+hint+'</small></a>';
      }
      out +=   '</div></div>';
      out += '</div>';
    }

    out += '</div>';
    out += '<div class="fcATx"><div class="fcATxHead"><div class="fcATxTitle">💡 Tip</div><div class="fcATxPill">Minimal</div></div>';
    out += '<div style="color:rgba(255,255,255,.72); font-weight:900; font-size:12.5px; line-height:1.45;">Expand only what you need — everything stays compact and scrolls if it grows.</div></div>';
    return out;
  }

  function wireCats(){
    var dock = qs(".fcATdock");
    if(!dock) return;
    var cats = qsa('.fcATcat[data-fcat="1"]', dock);
    for(var i=0;i<cats.length;i++){
      (function(cat){
        var btn = qs(".fcATcatBtn", cat);
        if(!btn) return;
        btn.addEventListener("click", function(){ cat.classList.toggle("is-open"); });
      })(cats[i]);
    }
    if(cats[0]) cats[0].classList.add("is-open");
  }

  /* =========================
     COMPETITION TOOLS (UPGRADED)
     ========================= */

  function buildCompetitionHTML(){
    if(!isCompetitionPage()){
      return '' +
        '<div class="fcATx">' +
          '<div class="fcATxHead"><div class="fcATxTitle">🏁 Competition tools</div><div class="fcATxPill">Only on /competition/*</div></div>' +
          '<div style="color:rgba(255,255,255,.72); font-weight:900; font-size:12.5px; line-height:1.45;">Open a competition page to see Competition Health + Instant Copy + Social kit.</div>' +
        '</div>';
    }

    return '' +
      '<div class="fcATx">' +
        '<div class="fcATxHead"><div class="fcATxTitle">🏁 Competition Health</div><div class="fcATxPill">Best-effort</div></div>' +
        '<div class="fcAThealthRow">' +
          '<span class="fcATdot" id="fcATdot"></span>' +
          '<div class="fcAThealthText">' +
            '<div class="fcAThealthMain" id="fcAThealthMain">Scanning…</div>' +
            '<div class="fcAThealthSub" id="fcAThealthSub">Checking title, price, timers, and CTA visibility.</div>' +
          '</div>' +
        '</div>' +
        '<div class="fcATgrid2" style="margin-top:10px;">' +
          '<div class="fcATcard"><div class="fcATlabel">Title</div><div class="fcATvalue" id="fcATvalTitle">—</div></div>' +
          '<div class="fcATcard"><div class="fcATlabel">URL</div><div class="fcATvalue" id="fcATvalUrl">—</div></div>' +
          '<div class="fcATcard"><div class="fcATlabel">Price</div><div class="fcATvalue" id="fcATvalPrice">—</div></div>' +
          '<div class="fcATcard"><div class="fcATlabel">Countdown / End</div><div class="fcATvalue" id="fcATvalEnd">—</div></div>' +
        '</div>' +
      '</div>' +

      '<div class="fcATx">' +
        '<div class="fcATxHead"><div class="fcATxTitle">📋 Instant Copy</div><div class="fcATxPill">One-click</div></div>' +
        '<div class="fcATbtnRow">' +
          '<button class="fcATbtn" type="button" data-copy="url">🔗 Copy URL</button>' +
          '<button class="fcATbtn" type="button" data-copy="title">🏷️ Copy title</button>' +
          '<button class="fcATbtn" type="button" data-copy="titleurl">✨ Copy title + URL</button>' +
          '<button class="fcATbtn" type="button" data-copy="promo">📣 Copy promo line</button>' +
        '</div>' +
        '<div class="fcATtoast" id="fcATtoast">Ready.</div>' +
      '</div>' +

      '<div class="fcATx">' +
        '<div class="fcATxHead"><div class="fcATxTitle">📣 Social / IG kit</div><div class="fcATxPill">Fast content</div></div>' +
        '<div class="fcATbtnRow">' +
          '<button class="fcATbtn" type="button" data-social="ig_titles">🧠 Copy 3 IG titles</button>' +
          '<button class="fcATbtn" type="button" data-social="ig_captions">📝 Copy 3 IG captions</button>' +
          '<button class="fcATbtn" type="button" data-social="ig_story">📲 Copy IG story text</button>' +
          '<button class="fcATbtn" type="button" data-social="share_pack">📦 Copy share pack</button>' +
          '<button class="fcATbtn" type="button" data-social="utm_url">🔗 Copy UTM URL</button>' +
        '</div>' +
        '<textarea class="fcATta" id="fcATsocialPreview" placeholder="Click a Social button to generate copy… (Preview shows here)"></textarea>' +
        '<div class="fcATtoast" id="fcATsocialToast">Ready.</div>' +
      '</div>' +

      '<div class="fcATx">' +
        '<div class="fcATxHead"><div class="fcATxTitle">🗒️ Quick notes</div><div class="fcATxPill">Per comp</div></div>' +
        '<textarea class="fcATta" id="fcATnotes" placeholder="Notes for this competition… (saved automatically)"></textarea>' +
        '<div class="fcATbtnRow">' +
          '<button class="fcATbtn" type="button" data-notes="copy">📋 Copy notes</button>' +
          '<button class="fcATbtn" type="button" data-notes="clear">🗑️ Clear notes</button>' +
        '</div>' +
        '<div class="fcATtoast" id="fcATnotesToast">Saved.</div>' +
      '</div>';
  }

  function wireCompetition(){
    if(!isCompetitionPage()) return;

    function toast(msg){
      var el = document.getElementById("fcATtoast");
      if(el) el.textContent = msg;
    }
    function socialToast(msg){
      var el = document.getElementById("fcATsocialToast");
      if(el) el.textContent = msg;
    }
    function notesToast(msg){
      var el = document.getElementById("fcATnotesToast");
      if(el) el.textContent = msg;
    }

    function copyToClipboard(text, cb){
      function done(ok){
        if(cb) cb(ok);
      }
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(text).then(function(){ done(true); }).catch(function(){ fallbackCopy(text, done); });
          return;
        }
      }catch(_){}
      fallbackCopy(text, done);
    }
    function fallbackCopy(text, done){
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      try{ document.execCommand("copy"); document.body.removeChild(ta); done(true); }
      catch(e){ document.body.removeChild(ta); done(false); }
    }

    function getTitle(){
      var h = qs("h1") || qs('[data-testid="competition-title"]') || qs(".competition-title");
      if(h && h.textContent) return h.textContent.trim();
      var t = document.title || "";
      return (t || "").replace(/\s+\|\s+.*$/,"").trim();
    }

    function findPriceText(){
  function norm(s){ return (s||"").replace(/\s+/g," ").trim(); }

  function parsePricesFromText(t){
    t = t || "";
    var out = [];

    // Explicit Free signals (tight)
    if(/\bfree\s*entry\b/i.test(t) || /\bentry\s*free\b/i.test(t)) out.push({ kind:"free", label:"Free", pence: 0 });

    // £0 / £0.00
    var z = t.match(/£\s?0(?:\.00)?\b/);
    if(z) out.push({ kind:"free", label:"Free", pence: 0 });

    // Pence: 10p / 10 p / p10
    var pm;
    var reP = /(?:\b(\d{1,3})\s*p\b|\bp\s?(\d{1,3})\b)/ig;
    while((pm = reP.exec(t))){
      var p = parseInt(pm[1] || pm[2], 10);
      if(!isNaN(p) && p >= 1 && p <= 99){
        out.push({ kind:"pence", label: (p + "p"), pence: p });
      }
    }

    // Pounds: £1 / £1.00 / £ 2.50
    var m;
    var re = /£\s?(\d{1,4})(?:\.(\d{1,2}))?/g;
    while((m = re.exec(t))){
      var pounds = parseInt(m[1], 10);
      var dec = m[2] ? m[2].padEnd(2,"0") : "00";
      var pence = (pounds * 100) + parseInt(dec, 10);
      if(pence === 0){
        out.push({ kind:"free", label:"Free", pence: 0 });
      }else{
        out.push({ kind:"pounds", label: ("£" + pounds + "." + dec), pence: pence });
      }
    }

    return out;
  }

  function hasEntryContext(t){
    t = (t||"").toLowerCase();
    return (
      t.indexOf("entry") !== -1 ||
      t.indexOf("per entry") !== -1 ||
      t.indexOf("ticket") !== -1 ||
      t.indexOf("tickets") !== -1 ||
      t.indexOf("enter") !== -1 ||
      t.indexOf("add to basket") !== -1 ||
      t.indexOf("add to cart") !== -1
    );
  }

  function looksLikeUnrelatedFree(t){
    // Ignore "free delivery/postage/returns" etc
    return /\bfree\s*(delivery|shipping|postage|returns?|gift|trial)\b/i.test(t||"");
  }

  // 1) Focus scan: only nodes likely involved in entry/tickets/price UI
  var nodes = qsa(
    "[class*='ticket'],[class*='entry'],[class*='price'],[id*='ticket'],[id*='entry'],[id*='price'],button,a,select,option,label"
  ).slice(0, 1600);

  var candidates = [];

  for(var i=0;i<nodes.length;i++){
    var el = nodes[i];
    var t = norm(el.textContent || "");
    if(!t) continue;
    if(t.length > 180) continue;

    // Take the element + its parent text (often the price is in sibling)
    var p = el.parentElement ? norm(el.parentElement.textContent || "") : "";
    var combined = t + (p && p !== t ? (" • " + p) : "");

    // Must have entry context somewhere nearby
    if(!hasEntryContext(combined)) continue;

    // Avoid common “free delivery” traps
    if(looksLikeUnrelatedFree(combined)) {
      // Still allow pence/£ prices in this block, just don't treat "FREE" as "Free"
      combined = combined.replace(/\bfree\b/ig, "");
    }

    var prices = parsePricesFromText(combined);
    for(var j=0;j<prices.length;j++){
      // weight: prefer prices found in shorter, more "label-like" blocks
      var score = 100;
      score += Math.max(0, 30 - combined.length/8);
      if(prices[j].kind === "free" && /\bfree\s*entry\b/i.test(combined)) score += 40;
      candidates.push({ score: score, p: prices[j] });
    }
  }

  // 2) Decide:
  // - If we found any explicit "Free entry"/£0 in entry-context, return Free.
  // - Else return the LOWEST price found in entry-context (prevents picking 30p when 10p exists).
  if(candidates.length){
    var hasExplicitFree = false;
    for(var a=0;a<candidates.length;a++){
      if(candidates[a].p.kind === "free" && candidates[a].score >= 120){
        hasExplicitFree = true;
        break;
      }
    }
    if(hasExplicitFree) return "Free";

    // Choose the minimum non-zero price (the actual entry price is almost always the lowest)
    var min = null;
    for(var b=0;b<candidates.length;b++){
      var pp = candidates[b].p;
      if(pp.kind === "free") continue;
      if(min === null || pp.pence < min.pence) min = pp;
    }
    if(min) return min.label;

    // fallback
    return candidates.sort(function(x,y){ return y.score - x.score; })[0].p.label || "";
  }

  // 3) Fallback: very light scan for a single clear price (no "FREE anywhere" auto-win)
  var bodyText = (document.body && document.body.innerText) ? document.body.innerText : "";
  if(/\bfree\s*entry\b/i.test(bodyText) || /\bentry\s*free\b/i.test(bodyText) || /£\s?0(?:\.00)?\b/.test(bodyText)) return "Free";

  var pWhole = bodyText.match(/\b(\d{1,2})\s*p\b/i);
  if(pWhole){
    var v = parseInt(pWhole[1],10);
    if(!isNaN(v)) return v + "p";
  }
  var mWhole = bodyText.match(/£\s?\d+(?:\.\d{1,2})?/);
  if(mWhole && mWhole[0]) return mWhole[0].replace(/\s+/g,"");
  return "";
}


    function findEndOrCountdown(){
      var timeEl = qs('time[datetime]');
      if(timeEl && timeEl.getAttribute("datetime")) return timeEl.getAttribute("datetime");

      var nodes = qsa("body *").slice(0, 1800);
      for(var i=0;i<nodes.length;i++){
        var t = (nodes[i].textContent||"").trim();
        if(!t) continue;
        if(/\b\d+\s*(Days|Day)\b/i.test(t) || /\b\d+\s*(Hours|Hour)\b/i.test(t) || /\b\d+\s*(Minutes|Minute)\b/i.test(t)){
          if(t.length < 60) return t;
        }
        if(/\bremaining\b/i.test(t) && t.length < 80) return t;
      }
      return "";
    }

    function ctaPresent(){
      var nodes = qsa('button, a').slice(0, 220);
      for(var i=0;i<nodes.length;i++){
        var tx = (nodes[i].textContent||"").trim().toLowerCase();
        if(!tx) continue;
        if(tx.indexOf("add") !== -1 && (tx.indexOf("basket") !== -1 || tx.indexOf("cart") !== -1)) return true;
        if(tx.indexOf("enter") !== -1) return true;
        if(tx.indexOf("buy") !== -1 && tx.indexOf("ticket") !== -1) return true;
      }
      return false;
    }

    function setText(id, val){
      var el = document.getElementById(id);
      if(el) el.textContent = val || "—";
    }

    function setHealth(level, main, sub){
      var dot = document.getElementById("fcATdot");
      var mainEl = document.getElementById("fcAThealthMain");
      var subEl = document.getElementById("fcAThealthSub");
      if(dot){
        dot.classList.remove("ok","warn","bad");
        if(level) dot.classList.add(level);
      }
      if(mainEl) mainEl.textContent = main;
      if(subEl) subEl.textContent = sub;
    }

    function inferPrizeFromTitle(t){
      t = t || "";
      var m = t.match(/£\s?\d{1,6}(?:,\d{3})*(?:\.\d{1,2})?/);
      if(m && m[0]) return m[0].replace(/\s+/g,"");
      // common words: "PS5", "iPhone" etc — fallback to "prize"
      return "";
    }

    function inferWinnersFromText(){
      // best-effort scan for "3 winners" etc
      var nodes = qsa("body *").slice(0, 1400);
      for(var i=0;i<nodes.length;i++){
        var tx = (nodes[i].textContent||"").trim();
        if(!tx || tx.length > 80) continue;
        var m = tx.match(/\b(\d+)\s*(x|X)?\s*winners?\b/i);
        if(m && m[1]) return m[1];
      }
      return "";
    }

    function slugFromPath(){
      var p = location.pathname || "";
      var parts = p.split("/").filter(Boolean);
      return parts.length ? parts[parts.length-1] : "";
    }

    function buildUtmUrl(base){
      // tweakable defaults
      var u = base || location.href;
      var sep = u.indexOf("?") === -1 ? "?" : "&";
      return u + sep + "utm_source=instagram&utm_medium=social&utm_campaign=competition";
    }

    function socialPack(d){
      var title = d.title || "Flash Competitions";
      var url = d.url || location.href;
      var price = d.price || "Live now";
      var prize = inferPrizeFromTitle(title);
      var winners = inferWinnersFromText();

      var hook = prize ? ("WIN " + prize) : title.toUpperCase();
      var w = winners ? (winners + " WINNERS") : "";

      var igTitles = [
        "⚡ " + (prize ? ("WIN " + prize) : title),
        "LIVE NOW: " + (prize ? prize : title) + (w ? " • " + w : ""),
        "NEW DROP ⚡ " + (prize ? prize : title)
      ];

      var igCaptions = [
        "⚡ " + title + "\n" + (prize ? ("Prize: " + prize + "\n") : "") + "Entry: " + price + "\nEnter here → " + url + "\n\n#FlashCompetitions #UKCompetitions",
        "LIVE NOW ⚡ " + title + "\nEntry from " + price + "\nTap to enter: " + url + "\n\nGood luck 🍀 #FlashCompetitions",
        "DROP ALERT ⚡\n" + title + "\n" + (w ? (w + " available!\n") : "") + "Enter now: " + url + "\n\n#Competition #Win"
      ];

      var story =
        "⚡ DROP LIVE\n" +
        (prize ? ("WIN " + prize + "\n") : (title + "\n")) +
        "Entry: " + price + "\n" +
        "Tap to enter 👆";

      var sharePack =
        "TITLE: " + title + "\n" +
        "URL: " + url + "\n" +
        "PRICE: " + price + "\n" +
        (prize ? ("PRIZE: " + prize + "\n") : "") +
        (winners ? ("WINNERS: " + winners + "\n") : "") +
        "PROMO: ⚡ Flash Competitions: " + title + " — " + price + " — Enter now: " + url;

      return {
        ig_titles: igTitles.join("\n"),
        ig_captions: igCaptions.join("\n\n—\n\n"),
        ig_story: story,
        share_pack: sharePack,
        utm_url: buildUtmUrl(url),
        meta: { prize: prize, winners: winners, slug: slugFromPath() }
      };
    }

    function scan(){
      var title = getTitle();
      var url = location.href;
      var price = findPriceText();
      var end = findEndOrCountdown();
      var cta = ctaPresent();

      setText("fcATvalTitle", title);
      setText("fcATvalUrl", url);
      setText("fcATvalPrice", price || "—");
      setText("fcATvalEnd", end || "—");

      var missing = [];
      if(!title) missing.push("title");
      if(!price) missing.push("price");
      if(!end) missing.push("timer/end");
      if(!cta) missing.push("CTA");

      if(missing.length === 0){
        setHealth("ok", "Healthy ✅", "All key signals detected.");
      }else if(missing.length <= 2){
        setHealth("warn", "Looks ok ⚠️", "Missing: " + missing.join(", ") + ".");
      }else{
        setHealth("bad", "Needs attention ❗", "Missing: " + missing.join(", ") + ".");
      }

      window.__fcAT_compData = { title:title||"", url:url||"", price:price||"", end:end||"" };
    }

    function wireCopy(){
      var btns = qsa('[data-copy]');
      for(var i=0;i<btns.length;i++){
        btns[i].addEventListener("click", function(){
          var kind = this.getAttribute("data-copy");
          var d = window.__fcAT_compData || {};
          var out = "";
          if(kind === "url") out = d.url || location.href;
          if(kind === "title") out = d.title || "";
          if(kind === "titleurl") out = (d.title ? d.title + " — " : "") + (d.url || location.href);
          if(kind === "promo"){
            var p = d.price || "Live now";
            out = "⚡ Flash Competitions: " + (d.title || "Competition") + " — " + p + " — Enter now: " + (d.url || location.href);
          }
          if(!out) out = location.href;

          copyToClipboard(out, function(ok){
            toast(ok ? "Copied ✓" : "Copy failed");
          });
        });
      }
    }

    function wireSocial(){
      var preview = document.getElementById("fcATsocialPreview");
      var btns = qsa('[data-social]');
      for(var i=0;i<btns.length;i++){
        btns[i].addEventListener("click", function(){
          var kind = this.getAttribute("data-social");
          var d = window.__fcAT_compData || {};
          var pack = socialPack(d);

          var out = pack[kind] || "";
          if(!out) out = (d.title||"") + "\n" + (d.url||location.href);

          if(preview) preview.value = out;

          copyToClipboard(out, function(ok){
            socialToast(ok ? "Copied ✓ (and preview updated)" : "Copy failed");
          });
        });
      }
    }

    function wireNotes(){
      var ta = document.getElementById("fcATnotes");
      if(!ta) return;

      var slug = slugFromPath() || location.pathname;
      var KEY_NOTES = "fcAT_notes_v1:" + slug;

      // load
      try{
        ta.value = lsGet(KEY_NOTES) || "";
      }catch(_){}

      // autosave
      var saveTimer = null;
      ta.addEventListener("input", function(){
        if(saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(function(){
          lsSet(KEY_NOTES, ta.value || "");
          notesToast("Saved ✓");
        }, 250);
      });

      // buttons
      var copyBtn = qs('[data-notes="copy"]');
      if(copyBtn){
        copyBtn.addEventListener("click", function(){
          copyToClipboard(ta.value || "", function(ok){
            notesToast(ok ? "Notes copied ✓" : "Copy failed");
          });
        });
      }
      var clearBtn = qs('[data-notes="clear"]');
      if(clearBtn){
        clearBtn.addEventListener("click", function(){
          ta.value = "";
          lsSet(KEY_NOTES, "");
          notesToast("Cleared ✓");
        });
      }
    }

    scan();
    wireCopy();
    wireSocial();
    wireNotes();

    setTimeout(scan, 600);
    setTimeout(scan, 1600);
  }

  function buildPrefsHTML(){
    var hideR = lsGet(KEY_HIDE_RAFFLEX) === "1";
    return '' +
      '<div class="fcATx">' +
        '<div class="fcATxHead"><div class="fcATxTitle">⚙️ Preferences</div><div class="fcATxPill">Saved</div></div>' +
        '<div class="fcATrow">' +
          '<div class="fcATrowLabel"><b>Hide Rafflex admin bar</b><span>Saved per browser (recommended)</span></div>' +
          '<div class="fcATtoggle '+(hideR ? "is-on":"")+'" data-pref-toggle="rafflex"></div>' +
        '</div>' +
      '</div>' +
      '<div class="fcATx">' +
        '<div class="fcATxHead"><div class="fcATxTitle">🧹 Utilities</div><div class="fcATxPill">Careful</div></div>' +
        '<div class="fcATbtnRow">' +
          '<button class="fcATbtn" type="button" data-pref="reset">🗑️ Reset saved preferences</button>' +
          '<button class="fcATbtn" type="button" data-pref="showRafflex">👁️ Show Rafflex now</button>' +
        '</div>' +
        '<div class="fcATtoast" id="fcATprefToast">Ready.</div>' +
      '</div>';
  }

  function wirePrefs(){
    function ptoast(t){
      var el = document.getElementById("fcATprefToast");
      if(el) el.textContent = t;
    }

    var togg = qs('[data-pref-toggle="rafflex"]');
    if(togg){
      togg.addEventListener("click", function(){
        var on = !togg.classList.contains("is-on");
        togg.classList.toggle("is-on", on);
        lsSet(KEY_HIDE_RAFFLEX, on ? "1":"0");
        hideRafflexBar(on);
        ptoast(on ? "Rafflex hidden ✓" : "Rafflex shown ✓");
      });
    }

    var reset = qs('[data-pref="reset"]');
    if(reset){
      reset.addEventListener("click", function(){
        lsSet(KEY_HIDE_RAFFLEX, "0");
        lsSet(KEY_OPEN, "1");
        lsSet(KEY_TAB, "shortcuts");
        hideRafflexBar(false);
        ptoast("Reset ✓ (refresh if needed)");
        var dock = qs(".fcATdock");
        if(dock && dock.__select) dock.__select.value = "shortcuts";
        renderPanel("shortcuts");
      });
    }

    var showR = qs('[data-pref="showRafflex"]');
    if(showR){
      showR.addEventListener("click", function(){
        lsSet(KEY_HIDE_RAFFLEX, "0");
        hideRafflexBar(false);
        if(togg) togg.classList.remove("is-on");
        ptoast("Rafflex shown ✓");
      });
    }
  }

  function ensure(){
    if(!isDesktop()){
      hideRafflexBar(true);
      return;
    }

    buildDock();
    updatePathPill();

    hideRafflexBar(lsGet(KEY_HIDE_RAFFLEX) === "1");

    var dock = qs(".fcATdock");
    if(dock && dock.__select && dock.__select.value === "competition"){
      setBody(buildCompetitionHTML());
      wireCompetition();
    }
  }

  function hookHistory(){
    if(window.__fcAT_histHooked_v2) return;
    window.__fcAT_histHooked_v2 = true;

    var _push = history.pushState;
    var _rep = history.replaceState;

    history.pushState = function(){
      _push.apply(history, arguments);
      setTimeout(ensure, 60);
    };
    history.replaceState = function(){
      _rep.apply(history, arguments);
      setTimeout(ensure, 60);
    };

    window.addEventListener("popstate", function(){
      setTimeout(ensure, 60);
    });
  }

  function boot(){
    hookHistory();
    ensure();

    var tries = 0, max = 25;
    var t = setInterval(function(){
      tries++;
      ensure();
      if(tries >= max) clearInterval(t);
    }, 220);

    var lastDesktop = isDesktop();
    window.addEventListener("resize", function(){
      var now = isDesktop();
      if(now !== lastDesktop){
        lastDesktop = now;
        setTimeout(ensure, 120);
      }
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  }else{
    boot();
  }
})();
