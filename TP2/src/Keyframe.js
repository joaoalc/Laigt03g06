class Keyframe{
    constructor(instant, translation, rotation, scale) {
        this.instant = instant;
        this.translation = translation;
        this.rotationX = rotation[0];
        this.rotationY = rotation[1];
        this.rotationZ = rotation[2];
        this.scale = scale;
    }
}