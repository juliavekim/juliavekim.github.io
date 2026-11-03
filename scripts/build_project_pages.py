from pathlib import Path
import re, html, shutil, yaml, json
from datetime import datetime
root=Path(__file__).resolve().parents[1]
details=json.loads((root/'scripts/project_details.json').read_text())
home=(root/'layouts/index.html').read_text()
cards=re.findall(r'<article class="project">.*?</article>',home,re.S)
head=home.split('<main id="main">')[0]
head=head.replace('href="#main"','href="/#main"').replace('href="#research"','href="/#research"').replace('href="#news"','href="/#news"').replace('href="#misc"','href="/#misc"').replace('href="#contact"','href="/#contact"')
tail=home[home.index('<footer class="footer"'):]
projects=[('personalised-instruction','personalised-instruction'),('egoblind-ra','egoblind-ra'),('preprint','contrastive-learning-stellar-spectra'),('conference-paper','pulsating-red-giants'),('portia','portia')]
catalog={}
for i,(folder,slug) in enumerate(projects):
 p=root/'content/publication'/folder/'index.md'
 raw=p.read_text();data=yaml.safe_load(raw.split('---',2)[1]);card=cards[i]
 title=re.search(r'<h3><a[^>]*>(.*?)</a></h3>',card,re.S)[1]
 authors=re.search(r'<p class="authors">.*?</p>',card,re.S)[0]
 meta=re.search(r'<div class="meta">.*?</div>',card,re.S)[0]
 media=re.search(r'<button type="button" class="project-media.*?</button>',card,re.S)[0]
 credit=re.search(r'<details class="photo-credit">.*?</details>|<small class="footage-credit">.*?</small>',card,re.S)
 links=re.search(r'<div class="links">.*?</div>',card,re.S)[0]
 if i==0:
  links=re.sub(r'<a href="/publication/personalised-instruction/">.*?</a>', '', links)
  links=links.replace('</div>','<a href="https://github.com/juliavekim/personalized_instruction"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/></svg>code</a></div>')
  abstract=data['abstract']
  raw=re.sub(r'\n\*\*Manuscript in preparation.*', '\n'+abstract+'\n',raw,flags=re.S)
 else: abstract=data['abstract']
 abstract=html.escape(abstract.strip())
 abstract=abstract.replace(r'T_{\text{eff}}','T<sub>eff</sub>').replace(r'r^2','r<sup>2</sup>')
 abstract=abstract.replace(r'\lesssim','≲').replace(r'\log','log').replace(r'\,',' ').replace('$','')
 for command,tag in [('textit','em'),('textsc','span'),('mathrm','span'),('text','span')]:
  abstract=re.sub(r'\\'+command+r'\{([^{}]*)\}',lambda m:'<'+tag+'>'+m[1]+'</'+tag+'>',abstract)

 abstract=re.sub(r'\*\*(.*?)\*\*',r'<strong>\1</strong>',abstract)
 abstract=re.sub(r'\*(.*?)\*',r'<em>\1</em>',abstract)
 abstract=''.join('<p>'+part.replace('\n',' ')+'</p>' for part in abstract.split('\n\n'))
 d=details[i] if i<len(details) else {}
 # Restore publication resources from the source metadata, including slides and posters.
 for resource in data.get('links',[]):
  url=resource.get('url','')
  if not url or ('href="'+url+'"') in links: continue
  label=resource.get('name') or resource.get('type','resource').title()
  links=links.replace('</div>',f'<a href="{html.escape(url)}">{html.escape(label)}</a></div>')
 if i==3:
  links=links.replace('</div>','<a href="/publication/pulsating-red-giants/cite.bib" download>BibTeX</a></div>')
 date=datetime.fromisoformat(str(data['date']).replace('Z','+00:00')).strftime('%B %Y')
 topics=''.join('<span class="topic-'+str(j%4)+'">'+html.escape(t)+'</span>' for j,t in enumerate(data.get('tags',[])))
 topic_list=f'<div class="topic-list" aria-label="Research topics">{topics}</div>'
 if i==0:
  links=links.replace('>demo</a>','>Interactive demo</a>').replace('>code</a>','>GitHub</a>')
  links=links.replace('</div>','<span class="publication-pending"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5"/></svg>Publication coming soon</span></div>')
 # Abstract first; footage and all attachments follow together.
 body=f'''<main id="main" class="project-page compact-publication"><a class="back-research" href="/#research">← Research highlights</a><header class="project-heading">{meta}<h1>{title}</h1>{authors}{topic_list}</header><section id="abstract" class="project-overview"><h2>Abstract</h2>{abstract}</section><div class="project-materials"><figure class="project detail-figure">{media}{credit[0] if credit else ''}</figure><div class="attachment-links">{links}</div></div></main>'''


 if i==0:
  sample='<section class="sample-lesson"><h2>Sample lesson</h2><iframe src="https://drive.google.com/file/d/1tGeG1S_m_zp2i6NwL7OwxmaXTkCWftxB/preview" title="Full linear-regression sample lesson" loading="lazy" allow="fullscreen" allowfullscreen></iframe><a class="portfolio-link" href="https://drive.google.com/file/d/1tGeG1S_m_zp2i6NwL7OwxmaXTkCWftxB/view" target="_blank" rel="noopener">Watch on Google Drive ↗</a></section>'
  body=body.replace('</main>',sample+'</main>')
 if i==4: body=body.replace('<h2>Abstract</h2>','<h2>Overview</h2>')
 catalog[slug]={'title':html.unescape(title),'html':re.sub(r'^<main[^>]*>.*?</a>|</main>$','',body,flags=re.S)}
 page=head.replace('<title>Julia Kim</title>','<title>'+title+' | Julia Kim</title>')+body+tail
 layout='editorial-'+slug
 if '\nlayout:' not in raw: raw=raw.replace('---\n','---\nlayout: '+layout+'\n',1)
 p.write_text(raw)
 out=root/'layouts/publication';out.mkdir(exist_ok=True);(out/(layout+'.html')).write_text(page)
 preview=root/'preview/publication'/slug;preview.mkdir(parents=True,exist_ok=True)
 page=page.replace('href="/cv/"','href="https://juliavekim.github.io/cv/"')
 (preview/'index.html').write_text(page)
 for pattern in ['*.pdf','*.bib']:
  for asset in p.parent.glob(pattern):shutil.copyfile(asset,preview/asset.name)
# The preview must stay inside the redesigned site when opening projects.
p=root/'preview/index.html';p.write_text(p.read_text().replace('https://juliavekim.github.io/publication/','/publication/'))

for target in ['static/editorial/projects.json','preview/editorial/projects.json']:
 (root/target).write_text(json.dumps(catalog,ensure_ascii=False))
