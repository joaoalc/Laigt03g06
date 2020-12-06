class MyTile extends CGFobject {
    constructor(scene, board) {
        super(scene);
        this.board = board;
        this.piece = null;
        this.obj = new MyCylinder(this.scene, 0.01, 0.5, 0.5, 6, 1);
    }

    getPiece() {
        return this.piece;
    }

    setPiece(piece) {
        this.piece = piece;
    }

    display(line, diagonal, orange, green, purple) {
        if(this.piece == null){
            this.scene.registerForPick(diagonal + line * 100, this);
        } else this.scene.registerForPick(0, null);
        //display da tile e da peça(se existir)
        this.obj.display();
        if(this.piece != null)
            this.piece.display(orange, green, purple);
    }
}