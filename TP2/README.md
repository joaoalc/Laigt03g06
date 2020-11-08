# LAIG 2020/2021 - TP2

## Group T03G06
| Name             | Number    | E-Mail               |
| ---------------- | --------- | -------------------- |
| Davide Castro    | 201806512 | up201806512@fe.up.pt |
| João Cardoso     | 201806531 | up201806531@fe.up.pt |

----

## Project information

-Everything from TP1. (we left it out of here because it was too cluttered)
-The XML parser detects and flags a wide array of errors. Examples: startCell and endCell cannot be in invalid indexes in the spritesheet. Characters outside the fonts cannot be drawn.
-Update function is fast since we don't iterate through keyframe nor spritesheet position arrays.
-There isn't any problem if there are multiple keyframes or sprite changes from a spritesheet between update calls.
----
## Issues/Problems

-The parser does not assume default values to continue rendering in some cases.
-In the parsing process, array transformations are placed in arrays twice, once to temporary arrays and once from those arrays to their intended position.