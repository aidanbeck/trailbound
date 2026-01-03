package com.aidanbeck.trailbound.models

import org.springframework.data.repository.query.ParameterOutOfBoundsException
import kotlin.random.Random

class World(
    val width: Int = 256,
    val length: Int = 256,
    val generationTable: String = "..,ttTTT",
    val seed: Int = 10072003 // my birthday, no other significance
) {

    val slug = "ABCXYZ" // unique id
    val playerCharacters = Array<PlayerCharacter?>(32) { null }
    val tiles = Array<Char>(width * length) { '.' }

    init {
        populateTiles(generationTable, seed)
    }

    fun getTile(x: Int, y: Int): Char {

        if (x < 0 || x >= width || y < 0 || y >= length) return '░' // out of bounds
        return tiles[width * y + x]

    }

    fun setTile(x: Int, y: Int, char: Char) {

        if (x < 0 || x > width || y < 0 || y > length) { // out of bounds
            throw Error("Coordinate ($x,$y) is out of bounds!")
        }
        tiles[width * y + x] = char
    }

    fun populateTiles(chanceTable: String, generationSeed: Int = seed) {

        val random = Random(seed)

        for (i in 0..length - 1) {
            for (j in 0..width - 1) {

                val char = chanceTable[ random.nextInt(chanceTable.length) ]
                setTile(i, j, char)
            }
        }
    }

    fun addPlayerCharacter(name: String, symbol: Char = '&', pinNumber: Int? = null): PlayerCharacter {

        val playerCharacter = PlayerCharacter(name, symbol, pinNumber)

        // verify name is unique
        for (player in playerCharacters) {
            if (player?.name == name) { throw Error("Player character $name already exists!") }
        }

        // find next available slot
        for (i in 0..playerCharacters.size - 1) {
            if (playerCharacters[i] == null) {

                playerCharacters.set(i, playerCharacter)
                return playerCharacter
            }
        }

        throw Error("There are no remaining player character slots!")

    }

    fun getPlayerCharacter(name: String): PlayerCharacter { return PlayerCharacter("TEST") }
    fun removePlayerCharacter(name: String) {}

}