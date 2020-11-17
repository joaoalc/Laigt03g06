class Patch {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        this.scene = scene;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;

//[[[-0.5, 0, -0.5, 1], [0, 0, -0.5, 1], [0.5, 0, -0.5, 1]], [[-0.5, 0, -0.5, 1], [0, 0, -0.5, 1], [0.5, 0, -0.5, 1]]]
        this.controlPoints = controlPoints;//[[[0.5, -0.1, -0.5, 1], [0.5, -5, 0.5, 1]], [[0, -1, -0.5, 1], [0, -7, 0.5, 1]], [[-0.5, 0, -0.5, 1], [-0.5, 0, 0.5, 1]]];
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