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
    const lang = r.language ? ` • ${r.language}` : '';
    const meta = [
      `★ ${r.stargazers_count ?? 0}`,
      r.language ? r.language : null,
      `Updated ${formatDate(r.pushed_at)}`,
    ].filter(Boolean);

    const card = h('div', { class: 'card' },
      h('h3', {}, r.name),
      h('p', {}, r.description || 'No description provided.'),
      h('div', { class: 'meta' }, meta.join(' • ')),
      h('a', { href: r.html_url, target: '_blank', rel: 'noopener' }, 'View on GitHub')
    );
    return card;
  }

  async function loadRepos() {
    try {
      const resp = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: { 'Accept': 'application/vnd.github+json' }
      });
      if (!resp.ok) throw new Error(`GitHub API responded ${resp.status}`);
      const repos = await resp.json();

      // Filter and sort
      const filtered = (repos || [])
        .filter(r => !r.archived)
        .sort((a, b) => scoreRepo(b) - scoreRepo(a));

      const top = filtered.slice(0, 6);
      if (top.length === 0) {
        grid.appendChild(h('p', { class: 'muted' }, 'No public repositories to display.'));
        return;
      }
      top.forEach(r => grid.appendChild(renderRepo(r)));
    } catch (e) {
      console.error(e);
      err.textContent = 'Unable to load projects from GitHub right now.';
      err.classList.remove('hidden');
    }
  }

  if (grid) loadRepos();
})();

