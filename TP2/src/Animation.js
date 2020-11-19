class Animation {

    constructor(id) {
        if(this.constructor == Animation) {
            throw new Error("Abstract class Animation cannot be instantiated");
        }
        this.id = id;
    }

    update(time) {
        throw new Error("Abstract method update of Animation class called!");
    }

    apply(scene) {
        throw new Error("Abstract method apply of Animation class called!");
    }
}