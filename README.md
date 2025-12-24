# TrailBound
A multiplayer hiking game written in Kotlin by aidanbeck.com.

Carve meticulous trails through a dense & mysterious forest- with friends!

## Purpose
My capstone portfolio project [Old Cove](https://github.com/aidanbeck/old-cove) has a Spring Boot back end, but is very front end heavy, and doesn't even deploy all its features for its demo.
I want to illustrate my skills by creating a project with a deployed server and a focus on back end features.
The front end will be minimal but serviceable, and will be replaced if user testing proves the design compelling and continuation promising.

This should be a short project. I want a gameplay prototype working before 2026, where I will test it with my friend groups.
I will use input from testing to polish the experience throughout January.
If my friends find the experience especially compelling, I will spend additional time to include more features and polish.

## Design Outline - Minimum Viable Product

**Registered Users & Guests**

The website will host multiple joinable "worlds", which users can create and invite each other to via game pins, like in Kahoot or Among Us.
Users can join these worlds synchronously or asynchronously: once a world is created, its invited users can influence them even if the hosting user is offline.

A User can be Registered, creating an account locked with a password and optional email. This will use proper encryption and authentication.
Registered users can create worlds and manage their world's settings (such as player invites) with a dashboard page.
They can also join other worlds, and the characters they create will be locked to their account.

A User can also be a Guest, and still join worlds and create Characters. Except, these Characters will be world specific and locked with an optional 6-digit pin.
A Guest User can also create a "Guest World", with default settings, no dashboard, and invites open to anyone with the game pin.
A Guest World or Character can be claimed by a Registered User, and claiming will prompt a user to register if they are not already.
This Guest User system will allow new users and their friends to jump right in, while leaving the door open to register and protect their progress.

**Worlds & Game Design**

A world will consist of a 256 x 256 manipulatable grid of tiles, representing a forest.
The obstructions will generate in thick formations, with small pockets of empty space disconnected from but neighboring each other.
Special tiles will also generate sporadically, representing resources, which will regenerate in 20 hours if consumed by a character.
Characters are entities controlled by users. A character can:
- move between unobstructed tiles
- spend energy to dismantle obstructions (trees, rocks, ponds, bushes)
- consume special tiles to regain energy (berries, nuts, mushrooms, roots)

The primary user story will be choosing precise cuts to connect nearby clearings, allowing for further exploration and resource discovery, enabling additional cuts to repeat the cycle.
An extrinsic objective may be added to motivate this exploration, such as reaching the edge, reaching the center, or collecting a set of artifacts around the world.
If user testing proves this core loop compelling, many other features and objectives could be added and expanded.

## Tech Stack

**Server**

- Kotlin
- Spring Boot
- PostgreSQL

**Client**

This project's focus is on back end features.
A basic HTML & JavaScript Client will be used initially, without much effort going beyond usability.
This will consist of:
- a grid of ascii characters representing the tiles near a user's position
 - a GET request set on a frequent interval, which updates the grid if anything has changed from other players.
 - If this method does not work well, websockets will be used.
- a directional pad of buttons for moving & dismantling
 - connected to REST functions, hooking into the backend, which also updates the ascii grid
- a line of 🪓 characters representing energy, or how many trees the user can chop.
- a line of text to communicate state. ie "you gained 2 energy", "you chop down the tree"
- a key outlining to the user what characters represent. ie "t - a small tree" and "q - a mushroom"
- mobile friendly spacing to prevent scrolling and size buttons comfortably

Later, if testing proves the project worth investing in, this will be redesigned. It could include:
- a customized React front end
- pixel art graphics representing each tile
- animations for button presses and state changes
- curated color and shape design for the UI


# Technical Blueprints - Class Outlines

This project can be split into two halves.
There is the User, Registration, Guest, and World dashboard / creation side of the project.
There is also the World Gameplay & Character side of the project.

For my initial pre-2026 prototyping, I will focus on the latter half, and only implement guest characters and worlds hosted by me.
These are some class outlines for the functionality.

**World Class**
- slug: unique id, game pin, and url slug for joining a world
- width, length: dimensions of the grid
- generationTable: a string of characters representing tile distribution. ie "..tTTT"
- seed: used for consistent random generation. Especially useful for unit testing
- tiles: a 1D array of Chars, accessed as a grid by offset indexing
- playerCharacters: Array of PlayerCharacter objects
* getTile(x, y): uses offset indexing to return the Char at (x,y) from tiles. If off grid, return a constant "border" character.
* setTile(x, y, char): uses offset indexing to set a Char at (x,y) in tiles. Throw an exception if off grid
* populateTiles(generationTable, seed): fill tiles based on the generationTable and seed. Then apply some rules similar to Conway's Game of Life to shape the generation. This won't be precisely tested, and might be massively changed.
* addPlayer(name, symbol, pinNumber): initializes PlayerCharacter, sets appropriate coordinates in world, and adds to World's playerCharacters array. If a player already exists with that name, throw an exception.
* removePlayer(name): remove a player with that name from the array. Adjust array 
* getPlayer(name): returns PlayerCharacter with that name from playerCharacters

**PlayerCharacter Class**
- name: unique string (within it's world)
- symbol: a Char used as the "skin" of a character. Limited to: ♔♕♖♗♘♙ ♚♛♜♝♞♟ ♡♢♤♧ ♠♥♦♣
pinNumber
- x, y: Coordinates representing position on the grid
- energy: number of tiles the player can break. Increased when resources are consumed, decreased when a block is broken.
- input(directionString, world): recieves an input "n", "s", "e", or "w", as well as a reference to World. Detects what tile exists in that direction from the player, and depending on the tile, calls move, break, or take.
- move(xOffset, yOffset, world): moves the player's x and y by an offset. Throw an exception if obstructed.
- break(xOffset, yOffset, world): replaces the offset position's tile with the destroyed version. If nothing can break, throw an exception.
- take(xOffset, yOffset, world): breaks the offset position's tile, and increases the player's energy by a set amount per tile type. If nothing can be taken, throw an exception.
- getNearbyTiles(world, squareRadius): returns a string of characters representing the tiles in a square radius around the player. Overwrite any tiles with a PlayerCharacter's symbol if it exists there.

**REST Implementation**
- only save World to a database. PlayerCharacters should be saved within World.
- only make a REST controller for World, with Player as a sub directory.
- "authorize" player requests by requiring the playerCharacter's Pin number
- on the client, do a general nearbyTiles request every half second. (For now, eventually optimize or use websockets)
- World will access player methods via `world.players[i].move(1, 0, world)