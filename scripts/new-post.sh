#!/usr/bin/env sh
set -eu

SCRIPT_DIR="$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)"
REPO_ROOT="$(dirname -- "$SCRIPT_DIR")"
POSTS_DIR="$REPO_ROOT/_posts"

if [ $# -gt 0 ]; then
  TITLE="$*"
else
  printf "Blog post title: "
  IFS= read -r TITLE
fi

if [ -z "$TITLE" ]; then
  echo "Error: title cannot be empty." >&2
  exit 1
fi

printf "Description (optional): "
IFS= read -r DESCRIPTION || DESCRIPTION=""

printf "Tags (comma-separated, optional): "
IFS= read -r RAW_TAGS || RAW_TAGS=""

SLUG="$(printf '%s' "$TITLE" \
  | tr '[:upper:]' '[:lower:]' \
  | sed -E "s/['’]//g; s/[^a-z0-9]+/-/g; s/^-+//; s/-+$//")"

if [ -z "$SLUG" ]; then
  echo "Error: could not generate a valid slug from title." >&2
  exit 1
fi

TODAY="$(date +%Y-%m-%d)"
FILEPATH="$POSTS_DIR/${TODAY}-${SLUG}.md"

if [ -e "$FILEPATH" ]; then
  echo "Error: file already exists at $FILEPATH" >&2
  exit 1
fi

if [ -n "$RAW_TAGS" ]; then
  TAGS_FORMATTED="[$(printf '%s' "$RAW_TAGS" | sed -E 's/[[:space:]]*,[[:space:]]*/, /g; s/^[[:space:]]+//; s/[[:space:]]+$//')]"
else
  TAGS_FORMATTED="[]"
fi

ESCAPED_TITLE="$(printf '%s' "$TITLE" | sed 's/"/\\"/g')"
ESCAPED_DESC="$(printf '%s' "$DESCRIPTION" | sed 's/"/\\"/g')"

mkdir -p "$POSTS_DIR"

cat <<EOF > "$FILEPATH"
---
layout: post
title: "$ESCAPED_TITLE"
description: "$ESCAPED_DESC"
date: $TODAY
tags: $TAGS_FORMATTED
---

**TL;DR:** 

EOF

echo "Created $FILEPATH"
