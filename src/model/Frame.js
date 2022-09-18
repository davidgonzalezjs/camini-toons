import Optional from './Optional';

class Frame {

    constructor({createContent}) {
        this._content = createContent();
        this._optionalOnionSkin = Optional.empty();
        this.hide();
    }

    isVisible() {
        return this._content.visible;
    }

    show() {
        this._content.visible = true;
        this._content.activate();
    }

    hide() {
        this._content.visible = false;
        this.hideOnionSkin();
    }

    showOnionSkin(aStokeColor) {
        const onionSkin = this._content.clone();
        
        onionSkin.locked = true;
        onionSkin.strokeColor = aStokeColor;
        onionSkin.opacity = 0.6;
        onionSkin.visible = true;

        this._optionalOnionSkin = Optional.with(onionSkin);
    }

    hideOnionSkin() {
        this._optionalOnionSkin.ifPresent(onionSkin => onionSkin.remove());
        this._optionalOnionSkin = Optional.empty();
    }

}

export default Frame;