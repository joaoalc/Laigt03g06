class MyTorus extends CGFobject { //This torus starts to be drawn in the inner loop in the x axis. Then it goes counter-clockwise through every slice. It draws each slice individually before moving on to next. Drawing loops is also counter clockwise.
    /**
     * MyTorus
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {integer} slices - number of slices around the inner loops
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
        

        var phiSliInc = (Math.PI * 2) / this.loops; //Incremento do angulo a ser adicionado a cada slice que se desenha e reset no início de cada stack
        var phiLoopInc = (Math.PI * 2) / this.slices;

        for(let lo = 0; lo <= this.slices; lo++){
            if(lo == this.slices){
                phiLoop = 0;//To make 125% sure floating point errors with phiLoop don't affect the texture placement
            }
            for(let sl = 0; sl <= this.loops; sl++){
                if(sl == this.loops){
                    phiSli = 0; //To make 125% sure floating point errors with phiSli don't affect the texture placement
                }
                xPos = (this.outerRadius - (this.innerRadius * Math.cos(phiLoop))) * Math.cos(phiSli);
                yPos = (this.outerRadius - (this.innerRadius * Math.cos(phiLoop))) * Math.sin(phiSli);
                zPos = -Math.sin(phiLoop) * this.innerRadius;

                this.vertices.push(xPos, yPos, zPos);
                var normalLength = Math.sqrt((-Math.cos(phiLoop) * Math.cos(phiSli)) * (-Math.cos(phiLoop) * Math.cos(phiSli)) + (-Math.cos(phiLoop) * Math.sin(phiSli)) * (-Math.cos(phiLoop) * Math.sin(phiSli)) +  (-Math.sin(phiLoop)) * (-Math.sin(phiLoop)));
                this.normals.push(-Math.cos(phiLoop) * Math.cos(phiSli) / normalLength, -Math.cos(phiLoop) * Math.sin(phiSli) / normalLength, -Math.sin(phiLoop) / normalLength);
                this.texCoords.push(sl / this.loops, lo / this.slices);
                phiSli += phiSliInc;
            }
            phiSli = 0;
            phiLoop += phiLoopInc;
        }
        phiLoop = 0;


        for(let lo = 0; lo < this.slices; lo++){
            for(let sl = 0; sl < this.loops; sl++){
                this.indices.push(lo * (this.loops + 1) + sl, lo * (this.loops + 1) +  sl + 1, lo * (this.loops + 1) +  sl + this.loops + 1);
                this.indices.push(lo * (this.loops + 1) + sl + 1, lo * (this.loops + 1) +  sl + this.loops + 2, lo * (this.loops + 1) +  sl + this.loops + 1);
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