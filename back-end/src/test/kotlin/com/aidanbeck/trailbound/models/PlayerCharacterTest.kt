package com.aidanbeck.trailbound.models

import kotlin.test.Test
import kotlin.test.assertEquals

class PlayerCharacterTest {

    @Test
    fun testMove() {
        val world = World(generationTable = ".,")
        val playerCharacter = PlayerCharacter("Hiker")

        playerCharacter.move( -1, 0, world) // should not succeed
        playerCharacter.move(1, 0, world)
        playerCharacter.move(0, 1, world)

        assertEquals(playerCharacter.x, 1)
        assertEquals(playerCharacter.y, 1)
    }
}