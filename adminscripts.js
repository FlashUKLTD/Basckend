(function(){
  /* =========================================================
     🔧 EASY CUSTOMISATION — EDIT HERE ONLY
     ========================================================= */
  window.FLASH_EMPLOYEE_MENU = window.FLASH_EMPLOYEE_MENU || {
    desktopMin: 901,
    defaultNewTab: true,

    employeeLinks: [
      { title:"Outlook Mail",     desc:"Inbox (Microsoft 365)", ico:"📧", url:"https://outlook.office.com/mail/" },
      { title:"Outlook Calendar", desc:"Calendar view",         ico:"📅", url:"https://outlook.office.com/calendar/" },
      { title:"Microsoft Teams",  desc:"Chats + meetings",      ico:"💬", url:"https://teams.microsoft.com/" },
      { title:"OneDrive",         desc:"Files & folders",       ico:"☁️", url:"https://onedrive.live.com/" },
      { title:"Microsoft 365",    desc:"Office home",           ico:"🧩", url:"https://www.office.com/" }
    ],

    flashTools: [
      { title:"Live Draw",    desc:"Live Draw", ico:"🎲", url:"https://flashcompetitions.com/i/live-draw-ticket" },
      { title:"Admin Dashboard",     desc:"Admin home",              ico:"🛠️", url:"https://flashcompetitions.com/admin" },
      { title:"Manage Competitions", desc:"Products list",           ico:"🏁", url:"https://flashcompetitions.com/admin/products" },
      { title:"Orders",              desc:"Sales & fulfilment",      ico:"🧾", url:"https://flashcompetitions.com/admin/orders" },
      { title:"Coupons",             desc:"Discount codes",          ico:"🏷️", url:"https://flashcompetitions.com/admin/coupons" }
    ],

    adminGroups: [
      { title:"🏁 Competitions", links:[
        ["Competitions", "/admin/products", "Manage comps", "🏁"],
        ["Categories", "/admin/product-categories", "Organise drops", "🧩"],
        ["Instant Winners", "/admin/instant-winners", "IW prizes", "🎁"],
        ["Winners", "/admin/winners", "Results log", "🏆"],
        ["Draw Number Tool", "https://flashcompetitions.com/i/draw-number", "Public draw number page", "🎲"]
      ]},
      { title:"🛒 Sales", links:[
        ["Orders", "/admin/orders", "Sales & fulfilment", "🧾"],
        ["Coupons", "/admin/coupons", "Discount codes", "🏷️"]
      ]},
      { title:"👥 Users", links:[
        ["Users", "/admin/users", "Accounts & access", "👤"]
      ]},
      { title:"📄 Content", links:[
        ["Dashboard", "/admin", "Admin home", "🛠️"],
        ["Pages", "/admin/pages", "Site pages", "📄"]
      ]},
      { title:"📊 Insights", links:[
        ["Analytics", "/admin/analytics", "Performance", "📈"]
      ]},
      { title:"⚙️ Settings", links:[
        ["General ⚙️", "/admin/settings/general-settings", "Basics", "⚙️"],
        ["Email ✉️", "/admin/settings/email-settings", "Mail templates", "✉️"],
        ["Branding 🎨", "/admin/settings/branding-settings", "Logos & style", "🎨"],
        ["Checkout 🧾", "/admin/settings/checkout-settings", "Payments & flow", "🧾"],
        ["Marketing 📣", "/admin/settings/marketing-settings", "Promos", "📣"],
        ["UX ✨", "/admin/settings/user-experience-settings", "Site feel", "✨"],
        ["SEO 🔎", "/admin/settings/seo-settings", "Search settings", "🔎"],
        ["Advanced 🧠", "/admin/settings/advanced-settings", "Power options", "🧠"],
        ["Integrations 🔌", "/admin/settings/integration-settings", "Connections", "🔌"],
        ["Settings (root)", "/admin/settings", "All settings", "⚙️"]
      ]}
    ]
  };

  var CFG = window.FLASH_EMPLOYEE_MENU;

  /* =========================================================
     Storage keys (v5)
     ========================================================= */
  var KEY_OPEN      = "fcEMP_open_v5";
  var KEY_TAB       = "fcEMP_tab_v5";
  var KEY_NEW_TAB   = "fcEMP_newtab_v5";
  var KEY_PINS      = "fcEMP_pins_v5";
  var KEY_RECENTS   = "fcEMP_recent_v5";
  var KEY_HIDE_BAR  = "fcEMP_hideRafflex_v5";

  var RAFFLEX_BAR_SELECTOR = 'div[wire\\:id][class*="bg-zinc-900"][class*="border-b"]';

  function isDesktop(){ return (window.innerWidth || 0) >= (CFG.desktopMin || 901); }
  function isCompetitionPage(){ return (location.pathname || "").indexOf("/competition/") === 0; }

  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel) || []); }

  function lsGet(k){ try{ return localStorage.getItem(k); }catch(_){ return null; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(_){ } }

  function readJSON(key, fallback){
    try{ var v = lsGet(key); return v ? JSON.parse(v) : fallback; }
    catch(_){ return fallback; }
  }
  function writeJSON(key, obj){
    try{ lsSet(key, JSON.stringify(obj)); }catch(_){}
  }

  function absUrl(href){
    href = href || "";
    if(href.indexOf("http://") === 0 || href.indexOf("https://") === 0) return href;
    return "https://flashcompetitions.com" + (href.charAt(0)==="/" ? href : ("/"+href));
  }

  function hideRafflexBar(shouldHide){
    var bars = qsa(RAFFLEX_BAR_SELECTOR);
    for(var i=0;i<bars.length;i++){
      bars[i].style.display = shouldHide ? "none" : "";
    }
  }

  function getPins(){ return readJSON(KEY_PINS, []); }
  function setPins(arr){ writeJSON(KEY_PINS, (arr||[])); }

  function getRecents(){ return readJSON(KEY_RECENTS, []); }
  function setRecents(arr){ writeJSON(KEY_RECENTS, (arr||[])); }

  function getNewTab(){
    var v = lsGet(KEY_NEW_TAB);
    if(v === null || v === undefined){
      lsSet(KEY_NEW_TAB, (CFG.defaultNewTab ? "1":"0"));
      return !!CFG.defaultNewTab;
    }
    return v === "1";
  }

  function pushRecent(item){
    var r = getRecents();
    var out = [];
    for(var i=0;i<r.length;i++){
      if(r[i] && r[i].url === item.url) continue;
      out.push(r[i]);
    }
    out.unshift({ title:item.title||"Link", url:item.url||"" });
    out = out.slice(0, 8);
    setRecents(out);
  }

  function safeStr(s){ return (s||"").toString(); }
  function norm(s){ return safeStr(s).replace(/\s+/g," ").trim().toLowerCase(); }

  function matchesQuery(item, q){
    if(!q) return true;
    var t = norm(item.title) + " " + norm(item.desc) + " " + norm(item.url);
    return t.indexOf(q) !== -1;
  }

  function getAllLinksFlat(){
    var out = [];
    var emp = CFG.employeeLinks || [];
    for(var i=0;i<emp.length;i++){
      out.push({ title:emp[i].title, desc:emp[i].desc, ico:emp[i].ico, url:emp[i].url });
    }
    var ft = CFG.flashTools || [];
    for(var j=0;j<ft.length;j++){
      out.push({ title:ft[j].title, desc:ft[j].desc, ico:ft[j].ico, url:ft[j].url });
    }
    var groups = CFG.adminGroups || [];
    for(var g=0;g<groups.length;g++){
      var links = groups[g].links || [];
      for(var k=0;k<links.length;k++){
        out.push({
          title: links[k][0],
          desc:  links[k][2],
          ico:   links[k][3] || "🔗",
          url:   absUrl(links[k][1])
        });
      }
    }
    return out;
  }

  function section(title, pill, inner){
    return '' +
      '<div class="fcEMP5-sec">' +
        '<div class="fcEMP5-secHead">' +
          '<div class="fcEMP5-secTitle">'+title+'</div>' +
          '<div class="fcEMP5-secPill">'+pill+'</div>' +
        '</div>' +
        inner +
      '</div>';
  }

  function linkHTML(item, pinned){
    var title = safeStr(item.title || "Link");
    var desc  = safeStr(item.desc || "");
    var ico   = safeStr(item.ico || "🔗");
    var url   = safeStr(item.url || "#");
    var pinClass = pinned ? "fcEMP5-pin is-on" : "fcEMP5-pin";

    return '' +
      '<div class="fcEMP5-link" data-emp-url="'+encodeURIComponent(url)+'" data-emp-title="'+encodeURIComponent(title)+'">' +
        '<div class="fcEMP5-linkTop">' +
          '<div class="fcEMP5-linkMain">' +
            '<div class="fcEMP5-ico">'+ico+'</div>' +
            '<span title="'+title+'">'+title+'</span>' +
          '</div>' +
          '<div class="'+pinClass+'" data-emp-pin="'+encodeURIComponent(url)+'" title="Pin/unpin">📌</div>' +
        '</div>' +
        (desc ? '<small>'+desc+'</small>' : '<small style="opacity:.65;">'+url.replace(/^https?:\/\/(www\.)?/,'')+'</small>') +
      '</div>';
  }

  function getActiveTab(){ return lsGet(KEY_TAB) || "quick"; }
  function setActiveTab(tab){
    var root = qs(".fcEMP5");
    if(!root) return;
    var tabs = qsa(".fcEMP5-tab", root);
    for(var i=0;i<tabs.length;i++){
      tabs[i].classList.toggle("is-active", tabs[i].getAttribute("data-emp-tab") === tab);
    }
  }

  function updateCrumb(){
    var root = qs(".fcEMP5");
    if(!root) return;
    var crumb = qs(".fcEMP5-launchCrumb", root);
    if(crumb) crumb.textContent = "📍 " + (location.pathname || "/");
  }

  function updateToggles(){
    var root = qs(".fcEMP5");
    if(!root) return;
    var nt = getNewTab();
    var hb = (lsGet(KEY_HIDE_BAR) === "1");

    var ntBtn = qs('[data-emp-action="newtab"]', root);
    var hbBtn = qs('[data-emp-action="hidebar"]', root);

    if(ntBtn){
      ntBtn.classList.toggle("is-on", nt);
      ntBtn.setAttribute("title", nt ? "New tab: ON" : "New tab: OFF");
    }
    if(hbBtn){
      hbBtn.classList.toggle("is-on", hb);
      hbBtn.setAttribute("title", hb ? "Admin bar: HIDDEN" : "Admin bar: SHOWN");
    }
  }

  function buildQuick(){
    var root = qs(".fcEMP5");
    var q = "";
    var input = root ? qs(".fcEMP5-input", root) : null;
    if(input) q = norm(input.value || "");

    var pins = getPins();
    var recents = getRecents();
    var all = getAllLinksFlat();

    var pinnedItems = [];
    for(var i=0;i<pins.length;i++){
      for(var j=0;j<all.length;j++){
        if(all[j].url === pins[i]) { pinnedItems.push(all[j]); break; }
      }
    }

    var filteredPinned  = pinnedItems.filter(function(it){ return matchesQuery(it, q); });
    var filteredTools   = (CFG.flashTools||[]).filter(function(it){ return matchesQuery(it, q); });
    var filteredRecents = recents.filter(function(it){ return matchesQuery(it, q); });

    var out = "";

    out += section("📌 Pinned", "Fast access",
      filteredPinned.length
        ? '<div class="fcEMP5-grid">' + filteredPinned.map(function(it){ return linkHTML(it, true); }).join("") + '</div>'
        : '<div class="fcEMP5-muted">Pin your most-used links (📌). They’ll appear here for instant access.</div>'
    );

    out += section("⚡ Flash Quick Tools", "Internal",
      '<div class="fcEMP5-grid">' +
        filteredTools.map(function(it){ return linkHTML(it, pins.indexOf(it.url)!==-1); }).join("") +
      '</div>'
    );

    out += section("🕘 Recents", "Last used",
      filteredRecents.length
        ? '<div class="fcEMP5-grid">' + filteredRecents.map(function(it){ return linkHTML(it, pins.indexOf(it.url)!==-1); }).join("") + '</div>'
        : '<div class="fcEMP5-muted">Your recently opened links will appear here.</div>'
    );

    out += section("💡 How to use", "Tips",
      '<div class="fcEMP5-muted">' +
        '• Search filters everything instantly.<br>' +
        '• Click 📌 to pin favourites.<br>' +
        '• Use the top icons to toggle New tab and Admin bar.' +
      '</div>'
    );

    return out;
  }

  function buildEmployee(){
    var root = qs(".fcEMP5");
    var q = "";
    var input = root ? qs(".fcEMP5-input", root) : null;
    if(input) q = norm(input.value || "");

    var pins = getPins();
    var emp = (CFG.employeeLinks||[]).filter(function(it){ return matchesQuery(it, q); });

    return '' +
      section("👔 Employee Links", "Work",
        '<div class="fcEMP5-grid">' +
          emp.map(function(it){ return linkHTML(it, pins.indexOf(it.url)!==-1); }).join("") +
        '</div>'
      ) +
      section("➕ Add more", "Custom",
        '<div class="fcEMP5-muted">Edit <b>FLASH_EMPLOYEE_MENU.employeeLinks</b> to add Slack, Notion, Stripe, Zendesk, suppliers, anything.</div>'
      );
  }

  function buildAdmin(){
    var root = qs(".fcEMP5");
    var q = "";
    var input = root ? qs(".fcEMP5-input", root) : null;
    if(input) q = norm(input.value || "");

    var pins = getPins();
    var groups = CFG.adminGroups || [];
    var out = '';

    for(var i=0;i<groups.length;i++){
      var g = groups[i];
      var links = [];
      for(var j=0;j<(g.links||[]).length;j++){
        var L = g.links[j];
        var name = L[0], href = L[1], hint = L[2], ico = L[3] || "🔗";
        var item = { title:name, desc:hint, ico:ico, url: absUrl(href) };
        if(matchesQuery(item, q)) links.push(item);
      }
      if(!links.length) continue;

      out += section(g.title, "Admin",
        '<div class="fcEMP5-grid">' +
          links.map(function(it){ return linkHTML(it, pins.indexOf(it.url)!==-1); }).join("") +
        '</div>'
      );
    }

    if(!out){
      out = section("🧭 Admin", "No matches",
        '<div class="fcEMP5-muted">No admin links match your search.</div>'
      );
    }
    return out;
  }

  function buildCompetition(){
    if(!isCompetitionPage()){
      return section("🏁 Competition tools", "Only on /competition/*",
        '<div class="fcEMP5-muted">Open a competition page to see Health + Instant Copy + Social kit + Notes.</div>'
      );
    }

    return '' +
      section("🏁 Competition Health", "Best-effort",
        '<div class="fcEMP5-hRow">' +
          '<span class="fcEMP5-dot" id="fcEMP5dot"></span>' +
          '<div class="fcEMP5-hText">' +
            '<div class="fcEMP5-hMain" id="fcEMP5hMain">Scanning…</div>' +
            '<div class="fcEMP5-hSub" id="fcEMP5hSub">Checking title, price, timers, and CTA visibility.</div>' +
          '</div>' +
        '</div>' +
        '<div class="fcEMP5-grid2" style="margin-top:10px;">' +
          '<div class="fcEMP5-card"><div class="fcEMP5-label">Title</div><div class="fcEMP5-value" id="fcEMP5valTitle">—</div></div>' +
          '<div class="fcEMP5-card"><div class="fcEMP5-label">URL</div><div class="fcEMP5-value" id="fcEMP5valUrl">—</div></div>' +
          '<div class="fcEMP5-card"><div class="fcEMP5-label">Price</div><div class="fcEMP5-value" id="fcEMP5valPrice">—</div></div>' +
          '<div class="fcEMP5-card"><div class="fcEMP5-label">Countdown / End</div><div class="fcEMP5-value" id="fcEMP5valEnd">—</div></div>' +
        '</div>'
      ) +

      section("📋 Instant Copy", "One-click",
        '<div class="fcEMP5-btnRow">' +
          '<button class="fcEMP5-btn" type="button" data-emp-copy="url">🔗 Copy URL</button>' +
          '<button class="fcEMP5-btn" type="button" data-emp-copy="title">🏷️ Copy title</button>' +
          '<button class="fcEMP5-btn" type="button" data-emp-copy="titleurl">✨ Copy title + URL</button>' +
          '<button class="fcEMP5-btn" type="button" data-emp-copy="promo">📣 Copy promo line</button>' +
        '</div>' +
        '<div class="fcEMP5-toast" id="fcEMP5toast">Ready.</div>'
      ) +

      section("📣 Social / IG kit", "Fast content",
        '<div class="fcEMP5-btnRow">' +
          '<button class="fcEMP5-btn" type="button" data-emp-social="ig_titles">🧠 Copy 3 IG titles</button>' +
          '<button class="fcEMP5-btn" type="button" data-emp-social="ig_captions">📝 Copy 3 IG captions</button>' +
          '<button class="fcEMP5-btn" type="button" data-emp-social="ig_story">📲 Copy IG story text</button>' +
          '<button class="fcEMP5-btn" type="button" data-emp-social="share_pack">📦 Copy share pack</button>' +
        '</div>' +
        '<textarea class="fcEMP5-ta" id="fcEMP5socialPreview" placeholder="Click a Social button… preview shows here"></textarea>' +
        '<div class="fcEMP5-toast" id="fcEMP5socialToast">Ready.</div>'
      ) +

      section("🗒️ Quick notes", "Per comp",
        '<textarea class="fcEMP5-ta" id="fcEMP5notes" placeholder="Notes for this competition… (saved automatically)"></textarea>' +
        '<div class="fcEMP5-btnRow" style="margin-top:10px;">' +
          '<button class="fcEMP5-btn" type="button" data-emp-notes="copy">📋 Copy notes</button>' +
          '<button class="fcEMP5-btn" type="button" data-emp-notes="clear">🗑️ Clear notes</button>' +
        '</div>' +
        '<div class="fcEMP5-toast" id="fcEMP5notesToast">Saved.</div>'
      );
  }

  function buildPrefs(){
    var hide = (lsGet(KEY_HIDE_BAR) === "1");
    var nt = getNewTab();
    return '' +
      section("⚙️ Preferences", "Saved",
        '<div class="fcEMP5-sec" style="margin:0; box-shadow:none; background:rgba(0,0,0,.14); border-color:rgba(255,255,255,.10)">' +
          '<div class="fcEMP5-muted" style="margin-bottom:10px;">These settings are saved per browser.</div>' +
          '<div class="fcEMP5-btnRow">' +
            '<button class="fcEMP5-btn" type="button" data-emp-pref="toggleNewTab">'+(nt ? "↗ New tab: ON" : "↗ New tab: OFF")+'</button>' +
            '<button class="fcEMP5-btn" type="button" data-emp-pref="toggleHideBar">'+(hide ? "👁 Admin bar: HIDDEN" : "👁 Admin bar: SHOWN")+'</button>' +
            '<button class="fcEMP5-btn" type="button" data-emp-pref="clearPins">📌 Clear pinned</button>' +
            '<button class="fcEMP5-btn" type="button" data-emp-pref="reset">🗑️ Reset menu data</button>' +
          '</div>' +
          '<div class="fcEMP5-toast" id="fcEMP5prefToast">Ready.</div>' +
        '</div>'
      );
  }

  function render(){
    var root = qs(".fcEMP5");
    if(!root) return;

    var tab = getActiveTab();
    setActiveTab(tab);

    var content = qs(".fcEMP5-content", root);
    if(!content) return;

    var html = "";
    if(tab === "quick") html = buildQuick();
    else if(tab === "employee") html = buildEmployee();
    else if(tab === "admin") html = buildAdmin();
    else if(tab === "competition") html = buildCompetition();
    else html = buildPrefs();

    content.innerHTML = html;

    wireCommonLinks();
    if(tab === "competition") wireCompetitionTools();
    if(tab === "prefs") wirePrefs();
  }

  function wireCommonLinks(){
    var root = qs(".fcEMP5");
    if(!root) return;

    // pin toggle
    var pinEls = qsa("[data-emp-pin]", root);
    for(var i=0;i<pinEls.length;i++){
      pinEls[i].addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        var url = decodeURIComponent(this.getAttribute("data-emp-pin") || "");
        if(!url) return;

        var cur = getPins();
        var idx = cur.indexOf(url);
        if(idx === -1) cur.unshift(url);
        else cur.splice(idx,1);
        cur = cur.slice(0, 20);
        setPins(cur);
        render();
      });
    }

    // click card => open
    var cards = qsa(".fcEMP5-link[data-emp-url]", root);
    for(var j=0;j<cards.length;j++){
      cards[j].addEventListener("click", function(){
        var url = decodeURIComponent(this.getAttribute("data-emp-url") || "");
        var title = decodeURIComponent(this.getAttribute("data-emp-title") || "Link");
        if(!url) return;

        pushRecent({ title:title, url:url });

        var nt = getNewTab();
        try{
          if(nt) window.open(url, "_blank", "noopener");
          else location.href = url;
        }catch(_){
          location.href = url;
        }
        setTimeout(function(){ render(); }, 50);
      });
    }
  }

  function wirePrefs(){
    var root = qs(".fcEMP5");
    if(!root) return;

    function ptoast(t){ var el = document.getElementById("fcEMP5prefToast"); if(el) el.textContent = t; }

    var btns = qsa("[data-emp-pref]", root);
    for(var i=0;i<btns.length;i++){
      btns[i].addEventListener("click", function(){
        var kind = this.getAttribute("data-emp-pref");

        if(kind === "toggleNewTab"){
          var on = !getNewTab();
          lsSet(KEY_NEW_TAB, on ? "1":"0");
          ptoast(on ? "New tab: ON ✓" : "New tab: OFF ✓");
          updateToggles();
          render();
          return;
        }

        if(kind === "toggleHideBar"){
          var current = (lsGet(KEY_HIDE_BAR) === "1");
          var next = !current;
          lsSet(KEY_HIDE_BAR, next ? "1":"0");
          hideRafflexBar(next);
          ptoast(next ? "Admin bar hidden ✓" : "Admin bar shown ✓");
          updateToggles();
          render();
          return;
        }

        if(kind === "clearPins"){
          setPins([]);
          ptoast("Pinned cleared ✓");
          render();
          return;
        }

        if(kind === "reset"){
          lsSet(KEY_OPEN, "1");
          lsSet(KEY_TAB, "quick");
          lsSet(KEY_NEW_TAB, (CFG.defaultNewTab ? "1":"0"));
          setPins([]);
          setRecents([]);
          lsSet(KEY_HIDE_BAR, "0");
          hideRafflexBar(false);
          ptoast("Reset ✓ (menu refreshed)");
          updateToggles();
          render();
          return;
        }
      });
    }
  }

  /* =========================================================
     Competition tools wiring (same behaviour, IDs updated)
     ========================================================= */
  function wireCompetitionTools(){
    if(!isCompetitionPage()) return;

    function toast(msg){ var el = document.getElementById("fcEMP5toast"); if(el) el.textContent = msg; }
    function socialToast(msg){ var el = document.getElementById("fcEMP5socialToast"); if(el) el.textContent = msg; }
    function notesToast(msg){ var el = document.getElementById("fcEMP5notesToast"); if(el) el.textContent = msg; }

    function copyToClipboard(text, cb){
      function done(ok){ if(cb) cb(ok); }
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

    function qs(sel, root){ return (root||document).querySelector(sel); }
    function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel) || []); }

    function getTitle(){
      var h = qs("h1") || qs('[data-testid="competition-title"]') || qs(".competition-title");
      if(h && h.textContent) return h.textContent.trim();
      var t = document.title || "";
      return (t || "").replace(/\\s+\\|\\s+.*$/,"").trim();
    }

    function findPriceText(){
      function norm2(s){ return (s||"").replace(/\\s+/g," ").trim(); }

      function parsePricesFromText(t){
        t = t || "";
        var out = [];
        if(/\\bfree\\s*entry\\b/i.test(t) || /\\bentry\\s*free\\b/i.test(t)) out.push({ kind:"free", label:"Free", pence: 0 });
        var z = t.match(/£\\s?0(?:\\.00)?\\b/);
        if(z) out.push({ kind:"free", label:"Free", pence: 0 });

        var pm;
        var reP = /(?:\\b(\\d{1,3})\\s*p\\b|\\bp\\s?(\\d{1,3})\\b)/ig;
        while((pm = reP.exec(t))){
          var p = parseInt(pm[1] || pm[2], 10);
          if(!isNaN(p) && p >= 1 && p <= 99){
            out.push({ kind:"pence", label: (p + "p"), pence: p });
          }
        }

        var m;
        var re = /£\\s?(\\d{1,4})(?:\\.(\\d{1,2}))?/g;
        while((m = re.exec(t))){
          var pounds = parseInt(m[1], 10);
          var dec = m[2] ? m[2].padEnd(2,"0") : "00";
          var pence = (pounds * 100) + parseInt(dec, 10);
          if(pence === 0) out.push({ kind:"free", label:"Free", pence: 0 });
          else out.push({ kind:"pounds", label: ("£" + pounds + "." + dec), pence: pence });
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
        return /\\bfree\\s*(delivery|shipping|postage|returns?|gift|trial)\\b/i.test(t||"");
      }

      var nodes = qsa("[class*='ticket'],[class*='entry'],[class*='price'],[id*='ticket'],[id*='entry'],[id*='price'],button,a,select,option,label").slice(0, 1600);
      var candidates = [];

      for(var i=0;i<nodes.length;i++){
        var el = nodes[i];
        var t = norm2(el.textContent || "");
        if(!t) continue;
        if(t.length > 180) continue;

        var p = el.parentElement ? norm2(el.parentElement.textContent || "") : "";
        var combined = t + (p && p !== t ? (" • " + p) : "");

        if(!hasEntryContext(combined)) continue;
        if(looksLikeUnrelatedFree(combined)) combined = combined.replace(/\\bfree\\b/ig, "");

        var prices = parsePricesFromText(combined);
        for(var j=0;j<prices.length;j++){
          var score = 100;
          score += Math.max(0, 30 - combined.length/8);
          if(prices[j].kind === "free" && /\\bfree\\s*entry\\b/i.test(combined)) score += 40;
          candidates.push({ score: score, p: prices[j] });
        }
      }

      if(candidates.length){
        var hasExplicitFree = false;
        for(var a=0;a<candidates.length;a++){
          if(candidates[a].p.kind === "free" && candidates[a].score >= 120){ hasExplicitFree = true; break; }
        }
        if(hasExplicitFree) return "Free";

        var min = null;
        for(var b=0;b<candidates.length;b++){
          var pp = candidates[b].p;
          if(pp.kind === "free") continue;
          if(min === null || pp.pence < min.pence) min = pp;
        }
        if(min) return min.label;
        return candidates.sort(function(x,y){ return y.score - x.score; })[0].p.label || "";
      }

      var bodyText = (document.body && document.body.innerText) ? document.body.innerText : "";
      if(/\\bfree\\s*entry\\b/i.test(bodyText) || /\\bentry\\s*free\\b/i.test(bodyText) || /£\\s?0(?:\\.00)?\\b/.test(bodyText)) return "Free";
      var pWhole = bodyText.match(/\\b(\\d{1,2})\\s*p\\b/i);
      if(pWhole){
        var v = parseInt(pWhole[1],10);
        if(!isNaN(v)) return v + "p";
      }
      var mWhole = bodyText.match(/£\\s?\\d+(?:\\.\\d{1,2})?/);
      if(mWhole && mWhole[0]) return mWhole[0].replace(/\\s+/g,"");
      return "";
    }

    function findEndOrCountdown(){
      var timeEl = qs('time[datetime]');
      if(timeEl && timeEl.getAttribute("datetime")) return timeEl.getAttribute("datetime");

      var nodes = qsa("body *").slice(0, 1800);
      for(var i=0;i<nodes.length;i++){
        var t = (nodes[i].textContent||"").trim();
        if(!t) continue;
        if(/\\b\\d+\\s*(Days|Day)\\b/i.test(t) || /\\b\\d+\\s*(Hours|Hour)\\b/i.test(t) || /\\b\\d+\\s*(Minutes|Minute)\\b/i.test(t)){
          if(t.length < 60) return t;
        }
        if(/\\bremaining\\b/i.test(t) && t.length < 80) return t;
      }
      return "";
    }

    function ctaPresent(){
      var nodes = qsa("button, a").slice(0, 220);
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
      var dot = document.getElementById("fcEMP5dot");
      var mainEl = document.getElementById("fcEMP5hMain");
      var subEl = document.getElementById("fcEMP5hSub");
      if(dot){
        dot.classList.remove("ok","warn","bad");
        if(level) dot.classList.add(level);
      }
      if(mainEl) mainEl.textContent = main;
      if(subEl) subEl.textContent = sub;
    }

    function slugFromPath(){
      var p = location.pathname || "";
      var parts = p.split("/").filter(Boolean);
      return parts.length ? parts[parts.length-1] : "";
    }

    function inferPrizeFromTitle(t){
      t = t || "";
      var m = t.match(/£\\s?\\d{1,6}(?:,\\d{3})*(?:\\.\\d{1,2})?/);
      if(m && m[0]) return m[0].replace(/\\s+/g,"");
      return "";
    }

    function inferWinnersFromText(){
      var nodes = qsa("body *").slice(0, 1400);
      for(var i=0;i<nodes.length;i++){
        var tx = (nodes[i].textContent||"").trim();
        if(!tx || tx.length > 80) continue;
        var m = tx.match(/\\b(\\d+)\\s*(x|X)?\\s*winners?\\b/i);
        if(m && m[1]) return m[1];
      }
      return "";
    }

    function buildUtmUrl(base){
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
      var w = winners ? (winners + " WINNERS") : "";

      var igTitles = [
        "⚡ " + (prize ? ("WIN " + prize) : title),
        "LIVE NOW: " + (prize ? prize : title) + (w ? " • " + w : ""),
        "NEW DROP ⚡ " + (prize ? prize : title)
      ];

      var igCaptions = [
        "⚡ " + title + "\\n" + (prize ? ("Prize: " + prize + "\\n") : "") + "Entry: " + price + "\\nEnter here → " + url + "\\n\\n#FlashCompetitions #UKCompetitions",
        "LIVE NOW ⚡ " + title + "\\nEntry from " + price + "\\nTap to enter: " + url + "\\n\\nGood luck 🍀 #FlashCompetitions",
        "DROP ALERT ⚡\\n" + title + "\\n" + (w ? (w + " available!\\n") : "") + "Enter now: " + url + "\\n\\n#Competition #Win"
      ];

      var story =
        "⚡ DROP LIVE\\n" +
        (prize ? ("WIN " + prize + "\\n") : (title + "\\n")) +
        "Entry: " + price + "\\n" +
        "Tap to enter 👆";

      var sharePack =
        "TITLE: " + title + "\\n" +
        "URL: " + url + "\\n" +
        "PRICE: " + price + "\\n" +
        (prize ? ("PRIZE: " + prize + "\\n") : "") +
        (winners ? ("WINNERS: " + winners + "\\n") : "") +
        "PROMO: ⚡ Flash Competitions: " + title + " — " + price + " — Enter now: " + url;

      return {
        ig_titles: igTitles.join("\\n"),
        ig_captions: igCaptions.join("\\n\\n—\\n\\n"),
        ig_story: story,
        share_pack: sharePack,
        utm_url: buildUtmUrl(url)
      };
    }

    function scan(){
      var title = getTitle();
      var url = location.href;
      var price = findPriceText();
      var end = findEndOrCountdown();
      var cta = ctaPresent();

      setText("fcEMP5valTitle", title);
      setText("fcEMP5valUrl", url);
      setText("fcEMP5valPrice", price || "—");
      setText("fcEMP5valEnd", end || "—");

      var missing = [];
      if(!title) missing.push("title");
      if(!price) missing.push("price");
      if(!end) missing.push("timer/end");
      if(!cta) missing.push("CTA");

      if(missing.length === 0) setHealth("ok", "Healthy ✅", "All key signals detected.");
      else if(missing.length <= 2) setHealth("warn", "Looks ok ⚠️", "Missing: " + missing.join(", ") + ".");
      else setHealth("bad", "Needs attention ❗", "Missing: " + missing.join(", ") + ".");

      window.__fcEMP5_compData = { title:title||"", url:url||"", price:price||"", end:end||"" };
    }

    // copy buttons
    var copyBtns = qsa("[data-emp-copy]");
    for(var i=0;i<copyBtns.length;i++){
      copyBtns[i].addEventListener("click", function(){
        var kind = this.getAttribute("data-emp-copy");
        var d = window.__fcEMP5_compData || {};
        var out = "";
        if(kind === "url") out = d.url || location.href;
        if(kind === "title") out = d.title || "";
        if(kind === "titleurl") out = (d.title ? d.title + " — " : "") + (d.url || location.href);
        if(kind === "promo"){
          var p = d.price || "Live now";
          out = "⚡ Flash Competitions: " + (d.title || "Competition") + " — " + p + " — Enter now: " + (d.url || location.href);
        }
        if(!out) out = location.href;
        copyToClipboard(out, function(ok){ toast(ok ? "Copied ✓" : "Copy failed"); });
      });
    }

    // social buttons
    var preview = document.getElementById("fcEMP5socialPreview");
    var socialBtns = qsa("[data-emp-social]");
    for(var s=0;s<socialBtns.length;s++){
      socialBtns[s].addEventListener("click", function(){
        var kind = this.getAttribute("data-emp-social");
        var d = window.__fcEMP5_compData || {};
        var pack = socialPack(d);
        var out = pack[kind] || ((d.title||"") + "\\n" + (d.url||location.href));
        if(preview) preview.value = out;
        copyToClipboard(out, function(ok){ socialToast(ok ? "Copied ✓ (preview updated)" : "Copy failed"); });
      });
    }

    // notes
    var notes = document.getElementById("fcEMP5notes");
    if(notes){
      var slug = slugFromPath() || location.pathname;
      var KEY_NOTES = "fcEMP_notes_v1:" + slug;

      try{ notes.value = lsGet(KEY_NOTES) || ""; }catch(_){}

      var saveTimer = null;
      notes.addEventListener("input", function(){
        if(saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(function(){
          lsSet(KEY_NOTES, notes.value || "");
          notesToast("Saved ✓");
        }, 250);
      });

      var copyN = qs('[data-emp-notes="copy"]');
      if(copyN){
        copyN.addEventListener("click", function(){
          copyToClipboard(notes.value || "", function(ok){ notesToast(ok ? "Notes copied ✓" : "Copy failed"); });
        });
      }
      var clearN = qs('[data-emp-notes="clear"]');
      if(clearN){
        clearN.addEventListener("click", function(){
          notes.value = "";
          lsSet(KEY_NOTES, "");
          notesToast("Cleared ✓");
        });
      }
    }

    scan();
    setTimeout(scan, 600);
    setTimeout(scan, 1600);
  }

  function buildUI(){
    if(qs(".fcEMP5")) return;

    var root = document.createElement("div");
    root.className = "fcEMP5";
    root.innerHTML =
      '<div class="fcEMP5-backdrop" data-emp-close="1"></div>' +

      '<div class="fcEMP5-drawer" aria-label="Employee Hub Drawer">' +
        '<div class="fcEMP5-head">' +
          '<div class="fcEMP5-brand">' +
            '<div class="fcEMP5-launchIco">⚡</div>' +
            '<div style="min-width:0;">' +
              '<b>Flash — Employee Hub</b>' +
              '<small title="Current page">Current: '+(location.pathname||"/")+'</small>' +
            '</div>' +
          '</div>' +
          '<div class="fcEMP5-actions">' +
            '<div class="fcEMP5-iconBtn" data-emp-action="newtab" title="New tab toggle">↗</div>' +
            '<div class="fcEMP5-iconBtn" data-emp-action="hidebar" title="Admin bar toggle">👁</div>' +
            '<div class="fcEMP5-close" data-emp-close="1" title="Close">✕</div>' +
          '</div>' +
        '</div>' +

        '<div class="fcEMP5-search">' +
          '<input class="fcEMP5-input" type="text" placeholder="Search links… (outlook, orders, coupons)">' +
          '<div class="fcEMP5-chip" data-emp-action="clear" title="Clear search">✕</div>' +
        '</div>' +

        '<div class="fcEMP5-main">' +
          '<div class="fcEMP5-rail">' +
            '<div class="fcEMP5-tab" data-emp-tab="quick" data-tip="Quick">✨</div>' +
            '<div class="fcEMP5-tab" data-emp-tab="employee" data-tip="Employee">👔</div>' +
            '<div class="fcEMP5-tab" data-emp-tab="admin" data-tip="Admin">🧭</div>' +
            '<div class="fcEMP5-tab" data-emp-tab="competition" data-tip="Competition">🏁</div>' +
            '<div style="flex:1;"></div>' +
            '<div class="fcEMP5-tab" data-emp-tab="prefs" data-tip="Prefs">⚙️</div>' +
          '</div>' +
          '<div class="fcEMP5-content"></div>' +
        '</div>' +
      '</div>' +

      '<div class="fcEMP5-launch" aria-label="Open employee hub">' +
        '<div class="fcEMP5-launchIco">⚙️</div>' +
        '<div class="fcEMP5-launchTxt">' +
          '<b>Employee Menu</b>' +
          '<span>Quick tools • Links • Admin</span>' +
        '</div>' +
        '<span class="fcEMP5-launchCrumb" title="Current page">📍 '+(location.pathname||"/")+'</span>' +
        '<span class="fcEMP5-launchChevron">▴</span>' +
      '</div>';

    document.body.appendChild(root);

    // open state
    var open = (lsGet(KEY_OPEN) === "1");
    setOpen(open);

    // set tab
    var tab = getActiveTab();
    setActiveTab(tab);

    // handlers
    var launch = qs(".fcEMP5-launch", root);
    var drawer = qs(".fcEMP5-drawer", root);
    var backdrop = qs(".fcEMP5-backdrop", root);
    var chev = qs(".fcEMP5-launchChevron", root);
    var input = qs(".fcEMP5-input", root);

    function setChevron(isOpen){ if(chev) chev.textContent = isOpen ? "▾" : "▴"; }

    function setOpen(isOpen){
      var d = qs(".fcEMP5-drawer", root);
      var b = qs(".fcEMP5-backdrop", root);
      if(d) d.classList.toggle("is-open", !!isOpen);
      if(b) b.classList.toggle("is-open", !!isOpen);
      setChevron(!!isOpen);
      lsSet(KEY_OPEN, isOpen ? "1" : "0");
      if(isOpen){
        updateToggles();
        render();
        setTimeout(function(){ if(input) input.focus(); }, 50);
      }
    }

    // expose for internal use
    root.__setOpen = setOpen;

    if(launch){
      launch.addEventListener("click", function(){
        var nowOpen = !(drawer && drawer.classList.contains("is-open"));
        setOpen(nowOpen);
      });
    }

    // close click
    var closeEls = qsa("[data-emp-close]", root);
    for(var i=0;i<closeEls.length;i++){
      closeEls[i].addEventListener("click", function(e){
        e.stopPropagation();
        setOpen(false);
      });
    }

    // esc
    window.addEventListener("keydown", function(e){
      if(e && e.key === "Escape"){
        if(drawer && drawer.classList.contains("is-open")) setOpen(false);
      }
    });

    // tabs
    var tabs = qsa(".fcEMP5-tab", root);
    for(var t=0;t<tabs.length;t++){
      tabs[t].addEventListener("click", function(){
        var id = this.getAttribute("data-emp-tab");
        if(!id) return;
        lsSet(KEY_TAB, id);
        setActiveTab(id);
        render();
      });
    }

    // search
    if(input){
      input.addEventListener("input", function(){ render(); });
    }

    // actions
    var acts = qsa("[data-emp-action]", root);
    for(var a=0;a<acts.length;a++){
      acts[a].addEventListener("click", function(e){
        e.stopPropagation();
        var kind = this.getAttribute("data-emp-action");

        if(kind === "clear"){
          if(input) input.value = "";
          render();
          return;
        }

        if(kind === "newtab"){
          var on = !getNewTab();
          lsSet(KEY_NEW_TAB, on ? "1":"0");
          updateToggles();
          return;
        }

        if(kind === "hidebar"){
          var current = (lsGet(KEY_HIDE_BAR) === "1");
          var next = !current;
          lsSet(KEY_HIDE_BAR, next ? "1":"0");
          hideRafflexBar(next);
          updateToggles();
          return;
        }
      });
    }

    updateToggles();
    render();
  }

  function setOpen(state){
    var root = qs(".fcEMP5");
    if(root && root.__setOpen) root.__setOpen(!!state);
  }

  function ensure(){
    // Desktop-only: remove UI on mobile sizes
    var existing = qs(".fcEMP5");
    if(!isDesktop()){
      if(existing) existing.remove();
      return;
    }

    buildUI();
    updateCrumb();
    hideRafflexBar(lsGet(KEY_HIDE_BAR) === "1");

    // If we are on competition tab, refresh on SPA route changes
    if(getActiveTab() === "competition"){
      render();
    }
  }

  function hookHistory(){
    if(window.__fcEMP_histHooked_v5) return;
    window.__fcEMP_histHooked_v5 = true;

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
