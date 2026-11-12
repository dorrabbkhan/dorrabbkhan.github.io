.PHONY: help install tools-install serve dev build clean post og-image photo doctor

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install Ruby gems and tools/ npm dependencies
	bundle install
	npm install --prefix tools

tools-install: ## Install tools/ npm dependencies only
	npm install --prefix tools

serve: ## Run local dev server on :4000 with live reload and drafts
	bundle exec jekyll clean && bundle exec jekyll serve --incremental --trace --livereload --drafts --baseurl ""

dev: serve ## Alias for serve

build: ## Production build into _site/
	JEKYLL_ENV=production bundle exec jekyll build

clean: ## Remove generated site, caches and metadata
	bundle exec jekyll clean
	rm -rf .jekyll-cache .jekyll-metadata

post: ## Create a new post
	./scripts/new-post.sh

og-image: ## Regenerate assets/images/og-default.png (needs Chrome/Chromium)
	./tools/generate-og-image.sh

photo: ## Regenerate profile photo webps - make photo SRC=path/to/src.png
	@test -n "$(SRC)" || (echo "usage: make photo SRC=path/to/source.png" >&2; exit 1)
	cd tools && npm run resize-photo -- $(abspath $(SRC))

doctor: ## Check Jekyll environment for issues
	bundle exec jekyll doctor
