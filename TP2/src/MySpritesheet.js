class MySpriteSheet {
    constructor(texture, sizeM, sizeN) {
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;
    }

    activateCellMN(m, n) {
        
    }

    activateCellP(p) {
        var m = p % this.sizeM;
        var n = p / this.sizeM;
        this.activateCellMN(m, n);
    }
}