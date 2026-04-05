(function () {
  if (window.__FLASH_LOADER__) return;
  window.__FLASH_LOADER__ = true;

  var REPO_BASE = "https://cdn.jsdelivr.net/gh/FlashUKLTD/Basckend@main";
  var VERSION_URL = REPO_BASE + "/flash.version.json?ts=" + Date.now();

  function loadCss(href) {
    if (document.querySelector('link[data-flash-asset="css"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.setAttribute("data-flash-asset", "css");
    document.head.appendChild(link);
  }

  function loadJs(src) {
    if (document.querySelector('script[data-flash-asset="js"]')) return;
    var script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.setAttribute("data-flash-asset", "js");
    document.head.appendChild(script);
  }

  function loadAssets(version) {
    var v = encodeURIComponent(String(version || "1"));
    loadCss(REPO_BASE + "/flash.css?v=" + v);
    loadJs(REPO_BASE + "/flash.js?v=" + v);
  }

  fetch(VERSION_URL, { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("Version fetch failed");
      return res.json();
    })
    .then(function (data) {
      loadAssets(data.version);
    })
    .catch(function () {
      loadAssets("fallback");
    });
})();