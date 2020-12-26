//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);else b.log("Done!");if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);b.log("Loading "+d+"...");include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude(['../lib/CGF.js', './src/XMLscene.js', './src/MySceneGraph.js', './src/MyInterface.js', './src/primitives/MyRectangle.js',
                 './src/primitives/MyTriangle.js', './src/primitives/MySphere.js', './src/primitives/MyCylinder.js', './src/MyNode.js', './src/primitives/MyTorus.js',
                 './src/animation/Keyframe.js', './src/animation/Animation.js', './src/animation/KeyframeAnimation.js', './src/spritesheet/MySpritesheet.js',
                  './src/spritesheet/MySpriteText.js', './src/spritesheet/MySpriteAnimation.js', './src/primitives/Plane.js', './src/primitives/Patch.js', './src/primitives/Barrel.js', 
                  './src/MyCameras.js', './src/game/MyGameOrchestrator.js', './src/game/MyTile.js', './src/game/MyPiece.js', './src/game/MyGameBoard.js',
                  './src/game/MyGameMove.js', './src/game/MyGameSequence.js', './src/game/MyPieceBox.js', './src/game/MyAnimator.js', './src/game/MyPrologInterface.js',
                  './src/obj_reader/CGFOBJModel.js', './src/obj_reader/CGFResourceReader.js',

main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);

    app.init();

    app.setScene(myScene);
    app.setInterface(myInterface);

    myInterface.setActiveCamera(myScene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
    var filename=getUrlVars()['file'] || "LAIG_TP2_XML_T3_G06_v1.xml";

    myScene.sceneNames = {"Train" : 0, "Beach" : 1};
    var filenames = {0 : 'backgroundScenes/OGScene.xml', 1: 'backgroundScenes/SecondScene.xml'};
    for(sceneNumber in filenames){
        myScene.graphs[sceneNumber] = new MySceneGraph(filenames[sceneNumber], myScene, sceneNumber);
    }

    
    myScene.activeBackgroundSceneName = "Train";
	// create and load graph, and associate it to scene. 
	// Check console for loading errors
	var myGraph = new MySceneGraph(filename, myScene, -1);
    
	// start
    app.run();
}

]);