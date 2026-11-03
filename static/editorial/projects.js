(() => {
  const grid = document.querySelector('.project-grid');
  if (!grid || !window.HTMLDialogElement) return;
  let catalogPromise;
  const catalog = () => catalogPromise ||= fetch('/editorial/projects.json?v=finance-39', {cache:'no-store'}).then(r => {
    if (!r.ok) throw Error('Project details unavailable');
    return r.json();
  }).catch(error => {catalogPromise = null; throw error;});
  const dialog = document.createElement('dialog');
  dialog.className = 'project-dialog';
  dialog.setAttribute('aria-labelledby', 'project-dialog-title');
  dialog.innerHTML = '<div class="dialog-toolbar"><button class="dialog-close" aria-label="Close project" autofocus><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button></div><div class="dialog-content"></div>';
  document.body.append(dialog);
  const content = dialog.querySelector('.dialog-content');
  let restoreFocus, opener, returnHash = '#research', pushed = false, currentSlug, request = 0, clusterCleanup;
  const notify = () => document.dispatchEvent(new Event('project-view-change'));
  const disposeContent = () => {
    clusterCleanup?.(); clusterCleanup = null;
    window.SiteMotion?.unmount(content);
  };
  const close = (updateHistory = true) => {
    ++request;
    if (!dialog.open) return;
    disposeContent();
    dialog.close();
    document.documentElement.classList.remove('project-open');
    currentSlug = null;
    if (updateHistory) {
      if (pushed) {restoreFocus=opener; history.back();}
      else history.replaceState(history.state, '', returnHash);
    }
    pushed = false;
    opener?.focus({preventScroll:true});
    notify();
  };
  const open = async (slug, trigger, fromHistory = false) => {
    if (slug === currentSlug && dialog.open) return;
    const ticket = ++request;
    let project;
    try {project = (await catalog())[slug];}
    catch {if (!fromHistory && trigger?.href) location.href = trigger.href; return;}
    if (!project || ticket !== request) return;
    if (!dialog.open) {
      opener = trigger || document.querySelector(`[data-project-slug="${slug}"]`);
      if (!fromHistory) returnHash = location.hash || '#research';
    }
    disposeContent();
    content.innerHTML = project.html;
    const title = content.querySelector('h1');
    if (title) title.id = 'project-dialog-title';
    const abstract = content.querySelector('#abstract');
    if (abstract) abstract.removeAttribute('id');
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    document.documentElement.classList.add('project-open');
    currentSlug = slug;
    if (!fromHistory) {
      history.pushState({project:slug}, '', '#project=' + slug);
      pushed = true;
    }
    window.SiteMotion?.mount(content);

    dialog.querySelector('.dialog-close').focus({preventScroll:true});
    notify();
  };
  grid.querySelectorAll('article.project').forEach(card => {
    const link = card.querySelector('h3 a');
    if (!link) return;
    const slug = new URL(link.href).pathname.split('/').filter(Boolean).pop();
    const media = card.querySelector('.project-media');
    media.dataset.openProject = link.textContent;
    media.dataset.projectSlug = slug;
    media.setAttribute('aria-haspopup', 'dialog');
    media.setAttribute('aria-label', 'Open project: ' + link.textContent);
    link.setAttribute('aria-haspopup', 'dialog');
    card.classList.add('expandable-project');
    card.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0) return;
      if (event.target.closest('details,.motion-control')) return;
      const anchor = event.target.closest('a');
      if (anchor && anchor.getAttribute('href') !== link.getAttribute('href')) return;
      if (window.getSelection()?.toString()) return;
      event.preventDefault();
      open(slug, anchor || media);
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => close());
  dialog.addEventListener('cancel', event => {event.preventDefault(); close();});
  let backdropDown = false;
  dialog.addEventListener('pointerdown', event => {backdropDown = event.target === dialog;});
  dialog.addEventListener('click', event => {
    if (backdropDown && event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close();
    }
    backdropDown = false;
  });
  const readHash = () => {
    const slug = location.hash.startsWith('#project=') ? location.hash.slice(9) : '';
    if (slug && /^[a-z0-9-]+$/.test(slug)) open(slug, null, true);
    else {close(false); restoreFocus?.focus({preventScroll:true}); restoreFocus=null;}
  };
  window.addEventListener('popstate', readHash);
  window.addEventListener('hashchange', readHash);
  notify();
  readHash();
})();
