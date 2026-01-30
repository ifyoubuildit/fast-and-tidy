# Deployment Guide for Fast & Tidy

## Quick Start

Your game is ready to deploy! Here are the steps to get it live:

## 1. GitHub Repository Setup

First, create the GitHub repository:

1. Go to [GitHub](https://github.com) and create a new repository named `fast-and-tidy`
2. Make it public (required for free Netlify hosting)
3. Don't initialize with README (we already have files)

Then push your code:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/fast-and-tidy.git
git push -u origin main
```

## 2. Netlify Deployment (Recommended)

### Automatic Deployment
1. Go to [Netlify](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select your `fast-and-tidy` repository
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: (leave empty or put `.`)
6. Click "Deploy site"

Your game will be live at `https://random-name.netlify.app` in ~2 minutes!

### Custom Domain (Optional)
1. In Netlify dashboard, go to Site settings > Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `fast-and-tidy.com`)
4. Follow DNS setup instructions

## 3. Firebase Setup (For Photo-Realistic Images)

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it "Fast-and-Tidy"
4. Enable Google Analytics (optional)

### Enable Storage
1. In Firebase console, go to Storage
2. Click "Get started"
3. Choose "Start in test mode" for now
4. Select a location close to your users

### Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web app" icon (</>)
4. Register app with name "Fast & Tidy Web"
5. Copy the config object

### Update Your Code
1. Open `js/firebase-config.js`
2. Replace the placeholder config with your real config
3. Uncomment the Firebase import lines
4. Commit and push changes

### Upload Images
Create this folder structure in Firebase Storage:

```
/rooms/
  /bedroom/
    - messy.jpg (800x600px photo of messy bedroom)
    - clean.jpg (800x600px photo of clean bedroom)
  /kitchen/
    - messy.jpg
    - clean.jpg
  /living_room/
    - messy.jpg
    - clean.jpg

/items/
  /bedroom/
    - pillow.png (transparent PNG of pillow)
    - blanket.png
    - shirt.png
    - jeans.png
    - book.png
    - etc.
  /kitchen/
    - plate.png
    - cup.png
    - fork.png
    - apple.png
    - etc.
  /living_room/
    - remote.png
    - magazine.png
    - headphones.png
    - etc.
```

## 4. PWA Icons

### Generate Icons
1. Open `create-icons.html` in your browser
2. Right-click each download link and save to `/icons/` folder
3. This creates all required PWA icon sizes

### Or Use Online Generator
1. Go to [PWA Icon Generator](https://www.pwabuilder.com/imageGenerator)
2. Upload a 512x512 icon
3. Download the generated icons
4. Place in `/icons/` folder

## 5. Audio Files

Add these audio files to `/audio/` folder:
- `pickup.mp3` - Short sound when picking up items
- `drop.mp3` - Satisfying sound when dropping items correctly
- `complete.mp3` - Celebration sound when room is complete

You can:
- Record your own sounds
- Use royalty-free sounds from [Freesound](https://freesound.org)
- Generate sounds with tools like [sfxr](https://sfxr.me)

## 6. Testing

### Local Testing
```bash
# Using Node.js
npx serve . -p 8000

# Using Python
python -m http.server 8000

# Then visit http://localhost:8000
```

### PWA Testing
1. Open Chrome DevTools
2. Go to Application tab
3. Check "Service Workers" and "Manifest" sections
4. Test "Add to Home Screen" functionality

### Mobile Testing
1. Deploy to Netlify first
2. Visit on your phone
3. Test touch interactions
4. Try "Add to Home Screen"

## 7. Performance Optimization

### Image Optimization
- Compress room photos (aim for <200KB each)
- Use WebP format for better compression
- Optimize item PNGs with tools like TinyPNG

### Caching Strategy
The service worker caches:
- Static files (HTML, CSS, JS) - cached immediately
- Images - cached on first load
- Audio - cached on first play

## 8. Analytics (Optional)

### Google Analytics
1. Create GA4 property
2. Add tracking code to `index.html`
3. Track game events (completions, times, etc.)

### Firebase Analytics
1. Enable Analytics in Firebase console
2. Add Firebase Analytics SDK
3. Track custom events

## 9. Monitoring

### Netlify Analytics
- Built-in visitor stats
- Performance monitoring
- Error tracking

### Firebase Performance
- Real user monitoring
- Performance insights
- Crash reporting

## 10. Updates

### Automatic Deployment
Every push to `main` branch automatically deploys to Netlify.

### Service Worker Updates
The service worker automatically updates when you deploy new versions.

### Cache Busting
Static files are cached with version numbers, so updates work seamlessly.

## Troubleshooting

### Common Issues

**Game won't load:**
- Check browser console for errors
- Verify all files are uploaded correctly
- Test in incognito mode

**PWA won't install:**
- Ensure HTTPS (Netlify provides this automatically)
- Check manifest.json is valid
- Verify service worker is registered

**Images not loading:**
- Check Firebase Storage rules
- Verify image paths in Firebase
- Check browser network tab for 404s

**Touch not working on mobile:**
- Test on actual device, not desktop browser
- Check for JavaScript errors
- Verify touch event handlers

### Getting Help

1. Check browser console for errors
2. Test in different browsers
3. Verify all files are committed to Git
4. Check Netlify deploy logs
5. Test Firebase connection in console

## Success! 🎉

Your game should now be live and working perfectly on both desktop and mobile devices. Players can install it as a PWA and play daily room cleaning challenges!

Next steps:
- Share with friends for testing
- Gather feedback
- Add more room types
- Implement achievements
- Add social sharing features