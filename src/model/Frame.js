class Frame {

    constructor({createContent}) {
        this._content = createContent();
        this.show();
    }

    isVisible() {
        return this._content.visible;
    }

    show() {
        this._content.visible = true;
    }

    hide() {
        this._content.visible = false;
    }

}

export default Frame;