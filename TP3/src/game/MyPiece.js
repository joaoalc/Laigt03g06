class MyPiece extends CGFobject {
    constructor(scene, colour) {
        super(scene);
        this.colour = colour;
        this.tile = null;
        this.cylinder = new MyCylinder(this.scene, 0.2, 0.4, 0.4, 20, 5);  
        switch(colour) {
            case "purple":
                this.symbol = new MyTorus(this.scene, 0.05, 0.3, 6, 4);
                this.symbolRot = Math.PI/4;
                break;
            case "orange":
                this.symbol = new MyTorus(this.scene, 0.05, 0.25, 6, 20);
                this.symbolRot = 0;
                break;
            case "green":
                this.symbol = new MyTorus(this.scene, 0.05, 0.3, 4, 3);
                this.symbolRot = -Math.PI/6;
                break;
            case "grey":
                break;
        }
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
                
            this.cylinder.display();

            this.scene.translate(0, 0, 0.2);
            this.scene.rotate(this.symbolRot, 0,0,1);
            this.symbol.display();

            this.scene.popMatrix();
        }
    }
}