#!/bin/bash
# Simple script to package routes react package into the corptools django project

rm -rf ../../corptools/static
cp -r build/static ../../corptools/
cp build/index.html ../../corptools/templates/routes/index.html