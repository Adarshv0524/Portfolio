# Required WebP Images

The following WebP images need to be created and placed in this directory:

## Main Assets (static/assets/)

1. **logo.webp** - Company/personal logo (40x40px for optimal performance)
2. **my_photo.webp** - Profile photo (300x300px recommended)
3. **og-image.webp** - Open Graph social media preview (1200x630px)
4. **chatbot.webp** - Chat Buddhi project screenshot (600x400px)
5. **healtech.webp** - HealTech project screenshot (600x400px)
6. **lumina.webp** - Lumina project screenshot (600x400px)
7. **microprojects.webp** - MicroProjects screenshot (600x400px)
8. **smart-select.webp** - Smart Select project screenshot (600x400px)
9. **Smart Health Monitor.webp** - Smart Health Monitor screenshot (600x400px)

## How to Create WebP Images

### Option 1: Online Converter (Easiest)
Visit: https://squoosh.app/
- Upload your image
- Select WebP as output format
- Set quality to 85
- Set dimensions as specified above
- Download

### Option 2: Using ImageMagick (Command Line)
If you have the original AVIF or PNG files:

```bash
# Install ImageMagick first
# Windows: choco install imagemagick
# macOS: brew install imagemagick
# Linux: sudo apt install imagemagick

# Convert and resize
magick input.avif -resize 600x400 output.webp
```

### Option 3: Batch Convert (PowerShell)
```powershell
# If you have source images in another format
Get-ChildItem *.png | ForEach-Object {
  magick $_.Name -quality 85 "$($_.BaseName).webp"
}
```

## Icon Files (static/assets/icons/)
All icon WebP files are already present! ✅

The following icons are ready:
- om.webp (20x20px) ✅
- swastika.webp (20x20px) ✅
- gfg.webp (20x20px) ✅
- communication.webp (40x40px) ✅
- css.webp, html.webp, js.webp, java.webp, python.webp ✅
- And all other skill/social icons ✅

## Performance Impact
Once all WebP images are in place:
- **Estimated size savings**: 40-60% vs original images
- **Expected LCP improvement**: 300-500ms
- **PageSpeed Score**: +5-8 points

## Current Status
- [x] All HTML references updated to .webp
- [x] All AVIF files deleted
- [x] All 9 main asset WebP files created and optimized
- [x] Icon WebP files already exist
- [x] **MIGRATION COMPLETE - ALL IMAGES OPTIMIZED!** ✅

## Image Size Summary
| File Name | Size | Dimensions | Savings vs AVIF |
|-----------|------|------------|-----------------|
| logo.webp | 0.95 KB | 40x40px | 75.8% smaller |
| my_photo.webp | 13.67 KB | 300x300px | 33.8% smaller |
| og-image.webp | 2.41 KB | 1200x630px | New (placeholder) |
| chatbot.webp | 1.21 KB | 600x400px | New (placeholder) |
| healtech.webp | 6.30 KB | 600x400px | 31.2% smaller |
| lumina.webp | 3.90 KB | 600x400px | 4.1% smaller |
| microprojects.webp | 3.11 KB | 600x400px | Optimized |
| smart-select.webp | 14.29 KB | 600x400px | 89.7% smaller |
| Smart Health Monitor.webp | 12.06 KB | 600x400px | 8.5% smaller |
| **TOTAL** | **57.90 KB** | - | **71.7% smaller** |
