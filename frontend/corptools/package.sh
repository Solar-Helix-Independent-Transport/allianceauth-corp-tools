#!/bin/bash
# Simple script to package routes react package into the corptools django project

rm -rf ../../corptools/static
cp -r build/static ../../corptools/
cp build/asset-manifest.json ../../corptools/asset-manifest.json
#cp build/index.html ../../corptools/templates/corptools/character/index.html
