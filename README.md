# Fast & Tidy - Daily Room Cleaning Game

A satisfying daily puzzle game where you clean a messy room by dragging and dropping items to their proper places. Built as a Progressive Web App that works perfectly on both desktop and mobile devices.

## 🎮 Game Features

- **Daily Challenge**: A new messy room to clean every day
- **Photo-realistic Rooms**: Bedroom, kitchen, living room, and more
- **25 Items to Clean**: Different types of mess requiring different solutions
- **Drag & Drop Mechanics**: Smooth touch and mouse interactions
- **Progressive Cleaning**: Watch the room transform as you tidy up
- **Sound Effects**: Satisfying cleaning sounds and feedback
- **Mobile Responsive**: Works perfectly on phones and tablets
- **PWA Support**: Install like a native app, works offline

## 🏠 Room Types

- **Bedroom**: Unmade beds, scattered clothes, personal items
- **Kitchen**: Dirty dishes, food items, cooking utensils
- **Living Room**: Books, electronics, entertainment items

## 🎯 How to Play

1. **Drag items** to their appropriate cleaning zones
2. **Trash items** go to the trash bin
3. **Clothes** go to the laundry hamper
4. **Dishes** go to the sink
5. **Books and items** go to shelves and storage
6. **Complete all 25 items** to finish the room

## 🛠️ Tech Stack

- **HTML5 Canvas** for smooth graphics and interactions
- **JavaScript** for game logic and state management
- **CSS3** for responsive design and animations
- **Web Audio API** for sound effects
- **Service Worker** for offline functionality and PWA features
- **Local Storage** for progress tracking and statistics

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/cwall/fast-and-tidy.git
cd fast-and-tidy
```

2. Serve the files using a local web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

3. Open your browser to `http://localhost:8000`

### Deployment

#### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: (none needed)
3. Set publish directory: `/`
4. Deploy automatically on push

#### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase: `firebase init hosting`
3. Deploy: `firebase deploy`

## 📱 PWA Installation

The game can be installed as a Progressive Web App:

- **Desktop**: Click the install button in your browser's address bar
- **Mobile**: Use "Add to Home Screen" from your browser menu
- **iOS**: Use Safari's "Add to Home Screen" option

## 🎨 Assets and Images

### Photo-realistic Images
For production, replace placeholder images with high-quality photos:

- **Room backgrounds**: 800x600px photos of actual messy/clean rooms
- **Item sprites**: Individual photos of items to be cleaned
- **Before/after comparisons**: Show the transformation

### Firebase Storage Structure
```
/rooms/
  /bedroom/
    - messy.jpg
    - clean.jpg
  /kitchen/
    - messy.jpg
    - clean.jpg
  /living_room/
    - messy.jpg
    - clean.jpg

/items/
  /bedroom/
    - pillow.png
    - blanket.png
    - clothes.png
  /kitchen/
    - dishes.png
    - food.png
  /living_room/
    - books.png
    - electronics.png
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Storage and set up security rules
3. Update the Firebase configuration in `js/firebase-config.js`

### Audio Files
Add audio files to the `/audio/` directory:
- `pickup.mp3` - Item pickup sound
- `drop.mp3` - Item drop sound
- `complete.mp3` - Room completion sound

## 📊 Game Statistics

The game tracks:
- Daily completion streaks
- Average completion time
- Fastest completion time
- Total rooms cleaned
- Achievement unlocks

## 🏆 Achievements

- **First Clean**: Complete your first room
- **Speed Demon**: Complete a room in under 1 minute
- **Week Warrior**: 7-day cleaning streak
- **Monthly Master**: 30-day cleaning streak
- **Cleaning Expert**: Complete 50 rooms

## 🎵 Sound Design

The game uses Web Audio API for:
- Pickup sounds when grabbing items
- Drop sounds when placing items
- Success sounds for correct placements
- Completion fanfare when finishing
- Ambient room sounds (optional)

## 📱 Mobile Optimization

- Touch-friendly drag and drop
- Responsive canvas scaling
- Optimized for various screen sizes
- Haptic feedback on supported devices
- Gesture-based interactions

## 🔄 Daily Room Generation

Each day features a unique room configuration:
- Deterministic generation based on date
- 25 randomly placed items from room-specific pools
- Consistent experience for all players on the same day
- Balanced difficulty and item distribution

## 🚀 Performance

- Lazy loading of images
- Efficient canvas rendering
- Minimal JavaScript bundle
- Service worker caching
- Optimized for 60fps gameplay

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🎮 Play Now

Visit [fast-and-tidy.netlify.app](https://fast-and-tidy.netlify.app) to play!

---

Built with ❤️ for daily cleaning satisfaction