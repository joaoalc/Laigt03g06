class MyPiece extends CGFobject {
    constructor(scene, colour) {
        super(scene);
        this.colour = colour;
        this.tile = null;
        this.obj = new MyCylinder(this.scene, 0.2, 0.4, 0.4, 20, 5);
    }

    getTile() {
        return this.tile;
    }

    setTile(tile) {
        this.tile = tile;
    }

    display(orapp, greenapp, purpapp) {
        if(this.colour == "orange"){
            orapp.apply();
        }
        else if(this.colour == "green"){
            greenapp.apply();
        }
        else if(this.colour == "purple"){
            purpapp.apply();
        }
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.obj.display();
        this.scene.popMatrix();
    }
}