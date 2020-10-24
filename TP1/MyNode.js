
var materialStack = [];
var textureStack = [];

/**
 * MyNode class, representing a node of the scene graph.
 */
class MyNode {
    /**
     * MyNode
     * @constructor
     * @param scene - Reference to MyScene object
     * @param texture - CGFtexture object
     * @param material - CGFappearance object
     * @param transformations - Array with transformations
     * @param descendants - Array of references to descendant nodes
     * @param leaves - Array of CGFobject leaves
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

    /**
     * Displays the node and its descendants recursively, applying transfomations, textures and materials
     */
    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transfMatrix); //Adicionar a nova transformação à matriz de transformações para este objeto e todos os seus descendants

        if(this.material != "null") { //Adicionar o material se não for "null"
            materialStack.push(this.material);
        }

        //Texture stuffs
        if(this.texture != "null" && this.texture != "clear") //Texture id being "null" means it inherits it's parent's texture
        {
            //console.log(textureStack.length);
            textureStack.push(this.texture);
            //console.log(textureStack.length);
        }
        this.scene.materials[materialStack[materialStack.length - 1]].apply();
        
        if(this.texture != "clear"){
            //this.scene.materials[materialStack[materialStack.length - 1]].setTexture(this.scene.textures[materialStack[materialStack.length - 1]]);
            if(textureStack[textureStack.length - 1] != null)
                this.scene.textures[textureStack[textureStack.length - 1]].bind();
        }
        else{
            if(this.scene.textures[textureStack[textureStack.length - 1]] != null)
                this.scene.textures[textureStack[textureStack.length - 1]].unbind();
        }


        //Display leaves if they exist
        for(var i = 0; i < this.leaves.length; i++) {
            if(this.leaves[i] != null)
                this.leaves[i].display();
        }

        //console.log(this.scene.textures[textureStack[textureStack.length - 1]]);

        /*if(this.texture == "clear"){
            this.scene.textures[textureStack[textureStack.length - 1]].bind();
        }*/

        //Recursively run this code for all the children nodes
        for(var j = 0; j < this.descendants.length; j++) {
            this.descendants[j].display();
        }
        
        
        //this.scene.textures[textureStack[textureStack.length - 1]].bind();

        if(this.texture != "null" && this.texture != "clear"){
            textureStack.pop();
        }

        if(this.material != "null")
            materialStack.pop();

        this.scene.popMatrix();

    }
}