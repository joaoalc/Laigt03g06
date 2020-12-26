class MyGameInterface {
    constructor(scene, orchestrator) {
        this.scene = scene;
        this.orchestrator = orchestrator;

        this.gameOver = new MySpriteText(this.scene, "Game Over");
        this.winner = new MySpriteText(this.scene, "");
        //  this.pieceCounters = [];
        //  this.initPieceCounters();
    }

    initPieceCounters() {
        //  this.pieceCounters["purple"] = new MySpriteText(this.scene, this.orchestrator.getPieceNumbers()[0].toString());
        // this.pieceCounters["orange"] = new MySpriteText(this.scene, this.orchestrator.getPieceNumbers()[1].toString());
        // this.pieceCounters["green"] = new MySpriteText(this.scene, this.orchestrator.getPieceNumbers()[2].toString());
    }

    setWinner(winner) {
        var text = "Player " + winner.toString() + " Wins!";
        this.winner.setText(text);
    }

    update(time) {

        // this.pieceCounters["purple"].setText(this.orchestrator.getPieceNumbers()[0]);
        // this.pieceCounters["orange"].setText(this.orchestrator.getPieceNumbers()[1]);
        // this.pieceCounters["green"].setText(this.orchestrator.getPieceNumbers()[2]);

        //  this.pieceCounters["purple"].setText(this.orchestrator.getPieceNumbers()[0].toString());
        // this.pieceCounters["orange"].setText(this.orchestrator.getPieceNumbers()[1].toString());
        // this.pieceCounters["green"].setText(this.orchestrator.getPieceNumbers()[2].toString());
    }

    display() {
        if(this.orchestrator.state == END_GAME) {
            this.scene.pushMatrix();
            this.scene.rotate(-Math.PI/2.0, 1,0,0);
            this.scene.translate(0, 1, 1);
            this.gameOver.display();
            this.scene.translate(0, -1.5, 0);
            this.winner.display();
            this.scene.popMatrix();
        }
        //  for(var key in this.pieceCounters) {
        //      this.pieceCounters[key].display();
        //  }
    }
}