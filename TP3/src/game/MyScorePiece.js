class MyScorePiece extends MyPiece {
    constructor(scene, colour) {
        super(scene, colour);
    }

    display(colours) {
        colours[this.colour].bind();
        this.scene.pushMatrix();
        this.cylinder.display();
        this.scene.translate(0, 0, 0.2);
        this.scene.rotate(this.symbolRot, 0,0,1);
        this.symbol.display();
        this.scene.popMatrix();
        colours[this.colour].unbind();
    }
}