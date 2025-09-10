(function() {
  const owner = 'dusrdev';
  const el = document.getElementById('nuget-button');
  if (!el) return;

  function formatCompactPlus(n) {
    try {
      const base = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(n).replace(/\s/g, '');
      return base + '+';
    } catch {
      if (n >= 1_000_000) return Math.round(n / 100_000) / 10 + 'M+';
      if (n >= 1_000) return Math.round(n / 100) / 10 + 'K+';
      return String(n) + '+';
    }
  }

  async function getTotal() {
    const endpoints = [
      `https://azuresearch-usnc.nuget.org/query?q=owner:${owner}&take=100`,
      `https://api-v2v3search-0.nuget.org/query?q=owner:${owner}&take=100`,
      `https://api-v2v3search-0.nuget.org/query?q=author:${owner}&take=100`
    ];

    for (const url of endpoints) {
      try {
        const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!resp.ok) continue;
        const data = await resp.json();
        const list = Array.isArray(data?.data) ? data.data : [];
        if (!list.length) continue;
        const total = list.reduce((sum, p) => sum + (p.totalDownloads || 0), 0);
        return total;
      } catch {
        // try next
      }
    }
    return null;
  }

  (async () => {
    el.textContent = 'NuGet · loading…';
    const total = await getTotal();
    if (typeof total === 'number' && total > 0) {
      const compact = formatCompactPlus(total);
      el.textContent = `NuGet · ${compact}`;
      el.title = `${total.toLocaleString()} total downloads across all packages`;
      el.setAttribute('aria-label', `${total.toLocaleString()} total NuGet downloads`);
    } else {
      // Graceful fallback (keep subtle)
      el.textContent = 'NuGet · 30K+';
      el.title = 'Approximate total downloads';
      el.setAttribute('aria-label', 'Approximate total NuGet downloads: 30K+');
    }
  })();
})();

