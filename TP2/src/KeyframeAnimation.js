class KeyframeAnimation extends Animation{
    constructor(id, keyframes){
        this.id = id;
        this.keyframes = keyframes; //Keyframes is an array of Keyframe objects sorted by their instant in ascending order
        
        this.currentKeyframeIndex = null;
        this.nextKeyframeIndex = null;

        this.matrix = mat4.create();
        this.finished = false;
    }

    apply(scene) {
        scene.multMatrix(this.matrix);
    }

    checkVisibility(){ //Returns true if it's visible
        return this.currentKeyframeIndex != null;
    }

    update(time){ //Returns the index of the next keyframe. Returns null when there isn't a next keyframe
        
        if(this.currentKeyframeIndex == null){ //First time this function is being called
            var i = 0;
            for(i; i < this.keyframes.length; i++){
                if(this.keyframes[i].instant >= time){
                    this.nextKeyframeIndex = i;
                    if(this.nextKeyframeIndex != 0){
                        this.currentKeyframeIndex = this.nextKeyframeIndex - 1;
                    }
                }
            }
            this.nextKeyframeIndex = null;
        }
        else if(this.nextKeyframeIndex == null){ //This animation has reached the end.
            if(this.currentKeyframeIndex != this.keyframes.length - 1){
                console.log("There isn't a next keyframe but the current keyframe isn't the last keyframe. This isn't supposed to happen!!!!!!!!!!!!!");
            }
        }
        else{
            if(time >= this.keyframes[this.nextKeyframeIndex].instant){
                this.currentKeyframeIndex++;
                if(this.keyframes.length > this.nextKeyframeIndex + 1){ //If the animation has just ended
                    this.nextKeyframeIndex = null;
                }
                else { 
                    this.nextKeyframeIndex++;
                }
            }
        }

        if(this.currentKeyframeIndex != null && this.nextKeyframeIndex != null) {
            
            var startKey = this.keyframes[this.currentKeyframeIndex];
            var endKey = this.keyframes[this.nextKeyframeIndex];

            var deltaT = time - endKey.instant;
            var elapsed = deltaT/(endKey.instant - startKey.instant); // 0(no segment time elapsed) to 1(segment complete)

            this.interpolate(startKey, endKey, elapsed);

        } else if(this.currentKeyframeIndex != null && this.nextKeyframeIndex == null && !finished) { // finish animation

            var startKey = this.keyframes[this.currentKeyframeIndex];
            this.interpolate(startKey, startKey, 1);
            this.finished = true;
        }
    }

    interpolate(startKey, endKey, elapsed) {
         // 0(no segment time elapsed) to 1(segment complete)

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