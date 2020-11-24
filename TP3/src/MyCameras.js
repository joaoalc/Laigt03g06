/*
These cameras are extensions of the regular cameras defined in the CGF library. By saving their starting values to different variables, we are able to effectively reset a camera's position to it's initial position.
The resetCamera function is called whenever a camera is changed and resets the position of the camera to it's default starting position.

Otherwise, they are exactly like CGFcamera and CGFcameraOrtho, the classes they extend, respectively.
*/

class CGFcameraResettable extends CGFcamera{
    constructor(t, e, i, r, n) {
        super(t, e, i, r, n);


        this.originalFov = t;
        this.originalNear = e;
        this.originalFar = i;
        this.originalR = r;
        this.originalN = n;
    }

    resetCamera(){
        this.fov = this.originalFov;
        this.nera = this.originalNear;
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