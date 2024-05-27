#!/bin/bash

echo "Cleaning old assets."
rm -rf ../../corptools/static/corptools/corp/assets
rm ../../corptools/static/corptools/corp/manifest.json
echo "Copying new assets."
cp build/static/.vite/manifest.json ../../corptools/static/corptools/corp/manifest.json
cp -r build/static/assets ../../corptools/static/corptools/corp/assets
echo "Assets copied successfully."
