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
            // [
            //     [base, 0, 0, 1],
            //     [(base + H), 0, H/tanAngle, 1],
            //     [(base + H), 0, height - (H/tanAngle), 1],
            //     [base, 0, height, 1]
            // ],
            // [
            //     [base, h, 0, 1],
            //     [(base + H), h, H/tanAngle, 1],
            //     [(base + H), h, height - (H/tanAngle), 1],
            //     [base, h, height, 1]
            // ],
            // [
            //     [-base, h, 0, 1],
            //     [-(base + H), h, H/tanAngle, 1],
            //     [-(base + H), h, height - (H/tanAngle), 1],
            //     [-base, h, height, 1]
            // ],
            // [
            //     [-base, 0, 0, 1],
            //     [-(base + H), 0, H/tanAngle, 1],
            //     [-(base + H), 0, height - (H/tanAngle), 1],
            //     [-base, 0, height, 1]
            // ] 
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
        
        //this.scene.translate(this.C/2, 0, 0);

        this.nurbs.display();

        this.scene.pushMatrix();
        
        this.scene.rotate(Math.PI, 0,0,1);

        this.nurbs.display();

        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}