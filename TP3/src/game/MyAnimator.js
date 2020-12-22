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

    addMove(move) {
        this.sequence.addMove(move);
    }

    update(time) {
        for(var i = 0; i < this.sequence.moves.length; ++i) {
            this.sequence.moves[i].animate(time);
        }
    }
}