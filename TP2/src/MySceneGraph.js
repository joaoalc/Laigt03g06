const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;


/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1) 
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse textures block
            if ((error = this.parseSpritesheets(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1) {
            NODES_INDEX--; // animations block not declared
            console.warn("<animations> block not declared. Assuming there are no animations");
        }
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("All parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        if(axis_length == 0) 
            this.scene.displayAxis = false;
        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        
        //Get the view's name
        var defaultView = this.reader.getString(viewsNode, "default");
        if (defaultView == null || defaultView == "") {
            return "no default view defined";
        }
        this.defaultView = defaultView;

        var children = viewsNode.children;

        this.views = [];
        var numViews = 0;

        var grandChildren = [];
        var nodeNames = [];

        for (var i = 0; i < children.length; i++) {

            var global = [];
            var attributeNames = [];

            var defaultUp = [0, 1, 0];

            //Get view ID
            var viewID = this.reader.getString(children[i], 'id');
            if (viewID == null || viewID == "")
                return "no ID defined for view";

            //Check for repeated IDs
            if (this.views[viewID] != null) {
                return "ID must be unique for each view (conflict: ID = " + viewID + ")";
            }

            if (children[i].nodeName == "perspective") {
                attributeNames.push(...["from", "to"]);

            } else if (children[i].nodeName == "ortho") {
                attributeNames.push(...["from", "to", "up"]);

            } else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            global.push(...this.parseView(children[i]));

            grandChildren = children[i].children;
            nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var k = 0; k < attributeNames.length; k++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[k]);

                if (attributeIndex != -1) {
                    global.push(this.parseCoordinates3D(grandChildren[attributeIndex], attributeNames[k] + " component for view ID " + viewID));
                }
                else if (attributeNames[k] == "up") {
                    global.push(defaultUp);
                }
                else
                    return "view " + attributeNames[k] + " undefined for ID = " + viewID;
            }

            this.views[viewID] = global;
            numViews++;
        }

        if (this.views[defaultView] == null) {
            return "default view ID = " + defaultView + " is not defined";
        }

        if (numViews == 0)
            return "at least one view must be defined";

        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null || lightId == "")
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean") 
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID " + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID " + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID " + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {


        //For each texture in textures block, check ID and file URL
        this.textures = [];

        var children = texturesNode.children;

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null || textureID == "")
                return "no ID defined for texture";

            if (this.textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";

            var texturePath = this.reader.getString(children[i], 'path');
            if (texturePath == null)
                return "no path defined for texture (ID = " + textureID + ")";

            var http = new XMLHttpRequest();

            http.open('HEAD', texturePath, false);
            http.send();
            if(http.status != 200) {
                this.onXMLError("invalid path defined for texture (ID = " + textureID + ")");
                this.textures[textureID] = 0;
            }
            else
                this.textures[textureID] = texturePath;
        }

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            var attributeNames = [];
            var attributeTypes = [];
            var global = [];

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["shininess", "specular", "diffuse", "ambient", "emissive"]);
                attributeTypes.push(...["float", "color", "color", "color", "color"]);
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null || materialID == "")
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            grandChildren = children[i].children;
            // Specifications for the current material.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "float")
                        var aux = this.reader.getFloat(grandChildren[attributeIndex], 'value');
                    else if (attributeTypes[j] == "color")
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " component for material ID " + materialID);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "material " + attributeNames[j] + " undefined for ID = " + materialID;
            }
            this.materials[materialID] = global;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        var nodeChilds = [];

        this.spriteAnimations = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null || nodeID == "")
                return "no ID defined for node";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;


            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");
            var animationIndex = nodeNames.indexOf("animationref");


            // Transformations
            var transformations = [];

            if (transformationsIndex != -1) {

                grandgrandChildren = grandChildren[transformationsIndex].children;
                for (var k = 0; k < grandgrandChildren.length; k++) {
                    var transf = this.parseTransformation(grandgrandChildren[k], nodeID, "node");
                    if(typeof(transf) == "string" && transf != "unknown")
                        return transf;
                    
                    if(transf.length > 0)
                        transformations.push(transf);
                }
            }
            var transfMatrix = mat4.create();

            for(var t = 0; t < transformations.length; t++) {
                if(transformations[t][0] == "t") {
                    mat4.translate(transfMatrix, transfMatrix, [transformations[t][1],transformations[t][2],transformations[t][3]]);
                } else if(transformations[t][0] == "r") {
                    if(transformations[t][1] == "x")
                        mat4.rotate(transfMatrix, transfMatrix, DEGREE_TO_RAD * transformations[t][2], [1,0,0]);
                    else if(transformations[t][1] == "y")
                        mat4.rotate(transfMatrix, transfMatrix, DEGREE_TO_RAD * transformations[t][2], [0,1,0]);
                    else if(transformations[t][1] == "z")
                        mat4.rotate(transfMatrix, transfMatrix, DEGREE_TO_RAD * transformations[t][2], [0,0,1]);
                } else if(transformations[t][0] == "s") {
                    mat4.scale(transfMatrix, transfMatrix, [transformations[t][1],transformations[t][2],transformations[t][3]])
                }
            }
            
            // Material
            if (materialIndex == -1)
                return "no <material> tag for node ID " + nodeID;
            var materialID = null;

            if ((materialID = this.reader.getString(grandChildren[materialIndex], 'id')) == null || materialID == "") {
                return "no id defined for material in node ID " + nodeID;
            }

            if (materialID != "null") {
                if (this.materials[materialID] == null && materialID != "null")
                    return "invalid material ID on node " + nodeID;
            } else {
                if(nodeID == this.idRoot)
                    this.onXMLMinorError("Warning: no material defined for root node. Using default material");
            }

            // Texture
            grandgrandChildren = [];

            if (textureIndex == -1)
                return "no <texture> tag for node ID " + nodeID;

            var textureID = null;

            if ((textureID = this.reader.getString(grandChildren[textureIndex], 'id')) == null) {
                return "no id defined for texture in node ID " + nodeID;
            }


            if (textureID != "null" && textureID != "clear") {
                if (this.textures[textureID] == null)
                    this.onXMLError("invalid texture ID on node " + nodeID + ". Assuming empty texture");
            }

            grandgrandChildren = grandChildren[textureIndex].children;

            // Amplification
            var amplification = [];
            var afs;
            var aft;

            for (var m = 0; m < grandgrandChildren.length; m++) {
                if (grandgrandChildren[m].nodeName == "amplification") {
                    afs = this.reader.getFloat(grandgrandChildren[m], 'afs');
                    aft = this.reader.getFloat(grandgrandChildren[m], 'aft');

                    if (!(afs != null && !isNaN(afs))) {
                        return "could not parse 'afs' component of texture on node " + nodeID;
                    }
                    if (!(aft != null && !isNaN(aft))) {
                        return "could not parse 'aft' component of texture on node " + nodeID;
                    }

                    amplification.push(...[afs, aft]);

                } else {
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[i].nodeName + ">");
                }
            }

            if(amplification.length == 0) {
                this.onXMLMinorError("amplification tag not define in node ID " + nodeID + ". Assuming afs=1.0 and aft=1.0");
                amplification.push(...[1, 1]);
            }


            // Descendants
            grandgrandChildren = [];
            if (descendantsIndex == -1)
                return "no <descendants> tag for node ID " + nodeID;
            
            grandgrandChildren = grandChildren[descendantsIndex].children;

            var descendants = [];
            var leaves = [];


            for(var n = 0; n < grandgrandChildren.length; n++) {
                if(grandgrandChildren[n].nodeName == "noderef") {
                    var descendantID = this.reader.getString(grandgrandChildren[n], 'id');
                    if(descendantID == null || descendantID == "") 
                        return "no id defined for descendant on node ID " + nodeID;
                    descendants.push(descendantID);

                } else if(grandgrandChildren[n].nodeName == "leaf") {
                    var leaf = this.parseLeaf(grandgrandChildren[n], " on node ID " + nodeID, amplification);
                    if(typeof leaf == 'string') {
                        return leaf;
                    }
                    leaves.push(leaf);

                } else {
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[n].nodeName + ">");
                }
            }

            var animation = null;
            if (animationIndex != -1) {
                
                var animID = null;

                if ((animID = this.reader.getString(grandChildren[animationIndex], 'id')) == null || animID == "") {
                    this.onXMLMinorError("no id defined for animation in node ID " + nodeID + ". Assuming no animation");

                } else if (animID != "null" && this.animations[animID] == null) {
                    this.onXMLMinorError("invalid animation ID on node " + nodeID + ". Assuming no animation");
                }
                
                if(animID != null)
                    animation = this.animations[animID];
            }

            this.nodes[nodeID] = new MyNode(this.scene, nodeID, textureID, materialID, transfMatrix, [], leaves, animation);
            nodeChilds[nodeID] = descendants;

        }


        for(var key in this.nodes) {
            var childs = nodeChilds[key];
            var desc = []; 
            if(childs != null) {
                for(var n = 0; n < childs.length; n++) {
                    if(this.nodes[childs[n]] == null)
                        return "invalid descendant ID " + childs[n] + " on node ID " + key;
    
                    desc.push(this.nodes[childs[n]]);
                }
            }
            this.nodes[key].descendants = desc;
        }

        this.log("Parsed nodes");
    }
    
    /**
     * Parses a <leaf> object
     * @returns resulting CGFobject to display 
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     * @param {texture amplification} amplification 
     */

    parseLeaf(node, messageError, amplification) {
        var type = this.reader.getString(node, 'type');
        var attributeIndex = -1;
        var attributeNames = [];
        var attributeTypes = [];
        var info = [];

        if(type == "rectangle") {
            attributeNames = ["x1", "y1", "x2", "y2"];

            for(var i = 0; i < attributeNames.length; i++) {
                var attribute = this.reader.getFloat(node, attributeNames[i]);
                if (!(attribute != null && !isNaN(attribute)))
                    return "unable to identify '" + attributeNames[i] + "' attribute on rectangle " + messageError;
                info.push(attribute);
            }
            return new MyRectangle(this.scene, info[0], info[1], info[2], info[3], amplification[0], amplification[1]);
            
        } else if(type == "triangle") {
            attributeNames = ["x1", "y1", "x2", "y2", "x3", "y3"];

            for(var i = 0; i < attributeNames.length; i++) {
                var attribute = this.reader.getFloat(node, attributeNames[i]);
                if (!(attribute != null && !isNaN(attribute)))
                    return "unable to identify '" + attributeNames[i] + "' attribute on triangle " + messageError;
                info.push(attribute);
            }
            return new MyTriangle(this.scene, info[0], info[1], info[2], info[3], info[4], info[5], amplification[0], amplification[1]);

        } else if(type == "cylinder") {
            attributeNames = ["height", "bottomRadius", "topRadius", "slices", "stacks"];
            attributeTypes = ["float", "float", "float", "integer", "integer"];

            for(var i = 0; i < attributeNames.length; i++) {
                if(attributeTypes[i] == "float") {
                    var attribute = this.reader.getFloat(node, attributeNames[i]);
                    if (!(attribute != null && !isNaN(attribute)))
                        return "unable to identify '" + attributeNames[i] + "' attribute on cylinder " + messageError;
                } else {
                    var attribute = this.reader.getInteger(node, attributeNames[i]);
                    if (!(attribute != null && !isNaN(attribute)))
                        return "unable to identify '" + attributeNames[i] + "' attribute on cylinder " + messageError;
                }
                info.push(attribute);
            }
            return new MyCylinder(this.scene, info[0], info[1], info[2], info[3], info[4], info[5]);

        } else if(type == "sphere") {
            attributeNames = ["radius", "slices", "stacks"];
            attributeTypes = ["float", "integer", "integer"];

            for(var i = 0; i < attributeNames.length; i++) {
                if(attributeTypes[i] == "float") {
                    var attribute = this.reader.getFloat(node, attributeNames[i]);
                    if (!(attribute != null && !isNaN(attribute)))
                        return "unable to identify '" + attributeNames[i] + "' attribute on sphere " + messageError;
                } else {
                    var attribute = this.reader.getInteger(node, attributeNames[i]);
                    if (!(attribute != null && !isNaN(attribute)))
                        return "unable to identify '" + attributeNames[i] + "' attribute on sphere " + messageError;
                }
                info.push(attribute);
            }
            return new MySphere(this.scene, info[0], info[1], info[2]);

        } else if(type == "torus") {
            attributeNames = ["inner", "outer", "slices", "loops"];
            attributeTypes = ["float", "float", "integer", "integer"];

            for(var i = 0; i < attributeNames.length; i++) {
                if(attributeTypes[i] == "float") {
                    var attribute = this.reader.getFloat(node, attributeNames[i]);
                    if (!(attribute != null && !isNaN(attribute)))
                        return "unable to identify '" + attributeNames[i] + "' attribute on torus " + messageError;
                } else {
                    var attribute = this.reader.getInteger(node, attributeNames[i]);
                    if (!(attribute != null && !isNaN(attribute)))
                        return "unable to identify '" + attributeNames[i] + "' attribute on torus " + messageError;
                }
                info.push(attribute);
            }
            return new MyTorus(this.scene, info[0], info[1], info[2], info[3]);
        } else if(type == "spritetext") {
            var text;
            
            if((text = this.reader.getString(node, 'text')) == null)
                return "unable to identify 'text' attribute on spritetext " + messageError;

            return new MySpriteText(this.scene, text);

        } else if(type == "spriteanim") {
            attributeNames = ["ssid", "startCell", "endCell", "duration"];
            attributeTypes = ["string", "integer", "integer", "float"];

            for(var i = 0; i < attributeNames.length; i++) {
                if(attributeTypes[i] == "float") {
                    var attribute = this.reader.getFloat(node, attributeNames[i]);
                    if (!(attribute != null && !isNaN(attribute)))
                        return "unable to identify '" + attributeNames[i] + "' attribute on spriteanim " + messageError;
                } else if(attributeTypes[i] == "integer") {
                    var attribute = this.reader.getInteger(node, attributeNames[i]);
                    if (!(attribute != null && !isNaN(attribute)))
                        return "unable to identify '" + attributeNames[i] + "' attribute on spriteanim " + messageError;
                } else {
                    var attribute = this.reader.getString(node, attributeNames[i]);
                    if (attribute == null || attribute == "")
                        return "unable to identify '" + attributeNames[i] + "' attribute on spriteanim " + messageError;
                }
                info.push(attribute);
            }

            if(this.spritesheets[info[0]] == null)
                return "invalid ssid on spriteanim " + messageError;

            var sizeSprite = this.spritesheets[info[0]].sizeM * this.spritesheets[info[0]].sizeN;


            if(info[1] < 0 || info[2] < 0 || info[1] > sizeSprite || info[2] > sizeSprite)
                return "invalid startCell or endCell values on spriteanim " + messageError;
            
            var newAnimation = new MySpriteAnimation(this.scene, this.spritesheets[info[0]], info[1], info[2], info[3]);

            this.spriteAnimations.push(newAnimation);

            return newAnimation;
        } 
        else if(type == "plane") {
            
            var partsU = this.reader.getInteger(node, 'npartsU');
            if (!(partsU != null && !isNaN(partsU)))
                return "unable to identify 'npartsU' attribute on plane " + messageError;

            var partsV = this.reader.getInteger(node, 'npartsV');
            if (!(partsV != null && !isNaN(partsV)))
                return "unable to identify 'npartsV' attribute on plane " + messageError;

            return new Plane(this.scene, partsU, partsV);
        } 
        else if(type == "patch") {
            attributeNames = ["npointsU", "npointsV", "npartsU", "npartsV"];

            var controlPointsLine = []; //
            var controlPoints = [];

            var children = node.children;

            if(children.length < 1) {
                return "no control points defined for patch";
            }

            for(var i = 0; i < attributeNames.length; i++) {

                var attribute = this.reader.getInteger(node, attributeNames[i]);
                if (!(attribute != null && !isNaN(attribute)))
                    return "unable to identify '" + attributeNames[i] + "' attribute on patch " + messageError;

                info.push(attribute);
            }

            //The number of control points has to be equal to npointsU * npointsV
            if(children.length > (info[0] * info[1])){
                return "not enough control points (" + children.length + " were defined when " + (info[0] * info[1]) + " should've been) defined for patch"
            }
            else if(children.length < (info[0] * info[1])){
                return "too many control points (" + children.length + " were defined when " + (info[0] * info[1]) + " should've been) defined for patch"
            }

            for(var k = 0; k < info[0]; ++k){
                for(var j = 0; j < info[1]; ++j) {
                    if(children[k * info[1] + j].nodeName == "controlpoint") {
                        var point = this.parseAnyCoordinates3D(children[k * info[1] + j], "control point in patch leaf", ["xx", "yy", "zz"]);
                        point.push(1); //Control point's weight
                        if(typeof(point) == "string")
                            return point;
                        controlPointsLine.push(point);

                    } else this.onXMLMinorError("unkown tag " + children[i].nodeName + " in patch leaf");
                }
                controlPoints.push(controlPointsLine);
                controlPointsLine = [];
            }
            return new Patch(this.scene, info[0], info[1], info[2], info[3], controlPoints);
            
        } else if(type == "defbarrel") {
            attributeNames = ["base", "middle", "height", "stacks", "slices"];
            attributeTypes = ["float", "float", "float", "integer", "integer"];

            for(var i = 0; i < attributeNames.length; i++) {
                if(attributeTypes[i] == "float") {
                    var attribute = this.reader.getFloat(node, attributeNames[i]);
                    if (!(attribute != null && !isNaN(attribute)))
                        return "unable to identify '" + attributeNames[i] + "' attribute on defbarrel " + messageError;
                } else if(attributeTypes[i] == "integer") {
                    var attribute = this.reader.getInteger(node, attributeNames[i]);
                    if (!(attribute != null && !isNaN(attribute)))
                        return "unable to identify '" + attributeNames[i] + "' attribute on defbarrel " + messageError;
                } else {
                    var attribute = this.reader.getString(node, attributeNames[i]);
                    if (attribute == null || attribute == "")
                        return "unable to identify '" + attributeNames[i] + "' attribute on defbarrel " + messageError;
                }
                info.push(attribute);
            }

            return new Barrel(this.scene, info[0], info[1], info[2], info[3], info[4]);
        }
        else 
            return "invalid leaf type";
    }

    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        for(var i = 0; i < children.length; ++i) {
            if(children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in <animations> block");
                continue;
            }
            var animID = this.reader.getString(children[i], 'id');
            if (animID == null || animID == "")
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animID] != null)
                return "ID must be unique for each animation (conflict: ID = " + animID + ")";

            grandChildren = children[i].children; 

            var keyframes = [];

            //ASSUMING <keyframe> IS THE ONLY POSSIBLE CHILD FOR ANIMATION -- TODO - MAYBE CHANGE LATER 
            for(var j = 0; j < grandChildren.length; ++j) {
                if(grandChildren[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + "> in <animation> block ID = " + animID);
                    continue;
                }
                var instant = this.reader.getFloat(grandChildren[j], "instant");
                if (!(instant != null && !isNaN(instant)))
                    return "unable to identify 'instant' attribute of keyframe in animation ID = " + animID;

                for(var l = 0; l < keyframes.length; ++l) {
                    if(keyframes[l].instant == instant)
                        this.onXMLError("Animation ID=" + animID + " has more than one keyframe on instant=" + instant + ". Using the first declared");
                    continue;
                }
                
                grandgrandChildren = grandChildren[j].children;

                var translation = null;
                var rotation = [];
                var scale = null;

                var rotationx = null;
                var rotationy = null;
                var rotationz = null;

                for(var k = 0; k < grandgrandChildren.length; ++k) {
                    var transf = this.parseTransformation(grandgrandChildren[k], animID, "animation");

                    if(typeof(transf) == "string" && transf != "unknown")
                        return transf;
                    
                    if(transf.length > 0) {
                        if(transf[0] == "t") {
                            if(translation == null)
                                translation = transf;
                            else this.onXMLError("Animation " + animID + " keyframe on instant " + instant + " has more than one translation block");
                        }
                        else if(transf[0] == "s"){
                            if(scale == null){
                                scale = transf;
                            }
                            else this.onXMLError("Animation " + animID + " keyframe on instant " + instant + " has more than one scale block");
                        }
                        else if(transf[0] == "r"){
                            if(transf[1] == "x"){
                                if(rotationx == null){
                                    rotationx = transf[2];
                                }
                            }
                            else if(transf[1] == "y"){
                                if(rotationy == null){
                                    rotationy = transf[2];
                                }
                            }
                            else if(transf[1] == "z"){
                                if(rotationz == null){
                                    rotationz = transf[2];
                                }
                            }
                        }
                    }
                }
                rotation.push(...[rotationx, rotationy, rotationz]);
                keyframes.push(new Keyframe(instant, translation, rotation, scale));
            }

            if(keyframes.length == 0)
                return "at least one keyframe must be declared on an animation";
            
            keyframes.sort(function(a, b){return a.instant - b.instant});
            for(var k = 0; k < keyframes.length - 1; ++k) {
                keyframes[k].setNext(keyframes[k+1]);
            }
            this.animations[animID] = new KeyframeAnimation(this.scene, animID, keyframes);
        }

        this.log("Parsed Animations");
        return null;
    }

    parseSpritesheets(spritesheetsNode) {

        this.spritesheets = [];

        var children = spritesheetsNode.children;

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "spritesheet") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var spritesheetID = this.reader.getString(children[i], 'id');
            if (spritesheetID == null || spritesheetID == "")
                return "no ID defined for spritesheet";

            if (this.spritesheets[spritesheetID] != null)
                return "ID must be unique for each spritesheet (conflict: ID = " + spritesheetID + ")";

            var spritePath = this.reader.getString(children[i], 'path');
            if (spritePath == null)
                return "no path defined for spritesheet (ID = " + spritesheetID + ")";

            var http = new XMLHttpRequest();

            http.open('HEAD', spritePath, false);
            http.send();
            if(http.status != 200) {
                //this.onXMLError("invalid path defined for texture (ID = " + textureID + ")");
                return "invalid path defined for spritesheet (ID = " + spritesheetID + ")";
            }

            var spritesheetTexture = new CGFtexture(this.scene, spritePath);

            var sizeM = this.reader.getFloat(children[i], 'sizeM');
            if (!(sizeM != null && !isNaN(sizeM)))
                    return "unable to identify 'sizeM' attribute of spritesheet ID = " + spritesheetID;

            var sizeN = this.reader.getFloat(children[i], 'sizeN');
            if (!(sizeN != null && !isNaN(sizeN)))
                    return "unable to identify 'sizeN' attribute of spritesheet ID = " + spritesheetID;
            
            this.spritesheets[spritesheetID] = new MySpriteSheet(this.scene, spritesheetTexture, sizeM, sizeN);
        }

        this.log("Parsed spritesheets");
        return null;
    }


    parseBoolean(node, name, messageError) {
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * Unlike parseCoordinates3D, the names of the parsed elements are passed to the function by argument instead of being assumed as x, y and z
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     * @param {names of the 3 coordinates to parse (in order)} coordNames
     */
    parseAnyCoordinates3D(node, messageError, coordNames) {
        var position = [];

        if(coordNames.length != 3){
            console.log("Too many coordenates for parseAnyCoorinates3D");
        }

        // x
        var x = this.reader.getFloat(node, coordNames[0]);
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, coordNames[1]);
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, coordNames[2]);
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;
        position.push(...[x, y, z]);

        return position;
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Parse the components of a view
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseView(node, messageError) {
        var values = [];

        if (node.nodeName == "perspective") {
            var near = this.reader.getFloat(node, 'near');
            if (!(near != null && !isNaN(near)))
                return "unable to parse 'near' component of the " + messageError;

            var far = this.reader.getFloat(node, 'far');
            if (!(far != null && !isNaN(far)))
                return "unable to parse 'far' component of the " + messageError;

            var angle = this.reader.getFloat(node, 'angle');
            if (!(angle != null && !isNaN(angle)))
                return "unable to parse 'angle' component of the " + messageError;
            angle *= DEGREE_TO_RAD;

            values = ["p", angle, near, far];

        } else if (node.nodeName == "ortho") {
            var near = this.reader.getFloat(node, 'near');
            if (!(near != null && !isNaN(near)))
                return "unable to parse 'near' component of the " + messageError;

            var far = this.reader.getFloat(node, 'far');
            if (!(far != null && !isNaN(far)))
                return "unable to parse 'far' component of the " + messageError;

            var top = this.reader.getFloat(node, 'top');
            if (!(top != null && !isNaN(far)))
                    return "unable to parse 'top' component of the " + messageError;

            var left = this.reader.getFloat(node, 'left');
            if (!(left != null && !isNaN(left)))
                return "unable to parse 'left' component of the " + messageError;

            var right = this.reader.getFloat(node, 'right');
            if (!(right != null && !isNaN(right)))
                return "unable to parse 'right' component of the " + messageError;

            var bottom = this.reader.getFloat(node, 'bottom');
            if (!(bottom != null && !isNaN(bottom)))
                return "unable to parse 'bottom' component of the " + messageError;

            values = ["o", left, right, bottom, top, near, far];
        }
        else
            return null;

        return values;
    }

    parseTransformation(node, parentID, type) {
        var transf = [];
        if (node.nodeName == "translation") {
            transf.push("t");
            transf.push(...this.parseCoordinates3D(node, "translation in " + type + " ID " + parentID));
            if(isNaN(transf[1]) || isNaN(transf[2]) || isNaN(transf[3])){
                return "unable to parse component of translation on " + type + " ID " + parentID;
            }

        } else if (node.nodeName == "scale") {
            transf.push("s");
            var sx = null;
            var sy = null;
            var sz = null;

            if((sx = this.reader.getFloat(node, 'sx')) == null)
                return   "unable to parse 'sx' component of scale on " + type + " ID " + parentID;
            if(isNaN(sx))
                return   "the value of the 'sx' component of the scale on " + type + " ID " + parentID + " isn't a number.";
            if((sy = this.reader.getFloat(node, 'sy')) == null)
                return   "unable to parse 'sy' component of scale on " + type + " ID " + parentID;
            if(isNaN(sy))
                return   "the value of the 'sy' component of the scale on " + type + " ID " + parentID + " isn't a number.";
            if((sz = this.reader.getFloat(node, 'sz')) == null)
                return   "unable to parse 'sz' component of scale on " + type + " ID " + parentID;
            if(isNaN(sz))
                return   "the value of the 'sz' component of the scale on " + type + " ID " + parentID + " isn't a number.";
            transf.push(...[sx, sy, sz]);

        } else if (node.nodeName == "rotation") {
            transf.push("r");
            var axis = null;
            var angle = null;

            axis = this.reader.getString(node, 'axis');
            if(axis == null || (axis != "x" && axis != "y" && axis != "z"))
                return   "unable to parse 'axis' component of rotation on " + type + " ID " + parentID;

            if((angle = this.reader.getFloat(node, 'angle')) == null)
                return   "unable to parse 'angle' component of rotation on " + type + " ID " + parentID;
            if(isNaN(angle))
                return   "the value of the 'angle' component of the rotation on " + type + " ID " + parentID + " isn't a number.";

            transf.push(...[axis, angle]);

        } else {
            this.onXMLMinorError("unknown tag <" + node.nodeName + ">");
            return  "unknown";
        }
        return transf;
    }

    /**
     * Enables display for normals on all leaves in the graph
     */
    enableNormals() {
        for(var node in this.nodes) {
            for(var i = 0; i < this.nodes[node].leaves.length; i++) {
                this.nodes[node].leaves[i].enableNormalViz();
            }
        }
    }

    /**
     * Display display for normals on all leaves in the graph
     */
    disableNormals() {
        for(var node in this.nodes) {
            for(var i = 0; i < this.nodes[node].leaves.length; i++) {
                this.nodes[node].leaves[i].disableNormalViz();
            }
        }
    }

    /**
     * Displays the scene, processing each node recursively, starting by the root node.
     */
    displayScene() {
        this.nodes[this.idRoot].display();
    }
}