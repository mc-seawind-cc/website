#!/bin/bash
# 海風網站 — CSS 建構腳本
# 將 css/ 下的分檔合併為 style.css
# 用法: bash build-css.sh

set -e
cd "$(dirname "$0")"

ORDER="base nav hero buttons cards bulletin sections articles guide team member links partner community photos lightbox footer misc animations responsive"

OUTPUT="style.css"
: > "$OUTPUT"

for file in $ORDER; do
  src="css/${file}.css"
  if [ -f "$src" ]; then
    cat "$src" >> "$OUTPUT"
  else
    echo "skip: $src"
  fi
done

SIZE=$(wc -c < "$OUTPUT")
echo "done: $OUTPUT ($SIZE bytes)"
