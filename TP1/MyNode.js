
var materialStack = [];


class MyNode {
    /*
    * @param {string} id
    * @param {string} texture_path
    * @param {string} material
    */

    constructor(scene, texture, material, transformations, descendants, leaves) {
        this.scene = scene;
        this.texture = texture;
        this.material = material;
        this.transformations = transformations;
        this.transfMatrix = mat4.create();
        this.descendants = descendants;
        this.leaves = leaves;

        for(var i = 0; i < transformations.length; i++) {
            if(transformations[i][0] == "t") {
                mat4.translate(this.transfMatrix, this.transfMatrix, [transformations[i][1],transformations[i][2],transformations[i][3]]);
            } else if(transformations[i][0] == "r") {
                if(transformations[i][1] == "x")
                    mat4.rotate(this.transfMatrix, this.transfMatrix, DEGREE_TO_RAD * transformations[i][2], [1,0,0]);
                else if(transformations[i][1] == "y")
                    mat4.rotate(this.transfMatrix, this.transfMatrix, DEGREE_TO_RAD * transformations[i][2], [0,1,0]);
                else if(transformations[i][1] == "z")
                    mat4.rotate(this.transfMatrix, this.transfMatrix, DEGREE_TO_RAD * transformations[i][2], [0,0,1]);
            } else if(transformations[i][0] == "s") {
                mat4.scale(this.transfMatrix, this.transfMatrix, [transformations[i][1],transformations[i][2],transformations[i][3]])
            }
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transfMatrix);

        if(this.material != "null") {
            materialStack.push(this.material);
        }
        this.scene.materials[materialStack[materialStack.length - 1]].apply();

        for(var i = 0; i < this.leaves.length; i++) {
            this.leaves[i].display();
        }

        for(var j = 0; j < this.descendants.length; j++) {
            this.descendants[j].display();
        }

        if(this.material != "null")
            materialStack.pop();

        this.scene.popMatrix();

    }
}