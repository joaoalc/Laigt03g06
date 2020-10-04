class MyTorus extends CGFobject { //This torus starts to be drawn in the inner loop in the x axis. Then it goes counter-clockwise through every slice. It draws each slice individually before moving on to next. Drawing loops is also counter clockwise.
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {integer} slices - number of slices around Z axis
     * @param  {integer} loops - number of loops on Z axis
     */
    constructor(scene, innerRadius, outerRadius, slices, loops) {
        super(scene);
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes the torus buffers
     * TODO: DEFINE TEXTURE COORDINATES
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var xPos; //Posição x do vértice a ser adicionado
        var yPos; //Posição y do vértice a ser adicionado
        var zPos; //Posição z do vértice a ser adicionado

        var phiLoop = 0; //ângulo atual da stack que se está a desenhar

        var phiSli = 0; //ângulo atual da slice que se está a desenhar
        

        var phiSliInc = (Math.PI * 2) / this.slices; //Incremento do angulo a ser adicionado a cada slice que se desenha e reset no início de cada stack
        var phiLoopInc = (Math.PI * 2) / this.loops;

        for(let lo = 0; lo <= this.loops; lo++){
            if(lo == this.loops){
                phiLoop = 0;//To make 125% sure floating point errors with phiLoop don't affect the texture placement
            }
            for(let sl = 0; sl <= this.slices; sl++){
                if(sl == this.slices){
                    phiSli = 0; //To make 125% sure floating point errors with phiSli don't affect the texture placement
                }
                xPos = (this.outerRadius - (this.innerRadius * Math.cos(phiLoop))) * Math.cos(phiSli);
                yPos = (this.outerRadius - (this.innerRadius * Math.cos(phiLoop))) * Math.sin(phiSli);
                zPos = -Math.sin(phiLoop) * this.innerRadius;

                this.vertices.push(xPos, yPos, zPos);
                var normalLength = Math.sqrt((-Math.cos(phiLoop) * Math.cos(phiSli)) * (-Math.cos(phiLoop) * Math.cos(phiSli)) + (-Math.cos(phiLoop) * Math.sin(phiSli)) * (-Math.cos(phiLoop) * Math.sin(phiSli)) +  (-Math.sin(phiLoop)) * (-Math.sin(phiLoop)));
                this.normals.push(-Math.cos(phiLoop) * Math.cos(phiSli) / normalLength, -Math.cos(phiLoop) * Math.sin(phiSli) / normalLength, -Math.sin(phiLoop) / normalLength);
                this.texCoords.push(sl / this.slices, lo / this.loops);
                phiSli += phiSliInc;
            }
            phiSli = 0;
            phiLoop += phiLoopInc;
        }
        phiLoop = 0;


        for(let lo = 0; lo < this.loops; lo++){
            for(let sl = 0; sl < this.slices; sl++){
                this.indices.push(lo * (this.slices + 1) + sl, lo * (this.slices + 1) +  sl + 1, lo * (this.slices + 1) +  sl + this.slices + 1);
                this.indices.push(lo * (this.slices + 1) + sl + 1, lo * (this.slices + 1) +  sl + this.slices + 2, lo * (this.slices + 1) +  sl + this.slices + 1);
            }
        }   


        /* //Código de cilindro
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
        */
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers() {

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}