class MyCylinder extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {integer} slices - number of slices around Z axis
     * @param  {integer} stacks - number of stacks on Z axis
     */
    constructor(scene, height, bottomRadius, topRadius, slices, stacks) {
        super(scene);
        this.height = height;
        this.bottomRadius = bottomRadius;
        this.topRadius = topRadius;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes the cylinder buffers
     * TODO: DEFINE TEXTURE COORDINATES
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var phi = 0;

        var phiInc = (Math.PI * 2) / this.slices;

        var sideIncrement = (this.bottomRadius - this.topRadius)/this.stacks;

        var vertex = 0;
        var xCoord = 0.0;
        for(let st = 0; st <= this.stacks; st++) {
            for (let sl = 0; sl < this.slices; sl++) {
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);
                var x = cosPhi * (this.bottomRadius - st * sideIncrement);
                var y = sinPhi * (this.bottomRadius - st * sideIncrement);

                this.vertices.push(x, y, (this.height/this.stacks)*st);

                //this.texCoords.push(xCoord, 1);
                //this.texCoords.push(xCoord, 0);

                if(st < this.stacks) {
                    if(sl < (this.slices - 1)) {
                        this.indices.push(vertex, vertex + 1, vertex + this.slices + 1);
                        this.indices.push(vertex, vertex + this.slices + 1, vertex + this.slices);
                    } else {
                        this.indices.push(vertex, vertex - this.slices + 1, vertex + 1);
                        this.indices.push(vertex, vertex + 1, vertex + this.slices );
                    }
                }
                
                var normalX = cosPhi;
                var normalY = sinPhi;
                var normalZ = (this.bottomRadius - this.topRadius)/this.height;
                var normalLength = Math.sqrt(normalX*normalX + normalY*normalY + normalZ*normalZ);

                this.normals.push(normalX/normalLength, normalY/normalLength, normalZ/normalLength);
                
                phi += phiInc;
                xCoord += phiInc / (2 * Math.PI);
                vertex++;
            }
            phi = 0;
        }

        this.vertices.push(0,0,0);
        this.vertices.push(0,0,this.height);
        this.normals.push(0,0,-1);
        this.normals.push(0,0,1);
        vertex += 2;

        for(var sl = 0; sl < this.slices; sl++) {
            if(sl < this.slices - 1) {
                this.indices.push(sl, vertex - 2, sl + 1);
                this.indices.push(sl + this.stacks*this.slices, sl + 1 + this.stacks*this.slices, vertex - 1);
            } else {
                this.indices.push(sl, vertex - 2, sl - this.slices + 1);
                this.indices.push(sl + this.stacks*this.slices, this.stacks*this.slices, vertex - 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers() {

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}