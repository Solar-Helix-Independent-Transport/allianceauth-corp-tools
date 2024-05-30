#!/bin/bash

echo "Cleaning old assets."
<<<<<<< HEAD
rm -rf ../moons/static/moons/assets
rm ../moons/static/moons/manifest.json
echo "Copying new assets."
cp build/static/.vite/manifest.json ../moons/static/moons/manifest.json
cp -r build/static/assets ../moons/static/moons/assets
=======
rm -rf ../../corptools/static/corptools/corp/assets
rm ../../corptools/static/corptools/corp/manifest.json
echo "Copying new assets."
cp build/static/.vite/manifest.json ../../corptools/static/corptools/corp/manifest.json
cp -r build/static/assets ../../corptools/static/corptools/corp/assets
>>>>>>> 385a6fab698b4d6cf1cfbdbc1b50bc9da3f7d2f1
echo "Assets copied successfully."
