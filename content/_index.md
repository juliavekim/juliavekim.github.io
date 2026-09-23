---
title: ''
date: 2022-10-24
type: landing
design:
  spacing: 3rem
sections:
- block: resume-biography-3
  content:
    username: admin
    text: ''
    button:
      text: Download CV
      url: /uploads/resume.pdf
  design:
    css_class: dark
    avatar:
      size: medium
      shape: circle
    background:
      color: black
      image:
        filename: stacked-peaks.svg
        filters:
          brightness: 1.0
        size: cover
        position: center
        parallax: false
- block: collection
  id: projects
  content:
    title: Projects
    filters:
      folders:
      - project
  design:
    view: article-grid
    columns: 2
- block: collection
  id: papers
  content:
    title: Featured Publications
    filters:
      folders:
      - publication
      featured_only: true
  design:
    view: article-grid
    columns: 2
- block: collection
  content:
    title: Publications
    text: ''
    filters:
      folders:
      - publication
      exclude_featured: false
  design:
    view: citation
---
