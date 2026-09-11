# TrailBound
A multiplayer hiking game. Carve trails through a mysterious forest with friends!

## Design Goals
These are the primary axioms that any design, technical, or logistical decision should be compared against.

* **Momentum** - Development should be fast and consistent. Scope should be limited as much as possible to ensure a concise final product and recieve the benefits of user feedback.
* **Multiplayer** - Multiplayer should be supported from the start, and features should be added with full consideration for the networking architecture.
* **Multi-Platform UX/UI** - All devices and device resolutions should be fully supported. Interaction should feel intuitive and native to the device you are using. Users should not have to be taught how to interact, but feel they already.

## Design Outline - Minimum Viable Product

**Registered Users & Guests**

The website will host multiple joinable "worlds", which users can create and invite each other to via game pins or URL slugs, like in Kahoot or Among Us.
Users can join these worlds synchronously or asynchronously: once a world is created, its invited users can influence them even if the hosting user is offline.

A User can be Registered, creating an account locked with a password and optional email. This will use proper encryption and authentication.
Registered users can create worlds and manage their world's settings (such as player invites) with a dashboard page.
They can also join other worlds, and the characters they create will be locked to their account.

A User can also be a Guest, and still join worlds and create Characters. Except, these Characters will be world specific and locked with an optional 6-digit pin.
This Guest User system will allow new users and their friends to jump right in. Even if a group of friends are all guests, they can join a public world hosted by other users (or hosted by me).

**Worlds & Game Design**

A world will consist of a 256 x 256 manipulatable grid of tiles representing a forest. Each cell of the grid can have:
* Floor (i.e. Grass, stone, water, wood flooring) - Determines properties of the tile such as what else can be place on it.
* Tile (i.e. Tree, bush, stone wall) - Immovable structures occupying the tile. They can obstruct movement, be destroyed for resources, or have their own properties.
* Mobile (i.e. Players, Items, Enemies) - Structures that can be moved by the user or even move themselves. They will also carry more data to represent dynamic objects.

Trees, bushes, and boulders will generate in thick formations, with small clearings disconnected from but neighboring each other. Rarer mobiles like berries will also generate sporadically offering resources or challenges to users.

The primary user story will be spending energy by choosing precise cuts to connect nearby clearings, allowing for further exploration and resource discovery, enabling additional cuts to repeat the cycle.

An extrinsic objective may be added to motivate this exploration, such as reaching the edge, reaching the center, or collecting a set of artifacts around the world.
If user testing proves this core loop compelling, many other features and objectives could be added and expanded.

**UX Interaction System**
