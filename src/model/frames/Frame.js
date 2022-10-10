import { subclassResponsibility } from '../errors';
import Optional from '../Optional';

export class Frame {
    
    constructor(content, {isKeyFrame}) {
        this._isKeyFrame = isKeyFrame;
        this._content = content;
        this._optionalOnionSkin = Optional.empty();
        this.hide();
    }

    // Testing
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
        subclassResponsibility();
    }

    isAnimationClip() {
        subclassResponsibility();
    }

    // Actions
    activate() {
        this._content.activate();
    }

    show() {
        subclassResponsibility();
    }

    hide() {
        subclassResponsibility();
    }

    deleteContent() {
        subclassResponsibility();
    }

    showOnionSkin(aStokeColor, opacity) {
        subclassResponsibility();
    }

    hideOnionSkin() {
        subclassResponsibility();
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
        subclassResponsibility();
    }

    clone() {
        subclassResponsibility();
    }

}

export default Frame;