class MySpriteText {
    /**
     * Constructor for MySpriteAnimation class.
     * @scene - Reference to MyScene object
     * @text - The string contiaining the text to be represented
     */
    constructor(scene, text, font) {
        this.scene = scene;
        this.text = text;

        this.objects = [];
        
        for(var i = 0; i < this.text.length; ++i) {
            this.objects[i] = new MyRectangle(this.scene, 0, 0, 1, 1);
        }

        this.appearance = new CGFappearance(this.scene);
        var fontPath;
        font == null ? fontPath = "images/fonts/font5_1.png" : fontPath = font;
        this.textSprite = new CGFtexture(this.scene, fontPath); //text sprite

        //this.spritesheet = new MySpriteSheet(this.scene, this.textSprite, 15, 8); // font sheet
        this.spritesheet = new MySpriteSheet(this.scene, this.textSprite, 16, 16);
        this.sheetSize = 16*16;
    }

    initRectangles() {
        this.objects = [];
        for(var i = 0; i < this.text.length; ++i) {
            this.objects[i] = new MyRectangle(this.scene, 0, 0, 1, 1);
        }
    }

    getCharacterPosition(character) {
        var code = character.charCodeAt();
        // var code = character.charCodeAt() - 32;
        if(code >= this.sheetSize) 
            return 1;
        
        return code;
    }

    setText(text) {
        this.text = text;
        this.initRectangles();
    }

    display() {
        this.appearance.apply();
        this.textSprite.bind();
        this.scene.setActiveShader(this.spritesheet.shader);
        
        this.scene.pushMatrix();

        this.scene.translate(-this.text.length/2, -0.5, 0);
        

        for(var i = 0; i < this.text.length; ++i) {
            this.scene.pushMatrix();
            
            var character = this.text.charAt(i);
            this.spritesheet.activateCellP(this.getCharacterPosition(character));

            this.scene.translate(i, 0, 0); 
            this.objects[i].display();

            this.scene.popMatrix();
        }

        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);
        this.textSprite.unbind();
    }
    
    enableNormalViz() {
        for(var i = 0; i < this.objects.length; ++i) {
            this.objects[i].enableNormalViz();
        }
    }

    disableNormalViz() {
        for(var i = 0; i < this.objects.length; ++i) {
            this.objects[i].disableNormalViz();
        }
    }

}