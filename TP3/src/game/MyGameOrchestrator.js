const START = 0;
const PLAYING = 1;
const PICKED_COLOUR = 2;
const PLAY_HUMAN = 3;
const PLAY_BOT = 4;
const END_GAME = 5;
const MOVIE = 6;

class MyGameOrchestrator {
    constructor(scene){
        this.scene = scene;
        this.gameboard = new MyGameBoard(this.scene);
        this.prolog = new MyPrologInterface(this);
        this.sequence = new MyGameSequence();
        this.animator = new MyAnimator(this, this.sequence);
        this.interface = new MyGameInterface(scene, this);
        this.currentPlayer = -1;
        this.state = START;
        
        this.firstTime = -1;
        this.playTime = 0;
        this.timer = 0;

        this.lastUpdate = -1;
        scene.activeScene = "Train";

        this.movieMove = [0, 0];
        this.stateMovie = PLAYING;
        this.beforeMovie = [];


        scene.sceneGraphs = {};
        var filenames = {"Train" : 'train.xml', "OtherScene": 'SecondScene.xml'};
        for(let sceneName in filenames){
            //scene.sceneGraphs[scene.activeScene] = new MySceneGraph(filenames[sceneName], scene, sceneName);
            new MySceneGraph(filenames[sceneName], scene, sceneName);
        }


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
        this.prolog.stopRequest();

        this.interface.reset();
        this.sequence = new MyGameSequence();
        this.animator.setSequence(this.sequence);
        this.gameboard.create();
        this.state = PLAYING;
        this.coloursWon = ['FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE'];
        this.interface.setColoursWon(this.coloursWon);
        this.currentPlayer = this.firstPlayer;
        this.mode = this.chooseMode;
        this.level = this.chooseLevel;
        this.winner = 0;
        this.movieMove = [0, 0];
        this.stateMovie = PLAYING;
        this.beforeMovie = [];
        this.firstTime = -1;
        this.timer = 0;
        console.log("START");
    }

    update(time) {
        console.log(this.currentPlayer);
        time /= 1000;
        if(this.lastUpdate == -1)
            this.lastUpdate = time;

        this.animator.update(time, this.state==MOVIE);
        this.gameboard.update(time);
        this.interface.update(time);

        if(this.firstTime == -1)
            this.firstTime = time;

        if((this.state == PLAYING || this.state == PICKED_COLOUR) && this.mode[this.currentPlayer-1] == 'H') {
            if(this.playTime > 0) {
                this.timer = this.playTime - (time - this.firstTime);
                if(this.timer <= 0) {
                    if(this.sequence.moves.length > 0) {
                        this.resetTimer();
                        this.setPlaying();
                    } else { //if it's the first move and timer ends, game ends
                        this.state = END_GAME;
                    }
                }
                this.interface.setTimer(this.timer);
            }
        } else if(this.state == MOVIE) {
            this.firstTime += time - this.lastUpdate;
        }
        
        this.lastUpdate = time;
    }

    resetTimer() {
        this.timer = this.playTime;
        this.firstTime = -1;
    }

    
    orchestrate() {
        if(this.state != START) {
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
    }

    startMovie() {
        if(this.state == PLAYING || this.state == END_GAME || this.state == PLAY_BOT) {
            if(this.state == PLAY_BOT)
                this.prolog.stopRequest();
            this.movieMove = [0,0];
            Object.assign(this.stateMovie, this.state);
            Object.assign(this.beforeMovie, this.coloursWon);
            this.coloursWon = ['FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE'];
            this.interface.setColoursWon(this.coloursWon);
            this.gameboard.resetBoxes();
            this.state = MOVIE;
            this.animator.start();
        }
    }

    stopMovie() {
        if(this.state == MOVIE) {
            var i;
            if(this.movieMove[1] == 0)
                i = this.movieMove[0];
            else i = this.movieMove[0] + 1;

            for(; i < this.sequence.moves.length; ++i) {
                this.gameboard.getPieceBox(this.sequence.moves[i].getColour()).nPieces--;
            }
            this.movieMove = [0,0];

            this.state = this.stateMovie;
            Object.assign(this.coloursWon, this.beforeMovie);
            this.interface.setColoursWon(this.coloursWon);
        }
    }

    playMovie() {
        if(this.movieMove[0] == this.sequence.moves.length) {
            this.state = this.stateMovie;
            Object.assign(this.coloursWon, this.beforeMovie);
            this.interface.setColoursWon(this.coloursWon);
            this.movieMove = [0,0];
        } else {
            if(this.movieMove[1] == 0) {
                this.gameboard.getPieceBox(this.sequence.moves[this.movieMove[0]].getColour()).nPieces--;
                this.movieMove[1] = 1;
            }         
            if(this.sequence.moves[this.movieMove[0]].animationFinished()) {
                this.movieMove[0]++;
                this.movieMove[1] = 0;
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
        if(this.state != START && this.state != PLAY_HUMAN && this.sequence.moves.length > 0) {
            console.log("UNDO");
            if(this.state == PLAY_BOT)
                this.prolog.stopRequest();
            var undoResult = this.animator.undo();
            if(undoResult != -1) {
                // if(this.state == END_GAME) {
                //     this.currentPlayer = this.currentPlayer % 2 + 1;
                // }
                this.resetTimer();
                this.coloursWon = undoResult[0];
                this.interface.setColoursWon(this.coloursWon);

                this.setPlaying(undoResult[1]);
                //var gameState = this.gameboard.boardString() + "-(" + this.coloursWonString() + ")";
                //this.prolog.makeRequest("updateColours("+ gameState + "," + this.currentPlayer+")", this.parseUpdateColours.bind(this));
            }
        }
    }

    userPlay(tile, coords) {
        this.state = PLAY_HUMAN;
        this.pickedTile = tile;
        var newPiece = new MyPiece(this.scene, this.pickedColor);
        var coloursWonMove = this.coloursWon.slice();
        this.sequence.addMove(new MyGameMove(this.scene, coloursWonMove, newPiece, tile, this.currentPlayer));
        this.onMoveRequest(coords, this.pickedColor);
        this.gameboard.getPieceBox(this.pickedColor).nPieces--;
        tile.setPiece(newPiece);
        //this.gameboard.updateColoursWon(this.coloursWon);
        this.pickedColor = null;
        this.pickedTile = null;
    }

    onMoveRequest(coords, colour) {
        var gameState = this.gameboard.boardString() + "-(" + this.coloursWonString() + ")";
        this.prolog.makeRequest("player_move("+ gameState + ",[" + coords[0]+","+
            coords[1]+","+colour+"],"+this.currentPlayer+")", this.parseColoursWon.bind(this));
    }
    
    parseColoursWon(data) {
        var reply = data.target.response;
        this.updateColours(reply.split('-'));
        if(this.state == PLAY_HUMAN)
            this.resetTimer();
        if(!this.checkOver())
            this.setPlaying();
    }

    parseUpdateColours(data) {
        var reply = data.target.response;
        this.updateColours(reply.split('-'));
        this.setPlaying();
    }
    
    botPlay() {
        this.timer = 0;
        this.state = PLAY_BOT;
        var gameState = this.gameboard.boardString() + "-(" + this.coloursWonString() + ")";
        this.prolog.makeRequest("botMove("+ gameState + "," + this.currentPlayer +","+
            this.level+")", this.parseBotMove.bind(this));
    }

    parseBotMove(data) {
        var reply = data.target.response;
        if(reply != 'bot_error') {
            if(this.state == PLAY_BOT && this.mode[this.currentPlayer-1] == 'C') { 
                reply = data.target.response.split('-');

                var row = reply[0];
                var diagonal = reply[1];
                var colour = reply[2];
                var tile = this.gameboard.getTileCoords(row, diagonal);
                var newPiece = new MyPiece(this.scene, colour);
                var coloursWonMove = this.coloursWon.slice();
                var coloursNew = [reply[3].substr(1), reply[4], reply[5], reply[6], reply[7], reply[8].substr(0, reply[8].length-1)];
                this.sequence.addMove(new MyGameMove(this.scene, coloursWonMove, newPiece, tile, this.currentPlayer));
                this.updateColours(coloursNew);
                this.gameboard.getPieceBox(colour).nPieces--;
                tile.setPiece(newPiece);

                if(!this.checkOver())
                    this.setPlaying();
            }
        }
    }

    updateColours(coloursWon) {
        this.coloursWon = coloursWon;
        this.interface.setColoursWon(this.coloursWon);
        console.log(this.coloursWon);
    }

    setPlaying(player) {
        this.state = PLAYING;

        if(player != null)
            this.currentPlayer = player;
        else this.currentPlayer = this.currentPlayer % 2 + 1;
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

    setGameBoardPosition(pos){
        this.gameboardPos = pos;
    }

    display() {
        if(this.scene.sceneGraphs[this.scene.activeScene].loadedOk){

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
}