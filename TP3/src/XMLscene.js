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
        this.n = 0;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.appearance = new CGFappearance(this.scene);

        this.sceneInited = false;

        //Currently active camera's numeric ID
        this.activeCamera = 0;
        
        //Cameras numeric IDs
        this.cameraIds = {};

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.displayAxis = false;
        this.displayNormals = false;
        this.displayNormals_before = false;

        this.setUpdatePeriod(10);

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1, 1, 1);
        this.loadingProgress=0;

        this.defaultAppearance=new CGFappearance(this); 

        this.setPickEnabled(true);

        this.cameraAnimation = null;

        this.gameboardPos = [0,0,0]; //GAMEBOARD POSITION
        this.gameOrchestrator = new MyGameOrchestrator(this, this.gameboardPos);
    }

    initMaterials(){
        this.materials = [];

        for(var key in this.sceneGraphs[this.activeScene].materials) {
            var info = this.sceneGraphs[this.activeScene].materials[key];
        
            var mat = new CGFappearance(this);
            mat.setShininess(info[0]);
            mat.setSpecular(info[1][0], info[1][1], info[1][2], 1);
            mat.setDiffuse(info[2][0], info[2][1], info[2][2], 1);
            mat.setAmbient(info[3][0], info[3][1], info[3][2], 1);
            mat.setEmission(info[4][0], info[4][1], info[4][2], 1);

            this.materials[key] = mat;
        }
    }

    initTextures(){
        this.textures = [];

        
        for(var key in this.sceneGraphs[this.activeScene].textures){
            var info = this.sceneGraphs[this.activeScene].textures[key];
            if(info != 0) {
                var tex = new CGFtexture(this, info);
                this.textures[key] = tex;
            }
        }
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        var i = 0;
        this.cameras = [];
        if(this.sceneInited) {
            for(var key in this.sceneGraphs[this.activeScene].views) {
                var info = this.sceneGraphs[this.activeScene].views[key];
                
                if(info[0] == "p") {
                    this.cameras[key] = new CGFcameraResettable(info[1],info[2],info[3],vec3.fromValues(info[4][0],info[4][1],info[4][2]),
                                        vec3.fromValues(info[5][0],info[5][1],info[5][2]));
                } else {
                    this.cameras[key] = new CGFcameraOrthoResettable(info[1],info[2],info[3],info[4],info[5],info[6],
                                        vec3.fromValues(info[7][0],info[7][1],info[7][2]),
                                        vec3.fromValues(info[8][0],info[8][1],info[8][2]),
                                        vec3.fromValues(info[9][0],info[9][1],info[9][2]));
                }

                if (key == this.sceneGraphs[this.activeScene].defaultView) {
                    this.activeCamera = key;
                    this.camera = this.cameras[key];
                    this.interface.setActiveCamera(this.camera);
                }
                this.cameraIds[key] = i; //adding a numeric value
                i++;
            }
        } else {
            this.camera = new CGFcameraResettable(0.4, 0.1, 500, vec3.fromValues(20, 10, 20), vec3.fromValues(0, 0, 0));
        }
    }

    /**
     * Updated the currently active camera. Also resets it's attributes to the ones set to at the beggining.
     */
    updateCamera() {
        if(this.n != -1){
        let startCamPos = [this.camera.position[0], this.camera.position[1], this.camera.position[2]];
        let startCamTarget = [this.camera.target[0], this.camera.target[1], this.camera.target[2]];
        let startCamUp = [this.camera._up[0], this.camera._up[1], this.camera._up[2]];
        let startCamAngle = this.camera.fov;
        let startCamFar = this.camera.far;
        let startCamNear = this.camera.near;
        
        this.nextCamera = this.cameras[Object.keys(this.cameras)[this.activeCamera]];
        this.nextCamera.resetCamera();
        this.interface.setActiveCamera(this.camera);
        let endCamPos = [this.nextCamera.position[0], this.nextCamera.position[1], this.nextCamera.position[2]];
        let endCamTarget = [this.nextCamera.target[0], this.nextCamera.target[1], this.nextCamera.target[2]];
        let endCamNear = this.nextCamera.near;
        let endCamFar = this.nextCamera.far;
        let endCamAngle = this.nextCamera.fov;
        let endCamUp = [this.nextCamera._up[0], this.nextCamera._up[1], this.nextCamera._up[2]];
        let positionTime =  Math.sqrt(Math.pow(endCamPos[0] - startCamPos[0], 2) + Math.pow(endCamPos[1] - startCamPos[1], 2) + Math.pow(endCamPos[2] - startCamPos[2], 2));
        let targetTime = Math.sqrt(Math.pow(endCamTarget[0] - startCamTarget[0], 2) + Math.pow(endCamTarget[1] - startCamTarget[1], 2) + Math.pow(endCamTarget[2] - startCamTarget[2], 2));
        
        console.log(positionTime);
        console.log(targetTime);
        this.cameraAnimation = new CameraInterpolator(startCamPos, endCamPos, startCamTarget, endCamTarget, startCamNear, endCamNear, startCamFar, endCamFar, startCamAngle, endCamAngle, startCamUp, endCamUp, (positionTime + targetTime) / 25 + 1);
        }
    }

    updateScene(){
        this.n++;
        let n = this.n;
        if(n != 1){
            var startCamPos = [this.camera.position[0], this.camera.position[1], this.camera.position[2]];
            var startCamTarget = [this.camera.target[0], this.camera.target[1], this.camera.target[2]];
            var startCamUp = [this.camera._up[0], this.camera._up[1], this.camera._up[2]];
            var startCamAngle = this.camera.fov;
            var startCamFar = this.camera.far;
            var startCamNear = this.camera.near;
        }
        this.n = -1;
        this.onSceneSelect();
        if(n != 1){
            this.nextCamera = this.cameras[this.activeCamera];
            this.nextCamera.resetCamera();
            this.interface.setActiveCamera(this.camera);
            let endCamPos = [this.nextCamera.position[0], this.nextCamera.position[1], this.nextCamera.position[2]];
            let endCamTarget = [this.nextCamera.target[0], this.nextCamera.target[1], this.nextCamera.target[2]];
            let endCamNear = this.nextCamera.near;
            let endCamFar = this.nextCamera.far;
            let endCamAngle = this.nextCamera.fov;
            let endCamUp = [this.nextCamera._up[0], this.nextCamera._up[1], this.nextCamera._up[2]];
            let positionTime =  Math.sqrt(Math.pow(endCamPos[0] - startCamPos[0], 2) + Math.pow(endCamPos[1] - startCamPos[1], 2) + Math.pow(endCamPos[2] - startCamPos[2], 2));
            let targetTime = Math.sqrt(Math.pow(endCamTarget[0] - startCamTarget[0], 2) + Math.pow(endCamTarget[1] - startCamTarget[1], 2) + Math.pow(endCamTarget[2] - startCamTarget[2], 2));
            console.log(positionTime);
            console.log(targetTime);
            this.cameraAnimation = new CameraInterpolator(startCamPos, endCamPos, startCamTarget, endCamTarget, startCamNear, endCamNear, startCamFar, endCamFar, startCamAngle, endCamAngle, startCamUp, endCamUp, (positionTime + targetTime) / 25 + 1);
            //this.updateCamera();
            //if(this.n != 1){
            //    this.updateCamera();
            //}
        }
        this.interface.addCameraAndLightGUI(this.cameraIds[this.activeCamera]);
        this.n = 1;
    }

    // logPicking() {
	// 	if (this.pickMode == false) {
	// 		if (this.pickResults != null && this.pickResults.length > 0) {
	// 			for (var i = 0; i < this.pickResults.length; i++) {
	// 				var obj = this.pickResults[i][0];
	// 				if (obj) {
    //                     var customId = this.pickResults[i][1];
    //                     if(customId > 100){
	// 					    console.log("Picked tile at line" + Math.floor(customId / 100) + " and column " + customId % 100);						
    //                     }
    //                     else{
    //                         console.log("Picked box with id = " + customId);
    //                     }
    //                 }
	// 			}
	// 			this.pickResults.splice(0, this.pickResults.length);
	// 		}
	// 	}
	// }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {

        // {light : enabled/disabled, ...}
        this.lightsStatus = {};

        // Lights index.
        var i = 0;

        // Reads the lights from the scene graph.
        for (var key in this.sceneGraphs[this.activeScene].lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.sceneGraphs[this.activeScene].lights.hasOwnProperty(key)) {
                var graphLight = this.sceneGraphs[this.activeScene].lights[key];

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

                this.lightsStatus["light" + i] = graphLight[0];

                i++;
            }
        }


    }

    /**
     * Updates all the scene's lights
     */
    updateLights() {
        for (var i = 0; i < this.lights.length; i++) {
            if(this.lightsStatus["light" + i]) {
                this.lights[i].enable();
                this.lights[i].setVisible(false);
            }
            else {
                this.lights[i].disable();
                this.lights[i].setVisible(false);       
            }
            this.lights[i].update();
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.sceneGraphs[this.activeScene].referenceLength); //Only once
        
        this.onSceneSelect();
        
        this.interface.addGUIelements();
        this.interface.addSceneSelector(this.activeScene);
        this.sceneInited = true;
    }

    onSceneSelect() {
        this.cameraIds = {};
        this.sceneInited = false; 
        this.gameOrchestrator.setGameBoardPosition(this.sceneGraphs[this.activeScene].gameboardPos); //Each time
        this.setUpdatePeriod(32);

        this.gl.clearColor(...this.sceneGraphs[this.activeScene].background); //Each time

        this.setGlobalAmbientLight(...this.sceneGraphs[this.activeScene].ambient); //Each time
        
        this.initLights();
        this.initMaterials();
        this.initTextures(); 
        this.sceneInited = true;
        this.initCameras(); 

        
        
        
    }

    update(time) {
        if(this.sceneInited){
            for(var key in this.sceneGraphs[this.activeScene].animations) {
                this.sceneGraphs[this.activeScene].animations[key].update(time/1000);
            }

            for(var i = 0; i <  this.sceneGraphs[this.activeScene].spriteAnimations.length; ++i) {
                this.sceneGraphs[this.activeScene].spriteAnimations[i].update(time/1000);
            }

            this.gameOrchestrator.update(time);

            if(this.cameraAnimation != null){
                let position = this.cameraAnimation.getInterpolatedPos(time);
                let target = this.cameraAnimation.getInterpolatedTarget(time);
                let near = this.cameraAnimation.getInterpolatedNear(time);
                let far = this.cameraAnimation.getInterpolatedFar(time);
                let angle = this.cameraAnimation.getInterpolatedAngle(time);
                let up = this.cameraAnimation.getInterpolatedUp(time);
                if(position != null){
                    if(position != -1){
                        this.camera.updateCam(position, target, near, far, angle, up);
                    }
                    else{
                    }
                }
                else{
                    this.camera = this.nextCamera;
                    this.interface.setActiveCamera(this.camera);
                }
            }
        }
    }

    logPicking() {
		if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj) {
						var customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
					}
                }
                this.gameOrchestrator.managePick(this.pickResults);
				this.pickResults.splice(0, this.pickResults.length);
			}
		}
	}

    /**
     * Displays the scene.
     */
    display() {
        
        this.logPicking();
		this.clearPickRegistration();
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
            if(this.displayAxis)
                this.axis.display();

            if(this.displayNormals && !this.displayNormals_before) {
                this.sceneGraphs[this.activeScene].enableNormals();
                this.displayNormals_before = true;
            }
            else if(!this.displayNormals && this.displayNormals_before) {
                this.sceneGraphs[this.activeScene].disableNormals();
                this.displayNormals_before = false;
            }

            this.defaultAppearance.apply();
            
            // Updates the scene's lights
            this.updateLights();

            //this.testBoard.display();

            // Displays the scene (MySceneGraph function).
            this.gameOrchestrator.orchestrate();
            this.sceneGraphs[this.activeScene].displayScene();
            this.gameOrchestrator.display();
            
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
            
            if(this.sceneGraphs[this.activeScene] != undefined){
                if(this.sceneGraphs[this.activeScene].loadedOk){
                    this.sceneGraphs[this.activeScene].onGraphLoaded();
                }
            }
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}