package com.aidanbeck.trailbound.models

class World(val width: Int = 256, val length: Int = 256, val gamePin: Int = 0) {

    val URL = "ABCXYZ"

    val players = Array<Player>(32) { Player() }
    val tiles = Array<Char>(width * length) { '.' }

    fun getTile(x: Int, y: Int): Char {

        if (x < 0 || x >= width || y < 0 || y >= length) return '░' // out of bounds
        return tiles[width * y + x]

    }
    fun setTile(x: Int, y: Int, char: Char) {

        if (x < 0 || x > width || y < 0 || y > length) return // out of bounds
        tiles[width * y + x] = char
    }
    fun populateTiles() {}

}