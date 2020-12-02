class MyGameMove {
    constructor(gamestate, piece, tile) {
        this.gamestate = clone(gamestate); //gameboard state before the move
        this.piece = piece;
        this.tile = tile;
    }

    animate() {
        
    }
}