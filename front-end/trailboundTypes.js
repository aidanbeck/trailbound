import { TileType, FloorType, MobileType } from './trailbound/Types.js';

const floorTypes = [
    new FloorType('grass.bmp'),
    new FloorType('darkGrass.bmp')
];
floorTypes[-1] = new FloorType('darkGrass.bmp');

const tileTypes = [
    null,
    new TileType('bush.png'),
    new TileType('rose.png'),
    new TileType('plant.png'),
    new TileType('rock.png'),
    new TileType('stump.png'),
    new TileType('chest.png')
];

const mobileTypes = [
    new MobileType('truck.png')
];

export { tileTypes, floorTypes, mobileTypes }