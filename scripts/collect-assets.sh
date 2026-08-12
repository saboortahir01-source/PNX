#!/usr/bin/env bash
set -euo pipefail

# Script: collect-assets.sh
# Purpose: Copy generated client assets into .output/public deterministically and fail if missing.
# Candidate source dirs in order of preference:
# 1) dist/client      (Vite/Nitro typical)
# 2) dist             (some builds)
# 3) .output/public   (already correct)
# 4) public           (static assets)

echo "Running collect-assets.sh"

OUTPUT_DIR=".output/public"
mkdir -p "$OUTPUT_DIR"

# Helper to copy with check
copy_dir() {
  local src="$1"
  if [ -d "$src" ]; then
    echo "Copying assets from $src to $OUTPUT_DIR"
    cp -r "$src"/* "$OUTPUT_DIR"/
  fi
}

# Preferred: dist/client
if [ -d "dist/client" ]; then
  copy_dir "dist/client"
fi

# Fallback: dist
if [ -d "dist" ] && [ ! -d "dist/client" ]; then
  copy_dir "dist"
fi

# Ensure any committed public/ files are copied
if [ -d "public" ]; then
  copy_dir "public"
fi

# After copying, perform basic sanity checks
if [ ! -f ".output/server/index.mjs" ]; then
  echo "ERROR: Missing server entry .output/server/index.mjs"
  exit 2
fi

# Must contain at least one CSS and one JS asset
css_count=$(find "$OUTPUT_DIR" -type f -name "*.css" | wc -l)
js_count=$(find "$OUTPUT_DIR" -type f -name "*.js" | wc -l)
if [ "$css_count" -lt 1 ]; then
  echo "ERROR: No CSS assets found in $OUTPUT_DIR"
  exit 3
fi
if [ "$js_count" -lt 1 ]; then
  echo "ERROR: No JS assets found in $OUTPUT_DIR"
  exit 4
fi

# Check required public files exist (from repo public/)
if [ ! -f "$OUTPUT_DIR/manifest.webmanifest" ] && [ ! -f "public/manifest.webmanifest" ]; then
  echo "ERROR: manifest.webmanifest missing in $OUTPUT_DIR and public/"
  exit 5
fi

if [ ! -f "$OUTPUT_DIR/favicon.png" ] && [ ! -f "public/favicon.png" ]; then
  echo "ERROR: favicon.png missing in $OUTPUT_DIR and public/"
  exit 6
fi

# PNX logo / saboor-tahir checks
if ! find "$OUTPUT_DIR" -type f -iname "*pnx*logo*" | grep -q . && ! find src/assets -type f -iname "*pnx*logo*" | grep -q . ; then
  echo "ERROR: PNX logo not found in $OUTPUT_DIR or src/assets"
  exit 7
fi

if ! find "$OUTPUT_DIR" -type f -iname "*saboor*" | grep -q . && [ ! -f "public/saboor-tahir.png" ] && [ ! -f "public/saboor-tahir.jpg" ]; then
  echo "ERROR: saboor-tahir image not found in $OUTPUT_DIR or public/"
  exit 8
fi

echo "collect-assets.sh completed successfully"
