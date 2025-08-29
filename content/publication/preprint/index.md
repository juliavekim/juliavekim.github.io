---
title: "Applying Contrastive Learning to Stellar Spectra"
slug: "contrastive-learning-stellar-spectra"

authors:
  - admin
  - nathan_sandford

date: "2025-05-01T00:00:00Z"
publishDate: "2025-05-01T00:00:00Z"

publication_types: ["thesis"]
publication: "Part III Essay, University of Cambridge"
publication_short: "Part III Essay"

abstract: |-
  With its wide range of spectroscopic capabilities, the Near Infrared Spectrograph (NIRSpec) on the \textit{James Webb} Space Telescope (JWST) is expected to usher in a new era of crowded-field extragalactic stellar spectroscopy. However, small sample sizes and limited overlap with ground-based surveys, such as APOGEE, pose challenges for NIRSpec data analysis. In this work, we present \textsc{StarCLIP}: a contrastive self-supervised learning framework that embeds observed APOGEE and \textit{ab initio} NIRSpec spectra into a unified, physically meaningful latent space. Our approach consists of training convolutional neural networks (CNNs) to recover twenty fundamental stellar properties from single-modal spectroscopic data. We then adopt these pre-trained CNNs as encoders, aligning them via contrastive loss. To simulate realistic NIRSpec observations, we construct semi-empirical, stochastic NIRSpec catalogs and embed them into the shared latent space using \textsc{MockStarCLIP}, a modified CLIP-based framework. Both models enable seamless transfer to downstream tasks, including cosine similarity search and stellar property recovery. Notably, a linear regressor applied to \textsc{StarCLIP} embeddings recovers all twenty stellar properties of interest with $r^2$ scores typically exceeding $0.88$, including $T_{\text{eff}}$ (with uncertainty $\lesssim 200\,\mathrm{K}$), $\log g$ ($\lesssim 0.07\,\mathrm{dex}$) and [Fe/H] ($\lesssim 0.03\,\mathrm{dex}$) for RGB-like stars. Applying the regressor on \textsc{MockStarCLIP} embeddings yields modestly reduced precision — approximately $450\,\mathrm{K}$ for $T_{\text{eff}}$, $0.11\,\mathrm{dex}$ for $\log g$ and $0.06\,\mathrm{dex}$ for [Fe/H]. Ultimately, our approach demonstrates that foundation models for NIRSpec and other spectral surveys with similar constraints are well within reach.

summary: >-
  We present StarCLIP, a contrastive learning framework aligning APOGEE and JWST/NIRSpec spectra into a unified latent space, enabling accurate stellar property recovery and demonstrating the feasibility of foundation models for future spectroscopic surveys.

tags:

  - Self-Supervised Learning
  - Astrophysics

featured: true

links:
  - type: pdf
    name: "PDF"
    url: "/publication/contrastive-learning-stellar-spectra/paper.pdf"
  - type: poster
    url: "/publication/contrastive-learning-stellar-spectra/poster.pdf"
  - type: code
    url: "https://github.com/juliavekim/StarCLIP"
---
