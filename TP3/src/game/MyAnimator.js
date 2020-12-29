class MyAnimator {
    constructor(orchestrator, sequence) {
        this.orchestrator = orchestrator;
        this.sequence = sequence;
    }

    reset() {
        this.sequence = new MyGameSequence();
    }

    start() {
        for(var i = 0; i < this.sequence.moves.length; ++i) {
            this.sequence.moves[i].resetAnim();
        }
    }

    undo() { 
        return this.sequence.undo();
    }

    setSequence(sequence) {
        this.sequence = sequence;
    }

    addMove(move) {
        this.sequence.addMove(move);
    }

    update(time, movie) {
        if(!movie) {
            for(var i = 0; i < this.sequence.moves.length; ++i) {
                if(!this.sequence.moves[i].animationFinished())
                    this.sequence.moves[i].animate(time);
            }
        } else {
            for(var i = 0; i < this.sequence.moves.length; ++i) {
                if(i > 0) {
                    if(!this.sequence.moves[i-1].animationFinished())
                        return;
                }
                if(!this.sequence.moves[i].animationFinished())
                    this.sequence.moves[i].animate(time);
            }
        }
    }
}