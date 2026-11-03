(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pauseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  const playIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13L19 12z"/></svg>';
  const items = new Map();
  const sync = item => {
    const modal = document.querySelector('dialog[open]');
    const active = item.visible && !item.manualPause && !document.hidden && (!modal || modal.contains(item.card)) && !item.card.hidden;
    if (active) item.started=true;
    item.card.classList.toggle('playing', item.started);
    item.card.classList.toggle('motion-paused', !active);
    item.card.classList.toggle('user-paused', item.manualPause);
    const opens = item.card.dataset.openProject;
    item.card.setAttribute('aria-label', opens ? `Open project: ${opens}` : `${active ? 'Pause' : 'Play'}: ${item.label}`);
    item.state.innerHTML = active ? pauseIcon : playIcon;
    item.state.setAttribute('aria-label', `${active ? 'Pause' : 'Play'} animation: ${item.label}`);
    item.state.title = active ? 'Pause animation' : 'Play animation';
    if (item.video) {
      item.video.muted = true;
      if (active) item.video.play().catch(() => {});
      else item.video.pause();
    }
  };
  const refresh = () => {
    items.forEach(sync);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const item = items.get(entry.target);
      if (!item) return;
      item.visible = entry.isIntersecting && entry.intersectionRatio >= .25;
      if (item.visible && !item.entered) {
        item.entered = true;
        if (!item.manualPause) item.card.closest('.project')?.classList.add('arriving');
      }
      sync(item);
    });
  }, {threshold:[0,.25]});
  const mount = root => root.querySelectorAll('.project-media').forEach(card => {
    if (items.has(card)) return;
    const video = card.querySelector('video');
    const label = card.getAttribute('aria-label') || 'Project animation';
    const shell = document.createElement('div'); shell.className='media-shell';
    card.before(shell); shell.append(card);
    const state = document.createElement('button'); state.type='button';
    state.className = 'motion-control'; shell.append(state);
    const item = {card, video, label, state, shell, visible:false, manualPause:reduced.matches, entered:false, started:false};
    item.click = () => {
      if (card.dataset.openProject) return;
      item.manualPause=!item.manualPause; sync(item);
    };
    card.addEventListener('click',item.click);
    state.addEventListener('click',event=>{event.stopPropagation(); item.manualPause=!item.manualPause; sync(item);});
    items.set(card,item); observer.observe(card);
  });
  const unmount = root => {
    items.forEach((item,card) => {
      if (!root.contains(card)) return;
      item.video?.pause();
      card.removeEventListener('click',item.click); observer.unobserve(card); items.delete(card);
    });
  };
  window.SiteMotion = {mount,unmount,refresh};
  mount(document);
  document.addEventListener('visibilitychange',refresh);
  document.addEventListener('project-view-change',refresh);
  reduced.addEventListener('change',()=>{items.forEach(item=>{item.manualPause=reduced.matches;}); refresh();});
  refresh();
})();
