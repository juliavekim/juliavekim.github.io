---
title: "Applying Contrastive Learning to Stellar Spectra"
slug: "contrastive-learning-stellar-spectra" 

authors:
- admin
- nathan_sandford
date: "2025-05-01T00:00:00Z"

# Schedule page publish date (NOT publication's date).
publishDate: "2025-05-01T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["thesis"]

# Publication name and optional abbreviated publication name.
publication: "Part III Essay, University of Cambridge"
publication_short: "Part III Essay"

abstract: With its wide range of spectroscopic capabilities, the Near Infrared Spectrograph (NIRSpec) on the \textit{James Webb} Space Telescope (JWST) is expected to usher in a new era of crowded-field extragalactic stellar spectroscopy. However, small sample sizes and limited overlap with ground-based surveys, such as APOGEE, pose challenges for NIRSpec data analysis. In this work, we present \textsc{StarCLIP}: a contrastive self-supervised learning framework that embeds observed APOGEE and \textit{ab initio} NIRSpec spectra into a unified, physically meaningful latent space. Our approach consists of training convolutional neural networks (CNNs) to recover twenty fundamental stellar properties from single-modal spectroscopic data. We then adopt these pre-trained CNNs as encoders, aligning them via contrastive loss. To simulate realistic NIRSpec observations, we construct semi-empirical, stochastic NIRSpec catalogs and embed them into the shared latent space using \textsc{MockStarCLIP}, a modified CLIP-based framework. Both models enable seamless transfer to downstream tasks, including cosine similarity search and stellar property recovery. Notably, a linear regressor applied to \textsc{StarCLIP} embeddings recovers all twenty stellar properties of interest with $r^2$ scores typically exceeding $0.88$, including $T_{\text{eff}}$ (with uncertainty $\lesssim$ 200 K), $\log g$ ($\lesssim$0.07 dex) and [Fe/H] ($\lesssim$0.03 dex) for RBG-like stars. Applying the regressor on \textsc{MockStarCLIP} embeddings yields modestly reduced precision---approximately 450 K for $T_{\text{eff}}$, 0.11 dex for $\log g$ and 0.06 dex for [Fe/H]. Ultimately, our approach demonstrates that foundation models for NIRSpec and other spectral surveys with similar constraints is well within reach.  

# Summary. An optional shortened abstract.
summary: We present StarCLIP, a contrastive learning framework aligning APOGEE and JWST/NIRSpec spectra into a unified latent space, enabling accurate stellar property recovery and demonstrating the feasibility of foundation models for future spectroscopic surveys. 

tags:
- Self Supervised Learning
- Astrophysics 

featured: true

links:
  - type: pdf
    name: "Full text"
    url: "/publication/applying-contrastive-learning/index.pdf"   # place your essay PDF as index.pdf
  - type: code
    url: "https://github.com/juliavekim/StarCLIP" 
  - type: poster
    url: "/publication/applying-contrastive-learning/poster.pdf"  # or external link

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/s9CC2SKySJM)'
  focal_point: ""
  preview_only: false

---
