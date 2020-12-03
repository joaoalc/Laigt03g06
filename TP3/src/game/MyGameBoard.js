class MyGameBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.tiles = [];
        this.startDiagonals = [1,1,1,1,1,2,2,2,3,3,4,4,5,5,6,6,7,8,8,9,10,11,12];
        this.startLines = [1,1,1,1,1,2,2,2,3,3,4,4,5,5,6,6,7,8,8,9,10,11,12];
        this.lineLengths = [2,3,4,5,6,5,6,7,6,7,6,7,6,7,6,7,6,5,6,5,4,3,2];
        this.horShift = 1.5;
        this.vertShift = Math.sin(Math.PI/3)/2;
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
                this.tiles[[line, diagonal]].display(line, diagonal);
                this.scene.popMatrix();
            }
            this.scene.popMatrix();
        }
        this.scene.popMatrix();
    }
}