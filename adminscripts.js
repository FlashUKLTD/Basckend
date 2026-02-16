(function(){
  /* =========================================================
     🔧 EASY CUSTOMISATION — EDIT HERE ONLY
     ========================================================= */
  window.FLASH_EMPLOYEE_MENU = window.FLASH_EMPLOYEE_MENU || {
    desktopMin: 901,

    /* Admin bar OFF automatically by default */
    hideAdminBarByDefault: true,

    /* Open links in new tab by default */
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
      ]},
      { title:"Settings", pill:"Site", links:[
        ["Branding", "/admin/settings/branding-settings", "Logos & style", "🎨"],
        ["Checkout", "/admin/settings/checkout-settings", "Payments & flow", "🧾"],
        ["Marketing", "/admin/settings/marketing-settings", "Promos", "📣"],
        ["SEO", "/admin/settings/seo-settings", "Search settings", "🔎"]
      ]}
    ]
  };

  var CFG = window.FLASH_EMPLOYEE_MENU;

  var KEY_OPEN = "fcE_open_v2";
  var KEY_TAB = "fcE_tab_v2";
  var KEY_NEW_TAB = "fcE_newtab_v2";
  var KEY_HIDE_BAR = "fcE_hidebar_v2";
  var KEY_PINS = "fcE_pins_v2";
  var KEY_RECENTS = "fcE_recents_v2";

  var RAFFLEX_BAR_SELECTOR = 'div[wire\\:id][class*="bg-zinc-900"][class*="border-b"]';

  function isDesktop(){ return (window.innerWidth || 0) >= (CFG.desktopMin || 901); }
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

  function absUrl(href){
    href = href || "";
    if(href.indexOf("http://")===0 || href.indexOf("https://")===0) return href;
    return "https://flashcompetitions.com" + (href.charAt(0)==="/" ? href : ("/"+href));
  }

  function getNewTab(){
    var v = lsGet(KEY_NEW_TAB);
    if(v === null){
      lsSet(KEY_NEW_TAB, (CFG.defaultNewTab ? "1":"0"));
      return !!CFG.defaultNewTab;
    }
    return v === "1";
  }

  function ensureHideBarDefault(){
    var v = lsGet(KEY_HIDE_BAR);
    if(v === null){
      lsSet(KEY_HIDE_BAR, (CFG.hideAdminBarByDefault ? "1":"0"));
    }
  }

  function getPins(){ return readJSON(KEY_PINS, []); }
  function setPins(a){ writeJSON(KEY_PINS, (a||[]).slice(0,20)); }
  function getRecents(){ return readJSON(KEY_RECENTS, []); }
  function setRecents(a){ writeJSON(KEY_RECENTS, (a||[]).slice(0,10)); }

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
          '<div class="fcE-headR">' +
            '<span class="fcE-chip" id="fcE-chipTab">Quick</span>' +
            '<button class="fcE-close" type="button" aria-label="Close">×</button>' +
          '</div>' +
        '</div>' +

        '<div class="fcE-searchWrap">' +
          '<div class="fcE-search"><i>🔎</i><input class="fcE-input" type="text" placeholder="Search links, tools, pages…"></div>' +
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
          '<div class="k">Open <span class="fcE-kbd">Enter</span> • Close <span class="fcE-kbd">Esc</span></div>' +
          '<div class="k">New tab: <span class="fcE-kbd" id="fcE-newtabKbd">ON</span></div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(root);

    root.__fab = qs(".fcE-fab", root);
    root.__wrap = qs(".fcE-panelWrap", root);
    root.__close = qs(".fcE-close", root);
    root.__input = qs(".fcE-input", root);
    root.__body = qs("#fcE-body", root);
    root.__chip = qs("#fcE-chipTab", root);
    root.__path = qs("#fcE-path", root);
    root.__newtab = qs("#fcE-newtabKbd", root);

    // Restore open state
    var open = lsGet(KEY_OPEN) === "1";
    if(root.__wrap) root.__wrap.classList.toggle("is-open", open);

    // Click handlers
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

    // Tabs
    var tabs = qsa(".fcE-tab[data-tab]", root);
    for(var i=0;i<tabs.length;i++){
      tabs[i].addEventListener("click", function(){
        setTab(this.getAttribute("data-tab"));
        render();
      });
    }

    // Search
    if(root.__input){
      root.__input.addEventListener("input", function(){ render(); });
      root.__input.addEventListener("keydown", function(e){
        if(e.key === "Escape"){
          if(root.__wrap) root.__wrap.classList.remove("is-open");
          lsSet(KEY_OPEN, "0");
        }
      });
    }

    // Global esc to close
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

    // Render now
    render();
  }

  function setActiveTabUI(root, tab){
    var tabs = qsa(".fcE-tab[data-tab]", root);
    for(var i=0;i<tabs.length;i++){
      tabs[i].classList.toggle("is-on", tabs[i].getAttribute("data-tab") === tab);
    }
    if(root.__chip) root.__chip.textContent =
      tab === "quick" ? "Quick" :
      tab === "employee" ? "Employee" :
      tab === "admin" ? "Admin" :
      tab === "competition" ? "Competition" : "Settings";
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

    // Path
    if(root.__path) root.__path.textContent = location.pathname || "/";

    // New tab label
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

    // QUICK
    if(tab === "quick"){
      var all = getAllLinksFlat();
      var pinnedItems = [];
      var pinsArr = getPins();

      for(var i=0;i<pinsArr.length;i++){
        for(var j=0;j<all.length;j++){
          if(all[j].url === pinsArr[i]) { pinnedItems.push(all[j]); break; }
        }
      }

      var rec = getRecents();

      var pinInner = "";
      if(!pinnedItems.length){
        pinInner = '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px; line-height:1.35;">Pin your key links and they’ll appear here.</div>';
      }else{
        pinnedItems.filter(function(it){ return matches(it,q); }).forEach(function(it){
          pinInner += rowHTML(it, true);
        });
      }

      var recInner = "";
      if(!rec.length){
        recInner = '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px; line-height:1.35;">Links you open will show here.</div>';
      }else{
        rec.filter(function(it){ return matches(it,q); }).forEach(function(it){
          var it2 = { title: it.title, desc: it.url.replace(/^https?:\/\/(www\.)?/,""), ico:"🕘", url: it.url };
          recInner += rowHTML(it2, pins.indexOf(it2.url)!==-1);
        });
      }

      var toolsInner = "";
      (CFG.flashTools||[]).filter(function(it){ return matches(it,q); }).forEach(function(it){
        toolsInner += rowHTML(it, pins.indexOf(it.url)!==-1);
      });

      html += card("Pinned", (pinnedItems.length ? (pinnedItems.length+"") : "0"), pinInner);
      html += card("Recents", (rec.length ? (rec.length+"") : "0"), recInner);
      html += card("Flash Tools", "Fast", toolsInner || '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px;">No matches.</div>');
    }

    // EMPLOYEE
    if(tab === "employee"){
      var empInner = "";
      (CFG.employeeLinks||[]).filter(function(it){ return matches(it,q); }).forEach(function(it){
        empInner += rowHTML(it, pins.indexOf(it.url)!==-1);
      });
      html += card("Employee Links", "Work", empInner || '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px;">No matches.</div>');
    }

    // ADMIN
    if(tab === "admin"){
      (CFG.adminGroups||[]).forEach(function(g){
        var inner = "";
        (g.links||[]).forEach(function(L){
          var it = { title:L[0], desc:L[2], ico:(L[3]||"🔗"), url:absUrl(L[1]) };
          if(matches(it,q)) inner += rowHTML(it, pins.indexOf(it.url)!==-1);
        });
        if(inner){
          html += card(g.title, (g.pill||"Group"), inner);
        }
      });
      if(!html){
        html = card("Admin", "Empty", '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px;">No matches.</div>');
      }
    }

    // COMPETITION
    if(tab === "competition"){
      if(!isCompetitionPage()){
        html += card("Competition Tools", "/competition/*", '<div style="padding:8px 2px; color:rgba(255,255,255,.70); font-weight:900; font-size:12px; line-height:1.35;">Open a competition page to use quick copy + notes.</div>');
      }else{
        html += card("Quick Copy", "One click",
          '<div class="fcE-btnRow">' +
            '<button class="fcE-btn" type="button" data-cc="url">Copy URL</button>' +
            '<button class="fcE-btn" type="button" data-cc="title">Copy Title</button>' +
          '</div>' +
          '<div class="fcE-btnRow" style="margin-top:8px;">' +
            '<button class="fcE-btn" type="button" data-cc="promo">Copy Promo</button>' +
            '<button class="fcE-btn" type="button" data-cc="utm">Copy UTM URL</button>' +
          '</div>' +
          '<div class="fcE-toast" id="fcE-cc-toast">Ready.</div>'
        );

        html += card("Notes", "Saved",
          '<textarea class="fcE-ta" id="fcE-notes" placeholder="Notes for this competition…"></textarea>' +
          '<div class="fcE-btnRow" style="margin-top:8px;">' +
            '<button class="fcE-btn" type="button" data-notes="copy">Copy</button>' +
            '<button class="fcE-btn" type="button" data-notes="clear">Clear</button>' +
          '</div>' +
          '<div class="fcE-toast" id="fcE-notes-toast">Saved.</div>'
        );
      }
    }

    // SETTINGS
    if(tab === "prefs"){
      var hide = (lsGet(KEY_HIDE_BAR) === "1");
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

  function copyToClipboard(text, cb){
    function done(ok){ if(cb) cb(ok); }
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(function(){ done(true); }).catch(function(){ fallback(text, done); });
        return;
      }
    }catch(_){}
    fallback(text, done);
  }
  function fallback(text, done){
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

  function getCompTitle(){
    var h = document.querySelector("h1") || document.querySelector('[data-testid="competition-title"]') || document.querySelector(".competition-title");
    if(h && h.textContent) return h.textContent.trim();
    var t = document.title || "";
    return (t || "").replace(/\s+\|\s+.*$/,"").trim();
  }
  function buildUtmUrl(base){
    var u = base || location.href;
    var sep = u.indexOf("?") === -1 ? "?" : "&";
    return u + sep + "utm_source=instagram&utm_medium=social&utm_campaign=competition";
  }
  function slugFromPath(){
    var p = location.pathname || "";
    var parts = p.split("/").filter(Boolean);
    return parts.length ? parts[parts.length-1] : "";
  }

  function wire(root){
    // Open links
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

    // Pin actions
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

    // Competition copy
    var cc = qsa("[data-cc]", root);
    for(var c=0;c<cc.length;c++){
      cc[c].addEventListener("click", function(){
        var kind = this.getAttribute("data-cc");
        var toast = qs("#fcE-cc-toast", root);
        function say(t){ if(toast) toast.textContent = t; }

        var title = getCompTitle();
        var url = location.href;

        var out = "";
        if(kind === "url") out = url;
        if(kind === "title") out = title;
        if(kind === "promo") out = "⚡ Flash Competitions: " + title + " — Enter now: " + url;
        if(kind === "utm") out = buildUtmUrl(url);

        copyToClipboard(out, function(ok){ say(ok ? "Copied ✓" : "Copy failed"); });
      });
    }

    // Notes
    var notes = qs("#fcE-notes", root);
    if(notes && isCompetitionPage()){
      var KEY_NOTES = "fcE_notes_v2:" + (slugFromPath() || location.pathname);
      try{ notes.value = lsGet(KEY_NOTES) || ""; }catch(_){}
      var timer = null;
      notes.addEventListener("input", function(){
        if(timer) clearTimeout(timer);
        timer = setTimeout(function(){
          lsSet(KEY_NOTES, notes.value || "");
          var t = qs("#fcE-notes-toast", root);
          if(t) t.textContent = "Saved ✓";
        }, 250);
      });

      var nBtns = qsa("[data-notes]", root);
      for(var n=0;n<nBtns.length;n++){
        nBtns[n].addEventListener("click", function(){
          var kind = this.getAttribute("data-notes");
          var toast = qs("#fcE-notes-toast", root);
          function say(t){ if(toast) toast.textContent = t; }

          if(kind === "copy"){
            copyToClipboard(notes.value || "", function(ok){ say(ok ? "Copied ✓" : "Copy failed"); });
            return;
          }
          if(kind === "clear"){
            notes.value = "";
            lsSet(KEY_NOTES, "");
            say("Cleared ✓");
            return;
          }
        });
      }
    }

    // Prefs
    var prefBtns = qsa("[data-pref]", root);
    for(var k=0;k<prefBtns.length;k++){
      prefBtns[k].addEventListener("click", function(){
        var kind = this.getAttribute("data-pref");
        var toast = qs("#fcE-pref-toast", root);
        function say(t){ if(toast) toast.textContent = t; }

        if(kind === "newtab"){
          var on = !getNewTab();
          lsSet(KEY_NEW_TAB, on ? "1":"0");
          say(on ? "New tab ON" : "New tab OFF");
          render();
          return;
        }
        if(kind === "hidebar"){
          var cur = (lsGet(KEY_HIDE_BAR) === "1");
          var next = !cur;
          lsSet(KEY_HIDE_BAR, next ? "1":"0");
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
          lsSet(KEY_NEW_TAB, (CFG.defaultNewTab ? "1":"0"));
          lsSet(KEY_HIDE_BAR, (CFG.hideAdminBarByDefault ? "1":"0"));
          setPins([]);
          setRecents([]);
          hideAdminBar(lsGet(KEY_HIDE_BAR) === "1");
          say("Reset ✓");
          render();
          return;
        }
      });
    }
  }

  function ensure(){
    if(!isDesktop()){
      // Still hide bar on mobile if desired
      ensureHideBarDefault();
      hideAdminBar(lsGet(KEY_HIDE_BAR) === "1");
      return;
    }

    ensureHideBarDefault();
    build();
    hideAdminBar(lsGet(KEY_HIDE_BAR) === "1");

    // If currently open, keep updated
    var r = qs(".fcE");
    if(r){
      var w = qs(".fcE-panelWrap", r);
      if(w && w.classList.contains("is-open")) render();
    }
  }

  function hookHistory(){
    if(window.__fcE_histHooked_v2) return;
    window.__fcE_histHooked_v2 = true;

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

    var tries = 0, max = 22;
    var t = setInterval(function(){
      tries++;
      ensure();
      if(tries >= max) clearInterval(t);
    }, 260);

    var last = isDesktop();
    window.addEventListener("resize", function(){
      var now = isDesktop();
      if(now !== last){
        last = now;
        setTimeout(ensure, 140);
      }
    });
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
