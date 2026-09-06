class Mobile {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // references index in MobileTypes array in world?
    }

    step(x, y, world) {} // move x,y if eligable, and handle problems like obstructions or skipping gracefully
}