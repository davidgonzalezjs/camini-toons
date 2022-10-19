import Optional from '../Optional';
import Frame from './Frame';
import {Point} from '../Point';

class RegularFrame extends Frame {

    constructor(content, {isKeyFrame}) {
        super();
        this._isKeyFrame = isKeyFrame;
        this._content = content;
        this._optionalOnionSkin = Optional.empty();
        this._position = Point.at(0, 0);
        this.hide();
    }

    hasSameContentAs(aFrame) {
        return this._content === aFrame._content;
    }

    isVisible() {
        return this._content.visible;
    }

    isAnimationClip() {
        return false;
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

    extended() {
        const extendedFrame = new RegularFrame(this._content, {isKeyFrame: false}); 
        extendedFrame.show();

        return extendedFrame;
    }

    moveBy(aDeltaPosition) {
        this._position = this._position.plus(aDeltaPosition);
        
        const drawingNewPosition = this._content.position.add({x: this._position.x, y: this._position.y});
        //const drawingNewPosition = this._content.moveBy({x: this._position.x, y: this._position.y});


        this._content.position = drawingNewPosition;
        this._optionalOnionSkin.ifPresent(onionSkin => onionSkin.position = drawingNewPosition);
    }

    clone() {
        return new RegularFrame(this._content.clone(), {isKeyFrame: this.isKeyFrame()});
    }

    // PUBLIC - Serializacion
    static from(serialized, contentDeserializer) {
        const content = contentDeserializer(serialized._content);
        
        return new this(content, {isKeyFrame: serialized._isKeyFrame});
    }

}

export default RegularFrame;