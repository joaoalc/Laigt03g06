class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        this.objects = [];
        
        for(var i = 0; i < this.text.length; ++i) {
            this.objects[i] = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);
        }

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setShininess(0);
        this.appearance.setSpecular(0, 0, 0);
        this.appearance.setDiffuse(0, 0, 0);
        this.appearance.setAmbient(0, 0, 0);
        this.appearance.setEmission(0, 0, 0);

        this.textSprite = new CGFtexture(this.scene, "fonts/font.png"); //text sprite
        this.appearance.setTexture(this.textSprite);

        this.spritesheet = new MySpriteSheet(this.scene, this.textSprite, 16, 16); // random numbers atm
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
        this.scene.setActiveShader(this.spritesheet.shader);
        
        
        for(var i = 0; i < this.text.length; ++i) {
            this.scene.pushMatrix();
            
            var character = this.text.charAt(i);
            this.spritesheet.activateCellP(this.getCharacterPosition(character));

            this.scene.translate(i%16, -Math.floor(i/16), 0); //max line length = 15 chars
            this.objects[i].display();

            this.scene.popMatrix();
        }
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}