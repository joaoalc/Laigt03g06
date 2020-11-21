
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
    constructor(scene, id, texture, material, transfMatrix, descendants, leaves, animation) {
        this.id = id;
        this.scene = scene;
        this.texture = texture;
        this.material = material;
        this.transfMatrix = transfMatrix;
        this.descendants = descendants;
        this.leaves = leaves;
        this.animation = animation;
        this.appearance = new CGFappearance(this.scene);
    }

    /**
     * Displays the node and its descendants recursively, applying transfomations, textures and materials
     */
    display() {
        this.scene.pushMatrix();
        this.scene.multMatrix(this.transfMatrix); //Adicionar a nova transformação à matriz de transformações para este objeto e todos os seus descendants

        // se existir uma animação e esta não tiver começado, não efetuar o display do nó
        if((this.animation != null && (this.animation.checkVisibility() == true)) || this.animation == null) {
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
        }

        this.scene.popMatrix();

    }
}