class MyGameBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.tiles = [];
        this.startDiagonals = [1,1,1,1,1,2,2,2,3,3,4,4,5,5,6,6,7,8,8,9,10,11,12];
        this.startLines = [1,1,1,1,1,2,2,2,3,3,4,4,5,5,6,6,7,8,8,9,10,11,12];
        this.lineLengths = [2,3,4,5,6,5,6,7,6,7,6,7,6,7,6,7,6,5,6,5,4,3,2];
        this.horShift = 1.5;
        this.vertShift = Math.sin(Math.PI/3)/2;

        this.purple = new CGFtexture(this.scene, "images/purple.png");
        this.orange = new CGFtexture(this.scene, "images/orange.png");
        this.green = new CGFtexture(this.scene, "images/green.png");

        this.pieceBoxes = [];
        this.pieceBoxes["purple"] = new MyPieceBox(this.scene, "purple");
        this.pieceBoxes["orange"] = new MyPieceBox(this.scene, "orange");
        this.pieceBoxes["green"] = new MyPieceBox(this.scene, "green");

        this.pieceCounters = [];
        this.pieceCounters["purple"] = new MySpriteText(this.scene, this.pieceBoxes["purple"].nPieces.toString());
        this.pieceCounters["orange"] = new MySpriteText(this.scene, this.pieceBoxes["orange"].nPieces.toString());
        this.pieceCounters["green"] = new MySpriteText(this.scene, this.pieceBoxes["green"].nPieces.toString());

        this.create();

        this.boardPlane = new MyRectangle(this.scene, 0, -10.5, 12, 0, 12, 10.5);
        this.boardFrame = new MyTorus(this.scene, 0.1, 8.485, 4, 4);
        this.boardTexture = new CGFtexture(this.scene, "images/board_clear3.png");
        this.frameTexture = new CGFtexture(this.scene, "./scenes/textures_LAIG_TP2_XML_T3_G06_v1/golden.jpg");
        this.tileTexture = new CGFtexture(this.scene, "images/tile.png");

        this.boardMat = new CGFappearance(this.scene);
        this.boardMat.setShininess(10.0);
        this.boardMat.setSpecular(0.4, 0.4, 0.4, 1);
        this.boardMat.setDiffuse(0.6, 0.6, 0.6, 1);
        this.boardMat.setAmbient(0.2, 0.2, 0.2, 1);
        this.boardMat.setEmission(0, 0, 0, 1);
    }

    create() { 
        for(var line = 1; line <= 23; ++line) {
            var startDiag = this.startDiagonals[line - 1];

            var lineLength = this.lineLengths[line-1];
            var position1 = [(10 - (lineLength + (lineLength-1)*0.5))/2, -this.vertShift * (line-1), 0];

            for(var col = 1; col <= this.lineLengths[line-1]; ++col) {
                var diagonal = startDiag + col - 1;

                var position2 = [position1[0] + this.horShift * (col - 1), position1[1], position1[2]];
                this.tiles[[line, diagonal]] = new MyTile(this.scene, this, position2);
            }
        }
        this.pieceBoxes["purple"].reset();
        this.pieceBoxes["orange"].reset();
        this.pieceBoxes["green"].reset();
    }

    getPieceBox(colour) {
        return this.pieceBoxes[colour];
    }

    // get piece on given tile
    getPiece(tile) {
        for(var key in this.tiles) {
            if(this.tiles[key] == tile)
                return this.tiles[key].getPiece();
        }
    }

    // get tile given a piece
    getPieceTile(piece) {
        for(var key in this.tiles) {
            if(this.tiles[key].getPiece() == piece)
                return this.tiles[key];
        }
    }

    // get tile by board coordinates
    getTileCoords(line, diagonal) {
        return this.tiles[[line, diagonal]];
    }

    addPiece(piece, line, diagonal) {
        this.tiles[[line, diagonal]].setPiece(piece);
    }

    updateColoursWon(coloursWon) {
        if(coloursWon[0] || coloursWon[3]) 
            this.purpleWon = 1;
        if(coloursWon[1] || coloursWon[4]) 
            this.orangeWon = 1;
        if(coloursWon[2] || coloursWon[5]) 
            this.greenWon = 1;
    }

    boardString() {
        var result = "["
        for(var line = 1; line <= 23; ++line) {
            var lineArr = [];
            var startDiag = this.startDiagonals[line - 1];
            for(var col = 1; col <= this.lineLengths[line-1]; ++col) {
                var diagonal = startDiag + col - 1;
                var cellValue;
                if(this.tiles[[line, diagonal]].piece != null)
                    cellValue = this.tiles[[line, diagonal]].piece.colour;
                else cellValue = "empty";
                lineArr.push(cellValue);
            }
            result += "[" + lineArr.join() + "]";
            if(line < 23)
                result += ",";
        }
        return result + "]";
    }

    resetBoxes() {
        this.pieceBoxes["purple"].reset();
        this.pieceBoxes["orange"].reset();
        this.pieceBoxes["green"].reset();
    }

    update(time) {
        this.pieceCounters["purple"].setText(this.pieceBoxes["purple"].nPieces.toString());
        this.pieceCounters["orange"].setText(this.pieceBoxes["orange"].nPieces.toString());
        this.pieceCounters["green"].setText(this.pieceBoxes["green"].nPieces.toString());
    }

    display() {
        this.scene.rotate(-Math.PI/2, 1, 0, 0);

        this.frameTexture.bind();
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -1.3);
        this.scene.scale(1, 0.875, 1);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.boardFrame.display();
        this.scene.popMatrix();

        this.scene.translate(-3.5 * this.horShift + this.horShift/2, 11.5 * this.vertShift - this.vertShift/2, -1.3);

        this.boardMat.apply();
        this.scene.pushMatrix();
        this.scene.translate(-1.5, 0.5, 0);
        this.boardTexture.bind();
        this.boardPlane.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();

        this.tileTexture.bind();
        for(var line = 1; line <= 23; ++line) {
            this.scene.pushMatrix();
            var lineLength = this.lineLengths[line-1];

            this.scene.translate((10 - (lineLength + (lineLength-1)*0.5))/2, -this.vertShift * (line-1), 0);
            var startDiagonal = this.startDiagonals[line-1];

            for(var col = 1; col <= lineLength; ++col) {
                this.scene.pushMatrix();
                this.scene.translate(this.horShift * (col - 1), 0, 0);
                var diagonal = startDiagonal + col - 1;
                this.tiles[[line, diagonal]].display(line, diagonal);
                this.scene.popMatrix();
            }
            this.scene.popMatrix();
        }

        for(var tile in this.tiles) {
            if(this.tiles[tile].piece != null)
                this.tiles[tile].piece.display(this.orange, this.green, this.purple);
        }

        this.scene.pushMatrix();
            this.scene.translate(0, 3, 0.9);
            this.pieceBoxes["purple"].display();
            this.scene.pushMatrix();
            this.scene.translate(0, 0, 1.2);
            this.scene.rotate(DEGREE_TO_RAD*90, 1,0,0);
            this.pieceCounters["purple"].display();
            this.scene.popMatrix();

            this.scene.translate(4.5, 0, 0);
            this.pieceBoxes["orange"].display();
            this.scene.pushMatrix();
            this.scene.translate(0, 0, 1.2);
            this.scene.rotate(DEGREE_TO_RAD*90, 1,0,0);
            this.pieceCounters["orange"].display();
            this.scene.popMatrix();

            this.scene.translate(4.5, 0, 0);
            this.pieceBoxes["green"].display();
            this.scene.pushMatrix();
            this.scene.translate(0, 0, 1.2);
            this.scene.rotate(DEGREE_TO_RAD*90, 1,0,0);
            this.pieceCounters["green"].display();
            this.scene.popMatrix();
        this.scene.popMatrix();


        this.scene.popMatrix();
    }
}