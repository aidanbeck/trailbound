package com.aidanbeck.trailbound.models

import kotlin.test.Test
import kotlin.test.assertEquals

class PlayerCharacterTest {

    @Test
    fun testMove() {
        val world = World(generationTable = ".,")
        val playerCharacter = PlayerCharacter()

        playerCharacter.move(world, -1, 0) // should not succeed
        playerCharacter.move(world, 1, 0)
        playerCharacter.move(world, 0, 1)

        assertEquals(playerCharacter.x, 1)
        assertEquals(playerCharacter.y, 1)
    }
}