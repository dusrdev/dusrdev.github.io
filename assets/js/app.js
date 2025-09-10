(function() {
  const username = 'dusrdev';
  const grid = document.getElementById('projects-grid');
  const err = document.getElementById('projects-error');

  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') el.className = v;
      else if (k === 'href') el.setAttribute('href', v);
      else if (k === 'target') el.setAttribute('target', v);
      else if (k === 'rel') el.setAttribute('rel', v);
      else el[k] = v;
    });
    children.flat().forEach(c => {
      if (c == null) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  function formatDate(iso) {
    try { return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }); }
    catch { return ''; }
  }

  function scoreRepo(r) {
    // Heuristic score: stargazers + recent activity + has topics + not fork
    const stars = r.stargazers_count || 0;
    const fresh = Math.max(0, 60 - Math.min(60, (Date.now() - new Date(r.pushed_at).getTime()) / (1000 * 60 * 60 * 24)));
    const topics = (r.topics?.length || 0) * 2;
    const notFork = r.fork ? -10 : 5;
    return stars * 1.5 + fresh + topics + notFork;
  }

  function renderRepo(r) {
    const meta = [
      `★ ${r.stargazers_count ?? r.stars ?? 0}`,
      r.language ? r.language : null,
      r.pushed_at ? `Updated ${formatDate(r.pushed_at)}` : null,
    ].filter(Boolean);

    const url = r.html_url || r.link || (r.owner && r.repo ? `https://github.com/${r.owner}/${r.repo}` : '#');

    const card = h('div', { class: 'card' },
      h('h3', {}, r.name || r.repo || 'Repository'),
      h('p', {}, r.description || 'No description provided.'),
      h('div', { class: 'meta' }, meta.join(' • ')),
      h('a', { href: url, target: '_blank', rel: 'noopener' }, 'View on GitHub')
    );
    return card;
  }

  async function tryPinnedFromLocalJson() {
    try {
      const resp = await fetch('/assets/data/pinned.json', { cache: 'no-store' });
      if (!resp.ok) return false;
      const data = await resp.json();
      const entries = Array.isArray(data) ? data : (data.pinned || []);
      if (!entries.length) return false;
      const limited = entries.slice(0, 6);
      const promises = limited.map(full => {
        const [owner, repo] = full.split('/');
        return fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: { 'Accept': 'application/vnd.github+json' }
        }).then(r => r.ok ? r.json() : null).catch(() => null);
      });
      const results = await Promise.all(promises);
      const repos = results.filter(Boolean);
      if (!repos.length) return false;
      repos.forEach(r => grid.appendChild(renderRepo(r)));
      return true;
    } catch { return false; }
  }

  async function tryPinnedFromPublicService() {
    try {
      const resp = await fetch(`https://gh-pinned-repos.egoist.dev/?username=${username}`);
      if (!resp.ok) return false;
      const list = await resp.json(); // [{ repo, owner, description, language, stars, link }]
      if (!Array.isArray(list) || !list.length) return false;
      list.slice(0, 6).forEach(item => grid.appendChild(renderRepo(item)));
      return true;
    } catch { return false; }
  }

  async function loadRepos() {
    const ordered = [
      'Sharpify',
      'PrettyConsole',
      'ArrowDb',
      'Pulse',
      'PdfTool',
      'PuppeteerSharpToolkit'
    ];

    try {
      const results = [];
      for (const name of ordered) {
        try {
          const r = await fetch(`https://api.github.com/repos/${username}/${name}`, {
            headers: { 'Accept': 'application/vnd.github+json' }
          });
          if (r.ok) {
            results.push(await r.json());
          } else {
            results.push(null);
          }
        } catch {
          results.push(null);
        }
      }

      const any = results.some(Boolean);
      if (!any) {
        grid.appendChild(h('p', { class: 'muted' }, 'No repositories found to display.'));
        return;
      }
      results.forEach(r => { if (r) grid.appendChild(renderRepo(r)); });
    } catch (e) {
      console.error(e);
      err.textContent = 'Unable to load projects from GitHub right now.';
      err.classList.remove('hidden');
    }
  }

  if (grid) loadRepos();
})();

