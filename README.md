# Dorrabb Khan - Personal Portfolio

This repository contains the source code for my personal portfolio website, hosted at [dorrabbkhan.github.io](https://dorrabbkhan.github.io).

## Overview

This is a Jekyll-based static website that showcases my professional experience as a DevOps & Cloud Engineer and hosts my blog.

## Features

- Responsive design for optimal viewing on all devices
- Blog with pagination at `/blog`, plus a scroll progress bar on post pages
- Command palette (`Ctrl`/`Cmd`+`K`, `/`, or the Search button): search posts & pages, toggle theme, download CVs, contact/social shortcuts, random post, copy link
- Dark/light theme toggle in the navbar, persisted via `localStorage`, with a theme-aware favicon
- Local time + timezone indicator (Berlin) fixed top-right
- Cursor-following spotlight gradient and frosted-glass hover effects with glowing edge seams on post previews and titles
- Contact information and social media links (email obfuscated via `jekyll-email-protect`)
- Project showcase with detailed descriptions (coming soon)

## Technologies Used

- **Static Site Generator**: Jekyll
- **Hosting**: GitHub Pages
- **CSS Preprocessing**: Sass
- **Markup**: Markdown, HTML5
- **JavaScript**: Vanilla JS (no frameworks) for the command palette, theme switcher, and cursor effects
- **Plugins**: `jekyll-seo-tag`, `jekyll-paginate`, `jekyll-email-protect`, `jekyll-target-blank`
- **Extras**: Font Awesome icons, MathJax, Google Fonts (Inter)
- **Version Control**: Git

## Local Development

### Prerequisites

- Ruby (with Bundler)
- Jekyll

### Setup

1. Clone this repository

   ```
   git clone https://github.com/dorrabbkhan/dorrabbkhan.github.io.git
   cd dorrabbkhan.github.io
   ```

2. Install dependencies

   ```
   bundle install
   ```

3. Run the development server

   ```
   bundle exec jekyll clean && bundle exec jekyll serve --incremental --trace --baseurl ""
   ```

4. View the site at `http://localhost:4000`

## Structure

- `_config.yml`: Site configuration
- `_layouts/`: HTML templates (`default`, `home`, `post`, `project`, `clean`)
- `_includes/`: Reusable components (navigation, social footer, command palette, favicon, analytics)
- `_posts/`: Blog posts (Markdown with front matter)
- `blog/`: Blog index and pagination pages
- `assets/`: Static files (CSS/SCSS, JS, images, favicons, PDF documents)
- `_pages/`: Additional pages

## License

This project is licensed under the terms specified in the LICENSE file.
