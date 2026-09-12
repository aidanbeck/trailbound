import World from './World.js';
import View from './View.js';
import Mobile from './Mobile.js';

const world = new World();
const view = new View();

world.setFloor(0, 0, 1);
world.setFloor(1, 1, 1);
world.setFloor(2, 2, 1);

world.setTile(1, 1, 1);

world.createMobile(new Mobile(
    4, 4, 0
));

view.updateView(world);

export { world, view }
