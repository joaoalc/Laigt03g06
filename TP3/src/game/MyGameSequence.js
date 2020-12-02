class MyGameSequence {
    constructor() {
        this.moves = [];
    }

    addMove(move) {
        this.moves.push(move);
    }

    getUndoState() {
        this.moves.pop();
        return this.moves[this.moves.length - 1];
    }

    getReplay() {
        return this.moves;
    }
}