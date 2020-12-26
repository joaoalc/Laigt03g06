/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        var axis_normals = this.gui.addFolder("Axis/Normals");
        axis_normals.add(this.scene, 'displayAxis').name("Display Axis");
        axis_normals.add(this.scene, 'displayNormals').name("Display Normals");
        axis_normals.closed = false;
        
        return true;
    }

    /**
     * initKeys
     */
    initKeys() {

        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;

    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    /**
     * Adds the camera selection and lights enable/disable options to the interface
     * @param activeCamera - currently active camera's ID 
     */
    addGUIelements(activeCamera){
        var cameras = this.gui.addFolder("Cameras");
        cameras.closed = false;
        var camera = cameras.add(this.scene, 'activeCamera', this.scene.cameraIds).name('Active Camera').onChange(this.scene.updateCamera.bind(this.scene));
        camera.setValue(activeCamera);
        var lights = this.gui.addFolder("Lights");
        lights.closed = false;
        for(var i = 0; i < this.scene.lights.length; i++) {
            if(this.scene.lightsStatus["light"+i] != null) 
                lights.add(this.scene.lightsStatus, 'light' + i).onChange(this.scene.updateLights.bind(this.scene));
        }
    }

    addSceneSelectors(currentScene){
        var backgroundScenes = this.gui.addFolder("backgroundScenes");
        backgroundScenes.closed = false;
        var backgroundScene = backgroundScenes.add(this.scene, 'activeBackgroundSceneName', Object.keys(this.scene.sceneNames)).name('Current Scene').onChange(this.scene.updateBackgroundScene.bind(this.scene));
        backgroundScene.setValue(currentScene);
    }
}