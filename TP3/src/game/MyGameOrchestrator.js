const START = 0;
const PLAYING = 1;
const PICKED_COLOUR = 2;
const PLAY = 3;
const END_GAME = 4;

class MyGameOrchestrator {
    constructor(scene, gameboardPos) {
        this.scene = scene;
        this.gameboard = new MyGameBoard(this.scene);
        this.gameboardPos = gameboardPos;
        this.prolog = new MyPrologInterface(this);
        this.animator = new MyAnimator(scene, this);
        this.interface = new MyGameInterface(scene, this);
        this.currentPlayer = -1;
        this.firstPlayer = 1;
        this.state = START;

        this.players = {'Player 1' : 1, 'Player 2': 2};
        this.modes = {'Human/Human' : ['H','H'], 'Human/Computer' : ['H', 'C'], 'Computer/Human' : ['C', 'H'], 'Computer/Computer' : ['C', 'C']};

        this.mode = ['H','H'];
        this.chooseMode = ['H','H'];
    }

    startGame(){
        //this.prolog.makeRequest("play");
        this.gameboard.create();
        this.state = PLAYING;
        this.coloursWon = ['FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE'];
        this.currentPlayer = this.firstPlayer;
        this.mode = this.chooseMode;
        console.log("START");
    }

    update(time) {
        time /= 1000;
        this.animator.update(time);
        this.gameboard.update(time);
        this.interface.update(time);
    }

    play() {
        var playerType = this.mode[this.currentPlayer - 1];

        switch(playerType) {
            case 'H':
                if(this.state == PLAY) {
                    
                }
                break;
            case 'C':
                if(this.state == PLAYING) {
                    this.botPlay();
                } 
                break;
        }
    }

    managePick(results) {
        if(this.state == PLAYING || this.state == PICKED_COLOUR) {
            if(this.currentPlayer != -1 && this.mode[this.currentPlayer-1] != 'C') {
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

    undo() { 
        var undoResult = this.animator.undo();
        if(undoResult != -1) {
            this.coloursWon = undoResult;
            this.currentPlayer = this.currentPlayer % 2 + 1;
            var gameState = this.gameboard.boardString() + "-(" + this.coloursWonString() + ")";
            this.prolog.makeRequest("updateColours("+ gameState + "," + this.currentPlayer+")", this.prolog.parseUpdateColours);
        }
        this.state = PLAYING;
    }

    userPlay(tile, coords) {
        this.state = PLAY;
        this.pickedTile = tile;
        var newPiece = new MyPiece(this.scene, this.pickedColor);
        var coloursWonMove = this.coloursWon.slice();
        this.animator.addMove(new MyGameMove(this.scene, coloursWonMove, newPiece, tile));
        this.onMove(coords, this.pickedColor);
        this.gameboard.getPieceBox(this.pickedColor).nPieces--;
        tile.setPiece(newPiece);
        //this.gameboard.updateColoursWon(this.coloursWon);
        this.pickedColor = null;
        this.pickedTile = null;
    }

    onMove(coords, colour) {
        var gameState = this.gameboard.boardString() + "-(" + this.coloursWonString() + ")";
        this.prolog.makeRequest("player_move("+ gameState + ",[" + coords[0]+","+
            coords[1]+","+colour+"],"+this.currentPlayer+")", this.prolog.parseColoursWon);
    }

    botPlay() {
        var gameState = this.gameboard.boardString() + "-(" + this.coloursWonString() + ")";
        this.prolog.makeRequest("getBotMove("+ gameState + "," + this.currentPlayer +","+
            this.level+")", this.prolog.parseBotMove);
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

    getPieceNumbers() {
        return [this.gameboard.getPieceBox("purple").nPieces, 
                this.gameboard.getPieceBox("orange").nPieces, 
                this.gameboard.getPieceBox("green").nPieces];
    }

    display() {

        if(this.state != START && this.state != END_GAME) {
            this.play();
        }

        this.scene.pushMatrix();
        this.scene.translate(this.gameboardPos[0],this.gameboardPos[1],this.gameboardPos[2])

        this.gameboard.display();
        this.interface.display();

        this.scene.popMatrix();
    }
}