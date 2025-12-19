package com.aidanbeck.trailbound.models

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue

class WorldTest {

    @Test
    fun testGetTileAndSetTile() {
        val world = World(10, 10)

        world.setTile(0, 0, 'a')
        world.setTile(1, 3, 'b')
        world.setTile(9, 9, 'c')

        world.setTile(-1, -1, 'd')
        world.setTile(20, 80, 'e')

        assertEquals('a', world.getTile(0, 0))
        assertEquals('b', world.getTile(1, 3))
        assertEquals('c', world.getTile(9, 9))

        assertNotEquals('d', world.getTile(-1, -1))
        assertNotEquals('e', world.getTile(20, 80))

    }

    @Test
    fun testPopulateTiles() {
        val world = World(10,10)

        assertTrue( world.tiles.contains('t'))
        // This is not a very good test!
        // But I don't know exactly what algorithm I will be using
        // I at least want to make sure it populates the world with *something*
        // Once I get a feel for what the world should be like in terms of gameplay,
        // I can design a more testable algorithm.
    }
}