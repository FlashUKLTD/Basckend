(function(){
  /* =========================================================
     🔧 EASY CUSTOMISATION — EDIT HERE ONLY
     ========================================================= */
  window.FLASH_EMPLOYEE_MENU = window.FLASH_EMPLOYEE_MENU || {
    desktopMin: 901,

    /* default open links in new tab */
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
      { title:"Orders",           desc:"Sales",           ico:"🧾", url:"https://flashcompetitions.com/admin/orders" },
      { title:"Coupons",          desc:"Discount codes",  ico:"🏷️", url:"https://flashcompetitions.com/admin/coupons" }
    ],

    adminGroups: [
      { title:"Competitions", ico:"🏁", links:[
        ["Competitions", "/admin/products", "Manage comps", "🏁"],
        ["Instant Winners", "/admin/instant-winners", "IW prizes", "🎁"],
        ["Winners", "/admin/winners", "Results log", "🏆"],
        ["Draw Number Tool", "https://flashcompetitions.com/i/draw-number", "Public draw tool", "🎲"]
      ]},
      { title:"Sales", ico:"🛒", links:[
        ["Orders", "/admin/orders", "Sales & fulfilment", "🧾"],
        ["Coupons", "/admin/coupons", "Discount codes", "🏷️"]
      ]},
      { title:"Users", ico:"👥", links:[
        ["Users", "/admin/users", "Accounts", "👤"]
      ]},
      { title:"Settings", ico:"⚙️", links:[
        ["Branding", "/admin/settings/branding-settings", "Logos & style", "🎨"],
        ["Checkout", "/admin/settings/checkout-settings", "Payments", "🧾"],
        ["Marketing", "/admin/settings/marketing-settings", "Promos", "📣"],
        ["SEO", "/admin/settings/seo-settings", "Search", "🔎"]
      ]}
    ]
  };

  var CFG = window.FLASH_EMPLOYEE_MENU;

  var KEY_OPEN = "fcM_open_v1";
  var KEY_TAB = "fcM_tab_v1";
  var KEY_NEW_TAB = "fcM_newtab_v1";
  var KEY_HIDE_RAFFLEX = "fcM_hidebar_v1";
  var KEY_PINS = "fcM_pins_v1";
  var KEY_RECENTS = "fcM_recents_v1";

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

  function hideRafflexBar(shouldHide){
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

  function getPins(){ return readJSON(KEY_PINS, []); }
  function setPins(a){ writeJSON(KEY_PINS, (a||[]).slice(0,20)); }
  function getRecents(){ return readJSON(KEY_RECENTS, []); }
  function setRecents(a){ writeJSON(KEY_RECENTS, (a||[]).slice(0,8)); }

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

  function build(){
    if(qs(".fcM")) return;

    var root = document.createElement("div");
    root.className = "fcM";
    root.innerHTML =
      '<div class="fcM-launch" title="Employee Menu">⚙️</div>' +

      '<div class="fcM-panel" role="dialog" aria-label="Employee Menu">' +
        '<div class="fcM-head">' +
          '<div class="fcM-brand">' +
            '<div class="fcM-avatar">⚙️</div>' +
            '<div class="fcM-title"><b>Employee Menu</b><span id="fcM-path">/</span></div>' +
          '</div>' +
          '<button class="fcM-close" type="button" aria-label="Close">×</button>' +
        '</div>' +

        '<div class="fcM-searchWrap">' +
          '<div class="fcM-search">' +
            '<i>🔎</i>' +
            '<input class="fcM-input" type="text" placeholder="Keyword">' +
          '</div>' +
        '</div>' +

        '<div class="fcM-body">' +
          '<div class="fcM-nav">' +
            '<div class="fcM-sectionLabel">Overview</div>' +
            '<div class="fcM-item" data-tab="quick"><div class="fcM-left"><div class="fcM-ico">✨</div><div class="fcM-texts"><b>Quick</b><span>Pins + recents</span></div></div></div>' +
            '<div class="fcM-item" data-tab="employee"><div class="fcM-left"><div class="fcM-ico">👔</div><div class="fcM-texts"><b>Employee</b><span>Outlook, Teams…</span></div></div></div>' +
            '<div class="fcM-item" data-tab="admin"><div class="fcM-left"><div class="fcM-ico">🧭</div><div class="fcM-texts"><b>Admin</b><span>Shortcuts</span></div></div></div>' +
            '<div class="fcM-item" data-tab="competition"><div class="fcM-left"><div class="fcM-ico">🏁</div><div class="fcM-texts"><b>Competition</b><span>Tools</span></div></div></div>' +
            '<div class="fcM-item" data-tab="prefs"><div class="fcM-left"><div class="fcM-ico">⚙️</div><div class="fcM-texts"><b>Settings</b><span>Menu prefs</span></div></div></div>' +

            '<div class="fcM-content" id="fcM-content"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(root);

    var launch = qs(".fcM-launch", root);
    var panel = qs(".fcM-panel", root);
    var close = qs(".fcM-close", root);
    var input = qs(".fcM-input", root);

    function setPath(){
      var p = qs("#fcM-path", root);
      if(p) p.textContent = location.pathname || "/";
    }

    function setOpen(open){
      if(panel) panel.classList.toggle("is-open", open);
      lsSet(KEY_OPEN, open ? "1":"0");
    }

    function getTab(){ return lsGet(KEY_TAB) || "quick"; }
    function setTab(t){
      lsSet(KEY_TAB, t);
      var items = qsa(".fcM-item[data-tab]", root);
      for(var i=0;i<items.length;i++){
        items[i].classList.toggle("is-active", items[i].getAttribute("data-tab") === t);
      }
      render();
    }

    function linkRow(it, pinned){
      var pin = pinned ? "📌" : "＋";
      var pinTitle = pinned ? "Unpin" : "Pin";
      return '' +
        '<div class="fcM-item" data-open="'+encodeURIComponent(it.url||"")+'" data-title="'+encodeURIComponent(it.title||"Link")+'">' +
          '<div class="fcM-left">' +
            '<div class="fcM-ico">'+(it.ico||"🔗")+'</div>' +
            '<div class="fcM-texts"><b>'+ (it.title||"Link") +'</b><span>'+ (it.desc||"") +'</span></div>' +
          '</div>' +
          '<div class="fcM-pill" data-pin="'+encodeURIComponent(it.url||"")+'" title="'+pinTitle+'">'+pin+'</div>' +
        '</div>';
    }

    function renderQuick(q){
      var pins = getPins();
      var rec = getRecents();
      var all = getAllLinksFlat();

      // pinned objects
      var pinnedItems = [];
      for(var i=0;i<pins.length;i++){
        for(var j=0;j<all.length;j++){
          if(all[j].url === pins[i]) { pinnedItems.push(all[j]); break; }
        }
      }

      var out = '';
      out += '<div class="fcM-card"><div class="fcM-cardTitle">Pinned</div>';
      if(!pinnedItems.length) out += '<div class="fcM-muted">Pin links to keep them here.</div>';
      pinnedItems.filter(function(it){ return matches(it,q); }).forEach(function(it){
        out += linkRow(it, true);
      });
      out += '</div>';

      out += '<div class="fcM-card"><div class="fcM-cardTitle">Recents</div>';
      if(!rec.length) out += '<div class="fcM-muted">Links you open will show here.</div>';
      rec.filter(function(it){ return matches(it,q); }).forEach(function(it){
        out += linkRow({ title:it.title, desc:it.url.replace(/^https?:\/\/(www\.)?/,""), ico:"🕘", url:it.url }, pins.indexOf(it.url)!==-1);
      });
      out += '</div>';

      out += '<div class="fcM-card"><div class="fcM-cardTitle">Flash Tools</div>';
      (CFG.flashTools||[]).filter(function(it){ return matches(it,q); }).forEach(function(it){
        out += linkRow(it, pins.indexOf(it.url)!==-1);
      });
      out += '</div>';

      return out;
    }

    function renderEmployee(q){
      var pins = getPins();
      var out = '<div class="fcM-card"><div class="fcM-cardTitle">Employee Links</div>';
      (CFG.employeeLinks||[]).filter(function(it){ return matches(it,q); }).forEach(function(it){
        out += linkRow(it, pins.indexOf(it.url)!==-1);
      });
      out += '</div>';
      return out;
    }

    function renderAdmin(q){
      var pins = getPins();
      var out = '';
      (CFG.adminGroups||[]).forEach(function(g){
        var rows = '';
        (g.links||[]).forEach(function(L){
          var it = { title:L[0], desc:L[2], ico:(L[3]||"🔗"), url:absUrl(L[1]) };
          if(matches(it,q)) rows += linkRow(it, pins.indexOf(it.url)!==-1);
        });
        if(rows){
          out += '<div class="fcM-card"><div class="fcM-cardTitle">'+(g.ico||"🧭")+' '+g.title+'</div>' + rows + '</div>';
        }
      });
      if(!out) out = '<div class="fcM-card"><div class="fcM-muted">No matches.</div></div>';
      return out;
    }

    function renderPrefs(){
      var hide = (lsGet(KEY_HIDE_RAFFLEX) === "1");
      var nt = getNewTab();

      return '' +
        '<div class="fcM-card">' +
          '<div class="fcM-cardTitle">Preferences</div>' +
          '<div class="fcM-btnRow">' +
            '<button class="fcM-btn" type="button" data-pref="newtab">'+(nt ? "New Tab: ON" : "New Tab: OFF")+'</button>' +
            '<button class="fcM-btn" type="button" data-pref="hidebar">'+(hide ? "Admin Bar: Hidden" : "Admin Bar: Shown")+'</button>' +
          '</div>' +
          '<div class="fcM-btnRow" style="margin-top:8px;">' +
            '<button class="fcM-btn" type="button" data-pref="clearPins">Clear Pins</button>' +
            '<button class="fcM-btn" type="button" data-pref="reset">Reset Menu</button>' +
          '</div>' +
          '<div class="fcM-toast" id="fcM-toast">Ready.</div>' +
        '</div>';
    }

    function renderCompetition(q){
      if(!isCompetitionPage()){
        return '<div class="fcM-card"><div class="fcM-cardTitle">Competition Tools</div><div class="fcM-muted">Open a /competition/* page to use tools.</div></div>';
      }

      // minimal set: Copy URL / Copy Title / Copy Promo + Notes
      return '' +
        '<div class="fcM-card">' +
          '<div class="fcM-cardTitle">Quick Copy</div>' +
          '<div class="fcM-btnRow">' +
            '<button class="fcM-btn" type="button" data-cc="url">Copy URL</button>' +
            '<button class="fcM-btn" type="button" data-cc="title">Copy Title</button>' +
          '</div>' +
          '<div class="fcM-btnRow" style="margin-top:8px;">' +
            '<button class="fcM-btn" type="button" data-cc="promo">Copy Promo</button>' +
            '<button class="fcM-btn" type="button" data-cc="utm">Copy UTM URL</button>' +
          '</div>' +
          '<div class="fcM-toast" id="fcM-cc-toast">Ready.</div>' +
        '</div>' +

        '<div class="fcM-card">' +
          '<div class="fcM-cardTitle">Notes</div>' +
          '<textarea class="fcM-ta" id="fcM-notes" placeholder="Notes for this competition…"></textarea>' +
          '<div class="fcM-btnRow" style="margin-top:8px;">' +
            '<button class="fcM-btn" type="button" data-notes="copy">Copy</button>' +
            '<button class="fcM-btn" type="button" data-notes="clear">Clear</button>' +
          '</div>' +
          '<div class="fcM-toast" id="fcM-notes-toast">Saved.</div>' +
        '</div>';
    }

    function render(){
      setPath();

      var tab = getTab();
      var q = norm((input && input.value) || "");

      var content = qs("#fcM-content", root);
      if(!content) return;

      if(tab === "quick") content.innerHTML = renderQuick(q);
      else if(tab === "employee") content.innerHTML = renderEmployee(q);
      else if(tab === "admin") content.innerHTML = renderAdmin(q);
      else if(tab === "competition") content.innerHTML = renderCompetition(q);
      else content.innerHTML = renderPrefs();

      wire();
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

    function wire(){
      // side nav click
      var items = qsa(".fcM-item[data-tab]", root);
      for(var i=0;i<items.length;i++){
        items[i].onclick = (function(el){
          return function(){ setTab(el.getAttribute("data-tab")); };
        })(items[i]);
      }

      // link open click
      var opens = qsa('.fcM-item[data-open]', root);
      for(var j=0;j<opens.length;j++){
        opens[j].addEventListener("click", function(e){
          // if pin pill clicked, ignore here
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

      // pin pill click
      var pins = qsa("[data-pin]", root);
      for(var k=0;k<pins.length;k++){
        pins[k].addEventListener("click", function(e){
          e.preventDefault();
          e.stopPropagation();
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

      // prefs buttons
      var prefBtns = qsa("[data-pref]", root);
      for(var p=0;p<prefBtns.length;p++){
        prefBtns[p].addEventListener("click", function(){
          var kind = this.getAttribute("data-pref");
          var toast = qs("#fcM-toast", root);
          function say(t){ if(toast) toast.textContent = t; }

          if(kind === "newtab"){
            var on = !getNewTab();
            lsSet(KEY_NEW_TAB, on ? "1":"0");
            say(on ? "New tab ON" : "New tab OFF");
            render();
            return;
          }
          if(kind === "hidebar"){
            var cur = (lsGet(KEY_HIDE_RAFFLEX) === "1");
            var next = !cur;
            lsSet(KEY_HIDE_RAFFLEX, next ? "1":"0");
            hideRafflexBar(next);
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
            lsSet(KEY_HIDE_RAFFLEX, "0");
            setPins([]);
            setRecents([]);
            hideRafflexBar(false);
            say("Reset");
            render();
            return;
          }
        });
      }

      // competition tools
      var cc = qsa("[data-cc]", root);
      for(var c=0;c<cc.length;c++){
        cc[c].addEventListener("click", function(){
          var kind = this.getAttribute("data-cc");
          var toast = qs("#fcM-cc-toast", root);
          function say(t){ if(toast) toast.textContent = t; }

          var title = getCompTitle();
          var url = location.href;

          var out = "";
          if(kind === "url") out = url;
          if(kind === "title") out = title;
          if(kind === "promo") out = "⚡ Flash Competitions: " + title + " — Enter now: " + url;
          if(kind === "utm") out = buildUtmUrl(url);

          copyToClipboard(out, function(ok){ say(ok ? "Copied" : "Copy failed"); });
        });
      }

      // notes
      var notes = qs("#fcM-notes", root);
      if(notes && isCompetitionPage()){
        var KEY_NOTES = "fcM_notes_v1:" + (slugFromPath() || location.pathname);
        try{ notes.value = lsGet(KEY_NOTES) || ""; }catch(_){}
        var timer = null;
        notes.addEventListener("input", function(){
          if(timer) clearTimeout(timer);
          timer = setTimeout(function(){
            lsSet(KEY_NOTES, notes.value || "");
            var t = qs("#fcM-notes-toast", root);
            if(t) t.textContent = "Saved";
          }, 250);
        });

        var nBtns = qsa("[data-notes]", root);
        for(var n=0;n<nBtns.length;n++){
          nBtns[n].addEventListener("click", function(){
            var kind = this.getAttribute("data-notes");
            var toast = qs("#fcM-notes-toast", root);
            function say(t){ if(toast) toast.textContent = t; }

            if(kind === "copy"){
              copyToClipboard(notes.value || "", function(ok){ say(ok ? "Copied" : "Copy failed"); });
              return;
            }
            if(kind === "clear"){
              notes.value = "";
              lsSet(KEY_NOTES, "");
              say("Cleared");
              return;
            }
          });
        }
      }
    }

    // open/close wiring
    launch.addEventListener("click", function(){ setOpen(true); });
    close.addEventListener("click", function(){ setOpen(false); });

    // restore state
    setPath();
    setOpen(lsGet(KEY_OPEN) === "1");
    setTab(getTab());

    if(input){
      input.addEventListener("input", function(){ render(); });
    }

    root.__render = render;
  }

  function ensure(){
    if(!isDesktop()){
      hideRafflexBar(true);
      return;
    }
    build();
    hideRafflexBar(lsGet(KEY_HIDE_RAFFLEX) === "1");

    var root = qs(".fcM");
    if(root && root.__render) root.__render();
  }

  function hookHistory(){
    if(window.__fcM_histHooked_v1) return;
    window.__fcM_histHooked_v1 = true;

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

    var tries = 0, max = 20;
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
        setTimeout(ensure, 120);
      }
    });
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
