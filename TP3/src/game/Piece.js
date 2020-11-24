class Piece extends CGFobject {
    constructor(colour) {
        this.colour = colour;
        this.tile = null;
    }

    getTile() {
        return this.tile;
    }

    setTile(tile) {
        this.tile = tile;
    }

    display() {
        
    }
}