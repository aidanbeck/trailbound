class View {
    constructor(x, y, width = 9, height = 9) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.tiles = [];
        this.floors = [];
    }

    getTiles(world) {

        // clear arrays
        this.tiles.length = 0;
        this.floors.length = 0;

        const startX = this.x;
        const endX = this.x + this.width;
        const startY = this.y;
        const endY = this.y + this.height; // todo change this to center view on x,y

        for (let i = startY; i < endY; i++) {
            for (let j = startX; j < endX; j++) {
                this.tiles.push(world.getTile(i, j));
                this.floors.push(world.getFloor(i, j));js cl
            }
        }
    }
}