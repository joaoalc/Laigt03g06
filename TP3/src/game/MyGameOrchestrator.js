const PLAYING = 1;
const PICKED_COLOUR = 2;
const PLAY = 3;
const END_GAME = 4;

class MyGameOrchestrator {
    constructor(scene, gameboard) {
        this.scene = scene;
        this.gameboard = gameboard;
        this.prolog = new MyPrologInterface(this);
        this.animator = new MyAnimator(scene, this);
        this.interface = new MyGameInterface(scene, this);
        this.currentPlayer = -1;
        this.playing = false;
    }

    startGame(firstPlayer){
        //this.prolog.makeRequest("play");
        this.gameboard.create();
        this.state = PLAYING;
        this.coloursWon = ['FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE'];
        this.currentPlayer = firstPlayer;
    }

    update(time) {
        time /= 1000;
        this.animator.update(time);
    }

    managePick(results) {
        if(this.currentPlayer != -1 && (this.state == PLAYING || this.state == PICKED_COLOUR)) {
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
    }

    onObjectSelected(object, id) {
        if(object instanceof MyPieceBox) {
            if(object.nPieces > 0) {
                this.pickedColor = object.color;
                this.state = PICKED_COLOUR;
            }
        }
        else if(object instanceof MyTile) {
            if(object.piece == null && this.state == PICKED_COLOUR) {
                this.userPlay(object, [Math.floor(id/100), id%100]);
            }
        } else {
            console.log("Picked invalid object!");
        }
    }

    undo() { //DOESNT WORKKK
        var undoState = this.animator.undo();
        if(undoState == -1) {
            this.gameboard = new MyGameBoard(this.scene);
        } else this.gameboard = undoState;
    }

    userPlay(tile, coords) {
        this.state = PLAY;
        this.pickedTile = tile;
        var newPiece = new MyPiece(this.scene, this.pickedColor);
        this.onMove(coords, this.pickedColor);
        this.gameboard.getPieceBox(this.pickedColor).nPieces--;
        tile.setPiece(newPiece);
        this.gameboard.updateColoursWon(this.coloursWon);
        this.animator.addMove(new MyGameMove(this.scene, this.gameboard, newPiece, tile));
        this.pickedColor = null;
        this.pickedTile = null;
    }

    onMove(coords, colour) {
        var gameState = this.gameboard.boardString() + "-(" + this.coloursWonString() + ")";
        this.prolog.makeRequest("player_move("+ gameState + ",[" + coords[0]+","+
            coords[1]+","+colour+"],"+this.currentPlayer+")", this.prolog.parseColoursWon);
    }

    updateColours(coloursWon) {
        this.coloursWon = coloursWon;
        console.log(this.coloursWon);
    }

    setPlaying() {
        this.state = PLAYING;
        this.currentPlayer = (this.currentPlayer) % 2 + 1;
    }

    coloursWonString() {
        var result = "";
        for(var i = 0; i < this.coloursWon.length; ++i) {
            if(i != (this.coloursWon.length - 1))
                result += "'" + this.coloursWon[i] + "'-"
            else result += "'"+this.coloursWon[i]+"'";
        }
        return result;
    }

    display() {
        this.gameboard.display();
    }
}