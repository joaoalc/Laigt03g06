class MyCylinder extends CGFobject {
    /**
     * MyCylinder
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
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];


        var phi = 0;
        var phiInc = (Math.PI * 2) / this.slices;


        for(let st = 0; st <= this.stacks; st++){
            for(let sl = 0; sl <= this.slices; sl++){
                //var cosPhi = Math.cos(phi);
                //var sinPhi = Math.sin(phi);

                this.vertices.push((this.bottomRadius - (this.bottomRadius - this.topRadius) * (st /this.stacks)) * Math.cos(phi), (this.bottomRadius - (this.bottomRadius - this.topRadius) * (st /this.stacks)) * Math.sin(phi), this.height * st / this.stacks);
                this.texCoords.push(sl / this.slices, 1 - (st / this.stacks));
                var normalSize = Math.sqrt(Math.pow(Math.cos(phi), 2) + Math.pow(Math.sin(phi), 2) + Math.pow((this.bottomRadius - this.topRadius) / this.height, 2));
               
                
                this.normals.push(Math.cos(phi) /  normalSize, Math.sin(phi) / normalSize, ((this.bottomRadius - this.topRadius) / this.height) / normalSize);
                phi += phiInc;
            }
            phi = 0;
        }
        for(let st = 0; st < this.stacks; st++){
            for(let sl = 0; sl < this.slices; sl++){
                this.indices.push((st * (this.slices + 1)) + sl, (st * (this.slices + 1)) +  sl + 1, (st * (this.slices + 1)) +  sl + this.slices + 1);
                this.indices.push((st * (this.slices + 1)) + sl + 1, (st * (this.slices + 1)) +  sl + this.slices + 2, (st * (this.slices + 1)) +  sl + this.slices + 1);
            }
        }
        
        phi = 0;
        for(let sl = 0; sl <= this.slices; sl++){
            this.vertices.push(this.bottomRadius * Math.cos(phi), this.bottomRadius * Math.sin(phi), 0);
            this.texCoords.push(Math.cos(phi) * 0.5 + 0.5, -Math.sin(phi) * 0.5 + 0.5);
            this.normals.push(0, 0, -1);
            if(sl < this.slices - 2){
                this.indices.push(((this.slices + 1) * (this.stacks + 1)) + 2 + sl, ((this.slices + 1) * (this.stacks + 1)) + 1 + sl, ((this.slices + 1) * (this.stacks + 1)) + 0);
            }
            phi += phiInc;
        }

        phi = 0;
        for(let sl = 0; sl <= this.slices; sl++){
            this.vertices.push(this.topRadius * Math.cos(phi), this.topRadius * Math.sin(phi), this.height);
            this.texCoords.push(Math.cos(phi) * 0.5 + 0.5, -Math.sin(phi) * 0.5 + 0.5);
            this.normals.push(0, 0, 1);
            if(sl < this.slices - 2){
                this.indices.push(((this.slices + 1) * (this.stacks + 1 + 1)) + 0, ((this.slices + 1) * (this.stacks + 1 + 1)) + 1 + sl, ((this.slices + 1) * (this.stacks + 1 + 1)) + 2 + sl);
            }
            phi += phiInc;
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