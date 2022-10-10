import Frame from './Frame';

class AnimationClipFrame extends Frame {

    constructor({name, content, isKeyFrame}) {
        super(content, {isKeyFrame});
        this._name = name;
    }

    // Testing
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
        this._content.deleteContent();
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

}

export default AnimationClipFrame;