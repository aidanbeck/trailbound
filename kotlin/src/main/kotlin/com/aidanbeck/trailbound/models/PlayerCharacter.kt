package com.aidanbeck.trailbound.models

class PlayerCharacter(
    val name: String,
    val symbol: Char = '&',
    val pinNumber: Int? = null, // Null = no pin, character isn't locked.
    var x: Int = 0,
    var y: Int = 0,
    var energy: Int = 4
    ) {
    fun input(direction: String, world: World) {}
    fun move(xOffset: Int, yOffset: Int, world: World) {}
    fun dismantle(xOffset: Int, yOffset: Int, world: World) {}
    fun take(xOffset: Int, yOffset: Int, world: World) {}
    fun getNearbyTiles(world: World, squareRadius: Int): String { return "....." }
}