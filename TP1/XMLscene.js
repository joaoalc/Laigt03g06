/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;


        this.activeCamera = 0;
        
        this.cameraIds = {};

        this.initCameras();


        this.enableTextures(true);


        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);



        this.initObjects();


        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1, 1, 1);
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this);
        

    }

    initMaterials(){
        this.materials = [];

        for(var key in this.graph.materials) {
            var info = this.graph.materials[key];
        
            var mat = new CGFappearance(this);
            mat.setShininess(info[0]);
            mat.setSpecular(info[1][0], info[1][1], info[1][2]);
            mat.setDiffuse(info[2][0], info[2][1], info[2][2]);
            mat.setAmbient(info[3][0], info[3][1], info[3][2]);
            mat.setEmission(info[4][0], info[4][1], info[4][2]);

            this.materials[key] = mat;
        }
    }

    initTextures(){
        this.textures = [];

        
        for(var key in this.graph.textures){
            var info = this.graph.textures[key];
            console.log(info);
            var tex = new CGFtexture(this, info);
            this.textures[key] = tex;
        }

        //this.testTexture = new CGFtexture(this, 'scenes/images/Archer_96x96_upscaled_8x.png');
    }

    /*Initializes the objects in the scene*/
    initObjects() {
        //this.testCylinder = new MyCylinder(this, 2, 2, 4, 16, 8);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        var i = 0;
        this.cameras = [];
        if(this.sceneInited) {
            for(var key in this.graph.views) {
                var info = this.graph.views[key];
                
                if(info[0] == "p") {
                    this.cameras[key] = new CGFcamera(info[1],info[2],info[3],vec3.fromValues(info[4][0],info[4][1],info[4][2]),
                                        vec3.fromValues(info[5][0],info[5][1],info[5][2]));
                } else {
                    this.cameras[key] = new CGFcameraOrtho(info[1],info[2],info[3],info[4],info[5],info[6],
                                        vec3.fromValues(info[7][0],info[7][1],info[7][2]),
                                        vec3.fromValues(info[8][0],info[8][1],info[8][2]),
                                        vec3.fromValues(info[9][0],info[9][1],info[9][2]));
                }

                if (key == this.graph.defaultView) {
                    this.activeCamera = key;
                    this.camera = this.cameras[key];
                    this.interface.setActiveCamera(this.camera);
                }
                this.cameraIds[key] = i; //adding a numeric value
                console.log(Object.keys(this.cameraIds).length);
                i++;
            }
        } else {
            this.camera = new CGFcameraResettable(0.4, 0.1, 500, vec3.fromValues(20, 10, 20), vec3.fromValues(0, 0, 0));
        }
    }

    updateCamera() {
        //console.log(Object.keys(this.cameras).length);
        //console.log(object.keys(this.cameras)[this.activeCamera]);
        //console.log(Object.keys(this.cameras)[1]);
        

        this.camera = this.cameras[Object.keys(this.cameras)[this.activeCamera]];
        
        console.log(this.camera != null);
        //this.camera.resetCamera();
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    updateLights() {
        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(false);
            this.lights[i].update();
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();
        this.initMaterials();
        this.initTextures();
        
        this.sceneInited = true;
        this.initCameras();
        this.interface.addGUIelement();
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();
 
            this.defaultAppearance.apply();
            
            this.updateLights();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();

        }
        else
        {
            
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}