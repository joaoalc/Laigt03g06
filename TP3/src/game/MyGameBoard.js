class MyGameBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.tiles = [];
        this.startDiagonals = [1,1,1,1,1,2,2,2,3,3,4,4,5,5,6,6,7,8,8,9,10,11,12];
        this.startLines = [1,1,1,1,1,2,2,2,3,3,4,4,5,5,6,6,7,8,8,9,10,11,12];
        this.lineLengths = [2,3,4,5,6,5,6,7,6,7,6,7,6,7,6,7,6,5,6,5,4,3,2];
        this.horShift = 1.5;
        this.vertShift = Math.sin(Math.PI/3)/2;
        this.create();

        /*<material id="piece_green">
            <shininess value="5.0"/>
            <ambient r="0" g="0.9" b="0.25" a="1.0"/>
            <diffuse r="0.15" g="1" b="0.3" a="1.0"/>
            <specular r="0" g="0.25" b="0.1" a="1.0"/>
            <emissive r="0.0" g="0.0" b="0.0" a="1.0"/>
        </material>*/

        this.greenMat = new CGFappearance(this.scene);
        this.greenMat.setShininess(5.0);
        this.greenMat.setSpecular(0, 0.9, 0.25, 1);
        this.greenMat.setDiffuse(0.15, 3, 0.3, 1);
        this.greenMat.setAmbient(0, 0.25, 0.1, 1);
        this.greenMat.setEmission(0.0, 0.0, 0.0, 1);

        this.orangeMat = new CGFappearance(this.scene);
        this.orangeMat.setShininess(5.0);
        this.orangeMat.setSpecular(0.7, 0.5, 0, 1);
        this.orangeMat.setDiffuse(0.25, 0.2, 0, 1);
        this.orangeMat.setAmbient(0.2, 0.15, 0, 1);
        this.orangeMat.setEmission(0, 0, 0, 1);

        this.purpleMat = new CGFappearance(this.scene);
        this.purpleMat.setShininess(5.0);
        this.purpleMat.setSpecular(0, 0.35, 0.8, 1);
        this.purpleMat.setDiffuse(0.15, 1, 0.3, 1);
        this.purpleMat.setAmbient(0, 0.25, 0.1, 1);
        this.purpleMat.setEmission(0.0, 0.0, 0.0, 1);

        var testPiece1 = new MyPiece(this.scene, "purple");
        var testPiece2 = new MyPiece(this.scene, "green");
        var testPiece3 = new MyPiece(this.scene, "purple");
        this.addPiece(testPiece1, 1, 1);
        this.addPiece(testPiece2, 3, 4);
        this.addPiece(testPiece3, 23, 13);
    }

    create() {
        for(var line = 1; line <= 23; ++line) {
            var startDiag = this.startDiagonals[line - 1];
            for(var col = 1; col <= this.lineLengths[line-1]; ++col) {
                var diagonal = startDiag + col - 1;
                this.tiles[[line, diagonal]] = new MyTile(this.scene, this);
            }
        }
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

    display() {
        this.scene.pushMatrix();

        this.scene.rotate(-Math.PI/2, 1, 0, 0);

        this.scene.translate(-3.5 * this.horShift + this.horShift/2, 11.5 * this.vertShift - this.vertShift/2, 0);

        for(var line = 1; line <= 23; ++line) {
            this.scene.pushMatrix();
            var lineLength = this.lineLengths[line-1];

            this.scene.translate((10 - (lineLength + (lineLength-1)*0.5))/2, -this.vertShift * (line-1), 0);
            var startDiagonal = this.startDiagonals[line-1];

            for(var col = 1; col <= lineLength; ++col) {
                this.scene.pushMatrix();
                this.scene.translate(this.horShift * (col - 1), 0, 0);
                var diagonal = startDiagonal + col - 1;
                this.tiles[[line, diagonal]].display(line, diagonal, this.orangeMat, this.greenMat, this.purpleMat);
                this.scene.popMatrix();
            }
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }
}