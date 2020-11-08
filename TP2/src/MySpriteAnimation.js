class MySpriteAnimation {
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
        //this.appearance.setTexture(this.spritesheet.texture);

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
            nextCell = Math.min(this.endCell, nextCell); //Next cell can't be higher than lastCell

            
            if(this.currentCell < nextCell){ //Check if the spritesheet's current sprite should change
                this.currentCell = nextCell;
                this.spritesheet.activateCellP(this.currentCell);
            }
        }
        else if(this.startCell > this.endCell){ //Animation going backwards
            nextCell = Math.ceil(((this.endCell - this.startCell) * time / this.duration) +  this.startCell);
            nextCell = Math.max(this.endCell, nextCell); //Next cell can't be lower than startCell
            
            if(this.currentCell > nextCell){
                this.currentCell = nextCell;
                this.spritesheet.activateCellP(this.currentCell);
            }
        }
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