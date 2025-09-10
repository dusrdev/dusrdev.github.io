(function() {
  const owner = 'dusrdev';
  const el = document.getElementById('nuget-downloads');
  if (!el) return;

  function formatCompact(n) {
    try {
      return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(n);
    } catch {
      if (n >= 1_000_000) return Math.round(n / 100_000) / 10 + 'M';
      if (n >= 1_000) return Math.round(n / 100) / 10 + 'K';
      return String(n);
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
    el.textContent = 'NuGet downloads: loading…';
    const total = await getTotal();
    if (typeof total === 'number' && total > 0) {
      const compact = formatCompact(total);
      el.textContent = `NuGet downloads: ${total.toLocaleString()} (${compact}+)`;
      el.title = `${total.toLocaleString()} total downloads across all packages`;
      el.setAttribute('aria-label', `${total.toLocaleString()} total NuGet downloads`);
    } else {
      // Graceful fallback
      el.textContent = 'NuGet downloads: 30k+';
      el.title = 'Approximate total downloads';
      el.setAttribute('aria-label', 'Approximate total NuGet downloads: 30k+');
    }
  })();
})();

