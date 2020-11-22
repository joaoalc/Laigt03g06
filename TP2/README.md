# LAIG 2020/2021 - TP2

## Group T03G06
| Name             | Number    | E-Mail               |
| ---------------- | --------- | -------------------- |
| Davide Castro    | 201806512 | up201806512@fe.up.pt |
| João Cardoso     | 201806531 | up201806531@fe.up.pt |

----

## Project information ##

- The XML parser detects and flags a wide array of errors. Examples: startCell and endCell cannot be in invalid indexes in the spritesheet. Characters outside the fonts cannot be drawn
- There isn't any problem if there are multiple keyframes or sprite changes from a spritesheet between update calls
- The scene is complex and every new primitive is used (plane, patch, barrel and spritesheet animations/text)
- Detailed keyframe animations are used in the scene to create more movement, using translation, rotation and scale
----
## Issues/Problems ##

-The parser does not assume default values to continue rendering in some cases.