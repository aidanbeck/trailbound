package com.aidanbeck.trailbound

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class TrailboundApplicationTests {

	@Test
	fun contextLoads() {
	}

}

/*

World Class
* width
* length
* tiles
* players
* gamePin
- getTile
- setTile
- populateTiles(charArray) fills with random characters, using a charArray as a chance table.

Player Class
* symbol
* characterPin
* x, y
* hatchets
- move(x, y) detects movement eligibility, and offsets position
 - if the coordinate is within range but is blocked, and the player has "hatchets", remove one hatchet and destroy the block instead of moving.
- placeTile(xOffset, yOffset, character) places a tile into the world
 - EITHER moves in the direction of x,y and then places a tile in the original spot ("draw" with character)
 - OR it could not move the player, and place the object offset in the direction of x,y
 - I want to try the "drawing" idea first, since that seems more streamlined.

- getNearbyTiles(world, squareRadius) returns string of nearby tiles, representing a square grid
 - also gets players, and inputs their symbol into the grid if they are there.
- printNearbyTiles: for debug purposes, prints a visual representation.

Client Prototype
- display world as text characters on a paragraph grid
- display number of "hatchets" and "walls"
- have buttons for moving N/S/E/W (also detect arrows)
- have a button to toggle "placing" (also detect space)

   [ ]
[ ]( )[ ]
   [ ]

[ ] - move or place
( ) - toggle move/place
 */