class World {
    constructor(width = 256, height = 256) {
        
        this.tileTypes = [];
        this.floorTypes = [];
        this.mobileTypes = [];
        
        this.tiles = []; // 256x256 array: tree, boulder, bush, tall grass, wall
        this.floors = []; // 256x256 array: grass, dirt, water, stone, wood floor
        this.mobiles = []; // dynamic array: hiker, enemy, rock, stick, tools, items
        this.freeMobileIndexes = []; // dynamic array: available indexes in mobile

        this.width = width;
        this.height = height;
        const defaultTile = 0;
        const defaultFloor = 0;

        for (let i = 0; i < height; i++) {
            this.tiles[i] = [];
            this.floors[i] = [];
            for (let j = 0; j < width; j++) {
                this.tiles[i][j] = defaultTile;
                this.floors[i][j] = defaultFloor;
            }
        }
    }

    isOutOfBounds(x, y) {
        const coordinateIsNegative = x < 0 || y < 0;
        const coordinateIsBeyond = x > this.width || y > this.height;
        return coordinateIsNegative || coordinateIsBeyond;
    }

    getTile(x, y) {
        if (this.isOutOfBounds(x, y)) { return -1; }
        return this.tiles[y][x];
    }

    setTile(x, y, tile) {
        if (this.isOutOfBounds(x, y)) { return; } // todo throw error
        this.tiles[y][x] = tile;
    }

    getFloor (x, y) {
        if (this.isOutOfBounds(x, y)) { return -1; }
        return this.floors[y][x];
    }

    setFloor(x, y, floor) {
        if (this.isOutOfBounds(x, y)) { return; } // todo throw error
        this.tiles[y][x] = floor;
    }

    getMobile(index) {}
    createMobile(mobile) {}
    removeMobile(index) {}
}