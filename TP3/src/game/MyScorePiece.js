class MyScorePiece extends MyPiece {
    constructor(scene, colour) {
        super(scene, colour);
    }

    display(colours) {
        colours[this.colour].bind();
        this.obj.display();
        colours[this.colour].unbind();
    }
}