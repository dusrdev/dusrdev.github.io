(function() {
  const card = document.getElementById('experience-card');
  const content = document.getElementById('exp-content');
  const line1 = document.getElementById('exp-line1');
  const line2 = document.getElementById('exp-line2');
  const dates = document.getElementById('exp-dates');
  const prevBtn = document.querySelector('.exp-nav.prev');
  const nextBtn = document.querySelector('.exp-nav.next');
  if (!card || !line1 || !line2 || !dates) return;

  const entries = [
    {
      role: 'Software Engineer', company: 'Elspec', dates: 'Jan 2026 - Present',
      summary: 'Building resilient C# systems, APIs, and kiosk tooling around hardware telemetry, binary protocols, and operational reliability.'
    },
    {
      role: 'Software Support', company: 'Bright Data', dates: 'Aug 2024 - Jan 2025',
      summary: 'Worked across SDK and proxy debugging, while building a cross-platform load-testing CLI for real support workflows.'
    },
    {
      role: 'System Administrator', company: 'A.D Insurance', dates: 'May 2022 - Oct 2023',
      summary: 'Owned automation around legacy software and handled secure VPN and authentication setups for remote operations.'
    }
  ];

  let i = 0;
  function render(index) {
    const e = entries[index];
    content.style.opacity = 0;
    setTimeout(() => {
      line1.textContent = `${e.role} · ${e.company}`;
      line2.textContent = e.summary;
      dates.textContent = e.dates;
      content.style.opacity = 1;
    }, 160);
  }

  function next() {
    i = (i + 1) % entries.length;
    render(i);
  }
  function prev() {
    i = (i - 1 + entries.length) % entries.length;
    render(i);
  }

  // Events
  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); }
    else if (e.key === 'ArrowLeft') { prev(); }
  });

  // Init
  render(i);
})();
