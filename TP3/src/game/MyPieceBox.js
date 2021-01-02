class MyPieceBox extends CGFobject{

    constructor(scene, color){
        super(scene);
        // this.style = style;
        this.color = color;
        this.nPieces = 42;
        if(this.color == "purple"){
            this.id = 1;
            this.piecesText = new CGFtexture(this.scene, "./images/purple_pieces.png");
        }
        else if(this.color == "orange"){
            this.id = 2;
            this.piecesText = new CGFtexture(this.scene, "./images/orange_pieces.png");
        }
        else if(this.color == "green"){
            this.id = 3;
            this.piecesText = new CGFtexture(this.scene, "./images/green_pieces.png");
        }
        else{
            console.log("Invalid color " + this.color); //Place somewhere else
        }
        // this.findStyle();
        this.rectangle = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5, 1, 1);

        this.boxText = new CGFtexture(this.scene, "./images/basket_text.jpg");
        this.obj = new CGFOBJModel(this.scene, "./images/basket.obj", 0);

        
    }

    reset() {
        this.nPieces = 42;
    }

    // findStyle(){
    //     if(this.style == "regular"){
    //         this.createBox();
    //     }
    //     else{
    //         console.log("This box style " + this.style + " has not been implemented yet.");
    //         this.createPlaceHolder();
    //     }
    // }

    // createPlaceHolder(){
    //     this.rectangle = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5, 1, 1);
    // }

    // createBox(){
    //     this.rectangle = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5, 1, 1);
    // }

    display(){
        
        if(this.nPieces > 0) {
            this.piecesText.bind();

            
            this.scene.pushMatrix();
            this.scene.translate(0, 0, 0.7);
            this.scene.scale(2.9,2,1);
 
            this.scene.registerForPick(this.id, this);

            this.rectangle.display();
            this.scene.popMatrix();
        }
        
        this.scene.pushMatrix();
        this.scene.scale(2,2,2);
        this.scene.rotate(Math.PI/2, 0,0,1);
        this.scene.rotate(Math.PI/2, 1,0,0);
        this.boxText.bind();
        this.obj.display();
        this.scene.popMatrix();
    } 
}