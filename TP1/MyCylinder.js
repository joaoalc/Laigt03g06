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

        var vertex = 0; //Counts the number of original vertexes (doesnt count the adicional vertexes for the stacks or slices for texture purposes)
        var xCoord = 0.0;

        var phi2 = 0; //Current angle for the adicional vertexes;
        for (let sl = 0; sl < this.slices; sl++) {
            var sinPhi = Math.sin(phi2);
            var cosPhi = Math.cos(phi2);
            var x = cosPhi * (this.bottomRadius); //x começa fazer o circulo inferior (com raio bottom radius) e depois começa a subir a cada stack (até ter raio top radius).
            var y = sinPhi * (this.bottomRadius); //O mesmo para o y
            this.vertices.push(x, y, (this.height/this.stacks)*0);
            this.texCoords.push(cosPhi * 0.5 + 0.5, sinPhi * 0.5 + 0.5);
            //console.log("SL: " + sl);
            //console.log(this.vertices[3 * sl], this.vertices[1 + 3 * sl], this.vertices[2 + 3 * sl]);
            var normalX = cosPhi;
            var normalY = sinPhi;
            var normalZ = (this.bottomRadius - this.topRadius)/this.height;
            var normalLength = Math.sqrt(normalX*normalX + normalY*normalY + normalZ*normalZ);
            //this.normals.push(normalX/normalLength, normalY/normalLength, normalZ/normalLength);
            this.normals.push(0, 0, -1);
            phi2 += phiInc;
        }
        phi = 0;
        for(let st = 0; st <= this.stacks; st++) {
            for (let sl = 0; sl < this.slices; sl++) {
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);
                var x = cosPhi * (this.bottomRadius - st * sideIncrement); //x começa fazer o circulo inferior (com raio bottom radius) e depois começa a subir a cada stack (até ter raio top radius).
                var y = sinPhi * (this.bottomRadius - st * sideIncrement); //O mesmo para o y
                //console.log("A");
                this.vertices.push(x, y, (this.height/this.stacks)*st);
                this.texCoords.push(sl / this.slices, st / this.stacks);
                //this.texCoords.push(xCoord, 1);
                //this.texCoords.push(xCoord, 0);

                if(st < this.stacks) {
                    if(sl < (this.slices - 1)) {
                        this.indices.push(this.slices + vertex,this.slices +  vertex + 1,this.slices +  vertex + this.slices + 1);
                        this.indices.push(this.slices + vertex,this.slices +  vertex + this.slices + 1,this.slices +  vertex + this.slices);
                    } else {
                        this.indices.push(this.slices + vertex,this.slices +  vertex - this.slices + 1,this.slices +  vertex + 1);
                        this.indices.push(this.slices + vertex,this.slices +  vertex + 1,this.slices +  vertex + this.slices );
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

        
        phi2 = 0;
        for (let sl = 0; sl < this.slices; sl++) {
            var sinPhi = Math.sin(phi2);
            var cosPhi = Math.cos(phi2);
            var x = cosPhi * (this.bottomRadius - this.stacks * sideIncrement); //x começa fazer o circulo inferior (com raio bottom radius) e depois começa a subir a cada stack (até ter raio top radius).
            var y = sinPhi * (this.bottomRadius - this.stacks * sideIncrement); //O mesmo para o y
            this.vertices.push(x, y, (this.height/this.stacks)*this.stacks);
            this.texCoords.push(cosPhi * 0.5 + 0.5, sinPhi * 0.5 + 0.5);
            var normalX = cosPhi;
            var normalY = sinPhi;
            var normalZ = (this.bottomRadius - this.topRadius)/this.height;
            var normalLength = Math.sqrt(normalX*normalX + normalY*normalY + normalZ*normalZ);
            //this.normals.push(normalX/normalLength, normalY/normalLength, normalZ/normalLength);
            this.normals.push(0, 0, 1);
            phi2 += phiInc;
        }

        this.vertices.push(0,0,0);
        this.vertices.push(0,0,this.height);
        this.texCoords.push(0.5, 0.5);
        this.texCoords.push(0.5, 0.5);
        this.normals.push(0,0,-1);
        this.normals.push(0,0,1);
        vertex += 2;

        for(var sl = 0; sl < this.slices; sl++) {
            if(sl < this.slices - 1) {
                this.indices.push(sl, this.slices * 2 + vertex - 2, sl + 1);
                this.indices.push(this.slices * 2 + sl + this.stacks*this.slices,this.slices * 2 +  sl + 1 + this.stacks*this.slices, vertex - 1);
            } else {
                this.indices.push(sl, this.slices * 2 + vertex - 2, sl - this.slices + 1);
                this.indices.push(this.slices * 2 + sl + this.stacks*this.slices,this.slices * 2 +  this.stacks*this.slices, vertex - 1);
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