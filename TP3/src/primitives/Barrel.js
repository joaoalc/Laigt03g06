/**
 * Barrel class, contains the proprieties and necessary functions for creating and displaying the outer shell (except the top and bottom) of a barrel.
 * Uses a patch and dispalys it twice with a different rotation in order to make it barrel shaped.
 * 
 */
class Barrel extends CGFobject{
    /**
	 * Barrel
	 * @constructor
	 * @param scene - Reference to MyScene object
	 * @param base - The base of the barrel's radius.
	 * @param middle - The middle of the barrel's radius.
	 * @param height - The barrel's height.
	 * @param stacks - The number of stacks on the z axis.
	 * @param slices - The number of slices around the z axis.
	 */
    constructor(scene, base, middle, height, stacks, slices) {
        super(scene);
        this.scene = scene;
        this.base = base;
        this.middle = middle;
        this.height = height;
        this.npartsU = slices;
        this.npartsV = stacks;

        var H = (4/3)*(middle-base);

        var h = (4/3)*(base);

        var tanAngle = Math.tan(Math.PI / 6);
        
        this.controlPoints = [
            [
                [base, 0, 0, 1],
                [(base + H), 0, H/tanAngle, 1],
                [(base + H), 0, height - (H/tanAngle), 1],
                [base, 0, height, 1]
            ],
            [
                [base, h, 0, 1],
                [(base+H), h+(4/3)*H, H/tanAngle, 1],
                [(base+H), h+(4/3)*H, height - (H/tanAngle), 1],
                [base, h, height, 1]
            ],
            [
                [-base, h, 0, 1],
                [-(base+H), h+(4/3)*H, H/tanAngle, 1],
                [-(base+H), h+(4/3)*H, height - (H/tanAngle), 1],
                [-base, h, height, 1]
            ],
            [
                [-base, 0, 0, 1],
                [-(base + H), 0, H/tanAngle, 1],
                [-(base + H), 0, height - (H/tanAngle), 1],
                [-base, 0, height, 1]
            ]
        ];

        this.evaluator = new CGFnurbsSurface(3, 3, this.controlPoints);

        this.nurbs = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.evaluator);
    
    }

    enableNormalViz() {
        this.nurbs.enableNormalViz();
    }

    disableNormalViz(){
        this.nurbs.disableNormalViz();
    }

    display() {
        this.scene.pushMatrix();

        this.nurbs.display();

        this.scene.pushMatrix();
        
        this.scene.rotate(Math.PI, 0,0,1);

        this.nurbs.display();

        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}