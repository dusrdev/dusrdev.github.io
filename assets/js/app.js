(function() {
  const username = 'dusrdev';
  const grid = document.getElementById('projects-grid');
  const err = document.getElementById('projects-error');
  if (!grid) return;

  const curatedProjects = [
    {
      repo: 'PrettyConsole',
      kicker: 'Featured Work',
      summary: 'Ultra-low-latency, allocation-free console rendering for C# and .NET.',
      featured: true,
      packageId: 'PrettyConsole'
    },
    {
      repo: 'ArrowDb',
      kicker: 'Storage Engine',
      summary: 'A hyper-light, performance-oriented NoSQL database designed for .NET.',
      featured: false,
      packageId: 'ArrowDb'
    },
    {
      repo: 'Payload',
      kicker: 'Build Tooling',
      summary: 'A build-time NuGet helper for packages that need to place bundled files into a consumer repository during build.',
      featured: false,
      packageId: 'Payload'
    },
    {
      repo: 'Seek',
      kicker: 'CLI Search',
      summary: 'A very fast filesystem search CLI written with modern C#.',
      featured: false,
      packageId: 'Seek'
    },
    {
      repo: 'Pulse',
      kicker: 'HTTP Tooling',
      summary: 'A hyper-fast general-purpose HTTP request tester.',
      featured: false
    },
    {
      repo: 'Sharpify',
      kicker: 'Language Extensions',
      summary: 'A collection of high-performance language extensions for C#.',
      featured: false,
      packageId: 'Sharpify'
    },
    {
      repo: 'Verifast',
      kicker: 'Validation',
      summary: 'A high-performance validation library for .NET.',
      featured: false,
      packageId: 'Verifast'
    }
  ];

  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') el.className = value;
      else if (key === 'href') el.setAttribute('href', value);
      else if (key === 'target') el.setAttribute('target', value);
      else if (key === 'rel') el.setAttribute('rel', value);
      else if (key.startsWith('aria-')) el.setAttribute(key, value);
      else el[key] = value;
    });
    children.flat().forEach((child) => {
      if (child == null) return;
      el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return el;
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  }

  function formatCompactPlus(value) {
    try {
      return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: value >= 10000 ? 1 : 0 })
        .format(value)
        .replace(/\s/g, '') + '+';
    } catch {
      if (value >= 1_000_000) return `${Math.round(value / 100_000) / 10}M+`;
      if (value >= 1_000) return `${Math.round(value / 100) / 10}K+`;
      return `${value}+`;
    }
  }

  function renderMeta(repo) {
    const items = [
      typeof repo.stargazers_count === 'number' ? `Stars ${repo.stargazers_count}` : null,
      repo.language || null,
      repo.pushed_at ? `Updated ${formatDate(repo.pushed_at)}` : null
    ].filter(Boolean);

    return h(
      'div',
      { class: 'meta' },
      items.map((item) => h('span', {}, item))
    );
  }

  function renderDownloads(downloads) {
    if (!downloads.length) return null;

    return h(
      'div',
      { class: 'project-downloads' },
      downloads.map((download) =>
        h(
          'span',
          {
            class: 'download-pill',
            title: download.title,
            'aria-label': download.ariaLabel
          },
          `${download.label} · ${formatCompactPlus(download.value)}`
        )
      )
    );
  }

  function renderFacts(repo, downloads) {
    return h(
      'div',
      { class: 'project-facts' },
      renderMeta(repo),
      renderDownloads(downloads)
    );
  }

  function renderRepo(repo, config, downloads) {
    const url = repo.html_url || `https://github.com/${username}/${config.repo}`;
    const cardClass = config.featured ? 'card featured' : 'card';
    const title = h('h3', {}, repo.name || config.repo);
    const description = h('p', {}, config.summary);
    const kicker = h('p', { class: 'card-kicker' }, config.kicker);
    const link = h('a', { href: url, target: '_blank', rel: 'noopener' }, 'View on GitHub');
    const facts = renderFacts(repo, downloads);

    if (config.featured) {
      return h(
        'article',
        { class: cardClass },
        h(
          'div',
          { class: 'card-copy' },
          kicker,
          title,
          description
        ),
        h(
          'div',
          { class: 'card-side' },
          facts,
          link
        )
      );
    }

    return h(
      'article',
      { class: cardClass },
      kicker,
      title,
      description,
      facts,
      link
    );
  }

  async function fetchRepo(config) {
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${config.repo}`, {
        headers: { 'Accept': 'application/vnd.github+json' }
      });

      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  }

  async function fetchNugetDownloads(packageId) {
    if (!packageId) return null;

    const endpoints = [
      `https://azuresearch-usnc.nuget.org/query?q=packageid:${encodeURIComponent(packageId)}&prerelease=false&take=1`,
      `https://api-v2v3search-0.nuget.org/query?q=packageid:${encodeURIComponent(packageId)}&prerelease=false&take=1`
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) continue;

        const payload = await response.json();
        const match = Array.isArray(payload?.data)
          ? payload.data.find((item) => String(item?.id).toLowerCase() === packageId.toLowerCase())
          : null;

        if (typeof match?.totalDownloads === 'number' && match.totalDownloads > 0) {
          return match.totalDownloads;
        }
      } catch {
        // try next endpoint
      }
    }

    return null;
  }

  async function fetchReleaseDownloads(repoName) {
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/releases?per_page=100`, {
        headers: { 'Accept': 'application/vnd.github+json' }
      });
      if (!response.ok) return null;

      const releases = await response.json();
      if (!Array.isArray(releases) || !releases.length) return null;

      const total = releases.reduce((releaseSum, release) => {
        const assets = Array.isArray(release.assets) ? release.assets : [];
        return releaseSum + assets.reduce((assetSum, asset) => assetSum + (asset.download_count || 0), 0);
      }, 0);

      return total > 0 ? total : null;
    } catch {
      return null;
    }
  }

  async function hydrateProject(config) {
    const [repo, nugetDownloads, releaseDownloads] = await Promise.all([
      fetchRepo(config),
      fetchNugetDownloads(config.packageId),
      fetchReleaseDownloads(config.repo)
    ]);

    const downloads = [
      typeof nugetDownloads === 'number'
        ? {
            label: 'NuGet',
            value: nugetDownloads,
            title: `${nugetDownloads.toLocaleString()} total NuGet downloads`,
            ariaLabel: `${nugetDownloads.toLocaleString()} total NuGet downloads`
          }
        : null,
      typeof releaseDownloads === 'number'
        ? {
            label: 'Releases',
            value: releaseDownloads,
            title: `${releaseDownloads.toLocaleString()} GitHub release downloads`,
            ariaLabel: `${releaseDownloads.toLocaleString()} GitHub release downloads`
          }
        : null
    ].filter(Boolean);

    return {
      repo: repo || {
        name: config.repo,
        html_url: `https://github.com/${username}/${config.repo}`,
        stargazers_count: null,
        language: '',
        pushed_at: ''
      },
      downloads
    };
  }

  async function loadRepos() {
    try {
      const projects = await Promise.all(curatedProjects.map(hydrateProject));
      const rendered = projects.map((project, index) =>
        renderRepo(project.repo, curatedProjects[index], project.downloads)
      );

      if (!rendered.length) {
        grid.appendChild(h('p', { class: 'muted' }, 'Unable to load curated work right now.'));
        return;
      }

      rendered.forEach((card) => grid.appendChild(card));
    } catch (e) {
      console.error(e);
      err.textContent = 'Unable to load projects from GitHub right now.';
      err.classList.remove('hidden');
    }
  }

  loadRepos();
})();
