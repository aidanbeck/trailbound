package com.aidanbeck.trailbound.models

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotEquals
import kotlin.test.assertTrue

class PlayerTest {

    @Test
    fun testMove() {
        val world = World(generationTable = ".,")
        val player = Player()

        player.move(world, -1, 0) // should not succeed
        player.move(world, 1, 0)
        player.move(world, 0, 1)

        assertEquals(player.x, 1)
        assertEquals(player.y, 1)
    }
}