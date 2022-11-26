import { subclassResponsibility } from '../errors';

export class Frame {

    // Testing
    hasSameContentAs(aFrame) {
        subclassResponsibility('hasSameContentAs');
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
        subclassResponsibility('isVisible');
    }

    isAnimationClip() {
        subclassResponsibility('isAnimationClip');
    }

    // Actions
    activate() {
        this._content.activate();
    }

    show() {
        subclassResponsibility('shown');
    }

    hide() {
        subclassResponsibility('hide');
    }

    deleteContent() {
        subclassResponsibility('deleteContent');
    }

    showOnionSkin(aStokeColor, opacity) {
        subclassResponsibility('showOnionSkin');
    }

    hideOnionSkin() {
        subclassResponsibility('hideOnionSkin');
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
        subclassResponsibility('extended');
    }

    clone() {
        subclassResponsibility('clone');
    }

    serialize() {
        return {
            _content: this._content.serialize(),
            _isKeyFrame: this.isKeyFrame(),
            _isAnimationClip: this.isAnimationClip()
        }
    }

}

export default Frame;