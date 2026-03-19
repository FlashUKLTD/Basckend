(() => {
  const CFG = {
    navSelector: 'nav[aria-label="Global"]',
    underlineClass: 'fcNavSwiftUnderline',
    badgeClass: 'fcNavSwiftBadge',
    lineClass: 'fcNavSwiftLine',
    logoUrl: 'https://res.cloudinary.com/dpf31pprv/image/upload/v1773944256/icon_kqb7nj.png'
  };

  function buildUnderline(root){
    if(!root) return;

    let underline = root.querySelector(':scope > .' + CFG.underlineClass);
    if(underline) return;

    underline = document.createElement('div');
    underline.className = CFG.underlineClass;
    underline.setAttribute('aria-hidden', 'true');

    const left = document.createElement('div');
    left.className = CFG.lineClass + ' left';

    const right = document.createElement('div');
    right.className = CFG.lineClass + ' right';

    const badge = document.createElement('div');
    badge.className = CFG.badgeClass;

    const img = document.createElement('img');
    img.src = CFG.logoUrl;
    img.alt = '';

    badge.appendChild(img);
    underline.appendChild(left);
    underline.appendChild(right);
    underline.appendChild(badge);

    root.appendChild(underline);
  }

  function init(){
    document.querySelectorAll(CFG.navSelector).forEach(buildUnderline);
  }

  let raf = null;
  function schedule(){
    if(raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(init);
  }

  init();

  const obs = new MutationObserver(schedule);
  obs.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setTimeout(() => {
    try { obs.disconnect(); } catch (e) {}
  }, 20000);
})();

(() => {
  if (location.pathname !== '/basket') return;

  const apply = () => {
    document.body.classList.add('fc-basket-hide-footer');
  };

  apply();

  const mo = new MutationObserver(() => apply());
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();

(() => {

  const TARGET = "https://flashcompetitions.com/lists";
  const REPLACEMENT = "https://flashcompetitions.com/i/lists";

  function fixLinks(){
    document.querySelectorAll('a[href="https://flashcompetitions.com/lists"]').forEach(el=>{
      el.href = REPLACEMENT;
    });
  }

  // run immediately
  fixLinks();

  // run again if nav reloads (Livewire / Flux)
  const obs = new MutationObserver(fixLinks);
  obs.observe(document.documentElement,{
    childList:true,
    subtree:true
  });

})();

(() => {
  const TARGET = "https://flashcompetitions.com/i/competitions";

  function buildDirectLinkFromButton(btn){
    if (!btn || btn.tagName.toLowerCase() === "a") return;
    if (btn.dataset.fcConverted === "1") return;

    const iconHtml = btn.querySelector(".fcNavX-ico")?.outerHTML || "";
    const txt = "Competitions";

    const link = document.createElement("a");
    link.id = "categories-header";
    link.href = TARGET;
    link.className = (btn.className || "") + " fcCompDirectLink";
    link.dataset.fcConverted = "1";

    link.innerHTML = `
      ${iconHtml}
      <span class="fcNavX-txt">${txt}</span>
    `;

    btn.replaceWith(link);
  }

  function apply(){
    const buttons = [...document.querySelectorAll('button#categories-header')];
    buttons.forEach(buildDirectLinkFromButton);
  }

  apply();

  const mo = new MutationObserver(() => apply());
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();

(() => {
  if (!/\/login\/?$/.test(location.pathname)) return;

  const apply = () => {
    document.body.classList.add('fc-login-page');
  };

  apply();

  const mo = new MutationObserver(() => apply());
  mo.observe(document.documentElement, { childList:true, subtree:true });
})();

(() => {
  if (!/\/register\/?$/.test(location.pathname)) return;

  const apply = () => {
    document.body.classList.add('fc-register-page');
  };

  apply();

  const mo = new MutationObserver(() => apply());
  mo.observe(document.documentElement, { childList:true, subtree:true });
})();

(() => {
  if (!/^\/(login|register)\/?$/.test(location.pathname)) return;

  const apply = () => {
    document.body.classList.add('fc-auth-hide-heading');
  };

  apply();

  const mo = new MutationObserver(() => apply());
  mo.observe(document.documentElement, { childList:true, subtree:true });
})();
