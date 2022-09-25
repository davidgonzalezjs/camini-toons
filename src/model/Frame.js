import Optional from './Optional';

class Frame {

    constructor(content) {
        this._content = content;
        this._optionalOnionSkin = Optional.empty();
        this.hide();
    }

    isVisible() {
        return this._content.visible;
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

}

export default Frame;