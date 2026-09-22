"""Check homepage/CV navigation and local assets in the built Hugo site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys

class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.images = set(), [], []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, f"Duplicate ID: {a['id']}"
            self.ids.add(a['id'])
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag in ('img', 'script', 'link'):
            value = a.get('src') or (a.get('href') if a.get('rel') in ('stylesheet', 'icon') else None)
            if value:
                self.images.append(value)
        if tag == 'img':
            assert 'alt' in a, 'Image is missing alternative text'

root = Path(sys.argv[1] if len(sys.argv) > 1 else 'public')
checks = 0
for page in [root/'index.html', root/'cv/index.html']:
    doc = Document(page.read_text())
    for link in doc.links + doc.images:
        u = urlsplit(link)
        if u.scheme or u.netloc:
            continue
        target = root/unquote(u.path).lstrip('/') if u.path.startswith('/') else page.parent/unquote(u.path)
        if not u.path:
            target = page
        if target.is_dir():
            target /= 'index.html'
        assert target.is_file(), f'{page}: missing target {link}'
        if u.fragment and target.suffix == '.html':
            assert unquote(u.fragment) in Document(target.read_text()).ids, f'{page}: missing anchor {link}'
        checks += 1
pdf = root/'uploads/resume.pdf'
assert pdf.read_bytes().startswith(b'%PDF-'), 'CV is not a PDF'
assert all((root/f'uploads/resume-page-{n}.webp').is_file() for n in (1,2))
print(f'PASS: {checks} internal links/assets, unique anchors, image alt text, and both CV previews.')
