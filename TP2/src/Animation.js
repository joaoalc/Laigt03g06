class Animation {

    constructor() {
        if(this.constructor == Animation) {
            throw new Error("Abstract class Animation cannot be instantiated");
        }
    }

    update(time) {
        throw new Error("Abstract method update of Animation class called!");
    }

    apply() {
        throw new Error("Abstract method apply of Animation class called!");
    }
}