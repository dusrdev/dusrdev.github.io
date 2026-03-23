(function() {
  const username = 'dusrdev';
  const cacheTtlMs = 1000 * 60 * 60 * 6;
  const grid = document.getElementById('projects-grid');
  const err = document.getElementById('projects-error');
  const contributionFacts = document.getElementById('contribution-facts');
  if (!grid && !contributionFacts) return;

  const curatedProjects = [
    {
      repo: 'PrettyConsole',
      kicker: 'Featured Work',
      summary: 'Ultra-low-latency, allocation-free console rendering for C# and .NET.',
      featured: true,
      packageId: 'PrettyConsole',
      hasReleaseDownloads: false
    },
    {
      repo: 'ArrowDb',
      kicker: 'Storage Engine',
      summary: 'A hyper-light, performance-oriented NoSQL database designed for .NET.',
      featured: false,
      packageId: 'ArrowDb',
      hasReleaseDownloads: false
    },
    {
      repo: 'Payload',
      kicker: 'Build Tooling',
      summary: 'A build-time NuGet helper for packages that need to place bundled files into a consumer repository during build.',
      featured: false,
      packageId: 'Payload',
      hasReleaseDownloads: false
    },
    {
      repo: 'Seek',
      kicker: 'CLI Search',
      summary: 'A very fast filesystem search CLI written with modern C#.',
      featured: false,
      packageId: 'Seek',
      hasReleaseDownloads: true
    },
    {
      repo: 'Pulse',
      kicker: 'HTTP Tooling',
      summary: 'A hyper-fast general-purpose HTTP request tester.',
      featured: false,
      hasReleaseDownloads: true
    },
    {
      repo: 'Sharpify',
      kicker: 'Language Extensions',
      summary: 'A collection of high-performance language extensions for C#.',
      featured: false,
      packageId: 'Sharpify',
      hasReleaseDownloads: false
    },
    {
      repo: 'Verifast',
      kicker: 'Validation',
      summary: 'A high-performance validation library for .NET.',
      featured: false,
      packageId: 'Verifast',
      hasReleaseDownloads: false
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

  function readCache(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;

      return {
        data: parsed.data,
        fresh: typeof parsed.ts === 'number' && (Date.now() - parsed.ts) < cacheTtlMs
      };
    } catch {
      return null;
    }
  }

  function writeCache(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
    } catch {
      // Ignore storage failures.
    }
  }

  function renderMeta(repo) {
    const items = [
      typeof repo.stargazers_count === 'number' ? `Stars ${repo.stargazers_count}` : null,
      repo.language || null,
      repo.pushed_at ? `Updated ${formatDate(repo.pushed_at)}` : null
    ].filter(Boolean);

    if (!items.length) return null;

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

  function renderContributionPills(items) {
    if (!items.length) return null;

    return h(
      'div',
      { class: 'project-downloads' },
      items.map((item) =>
        h(
          'span',
          {
            class: 'download-pill',
            title: item.title,
            'aria-label': item.ariaLabel
          },
          `${item.label} · ${formatCompactPlus(item.value)}`
        )
      )
    );
  }

  function renderFacts(repo, downloads) {
    const meta = renderMeta(repo);
    const downloadPills = renderDownloads(downloads);

    if (!meta && !downloadPills) return null;

    return h(
      'div',
      { class: 'project-facts' },
      meta,
      downloadPills
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

  async function fetchGitHubRepo(owner, repoName) {
    const cacheKey = `github:repo:${owner}/${repoName}`;
    const cached = readCache(cacheKey);
    if (cached?.fresh) return cached.data;

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
        headers: { 'Accept': 'application/vnd.github+json' }
      });

      if (!response.ok) return cached?.data || null;

      const payload = await response.json();
      writeCache(cacheKey, payload);
      return payload;
    } catch {
      return cached?.data || null;
    }
  }

  async function fetchRepo(config) {
    return fetchGitHubRepo(username, config.repo);
  }

  async function fetchUserRepos(owner) {
    const cacheKey = `github:user-repos:${owner}`;
    const cached = readCache(cacheKey);
    if (cached?.fresh) return cached.data;

    try {
      const response = await fetch(`https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`, {
        headers: { 'Accept': 'application/vnd.github+json' }
      });
      if (!response.ok) return cached?.data || null;

      const payload = await response.json();
      if (Array.isArray(payload)) {
        writeCache(cacheKey, payload);
        return payload;
      }
      return cached?.data || null;
    } catch {
      return cached?.data || null;
    }
  }

  async function fetchNugetDownloads(packageId) {
    if (!packageId) return null;

    const cacheKey = `nuget:downloads:${packageId.toLowerCase()}`;
    const cached = readCache(cacheKey);
    if (cached?.fresh) return cached.data;

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
          writeCache(cacheKey, match.totalDownloads);
          return match.totalDownloads;
        }
      } catch {
        // try next endpoint
      }
    }

    return cached?.data || null;
  }

  async function fetchReleaseDownloads(repoName) {
    const cacheKey = `github:release-downloads:${username}/${repoName}`;
    const cached = readCache(cacheKey);
    if (cached?.fresh) return cached.data;

    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/releases?per_page=100`, {
        headers: { 'Accept': 'application/vnd.github+json' }
      });
      if (!response.ok) return cached?.data || null;

      const releases = await response.json();
      if (!Array.isArray(releases) || !releases.length) return cached?.data || null;

      const total = releases.reduce((releaseSum, release) => {
        const assets = Array.isArray(release.assets) ? release.assets : [];
        return releaseSum + assets.reduce((assetSum, asset) => assetSum + (asset.download_count || 0), 0);
      }, 0);

      if (total > 0) {
        writeCache(cacheKey, total);
        return total;
      }

      return cached?.data || null;
    } catch {
      return cached?.data || null;
    }
  }

  async function hydrateProject(config, repoMap) {
    const [repo, nugetDownloads, releaseDownloads] = await Promise.all([
      Promise.resolve(repoMap.get(config.repo) || null),
      fetchNugetDownloads(config.packageId),
      config.hasReleaseDownloads ? fetchReleaseDownloads(config.repo) : Promise.resolve(null)
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

  async function loadContributionFacts() {
    if (!contributionFacts) return;

    try {
      const [repo, nugetDownloads] = await Promise.all([
        fetchGitHubRepo('Cysharp', 'ConsoleAppFramework'),
        fetchNugetDownloads('ConsoleAppFramework')
      ]);

      const pills = [
        typeof repo?.stargazers_count === 'number'
          ? {
              label: 'Stars',
              value: repo.stargazers_count,
              title: `${repo.stargazers_count.toLocaleString()} GitHub stars`,
              ariaLabel: `${repo.stargazers_count.toLocaleString()} GitHub stars`
            }
          : null,
        typeof nugetDownloads === 'number'
          ? {
              label: 'NuGet',
              value: nugetDownloads,
              title: `${nugetDownloads.toLocaleString()} total NuGet downloads`,
              ariaLabel: `${nugetDownloads.toLocaleString()} total NuGet downloads`
            }
          : null
      ].filter(Boolean);

      const rendered = renderContributionPills(pills);
      if (rendered) contributionFacts.appendChild(rendered);
    } catch {
      // Keep the contribution card stable if upstream APIs fail.
    }
  }

  async function loadRepos() {
    try {
      const repoList = await fetchUserRepos(username);
      const repoMap = new Map(Array.isArray(repoList) ? repoList.map((repo) => [repo.name, repo]) : []);
      const projects = await Promise.all(curatedProjects.map((config) => hydrateProject(config, repoMap)));
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

  if (grid) loadRepos();
  loadContributionFacts();
})();
