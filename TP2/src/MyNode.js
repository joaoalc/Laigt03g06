
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
    constructor(scene, id, texture, material, transformations, descendants, leaves, animation) {
        this.id = id;
        this.scene = scene;
        this.texture = texture;
        this.material = material;
        this.transformations = transformations;
        this.transfMatrix = mat4.create();
        this.descendants = descendants;
        this.leaves = leaves;
        this.animation = animation;
        this.appearance = new CGFappearance(this.scene);

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

        if(this.animation != null) {
            this.animation.apply(this.scene);
        }

        if(this.material != "null") { //Adicionar o material se não for "null"
            materialStack.push(this.material);
        }

        if(this.scene.materials[materialStack[materialStack.length - 1]] != null)
            this.scene.materials[materialStack[materialStack.length - 1]].apply();

        if(this.texture == "clear") {
            if(this.scene.textures[textureStack[textureStack.length - 1]] != null) 
                this.scene.textures[textureStack[textureStack.length - 1]].unbind();  
            textureStack.push(0);
        } else if(this.texture == "null") {
            if(this.scene.textures[textureStack[textureStack.length - 1]] != null) {
                if(this.scene.textures[textureStack[textureStack.length - 1]] != 0)
                    this.scene.textures[textureStack[textureStack.length - 1]].bind();
            }
        } else {
            if(this.scene.textures[this.texture] != 0 && this.scene.textures[this.texture] != null) {
                textureStack.push(this.texture);
                this.scene.textures[textureStack[textureStack.length - 1]].bind();
            }
        }
        // //Texture
        // if(this.texture != "null" && this.texture != "clear") //Texture id being "null" means it inherits it's parent's texture
        // {
        //     if(this.scene.textures[this.texture] != 0 && this.scene.textures[this.texture] != null)
        //         textureStack.push(this.texture);
        //     else 
        //         this.texture == "clear"; //if the texture path is invalid, texture is set as clear
        // }
        
        
        // if(this.texture != "clear"){
        //     if(textureStack[textureStack.length - 1] != null)
        //         this.scene.textures[textureStack[textureStack.length - 1]].bind();
        // }
        // else{
        //     if(this.scene.textures[textureStack[textureStack.length - 1]] != null)
        //         this.scene.textures[textureStack[textureStack.length - 1]].unbind();
        //     else {
        //     }
        //}


        //Display leaves if they exist
        for(var i = 0; i < this.leaves.length; i++) {
            if(this.leaves[i] != null)
                this.leaves[i].display();
        }

        //Recursively run this code for all the children nodes
        for(var j = 0; j < this.descendants.length; j++) {
            this.descendants[j].display();
        }

        if(this.texture != "null"){
            textureStack.pop();
        }

        if(this.material != "null")
            materialStack.pop();

        this.scene.popMatrix();

    }
}