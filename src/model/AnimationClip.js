export class AnimationClip {

    constructor(name, frames) {
        this._name = name;
        this._frames = frames;
    }

    get name() {
        return this._name;
    }

    get frames() {
        return this._frames;
    }

    isNamed(aName) {
        return this.name === aName;
    }

}