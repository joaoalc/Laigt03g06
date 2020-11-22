class KeyframeAnimation extends Animation {
    /**
	 * KeyframeAnimation
	 * @constructor
	 * @param instant - Reference to MyScene object
	 * @param translation - 3 element array containing the x, y and z components of this keyframe's translation
	 * @param rotation - 3 element array containing the x, y and z components of this keyframe's rotation
	 * @param scale - 3 element array containing the x, y and z components of this keyframe's scale
	 * @param next - Reference to the next keyframe in the animation, it's value is assigned in the setNext function, not in the constructor
	 */
    constructor(scene, id, keyframes){
        super(keyframes[0], keyframes[1]);
        this.id = id;
        this.scene = scene;
        this.keyframes = keyframes; //Keyframes is an array of Keyframe objects sorted by their instant in ascending order
        
        this.currentKeyframeIndex = null;
        this.nextKeyframeIndex = null;

        this.matrix = mat4.create();

        this.started = false;
        this.finished = false;

        this.firstTime = -1;
    }

    apply() {
        this.scene.multMatrix(this.matrix);
    }

    checkVisibility() { //Returns true if it's visible
        return this.started;
    }

    update(time){ 
        //set first time this is executed
        if(this.firstTime == -1 && this.initial == this.keyframes[0])
            this.firstTime = time;

        time -= this.firstTime; //current time

        if(this.initial.instant > time) { // first keyframe hasnt been reached yet - no display
            return;
        } else this.started = true;

        var aux = false;
        while(!aux) { //check if there are skipped keyframes and update current and next keyframes if necessary
            if(this.end == null) {
                this.finished = true;
                break;
            } else if(this.end.instant < time) {
                this.initial = this.end;
                this.end = this.end.next;
            } else aux = true;
        }

        if(this.finished)
            this.interpolate(this.initial, this.initial, 1);
        else {
            // elapsed - 0(no segment time elapsed) to 1(segment complete)
            var elapsed = (time - this.initial.instant)/(this.end.instant - this.initial.instant);
            this.interpolate(this.initial, this.end, elapsed);
        }
    }

    interpolate(startKey, endKey, elapsed) {
        this.matrix = mat4.create();

        //Interpoltate transformations and multiply to matrix
        var translationX = startKey.translation[1] * (1-elapsed) + endKey.translation[1] * elapsed;
        var translationY = startKey.translation[2] * (1-elapsed) + endKey.translation[2] * elapsed;
        var translationZ = startKey.translation[3] * (1-elapsed) + endKey.translation[3] * elapsed;

        mat4.translate(this.matrix, this.matrix, [translationX, translationY, translationZ]);


        var rotationX = startKey.rotationX * (1-elapsed) + endKey.rotationX * elapsed;
        var rotationY = startKey.rotationY * (1-elapsed) + endKey.rotationY * elapsed;
        var rotationZ = startKey.rotationZ * (1-elapsed) + endKey.rotationZ * elapsed;

        mat4.rotate(this.matrix, this.matrix, DEGREE_TO_RAD * rotationX, [1,0,0]);
        mat4.rotate(this.matrix, this.matrix, DEGREE_TO_RAD * rotationY, [0,1,0]);
        mat4.rotate(this.matrix, this.matrix, DEGREE_TO_RAD * rotationZ, [0,0,1]);


        var scaleX = startKey.scale[1] * (1-elapsed) + endKey.scale[1] * elapsed;
        var scaleY = startKey.scale[2] * (1-elapsed) + endKey.scale[2] * elapsed;
        var scaleZ = startKey.scale[3] * (1-elapsed) + endKey.scale[3] * elapsed;

        mat4.scale(this.matrix, this.matrix, [scaleX, scaleY, scaleZ]);
    }
    
}