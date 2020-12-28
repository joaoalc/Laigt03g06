const START = 0;
const PLAYING = 1;
const PICKED_COLOUR = 2;
const PLAY = 3;
const END_GAME = 4;
const MOVIE = 5;

class MyGameOrchestrator {
    constructor(scene, gameboardPos) {
        this.scene = scene;
        this.gameboard = new MyGameBoard(this.scene);
        this.gameboardPos = gameboardPos;
        this.prolog = new MyPrologInterface(this);
        this.animator = new MyAnimator(scene, this);
        this.interface = new MyGameInterface(scene, this);
        this.currentPlayer = -1;
        this.state = START;


        this.firstPlayer = 1;
        this.players = {'Player 1' : 1, 'Player 2': 2};

        this.chooseLevel = "random";
        this.levels = {'Easy' : "random", 'Medium' : "greedy", 'Hard' : "greedy_hard"};

        this.modes = {'Human/Human' : "HH", 'Human/Computer' : "HC", 'Computer/Human' : "CH", 'Computer/Computer' : "CC"};
        this.mode = "HH";
        this.chooseMode = "HH";

        this.winner = 0;
    }

    startGame(){
        //this.prolog.makeRequest("play");
        this.gameboard.create();
        this.state = PLAYING;
        this.coloursWon = ['FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE'];
        this.currentPlayer = this.firstPlayer;
        this.mode = this.chooseMode;
        this.level = this.chooseLevel;
        console.log(this.mode);
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

        if(this.checkOver())
            return;

        if(this.state == MOVIE) {
            this.playMovie();
            return;
        }

        if(playerType == 'C') {
            if(this.state == PLAYING) {
                this.botPlay();
            } 
        }
    }

    checkOver() {
        if( (this.coloursWon[0]=='TRUE' && this.coloursWon[1]=='TRUE') || 
            (this.coloursWon[0]=='TRUE' && this.coloursWon[2]=='TRUE') ||
            (this.coloursWon[1]=='TRUE' && this.coloursWon[2]=='TRUE')) {
                this.state = END_GAME;
                this.winner = 1;
                this.interface.setWinner(this.winner);
                return true;
        }
        else 
            if( (this.coloursWon[3]=='TRUE' && this.coloursWon[4]=='TRUE') || 
            (this.coloursWon[3]=='TRUE' && this.coloursWon[5]=='TRUE') ||
            (this.coloursWon[4]=='TRUE' && this.coloursWon[5]=='TRUE')) {
                this.state = END_GAME;
                this.winner = 2;
                this.interface.setWinner(this.winner);
                return true;
        }
        return false;
    }

    managePick(results) {
        if(this.state == PLAYING || this.state == PICKED_COLOUR) {
            if(this.currentPlayer != -1 && this.mode[this.currentPlayer-1] == 'H') {
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
        console.log("UNDO");
        var undoResult = this.animator.undo();
        if(undoResult != -1) {
            this.coloursWon = undoResult;
            var gameState = this.gameboard.boardString() + "-(" + this.coloursWonString() + ")";
            this.prolog.makeRequest("updateColours("+ gameState + "," + this.currentPlayer+")", this.parseUpdateColours.bind(this));
        }
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
            coords[1]+","+colour+"],"+this.currentPlayer+")", this.parseColoursWon.bind(this));
    }
    
    parseColoursWon(data) {
        var reply = data.target.response;
        this.updateColours(reply.split('-'));
        if(!this.checkOver())
            this.setPlaying();
    }

    parseUpdateColours(data) {
        var reply = data.target.response;
        this.updateColours(reply.split('-'));
        this.setPlaying();
    }
    
    parseBotMove(data) {
        var move = data.target.response.split('-');
        this.botMove(move);
    }

    botPlay() {
        this.state = PLAY;
        var gameState = this.gameboard.boardString() + "-(" + this.coloursWonString() + ")";
        this.prolog.makeRequest("getBotMove("+ gameState + "," + this.currentPlayer +","+
            this.level+")", this.parseBotMove.bind(this));
    }

    botMove(move) {
        var row = move[0];
        var diagonal = move[1];
        var colour = move[2];
        var tile = this.gameboard.getTileCoords(row, diagonal);
        var newPiece = new MyPiece(this.scene, colour);
        var coloursWonMove = this.coloursWon.slice();
        this.animator.addMove(new MyGameMove(this.scene, coloursWonMove, newPiece, tile));
        this.onMove([row, diagonal], colour);
        this.gameboard.getPieceBox(colour).nPieces--;
        tile.setPiece(newPiece);
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

    startMovie() {
        this.state = MOVIE;
        this.coloursWonMovie = ['FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE'];
        this.animator.start();
    }

    playMovie() {

    }

    display() {
        if(this.state != START && this.state != END_GAME) {
            this.play();
        }

        this.scene.pushMatrix();

        this.scene.translate(this.gameboardPos[0],this.gameboardPos[1],this.gameboardPos[2]);
        this.scene.rotate(this.gameboardPos[3], 1,0,0);
        this.scene.rotate(this.gameboardPos[4], 0,1,0);
        this.scene.rotate(this.gameboardPos[5], 0,0,1);
        this.scene.scale(this.gameboardPos[6],this.gameboardPos[6],this.gameboardPos[6]);

        this.gameboard.display();
        this.interface.display();

        this.scene.popMatrix();
    }
}