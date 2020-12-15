class MyGameOrchestrator {
    constructor(scene, gameboard) {
        this.gameboard = gameboard;
        this.prolog = new MyPrologInterface();
    }

    startGame(){
        this.prolog.makeRequest("play");
    }

    update(time) {

    }

    managePick(mode, results) {
        if(results != null && results.length > 0) {
            for(var i = 0; i < results.length; ++i) {
                var obj = results[i][0];
                if(obj) {
                    var id = results[i][1];
                    this.onObjectSelected(obj, id);
                }
            }
        }
    }

    onObjectSelected(object, id) {
        if(object instanceof MyPieceBox) {

        }
        else if(object instanceof MyTile) {

        } else {
            console.log("Picked invalid object!");
        }
    }

    display() {
        this.gameboard.display();
    }
}