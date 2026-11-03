(() => {
 const cards=[...document.querySelectorAll('.project-grid>article.project')];
 const button=document.querySelector('.research-more');
 if(!button)return;
 const extra=cards.slice(4);let expanded=false;
 const update=()=>{
  extra.forEach(card=>{card.hidden=!expanded;card.classList.remove('arriving');});
  button.textContent=expanded?'show less ↑':'show more ↓';
  button.setAttribute('aria-expanded',String(expanded));
  window.SiteMotion?.refresh();
 };
 update();
 button.addEventListener('click',()=>{expanded=!expanded;update();});
})();
