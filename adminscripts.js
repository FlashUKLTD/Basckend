(function(){
  /* =========================================================
     🔧 EASY CUSTOMISATION — EDIT HERE ONLY
     ========================================================= */
  window.FLASH_EMPLOYEE_MENU = window.FLASH_EMPLOYEE_MENU || {
    /* ✅ TEST MODE: set to true if nothing shows.
       Once working, set back to false. */
    forceShowOnSmallScreens: true,

    desktopMin: 901,

    hideAdminBarByDefault: true,
    defaultNewTab: true,

    employeeLinks: [
      { title:"Outlook Mail",     desc:"Inbox",        ico:"📧", url:"https://outlook.office.com/mail/" },
      { title:"Outlook Calendar", desc:"Calendar",     ico:"📅", url:"https://outlook.office.com/calendar/" },
      { title:"Microsoft Teams",  desc:"Chat + calls", ico:"💬", url:"https://teams.microsoft.com/" },
      { title:"OneDrive",         desc:"Files",        ico:"☁️", url:"https://onedrive.live.com/" },
      { title:"Microsoft 365",    desc:"Office home",  ico:"🧩", url:"https://www.office.com/" }
    ],

    flashTools: [
      { title:"Draw Number Tool", desc:"Public draw tool", ico:"🎲", url:"https://flashcompetitions.com/i/draw-number" },
      { title:"Admin Dashboard",  desc:"Admin home",      ico:"🛠️", url:"https://flashcompetitions.com/admin" },
      { title:"Manage Comps",     desc:"Products",        ico:"🏁", url:"https://flashcompetitions.com/admin/products" },
      { title:"Instant Winners",  desc:"Prize list",      ico:"🎁", url:"https://flashcompetitions.com/admin/instant-winners" },
      { title:"Orders",           desc:"Sales",           ico:"🧾", url:"https://flashcompetitions.com/admin/orders" },
      { title:"Coupons",          desc:"Discount codes",  ico:"🏷️", url:"https://flashcompetitions.com/admin/coupons" }
    ],

    adminGroups: [
      { title:"Competitions", pill:"Core", links:[
        ["Competitions", "/admin/products", "Manage comps", "🏁"],
        ["Categories", "/admin/product-categories", "Organise drops", "🗂️"],
        ["Winners", "/admin/winners", "Results log", "🏆"],
        ["Draw Number Tool", "https://flashcompetitions.com/i/draw-number", "Public draw tool", "🎲"]
      ]},
      { title:"Sales", pill:"Revenue", links:[
        ["Orders", "/admin/orders", "Sales & fulfilment", "🧾"],
        ["Coupons", "/admin/coupons", "Discount codes", "🏷️"]
      ]},
      { title:"Users", pill:"Accounts", links:[
        ["Users", "/admin/users", "Accounts & access", "👤"]
      ]}
    ]
  };

  var CFG = window.FLASH_EMPLOYEE_MENU;

  var KEY_OPEN   = "fcE_open_v3";
  var KEY_TAB    = "fcE_tab_v3";
  var KEY_NEW    = "fcE_newtab_v3";
  var KEY_HIDE   = "fcE_hidebar_v3";
  var KEY_PINS   = "fcE_pins_v3";
  var KEY_RECENT = "fcE_recents_v3";

  var RAFFLEX_BAR_SELECTOR = 'div[wire\\:id][class*="bg-zinc-900"][class*="border-b"]';

  function isDesktop(){
    if(CFG.forceShowOnSmallScreens) return true;
    return (window.innerWidth || 0) >= (CFG.desktopMin || 901);
  }
  function isCompetitionPage(){ return (location.pathname || "").indexOf("/competition/") === 0; }

  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel) || []); }

  function lsGet(k){ try{ return localStorage.getItem(k); }catch(_){ return null; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(_){ } }

  function readJSON(key, fallback){
    try{ var v = lsGet(key); return v ? JSON.parse(v) : fallback; }catch(_){ return fallback; }
  }
  function writeJSON(key, obj){
    try{ lsSet(key, JSON.stringify(obj)); }catch(_){}
  }

  function hideAdminBar(shouldHide){
    var bars = qsa(RAFFLEX_BAR_SELECTOR);
    for(var i=0;i<bars.length;i++){
      bars[i].style.display = shouldHide ? "none" : "";
    }
  }

  function ensureHideBarDefault(){
    var v = lsGet(KEY_HIDE);
    if(v === null){
      lsSet(KEY_HIDE, (CFG.hideAdminBarByDefault ? "1":"0"));
    }
  }
  function getNewTab(){
    var v = lsGet(KEY_NEW);
    if(v === null){
      lsSet(KEY_NEW, (CFG.defaultNewTab ? "1":"0"));
      return !!CFG.defaultNewTab;
    }
    return v === "1";
  }

  function getPins(){ return readJSON(KEY_PINS, []); }
  function setPins(a){ writeJSON(KEY_PINS, (a||[]).slice(0,20)); }
  function getRecents(){ return readJSON(KEY_RECENT, []); }
  function setRecents(a){ writeJSON(KEY_RECENT, (a||[]).slice(0,10)); }

  function absUrl(href){
    href = href || "";
    if(href.indexOf("http://")===0 || href.indexOf("https://")===0) return href;
    return "https://flashcompetitions.com" + (href.charAt(0)==="/" ? href : ("/"+href));
  }

  function pushRecent(item){
    var r = getRecents();
    var out = [];
    for(var i=0;i<r.length;i++){
      if(r[i] && r[i].url === item.url) continue;
      out.push(r[i]);
    }
    out.unshift({ title:item.title||"Link", url:item.url||"" });
    setRecents(out);
  }

  function norm(s){ return (s||"").toString().replace(/\s+/g," ").trim().toLowerCase(); }
  function matches(it, q){
    if(!q) return true;
    var t = norm(it.title) + " " + norm(it.desc) + " " + norm(it.url);
    return t.indexOf(q) !== -1;
  }

  function getAllLinksFlat(){
    var out = [];
    (CFG.flashTools||[]).forEach(function(it){ out.push(it); });
    (CFG.employeeLinks||[]).forEach(function(it){ out.push(it); });
    (CFG.adminGroups||[]).forEach(function(g){
      (g.links||[]).forEach(function(L){
        out.push({ title:L[0], desc:L[2], ico:(L[3]||"🔗"), url:absUrl(L[1]) });
      });
    });
    return out;
  }

  function getTab(){ return lsGet(KEY_TAB) || "quick"; }
  function setTab(t){ lsSet(KEY_TAB, t); }

  function safeAppendToBody(el){
    try{
      if(document.body){ document.body.appendChild(el); return true; }
    }catch(_){}
    try{
      document.documentElement.appendChild(el);
      return true;
    }catch(_){}
    return false;
  }

  function build(){
    if(qs(".fcE")) return;

    var root = document.createElement("div");
    root.className = "fcE";
    root.innerHTML =
      '<div class="fcE-fab" aria-label="Open employee menu" title="Employee Menu">' +
        '<div class="fcE-fabIcon">⚙️</div>' +
      '</div>' +

      '<div class="fcE-panelWrap" role="dialog" aria-label="Employee Menu">' +
        '<div class="fcE-head">' +
          '<div class="fcE-headL">' +
            '<div class="fcE-badge">⚙️</div>' +
            '<div class="fcE-title"><b>Employee Menu</b><span id="fcE-path">/</span></div>' +
          '</div>' +
          '<button class="fcE-close" type="button" aria-label="Close">×</button>' +
        '</div>' +

        '<div class="fcE-searchWrap">' +
          '<div class="fcE-search"><span style="opacity:.85">🔎</span><input class="fcE-input" type="text" placeholder="Search links, tools, pages…"></div>' +
        '</div>' +

        '<div class="fcE-tabs">' +
          '<div class="fcE-tab" data-tab="quick"><span class="dot"></span> Quick</div>' +
          '<div class="fcE-tab" data-tab="employee"><span class="dot"></span> Employee</div>' +
          '<div class="fcE-tab" data-tab="admin"><span class="dot"></span> Admin</div>' +
          '<div class="fcE-tab" data-tab="competition"><span class="dot"></span> Competition</div>' +
          '<div class="fcE-tab" data-tab="prefs"><span class="dot"></span> Settings</div>' +
        '</div>' +

        '<div class="fcE-body" id="fcE-body"></div>' +

        '<div class="fcE-foot">' +
          '<div>Close <span class="fcE-kbd">Esc</span></div>' +
          '<div>New tab <span class="fcE-kbd" id="fcE-newtabKbd">ON</span></div>' +
        '</div>' +
      '</div>';

    safeAppendToBody(root);

    root.__fab = qs(".fcE-fab", root);
    root.__wrap = qs(".fcE-panelWrap", root);
    root.__close = qs(".fcE-close", root);
    root.__input = qs(".fcE-input", root);
    root.__body = qs("#fcE-body", root);
    root.__path = qs("#fcE-path", root);
    root.__newtab = qs("#fcE-newtabKbd", root);

    // restore open state
    var open = lsGet(KEY_OPEN) === "1";
    if(root.__wrap) root.__wrap.classList.toggle("is-open", open);

    if(root.__fab){
      root.__fab.addEventListener("click", function(){
        var nowOpen = !(root.__wrap && root.__wrap.classList.contains("is-open"));
        if(root.__wrap) root.__wrap.classList.toggle("is-open", nowOpen);
        lsSet(KEY_OPEN, nowOpen ? "1":"0");
        if(nowOpen){
          render();
          try{ root.__input && root.__input.focus(); }catch(_){}
        }
      });
    }
    if(root.__close){
      root.__close.addEventListener("click", function(){
        if(root.__wrap) root.__wrap.classList.remove("is-open");
        lsSet(KEY_OPEN, "0");
      });
    }
    if(root.__input){
      root.__input.addEventListener("input", function(){ render(); });
      root.__input.addEventListener("keydown", function(e){
        if(e.key === "Escape"){
          if(root.__wrap) root.__wrap.classList.remove("is-open");
          lsSet(KEY_OPEN, "0");
        }
      });
    }

    document.addEventListener("keydown", function(e){
      if(e.key === "Escape"){
        var r = qs(".fcE");
        if(!r) return;
        var w = qs(".fcE-panelWrap", r);
        if(w && w.classList.contains("is-open")){
          w.classList.remove("is-open");
          lsSet(KEY_OPEN, "0");
        }
      }
    });

    // tab click
    var tabs = qsa(".fcE-tab[data-tab]", root);
    for(var i=0;i<tabs.length;i++){
      tabs[i].addEventListener("click", function(){
        setTab(this.getAttribute("data-tab"));
        render();
      });
    }

    render();
  }

  function setActiveTabUI(root, tab){
    var tabs = qsa(".fcE-tab[data-tab]", root);
    for(var i=0;i<tabs.length;i++){
      tabs[i].classList.toggle("is-on", tabs[i].getAttribute("data-tab") === tab);
    }
  }

  function rowHTML(it, pinned){
    var pinOn = pinned ? "is-on" : "";
    var pinText = pinned ? "📌" : "＋";
    return '' +
      '<div class="fcE-row" data-open="'+encodeURIComponent(it.url||"")+'" data-title="'+encodeURIComponent(it.title||"Link")+'">' +
        '<div class="fcE-rowL">' +
          '<div class="fcE-ico">'+(it.ico||"🔗")+'</div>' +
          '<div class="fcE-texts"><b>'+ (it.title||"Link") +'</b><span>'+ (it.desc||"") +'</span></div>' +
        '</div>' +
        '<div class="fcE-actions">' +
          '<div class="fcE-pin '+pinOn+'" data-pin="'+encodeURIComponent(it.url||"")+'" title="Pin">'+pinText+'</div>' +
        '</div>' +
      '</div>';
  }

  function render(){
    var root = qs(".fcE");
    if(!root) return;

    if(root.__path) root.__path.textContent = location.pathname || "/";
    if(root.__newtab) root.__newtab.textContent = getNewTab() ? "ON" : "OFF";

    var tab = getTab();
    setActiveTabUI(root, tab);

    var q = norm((root.__input && root.__input.value) || "");
    var pins = getPins();
    var html = "";

    function card(title, pill, inner){
      return '' +
        '<div class="fcE-card">' +
          '<div class="fcE-cardHead"><b>'+title+'</b><span>'+pill+'</span></div>' +
          inner +
        '</div>';
    }

    // quick
    if(tab === "quick"){
      var all = getAllLinksFlat();
      var pinnedItems = [];
      var pinsArr = getPins();

      for(var i=0;i<pinsArr.length;i++){
        for(var j=0;j<all.length;j++){
          if(all[j].url === pinsArr[i]) { pinnedItems.push(all[j]); break; }
        }
      }

      var pinInner = "";
      if(!pinnedItems.length){
        pinInner = '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px; line-height:1.35;">Pin your key links and they’ll appear here.</div>';
      }else{
        pinnedItems.filter(function(it){ return matches(it,q); }).forEach(function(it){
          pinInner += rowHTML(it, true);
        });
      }

      var toolsInner = "";
      (CFG.flashTools||[]).filter(function(it){ return matches(it,q); }).forEach(function(it){
        toolsInner += rowHTML(it, pins.indexOf(it.url)!==-1);
      });

      html += card("Pinned", (pinnedItems.length ? (pinnedItems.length+"") : "0"), pinInner);
      html += card("Flash Tools", "Fast", toolsInner || '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px;">No matches.</div>');
    }

    // employee
    if(tab === "employee"){
      var empInner = "";
      (CFG.employeeLinks||[]).filter(function(it){ return matches(it,q); }).forEach(function(it){
        empInner += rowHTML(it, pins.indexOf(it.url)!==-1);
      });
      html += card("Employee Links", "Work", empInner || '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px;">No matches.</div>');
    }

    // admin
    if(tab === "admin"){
      (CFG.adminGroups||[]).forEach(function(g){
        var inner = "";
        (g.links||[]).forEach(function(L){
          var it = { title:L[0], desc:L[2], ico:(L[3]||"🔗"), url:absUrl(L[1]) };
          if(matches(it,q)) inner += rowHTML(it, pins.indexOf(it.url)!==-1);
        });
        if(inner) html += card(g.title, (g.pill||"Group"), inner);
      });
      if(!html) html = card("Admin", "Empty", '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px;">No matches.</div>');
    }

    // competition
    if(tab === "competition"){
      if(!isCompetitionPage()){
        html += card("Competition Tools", "/competition/*", '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px; line-height:1.35;">Open a competition page to use this tab.</div>');
      }else{
        html += card("Competition", "Info",
          '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px; line-height:1.35;">You can expand this tab next if you want copy buttons + comp notes again.</div>'
        );
      }
    }

    // prefs
    if(tab === "prefs"){
      var hide = (lsGet(KEY_HIDE) === "1");
      var nt = getNewTab();
      html += card("Preferences", "Saved",
        '<div class="fcE-btnRow">' +
          '<button class="fcE-btn" type="button" data-pref="newtab">'+(nt ? "New Tab: ON" : "New Tab: OFF")+'</button>' +
          '<button class="fcE-btn" type="button" data-pref="hidebar">'+(hide ? "Admin Bar: Hidden" : "Admin Bar: Shown")+'</button>' +
        '</div>' +
        '<div class="fcE-btnRow" style="margin-top:8px;">' +
          '<button class="fcE-btn" type="button" data-pref="clearPins">Clear Pins</button>' +
          '<button class="fcE-btn" type="button" data-pref="reset">Reset Menu</button>' +
        '</div>' +
        '<div class="fcE-toast" id="fcE-pref-toast">Ready.</div>'
      );
    }

    if(root.__body) root.__body.innerHTML = html || "";
    wire(root);
  }

  function wire(root){
    // open link
    var rows = qsa(".fcE-row[data-open]", root);
    for(var i=0;i<rows.length;i++){
      rows[i].addEventListener("click", function(e){
        var target = e.target || null;
        if(target && target.getAttribute && target.getAttribute("data-pin")) return;

        var url = decodeURIComponent(this.getAttribute("data-open") || "");
        var title = decodeURIComponent(this.getAttribute("data-title") || "Link");
        if(!url) return;

        pushRecent({ title:title, url:url });

        var nt = getNewTab();
        try{
          if(nt) window.open(url, "_blank", "noopener");
          else location.href = url;
        }catch(_){
          location.href = url;
        }
      });
    }

    // pin
    var pins = qsa("[data-pin]", root);
    for(var p=0;p<pins.length;p++){
      pins[p].addEventListener("click", function(e){
        e.preventDefault(); e.stopPropagation();
        var url = decodeURIComponent(this.getAttribute("data-pin") || "");
        if(!url) return;

        var cur = getPins();
        var idx = cur.indexOf(url);
        if(idx === -1) cur.unshift(url);
        else cur.splice(idx,1);
        setPins(cur);
        render();
      });
    }

    // prefs
    var prefBtns = qsa("[data-pref]", root);
    for(var k=0;k<prefBtns.length;k++){
      prefBtns[k].addEventListener("click", function(){
        var kind = this.getAttribute("data-pref");
        var toast = qs("#fcE-pref-toast", root);
        function say(t){ if(toast) toast.textContent = t; }

        if(kind === "newtab"){
          var on = !getNewTab();
          lsSet(KEY_NEW, on ? "1":"0");
          say(on ? "New tab ON" : "New tab OFF");
          render();
          return;
        }
        if(kind === "hidebar"){
          var cur = (lsGet(KEY_HIDE) === "1");
          var next = !cur;
          lsSet(KEY_HIDE, next ? "1":"0");
          hideAdminBar(next);
          say(next ? "Admin bar hidden" : "Admin bar shown");
          render();
          return;
        }
        if(kind === "clearPins"){
          setPins([]);
          say("Pins cleared");
          render();
          return;
        }
        if(kind === "reset"){
          lsSet(KEY_OPEN, "0");
          lsSet(KEY_TAB, "quick");
          lsSet(KEY_NEW, (CFG.defaultNewTab ? "1":"0"));
          lsSet(KEY_HIDE, (CFG.hideAdminBarByDefault ? "1":"0"));
          setPins([]);
          setRecents([]);
          hideAdminBar(lsGet(KEY_HIDE) === "1");
          say("Reset ✓");
          render();
          return;
        }
      });
    }
  }

  function ensure(){
    ensureHideBarDefault();
    hideAdminBar(lsGet(KEY_HIDE) === "1");

    if(!isDesktop()){
      // desktop-only mode: remove if exists
      var ex = qs(".fcE");
      if(ex) try{ ex.parentNode.removeChild(ex); }catch(_){}
      return;
    }

    build();

    var r = qs(".fcE");
    if(r){
      var w = qs(".fcE-panelWrap", r);
      if(w && w.classList.contains("is-open")) render();
    }
  }

  function hookHistory(){
    if(window.__fcE_histHooked_v3) return;
    window.__fcE_histHooked_v3 = true;

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
    window.addEventListener("popstate", function(){ setTimeout(ensure, 60); });
  }

  function boot(){
    hookHistory();
    ensure();

    var tries = 0, max = 24;
    var t = setInterval(function(){
      tries++;
      ensure();
      if(tries >= max) clearInterval(t);
    }, 240);

    window.addEventListener("resize", function(){
      setTimeout(ensure, 120);
    });
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
