# TRAILBOUND
a multiplayer hiking game written in Kotlin by aidanbeck.com

## Purpose
My capstone portfolio project [Old Cove](https://github.com/aidanbeck/old-cove) has a Spring Boot back end, but is very front end heavy, and doesn't even deploy all its features for its demo.
I want to illustrate my skills by creating a project with a deployed server and a focus on back end features.
The front end will be minimal but serviceable, and will be replaced if user testing proves the design compelling and continuation promising.

## Design Outline - Minimum Viable Product

**Registered Users & Guests**

The website will host multiple joinable "worlds", which users can create and invite each other to via game pins, like in Kahoot or Among Us.
Users can join these worlds synchronously or asynchronously: once a world is created, its invited users can influence them even if the hosting user is offline.

A User can be Registered, creating an account locked with a password and optional email. This will use proper encryption and authentication.
Registered users can create worlds and manage their world's settings (such as player invites) with a dashboard page.
They can also join other worlds, and the characters they create will be locked to their account.

A User can also be a Guest, and still join worlds and create Characters. Except, these Characters will be world specific and locked with an optional 6-digit pin.
A Guest User can also create a "Guest World", with default settings, no dashboard, and invites open to anyone with the game pin.
A Guest World or Character can be claimed by a Registered User, and claiming will prompt a user to register if they are not already.
This Guest User system will allow new users and their friends to jump right in, while leaving the door open to register and protect their progress.

**Worlds & Game Design**

A world will consist of a 256 x 256 manipulatable grid of tiles, representing a forest.
The obstructions will generate in thick formations, with small pockets of empty space nearly connected to each other.
Special tiles will also generate sporadically, representing resources, which will regenerate in 20 hours if consumed.
A user can:
- move between unobstructed tiles
- spend energy to dismantle obstructions (trees, rocks, ponds, bushes)
- consume special tiles to regain energy (berries, nuts, mushrooms, roots)

The primary user loop will be choosing precise cuts to connect nearby clearings, allowing for further exploration and resource discovery.
An extrinsic objective may be added to motivate this exploration, such as reaching the edge, reaching the center, or collecting a set of MacGuffins around the world.
If user testing proves this core loop compelling, many other features and objectives could be added and expanded.


## Tech Stack

**Server**

- Kotlin
- Spring Boot
- PostgreSQL

**Client**

This project's focus is on back end features.
A basic HTML & JavaScript Client will be used initially, without much effort going beyond usability.
This will consist of:
- a grid of ascii characters representing the tiles near a user's position
 - a GET request set on a frequent interval, which updates the grid if anything has changed from other players.
 - If this method does not work well, websockets will be used.
- a directional pad of buttons for moving & dismantling
 - connected to REST functions, hooking into the backend, which also updates the ascii grid
- a line of 🪓 characters representing energy, or how many trees the user can chop.
- a line of text to communicate state. ie "you gained 2 energy", "you chop down the tree"
- a key outlining to the user what characters represent. ie "t - a small tree" and "q - a mushroom"
- mobile friendly spacing to prevent scrolling and size buttons comfortably

Later, if testing proves the project worth investing in, this will be redesigned. It could include:
- a customized React front end
- pixel art graphics representing each tile
- animations for button presses and state changes
- curated color and shape design for the UI