# Dorrabb Khan - Personal Portfolio

This repository contains the source code for my personal portfolio website, hosted at [dorrabbkhan.github.io](https://dorrabbkhan.github.io).

## Overview

This is a Jekyll-based static website that showcases my professional experience, skills, and projects as a DevOps & Cloud Engineer.

## Features

- Responsive design for optimal viewing on all devices
- Project showcase with detailed descriptions (coming soon)
- Blog section for technical articles and insights (coming soon)
- Contact information and social media links

## Technologies Used

- **Static Site Generator**: Jekyll
- **Hosting**: GitHub Pages
- **CSS Preprocessing**: Sass
- **Markup**: Markdown, HTML5
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
- `_layouts/`: HTML templates
- `_includes/`: Reusable components
- `_posts/`: Blog articles
- `_projects/`: Project showcases
- `assets/`: Static files (CSS, images, etc.)
- `_pages/`: Additional pages

## License

This project is licensed under the terms specified in the LICENSE file.
