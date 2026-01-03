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
        world.setTile(2, 0, 't')

        playerCharacter.move(1, 0, world)
        assertFailsWith<Error> { playerCharacter.move(1, 0, world) } // should hit tree
        assertFailsWith<Error> { playerCharacter.move(0, -1, world) } // should hit border
        playerCharacter.move(0, 1, world)

        assertEquals(playerCharacter.x, 1)
        assertEquals(playerCharacter.y, 1)
    }

    @Test
    fun testDismantle() {
        val world = World(generationTable = ".,")
        val playerCharacter = PlayerCharacter("Hiker")
        world.setTile(1, 0, 't')

        playerCharacter.dismantle(1, 0, world)
        assertFailsWith<Error> { playerCharacter.dismantle(0, 1, world) } // cannot dismantle ground
        assertFailsWith<Error> { playerCharacter.dismantle(0, -1, world) } // cannot dismantle border

        assertEquals(world.getTile(1, 0), ',')
    }

    @Test
    fun testTake() {
        val world = World(generationTable = ".,")
        val playerCharacter = PlayerCharacter("Hiker", energy = 0)
        world.setTile(1, 0, '%')

        playerCharacter.take(1, 0, world)
        assertFailsWith<Error> { playerCharacter.take(0, 1, world) } // cannot take ground
        assertFailsWith<Error> { playerCharacter.take(1, 0, world) } // cannot empty bush

        assertEquals('X', world.getTile(1, 0)) // bush replaced with empty bush
        assertEquals(4, playerCharacter.energy) // energy increased by 4 (replace with variable!)
    }

    @Test
    fun testGetNearbyTiles() {
        val world = World(generationTable = ".")
        world.setTile(1, 0, 'A')
        world.addPlayerCharacter("Hiker", '&')
        world.addPlayerCharacter("Other", '@')
        val player = world.getPlayerCharacter("Hiker")
        val other = world.getPlayerCharacter("Other")
        other.x = 2
        other.x = 2

        /*
            ░░..@ <-- another player
            ░░...
            ░░&.A <-- an object tile
            ░░░░░
            ░░░░░
         */
        val nearbyTiles = "░░..@░░...░░&.A░░░░░░░░░░"

        assertEquals(nearbyTiles, player.getNearbyTiles(world, 2))
    }
}