import Texture from '../easel/Texture.js';

const TILE_SIZE = 16; // magic number!

function getTexture(imageSrc, offsetX = 0, offsetY = 0) {
    return new Texture(`./front-end/images/${imageSrc}`, TILE_SIZE, offsetX, offsetY);
}

class TileType {
    constructor(imageSrc, offsetX = 0, offsetY = 0) {
        this.texture = getTexture(imageSrc, offsetX, offsetY);
        this.isObstruction = false;
    }
}

class FloorType {
    constructor(imageSrc, offsetX = 0, offsetY = 0) {
        this.texture = getTexture(imageSrc, offsetX = 0, offsetY = 0);
        this.isObstruction = false;
    }
}

class MobileType {
    constructor(imageSrc, offsetX = 0, offsetY = 0) {
        this.texture = getTexture(imageSrc, offsetX = 0, offsetY = 0);
        this.isObstruction = false;
    }
}

export { TileType, FloorType, MobileType };