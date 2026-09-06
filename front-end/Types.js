import Texture from './easel/Texture.js';

const TILE_SIZE = 16; // magic number!

function getTexture(imageSrc) {
    return new Texture(`./front-end/images/${imageSrc}`, TILE_SIZE);
}

class TileType {
    constructor(imageSrc) {
        this.texture = getTexture(imageSrc);
        this.isObstruction = false;
    }
}

class FloorType {
    constructor(imageSrc) {
        this.texture = getTexture(imageSrc);
        this.isObstruction = false;
    }
}

class MobileType {
    constructor(imageSrc) {
        this.texture = getTexture(imageSrc);
        this.isObstruction = false;
    }
}

export { TileType, FloorType, MobileType };