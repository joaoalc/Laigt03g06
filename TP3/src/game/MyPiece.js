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

    display(colours) {

        if(this.animation != null && this.animation.checkVisibility()) {
            colours[this.colour].bind();

            this.scene.pushMatrix();

            if(this.animation != null) 
                this.animation.apply();
                
            this.obj.display();
            this.scene.popMatrix();
        }
    }
}