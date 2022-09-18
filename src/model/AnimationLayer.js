import Frame from './Frame'

class AnimationLayer {
    
    constructor({createFrameFunction}) {
        this._createFrameFunction = createFrameFunction;

        this._frames = [];
        this.insertFrame();
        this._currentFrameNumber = 1;
    }

    existFrameAtFrameNumber(aFrameNumber) {
        return aFrameNumber >= 1 && aFrameNumber <= this.lastFrameNumber;
    }

    isVisibleFrame(aFrameNumber) {
        return this.findFrame(aFrameNumber).isVisible();
    }

    get currentFrameNumber() {
        return this._currentFrameNumber;
    }

    get lastFrameNumber() {
        return this._frames.length;
    }

    createFrame() {
        this.insertFrame();
        this.goToNextFrame();
    }

    goToFrame(aFrameNumber) {
        this.currentFrame.hide();
        this.findFrame(aFrameNumber).show();

        this._currentFrameNumber = aFrameNumber;
    }

    goToNextFrame() {
        this.goToFrame(this.currentFrameNumber + 1);
    }

    // PRIVATE
    get currentFrame() {
        return this.findFrame(this.currentFrameNumber);
    }

    findFrame(aFrameNumber) {
        return this._frames[aFrameNumber - 1];
    }

    insertFrame() {
        this._frames.push(this._createFrameFunction());
    }
}

export default AnimationLayer;