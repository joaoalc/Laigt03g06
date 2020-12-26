class MyGameInterface {
    constructor(scene, orchestrator) {
        this.scene = scene;
        this.orchestrator = orchestrator;

        //  this.pieceCounters = [];
        //  this.initPieceCounters();
    }

    initPieceCounters() {
        //  this.pieceCounters["purple"] = new MySpriteText(this.scene, this.orchestrator.getPieceNumbers()[0].toString());
        // this.pieceCounters["orange"] = new MySpriteText(this.scene, this.orchestrator.getPieceNumbers()[1].toString());
        // this.pieceCounters["green"] = new MySpriteText(this.scene, this.orchestrator.getPieceNumbers()[2].toString());
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
        //  for(var key in this.pieceCounters) {
        //      this.pieceCounters[key].display();
        //  }
    }
}