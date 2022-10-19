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
        return this._frames[this._frameNumber - 1];
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
        const extendedFrame = new AnimationClipFrame(this._content, {isKeyFrame: false}); 
        extendedFrame.show();

        return extendedFrame;
    }

    moveBy(aDeltaPosition) {
        this._content.moveBy(aDeltaPosition);
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