# PWA Icon Placeholder

To complete the PWA setup, you need to generate the following icon files:

- `icon-192x192.png` (192x192 pixels)
- `icon-384x384.png` (384x384 pixels)
- `icon-512x512.png` (512x512 pixels)
- `apple-touch-icon.png` (180x180 pixels)

## Quick Generation

You can use the provided `icon.svg` as a base and convert it to PNG files using:

### Option 1: Online Tools
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/

### Option 2: ImageMagick (CLI)
```bash
# Install ImageMagick
sudo apt-get install imagemagick  # Linux
brew install imagemagick          # macOS

# Convert SVG to PNG
convert -background none -resize 192x192 icon.svg icon-192x192.png
convert -background none -resize 384x384 icon.svg icon-384x384.png
convert -background none -resize 512x512 icon.svg icon-512x512.png
convert -background none -resize 180x180 icon.svg apple-touch-icon.png
```

### Option 3: Use a design tool
- Open `icon.svg` in Figma, Adobe Illustrator, or Inkscape
- Export at the required sizes

## Placement
Place all generated PNG files in the `/public` directory.
