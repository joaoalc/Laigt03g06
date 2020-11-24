class MyTile extends CGFobject {
    constructor(board) {
        this.board = board;
        this.piece = null;
    }

    getPiece() {
        return this.piece;
    }

    setPiece(piece) {
        this.piece = piece;
    }

    display() {
        //display da tile
        
    }
}