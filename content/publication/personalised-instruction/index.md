---
title: An Offline Architecture for Assessment-Driven Remediation Videos
authors:
- dimitris-bertsimas
- admin
- romain-puech
date: '2026-09-23'
publication: Manuscript in preparation
publication_types:
- manuscript
featured: true
summary: We design an offline generative AI pipeline that turns course materials and assessment evidence into reusable, personalised remediation videos.
abstract: |-
  We present an offline generative AI architecture for assessment-driven remediation videos. The pipeline maps course materials to learning objectives, authors assessments and reusable instructional components, then composes personalised videos from learners’ assessment results. By separating course-level preparation from learner-specific composition, the design aims to reuse instructional content and reduce repeated generation. Runtime measurements from individual stages project a 46% reduction in serial production time under the proposed reuse and precomputation strategy; this is a projection rather than an end-to-end production benchmark. The manuscript is in preparation, and learning effectiveness has not yet been evaluated.
tags:
- Generative AI
- Personalised Learning
- LLMs
links:
- type: code
  name: Code
  url: https://github.com/juliavekim/personalized_instruction
image:
  filename: offline-architecture.jpg
  caption: ""
  focal_point: Center
  preview_only: false
---

**Manuscript in preparation (2026).** This work studies how reusable instructional content and precomputed learner-specific videos can support automated remediation at scale. The system is designed for offline preparation; learning effectiveness has not yet been evaluated.
