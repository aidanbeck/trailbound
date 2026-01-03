package com.aidanbeck.trailbound.models

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class PlayerCharacterTest {

    /*
    @Test
    fun testInput() {

        How can I test a "routing" function?
        PlayerCharacter.input() should take a direction,
        and call the corresponding function depending on what tile exists in that cardinal direction.
        How can I test that it called a function?
        I will come back to this. I may not need to test it.
    }
    */

    @Test
    fun testMove() {
        val world = World(generationTable = ".,")
        val playerCharacter = PlayerCharacter("Hiker")
        world.setTile (2, 0, 't')

        playerCharacter.move(1, 0, world)
        assertFailsWith<Error> { playerCharacter.move(1, 0, world) } // should hit tree
        assertFailsWith<Error> { playerCharacter.move(0, -1, world) } // should hit border
        playerCharacter.move(0, 1, world)

        assertEquals(playerCharacter.x, 1)
        assertEquals(playerCharacter.y, 1)
    }

//    - dismantle(xOffset, yOffset, world): replaces the offset position's tile with the destroyed version. If nothing can break, throw an exception.
//    - take(xOffset, yOffset, world): breaks the offset position's tile, and increases the player's energy by a set amount per tile type. If nothing can be taken, throw an exception.
//    - getNearbyTiles(world, squareRadius): returns a string of characters representing the tiles in a square radius around the player. Overwrite any tiles with a PlayerCharacter's symbol if it exists there.

}