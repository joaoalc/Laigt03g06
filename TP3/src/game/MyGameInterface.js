class MyGameInterface {
    constructor(scene, orchestrator) {
        this.scene = scene;
        this.orchestrator = orchestrator;

        this.gameOver = new MySpriteText(this.scene, "Game Over", "./images/fonts/font5_2.png");
        this.winner = new MySpriteText(this.scene, "", "./images/fonts/font5_2.png");

        this.timerDisplay = new MySpriteText(this.scene, "00:00");

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

    setWinner(winner) {
        var text = "Player " + winner.toString() + " Wins!";
        this.winner.setText(text);
    }

    setTimer(time) {
        var minutes = Math.floor(time / 60);
        var seconds = Math.ceil(time % 60);
        var timerFormatted = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
        this.timerDisplay.setText(timerFormatted);
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
        this.scene.translate(-9, 2, -1);
        this.timerDisplay.display();
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