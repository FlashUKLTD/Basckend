(function(){
  /* =========================================================
     🔧 EASY CUSTOMISATION — EDIT HERE ONLY
     ========================================================= */
  window.FLASH_EMPLOYEE_MENU = window.FLASH_EMPLOYEE_MENU || {
    /* Show only on desktop */
    desktopMin: 901,

    /* When you click links, open in new tab by default? (user can toggle in UI) */
    defaultNewTab: true,

    /* Employee tools (edit/add) */
    employeeLinks: [
      { title:"Outlook Mail",    desc:"Inbox (Microsoft 365)", ico:"📧", url:"https://outlook.office.com/mail/" },
      { title:"Outlook Calendar",desc:"Calendar view",         ico:"📅", url:"https://outlook.office.com/calendar/" },
      { title:"OneDrive",        desc:"Files & folders",       ico:"☁️", url:"https://onedrive.live.com/" },
      { title:"Microsoft 365",   desc:"Office home",           ico:"🧩", url:"https://www.office.com/" }
      // Add more: Notion/Slack/Docs/Drive/Zendesk/Stripe/etc
    ],

    /* Internal Flash quick tools */
    flashTools: [
      { title:"Draw Number Tool", desc:"Public draw number page", ico:"🎲", url:"https://flashcompetitions.com/i/draw-number" },
      { title:"Admin Dashboard",  desc:"Admin home",               ico:"🛠️", url:"https://flashcompetitions.com/admin" },
      { title:"Manage Competitions", desc:"Products list",         ico:"🏁", url:"https://flashcompetitions.com/admin/products" },
      { title:"Orders",           desc:"Sales & fulfilment",       ico:"🧾", url:"https://flashcompetitions.com/admin/orders" },
      { title:"Coupons",          desc:"Discount codes",           ico:"🏷️", url:"https://flashcompetitions.com/admin/coupons" }
    ],

    /* Admin navigation groups (keeps your original structure) */
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
     Core
     ========================================================= */
  var KEY_OPEN = "fcEMP_open_v4";
  var KEY_TAB  = "fcEMP_tab_v4";
  var KEY_NEW_TAB = "fcEMP_newtab_v4";
  var KEY_PINS = "fcEMP_pins_v4";
  var KEY_RECENTS = "fcEMP_recent_v4";
  var KEY_HIDE_RAFFLEX = "fcEMP_hideRafflex_v4";

  var RAFFLEX_BAR_SELECTOR = 'div[wire\\:id][class*="bg-zinc-900"][class*="border-b"]';

  function isDesktop(){ return (window.innerWidth || 0) >= (CFG.desktopMin || 901); }
  function isCompetitionPage(){ return (location.pathname || "").indexOf("/competition/") === 0; }

  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel) || []); }

  function lsGet(k){ try{ return localStorage.getItem(k); }catch(_){ return null; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(_){ } }

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

  function readJSON(key, fallback){
    try{
      var v = lsGet(key);
      if(!v) return fallback;
      return JSON.parse(v);
    }catch(_){ return fallback; }
  }
  function writeJSON(key, obj){
    try{ lsSet(key, JSON.stringify(obj)); }catch(_){}
  }

  function getPins(){ return readJSON(KEY_PINS, []); }
  function setPins(arr){ writeJSON(KEY_PINS, arr || []); }

  function getRecents(){ return readJSON(KEY_RECENTS, []); }
  function setRecents(arr){ writeJSON(KEY_RECENTS, arr || []); }

  function getNewTab(){
    var v = lsGet(KEY_NEW_TAB);
    if(v === null || v === undefined){
      lsSet(KEY_NEW_TAB, (CFG.defaultNewTab ? "1":"0"));
      return !!CFG.defaultNewTab;
    }
    return v === "1";
  }

  function pushRecent(item){
    // item: {title,url}
    var r = getRecents();
    // remove dup by url
    var out = [];
    for(var i=0;i<r.length;i++){
      if(r[i] && r[i].url === item.url) continue;
      out.push(r[i]);
    }
    out.unshift({ title:item.title||"Link", url:item.url||"" });
    out = out.slice(0, 8);
    setRecents(out);
  }

  function buildDock(){
    if(qs(".fcEMPdock")) return;

    var dock = document.createElement("div");
    dock.className = "fcEMPdock";
    dock.innerHTML =
      '<div class="fcEMPpill" aria-label="Open employee menu">' +
        '<div class="fcEMPleft">' +
          '<div class="fcEMPbadge">⚙️</div>' +
          '<div class="fcEMPtitle">' +
            '<b>Employee Menu</b>' +
            '<span class="fcEMPsub">Quick tools • Links • Admin</span>' +
          '</div>' +
        '</div>' +
        '<div class="fcEMPr">' +
          '<span class="fcEMPcrumb" title="Current page">📍 '+(location.pathname||"/")+'</span>' +
          '<span class="fcEMPchev">▴</span>' +
        '</div>' +
      '</div>' +

      '<div class="fcEMPwrap">' +
        '<div class="fcEMPpanel">' +
          '<div class="fcEMPhead">' +
            '<div class="fcEMPtopRow">' +
              '<div class="fcEMPpanelTitle">⚡ Flash — Employee Hub</div>' +
              '<div class="fcEMPmini">' +
                '<div class="fcEMPchip" data-emp-action="newtab">↗ New tab</div>' +
                '<div class="fcEMPchip" data-emp-action="hidebar">👁 Hide admin bar</div>' +
              '</div>' +
            '</div>' +
            '<div class="fcEMPsearch">' +
              '<input class="fcEMPinput" type="text" placeholder="Search links… (e.g. outlook, orders, coupons)">' +
              '<div class="fcEMPchip" data-emp-action="clear">✕</div>' +
            '</div>' +
            '<div class="fcEMPtabs">' +
              '<div class="fcEMPtab" data-emp-tab="quick">✨ Quick</div>' +
              '<div class="fcEMPtab" data-emp-tab="employee">👔 Employee</div>' +
              '<div class="fcEMPtab" data-emp-tab="admin">🧭 Admin</div>' +
              '<div class="fcEMPtab" data-emp-tab="competition">🏁 Competition</div>' +
              '<div class="fcEMPtab" data-emp-tab="prefs">⚙️ Preferences</div>' +
            '</div>' +
          '</div>' +
          '<div class="fcEMPbody"></div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(dock);

    dock.__wrap = qs(".fcEMPwrap", dock);
    dock.__chev = qs(".fcEMPchev", dock);
    dock.__crumb = qs(".fcEMPcrumb", dock);
    dock.__body = qs(".fcEMPbody", dock);
    dock.__input = qs(".fcEMPinput", dock);

    // open state
    var open = lsGet(KEY_OPEN) === "1";
    if(dock.__wrap) dock.__wrap.classList.toggle("is-open", open);
    if(dock.__chev) dock.__chev.textContent = open ? "▾" : "▴";

    // tab state
    var savedTab = lsGet(KEY_TAB) || "quick";
    setActiveTab(savedTab);

    // chips state
    updateTopChips();

    // click open/close
    var pill = qs(".fcEMPpill", dock);
    if(pill){
      pill.addEventListener("click", function(){
        var nowOpen = !(dock.__wrap && dock.__wrap.classList.contains("is-open"));
        if(dock.__wrap) dock.__wrap.classList.toggle("is-open", nowOpen);
        if(dock.__chev) dock.__chev.textContent = nowOpen ? "▾" : "▴";
        lsSet(KEY_OPEN, nowOpen ? "1" : "0");
      });
    }

    // tab clicks
    var tabs = qsa(".fcEMPtab", dock);
    for(var i=0;i<tabs.length;i++){
      tabs[i].addEventListener("click", function(e){
        e.stopPropagation();
        var t = this.getAttribute("data-emp-tab");
        if(!t) return;
        lsSet(KEY_TAB, t);
        setActiveTab(t);
        render();
      });
    }

    // search input
    if(dock.__input){
      dock.__input.addEventListener("input", function(){
        render();
      });
    }

    // action chips
    var act = qsa("[data-emp-action]", dock);
    for(var j=0;j<act.length;j++){
      act[j].addEventListener("click", function(e){
        e.stopPropagation();
        var kind = this.getAttribute("data-emp-action");
        if(kind === "clear"){
          if(dock.__input) dock.__input.value = "";
          render();
          return;
        }
        if(kind === "newtab"){
          var on = !getNewTab();
          lsSet(KEY_NEW_TAB, on ? "1":"0");
          updateTopChips();
          return;
        }
        if(kind === "hidebar"){
          var current = (lsGet(KEY_HIDE_RAFFLEX) === "1");
          var next = !current;
          lsSet(KEY_HIDE_RAFFLEX, next ? "1":"0");
          hideRafflexBar(next);
          updateTopChips();
          return;
        }
      });
    }

    render();
  }

  function updateTopChips(){
    var dock = qs(".fcEMPdock");
    if(!dock) return;

    var newTabChip = qs('[data-emp-action="newtab"]', dock);
    var hideChip = qs('[data-emp-action="hidebar"]', dock);

    var nt = getNewTab();
    if(newTabChip){
      newTabChip.classList.toggle("is-on", nt);
      newTabChip.textContent = nt ? "↗ New tab: ON" : "↗ New tab: OFF";
    }

    var hide = (lsGet(KEY_HIDE_RAFFLEX) === "1");
    if(hideChip){
      hideChip.classList.toggle("is-on", hide);
      hideChip.textContent = hide ? "👁 Admin bar: HIDDEN" : "👁 Admin bar: SHOWN";
    }
  }

  function setActiveTab(tab){
    var dock = qs(".fcEMPdock");
    if(!dock) return;
    var tabs = qsa(".fcEMPtab", dock);
    for(var i=0;i<tabs.length;i++){
      tabs[i].classList.toggle("is-active", tabs[i].getAttribute("data-emp-tab") === tab);
    }
  }

  function getActiveTab(){
    return lsGet(KEY_TAB) || "quick";
  }

  function updateCrumb(){
    var dock = qs(".fcEMPdock");
    if(!dock || !dock.__crumb) return;
    dock.__crumb.textContent = "📍 " + (location.pathname || "/");
  }

  function safeStr(s){ return (s||"").toString(); }
  function norm(s){ return safeStr(s).replace(/\s+/g," ").trim().toLowerCase(); }

  function matchesQuery(item, q){
    if(!q) return true;
    var t = norm(item.title) + " " + norm(item.desc) + " " + norm(item.url);
    return t.indexOf(q) !== -1;
  }

  function linkHTML(item, pinned){
    var title = safeStr(item.title || "Link");
    var desc  = safeStr(item.desc || "");
    var ico   = safeStr(item.ico || "🔗");
    var url   = safeStr(item.url || "#");

    var pinClass = pinned ? "fcEMPpin is-on" : "fcEMPpin";
    return '' +
      '<div class="fcEMPlink" data-emp-url="'+encodeURIComponent(url)+'" data-emp-title="'+encodeURIComponent(title)+'">' +
        '<div class="fcEMPlinkTop">' +
          '<div class="fcEMPlinkMain">' +
            '<div class="fcEMPico">'+ico+'</div>' +
            '<span title="'+title+'">'+title+'</span>' +
          '</div>' +
          '<div class="'+pinClass+'" data-emp-pin="'+encodeURIComponent(url)+'" title="Pin/unpin">📌</div>' +
        '</div>' +
        (desc ? '<small>'+desc+'</small>' : '<small style="opacity:.65;">'+url.replace(/^https?:\/\/(www\.)?/,'')+'</small>') +
      '</div>';
  }

  function section(title, pill, inner){
    return '' +
      '<div class="fcEMPsec">' +
        '<div class="fcEMPsecHead">' +
          '<div class="fcEMPsecTitle">'+title+'</div>' +
          '<div class="fcEMPsecPill">'+pill+'</div>' +
        '</div>' +
        inner +
      '</div>';
  }

  function buildQuick(){
    var q = "";
    var dock = qs(".fcEMPdock");
    if(dock && dock.__input) q = norm(dock.__input.value || "");

    var pins = getPins();
    var recents = getRecents();

    // Build pinned objects by searching in all known link sets
    var all = getAllLinksFlat();
    var pinnedItems = [];
    for(var i=0;i<pins.length;i++){
      for(var j=0;j<all.length;j++){
        if(all[j].url === pins[i]) { pinnedItems.push(all[j]); break; }
      }
    }

    // Filter by search query
    var filteredPinned = pinnedItems.filter(function(it){ return matchesQuery(it, q); });
    var filteredTools  = (CFG.flashTools||[]).filter(function(it){ return matchesQuery(it, q); });
    var filteredRecents= recents.filter(function(it){ return matchesQuery(it, q); });

    var out = "";

    // Pinned first
    var pinInner = filteredPinned.length
      ? '<div class="fcEMPgrid">' + filteredPinned.map(function(it){ return linkHTML(it, true); }).join("") + '</div>'
      : '<div class="fcEMPmuted">Pin your most-used links (📌). They’ll appear here for instant access.</div>';
    out += section("📌 Pinned", "Fast access", pinInner);

    // Flash tools
    out += section("⚡ Flash Quick Tools", "Internal", '<div class="fcEMPgrid">' +
      filteredTools.map(function(it){ return linkHTML(it, pins.indexOf(it.url)!==-1); }).join("") +
    '</div>');

    // Recents
    var recInner = filteredRecents.length
      ? '<div class="fcEMPgrid">' + filteredRecents.map(function(it){ return linkHTML(it, pins.indexOf(it.url)!==-1); }).join("") + '</div>'
      : '<div class="fcEMPmuted">Your recently opened links will appear here.</div>';
    out += section("🕘 Recents", "Last used", recInner);

    // Tiny helper
    out += section("💡 How to use", "Tips",
      '<div class="fcEMPmuted">' +
        '• Use search to filter everything instantly.<br>' +
        '• Click 📌 to pin favourites.<br>' +
        '• Toggle “New tab” at the top to keep your admin session safe while opening tools.' +
      '</div>'
    );

    return out;
  }

  function buildEmployee(){
    var q = "";
    var dock = qs(".fcEMPdock");
    if(dock && dock.__input) q = norm(dock.__input.value || "");
    var pins = getPins();

    var emp = (CFG.employeeLinks||[]).filter(function(it){ return matchesQuery(it, q); });

    return '' +
      section("👔 Employee Links", "Work", '<div class="fcEMPgrid">' +
        emp.map(function(it){ return linkHTML(it, pins.indexOf(it.url)!==-1); }).join("") +
      '</div>') +

      section("➕ Add more", "Custom",
        '<div class="fcEMPmuted">You can add Slack, Notion, Stripe, Zendesk, Docs, Drive, Suppliers, anything — edit <b>FLASH_EMPLOYEE_MENU.employeeLinks</b>.</div>'
      );
  }

  function buildAdmin(){
    var q = "";
    var dock = qs(".fcEMPdock");
    if(dock && dock.__input) q = norm(dock.__input.value || "");
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
        '<div class="fcEMPgrid">' +
          links.map(function(it){ return linkHTML(it, pins.indexOf(it.url)!==-1); }).join("") +
        '</div>'
      );
    }

    if(!out){
      out = section("🧭 Admin", "No matches",
        '<div class="fcEMPmuted">No admin links match your search.</div>'
      );
    }

    return out;
  }

  /* =========================
     Competition Tools (kept, cleaned)
     ========================= */
  function buildCompetition(){
    if(!isCompetitionPage()){
      return section("🏁 Competition tools", "Only on /competition/*",
        '<div class="fcEMPmuted">Open a competition page to see Health + Instant Copy + Social kit + Notes.</div>'
      );
    }

    return '' +
      section("🏁 Competition Health", "Best-effort",
        '<div class="fcEMPhRow">' +
          '<span class="fcEMPdot" id="fcEMPdot"></span>' +
          '<div class="fcEMPhText">' +
            '<div class="fcEMPhMain" id="fcEMPhMain">Scanning…</div>' +
            '<div class="fcEMPhSub" id="fcEMPhSub">Checking title, price, timers, and CTA visibility.</div>' +
          '</div>' +
        '</div>' +
        '<div class="fcEMPgrid2" style="margin-top:10px;">' +
          '<div class="fcEMPcard"><div class="fcEMPlabel">Title</div><div class="fcEMPvalue" id="fcEMPvalTitle">—</div></div>' +
          '<div class="fcEMPcard"><div class="fcEMPlabel">URL</div><div class="fcEMPvalue" id="fcEMPvalUrl">—</div></div>' +
          '<div class="fcEMPcard"><div class="fcEMPlabel">Price</div><div class="fcEMPvalue" id="fcEMPvalPrice">—</div></div>' +
          '<div class="fcEMPcard"><div class="fcEMPlabel">Countdown / End</div><div class="fcEMPvalue" id="fcEMPvalEnd">—</div></div>' +
        '</div>'
      ) +

      section("📋 Instant Copy", "One-click",
        '<div class="fcEMPbtnRow">' +
          '<button class="fcEMPbtn" type="button" data-emp-copy="url">🔗 Copy URL</button>' +
          '<button class="fcEMPbtn" type="button" data-emp-copy="title">🏷️ Copy title</button>' +
          '<button class="fcEMPbtn" type="button" data-emp-copy="titleurl">✨ Copy title + URL</button>' +
          '<button class="fcEMPbtn" type="button" data-emp-copy="promo">📣 Copy promo line</button>' +
        '</div>' +
        '<div class="fcEMPtoast" id="fcEMPtoast">Ready.</div>'
      ) +

      section("📣 Social / IG kit", "Fast content",
        '<div class="fcEMPbtnRow">' +
          '<button class="fcEMPbtn" type="button" data-emp-social="ig_titles">🧠 Copy 3 IG titles</button>' +
          '<button class="fcEMPbtn" type="button" data-emp-social="ig_captions">📝 Copy 3 IG captions</button>' +
          '<button class="fcEMPbtn" type="button" data-emp-social="ig_story">📲 Copy IG story text</button>' +
          '<button class="fcEMPbtn" type="button" data-emp-social="share_pack">📦 Copy share pack</button>' +
        '</div>' +
        '<textarea class="fcEMPta" id="fcEMPsocialPreview" placeholder="Click a Social button… preview shows here"></textarea>' +
        '<div class="fcEMPtoast" id="fcEMPsocialToast">Ready.</div>'
      ) +

      section("🗒️ Quick notes", "Per comp",
        '<textarea class="fcEMPta" id="fcEMPnotes" placeholder="Notes for this competition… (saved automatically)"></textarea>' +
        '<div class="fcEMPbtnRow" style="margin-top:10px;">' +
          '<button class="fcEMPbtn" type="button" data-emp-notes="copy">📋 Copy notes</button>' +
          '<button class="fcEMPbtn" type="button" data-emp-notes="clear">🗑️ Clear notes</button>' +
        '</div>' +
        '<div class="fcEMPtoast" id="fcEMPnotesToast">Saved.</div>'
      );
  }

  /* =========================
     Preferences
     ========================= */
  function buildPrefs(){
    var hide = (lsGet(KEY_HIDE_RAFFLEX) === "1");
    var nt = getNewTab();

    return '' +
      section("⚙️ Preferences", "Saved",
        '<div class="fcEMPsec" style="margin:0; box-shadow:none; background:rgba(0,0,0,.14); border-color:rgba(255,255,255,.10)">' +
          '<div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">' +
            '<div>' +
              '<div style="font-weight:980; font-size:12.5px;">New tabs for links</div>' +
              '<div class="fcEMPmuted" style="margin-top:3px;">Keeps your admin session safe while opening tools.</div>' +
            '</div>' +
            '<div class="fcEMPtoggle '+(nt ? "is-on":"")+'" data-emp-pref="newtab"></div>' +
          '</div>' +
          '<div style="height:10px;"></div>' +
          '<div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">' +
            '<div>' +
              '<div style="font-weight:980; font-size:12.5px;">Hide Rafflex admin bar</div>' +
              '<div class="fcEMPmuted" style="margin-top:3px;">Saved per browser.</div>' +
            '</div>' +
            '<div class="fcEMPtoggle '+(hide ? "is-on":"")+'" data-emp-pref="hidebar"></div>' +
          '</div>' +
        '</div>' +
        '<div class="fcEMPbtnRow" style="margin-top:10px;">' +
          '<button class="fcEMPbtn" type="button" data-emp-pref="reset">🗑️ Reset menu data</button>' +
          '<button class="fcEMPbtn" type="button" data-emp-pref="clearPins">📌 Clear pinned</button>' +
        '</div>' +
        '<div class="fcEMPtoast" id="fcEMPprefToast">Ready.</div>'
      );
  }

  function getAllLinksFlat(){
    var out = [];

    // employee
    var emp = CFG.employeeLinks || [];
    for(var i=0;i<emp.length;i++){
      out.push({ title:emp[i].title, desc:emp[i].desc, ico:emp[i].ico, url:emp[i].url });
    }

    // flash tools
    var ft = CFG.flashTools || [];
    for(var j=0;j<ft.length;j++){
      out.push({ title:ft[j].title, desc:ft[j].desc, ico:ft[j].ico, url:ft[j].url });
    }

    // admin groups
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

  function render(){
    var dock = qs(".fcEMPdock");
    if(!dock || !dock.__body) return;

    var tab = getActiveTab();
    setActiveTab(tab);

    var html = "";
    if(tab === "quick") html = buildQuick();
    else if(tab === "employee") html = buildEmployee();
    else if(tab === "admin") html = buildAdmin();
    else if(tab === "competition") html = buildCompetition();
    else html = buildPrefs();

    dock.__body.innerHTML = html;

    wireCommonLinks();
    if(tab === "competition") wireCompetitionTools();
    if(tab === "prefs") wirePrefs();
  }

  function wireCommonLinks(){
    var dock = qs(".fcEMPdock");
    if(!dock) return;

    var pins = getPins();
    var pinEls = qsa("[data-emp-pin]", dock);

    // pin toggle
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

    // click entire card => open
    var cards = qsa(".fcEMPlink[data-emp-url]", dock);
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
        // refresh recents UI quickly
        setTimeout(function(){ render(); }, 50);
      });
    }
  }

  /* =========================
     Competition Tool wiring (kept behaviour)
     ========================= */
  function wireCompetitionTools(){
    if(!isCompetitionPage()) return;

    function toast(msg){ var el = document.getElementById("fcEMPtoast"); if(el) el.textContent = msg; }
    function socialToast(msg){ var el = document.getElementById("fcEMPsocialToast"); if(el) el.textContent = msg; }
    function notesToast(msg){ var el = document.getElementById("fcEMPnotesToast"); if(el) el.textContent = msg; }

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
      return (t || "").replace(/\s+\|\s+.*$/,"").trim();
    }

    function findPriceText(){
      function norm2(s){ return (s||"").replace(/\s+/g," ").trim(); }

      function parsePricesFromText(t){
        t = t || "";
        var out = [];
        if(/\bfree\s*entry\b/i.test(t) || /\bentry\s*free\b/i.test(t)) out.push({ kind:"free", label:"Free", pence: 0 });
        var z = t.match(/£\s?0(?:\.00)?\b/);
        if(z) out.push({ kind:"free", label:"Free", pence: 0 });

        var pm;
        var reP = /(?:\b(\d{1,3})\s*p\b|\bp\s?(\d{1,3})\b)/ig;
        while((pm = reP.exec(t))){
          var p = parseInt(pm[1] || pm[2], 10);
          if(!isNaN(p) && p >= 1 && p <= 99){
            out.push({ kind:"pence", label: (p + "p"), pence: p });
          }
        }

        var m;
        var re = /£\s?(\d{1,4})(?:\.(\d{1,2}))?/g;
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
        return /\bfree\s*(delivery|shipping|postage|returns?|gift|trial)\b/i.test(t||"");
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
        if(looksLikeUnrelatedFree(combined)) combined = combined.replace(/\bfree\b/ig, "");

        var prices = parsePricesFromText(combined);
        for(var j=0;j<prices.length;j++){
          var score = 100;
          score += Math.max(0, 30 - combined.length/8);
          if(prices[j].kind === "free" && /\bfree\s*entry\b/i.test(combined)) score += 40;
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
      var dot = document.getElementById("fcEMPdot");
      var mainEl = document.getElementById("fcEMPhMain");
      var subEl = document.getElementById("fcEMPhSub");
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
      var m = t.match(/£\s?\d{1,6}(?:,\d{3})*(?:\.\d{1,2})?/);
      if(m && m[0]) return m[0].replace(/\s+/g,"");
      return "";
    }

    function inferWinnersFromText(){
      var nodes = qsa("body *").slice(0, 1400);
      for(var i=0;i<nodes.length;i++){
        var tx = (nodes[i].textContent||"").trim();
        if(!tx || tx.length > 80) continue;
        var m = tx.match(/\b(\d+)\s*(x|X)?\s*winners?\b/i);
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
        utm_url: buildUtmUrl(url)
      };
    }

    function scan(){
      var title = getTitle();
      var url = location.href;
      var price = findPriceText();
      var end = findEndOrCountdown();
      var cta = ctaPresent();

      setText("fcEMPvalTitle", title);
      setText("fcEMPvalUrl", url);
      setText("fcEMPvalPrice", price || "—");
      setText("fcEMPvalEnd", end || "—");

      var missing = [];
      if(!title) missing.push("title");
      if(!price) missing.push("price");
      if(!end) missing.push("timer/end");
      if(!cta) missing.push("CTA");

      if(missing.length === 0) setHealth("ok", "Healthy ✅", "All key signals detected.");
      else if(missing.length <= 2) setHealth("warn", "Looks ok ⚠️", "Missing: " + missing.join(", ") + ".");
      else setHealth("bad", "Needs attention ❗", "Missing: " + missing.join(", ") + ".");

      window.__fcEMP_compData = { title:title||"", url:url||"", price:price||"", end:end||"" };
    }

    // copy buttons
    var copyBtns = qsa("[data-emp-copy]");
    for(var i=0;i<copyBtns.length;i++){
      copyBtns[i].addEventListener("click", function(){
        var kind = this.getAttribute("data-emp-copy");
        var d = window.__fcEMP_compData || {};
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
    var preview = document.getElementById("fcEMPsocialPreview");
    var socialBtns = qsa("[data-emp-social]");
    for(var s=0;s<socialBtns.length;s++){
      socialBtns[s].addEventListener("click", function(){
        var kind = this.getAttribute("data-emp-social");
        var d = window.__fcEMP_compData || {};
        var pack = socialPack(d);
        var out = pack[kind] || ((d.title||"") + "\n" + (d.url||location.href));
        if(preview) preview.value = out;
        copyToClipboard(out, function(ok){ socialToast(ok ? "Copied ✓ (preview updated)" : "Copy failed"); });
      });
    }

    // notes
    var notes = document.getElementById("fcEMPnotes");
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

  function wirePrefs(){
    function ptoast(t){ var el = document.getElementById("fcEMPprefToast"); if(el) el.textContent = t; }

    var toggles = qsa("[data-emp-pref]");
    for(var i=0;i<toggles.length;i++){
      toggles[i].addEventListener("click", function(){
        var kind = this.getAttribute("data-emp-pref");

        if(kind === "newtab"){
          var on = !getNewTab();
          lsSet(KEY_NEW_TAB, on ? "1":"0");
          ptoast(on ? "New tab: ON ✓" : "New tab: OFF ✓");
          updateTopChips();
          render();
          return;
        }

        if(kind === "hidebar"){
          var current = (lsGet(KEY_HIDE_RAFFLEX) === "1");
          var next = !current;
          lsSet(KEY_HIDE_RAFFLEX, next ? "1":"0");
          hideRafflexBar(next);
          ptoast(next ? "Admin bar hidden ✓" : "Admin bar shown ✓");
          updateTopChips();
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
          lsSet(KEY_HIDE_RAFFLEX, "0");
          hideRafflexBar(false);
          ptoast("Reset ✓ (menu refreshed)");
          updateTopChips();
          render();
          return;
        }
      });
    }
  }

  function ensure(){
    if(!isDesktop()){
      hideRafflexBar(true);
      return;
    }

    buildDock();
    updateCrumb();

    hideRafflexBar(lsGet(KEY_HIDE_RAFFLEX) === "1");

    var tab = getActiveTab();
    if(tab === "competition"){
      // refresh competition content if SPA navigated
      render();
    }
  }

  function hookHistory(){
    if(window.__fcEMP_histHooked_v4) return;
    window.__fcEMP_histHooked_v4 = true;

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
