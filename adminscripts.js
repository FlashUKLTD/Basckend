(function(){
  /* =========================================================
     🔧 EASY CUSTOMISATION — EDIT HERE ONLY
     ========================================================= */
  window.FLASH_EMPLOYEE_MENU = window.FLASH_EMPLOYEE_MENU || {};
  var CFG = window.FLASH_EMPLOYEE_MENU;

  // Defaults (safe merge)
  function merge(a,b){
    var o={},k;
    for(k in a){ if(Object.prototype.hasOwnProperty.call(a,k)) o[k]=a[k]; }
    for(k in b){ if(Object.prototype.hasOwnProperty.call(b,k)) o[k]=b[k]; }
    return o;
  }

  var DEFAULTS = {
    desktopMin: 901,
    defaultNewTab: true,

    // Position + size
    panelWidth: 280,
    panelMaxHeight: 520,
    right: 14,
    bottom: 14,

    launcherIcon: "⚙️",
    launcherTitle: "Admin Menu",
    launcherSubtitle: "Quick links",

    // “Reference screenshot” menu (primary Admin links)
    adminPrimary: [
      { title:"Competitions", ico:"🗂️", url:"/admin/products" },
      { title:"Orders",       ico:"🛒", url:"/admin/orders" },
      { title:"Users",        ico:"👥", url:"/admin/users" },
      { title:"Pages",        ico:"📄", url:"/admin/pages" },
      { title:"Coupons",      ico:"🏷️", url:"/admin/coupons" },
      { title:"Instant Winners", ico:"⚡", url:"/admin/instant-winners" },
      { title:"Analytics",    ico:"📊", url:"/admin/analytics" },
      { title:"Settings",     ico:"⚙️", url:"/admin/settings" }
    ],

    // Extra tools tab
    tools: [
      { title:"Draw Number Tool", ico:"🎲", url:"https://flashcompetitions.com/i/draw-number" },
      { title:"Admin Dashboard",  ico:"🛠️", url:"/admin" }
    ]
  };

  CFG = merge(DEFAULTS, CFG);
  window.FLASH_EMPLOYEE_MENU = CFG;

  /* =========================================================
     Storage keys
     ========================================================= */
  var KEY_OPEN     = "fcEMP_open_v7";
  var KEY_TAB      = "fcEMP_tab_v7";
  var KEY_NEW_TAB  = "fcEMP_newtab_v7";
  var KEY_PINS     = "fcEMP_pins_v7";
  var KEY_HIDE_BAR = "fcEMP_hideRafflex_v7";

  var RAFFLEX_BAR_SELECTOR = 'div[wire\\:id][class*="bg-zinc-900"][class*="border-b"]';

  function isDesktop(){ return (window.innerWidth || 0) >= (CFG.desktopMin || 901); }
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
    href = (href||"").toString();
    if(href.indexOf("http://") === 0 || href.indexOf("https://") === 0) return href;
    if(href.charAt(0) !== "/") href = "/" + href;
    return "https://flashcompetitions.com" + href;
  }

  function hideRafflexBar(shouldHide){
    var bars = qsa(RAFFLEX_BAR_SELECTOR);
    for(var i=0;i<bars.length;i++){
      bars[i].style.display = shouldHide ? "none" : "";
    }
  }

  function getNewTab(){
    var v = lsGet(KEY_NEW_TAB);
    if(v === null || v === undefined){
      lsSet(KEY_NEW_TAB, (CFG.defaultNewTab ? "1":"0"));
      return !!CFG.defaultNewTab;
    }
    return v === "1";
  }

  function getPins(){ return readJSON(KEY_PINS, []); }
  function setPins(arr){ writeJSON(KEY_PINS, (arr||[])); }

  function norm(s){ return (s||"").toString().replace(/\\s+/g," ").trim().toLowerCase(); }
  function matches(item, q){
    if(!q) return true;
    var t = norm(item.title) + " " + norm(item.url);
    return t.indexOf(q) !== -1;
  }

  function activeTab(){ return lsGet(KEY_TAB) || "admin"; }

  function removeOldUIs(){
    var old = qs(".fcEMP5"); if(old) old.remove();
    var old2 = qs(".fcEMP6"); if(old2) old2.remove();
  }

  function buildUI(){
    removeOldUIs();

    if(qs(".fcEMP7")) return;

    var root = document.createElement("div");
    root.className = "fcEMP7";
    root.innerHTML =
      '<div class="fcEMP7-panel" aria-label="Flash Admin Menu">' +
        '<div class="fcEMP7-head">' +
          '<div class="fcEMP7-headLeft">' +
            '<div class="fcEMP7-title">Flash — Admin</div>' +
            '<div class="fcEMP7-sub" title="Current page">📍 '+(location.pathname||"/")+'</div>' +
          '</div>' +
          '<div class="fcEMP7-headBtns">' +
            '<div class="fcEMP7-ib" data-emp-action="newtab" title="New tab toggle">↗</div>' +
            '<div class="fcEMP7-ib" data-emp-action="hidebar" title="Admin bar toggle">👁</div>' +
            '<div class="fcEMP7-ib" data-emp-action="close" title="Close">✕</div>' +
          '</div>' +
        '</div>' +

        '<div class="fcEMP7-tabs">' +
          '<div class="fcEMP7-tab" data-emp-tab="admin">Admin</div>' +
          '<div class="fcEMP7-tab" data-emp-tab="tools">Tools</div>' +
          '<div class="fcEMP7-tab" data-emp-tab="pinned">Pinned</div>' +
          '<div class="fcEMP7-tab" data-emp-tab="prefs">Prefs</div>' +
        '</div>' +

        '<div class="fcEMP7-search">' +
          '<input class="fcEMP7-input" type="text" placeholder="Search… (orders, coupons, settings)">' +
          '<div class="fcEMP7-clear" data-emp-action="clear" title="Clear">✕</div>' +
        '</div>' +

        '<div class="fcEMP7-body"></div>' +
      '</div>' +

      '<div class="fcEMP7-launch" aria-label="Open admin menu">' +
        '<div class="fcEMP7-launchIco" data-emp-launch-ico></div>' +
        '<div class="fcEMP7-launchTxt">' +
          '<b data-emp-launch-title></b>' +
          '<span data-emp-launch-sub></span>' +
        '</div>' +
        '<span class="fcEMP7-launchChev">▴</span>' +
      '</div>';

    document.body.appendChild(root);

    // Apply sizing/position customisation
    var panel = qs(".fcEMP7-panel", root);
    var launch = qs(".fcEMP7-launch", root);

    if(panel){
      panel.style.width = (CFG.panelWidth || 280) + "px";
      panel.style.maxHeight = (CFG.panelMaxHeight || 520) + "px";
      panel.style.right = (CFG.right || 14) + "px";
      panel.style.bottom = ((CFG.bottom || 14) + 56) + "px";
    }
    if(launch){
      launch.style.right = (CFG.right || 14) + "px";
      launch.style.bottom = (CFG.bottom || 14) + "px";
    }

    // Launcher text/icons
    var icoEl = qs("[data-emp-launch-ico]", root);
    var tEl = qs("[data-emp-launch-title]", root);
    var sEl = qs("[data-emp-launch-sub]", root);
    if(icoEl) icoEl.textContent = CFG.launcherIcon || "⚙️";
    if(tEl) tEl.textContent = CFG.launcherTitle || "Admin Menu";
    if(sEl) sEl.textContent = CFG.launcherSubtitle || "Quick links";

    // Open state
    var open = (lsGet(KEY_OPEN) === "1");
    setOpen(open);

    // Events
    if(launch){
      launch.addEventListener("click", function(){
        setOpen(!(panel && panel.classList.contains("is-open")));
      });
    }

    // Tabs
    var tabs = qsa(".fcEMP7-tab", root);
    for(var i=0;i<tabs.length;i++){
      tabs[i].addEventListener("click", function(){
        var id = this.getAttribute("data-emp-tab");
        if(!id) return;
        lsSet(KEY_TAB, id);
        render();
      });
    }

    // Search
    var input = qs(".fcEMP7-input", root);
    if(input) input.addEventListener("input", function(){ render(); });

    // Actions
    var acts = qsa("[data-emp-action]", root);
    for(var a=0;a<acts.length;a++){
      acts[a].addEventListener("click", function(e){
        e.stopPropagation();
        var kind = this.getAttribute("data-emp-action");

        if(kind === "close"){ setOpen(false); return; }

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

    // Esc close
    window.addEventListener("keydown", function(e){
      if(e && e.key === "Escape"){
        if(panel && panel.classList.contains("is-open")) setOpen(false);
      }
    });

    updateToggles();
    render();
  }

  function setOpen(isOpen){
    var root = qs(".fcEMP7");
    if(!root) return;
    var panel = qs(".fcEMP7-panel", root);
    var chev = qs(".fcEMP7-launchChev", root);
    if(panel) panel.classList.toggle("is-open", !!isOpen);
    if(chev) chev.textContent = isOpen ? "▾" : "▴";
    lsSet(KEY_OPEN, isOpen ? "1" : "0");
  }

  function updateToggles(){
    var root = qs(".fcEMP7");
    if(!root) return;
    var nt = getNewTab();
    var hb = (lsGet(KEY_HIDE_BAR) === "1");
    var ntBtn = qs('[data-emp-action="newtab"]', root);
    var hbBtn = qs('[data-emp-action="hidebar"]', root);
    if(ntBtn) ntBtn.classList.toggle("is-on", nt);
    if(hbBtn) hbBtn.classList.toggle("is-on", hb);
  }

  function setActiveTabUI(tab){
    var root = qs(".fcEMP7");
    if(!root) return;
    var tabs = qsa(".fcEMP7-tab", root);
    for(var i=0;i<tabs.length;i++){
      tabs[i].classList.toggle("is-active", tabs[i].getAttribute("data-emp-tab") === tab);
    }
  }

  function itemHTML(item, pinned, isActive){
    var url = absUrl(item.url);
    var title = (item.title || "Link").toString();
    var ico = (item.ico || "•").toString();

    return '' +
      '<div class="fcEMP7-item'+(isActive?' is-active':'')+'" data-emp-url="'+encodeURIComponent(url)+'" data-emp-title="'+encodeURIComponent(title)+'">' +
        '<div class="fcEMP7-ico">'+ico+'</div>' +
        '<div style="min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+title+'</div>' +
        '<div class="fcEMP7-right">' +
          '<div class="fcEMP7-pin'+(pinned?' is-on':'')+'" data-emp-pin="'+encodeURIComponent(url)+'" title="Pin">📌</div>' +
        '</div>' +
      '</div>';
  }

  function currentAdminActive(url){
    // Best-effort highlight when you’re on same admin section
    try{
      var p = location.pathname || "";
      var u = url.replace(/^https?:\\/\\/[^/]+/,"");
      if(u === "/admin/settings") return p.indexOf("/admin/settings") === 0;
      return u && p.indexOf(u) === 0;
    }catch(_){ return false; }
  }

  function render(){
    var root = qs(".fcEMP7");
    if(!root) return;

    var tab = activeTab();
    setActiveTabUI(tab);

    var input = qs(".fcEMP7-input", root);
    var q = input ? norm(input.value || "") : "";

    var pins = getPins();
    var body = qs(".fcEMP7-body", root);
    if(!body) return;

    function buildList(list){
      var out = "";
      var shown = 0;
      for(var i=0;i<list.length;i++){
        var it = list[i];
        var url = absUrl(it.url);
        if(!matches({ title: it.title, url: url }, q)) continue;
        var pinned = pins.indexOf(url) !== -1;
        out += itemHTML({ title: it.title, ico: it.ico, url: url }, pinned, currentAdminActive(url));
        shown++;
      }
      if(!shown){
        out = '<div class="fcEMP7-muted">No matches. Try clearing search.</div>';
      }
      return out;
    }

    if(tab === "admin"){
      body.innerHTML = buildList(CFG.adminPrimary || []);
    }else if(tab === "tools"){
      body.innerHTML = buildList(CFG.tools || []);
    }else if(tab === "pinned"){
      var all = (CFG.adminPrimary||[]).concat(CFG.tools||[]);
      var pinnedItems = [];
      for(var p=0;p<pins.length;p++){
        for(var a=0;a<all.length;a++){
          var u = absUrl(all[a].url);
          if(u === pins[p]) pinnedItems.push({ title: all[a].title, ico: all[a].ico, url: u });
        }
      }
      if(!pins.length){
        body.innerHTML = '<div class="fcEMP7-muted">Pinned is empty. Tap 📌 on any item to pin it.</div>';
      }else{
        body.innerHTML = buildList(pinnedItems);
      }
    }else{
      // Prefs
      var nt = getNewTab();
      var hb = (lsGet(KEY_HIDE_BAR) === "1");
      body.innerHTML =
        '<div class="fcEMP7-muted">' +
          '<b style="color:rgba(255,255,255,.92)">Preferences</b><br>' +
          'Saved per browser. Use the top buttons ↗ and 👁.<br><br>' +
          '↗ New tab: <b style="color:rgba(255,255,255,.92)">'+(nt?'ON':'OFF')+'</b><br>' +
          '👁 Admin bar: <b style="color:rgba(255,255,255,.92)">'+(hb?'HIDDEN':'SHOWN')+'</b><br><br>' +
          '<button type="button" data-emp-pref="clearPins" style="width:100%; padding:10px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(0,0,0,.18); color:rgba(255,255,255,.92); font-weight:950; cursor:pointer;">📌 Clear pinned</button>' +
          '<div style="height:8px"></div>' +
          '<button type="button" data-emp-pref="reset" style="width:100%; padding:10px; border-radius:10px; border:1px solid rgba(255,255,255,.12); background:rgba(0,0,0,.18); color:rgba(255,255,255,.92); font-weight:950; cursor:pointer;">🗑️ Reset menu</button>' +
        '</div>';

      // wire pref buttons
      var clear = qs('[data-emp-pref="clearPins"]', body);
      if(clear) clear.addEventListener("click", function(){
        setPins([]);
        render();
      });
      var reset = qs('[data-emp-pref="reset"]', body);
      if(reset) reset.addEventListener("click", function(){
        lsSet(KEY_OPEN, "1");
        lsSet(KEY_TAB, "admin");
        lsSet(KEY_NEW_TAB, (CFG.defaultNewTab ? "1":"0"));
        setPins([]);
        lsSet(KEY_HIDE_BAR, "0");
        hideRafflexBar(false);
        updateToggles();
        render();
      });
    }

    wireClicks();
  }

  function wireClicks(){
    var root = qs(".fcEMP7");
    if(!root) return;

    // Pin clicks
    var pins = qsa("[data-emp-pin]", root);
    for(var i=0;i<pins.length;i++){
      pins[i].onclick = function(e){
        e.preventDefault(); e.stopPropagation();
        var url = decodeURIComponent(this.getAttribute("data-emp-pin") || "");
        if(!url) return;
        var cur = getPins();
        var idx = cur.indexOf(url);
        if(idx === -1) cur.unshift(url);
        else cur.splice(idx,1);
        cur = cur.slice(0, 30);
        setPins(cur);
        render();
      };
    }

    // Row clicks (open)
    var items = qsa(".fcEMP7-item[data-emp-url]", root);
    for(var j=0;j<items.length;j++){
      items[j].onclick = function(){
        var url = decodeURIComponent(this.getAttribute("data-emp-url") || "");
        if(!url) return;
        var nt = getNewTab();
        try{
          if(nt) window.open(url, "_blank", "noopener");
          else location.href = url;
        }catch(_){
          location.href = url;
        }
      };
    }
  }

  function ensure(){
    var existing = qs(".fcEMP7");
    if(!isDesktop()){
      if(existing) existing.remove();
      return;
    }
    buildUI();
    hideRafflexBar(lsGet(KEY_HIDE_BAR) === "1");
  }

  function hookHistory(){
    if(window.__fcEMP_histHooked_v7) return;
    window.__fcEMP_histHooked_v7 = true;

    var _push = history.pushState;
    var _rep = history.replaceState;

    history.pushState = function(){
      _push.apply(history, arguments);
      setTimeout(ensure, 60);
      setTimeout(function(){
        var root = qs(".fcEMP7");
        if(root){
          var sub = qs(".fcEMP7-sub", root);
          if(sub) sub.textContent = "📍 " + (location.pathname || "/");
        }
      }, 80);
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

    // re-ensure for dynamic loads
    var tries = 0, max = 20;
    var t = setInterval(function(){
      tries++;
      ensure();
      if(tries >= max) clearInterval(t);
    }, 250);

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
