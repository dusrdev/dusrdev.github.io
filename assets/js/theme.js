(function(){
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-toggle-icon');
  if (!btn || !icon) return;

  const mql = window.matchMedia('(prefers-color-scheme: dark)');

  function getStored(){ return localStorage.getItem('theme'); }
  function setStored(v){ if (v) localStorage.setItem('theme', v); else localStorage.removeItem('theme'); }

  function apply(theme){
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    updateIcon();
  }

  function effectiveTheme(){
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return mql.matches ? 'dark' : 'light';
  }

  function updateIcon(){
    const eff = effectiveTheme();
    icon.textContent = eff === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', `Switch to ${eff === 'dark' ? 'light' : 'dark'} theme`);
    btn.title = btn.getAttribute('aria-label');
  }

  btn.addEventListener('click', () => {
    const eff = effectiveTheme();
    const next = eff === 'dark' ? 'light' : 'dark';
    setStored(next);
    apply(next);
  });

  // Initialize from storage
  const stored = getStored();
  apply(stored);
})();

