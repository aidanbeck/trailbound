import World from './World.js';
import View from './View.js';
import { TileType, FloorType, MobileType } from './Types.js';
import Mobile from './Mobile.js';

const world = new World();
const view = new View();

world.floorTypes.push(
    new FloorType('grass.bmp'),
    new FloorType('darkGrass.bmp')
);
world.floorTypes[-1] = new FloorType('bush.png');

world.tileTypes.push(
    null,
    new TileType('bush.png'),
    new TileType('rose.png'),
    new TileType('plant.png'),
    new TileType('rock.png'),
    new TileType('stump.png'),
    new TileType('chest.png')
);

world.mobileTypes.push(
    new MobileType('truck.png')
);


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