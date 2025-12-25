package com.aidanbeck.trailbound.models

class PlayerCharacter(
    val x: Int = 0,
    val y: Int = 0,
    val symbol: Char = '&',
    val gamePin: Int = 0,
    val hatchets: Int = 4, // # of times the player can break tiles
    val walls: Int = 0     // # of times the player can place tiles
    ) {
    fun move(world: World, xOffset: Int, yOffset: Int) {}
    fun placeTile(world: World, xOffset: Int, yOffset: Int, char: Char) {}
    fun getNearbyTiles(world: World, squareRadius: Int): String = "_"
    fun printNearbyTiles(world: World, squareRadius: Int) {}
}