class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;

        this.objects = [];
        
        for(var i = 0; i < this.text.length; ++i) {
            this.objects[i] = new MyRectangle(this.scene, -0.5, 0.5, 0.5, -0.5);
        }

        var textSprite = new CGFtexture(this.scene, "text.png"); // doesnt exist yet
        this.spritesheet = new MySpriteSheet(textSprite, 10, 10); // random numbers atm
    }

    getCharacterPosition(character) {
        
    }

    display() {
        for(var i = 0; i < this.text.length; ++i) { //Not complete
            this.scene.pushMatrix();
            this.spritesheet.activateCellP(this.getCharacterPosition(this.text.charAt(i)));
            this.scene.translate(i, 0, 0);
            this.objects[i].display();
            this.scene.popMatrix();
        }
    }
}