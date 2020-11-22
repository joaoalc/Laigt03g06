class Animation {
    /**
	 * Animation
	 * @constructor
	 * @param initial - Reference to the initial keyframe
	 * @param end - Reference to final keyframe
	 */
    constructor(initial, end) {
        if(this.constructor == Animation) {
            throw new Error("Abstract class Animation cannot be instantiated");
        }
        this.initial = initial;
        this.end = end;
    }

    update(time) {
        throw new Error("Abstract method update of Animation class called!");
    }

    apply(scene) {
        throw new Error("Abstract method apply of Animation class called!");
    }
}