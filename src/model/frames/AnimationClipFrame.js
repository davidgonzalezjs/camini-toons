import Frame from './Frame';

class AnimationClipFrame extends Frame {

    constructor({name, frameNumber, frames, isKeyFrame}) {
        super();
        this._name = name;
        this._isKeyFrame = isKeyFrame;
        this._frameNumber = frameNumber;
        this._frames = frames;
    }

    // Accessing
    get _content() {    
        return this._frames[this.frameIndex];
    }

    get frameIndex() {
        return this._frameNumber - 1;
        // return this._frameNumber % (this._frames.length + 1) - 1;
        // return this._frameNumber <= this._frames.length
        // ? this._frameNumber - 1
        // : (this._frameNumber % (this._frames.length + 1));
    }

    get lastFrameNumber() {
        return this._frames.length;
    }

    // Testing
    hasSameContentAs(aFrame) {
        return aFrame.isAnimationClip() && aFrame._frameNumber === this._frameNumber && aFrame._name === this._name;
    }

    isVisible() {
        return this._content.isVisible();
    }

    isAnimationClip() {
        return true;
    }

    // Actions
    show() {
        this._content.show();
    }

    hide() {
        this._content.hide();
    }

    deleteContent() {
        //this._content.deleteContent(); // TODO: analizar si hay que hacer algo acá
    }

    showOnionSkin(aStokeColor, opacity) {
        this._content.showOnionSkin(aStokeColor, opacity);
    }

    hideOnionSkin() {
        this._content.hideOnionSkin();
    }

    convertToKeyFrame() {
        this._isKeyFrame = true; // TODO: delegar en content
    }

    extended() {
        const nextFrameNumber =
            this._frameNumber === this.lastFrameNumber
                ? 1
                : this._frameNumber + 1;

        const extendedFrame = new AnimationClipFrame({
            name: this._name,
            frameNumber: nextFrameNumber,
            frames: this._frames,
            isKeyFrame: false
        });

        window.extendedFrame = extendedFrame
        // console.log(`frameNumber: ${extendedFrame._frameNumber} | frameIndex: ${this.frameIndex}`)
        this.hide();

        return extendedFrame;
    }

    moveBy(aDeltaPosition) {
        this._content.moveBy(aDeltaPosition);
    }

    transform(transformationData) {
        this._content.transform(transformationData);
    }

    serialize() {
        return {
            name: this._name,
            _isKeyFrame: this.isKeyFrame(),
            _frameNumber: this._frameNumber,
            _isAnimationClip: true
        }
    }

}

export default AnimationClipFrame;