class MyGameElements {
    constructor(scene, orchestrator) {
        this.scene = scene;
        this.orchestrator = orchestrator;

        this.gameOverRect = new MyRectangle(this.scene, 4.5, 0.5, -4.5, -0.5, 4.5, 1);
        this.gameOver = new MySpriteText(this.scene, "Game Over", "./images/fonts/font5_2.png");
        this.winnerText = new MySpriteText(this.scene, "Winner!", "./images/fonts/font5_3.png");
        this.winner = -1;

        this.timerTime = 0;
        this.timerDisplay = new MySpriteText(this.scene, "00:00");
        this.timerHand = new MyCylinder(this.scene, 0.9, 0.05, 0.02, 5, 5);
        this.timerFace = new MyCylinder(this.scene, 0.02, 1.15, 1.15, 30, 1);
        this.timerBody1 = new MyCylinder(this.scene, 1, 0.5, 0.5, 4, 1);
        this.timerBody3 = new MyCylinder(this.scene, 1, 0.5, 0.5, 30, 30);
        this.timerBody2 = new MyTorus(this.scene, 0.25, 1.25, 30, 30);
        this.timerHandText = new CGFtexture(this.scene, "./images/hand.png");
        this.timerFaceText = new CGFtexture(this.scene, "./images/timerFace.png");
        this.timerBodyText1 = new CGFtexture(this.scene, "./images/timerBody1.jpg");
        this.timerBodyText2 = new CGFtexture(this.scene, "./images/timerBody2.jpg");

        this.coloursFrame = new MyTorus(this.scene, 0.03, Math.sqrt(2)/2, 4, 4);
        this.frameTexture = new CGFtexture(this.scene, "./images/golden.jpg");

        this.coloursScore = new MyRectangle(this.scene, 2.2, 0.5, -2.2, -0.5, 4.4, 1);

        this.colours1Text = new CGFtexture(this.scene, "./images/board1.png");

        this.colours2Text = new CGFtexture(this.scene, "./images/board2.png");


        //this.playerRectangle = new MyRectangle(this.scene, -0.5, 0.5, -0.5, -0.5, 1, 1);
        this.playerRectangle = new MyRectangle(this.scene, -1.5, -0.5, 0.5, 0.5, 1, 1);

        this.playerTex = new CGFtexture(this.scene, "./images/grey.png");

        
        this.p1Text = new MySpriteText(this.scene, "P1", "./images/fonts/font5_2.png");
        this.p2Text = new MySpriteText(this.scene, "P2", "./images/fonts/font5_2.png");

        this.p1Text_Selected = new MySpriteText(this.scene, "P1", "./images/fonts/font5_3.png");
        this.p2Text_Selected = new MySpriteText(this.scene, "P2", "./images/fonts/font5_3.png");

        this.colours1 = [];
        this.colours2 = [];
        this.colours = ["purple", "orange", "green"];

        var purple = new CGFtexture(this.scene, "images/purple.png");
        var orange = new CGFtexture(this.scene, "images/orange.png");
        var green = new CGFtexture(this.scene, "images/green.png");
        var grey = new CGFtexture(this.scene, "images/grey.png");

        this.scoreColours = {"purple": purple, "orange": orange, "green": green, "grey": grey};
        this.scorePiece = new MyCylinder(this.scene, 0.2, 0.4, 0.4, 20, 5);

        this.boardMat = new CGFappearance(this.scene);
        this.boardMat.setShininess(10.0);
        this.boardMat.setSpecular(0.4, 0.4, 0.4, 1);
        this.boardMat.setDiffuse(0.7, 0.7, 0.7, 1);
        this.boardMat.setAmbient(0.3, 0.3, 0.3, 1);
        this.boardMat.setEmission(0, 0, 0, 1);
    }

    reset() {
        this.timerTime = 0;
        this.timerDisplay.setText("00:00");
        this.winner = -1;
    }

    setWinner(winner) {
        // var text = "Player " + winner.toString() + " Wins!";
        // this.winner.setText(text);
        this.winner = winner;
    }

    setTimer(time) {
        var seconds = Math.ceil(Math.ceil(time) % 60);
        var minutes;
        if(seconds != 0)
            minutes = Math.floor(time / 60);
        else minutes = Math.round(time / 60);
        var timerFormatted = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        this.timerDisplay.setText(timerFormatted);
        this.timerTime = time;
    }

    setColoursWon(coloursWon) {
        this.colours1 = [];
        this.colours2 = [];
        for(var i = 0; i < coloursWon.length; ++i) {
            if(i < 3) {
                if(coloursWon[i] == 'TRUE') {
                    this.colours1[i] = this.colours[i];
                    this.colours2[i] = "grey";
                }
            } else {
                if(coloursWon[i] == 'TRUE') {
                    this.colours2[i-3] = this.colours[i-3];
                    this.colours1[i-3] = "grey";
                }
            }
        }
    }

    update(time) {

    }

    selectedPlayer(player){
        if(this.orchestrator.state == END_GAME || this.orchestrator.state == START){
            return false;
        }
        if(this.orchestrator.state == MOVIE) {
            if(player == this.orchestrator.movieCurrentPlayer)
                return true;
            return false;
        }
        if(player == this.orchestrator.currentPlayer){
            return true;
        }
        return false;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2.0, 1,0,0);

        if(this.orchestrator.state == END_GAME) {
            this.playerTex.bind();
            this.scene.pushMatrix();
            this.scene.translate(0, -6, -1.35);

            this.scene.pushMatrix();
            this.scene.translate(0, 0, -0.01);
            //this.scene.scale(6,1,1);
            this.gameOverRect.display();
            this.scene.popMatrix();

            this.gameOver.display();

            this.scene.popMatrix();

            if(this.winner != -1) {
                this.scene.pushMatrix();
                this.scene.translate(this.winner == 2 ? 8.5 : -8.3, 4.2, -1.3);
                this.scene.scale(0.7, 0.7, 0.7);
                this.winnerText.display();
                this.scene.popMatrix();
            }
            this.playerTex.unbind();
        }
        //timer
        this.scene.pushMatrix();
        this.scene.translate(-9, 5.5, -1);
        this.scene.rotate(Math.PI/6, 0,0,1);

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2.0, 1,0,0);
        this.scene.scale(0.5, 0.5, 0.5);
        this.timerDisplay.display();
        this.scene.popMatrix();

        //body
        this.timerBodyText2.bind();
        this.scene.pushMatrix();
        this.scene.translate(0, 0.4, -0.3);
        this.scene.scale(4, 1, 2);
        this.scene.rotate(Math.PI/4 , 0,0,1);
        this.timerBody1.display();
        this.scene.popMatrix();

        this.timerBodyText1.bind();
        this.scene.pushMatrix();
        this.scene.translate(0, 0.4, 1.8);
        this.scene.scale(1, 2.55, 1);
        this.scene.rotate(Math.PI/2 , 1,0,0);
        this.timerBody2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.35, 0.4, -0.5);

        this.scene.pushMatrix();
        this.scene.scale(0.3, 1, 2.3);
        this.timerBody3.display();
        this.scene.popMatrix();

        this.scene.translate(2.7, 0, 0);
        this.scene.scale(0.3, 1, 2.3);
        this.timerBody3.display();
        
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1.8);
        this.scene.rotate(Math.PI/2 , 1,0,0);
        //face and back
        this.scene.pushMatrix();
        this.timerFaceText.bind();
        this.timerFace.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.7);
        this.timerBodyText2.bind();
        this.timerFace.display();
        this.scene.popMatrix();
        //hand
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.07);
        this.scene.rotate(-(this.timerTime*Math.PI*2)/60 ,0,0,1);
        this.scene.rotate(-Math.PI/2 , 1,0,0);
        this.timerHandText.bind();
        this.timerHand.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.popMatrix();

        //colors scores
        this.boardMat.apply();
        this.scene.pushMatrix();
        this.scene.translate(-7, 0, -1.35);

        this.frameTexture.bind();
        this.scene.pushMatrix();
        this.scene.scale(1,4.4,1);
        this.scene.rotate(-Math.PI/4, 0,0,1);
        this.coloursFrame.display();
        this.scene.popMatrix();

        this.colours1Text.bind();
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0,0,1);
        this.coloursScore.display();
        this.scene.popMatrix();

        this.playerTex.bind();
        this.scene.pushMatrix();
        this.scene.translate(0, 3.2, 0);
        //this.scene.rotate(-Math.PI/2, 1,0,0);
        this.playerRectangle.display();
        //this.scene.rotate(-Math.PI, 1,0,0);
        //this.playerRectangle.display();
        this.scene.translate(-0.5, 0, 0.01);
        if(this.selectedPlayer(1)){
            this.p1Text_Selected.display();
        }
        else{
            this.p1Text.display();
        }
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1.4, 0);

        for(var i = 0; i < this.colours1.length; ++i) {
            if(this.colours1[i] != null) {
                this.scoreColours[this.colours1[i]].bind();
                this.scorePiece.display();
            }
            this.scene.translate(0, 1.4, 0);
        } 
        this.scene.popMatrix();

        //scores 2
        this.scene.translate(14, 0, 0);

        this.frameTexture.bind();
        this.scene.pushMatrix();
        this.scene.scale(1,4.4,1);
        this.scene.rotate(-Math.PI/4, 0,0,1);
        this.coloursFrame.display();
        this.scene.popMatrix();

        this.colours2Text.bind();
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0,0,1);
        this.coloursScore.display();
        this.scene.popMatrix();

        this.playerTex.bind();
        this.scene.pushMatrix();
        this.scene.translate(1, 3.2, 0);
        //this.scene.rotate(-Math.PI/2, 1,0,0);
        this.playerRectangle.display();
        //this.scene.rotate(-Math.PI, 1,0,0);
        //this.playerRectangle.display();
        this.scene.translate(-0.5, 0, 0.01);
        if(this.selectedPlayer(2)){
            this.p2Text_Selected.display();
        }
        else{
            this.p2Text.display();
        }
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 1.4, 0);

        for(var i = 0; i < this.colours2.length; ++i) {
            if(this.colours2[i] != null) {
                this.scoreColours[this.colours2[i]].bind();
                this.scorePiece.display();
            }
            this.scene.translate(0, -1.4, 0);
        } 
        this.scene.popMatrix();
        
        this.scene.popMatrix();


        this.scene.popMatrix();
    }
}