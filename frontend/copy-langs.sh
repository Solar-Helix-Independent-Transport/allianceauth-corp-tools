#!/bin/bash
echo "Cleaning old translations."
rm -rf ../corptools/static/i18n
rm -rf ../corptools/static/corptools/i18n
echo "Copying new translations."
# copy the image assets to the correct place.
cp -r i18n ../corptools/static/corptools/i18n
echo "Translations copied successfully."
