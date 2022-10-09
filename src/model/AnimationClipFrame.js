import Optional from './Optional';
import Frame from './Frame';

class AnimationClipFrame {

    constructor({name, content, isKeyFrame}) {
        this._name = name;
        this._isKeyFrame = isKeyFrame;
        this._content = content;
        this._optionalOnionSkin = Optional.empty();
        this.hide();
    }

    hasSameContentAs(aFrame) {
        return this._content === aFrame._content;
    }

    isKeyFrame() {
        return this._isKeyFrame;
    }

    isExtendedFrame() {
        return !this.isKeyFrame();
    }

    isEmpty() {
        return this._content.isEmpty();
    }

    isVisible() {
        return this._content.isVisible();
    }

    isAnimationClip() {
        return true;
    }

    activate() {
        this._content.activate();
    }

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
        this._isKeyFrame = true;
    }

    changeContentFor(newContent) {
        this._content = newContent;
    }

    extended() {
        const extendedFrame = new AnimationClipFrame(this._content, {isKeyFrame: false}); 
        extendedFrame.show();

        return extendedFrame;
    }

}

export default AnimationClipFrame;