package com.aidanbeck.trailbound.models

import org.springframework.data.repository.query.ParameterOutOfBoundsException
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue
import kotlin.test.assertFailsWith

class WorldTest {

    @Test
    fun testGetTileAndSetTile() {
        val world = World(10, 10)

        // Basic
        world.setTile(1, 3, 'a')
        assertEquals('a', world.getTile(1, 3))

        // Corners
        world.setTile(0, 0, 'b')
        world.setTile(9, 9, 'c')
        assertEquals('b', world.getTile(0, 0))
        assertEquals('c', world.getTile(9, 9))

        // Out of Bounds
        assertFailsWith<Error> { world.setTile(-1, -1, 'd') }
        assertFailsWith<Error> { world.setTile(20, 80, 'e') }
        assertNotEquals('d', world.getTile(-1, -1))
        assertNotEquals('e', world.getTile(20, 80))
        assertEquals('░', world.getTile(-1, -1)) // return special "border" character
        assertEquals('░', world.getTile(20, 80))
    }

    @Test
    fun testPopulateTiles() {
        val world = World()
        world.populateTiles("xyz")

        /*
            This is an imprecise test.
            Randomly generated terrain will either be massively changed, or entirely removed.
            Because of this, I am only testing that it *is* populated with the tiles.
            How it is populated and to what extent, I will not test, as it is likely to change soon.
         */

        assertTrue(world.tiles.contains('x'))
        assertTrue(world.tiles.contains('y'))
        assertTrue(world.tiles.contains('z'))

        assertFalse(world.tiles.contains('A'))
    }

    @Test
    fun testAddPlayerCharacter() {
        val world = World()
        val playerCharacter = world.addPlayerCharacter("Hiker", '@')

        assertTrue(playerCharacter.symbol == '@') // initializes PlayerCharacter
        assertTrue(world.playerCharacters.contains(playerCharacter)) // adds player to playerCharacters array

        // throw exception if player already exists
        assertFailsWith<Error> { world.addPlayerCharacter("Hiker") }

        //throw exception if array is full
        for (i in 0 .. world.playerCharacters.size - 1) { // fill remaining slots
            if (world.playerCharacters[i] == null) { world.addPlayerCharacter("PlayerCharacter$i") }
        }
        assertFailsWith<Error> { world.addPlayerCharacter("NoMoreRoom") }

    }

    @Test
    fun testGetPlayerCharacter() {
        val world = World()
        world.addPlayerCharacter("Hiker")

        assertEquals("Hiker", world.getPlayerCharacter("Hiker").name )
        assertFailsWith<Error> { world.getPlayerCharacter("NonexistentName") }
    }

    @Test
    fun testRemovePlayer() {
        val world = World()
        val player = world.addPlayerCharacter("Hiker")
        assertTrue ( world.playerCharacters.contains(player) ) // assert player character was actually added to be removed
        world.removePlayerCharacter("Hiker")
        assertFalse( world.playerCharacters.contains(player) )
    }

}