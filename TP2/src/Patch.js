class Patch {
    constructor(scene, npointsU, npointsV, npartsU, npartsV) {
        this.scene = scene;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;

//[[[-0.5, 0, -0.5, 1], [0, 0, -0.5, 1], [0.5, 0, -0.5, 1]], [[-0.5, 0, -0.5, 1], [0, 0, -0.5, 1], [0.5, 0, -0.5, 1]]]
        this.controlPoints = [[[0.5, -0.1, -0.5, 1], [0.5, -5, 0.5, 1]], [[0, -1, -0.5, 1], [0, -7, 0.5, 1]], [[-0.5, 0, -0.5, 1], [-0.5, 0, 0.5, 1]]];
        this.evaluator = new CGFnurbsSurface(2, 1, this.controlPoints);

        this.nurbs = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.evaluator);
    }

    enableNormalViz() {
        this.nurbs.enableNormalViz();
    }

    display() {
        this.nurbs.display();
    }
}