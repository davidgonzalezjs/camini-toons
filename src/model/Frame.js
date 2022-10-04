import Optional from './Optional';

class Frame {

    constructor(content, {isKeyFrame}) {
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

    isEmpty() {
        return this._content.isEmpty();
    }

    isVisible() {
        return this._content.visible;
    }

    isAnimationClip() {
        return false;
    }

    activate() {
        this._content.activate();
    }

    show() {
        this._content.visible = true;
        this._content.activate();
    }

    hide() {
        this._content.visible = false;
        this.hideOnionSkin();
    }

    deleteContent() {
        this._content.remove();
        this.hideOnionSkin();
    }

    showOnionSkin(aStokeColor, opacity) {
        const onionSkin = this._content.clone();
        
        onionSkin.locked = true;
        onionSkin.strokeColor = aStokeColor;
        onionSkin.opacity = opacity;
        onionSkin.visible = true;

        this._optionalOnionSkin = Optional.with(onionSkin);
    }

    hideOnionSkin() {
        this._optionalOnionSkin.ifPresent(onionSkin => onionSkin.remove());
        this._optionalOnionSkin = Optional.empty();
    }

    convertToKeyFrame() {
        if (this.isKeyFrame()) return; // TODO: si ya es un keyframe se termina clonando el content y queda un content flotando en la nada (sin estar dentro de un Frame)

        this._isKeyFrame = true;
        this._content = this._content.clone();
    }

    changeContentFor(newContent) {
        this._content = newContent;
    }

    extended() {
        const extendedFrame = new Frame(this._content, {isKeyFrame: false}); 
        extendedFrame.show();

        return extendedFrame;
    }

    clone() {
        return new Frame(this._content.clone(), {isKeyFrame: this.isKeyFrame()});
    }

}

export default Frame;