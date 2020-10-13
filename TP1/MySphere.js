class MySphere extends CGFobject {
    /**
     * @method constructor
     * @param scene - MyScene object
     * @param radius - radius value
     * @param slices - number of slices around Y axis
     * @param stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
     */
    constructor(scene, radius, slices, stacks) {
      super(scene);
      this.radius = radius;
      this.latDivs = stacks;
      this.longDivs = slices;
  
      this.initBuffers();
    }
  
    /**
     * @method initBuffers
     * Initializes the sphere buffers
     */
    initBuffers() {
      this.vertices = [];
      this.indices = [];
      this.normals = [];
      this.texCoords = [];
  
      var phi = 0;
      var theta = 0;
      var phiInc = Math.PI / this.latDivs;
      var thetaInc = (2 * Math.PI) / this.longDivs;
      var latVertices = this.longDivs + 1;
  
      var xCoord;
      var yCoord = 0.0;
  
      // build an all-around stack at a time, starting on "north pole" and proceeding "south"
      for (let latitude = 0; latitude <= this.latDivs; latitude++) {
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
  
        // in each stack, build all the slices around, starting on longitude 0
        theta = 0;
        xCoord = 0;
        for (let longitude = 0; longitude <= this.longDivs; longitude++) {
          //--- Vertices coordinates
          var x = Math.cos(theta) * sinPhi * this.radius;
          var z = cosPhi * this.radius;
          var y = Math.sin(-theta) * sinPhi * this.radius;
          this.vertices.push(x, y, z);
  
          //--- Indices
          if (latitude < this.latDivs && longitude < this.longDivs) {
            var current = latitude * latVertices + longitude;
            var next = current + latVertices;
            
            this.indices.push( current + 1, next, current);
            this.indices.push( current + 1, next + 1, next);
          }
  
          //--- Normals

          this.normals.push(x, y, z);
          theta += thetaInc;
  
          //--- Texture Coordinates
  
          this.texCoords.push(xCoord, yCoord);
          xCoord += thetaInc/(2*Math.PI);
          
        }
        phi += phiInc;
        yCoord += (phiInc/(2*Math.PI))*2;
      }
  
  
      this.primitiveType = this.scene.gl.TRIANGLES;
      this.initGLBuffers();
    }
  
    updateBuffers(nSlices){
      this.latDivs = Math.round(nSlices);
      this.longDivs = Math.round(nSlices);
  
      // reinitialize buffers
      this.initBuffers();
      this.initNormalVizBuffers();
    }
  }