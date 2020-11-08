class MySpriteSheet {
    constructor(scene, texture, sizeM, sizeN) {
        this.scene = scene;
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.shader = new CGFshader(this.scene.gl, 'scenes/shaders/texture2.vert', 'scenes/shaders/texture2.frag');
        this.shader.setUniformsValues({M: this.sizeM});
        this.shader.setUniformsValues({N: this.sizeN});
    }

    activateCellMN(m, n) {
        this.shader.setUniformsValues({m: m});
        this.shader.setUniformsValues({n: n});
    }

    activateCellP(p) {
        var m = p % this.sizeM;
        var n = Math.floor(p / this.sizeM);
        this.activateCellMN(m, n);
    }
}