class MyGameSequence {
    constructor() {
        this.moves = [];
    }

    addMove(move) {
        this.moves.push(move);
    }

    removeMove() {
        this.moves.pop();
    }

    undo() {
        if(this.moves.length > 0) {
            this.moves[this.moves.length - 1].undo();
            var old_gamestate = this.moves[this.moves.length - 1].gamestate;
            var player = this.moves[this.moves.length - 1].player;
            this.removeMove();
            return [old_gamestate, player];
        }
        return -1;
    }

    getReplay() {
        return this.moves;
    }
}