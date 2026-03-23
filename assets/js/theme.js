(function() {
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-toggle-icon');
  const label = document.getElementById('theme-toggle-label');
  if (!btn || !icon) return;

  function getStored() {
    const value = localStorage.getItem('theme');
    return value === 'light' || value === 'dark' ? value : 'dark';
  }

  function setStored(value) {
    localStorage.setItem('theme', value);
  }

  function currentMode() {
    const attr = document.documentElement.getAttribute('data-theme');
    return attr === 'light' ? 'light' : 'dark';
  }

  function nextMode(mode) {
    return mode === 'dark' ? 'light' : 'dark';
  }

  function svgSun() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07 6.93-1.41-1.41M6.34 6.34 4.93 4.93m12.73 0-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>';
  }

  function svgMoon() {
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  function apply(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    updateIcon();
  }

  function updateIcon(animate = false) {
    const mode = currentMode();

    const doSwap = () => {
      const isDark = mode === 'dark';
      icon.innerHTML = isDark ? svgMoon() : svgSun();
      if (label) label.textContent = isDark ? 'Dark' : 'Light';

      const next = nextMode(mode);
      btn.setAttribute('aria-label', `Theme: ${isDark ? 'Dark' : 'Light'}. Click to switch to ${next}`);
      btn.title = btn.getAttribute('aria-label');
    };

    if (animate) {
      [icon, label].forEach((el) => {
        if (el) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(-2px)';
        }
      });
      setTimeout(() => {
        doSwap();
        [icon, label].forEach((el) => {
          if (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
          }
        });
      }, 140);
    } else {
      doSwap();
    }
  }

  btn.addEventListener('click', () => {
    const next = nextMode(currentMode());
    setStored(next);
    apply(next);
    updateIcon(true);
  });

  apply(getStored());
})();
