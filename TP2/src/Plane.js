class Plane extends CGFobject {
    constructor(scene, uDivs, vDivs) {
        this.scene = scene;
        this.uDivs = uDivs;
        this.vDivs = vDivs;

        this.evaluator = new Eval(uDivs, vDivs);

        this.nurbs = new CGFnurbsObject(scene, uDivs, vDivs, this.evaluator);
    }

    display() {
        this.nurbs.display();
    }
}

class Eval {
    constructor(uDivs, vDivs) {
        this.uDivs = uDivs;
        this.vDivs = vDivs;
    }

    getPoint(u, v) {
        var x = -0.5 + u/this.uDivs;
        var y = -0.5 + v/this.vDivs;
        var z = 0;
    }
}