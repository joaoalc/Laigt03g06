class MyGameInterface {
    constructor(scene, orchestrator) {
        this.scene = scene;
        this.orchestrator = orchestrator;

        this.gameOver = new MySpriteText(this.scene, "Game Over", "./images/fonts/font5_2.png");
        this.winner = new MySpriteText(this.scene, "", "./images/fonts/font5_2.png");

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
        this.frameTexture = new CGFtexture(this.scene, "./scenes/textures_LAIG_TP2_XML_T3_G06_v1/golden.jpg");

        this.coloursScore = new MyRectangle(this.scene, 2.2, 0.5, -2.2, -0.5, 4.4, 1);

        this.colours1Text = new CGFtexture(this.scene, "./images/board1.png");

        this.colours2Text = new CGFtexture(this.scene, "./images/board2.png");

        this.colours1 = [];
        this.colours2 = [];
        this.colours = ["purple", "orange", "green"];

        var purple = new CGFtexture(this.scene, "images/purple.png");
        var orange = new CGFtexture(this.scene, "images/orange.png");
        var green = new CGFtexture(this.scene, "images/green.png");
        var grey = new CGFtexture(this.scene, "images/grey.png");

        this.scoreColours = {"purple":purple, "orange":orange, "green":green, "grey":grey};
        this.scorePiece = new MyCylinder(this.scene, 0.2, 0.4, 0.4, 20, 5);
    }

    reset() {
        this.timerTime = 0;
        this.timerDisplay.setText("00:00");
    }

    setWinner(winner) {
        var text = "Player " + winner.toString() + " Wins!";
        this.winner.setText(text);
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

    update(time) {
        var coloursWon = this.orchestrator.coloursWon;
        if(coloursWon != null) {
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
    }

    display() {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2.0, 1,0,0);

        if(this.orchestrator.state == END_GAME) {
            this.scene.pushMatrix();
            this.scene.translate(0, 1, 1);
            this.gameOver.display();
            this.scene.translate(0, -1.5, 0);
            this.winner.display();
            this.scene.popMatrix();
        }
        //timer
        this.scene.pushMatrix();
        this.scene.translate(-9, 5, -1);
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
        this.scene.pushMatrix();
        this.scene.translate(-7, 0, -1);

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