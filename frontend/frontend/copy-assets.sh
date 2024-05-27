#!/bin/bash

echo "Cleaning old assets."
rm -rf ../corptools/static/corptools/bs5/assets
rm ../corptools/static/corptools/bs5/manifest.json
echo "Copying new assets."
cp build/static/.vite/manifest.json ../corptools/static/corptools/bs5/manifest.json
cp -r build/static/assets ../corptools/static/corptools/bs5/assets
echo "Assets copied successfully."
