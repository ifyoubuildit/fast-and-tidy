# How to Add Photo-Realistic Images

## Quick Setup (30 minutes)

### Step 1: Generate Images with AI

1. **Go to ChatGPT Plus** or **Midjourney**
2. **Copy prompts** from `AI_IMAGE_PROMPTS.md`
3. **Generate 6 room images:**
   - `bedroom-messy.jpg`
   - `bedroom-clean.jpg`
   - `kitchen-messy.jpg`
   - `kitchen-clean.jpg`
   - `living_room-messy.jpg`
   - `living_room-clean.jpg`

### Step 2: Add Images to Your Project

**Save images to these folders:**
```
images/rooms/bedroom/messy.jpg
images/rooms/bedroom/clean.jpg
images/rooms/kitchen/messy.jpg
images/rooms/kitchen/clean.jpg
images/rooms/living_room/messy.jpg
images/rooms/living_room/clean.jpg
```

### Step 3: Test Your Game

1. **Commit and push** to GitHub
2. **Netlify will auto-deploy**
3. **Your game now has photo-realistic rooms!**

## Advanced Setup (Optional)

### Individual Item Sprites

Generate PNG images with transparent backgrounds for each item:

```
images/items/bedroom/shirt.png
images/items/bedroom/jeans.png
images/items/bedroom/pillow.png
... (see AI_IMAGE_PROMPTS.md for full list)
```

### Firebase Storage (For Production)

1. **Set up Firebase** (see `js/firebase-config.js`)
2. **Upload images** to Firebase Storage
3. **Update config** with your Firebase credentials
4. **Images load from cloud** (faster, more reliable)

## Image Requirements

- **Room backgrounds**: 1920x1080px, JPG format
- **Individual items**: 200x200px max, PNG with transparency
- **File size**: Keep under 500KB each for fast loading
- **Quality**: High resolution for crisp display

## Testing

After adding images:
1. **Clear browser cache** (Ctrl+F5)
2. **Check browser console** for any loading errors
3. **Test on mobile** to ensure images scale properly

Your game will automatically use real images when available, falling back to placeholders if not found.