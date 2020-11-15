class Barrel {
    constructor(scene, base, middle, height, stacks, slices) {
        this.scene = scene;
        this.base = base;
        this.middle = middle;
        this.height = height;
        this.npartsU = stacks;
        this.npartsV = slices;

//[[[-0.5, 0, -0.5, 1], [0, 0, -0.5, 1], [0.5, 0, -0.5, 1]], [[-0.5, 0, -0.5, 1], [0, 0, -0.5, 1], [0.5, 0, -0.5, 1]]]
        var height_2 = this.height/2;

        var c = 0.551915024494;
        this.C = c;

        this.controlPoints = 
        [

            [
                [-this.base, 0, height_2, 1],

                [-this.base, -this.base*c, height_2, 1],
                [-this.base*c, -this.base, height_2, 1],

                [0, -this.base, height_2, 1],

                [this.base*c, -this.base, height_2, 1],
                [this.base, -this.base*c, height_2, 1],

                [this.base, 0, height_2, 1],

                [this.base, this.base*c, height_2, 1],
                [this.base*c, this.base, height_2, 1],

                [0, this.base, height_2, 1],

                [-this.base*c, this.base, height_2, 1],
                [-this.base, this.base*c, height_2, 1],

                [-this.base, 0, height_2, 1]
            ],
            [
                [-this.middle, 0, 0, 1],

                [-this.middle, -this.middle*c, 0, 1],
                [-this.middle*c, -this.middle, 0, 1],

                [0, -this.middle, 0, 1],

                [this.middle*c, -this.middle, 0, 1],
                [this.middle, -this.middle*c, 0, 1],

                [this.middle, 0, 0, 1],

                [this.middle, this.middle*c, 0, 1],
                [this.middle*c, this.middle, 0, 1],

                [0, this.middle, 0, 1],

                [-this.middle*c, this.middle, 0, 1],
                [-this.middle, this.middle*c, 0, 1],

                [-this.middle, 0, 0, 1]
            ],
            [
                [-this.base, 0, -height_2, 1],

                [-this.base, -this.base*c, -height_2, 1],
                [-this.base*c, -this.base, -height_2, 1],

                [0, -this.base, -height_2, 1],

                [this.base*c, -this.base, -height_2, 1],
                [this.base, -this.base*c, -height_2, 1],

                [this.base, 0, -height_2, 1],

                [this.base, this.base*c, -height_2, 1],
                [this.base*c, this.base, -height_2, 1],

                [0, this.base, -height_2, 1],

                [-this.base*c, this.base, -height_2, 1],
                [-this.base, this.base*c, -height_2, 1],

                [-this.base, 0, -height_2, 1]
            ]

            //test
            // [
            //     [-this.base, 0, height_2, 1],
            //     [-this.base, -this.base, height_2, 1],
            //     [0, -this.base, height_2, 1],
            //     [this.base, -this.base, height_2, 1],
            //     [this.base, 0, height_2, 1],
            //     [this.base, this.base, height_2, 1],
            //     [0, this.base, height_2, 1],
            //     [-this.base, this.base, height_2, 1],
            //     [-this.base, 0, height_2, 1]
            // ],
            // [
            //     [-this.middle, 0, 0, 1],
            //     [-this.middle, -this.middle, 0, 1],
            //     [0, -this.middle, 0, 1],
            //     [this.middle, -this.middle, 0, 1],
            //     [this.middle, 0, 0, 1],
            //     [this.middle, this.middle, 0, 1],
            //     [0, this.middle, 0, 1],
            //     [-this.middle, this.middle, 0, 1],
            //     [-this.middle, 0, 0, 1]
            // ],
            // [
            //     [-this.base, 0, -height_2, 1],
            //     [-this.base, -this.base, -height_2, 1],
            //     [0, -this.base, -height_2, 1],
            //     [this.base, -this.base, -height_2, 1],
            //     [this.base, 0, -height_2, 1],
            //     [this.base, this.base, -height_2, 1],
            //     [0, this.base, -height_2, 1],
            //     [-this.base, this.base, -height_2, 1],
            //     [-this.base, 0, -height_2, 1]
            // ]

            //hardcode
            // [
            //     [-0.5, 0, 0.5, 1],
            //     [-0.5, -0.5, 0.5, 1],
            //     [0, -0.5, 0.5, 1],
            //     [0.5, -0.5, 0.5, 1],
            //     [0.5, 0, 0.5, 1],
            //     [0.5, 0.5, 0.5, 1],
            //     [0, 0.5, 0.5, 1],
            //     [-0.5, 0.5, 0.5, 1],
            //     [-0.5, 0, 0.5, 1]
            // ],
            // [
            //     [-0.9, 0, 0, 1],
            //     [-0.9, -0.9, 0, 1],
            //     [0, -0.9, 0, 1],
            //     [0.9, -0.9, 0, 1],
            //     [0.9, 0, 0, 1],
            //     [0.9, 0.9, 0, 1],
            //     [0, 0.9, 0, 1],
            //     [-0.9, 0.9, 0, 1],
            //     [-0.9, 0, 0, 1]
            // ],
            // [
            //     [-0.5, 0, -0.5, 1],
            //     [-0.5, -0.5, -0.5, 1],
            //     [0, -0.5, -0.5, 1],
            //     [0.5, -0.5, -0.5, 1],
            //     [0.5, 0, -0.5, 1],
            //     [0.5, 0.5, -0.5, 1],
            //     [0, 0.5, -0.5, 1],
            //     [-0.5, 0.5, -0.5, 1],
            //     [-0.5, 0, -0.5, 1]
            // ]
        
        ];
        this.evaluator = new CGFnurbsSurface(2, 12, this.controlPoints);

        this.nurbs = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.evaluator);
    }

    enableNormalViz() {
        this.nurbs.enableNormalViz();
    }

    display() {
        this.scene.pushMatrix();
        
        //this.scene.translate(this.C/2, 0, 0);

        this.nurbs.display();

        this.scene.popMatrix();
    }
}