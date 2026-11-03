(()=>{
const main=document.querySelector('.service-web-design');if(!main)return;
let timer,observer;
function prepare(){const news=main.querySelector('.service-news');if(!news||news.dataset.typed)return;news.dataset.typed='true';clearInterval(timer);observer?.disconnect();if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const full=news.textContent;news.setAttribute('aria-label',full);
const walker=document.createTreeWalker(news,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
for(const node of nodes){const fragment=document.createDocumentFragment();for(const char of Array.from(node.textContent)){const span=document.createElement('span');span.className='news-letter';span.setAttribute('aria-hidden','true');span.textContent=char;fragment.append(span);}node.replaceWith(fragment);}
const letters=[...news.querySelectorAll('.news-letter')];observer=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting))return;observer.disconnect();let i=0;timer=setInterval(()=>{for(let n=0;n<2&&i<letters.length;n++)letters[i++].classList.add('revealed');if(i>=letters.length)clearInterval(timer);},28);},{threshold:.4});observer.observe(news);
}
new MutationObserver(prepare).observe(main,{childList:true});prepare();
})();
