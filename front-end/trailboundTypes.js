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
    new TileType('chest.png'),
    new TileType('spruceTree.png', -4, -32)
];

const mobileTypes = [
    new MobileType('rachel.png'),
    new MobileType('stefan.png')

];

export { tileTypes, floorTypes, mobileTypes }

// x offset 4
// y offset 32