# Julia Kim — professional website

Personal website at https://juliavekim.github.io/.

## Content

- `layouts/index.html`: professional overview, selected work, research experience, writing, education, and contact.
- `layouts/cv/single.html`: original two-page CV preview and accessible HTML covering every CV section.
- `static/uploads/resume.pdf`: the original uploaded CV, preserved byte-for-byte.
- `static/uploads/resume-page-{1,2}.webp`: previews rendered from the original PDF.
- `static/css/profile.css`: responsive styling shared by the homepage and CV.
- `content/publication/`: existing research pages, papers, slides, and poster URLs retained.
- `content/authors/admin/_index.md`: biography used by the existing publication pages.

The homepage and CV use self-contained Hugo layouts. Existing publication pages retain the Hugo Blox theme. Sample posts, projects, courses, and events are marked as drafts so they are not published or indexed. The personalised-instruction repository is private, so the public site offers a contact link rather than an inaccessible repository link.

## Build and check

Use the Hugo extended version recorded in `.github/workflows/deploy.yml`, Node 20, and the existing package dependencies:

```sh
npm install
hugo --minify
python3 scripts/check_site.py public
```

Pull requests build the site and check internal navigation, assets, desktop/mobile overflow, keyboard entry, both CV previews, and PDF access. Screenshots are uploaded as a CI artifact. Only main-branch pushes or manual workflow runs deploy to GitHub Pages.

When replacing the CV, update the PDF, both page previews, and the HTML text together. The PDF is the authoritative original document. Do not replace it with a shortened résumé.
