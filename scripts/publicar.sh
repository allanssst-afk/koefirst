#!/usr/bin/env bash
# Publica o KoeFirst no GitHub Pages: gera o site estático e envia a pasta out/ para a branch gh-pages.
# Uso: npm run publicar   →   https://allanssst-afk.github.io/koefirst/
set -euo pipefail
cd "$(dirname "$0")/.."

ORIGEM=$(git remote get-url origin)
REPO=$(basename -s .git "$ORIGEM")

rm -rf out
NEXT_PUBLIC_BASE_PATH="/$REPO" NEXT_TELEMETRY_DISABLED=1 npm run build
touch out/.nojekyll # sem isto o GitHub Pages esconde a pasta _next/

cd out
git init -q -b gh-pages
git add -A
git commit -q -m "Publicação $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$ORIGEM" gh-pages
rm -rf .git
echo "✓ Publicado. Em 1–2 minutos: https://$(git -C .. config --get remote.origin.url | sed -E 's#.*github.com[:/]([^/]+)/.*#\1#').github.io/$REPO/"
