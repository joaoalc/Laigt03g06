# LAIG 2020/2021 - TP1

## Group T03G06
| Name             | Number    | E-Mail               |
| ---------------- | --------- | -------------------- |
| Davide Castro    | 201806512 | up201806512@fe.up.pt |
| João Cardoso     | 201806531 | up201806531@fe.up.pt |

----

## Project information

- The models are complex and detailed;
- There are multiple cameras from different points of view of the scene, available from the interface;
- The interface is organized into different sections (axis/normals, cameras and lights);
- There is a good range of different materials and textures suited for the different objects;
- Every primitive available is used on the scene with textures;
- Every type of transformation is used;
- We used the transformation, material and texture inheritance to make a better structured scene graph;
- The scene graph also has a high level of complexity;
- The scene has a good variety of objects to fill the environment.
- Scene
  - The scene consists of a steam locomotive by a forest. There are models for the locomotive, the rails it is moving on, some trees, rocks and grass, along with a skybox.
  - Scene link: "./scenes/LAIG_TP1_XML_T3_G06_v02.xml"
----
## Issues/Problems

- The parser does not assume default values to continue rendering in some cases.