// Main App Controller
class FastAndTidyApp {
    constructor() {
        this.currentScreen = 'loading';
        this.game = null;
        this.storage = new GameStorage();
        this.audio = new AudioManager();
        
        this.init();
    }

    async init() {
        // Show loading screen
        this.showScreen('loading');
        
        // Initialize components
        await this.loadResources();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check if user has played today
        const hasPlayedToday = this.storage.hasPlayedToday();
        
        // Show main menu after loading
        setTimeout(() => {
            this.showScreen('main-menu');
            this.updateMenuStats();
            
            if (hasPlayedToday) {
                this.showCompletedState();
            }
        }, 2000);
    }

    async loadResources() {
        // Preload room images and audio
        try {
            await this.audio.preloadSounds();
            // Add any other resource loading here
        } catch (error) {
            console.warn('Some resources failed to load:', error);
        }
    }

    setupEventListeners() {
        // Play button
        document.getElementById('play-button').addEventListener('click', () => {
            this.startGame();
        });

        // Menu button (from completion screen)
        document.getElementById('menu-button').addEventListener('click', () => {
            this.showScreen('main-menu');
            this.updateMenuStats();
        });

        // Pause button
        document.getElementById('pause-button').addEventListener('click', () => {
            if (this.game) {
                this.game.togglePause();
            }
        });

        // Share button
        document.getElementById('share-button').addEventListener('click', () => {
            this.shareResult();
        });

        // Handle visibility change (for pause/resume)
        document.addEventListener('visibilitychange', () => {
            if (this.game && document.hidden) {
                this.game.pause();
            }
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (this.game) {
                    this.game.handleResize();
                }
            }, 100);
        });

        // Handle resize
        window.addEventListener('resize', () => {
            if (this.game) {
                this.game.handleResize();
            }
        });
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }

    updateMenuStats() {
        const stats = this.storage.getStats();
        document.getElementById('streak-count').textContent = stats.currentStreak;
        document.getElementById('total-cleaned').textContent = stats.totalRoomsCompleted;
    }

    showCompletedState() {
        const playButton = document.getElementById('play-button');
        playButton.textContent = 'Already Completed Today!';
        playButton.disabled = true;
        playButton.style.opacity = '0.6';
        
        // Show completion time if available
        const todayStats = this.storage.getTodayStats();
        if (todayStats && todayStats.completionTime) {
            const timeText = this.formatTime(todayStats.completionTime);
            playButton.textContent = `Completed in ${timeText}`;
        }
    }

    async startGame() {
        // Check if already played today
        if (this.storage.hasPlayedToday()) {
            return;
        }

        this.showScreen('game-screen');
        
        // Get today's room configuration
        const roomConfig = RoomManager.getTodaysRoom();
        
        // Initialize game
        this.game = new Game(roomConfig, {
            onProgress: (progress) => this.updateProgress(progress),
            onComplete: (stats) => this.onGameComplete(stats),
            onPause: () => this.onGamePause(),
            onResume: () => this.onGameResume()
        });

        await this.game.init();
        this.game.start();
    }

    updateProgress(progress) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        const percentage = (progress.completed / progress.total) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${progress.completed}/${progress.total} items cleaned`;
    }

    onGameComplete(stats) {
        // Save completion data
        this.storage.saveCompletion(stats);
        
        // Show completion screen
        this.showCompletionScreen(stats);
        
        // Play completion sound
        this.audio.playSound('complete');
    }

    showCompletionScreen(stats) {
        this.showScreen('completion-screen');
        
        // Update completion stats
        document.getElementById('final-time').textContent = this.formatTime(stats.completionTime);
        
        // Show before/after comparison
        this.showBeforeAfter();
    }

    showBeforeAfter() {
        if (!this.game) return;
        
        const beforeCanvas = document.getElementById('before-canvas');
        const afterCanvas = document.getElementById('after-canvas');
        
        // Draw before state (messy room)
        const beforeCtx = beforeCanvas.getContext('2d');
        this.game.drawRoomState(beforeCtx, 'before');
        
        // Draw after state (clean room)
        const afterCtx = afterCanvas.getContext('2d');
        this.game.drawRoomState(afterCtx, 'after');
    }

    onGamePause() {
        // Handle game pause
        console.log('Game paused');
    }

    onGameResume() {
        // Handle game resume
        console.log('Game resumed');
    }

    shareResult() {
        const stats = this.storage.getTodayStats();
        if (!stats) return;

        const timeText = this.formatTime(stats.completionTime);
        const shareText = `I just cleaned my room in ${timeText} on Fast & Tidy! 🧹✨\n\nCan you beat my time? Play daily at: ${window.location.href}`;

        if (navigator.share) {
            // Use native sharing if available
            navigator.share({
                title: 'Fast & Tidy - Room Cleaning Game',
                text: shareText,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                // Show feedback
                const shareButton = document.getElementById('share-button');
                const originalText = shareButton.textContent;
                shareButton.textContent = 'Copied to Clipboard!';
                setTimeout(() => {
                    shareButton.textContent = originalText;
                }, 2000);
            }).catch(() => {
                // Final fallback - show share text in alert
                alert(shareText);
            });
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FastAndTidyApp();
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}