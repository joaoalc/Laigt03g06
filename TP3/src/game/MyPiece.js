class MyPiece extends CGFobject {
    constructor(scene, colour) {
        super(scene);
        this.colour = colour;
        this.tile = null;
        this.obj = new MyCylinder(this.scene, 0.2, 0.4, 0.4, 20, 5);
        this.animation = null;
    }

    getTile() {
        return this.tile;
    }

    setTile(tile) {
        this.tile = tile;
    }

    display(orange, green, purple) { //TODO : melhorar isto (ta bastante mau)

        if(this.animation != null && this.animation.checkVisibility()) {
            if(this.colour == "orange"){
                orange.bind();
            }
            else if(this.colour == "green"){
                green.bind();
            }
            else if(this.colour == "purple"){
                purple.bind();
            }
            this.scene.pushMatrix();

            if(this.animation != null) 
                this.animation.apply();
                
            this.obj.display();
            this.scene.popMatrix();

            if(this.colour == "orange"){
                orange.unbind();
            }
            else if(this.colour == "green"){
                green.unbind();
            }
            else if(this.colour == "purple"){
                purple.unbind();
            }
        }
    }
}