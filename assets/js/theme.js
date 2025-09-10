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
    // Yin-yang style: circle, S-curve, and two small dots
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a4.5 4.5 0 0 1 0 9a4.5 4.5 0 0 0 0 9"/><circle cx="12" cy="7.5" r="1"/><circle cx="12" cy="16.5" r="1"/></svg>';
  }

  function updateIcon(){
    const mode = currentMode();
    const eff = effectiveTheme();
    let svg = svgAuto();
    let label = 'Auto';
    if (mode === 'dark') { svg = svgMoon(); label = 'Dark'; }
    else if (mode === 'light') { svg = svgSun(); label = 'Light'; }
    icon.innerHTML = svg;
    const lbl = document.getElementById('theme-toggle-label');
    if (lbl) lbl.textContent = label;

    let next;
    if (mode === 'auto') next = (eff === 'dark' ? 'light' : 'dark');
    else if (mode === 'dark') next = 'light';
    else next = 'auto';

    const nextLabel = next === 'auto' ? 'auto (system)' : next;
    const status = mode === 'auto' ? `Auto (system: ${eff})` : (mode.charAt(0).toUpperCase()+mode.slice(1));
    btn.setAttribute('aria-label', `Theme: ${status}. Click to switch to ${nextLabel}`);
    btn.title = btn.getAttribute('aria-label');
  }

  btn.addEventListener('click', () => {
    const mode = currentMode();
    let next;
    if (mode === 'auto') {
      next = (effectiveTheme() === 'dark' ? 'light' : 'dark');
    } else if (mode === 'dark') {
      next = 'light';
    } else {
      next = 'auto';
    }
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

