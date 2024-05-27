#!/bin/bash

echo "Cleaning old assets."
rm -rf ../../corptools/static/corptools/char/assets
rm ../../corptools/static/corptools/char/manifest.json
echo "Copying new assets."
cp build/static/.vite/manifest.json ../../corptools/static/corptools/char/manifest.json
cp -r build/static/assets ../../corptools/static/corptools/char/assets
echo "Assets copied successfully."
