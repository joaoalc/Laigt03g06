const PICK_PIECE = 0;
const PICK_TILE = 1;

class MyGameOrchestrator {
    constructor(scene, gameboard) {
        this.scene = scene;
        this.gameboard = gameboard;
        this.prolog = new MyPrologInterface();
        this.state = PICK_PIECE;
        this.animator = new MyAnimator(scene, this);
        
    }

    startGame(){
        this.prolog.makeRequest("play");
    }

    update(time) {
        this.animator.update(time);
    }

    managePick(results) {
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
            if(object.nPieces > 0) {
                this.pickedColor = object.color;
                this.state = PICK_TILE;
            }
        }
        else if(object instanceof MyTile) {
            if(object.piece == null && this.state == PICK_TILE) {
                this.userPlay(object);
            }
        } else {
            console.log("Picked invalid object!");
        }
    }

    userPlay(tile) {
        this.pickedTile = tile;
        var newPiece = new MyPiece(this.scene, this.pickedColor);
        tile.setPiece(newPiece);
        this.gameboard.getPieceBox(this.pickedColor).nPieces--;
        this.animator.addMove(new MyGameMove(this.scene, this.gameboard, newPiece, tile));
        this.pickedColor = null;
        this.pickedTile = null;
        this.state = PICK_PIECE;
    }

    display() {
        this.gameboard.display();
    }
}