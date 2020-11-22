class MySpriteText {
    /**
     * Constructor for MySpriteAnimation class.
     * @scene - Reference to MyScene object
     * @text - The string contiaining the text to be represented
     */
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        this.objects = [];
        
        for(var i = 0; i < this.text.length; ++i) {
            this.objects[i] = new MyRectangle(this.scene, 0, 0, 1, 1);
        }

        this.appearance = new CGFappearance(this.scene);

        this.textSprite = new CGFtexture(this.scene, "fonts/font3.png"); //text sprite

        this.spritesheet = new MySpriteSheet(this.scene, this.textSprite, 16, 16); // font sheet
        this.sheetSize = 16*16;
    }

    getCharacterPosition(character) {
        var code = character.charCodeAt();
        if(code >= this.sheetSize) 
            return 1;
        
        return code;
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