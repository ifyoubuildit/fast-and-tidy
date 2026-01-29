// Audio Manager
class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.7;
        
        this.soundConfig = {
            pickup: {
                frequency: 800,
                duration: 0.1,
                type: 'sine',
                volume: 0.3
            },
            drop: {
                frequency: 400,
                duration: 0.2,
                type: 'sine',
                volume: 0.5
            },
            complete: {
                frequencies: [523, 659, 784, 1047], // C, E, G, C
                duration: 0.15,
                type: 'sine',
                volume: 0.6
            },
            error: {
                frequency: 200,
                duration: 0.3,
                type: 'sawtooth',
                volume: 0.4
            }
        };
        
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = this.volume;
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.enabled = false;
        }
    }

    async preloadSounds() {
        if (!this.enabled) return;
        
        // Preload HTML audio elements if they exist
        const audioElements = ['pickup', 'drop', 'complete'];
        
        for (const soundName of audioElements) {
            const audioElement = document.getElementById(`audio-${soundName}`);
            if (audioElement) {
                this.sounds[soundName] = audioElement;
                audioElement.volume = this.volume;
                
                // Preload the audio
                try {
                    await audioElement.load();
                } catch (error) {
                    console.warn(`Failed to preload ${soundName}:`, error);
                }
            }
        }
    }

    playSound(soundName, options = {}) {
        if (!this.enabled) return;
        
        // Try HTML audio first
        if (this.sounds[soundName] && this.sounds[soundName].play) {
            const audio = this.sounds[soundName];
            audio.currentTime = 0;
            audio.volume = (options.volume || 1) * this.volume;
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Failed to play ${soundName}:`, error);
                    // Fallback to Web Audio API
                    this.playWebAudioSound(soundName, options);
                });
            }
            return;
        }
        
        // Fallback to Web Audio API
        this.playWebAudioSound(soundName, options);
    }

    playWebAudioSound(soundName, options = {}) {
        if (!this.audioContext || !this.soundConfig[soundName]) return;
        
        // Resume audio context if suspended (required by some browsers)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const config = { ...this.soundConfig[soundName], ...options };
        
        if (soundName === 'complete') {
            this.playChord(config);
        } else {
            this.playTone(config);
        }
    }

    playTone(config) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);
        
        // Envelope
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(config.volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + config.duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + config.duration);
    }

    playChord(config) {
        config.frequencies.forEach((frequency, index) => {
            setTimeout(() => {
                this.playTone({
                    ...config,
                    frequency: frequency,
                    duration: config.duration
                });
            }, index * 50); // Stagger the notes
        });
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
        
        // Update HTML audio elements
        Object.values(this.sounds).forEach(sound => {
            if (sound.volume !== undefined) {
                sound.volume = this.volume;
            }
        });
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    isEnabled() {
        return this.enabled;
    }

    // Create a satisfying cleaning sound effect
    playCleaningEffect() {
        if (!this.enabled || !this.audioContext) return;
        
        // Create a sweeping sound effect
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = 'sawtooth';
        filter.type = 'lowpass';
        
        const now = this.audioContext.currentTime;
        const duration = 0.5;
        
        // Frequency sweep
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(800, now + duration * 0.3);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + duration);
        
        // Filter sweep
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(2000, now + duration * 0.5);
        filter.frequency.exponentialRampToValueAtTime(300, now + duration);
        
        // Envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    // Play a satisfying "pop" sound for successful actions
    playPopSound() {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = 'sine';
        
        const now = this.audioContext.currentTime;
        const duration = 0.1;
        
        // Quick frequency pop
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + duration);
        
        // Quick envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    // Ambient room sounds (optional)
    playAmbientSound(type = 'room') {
        // This could be expanded to play background ambient sounds
        // For now, just a placeholder
        console.log(`Playing ambient sound: ${type}`);
    }

    stopAllSounds() {
        // Stop HTML audio elements
        Object.values(this.sounds).forEach(sound => {
            if (sound.pause) {
                sound.pause();
                sound.currentTime = 0;
            }
        });
        
        // Web Audio API sounds will stop automatically due to their short duration
    }
}