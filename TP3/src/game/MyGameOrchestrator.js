const PICK_PIECE = 0;
const PICK_TILE = 1;

class MyGameOrchestrator {
    constructor(scene, gameboard) {
        this.scene = scene;
        this.gameboard = gameboard;
        //this.prolog = new MyPrologInterface();
        this.state = PICK_PIECE;
        this.animator = new MyAnimator(this);
        
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
                console.log(this.state);
                this.pickedColor = object.color;
                this.state = PICK_TILE;
            }
        }
        else if(object instanceof MyTile) {
            console.log(this.state);
            if(object.piece == null && this.state == PICK_TILE) {
                this.pickedTile = object;
                object.setPiece(new MyPiece(this.scene, this.pickedColor));
                this.gameboard.getPieceBox(this.pickedColor).nPieces--;
                this.pickedColor = null;
                this.pickedTile = null;
                this.state = PICK_PIECE;
            }
        } else {
            console.log("Picked invalid object!");
        }
    }

    display() {
        this.gameboard.display();
    }
}