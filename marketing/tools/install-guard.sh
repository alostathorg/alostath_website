#!/bin/sh
# Installs the Al-Ostath marketing guard as this repo's pre-push hook.
# Every Conductor workspace of the repo shares one hooks folder, so one run covers them all.
set -eu

src="$(cd "$(dirname "$0")" && pwd)/pre-push"
hooks="$(git rev-parse --path-format=absolute --git-path hooks)"
dest="$hooks/pre-push"

mkdir -p "$hooks"
if [ -e "$dest" ] && ! grep -q 'Al-Ostath marketing guard' "$dest"; then
  echo "Another pre-push hook is already installed at $dest; merge the two by hand." >&2
  exit 1
fi
cp "$src" "$dest"
chmod +x "$dest"
echo "Al-Ostath marketing guard installed: $dest"
