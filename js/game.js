// Main Game Class
class Game {
    constructor(roomConfig, callbacks = {}) {
        this.roomConfig = roomConfig;
        this.callbacks = callbacks;
        
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            startTime: null,
            completedItems: 0,
            totalItems: 25,
            draggedItem: null,
            dragOffset: { x: 0, y: 0 }
        };
        
        this.items = [];
        this.cleaningZones = [];
        this.roomImages = {
            messy: null,
            clean: null
        };
        
        this.setupCanvas();
        this.setupEventListeners();
    }

    async init() {
        await this.loadRoomImages();
        this.generateItems();
        this.createCleaningZones();
        this.render();
    }

    setupCanvas() {
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            const rect = container.getBoundingClientRect();
            
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            
            // Maintain aspect ratio for room
            this.roomScale = Math.min(
                this.canvas.width / 800,
                this.canvas.height / 600
            );
            
            this.roomOffset = {
                x: (this.canvas.width - 800 * this.roomScale) / 2,
                y: (this.canvas.height - 600 * this.roomScale) / 2
            };
            
            if (this.gameState.isPlaying) {
                this.render();
            }
        };
        
        resizeCanvas();
        this.handleResize = resizeCanvas;
    }

    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handlePointerDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handlePointerMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handlePointerUp(e));
        
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handlePointerDown(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handlePointerMove(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handlePointerUp(e.changedTouches[0]);
        });
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    async loadRoomImages() {
        // For now, create placeholder images
        // In production, these would load from Firebase Storage
        this.roomImages.messy = await this.createPlaceholderRoom('messy');
        this.roomImages.clean = await this.createPlaceholderRoom('clean');
    }

    async createPlaceholderRoom(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        // Draw room background
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        if (type === 'messy') {
            gradient.addColorStop(0, '#8B7355');
            gradient.addColorStop(1, '#6B5B47');
        } else {
            gradient.addColorStop(0, '#F5F5DC');
            gradient.addColorStop(1, '#E6E6D3');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Draw floor
        ctx.fillStyle = type === 'messy' ? '#8B4513' : '#DEB887';
        ctx.fillRect(0, 400, 800, 200);
        
        // Draw furniture outlines
        this.drawFurniture(ctx, type);
        
        return canvas;
    }

    drawFurniture(ctx, type) {
        ctx.strokeStyle = type === 'messy' ? '#654321' : '#8B7355';
        ctx.lineWidth = 3;
        
        // Bed
        ctx.strokeRect(50, 300, 200, 100);
        ctx.fillStyle = type === 'messy' ? '#696969' : '#F0F8FF';
        ctx.fillRect(52, 302, 196, 96);
        
        // Dresser
        ctx.strokeRect(600, 250, 150, 150);
        ctx.fillStyle = type === 'messy' ? '#8B4513' : '#DEB887';
        ctx.fillRect(602, 252, 146, 146);
        
        // Trash bin
        ctx.strokeRect(700, 450, 50, 80);
        ctx.fillStyle = type === 'messy' ? '#2F4F4F' : '#708090';
        ctx.fillRect(702, 452, 46, 76);
        
        // Laundry hamper
        ctx.strokeRect(400, 450, 60, 70);
        ctx.fillStyle = type === 'messy' ? '#8B4513' : '#DEB887';
        ctx.fillRect(402, 452, 56, 66);
    }

    generateItems() {
        const itemTypes = [
            // Trash items (go to trash bin)
            { type: 'trash', name: 'Pizza Box', target: 'trash', color: '#FF6B35' },
            { type: 'trash', name: 'Soda Can', target: 'trash', color: '#FF0000' },
            { type: 'trash', name: 'Candy Wrapper', target: 'trash', color: '#FFD700' },
            { type: 'trash', name: 'Paper Cup', target: 'trash', color: '#FFFFFF' },
            { type: 'trash', name: 'Tissue', target: 'trash', color: '#F5F5F5' },
            
            // Clothes items (go to hamper)
            { type: 'clothes', name: 'T-Shirt', target: 'hamper', color: '#4169E1' },
            { type: 'clothes', name: 'Jeans', target: 'hamper', color: '#000080' },
            { type: 'clothes', name: 'Socks', target: 'hamper', color: '#FFFFFF' },
            { type: 'clothes', name: 'Underwear', target: 'hamper', color: '#FF69B4' },
            { type: 'clothes', name: 'Hoodie', target: 'hamper', color: '#808080' },
            
            // Bed items (make bed)
            { type: 'bedding', name: 'Pillow', target: 'bed', color: '#F0F8FF' },
            { type: 'bedding', name: 'Blanket', target: 'bed', color: '#87CEEB' },
            { type: 'bedding', name: 'Sheet', target: 'bed', color: '#FFFFFF' },
            
            // General items (organize)
            { type: 'item', name: 'Book', target: 'dresser', color: '#8B4513' },
            { type: 'item', name: 'Phone Charger', target: 'dresser', color: '#000000' },
            { type: 'item', name: 'Headphones', target: 'dresser', color: '#2F4F4F' },
            { type: 'item', name: 'Water Bottle', target: 'dresser', color: '#00BFFF' },
            { type: 'item', name: 'Notebook', target: 'dresser', color: '#FFE4B5' },
            { type: 'item', name: 'Pen', target: 'dresser', color: '#0000FF' },
            { type: 'item', name: 'Keys', target: 'dresser', color: '#C0C0C0' },
            { type: 'item', name: 'Wallet', target: 'dresser', color: '#8B4513' },
            { type: 'item', name: 'Sunglasses', target: 'dresser', color: '#000000' },
            { type: 'item', name: 'Watch', target: 'dresser', color: '#C0C0C0' },
            { type: 'item', name: 'Magazine', target: 'dresser', color: '#FF69B4' },
            { type: 'item', name: 'Remote', target: 'dresser', color: '#2F4F4F' }
        ];
        
        // Shuffle and take 25 items
        const shuffled = itemTypes.sort(() => Math.random() - 0.5);
        const selectedItems = shuffled.slice(0, 25);
        
        this.items = selectedItems.map((itemConfig, index) => ({
            id: index,
            ...itemConfig,
            x: Math.random() * (800 - 40) + 20,
            y: Math.random() * (400 - 40) + 200,
            width: 30,
            height: 30,
            isDragging: false,
            isCompleted: false,
            originalPos: null
        }));
        
        // Set original positions
        this.items.forEach(item => {
            item.originalPos = { x: item.x, y: item.y };
        });
    }

    createCleaningZones() {
        this.cleaningZones = [
            {
                id: 'trash',
                x: 700,
                y: 450,
                width: 50,
                height: 80,
                accepts: ['trash']
            },
            {
                id: 'hamper',
                x: 400,
                y: 450,
                width: 60,
                height: 70,
                accepts: ['clothes']
            },
            {
                id: 'bed',
                x: 50,
                y: 300,
                width: 200,
                height: 100,
                accepts: ['bedding']
            },
            {
                id: 'dresser',
                x: 600,
                y: 250,
                width: 150,
                height: 150,
                accepts: ['item']
            }
        ];
    }

    start() {
        this.gameState.isPlaying = true;
        this.gameState.startTime = Date.now();
        this.startTimer();
    }

    pause() {
        this.gameState.isPaused = true;
    }

    resume() {
        this.gameState.isPaused = false;
    }

    togglePause() {
        if (this.gameState.isPaused) {
            this.resume();
            this.callbacks.onResume?.();
        } else {
            this.pause();
            this.callbacks.onPause?.();
        }
    }

    startTimer() {
        const updateTimer = () => {
            if (!this.gameState.isPlaying || this.gameState.isPaused) return;
            
            const elapsed = Math.floor((Date.now() - this.gameState.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            document.getElementById('timer-display').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (this.gameState.isPlaying) {
                requestAnimationFrame(updateTimer);
            }
        };
        
        updateTimer();
    }

    getPointerPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - this.roomOffset.x) / this.roomScale,
            y: (e.clientY - rect.top - this.roomOffset.y) / this.roomScale
        };
    }

    handlePointerDown(e) {
        if (!this.gameState.isPlaying || this.gameState.isPaused) return;
        
        const pos = this.getPointerPos(e);
        const item = this.getItemAt(pos.x, pos.y);
        
        if (item && !item.isCompleted) {
            this.gameState.draggedItem = item;
            this.gameState.dragOffset = {
                x: pos.x - item.x,
                y: pos.y - item.y
            };
            
            item.isDragging = true;
            this.canvas.style.cursor = 'grabbing';
            
            // Play pickup sound
            window.app?.audio.playSound('pickup');
            
            this.render();
        }
    }

    handlePointerMove(e) {
        if (!this.gameState.draggedItem) return;
        
        const pos = this.getPointerPos(e);
        const item = this.gameState.draggedItem;
        
        item.x = pos.x - this.gameState.dragOffset.x;
        item.y = pos.y - this.gameState.dragOffset.y;
        
        // Keep item within bounds
        item.x = Math.max(0, Math.min(800 - item.width, item.x));
        item.y = Math.max(0, Math.min(600 - item.height, item.y));
        
        this.render();
    }

    handlePointerUp(e) {
        if (!this.gameState.draggedItem) return;
        
        const item = this.gameState.draggedItem;
        const dropZone = this.getDropZoneAt(item.x + item.width/2, item.y + item.height/2);
        
        if (dropZone && dropZone.accepts.includes(item.type)) {
            // Successful drop
            item.isCompleted = true;
            item.isDragging = false;
            
            // Animate item to zone center
            this.animateItemToZone(item, dropZone);
            
            // Update progress
            this.gameState.completedItems++;
            this.callbacks.onProgress?.({
                completed: this.gameState.completedItems,
                total: this.gameState.totalItems
            });
            
            // Play drop sound
            window.app?.audio.playSound('drop');
            
            // Create particle effect
            this.createParticleEffect(item.x + item.width/2, item.y + item.height/2);
            
            // Check for completion
            if (this.gameState.completedItems >= this.gameState.totalItems) {
                this.completeGame();
            }
        } else {
            // Return to original position
            item.x = item.originalPos.x;
            item.y = item.originalPos.y;
            item.isDragging = false;
        }
        
        this.gameState.draggedItem = null;
        this.canvas.style.cursor = 'grab';
        this.render();
    }

    getItemAt(x, y) {
        // Check from top to bottom (reverse order for proper layering)
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (!item.isCompleted &&
                x >= item.x && x <= item.x + item.width &&
                y >= item.y && y <= item.y + item.height) {
                return item;
            }
        }
        return null;
    }

    getDropZoneAt(x, y) {
        return this.cleaningZones.find(zone =>
            x >= zone.x && x <= zone.x + zone.width &&
            y >= zone.y && y <= zone.y + zone.height
        );
    }

    animateItemToZone(item, zone) {
        const targetX = zone.x + zone.width/2 - item.width/2;
        const targetY = zone.y + zone.height/2 - item.height/2;
        
        const startX = item.x;
        const startY = item.y;
        const duration = 300; // ms
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            item.x = startX + (targetX - startX) * easeOut;
            item.y = startY + (targetY - startY) * easeOut;
            
            this.render();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    createParticleEffect(x, y) {
        const particles = [];
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0,
                decay: 0.02
            });
        }
        
        const animateParticles = () => {
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= particle.decay;
            });
            
            // Remove dead particles
            for (let i = particles.length - 1; i >= 0; i--) {
                if (particles[i].life <= 0) {
                    particles.splice(i, 1);
                }
            }
            
            this.render();
            
            if (particles.length > 0) {
                requestAnimationFrame(animateParticles);
            }
        };
        
        animateParticles();
    }

    completeGame() {
        this.gameState.isPlaying = false;
        const completionTime = Math.floor((Date.now() - this.gameState.startTime) / 1000);
        
        const stats = {
            completionTime: completionTime,
            itemsCompleted: this.gameState.completedItems,
            roomType: this.roomConfig.type
        };
        
        this.callbacks.onComplete?.(stats);
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context for transformations
        this.ctx.save();
        
        // Apply room scaling and offset
        this.ctx.translate(this.roomOffset.x, this.roomOffset.y);
        this.ctx.scale(this.roomScale, this.roomScale);
        
        // Draw room background
        if (this.roomImages.messy) {
            this.ctx.drawImage(this.roomImages.messy, 0, 0);
        }
        
        // Draw cleaning zones (when dragging)
        if (this.gameState.draggedItem) {
            this.drawCleaningZones();
        }
        
        // Draw items
        this.drawItems();
        
        // Restore context
        this.ctx.restore();
    }

    drawCleaningZones() {
        const draggedItem = this.gameState.draggedItem;
        
        this.cleaningZones.forEach(zone => {
            if (zone.accepts.includes(draggedItem.type)) {
                this.ctx.strokeStyle = '#4CAF50';
                this.ctx.lineWidth = 3;
                this.ctx.setLineDash([10, 5]);
                this.ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
                
                this.ctx.fillStyle = 'rgba(76, 175, 80, 0.2)';
                this.ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
            }
        });
        
        this.ctx.setLineDash([]);
    }

    drawItems() {
        this.items.forEach(item => {
            if (item.isCompleted) return;
            
            this.ctx.save();
            
            // Apply dragging effects
            if (item.isDragging) {
                this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowOffsetX = 2;
                this.ctx.shadowOffsetY = 2;
                this.ctx.globalAlpha = 0.9;
            }
            
            // Draw item
            this.ctx.fillStyle = item.color;
            this.ctx.fillRect(item.x, item.y, item.width, item.height);
            
            // Draw item border
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(item.x, item.y, item.width, item.height);
            
            // Draw item label (for debugging)
            if (item.isDragging) {
                this.ctx.fillStyle = '#333';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(item.name, item.x + item.width/2, item.y - 5);
            }
            
            this.ctx.restore();
        });
    }

    drawRoomState(ctx, state) {
        const image = state === 'before' ? this.roomImages.messy : this.roomImages.clean;
        if (image) {
            ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }
}