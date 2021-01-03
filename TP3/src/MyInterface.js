/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.cameras = null;
        this.lights = null;
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
    addGUIelements(currentScene){
        var gameConfig = this.gui.addFolder("Game config");
        gameConfig.closed = false;
        gameConfig.add(this.scene.gameOrchestrator, 'chooseMode', this.scene.gameOrchestrator.modes).name('Game mode');
        gameConfig.add(this.scene.gameOrchestrator, 'chooseLevel1', this.scene.gameOrchestrator.levels).name('Difficulty C1');
        gameConfig.add(this.scene.gameOrchestrator, 'chooseLevel2', this.scene.gameOrchestrator.levels).name('Difficulty C2');
        gameConfig.add(this.scene.gameOrchestrator, 'firstPlayer', this.scene.gameOrchestrator.players).name('Starting player');
        gameConfig.add(this.scene.gameOrchestrator, 'playTime', 0).name('Play Time (s)');

        var game = this.gui.addFolder("Game controls");
        game.closed = false;
        game.add(this.scene.gameOrchestrator, 'startGame').name('Start Game');
        game.add(this.scene.gameOrchestrator, 'undo').name('Undo');
        game.add(this.scene.gameOrchestrator, 'startMovie').name('Play Game Movie');
        game.add(this.scene.gameOrchestrator, 'stopMovie').name('Stop Game Movie');

        var backgroundScene = game.add(this.scene, 'activeScene', Object.keys(this.scene.gameOrchestrator.sceneGraphs)).name('Theme').onChange(this.scene.updateScene.bind(this.scene));
        backgroundScene.setValue(currentScene);
    }

    addCameraAndLightGUI(activeCamera){
        if(this.cameras != null){
            this.gui.removeFolder(this.cameras);
        }
        this.cameras = this.gui.addFolder("Cameras");
        this.cameras.closed = false;
        var camera = this.cameras.add(this.scene, 'activeCamera', this.scene.cameraIds).name('Active Camera').onChange(this.scene.updateCamera.bind(this.scene));
        camera.setValue(activeCamera);

        if(this.lights != null){
            this.gui.removeFolder(this.lights);
        }
        this.lights = this.gui.addFolder("Lights");
        this.lights.closed = false;
        for(var i = 0; i < this.scene.lights.length; i++) {
            if(this.scene.lightsStatus[i] != null) 
                this.lights.add(this.scene.lightsStatus, i).onChange(this.scene.updateLights.bind(this.scene)).name(this.scene.lightsIds[i]);
        }
    }
}