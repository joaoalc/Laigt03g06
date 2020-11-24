class Patch extends CGFobject {
    /**
     * Constructor for Patch class.
     * @scene - Reference to MyScene object
     * @npointsU - Number of control points in the x direction
     * @npointsV - Number of control points in the z direction
     * @npartsU - Reference to MyScene object
     * @npartsV - Reference to MyScene object
     * @controlPoints - Array containing the patch's (npointsU * nPointsV) control points
     */
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);
        this.scene = scene;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.controlPoints = controlPoints;
        this.evaluator = new CGFnurbsSurface(npointsU - 1, npointsV - 1, this.controlPoints);

        this.nurbs = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.evaluator);
    }

    enableNormalViz() {
        this.nurbs.enableNormalViz();
    }

    disableNormalViz() {
        this.nurbs.disableNormalViz();
    }

    display() {
        this.nurbs.display();
    }
}