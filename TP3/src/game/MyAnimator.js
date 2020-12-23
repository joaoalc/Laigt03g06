class MyAnimator {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.sequence = new MyGameSequence();
    }

    reset() {
        this.sequence = new MyGameSequence();
    }

    start() {

    }

    undo() { //DOESNT WORK
        if(this.sequence.length > 1) {
            return this.sequence.getUndoState();
        } else {
            this.sequence.removeMove();
            return -1;
        }
    }

    addMove(move) {
        this.sequence.addMove(move);
    }

    update(time) {
        for(var i = 0; i < this.sequence.moves.length; ++i) {
            this.sequence.moves[i].animate(time);
        }
    }
}