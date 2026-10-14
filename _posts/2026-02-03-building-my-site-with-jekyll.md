---
layout: post
title: "Building my site with Jekyll"
description: "Skipping the complex cloud-native stack and building a blog with Jekyll and GitHub Pages: zero hosting costs, zero databases, and a frictionless Markdown workflow."
date: 2026-02-03
---

**TL;DR:** I skipped the complex cloud-native stack and built my blog with Jekyll and GitHub Pages. Zero hosting costs, zero database maintenance, and a frictionless Markdown workflow. The urge to overengineer was incredibly strong, but instead, I went with Jekyll. Here’s why.

Jekyll is a static site generator. There's no database to patch, no server to maintain, and zero hosting costs via GitHub Pages. It’s entirely decoupled. I also wanted a frictionless developer experience for my writing, which is achieved completely via this setup.

My blog workflow relies entirely on standard Markdown front matter:

```yaml
---
layout: post
title: "Keeping it Simple: Jekyll for a DevOps Blog"
date: 2026-02-03
---
```

I write a post, run `git push`, and GitHub Pages handles the rest.

Give yourself a break on your personal projects. Sometimes a folder full of Markdown files is all you need.

---
