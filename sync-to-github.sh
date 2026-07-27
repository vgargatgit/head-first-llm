#!/usr/bin/env bash
set -euo pipefail
REPO_URL="https://github.com/vgargatgit/head-first-llm.git"
WORKDIR="${1:-head-first-llm-repo}"
if [ ! -d "$WORKDIR/.git" ]; then git clone "$REPO_URL" "$WORKDIR"; fi
rsync -av --delete --exclude .git ./ "$WORKDIR"/
cd "$WORKDIR"
git add -A
if git diff --cached --quiet; then echo "Nothing to commit"; exit 0; fi
git commit -m "Add complete Chapters 1–3 workspace and artwork"
git push origin main
