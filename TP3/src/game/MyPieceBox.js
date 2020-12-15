class MyPieceBox extends CGFobject{

    constructor(scene, style, color){
        super(scene);
        this.style = style;
        this.color = color;
        this.nPieces = 42;
        if(this.color == "purple"){
            this.id = 1;
        }
        else if(this.color == "orange"){
            this.id = 2;
        }
        else if(this.color == "green"){
            this.id = 3;
        }
        else{
            console.log("Invalid color " + this.color); //Place somewhere else
        }
        this.findStyle();
    }

    findStyle(){
        if(this.style == "regular"){
            this.createBox();
        }
        else{
            console.log("This box style " + this.style + " has not been implemented yet.");
            this.createPlaceHolder();
        }
    }

    createPlaceHolder(){
        this.rectangle = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5, 1, 1);
    }

    createBox(){
        this.rectangle = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5, 1, 1);
    }

    display(){
        if(this.nPieces > 0)
            this.scene.registerForPick(this.id, this);
        else this.scene.registerForPick(0, null);
        this.rectangle.display();
    }
}