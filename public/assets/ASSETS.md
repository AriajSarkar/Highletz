# Extension Assets

This directory contains the icons and other assets for the extension:
- icon-16.png (16x16px)
- icon-48.png (48x48px)
- icon-128.png (128x128px)
- icon.svg (Source SVG file)

You can generate these icons from the SVG source file using the script in `src/utils/generate-icons.js`.

To generate PNG files from the SVG, you can use a tool like ImageMagick:

```bash
convert -background none icon.svg -resize 128x128 icon-128.png
convert -background none icon.svg -resize 48x48 icon-48.png
convert -background none icon.svg -resize 16x16 icon-16.png
```
