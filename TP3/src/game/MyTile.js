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

    display(line, diagonal, orapp, greenapp, purpapp) {
        if(this.piece == null){
            this.scene.registerForPick(diagonal + line * 100, this);
        }
        //display da tile e da peça(se existir)
        this.obj.display();
        if(this.piece != null)
            this.piece.display(orapp, greenapp, purpapp);
    }
}