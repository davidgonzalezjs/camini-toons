import Optional from '../Optional';
import Frame from './Frame';
import {Point} from '../Point';

class RegularFrame extends Frame {

    constructor(content, {isKeyFrame}) {
        super();
        this._isKeyFrame = isKeyFrame;
        
        this._content = content;
        this._content.pivot = {x: 0, y: 0};
        
        this._originalPosition = this._content.position;

        this._position = Point.at(0, 0);
        
        this._optionalOnionSkin = Optional.empty();
        
        this.hide();
    }

    get position() {
        return {
            x: this._originalPosition.x + this._position.x,
            y: this._originalPosition.y + this._position.y
        };
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

        //onionSkin.removeFillColor();

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
        const currentX = this._content.position.x;
        const currentY = this._content.position.y;
        
        this._content.position.x = 0;
        this._content.position.y = 0;
        
        const extendedFrame = new RegularFrame(this._content, {isKeyFrame: false}); 
        
        this._content.position.x = currentX;
        this._content.position.y = currentY;
        
        
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

    transform({x, y}) {
        this._content.position.x = this._originalPosition.x + x;
        this._content.position.y = this._originalPosition.y + y;
        
        this._optionalOnionSkin.ifPresent(onionSkin => onionSkin.position = this._content.position);
    }

    clone() {
        return new RegularFrame(this._content.clone(), {isKeyFrame: this.isKeyFrame()});
    }

    addToContent(anElement) {
        this._content.insertBelow(anElement);
        this._content.sendToBack();
        anElement.sendToBack();
    }

    // PUBLIC - Serializacion
    serialize() {
        const currentX = this._content.position.x;
        const currentY = this._content.position.y;
        
        this._content.position.x = 0;
        this._content.position.y = 0;
        
        const serializedContent = this._content.serialize();

        const serialized = {
            _content: serializedContent,
            _isKeyFrame: this.isKeyFrame(),
            _isAnimationClip: this.isAnimationClip()
        }

        this._content.position.x = currentX;
        this._content.position.y = currentY;

        return serialized
    }

    static from(serialized, contentDeserializer) {
        const content = contentDeserializer(serialized._content);
        
        return new this(content, {isKeyFrame: serialized._isKeyFrame});
    }

}

export default RegularFrame;