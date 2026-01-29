// Room Manager - Handles daily room generation and configuration
class RoomManager {
    static roomTypes = [
        {
            id: 'bedroom',
            name: 'Bedroom',
            description: 'A cozy bedroom that needs tidying up',
            furniture: [
                { type: 'bed', x: 50, y: 300, width: 200, height: 100 },
                { type: 'dresser', x: 600, y: 250, width: 150, height: 150 },
                { type: 'nightstand', x: 270, y: 320, width: 60, height: 60 },
                { type: 'closet', x: 20, y: 50, width: 100, height: 200 }
            ],
            cleaningZones: [
                { id: 'bed', x: 50, y: 300, width: 200, height: 100, accepts: ['bedding'] },
                { id: 'dresser', x: 600, y: 250, width: 150, height: 150, accepts: ['item', 'clothes'] },
                { id: 'hamper', x: 400, y: 450, width: 60, height: 70, accepts: ['clothes'] },
                { id: 'trash', x: 700, y: 450, width: 50, height: 80, accepts: ['trash'] }
            ],
            messyItems: [
                // Bedding items
                { type: 'bedding', name: 'Pillow', color: '#F0F8FF', size: 'medium' },
                { type: 'bedding', name: 'Blanket', color: '#87CEEB', size: 'large' },
                { type: 'bedding', name: 'Sheet', color: '#FFFFFF', size: 'large' },
                
                // Clothes
                { type: 'clothes', name: 'T-Shirt', color: '#4169E1', size: 'medium' },
                { type: 'clothes', name: 'Jeans', color: '#000080', size: 'medium' },
                { type: 'clothes', name: 'Socks', color: '#FFFFFF', size: 'small' },
                { type: 'clothes', name: 'Underwear', color: '#FF69B4', size: 'small' },
                { type: 'clothes', name: 'Hoodie', color: '#808080', size: 'large' },
                
                // Personal items
                { type: 'item', name: 'Book', color: '#8B4513', size: 'small' },
                { type: 'item', name: 'Phone Charger', color: '#000000', size: 'small' },
                { type: 'item', name: 'Headphones', color: '#2F4F4F', size: 'small' },
                { type: 'item', name: 'Water Bottle', color: '#00BFFF', size: 'medium' },
                { type: 'item', name: 'Notebook', color: '#FFE4B5', size: 'small' },
                { type: 'item', name: 'Pen', color: '#0000FF', size: 'small' },
                { type: 'item', name: 'Keys', color: '#C0C0C0', size: 'small' },
                { type: 'item', name: 'Wallet', color: '#8B4513', size: 'small' },
                { type: 'item', name: 'Sunglasses', color: '#000000', size: 'small' },
                { type: 'item', name: 'Watch', color: '#C0C0C0', size: 'small' },
                
                // Trash
                { type: 'trash', name: 'Tissue', color: '#F5F5F5', size: 'small' },
                { type: 'trash', name: 'Candy Wrapper', color: '#FFD700', size: 'small' },
                { type: 'trash', name: 'Receipt', color: '#FFFFFF', size: 'small' },
                { type: 'trash', name: 'Empty Cup', color: '#FFFFFF', size: 'medium' },
                { type: 'trash', name: 'Food Container', color: '#FF6B35', size: 'medium' }
            ]
        },
        
        {
            id: 'kitchen',
            name: 'Kitchen',
            description: 'A busy kitchen that needs cleaning',
            furniture: [
                { type: 'counter', x: 50, y: 350, width: 300, height: 80 },
                { type: 'sink', x: 400, y: 350, width: 100, height: 80 },
                { type: 'stove', x: 550, y: 350, width: 100, height: 80 },
                { type: 'fridge', x: 700, y: 200, width: 80, height: 200 },
                { type: 'table', x: 200, y: 500, width: 150, height: 80 }
            ],
            cleaningZones: [
                { id: 'sink', x: 400, y: 350, width: 100, height: 80, accepts: ['dishes'] },
                { id: 'counter', x: 50, y: 350, width: 300, height: 80, accepts: ['item', 'utensils'] },
                { id: 'fridge', x: 700, y: 200, width: 80, height: 200, accepts: ['food'] },
                { id: 'trash', x: 20, y: 450, width: 50, height: 80, accepts: ['trash'] }
            ],
            messyItems: [
                // Dishes
                { type: 'dishes', name: 'Dirty Plate', color: '#F5F5DC', size: 'medium' },
                { type: 'dishes', name: 'Coffee Mug', color: '#8B4513', size: 'small' },
                { type: 'dishes', name: 'Bowl', color: '#FFFFFF', size: 'medium' },
                { type: 'dishes', name: 'Fork', color: '#C0C0C0', size: 'small' },
                { type: 'dishes', name: 'Knife', color: '#C0C0C0', size: 'small' },
                { type: 'dishes', name: 'Spoon', color: '#C0C0C0', size: 'small' },
                { type: 'dishes', name: 'Glass', color: '#E6E6FA', size: 'small' },
                
                // Food items
                { type: 'food', name: 'Apple', color: '#FF0000', size: 'small' },
                { type: 'food', name: 'Banana', color: '#FFFF00', size: 'small' },
                { type: 'food', name: 'Milk Carton', color: '#FFFFFF', size: 'medium' },
                { type: 'food', name: 'Bread', color: '#DEB887', size: 'medium' },
                
                // Kitchen items
                { type: 'item', name: 'Dish Towel', color: '#87CEEB', size: 'small' },
                { type: 'item', name: 'Oven Mitt', color: '#FF6347', size: 'small' },
                { type: 'item', name: 'Recipe Card', color: '#FFFACD', size: 'small' },
                { type: 'item', name: 'Salt Shaker', color: '#FFFFFF', size: 'small' },
                { type: 'item', name: 'Pepper Shaker', color: '#000000', size: 'small' },
                
                // Trash
                { type: 'trash', name: 'Pizza Box', color: '#FF6B35', size: 'large' },
                { type: 'trash', name: 'Soda Can', color: '#FF0000', size: 'small' },
                { type: 'trash', name: 'Food Wrapper', color: '#FFD700', size: 'small' },
                { type: 'trash', name: 'Paper Napkin', color: '#F5F5F5', size: 'small' },
                { type: 'trash', name: 'Takeout Container', color: '#FFFFFF', size: 'medium' },
                { type: 'trash', name: 'Coffee Filter', color: '#8B4513', size: 'small' },
                { type: 'trash', name: 'Banana Peel', color: '#FFFF00', size: 'small' }
            ]
        },
        
        {
            id: 'living_room',
            name: 'Living Room',
            description: 'A comfortable living room that needs organizing',
            furniture: [
                { type: 'couch', x: 100, y: 300, width: 200, height: 100 },
                { type: 'coffee_table', x: 150, y: 420, width: 100, height: 60 },
                { type: 'tv_stand', x: 500, y: 250, width: 150, height: 80 },
                { type: 'bookshelf', x: 50, y: 50, width: 80, height: 200 },
                { type: 'side_table', x: 320, y: 320, width: 50, height: 50 }
            ],
            cleaningZones: [
                { id: 'bookshelf', x: 50, y: 50, width: 80, height: 200, accepts: ['item', 'books'] },
                { id: 'coffee_table', x: 150, y: 420, width: 100, height: 60, accepts: ['item'] },
                { id: 'tv_stand', x: 500, y: 250, width: 150, height: 80, accepts: ['electronics'] },
                { id: 'trash', x: 700, y: 450, width: 50, height: 80, accepts: ['trash'] }
            ],
            messyItems: [
                // Books and media
                { type: 'books', name: 'Novel', color: '#8B4513', size: 'small' },
                { type: 'books', name: 'Magazine', color: '#FF69B4', size: 'small' },
                { type: 'books', name: 'Newspaper', color: '#D3D3D3', size: 'medium' },
                { type: 'books', name: 'Comic Book', color: '#FF6347', size: 'small' },
                
                // Electronics
                { type: 'electronics', name: 'TV Remote', color: '#2F4F4F', size: 'small' },
                { type: 'electronics', name: 'Game Controller', color: '#000000', size: 'medium' },
                { type: 'electronics', name: 'Phone Charger', color: '#FFFFFF', size: 'small' },
                { type: 'electronics', name: 'Tablet', color: '#C0C0C0', size: 'medium' },
                { type: 'electronics', name: 'Headphones', color: '#000000', size: 'medium' },
                
                // General items
                { type: 'item', name: 'Throw Pillow', color: '#87CEEB', size: 'medium' },
                { type: 'item', name: 'Blanket', color: '#DDA0DD', size: 'large' },
                { type: 'item', name: 'Coaster', color: '#8B4513', size: 'small' },
                { type: 'item', name: 'Candle', color: '#FFE4B5', size: 'small' },
                { type: 'item', name: 'Picture Frame', color: '#C0C0C0', size: 'small' },
                { type: 'item', name: 'Plant Pot', color: '#228B22', size: 'medium' },
                { type: 'item', name: 'Vase', color: '#E6E6FA', size: 'medium' },
                
                // Trash
                { type: 'trash', name: 'Popcorn Bowl', color: '#FFFF00', size: 'medium' },
                { type: 'trash', name: 'Soda Bottle', color: '#00BFFF', size: 'medium' },
                { type: 'trash', name: 'Chip Bag', color: '#FFD700', size: 'medium' },
                { type: 'trash', name: 'Tissue', color: '#F5F5F5', size: 'small' },
                { type: 'trash', name: 'Candy Wrapper', color: '#FF1493', size: 'small' },
                { type: 'trash', name: 'Paper Plate', color: '#FFFFFF', size: 'medium' },
                { type: 'trash', name: 'Napkin', color: '#F5F5F5', size: 'small' }
            ]
        }
    ];

    static getTodaysRoom() {
        // Use date as seed for consistent daily room
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        
        // Simple seeded random
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        
        // Select room type based on seed
        const roomIndex = Math.floor(seededRandom(seed) * this.roomTypes.length);
        const baseRoom = this.roomTypes[roomIndex];
        
        // Generate today's specific configuration
        return this.generateRoomConfig(baseRoom, seed);
    }

    static generateRoomConfig(baseRoom, seed) {
        const seededRandom = (s) => {
            const x = Math.sin(s) * 10000;
            return x - Math.floor(x);
        };
        
        // Clone base room
        const roomConfig = {
            ...baseRoom,
            furniture: [...baseRoom.furniture],
            cleaningZones: [...baseRoom.cleaningZones],
            seed: seed
        };
        
        // Shuffle and select 25 messy items
        const shuffledItems = [...baseRoom.messyItems];
        
        // Fisher-Yates shuffle with seeded random
        for (let i = shuffledItems.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed + i) * (i + 1));
            [shuffledItems[i], shuffledItems[j]] = [shuffledItems[j], shuffledItems[i]];
        }
        
        // Take first 25 items
        roomConfig.selectedItems = shuffledItems.slice(0, 25);
        
        // Generate positions for items (avoiding furniture)
        roomConfig.itemPositions = this.generateItemPositions(roomConfig, seed);
        
        return roomConfig;
    }

    static generateItemPositions(roomConfig, seed) {
        const positions = [];
        const seededRandom = (s) => {
            const x = Math.sin(s) * 10000;
            return x - Math.floor(x);
        };
        
        const roomWidth = 800;
        const roomHeight = 600;
        const itemSizes = {
            small: { width: 25, height: 25 },
            medium: { width: 35, height: 35 },
            large: { width: 50, height: 50 }
        };
        
        // Create occupancy grid to avoid furniture
        const gridSize = 20;
        const gridWidth = Math.ceil(roomWidth / gridSize);
        const gridHeight = Math.ceil(roomHeight / gridSize);
        const occupancyGrid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(false));
        
        // Mark furniture areas as occupied
        roomConfig.furniture.forEach(furniture => {
            const startX = Math.floor(furniture.x / gridSize);
            const startY = Math.floor(furniture.y / gridSize);
            const endX = Math.ceil((furniture.x + furniture.width) / gridSize);
            const endY = Math.ceil((furniture.y + furniture.height) / gridSize);
            
            for (let y = startY; y < endY && y < gridHeight; y++) {
                for (let x = startX; x < endX && x < gridWidth; x++) {
                    occupancyGrid[y][x] = true;
                }
            }
        });
        
        // Generate positions for each item
        roomConfig.selectedItems.forEach((item, index) => {
            const size = itemSizes[item.size] || itemSizes.medium;
            let attempts = 0;
            let position = null;
            
            while (attempts < 50 && !position) {
                const x = Math.floor(seededRandom(seed + index * 100 + attempts) * (roomWidth - size.width));
                const y = Math.floor(seededRandom(seed + index * 100 + attempts + 50) * (roomHeight - size.height - 100)) + 100; // Avoid top area
                
                // Check if position is free
                const gridX = Math.floor(x / gridSize);
                const gridY = Math.floor(y / gridSize);
                const gridEndX = Math.ceil((x + size.width) / gridSize);
                const gridEndY = Math.ceil((y + size.height) / gridSize);
                
                let isFree = true;
                for (let gy = gridY; gy < gridEndY && gy < gridHeight && isFree; gy++) {
                    for (let gx = gridX; gx < gridEndX && gx < gridWidth && isFree; gx++) {
                        if (occupancyGrid[gy][gx]) {
                            isFree = false;
                        }
                    }
                }
                
                if (isFree) {
                    position = { x, y, ...size };
                    
                    // Mark this area as occupied
                    for (let gy = gridY; gy < gridEndY && gy < gridHeight; gy++) {
                        for (let gx = gridX; gx < gridEndX && gx < gridWidth; gx++) {
                            occupancyGrid[gy][gx] = true;
                        }
                    }
                }
                
                attempts++;
            }
            
            // Fallback position if no free space found
            if (!position) {
                position = {
                    x: (index % 10) * 60 + 50,
                    y: Math.floor(index / 10) * 40 + 150,
                    ...size
                };
            }
            
            positions.push(position);
        });
        
        return positions;
    }

    static getRoomPreview(roomConfig) {
        // Generate a small preview image of the room
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        
        // Scale factor
        const scale = 0.25;
        
        // Draw room background
        const gradient = ctx.createLinearGradient(0, 0, 200, 120);
        gradient.addColorStop(0, '#8B7355');
        gradient.addColorStop(1, '#6B5B47');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 120);
        
        // Draw furniture (simplified)
        ctx.fillStyle = '#654321';
        roomConfig.furniture.forEach(furniture => {
            ctx.fillRect(
                furniture.x * scale,
                furniture.y * scale,
                furniture.width * scale,
                furniture.height * scale
            );
        });
        
        // Draw some messy items as dots
        roomConfig.selectedItems.slice(0, 10).forEach((item, index) => {
            const pos = roomConfig.itemPositions[index];
            if (pos) {
                ctx.fillStyle = item.color;
                ctx.beginPath();
                ctx.arc(
                    (pos.x + pos.width/2) * scale,
                    (pos.y + pos.height/2) * scale,
                    3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        });
        
        return canvas.toDataURL();
    }

    static getAllRoomTypes() {
        return this.roomTypes.map(room => ({
            id: room.id,
            name: room.name,
            description: room.description
        }));
    }

    static getRoomById(id) {
        return this.roomTypes.find(room => room.id === id);
    }
}