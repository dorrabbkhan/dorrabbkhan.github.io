#!/usr/bin/env bash
# Regenerate assets/images/og-default.png (1200x630 social preview image)
# by screenshotting tools/og-default.html with headless Chrome.
#
# Usage: tools/generate-og-image.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATE="$REPO_ROOT/tools/og-default.html"
OUTPUT="$REPO_ROOT/assets/images/og-default.png"

CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || true)"
if [[ -z "$CHROME" ]]; then
  echo "error: no Chrome/Chromium binary found on PATH" >&2
  exit 1
fi

"$CHROME" \
  --headless \
  --disable-gpu \
  --hide-scrollbars \
  --force-device-scale-factor=1 \
  --window-size=1200,630 \
  --default-background-color=1c1c1eff \
  --screenshot="$OUTPUT" \
  "file://$TEMPLATE" \
  2>/dev/null

echo "wrote $OUTPUT"
