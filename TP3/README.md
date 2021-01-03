# LAIG 2020/2021 - TP3

## Group: T03G06

| Name             | Number    | E-Mail               |
| ---------------- | --------- | -------------------- |
| Davide Castro    | 201806512 | up201806512@fe.up.pt |
| João Cardoso     | 201806531 | up201806531@fe.up.pt |

----
## Project information
In this project, we have created a graphical interface in order to play the game "Alliances".
Our game features two environments, a train station and an aztec temple.

- Game:
	- Piece color highlighting on piece color selection.
	- Piece color reselection.
	- The game movie works on every gamemode (player vs player, - player vs bot, bot vs bot) and at any time. The game always resumes to
    the previous state after the movie ends. The game movie can be skipped to resume the game instantly.
	- The user can undo a move at any time and gamemode, including computer moves.
	- Bot difficulties are independent from one another (One bot can be on hard and the other on easy).
	- The starting player can be selected.
	- There can be a time limit per play for human players.
	- Piece animations have easing.
	- Game over, winner, player and pieces left text/indicators.
	- The gamestate and game movie's state are maintained on scene change.
    - The game can be restarted mid-game with a new configuration
- Scene:
	- Animated camera with easing that works between scene cameras AND between scenes:
		- The camera's animation time depends on the position and target of the cameras themselves (with a minimum time).
		- The camera animation works properly even if the camera is currently moving, no matter how fast or which cameras you select.
	- Both scenes are detailed, run well and are fairly light, memory and speed wise.
		The first scene has been simplified and optimized to improve the framerate
	
----
## Issues/Problems
