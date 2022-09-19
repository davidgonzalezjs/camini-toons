class AnimationLayer {

    constructor({ createFrameFunction }) {
        this._createFrameFunction = createFrameFunction;

        this._hasOnionSkinEnabled = false;
        this._frames = [];
        this._frameNumbersShowingOnionSkin = [];
        
        this.createFrame();
        this.makeVisibleFrameNumber(1);
    }

    // Testing
    isVisibleFrame(aFrameNumber) {
        return this.findFrame(aFrameNumber).isVisible();
    }

    hasOnionSkinEnabled() {
        return this._hasOnionSkinEnabled;
    }

    // Accessing
    get lastFrameNumber() {
        return this._frames.length;
    }

    get frameNumbersShowingOnionSkin() {
        return this._frameNumbersShowingOnionSkin;
    }

    get framesDetails() {
        return [...Array(this.lastFrameNumber)].map((_, index) => ({number: index + 1}));
    }

    // Actions
    createFrame() {
        this._frames.push(this._createFrameFunction());
    }

    showFrame(aFrameNumber) {
        this.hideVisibleFrame();
        this.makeVisibleFrameNumber(aFrameNumber);

        if (!this._isPlaying && this.hasOnionSkinEnabled()) {
            this.removeCurrentOnionSkins();
            this.showNewOnionSkins();
        };
    }

    activateOnionSkin() {
        this._hasOnionSkinEnabled = true;
        this.showNewOnionSkins();
    }

    deactivateOnionSkin() {
        this._hasOnionSkinEnabled = false;
        this.removeCurrentOnionSkins();
    }

    // PRIVATE
    existFrameAtFrameNumber(aFrameNumber) {
        return aFrameNumber >= 1 && aFrameNumber <= this.lastFrameNumber;
    }

    get visibleFrame() {
        return this._frames[this._visibleFrameNumber - 1];
    }

    findFrame(aFrameNumber) {
        return this._frames[aFrameNumber - 1];
    }

    hideVisibleFrame() {
        this.visibleFrame.hide();
    }

    makeVisibleFrameNumber(aFrameNumber) {
        this.findFrame(aFrameNumber).show();
        this._visibleFrameNumber = aFrameNumber;
    }

    showNewOnionSkins() {
        const previousFramesShowingOnionSkin = [this._visibleFrameNumber - 1].filter(frameNumber => this.existFrameAtFrameNumber(frameNumber)); 
        previousFramesShowingOnionSkin.forEach(frameNumber => this.findFrame(frameNumber).showOnionSkin('red'));
        
        const nextFramesShowingOnionSkin = [this._visibleFrameNumber + 1].filter(frameNumber => this.existFrameAtFrameNumber(frameNumber));
        nextFramesShowingOnionSkin.forEach(frameNumber => this.findFrame(frameNumber).showOnionSkin('green'));
        
        this._frameNumbersShowingOnionSkin = previousFramesShowingOnionSkin.concat(nextFramesShowingOnionSkin);
    }

    removeCurrentOnionSkins() {
        this._frameNumbersShowingOnionSkin.forEach(frameNumber => this.findFrame(frameNumber).hideOnionSkin());
        this._frameNumbersShowingOnionSkin = []
    }

    startPlaying() {
        this._isPlaying = true;
        this.removeCurrentOnionSkins();
    }

    stopPlaying() {
        this._isPlaying = false;

        if (this.hasOnionSkinEnabled()) {
            this.showNewOnionSkins();
        }
    }
}

export default AnimationLayer;