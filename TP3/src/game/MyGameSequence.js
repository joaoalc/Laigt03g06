class MyGameSequence {
    constructor() {
        this.moves = [];
    }

    addMove(move) {
        this.moves.push(move);
    }

    removeMove(move) {
        this.moves.pop();
    }

    getUndoState() {
        if(this.moves.length > 1) {
            this.moves.pop();
            return this.moves[this.moves.length - 1].gamestate;
        }
    }

    getReplay() {
        return this.moves;
    }
}