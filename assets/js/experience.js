(function() {
  const el = document.getElementById('experience-line');
  if (!el) return;

  const items = [
    'Software Support — Bright Data (Aug 2024–Jan 2025): SDK/proxy support and debugging',
    'Built cross‑platform CLI for proxy load testing and metrics — Bright Data',
    'System Administrator — A.D Insurance (May 2022–Oct 2023): automation and secure remote access',
    'Configured VPN and authentication for remote work — A.D Insurance',
    'Open‑source: authored multiple performance‑focused libraries and tools',
    'BSc Business & Computer Science — Open University of Israel'
  ];

  let i = 0;
  function next() {
    el.style.opacity = 0;
    setTimeout(() => {
      el.textContent = items[i];
      el.style.opacity = 1;
      i = (i + 1) % items.length;
    }, 180);
  }

  // Initialize and rotate
  el.textContent = items[0];
  el.style.opacity = 1;
  setInterval(next, 4000);
})();

