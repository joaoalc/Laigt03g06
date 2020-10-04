# LAIG 2020/2021 - TP1

## Group: T03G06

| Name             | Number    | E-Mail               |
| ---------------- | --------- | -------------------- |
| Davide Castro    | 201806512 | up201806512@fe.up.pt |
| João Cardoso     | 201806531 | up201806531@fe.up.pt |

----
## Project information

- The models are complex and detailed;
- There are multiple cameras from different points of view of the scene;
- There is a good range of different materials and textures suited for the different kinds of objects;
- Every primitive available is used on the scene;
- Every type of transformation is used;
- We used the transformation, material and texture inheritance to make a better structured scene graph;
- The scene graph also has a high level of complexity.
- Scene
  - The scene consists of a steam locomotive by a forest. There are models for the locomotive, the rails it is moving on and some trees, along with a skybox.
  - Scene link: "./scenes/train.xml"
----
## Issues/Problems

- The amplification component, cameras and enabling lights are still not completely handled in the parser;
- There are still some unsolved problems with texture coordinates on the cylinder and sphere primitives;
- A few possible warnings and errors in the parser are still to be implemented.