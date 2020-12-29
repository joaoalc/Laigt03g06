class KeyframeLoopAnimation extends KeyframeAnimation {
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
        super(scene, id, keyframes);
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
                this.initial = this.keyframes[0];
                this.end = this.initial.next;
                this.firstTime = -1;
                return;
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
}