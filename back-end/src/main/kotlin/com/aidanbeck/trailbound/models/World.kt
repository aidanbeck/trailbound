package com.aidanbeck.trailbound.models

import kotlin.random.Random

class World(val width: Int = 256, val length: Int = 256, val gamePin: Int = 0) {

    val URL = "ABCXYZ"
    val seed = 10072003

    val players = Array<Player>(32) { Player() }
    val tiles = Array<Char>(width * length) { '.' }

    init {
        populateTiles("..,ttTTT")
    }

    fun getTile(x: Int, y: Int): Char {

        if (x < 0 || x >= width || y < 0 || y >= length) return '░' // out of bounds
        return tiles[width * y + x]

    }

    fun setTile(x: Int, y: Int, char: Char) {

        if (x < 0 || x > width || y < 0 || y > length) return // out of bounds
        tiles[width * y + x] = char
    }

    fun populateTiles(chanceTable: String) {

        val random = Random(seed)

        for (i in 0..length - 1) {
            for (j in 0..width - 1) {

                val char = chanceTable[ random.nextInt(chanceTable.length) ]
                setTile(i, j, char)
            }
        }
    }

}