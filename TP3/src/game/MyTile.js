class MyTile extends CGFobject {
    constructor(scene, board, position) {
        super(scene);
        this.board = board;
        this.piece = null;
        this.position = position;
        this.obj = new MyCylinder(this.scene, 0.01, 0.5, 0.5, 6, 1);
    }

    getPiece() {
        return this.piece;
    }

    setPiece(piece) {
        this.piece = piece;
    }

    removePiece() {
        this.board.getPieceBox(this.piece.colour).nPieces++;
        this.piece = null;
    }

    display(line, diagonal) {
        this.scene.registerForPick(diagonal + line * 100, this);
        //display da tile e da peça(se existir)
        this.obj.display();
    }
}