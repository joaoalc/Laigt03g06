class MySpriteAnimation {
    /**
     * Constructor for MySpriteAnimation class.
     * @scene - Reference to MyScene object
     * @spritesheet - The animation's spritesheet object
     * @endCell - The number of the first cell in the animation
     * @endCell - The number of the final cell in the animation
     * @duration - The animation's duration
     */
    constructor(scene, spritesheet, startCell, endCell, duration) {
        this.scene = scene;
        this.spritesheet = spritesheet;
        this.startCell = startCell;
        this.endCell = endCell;
        this.duration = duration;

        this.currentCell = startCell;

        this.firstTime = 0;

        this.object = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.appearance = new CGFappearance(this.scene);

        if(this.startCell > this.endCell){
            let temp = this.startCell;
            this.startCell = this.endCell;
            this.endCell = temp;
        }

    }

    update(time) {
        if(this.firstTime == 0){
            this.spritesheet.activateCellP(this.startCell);
            this.firstTime = time;

        }
        time -= this.firstTime;
        
        var nextCell;

        if(this.endCell > this.startCell){ //Animation going forwards
            nextCell = Math.floor(((this.endCell - this.startCell) * time / this.duration) +  this.startCell);
            while(nextCell > this.endCell){
                nextCell += -this.endCell + this.startCell - 1;
            }


            if(this.currentCell != nextCell){ //Check if the spritesheet's current sprite should change
                this.currentCell = nextCell;
                this.spritesheet.activateCellP(this.currentCell);
            }
        }
    }

    enableNormalViz() {
        this.object.enableNormalViz();
    }

    disableNormalViz() {
        this.object.disableNormalViz();
    }

    display() {
        this.appearance.apply();
        this.spritesheet.texture.bind();
        this.scene.setActiveShader(this.spritesheet.shader);

        this.object.display();

        this.scene.setActiveShader(this.scene.defaultShader);
        this.spritesheet.texture.unbind();
    }
}