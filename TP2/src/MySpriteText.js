class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        this.objects = [];
        
        for(var i = 0; i < this.text.length; ++i) {
            this.objects[i] = new MyRectangle(this.scene, 0, 0, 1, 1);
        }

        this.lineLimit = 16; //max line length

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setShininess(0);
        this.appearance.setSpecular(0, 0, 0);
        this.appearance.setDiffuse(0, 0, 0);
        this.appearance.setAmbient(0, 0, 0);
        this.appearance.setEmission(0, 0, 0);

        this.textSprite = new CGFtexture(this.scene, "fonts/font.png"); //text sprite
        //this.appearance.setTexture(this.textSprite);

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

        var lines = Math.floor(this.text.length/this.lineLimit);

        if(lines > 0) // shift sprite to the center
            this.scene.translate(-this.lineLimit/2, (lines-1)/2, 0);
        else 
            this.scene.translate(-this.text.length/2, -0.5, 0);
        

        for(var i = 0; i < this.text.length; ++i) {
            this.scene.pushMatrix();
            
            var character = this.text.charAt(i);
            this.spritesheet.activateCellP(this.getCharacterPosition(character));

            this.scene.translate(i%this.lineLimit, -Math.floor(i/this.lineLimit), 0); 
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
}