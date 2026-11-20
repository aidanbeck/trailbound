export default class Mobile {
    constructor(id, x, y, mobileType) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.mobileType = mobileType; // references index in MobileTypes array in world?
    }

    step(x, y, world) {} // move x,y if eligable, and handle problems like obstructions or skipping gracefully
}