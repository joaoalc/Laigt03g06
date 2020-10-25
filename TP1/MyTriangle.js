class MyTriangle extends CGFobject {
	/**
	 * MyTriangle
	 * @constructor
	 * @param scene - Reference to MyScene object
	 * @param x1 - x coordinate corner 1
	 * @param y1 - y coordinate corner 1
	 * @param x2 - x coordinate corner 2
	 * @param y2 - y coordinate corner 2
	 * @param x3 - x coordinate corner 3
	 * @param y3 - y coordinate corner 3
	 * @param afs - afs component for amplification
	 * @param aft - aft component for amplification
	 */
	constructor(scene, x1, y1, x2, y2, x3, y3, afs, aft) {
		super(scene);
		this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
		this.y1 = y1;
        this.y2 = y2;
		this.y3 = y3;
		this.afs = afs;
		this.aft = aft;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
			this.x3, this.y3, 0	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		//Calculating normal direction by vector product
		var normal = [];

		var u1 = [this.x2 - this.x1, this.y2 - this.y1, 0];
		var u2 = [this.x3 - this.x1, this.y3 - this.y1, 0];

		normal.x = (u1[1] * u2[2]) - (u1[2] * u2[1]);
		normal.y = (u1[2] * u2[0]) - (u1[0] * u2[2]);
		normal.z = (u1[0] * u2[1]) - (u1[1] * u2[0]);


		var normal_length = Math.sqrt(Math.pow(normal.x, 2) + Math.pow(normal.y, 2) + Math.pow(normal.z, 2));
		normal.x /= normal_length;
		normal.y /= normal_length;
		normal.z /= normal_length;

		//Facing Z positive
		this.normals = [
			normal.x, normal.y, normal.z,
			normal.x, normal.y, normal.z,
			normal.x, normal.y, normal.z
		];
		

        var a = Math.sqrt(Math.pow(this.x2-this.x1, 2) + Math.pow(this.y2-this.y1, 2));
        var b = Math.sqrt(Math.pow(this.x3-this.x2, 2) + Math.pow(this.y3-this.y2, 2));
        var c = Math.sqrt(Math.pow(this.x1-this.x3, 2) + Math.pow(this.y1-this.y3, 2));

        var cosA = (a*a - b*b + c*c)/(2.0*a*c);

		this.texCoords = [
			0, 0,
            a / this.afs, 0,
            c*cosA / this.afs, -c*(Math.sqrt(1.0-cosA*cosA)) / this.aft
		]

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

