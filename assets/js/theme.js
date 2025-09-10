(function(){
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-toggle-icon');
  if (!btn || !icon) return;

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const MODES = ['dark','light','auto'];

  function getStored(){ return localStorage.getItem('theme') || 'auto'; }
  function setStored(v){ localStorage.setItem('theme', v); }

  function apply(mode){
    if (mode === 'dark' || mode === 'light') {
      document.documentElement.setAttribute('data-theme', mode);
    } else { // auto
      document.documentElement.removeAttribute('data-theme');
    }
    updateIcon();
  }

  function currentMode(){
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    return 'auto';
  }

  function effectiveTheme(){
    const mode = currentMode();
    if (mode === 'dark' || mode === 'light') return mode;
    return mql.matches ? 'dark' : 'light';
  }

  function svgSun(){
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07 6.93-1.41-1.41M6.34 6.34 4.93 4.93m12.73 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>';
  }
  function svgMoon(){
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  function svgAuto(){
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v18"/><circle cx="8" cy="12" r="3"/><path d="M16 7a5 5 0 1 0 0 10"/></svg>';
  }

  function updateIcon(){
    const mode = currentMode();
    const eff = effectiveTheme();
    let svg = svgAuto();
    if (mode === 'dark') svg = svgMoon();
    else if (mode === 'light') svg = svgSun();
    icon.innerHTML = svg;

    const next = MODES[(MODES.indexOf(mode)+1)%MODES.length];
    const nextLabel = next === 'auto' ? 'auto (system)' : next;
    const status = mode === 'auto' ? `Auto (system: ${eff})` : (mode.charAt(0).toUpperCase()+mode.slice(1));
    btn.setAttribute('aria-label', `Theme: ${status}. Click to switch to ${nextLabel}`);
    btn.title = btn.getAttribute('aria-label');
  }

  btn.addEventListener('click', () => {
    const mode = currentMode();
    const next = MODES[(MODES.indexOf(mode)+1)%MODES.length];
    setStored(next);
    apply(next);
  });

  // Respond to system changes when in auto
  mql.addEventListener?.('change', () => {
    if (currentMode() === 'auto') updateIcon();
  });

  // Initialize from storage
  const stored = getStored();
  apply(stored);
})();

