/*
These cameras are extensions of the regular cameras defined in the CGF library. By saving their starting values to different variables, we are able to effectively reset a camera's position to it's initial position.
The resetCamera function is called whenever a camera is changed and resets the position of the camera to it's default starting position.

Otherwise, they are exactly like CGFcamera and CGFcameraOrtho, the classes they extend, respectively.
*/



class CameraInterpolator{

    constructor(startPos, endPos, startTarget, endTarget, startNear, endNear, startFar, endFar, startAngle, endAngle, startUp, endUp, duration){
        this.startPos = startPos;
        this.endPos = endPos;
        this.startTarget = startTarget;
        this.endTarget = endTarget;
        this.startNear = startNear;
        this.endNear = endNear;
        this.startFar = startFar;
        this.endFar = endFar;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.startUp = startUp;
        this.endUp = endUp;
        this.duration = duration * 1000;
        this.firstTime = -1;
        this.ended = false;
        this.easingProgress = 0;
    }

    isOver(time){
        let returnVal = false;

        if(this.firstTime == -1 || this.firstTime == time){
            this.firstTime = time;
            returnVal = false;
        }
        if(time >= this.firstTime + this.duration){
            this.ended = true;
            returnVal = true;
        }
        else returnVal = false;
        
        let easingProgress = (time - this.firstTime) / this.duration;
        this.easingProgress = this.easingFunction(easingProgress);
        return returnVal;
    }

    getInterpolatedPos(time){
        if(this.firstTime == -1 || this.firstTime == time){
            this.firstTime = time;
            return this.startPos;
        }
        else if(time < this.firstTime + this.duration){
            let arr = [0, 0, 0];
            for(let i = 0; i < 3; i++){
                arr[i] = this.startPos[i] + (this.endPos[i] - this.startPos[i]) * this.easingProgress;//(time - this.firstTime) / this.duration;
            }
            return arr;
        }
        else{
            return this.endPos;
        }
    }

    getInterpolatedNear(time){
        if(this.firstTime == -1 || this.firstTime == time){
            this.firstTime = time;
            return this.startNear;
        }
        else if(time < this.firstTime + this.duration){
            return this.startNear + (this.endNear - this.startNear) * this.easingProgress;//* (time - this.firstTime) / this.duration;
        }
        else{
            return this.endNear;
        }
    }

    getInterpolatedFar(time){
        if(this.firstTime == -1 || this.firstTime == time){
            this.firstTime = time;
            return this.startFar;
        }
        else if(time < this.firstTime + this.duration){
            return this.startFar + (this.endFar - this.startFar) * this.easingProgress;//* (time - this.firstTime) / this.duration;
        }
        else{
            return this.endFar;
        }
    }

    getInterpolatedAngle(time){
        if(this.firstTime == -1 || this.firstTime == time){
            this.firstTime = time;
            return this.startAngle;
        }
        else if(time < this.firstTime + this.duration){
            return this.startAngle + (this.endAngle - this.startAngle) * this.easingProgress;//* (time - this.firstTime) / this.duration;
        }
        else{
            return this.endAngle;
        }
    }

    getInterpolatedUp(time){
        if(this.firstTime == -1 || this.firstTime == time){
            this.firstTime = time;
            return this.startUp;
        }
        else if(time < this.firstTime + this.duration){
            let arr = [0, 0, 0];
            for(let i = 0; i < 3; i++){
                arr[i] = this.startUp[i] + (this.endUp[i] - this.startUp[i]) * this.easingProgress;//* (time - this.firstTime) / this.duration;
            }
            return arr;
        }
        else{
            return this.endUp;
        }
    }

    getInterpolatedTarget(time){
        if(this.firstTime == -1 || this.firstTime == time){
            this.firstTime = time;
            return this.startTarget;
        }
        else if(time < this.firstTime + this.duration){
            let arr = [0, 0, 0];
            for(let i = 0; i < 3; i++){
                arr[i] = this.startTarget[i] + (this.endTarget[i] - this.startTarget[i]) * this.easingProgress;//* (time - this.firstTime) / this.duration;
            }
            return arr;
        }
        else{
            return this.endTarget;
        }
    }

    easingFunction(x){
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }

}

class CGFcameraResettable extends CGFcamera{
    constructor(t, e, i, r, n) {
        super(t, e, i, r, n);


        this.originalFov = t;
        this.originalNear = e;
        this.originalFar = i;
        this.originalR = r;
        this.originalN = n;
    }

    updateCam(position, target, near, far, angle, up){
        this.near = near;
        this.far = far;
        this.fov = angle;
        this._up = up;
        this.position = vec4.fromValues(position[0], position[1], position[2], 0);
        this.target = vec4.fromValues(target[0], target[1], target[2], 0);
        this.direction = this.calculateDirection();
    }

    resetCamera(){
        this.fov = this.originalFov;
        this.near = this.originalNear;
        this.far = this.originalFar;
        this.r = this.originalR;
        this.n = this.originalN;

        this.position = vec4.fromValues(this.originalR[0], this.originalR[1], this.originalR[2], 0);
        this.target = vec4.fromValues(this.originalN[0], this.originalN[1], this.originalN[2], 0);
        this.direction = this.calculateDirection();
        this._up = vec3.fromValues(0, 1, 0);
        this._viewMatrix = mat4.create();
        this._projectionMatrix = mat4.create()
    }
}

class CGFcameraOrthoResettable extends CGFcameraOrtho{
    constructor(t, e, i, r, n, s, o, a, c) {
        super(t, e, i, r, n, s, o, a, c);
        this.originalLeft = t;
        this.originalRight = e;
        this.originalBottom = i;
        this.originalTop = r;
        this.originalNear = n;
        this.originalFar = s;
        this.originalO = o;
        this.originalA = a;
        this.originalC = c;
    }

    updateCamera(){ //TODO: Testing function, user resetCamera instead
        this.position = vec4.fromValues(this.originalO[0], this.originalO[1], this.originalO[2], 0);
        this.target = vec4.fromValues(this.originalA[0], this.originalA[1], this.originalA[2], 0);
        this.direction = this.calculateDirection();
    }

    resetCamera(){

        this.left = this.originalLeft;
        this.right = this.originalRight;
        this.bottom = this.originalBottom;
        this.top = this.originalTop;
        this.near = this.originalNear;
        this.far = this.originalFar;
        this.position = vec4.fromValues(this.originalO[0], this.originalO[1], this.originalO[2], 0);
        this.target = vec4.fromValues(this.originalA[0], this.originalA[1], this.originalA[2], 0);
        this.direction = this.calculateDirection();
        this._up = this.originalC;
        this._viewMatrix = mat4.create();
        this._projectionMatrix = mat4.create()
    }
}