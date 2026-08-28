---
title: "EgoBlind-RA: Towards Safer Egocentric Assistive AI for Blind Users via Risk-Adaptive Routing"
slug: "egoblind-ra"

authors:
  - admin
  - Xander Backus

author_notes:
  - 'Equal contribution'
  - 'Equal contribution'

date: "2026-05-12T00:00:00Z"
publishDate: "2026-05-12T00:00:00Z"

# Publication type
publication_types: ["project"]

# Venue info
publication: "MIT MMAI"
publication_short: "MIT MMAI"

abstract: |-
  Blind and low-vision (BLV) users depend on visual assistance systems to navigate an unpredictable physical world, yet existing multimodal systems apply a uniform inference policy irrespective of query urgency. We present **EgoBlind-RA**, a risk-adaptive framework that classifies egocentric query-video pairs as *urgent* or *non-urgent* via a lightweight CLIP-based classifier and routes each query to a response calibrated to its safety stakes. Our classifier achieves 0.905 ROC-AUC on the held-out test set. We compare two LoRA-fine-tuned architectures of Kimi-VL-A3B-Instruct on the EgoBlind benchmark: a bifurcated design with separate urgent and non-urgent adapters, and a unified prompt-tag-conditioned design. Urgency-conditioned SFT against carefully selected reference targets substantially improves over a uniform-policy baseline in both. Surprisingly, DPO regresses SFT in the unified setting whilst proving productive in the bifurcated setting, where the best result mixes an SFT urgent adapter with a DPO non-urgent adapter. The unified adapter is also robust to noisy CLIP routing at deployment, matching oracle composite loss despite 21.5% test-time tag flips. Together, these results suggest the value of preference-pair-based alignment and the cost of classifier noise both depend sharply on architectural regime.

summary: >-
  EgoBlind-RA routes egocentric queries from blind and low-vision users by urgency using a lightweight CLIP classifier (0.905 ROC-AUC), then allocates response policies matched to their safety stakes — showing that the value of DPO and the cost of routing noise both depend sharply on architectural regime.

tags:
  - Multimodal AI
  - AI Safety
  - Assistive Technology

featured: true

links:
  - type: pdf
    name: "PDF"
    url: "/publication/egoblind-ra/paper.pdf"
  - type: slides
    name: "Slides"
    url: "/publication/egoblind-ra/slides.pdf"
  - type: code
    url: "https://github.com/juliavekim/EgoBlind-RA"

image:
  caption: "Illustration: Jacqui VanLiew; Getty Images"
  focal_point: "Center"
  preview_only: false
---
