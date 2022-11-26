import AnimationClipFrame from './frames/AnimationClipFrame';

export class AnimationClip {

    constructor(name, frames) {
        this._name = name;
        this._frames = frames;
    }

    get name() {
        return this._name;
    }

    get frames() {
        return this._frames.map((_, index) =>
            new AnimationClipFrame({
                name: this.name,
                frameNumber: index + 1,
                frames: this._frames,
                isKeyFrame: index === 0
            })
        );
    }

    isNamed(aName) {
        return this.name === aName;
    }

    serialize() {
        return {
            name: this.name,
            frames: this._frames.map(frame => frame.serialize())
        };
    }

}