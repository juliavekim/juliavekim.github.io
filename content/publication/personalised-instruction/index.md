---
layout: editorial-personalised-instruction
title: "Personalized Learning with Generative AI: A Framework for Assessment-Driven Remediation Videos"
authors:
- admin
- dimitris-bertsimas
date: '2026-09-23'
publication: Manuscript in preparation
publication_types:
- manuscript
featured: true
summary: We combine reusable remediation videos with personalised visual annotations selected from assessment responses and optional tutoring dialogue.
abstract: |-
  Personalizing instructional video requires responding to learners' difficulties without repeatedly producing the same underlying explanations. Here we present a generative-AI framework that combines reusable remediation videos with personalized visual annotations. Missed assessment questions determine the lesson retrieved, while selected incorrect answers and optional tutoring dialogue determine the clarifications displayed during playback. Personalization preserves the video's narration and underlying media. Using material from MIT Open Learning's Universal AI program, we evaluate both the resources required to prepare instruction and the time required to provide annotations when a lesson is requested. For nine synthetic learner cases across three learning objectives, preparing three shared videos reduced API preparation costs by 63.8% and cumulative video-production execution time by a factor of 3.80 compared with generating nine separate videos. A second experiment tested annotation delivery in a locally deployed application under a five-second preparation budget. All 660 initial requests returned an annotation plan. At 50 concurrent simulated sessions, median readiness was 0.181 seconds for prepared annotations, 4.775 seconds with dialogue-based selection enabled, and 0.070 seconds for a saved plan. Eighteen dialogue selections completed before playback; the remaining 32 requests used prepared annotations. Two requests exceeded five seconds including application overhead. These findings demonstrate reduced production costs and responsive personalization under the tested conditions. Independent assessment of instructional quality and controlled learner studies are needed to determine whether these computational advantages translate into effective remediation.
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

We present a generative-AI framework combining reusable remediation videos with personalised visual annotations. Missed questions determine the lesson retrieved, while selected incorrect answers and optional tutoring dialogue determine the clarifications displayed during playback. Personalization preserves the narration and underlying media. Experiments with synthetic learner cases evaluate preparation costs and delivery latency; independent quality assessment and controlled learner studies remain necessary to establish educational effectiveness.
