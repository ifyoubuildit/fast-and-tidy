// Local Storage Manager
class GameStorage {
    constructor() {
        this.storageKey = 'fast-and-tidy';
        this.data = this.loadData();
    }

    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Failed to load game data:', error);
        }
        
        // Return default data structure
        return {
            version: '1.0.0',
            stats: {
                totalRoomsCompleted: 0,
                currentStreak: 0,
                longestStreak: 0,
                totalPlayTime: 0,
                averageCompletionTime: 0,
                fastestTime: null,
                lastPlayDate: null
            },
            completions: {}, // Date -> completion data
            settings: {
                soundEnabled: true,
                volume: 0.7,
                vibrationEnabled: true,
                theme: 'default'
            },
            achievements: []
        };
    }

    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (error) {
            console.error('Failed to save game data:', error);
        }
    }

    hasPlayedToday() {
        const today = Utils.getDateString();
        return this.data.completions.hasOwnProperty(today);
    }

    getTodayStats() {
        const today = Utils.getDateString();
        return this.data.completions[today] || null;
    }

    saveCompletion(stats) {
        const today = Utils.getDateString();
        const yesterday = Utils.getDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
        
        // Don't save if already completed today
        if (this.hasPlayedToday()) {
            return;
        }
        
        // Save today's completion
        this.data.completions[today] = {
            itemsCompleted: stats.itemsCompleted,
            roomType: stats.roomType,
            timestamp: Date.now()
        };
        
        // Update stats
        this.updateStats(stats, yesterday);
        
        // Check for achievements
        this.checkAchievements(stats);
        
        this.saveData();
    }

    updateStats(stats, yesterday) {
        const gameStats = this.data.stats;
        
        // Update basic stats
        gameStats.totalRoomsCompleted++;
        gameStats.lastPlayDate = Utils.getDateString();
        
        // Update streak
        if (this.data.completions[yesterday]) {
            // Continued streak
            gameStats.currentStreak++;
        } else {
            // New streak or broken streak
            gameStats.currentStreak = 1;
        }
        
        // Update longest streak
        if (gameStats.currentStreak > gameStats.longestStreak) {
            gameStats.longestStreak = gameStats.currentStreak;
        }
    }

    checkAchievements(stats) {
        const achievements = [];
        
        // First completion
        if (this.data.stats.totalRoomsCompleted === 1) {
            achievements.push({
                id: 'first-clean',
                name: 'First Clean',
                description: 'Complete your first room cleaning',
                icon: '🧹',
                unlockedAt: Date.now()
            });
        }
        
        // Speed achievements removed - focus on completion
        
        // Streak achievements
        const currentStreak = this.data.stats.currentStreak;
        if (currentStreak === 7) {
            achievements.push({
                id: 'week-warrior',
                name: 'Week Warrior',
                description: 'Clean rooms for 7 days in a row',
                icon: '📅',
                unlockedAt: Date.now()
            });
        }
        
        if (currentStreak === 30) {
            achievements.push({
                id: 'monthly-master',
                name: 'Monthly Master',
                description: 'Clean rooms for 30 days in a row',
                icon: '🗓️',
                unlockedAt: Date.now()
            });
        }
        
        // Milestone achievements
        const totalCompleted = this.data.stats.totalRoomsCompleted;
        if (totalCompleted === 10) {
            achievements.push({
                id: 'ten-rooms',
                name: 'Cleaning Novice',
                description: 'Complete 10 rooms',
                icon: '🏠',
                unlockedAt: Date.now()
            });
        }
        
        if (totalCompleted === 50) {
            achievements.push({
                id: 'fifty-rooms',
                name: 'Cleaning Expert',
                description: 'Complete 50 rooms',
                icon: '🏘️',
                unlockedAt: Date.now()
            });
        }
        
        if (totalCompleted === 100) {
            achievements.push({
                id: 'hundred-rooms',
                name: 'Cleaning Master',
                description: 'Complete 100 rooms',
                icon: '🏙️',
                unlockedAt: Date.now()
            });
        }
        
        // Add new achievements to the list
        achievements.forEach(achievement => {
            if (!this.data.achievements.find(a => a.id === achievement.id)) {
                this.data.achievements.push(achievement);
            }
        });
        
        return achievements;
    }

    getStats() {
        return { ...this.data.stats };
    }

    getAchievements() {
        return [...this.data.achievements];
    }

    getCompletionHistory(days = 30) {
        const history = [];
        const now = new Date();
        
        for (let i = 0; i < days; i++) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateString = Utils.getDateString(date);
            const completion = this.data.completions[dateString];
            
            history.unshift({
                date: dateString,
                completed: !!completion,
                completionTime: completion?.completionTime || null,
                roomType: completion?.roomType || null
            });
        }
        
        return history;
    }

    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    importData(jsonString) {
        try {
            const importedData = JSON.parse(jsonString);
            
            // Validate data structure
            if (importedData.version && importedData.stats && importedData.completions) {
                this.data = importedData;
                this.saveData();
                return true;
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }

    clearData() {
        if (confirm('Are you sure you want to clear all game data? This cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            this.data = this.loadData();
            return true;
        }
        return false;
    }

    // Settings management
    getSetting(key) {
        return this.data.settings[key];
    }

    setSetting(key, value) {
        this.data.settings[key] = value;
        this.saveData();
    }

    // Get streak information for display
    getStreakInfo() {
        const today = Utils.getDateString();
        const yesterday = Utils.getDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
        
        const hasPlayedToday = this.hasPlayedToday();
        const hasPlayedYesterday = this.data.completions.hasOwnProperty(yesterday);
        
        let streakStatus = 'active'; // active, at-risk, broken
        
        if (!hasPlayedToday && !hasPlayedYesterday) {
            streakStatus = 'broken';
        } else if (!hasPlayedToday && hasPlayedYesterday) {
            streakStatus = 'at-risk';
        }
        
        return {
            current: this.data.stats.currentStreak,
            longest: this.data.stats.longestStreak,
            status: streakStatus,
            hasPlayedToday: hasPlayedToday
        };
    }

    // Get performance metrics
    getPerformanceMetrics() {
        const completions = Object.values(this.data.completions);
        
        if (completions.length === 0) {
            return {
                averageTime: 0,
                fastestTime: 0,
                slowestTime: 0,
                improvementTrend: 0
            };
        }
        
        const times = completions.map(c => c.completionTime);
        const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
        const fastestTime = Math.min(...times);
        const slowestTime = Math.max(...times);
        
        // Calculate improvement trend (last 7 vs previous 7)
        let improvementTrend = 0;
        if (times.length >= 14) {
            const recent = times.slice(-7);
            const previous = times.slice(-14, -7);
            const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
            const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
            improvementTrend = ((previousAvg - recentAvg) / previousAvg) * 100;
        }
        
        return {
            averageTime: Math.round(averageTime),
            fastestTime,
            slowestTime,
            improvementTrend: Math.round(improvementTrend)
        };
    }
}