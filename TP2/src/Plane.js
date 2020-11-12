class Plane extends CGFobject {
    constructor(scene, uDivs, vDivs) {
        super(scene);
        this.scene = scene;
        this.uDivs = uDivs;
        this.vDivs = vDivs;

        //[[-0.5,0,-0.5], [-0.5,0,0.5], [0.5,0,0.5], [0.5,0,-0.5]]

        var controlPoints = [ [   [-0.5,0,-0.5,1], [0.5,0,-0.5,1]   ] , [   [-0.5,0,0.5,1], [0.5,0,0.5,1]   ]  ];
        this.evaluator = new CGFnurbsSurface(1, 1, controlPoints);
        
        this.nurbs = new CGFnurbsObject(scene, uDivs, vDivs, this.evaluator);
    }

    enableNormalViz() {
        
    }

    display() {
        this.nurbs.display();
    }
}