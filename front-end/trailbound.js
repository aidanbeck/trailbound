import World from './World.js';
import View from './View.js';
import { TileType, FloorType, MobileType } from './Types.js';
import Mobile from './Mobile.js';

const world = new World();
const view = new View();

const grass = new FloorType('grass.bmp');
const darkGrass = new FloorType('darkGrass.bmp');
const bush = new TileType('bush.png');
const truck = new MobileType('truck.png');

world.floorTypes.push(grass, darkGrass);
world.tileTypes.push(null, bush);
world.mobileTypes.push(truck);

world.setFloor(0, 0, 1);
world.setFloor(1, 1, 1);
world.setFloor(2, 2, 1);

world.setTile(1, 1, 1);

world.createMobile(new Mobile(
    2, 2, 0
));

view.updateView(world);

export default function getState() {
    return {
        world: world,
        view: view
    }
}

// const buffer = new Uint8Array([1, 2, 3, 4]);
// socket.send(buffer);