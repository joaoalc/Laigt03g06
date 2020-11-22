class Keyframe{
    /**
	 * Keyframe
	 * @constructor
	 * @param instant - Instant in time, in seconds, where this keyframe is the "correct" frame in animation. The animation is interpolated between multiple keyframes.
	 * @param translation - 3 element array containing the x, y and z components of this keyframe's translation
	 * @param rotation - 3 element array containing the x, y and z components of this keyframe's rotation
	 * @param scale - 3 element array containing the x, y and z components of this keyframe's scale
	 * @param next - Reference to the next keyframe in the animation, it's value is assigned in the setNext function, not in the constructor
	 */
    constructor(instant, translation, rotation, scale, next) {
        console.log(instant);
        this.instant = instant;
        this.translation = translation;
        this.rotationX = rotation[0];
        this.rotationY = rotation[1];
        this.rotationZ = rotation[2];
        this.scale = scale;
        this.next = null;
    }

    setNext(nextKeyframe) {
        this.next = nextKeyframe;
    }
}