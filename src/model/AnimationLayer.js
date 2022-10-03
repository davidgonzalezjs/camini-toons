import Frame from './Frame';
import Optional from './Optional'

class AnimationLayer {

    constructor({ name, createFrameContent }) {
        this._name = name;
        this._createFrameContent = createFrameContent;

        this._isVisible = true;
        this._hasOnionSkinEnabled = false;
        this._frames = [];
        this._frameNumbersShowingOnionSkin = [];
        
        this.createFrame();
        this.makeVisibleFrameNumber(1);
    }

    // Testing
    isVisible() {
        return this._isVisible;
    }

    isVisibleFrame(aFrameNumber) {
        return this.findFrame(aFrameNumber).map(frame => frame.isVisible()).getOrElse(() => false);
    }


    isKeyFrame(aFrameNumber) {
        return this.findFrame(aFrameNumber).get().isKeyFrame();
    }

    framesHaveTheSameContent(aFrameNumber, anotherFrameNumber) {
        const aFrame = this.findFrame(aFrameNumber).get();
        const anotherFrame = this.findFrame(anotherFrameNumber).get();

        return aFrame.hasSameContentAs(anotherFrame);
    }

    extendFrame(aFrameNumber) {
        const frameToExtend = this.findFrame(aFrameNumber).get();
        const extendedFrame = frameToExtend.extended();

        this._frames.splice(aFrameNumber, 0, extendedFrame);
    }

    convertToKeyFrame(aFrameNumber) {
        const targetFrame = this.findFrame(aFrameNumber).get();
        targetFrame.convertToKeyFrame();

        let nextFrameNumber = aFrameNumber + 1;

        while (this.findFrame(nextFrameNumber).map(frame => !frame.isKeyFrame()).getOrElse(() => false)) {
            this.findFrame(nextFrameNumber).get().changeContentFor(targetFrame._content);

            nextFrameNumber += 1;
        }

    }

    existFrameAtFrameNumber(aFrameNumber) {
        return aFrameNumber >= 1 && aFrameNumber <= this.lastFrameNumber;
    }

    hasOnionSkinEnabled() {
        return this._hasOnionSkinEnabled;
    }

    // Accessing
    get name() {
        return this._name;
    }

    get lastFrameNumber() {
        return this._frames.length;
    }

    get frameNumbersShowingOnionSkin() {
        return this._frameNumbersShowingOnionSkin;
    }

    get details() {
        return {
            name: this.name,
            isVisible: this._isVisible,
            hasOnionSkinEnabled: this.hasOnionSkinEnabled(),
            frames: this._frames.map((frame, index) => ({
                number: index + 1,
                isKeyFrame: frame.isKeyFrame(),
                isEmpty: frame.isEmpty()
            }))
        };
    }

    // Actions
    changeNameTo(aNewName) {
        this._name = aNewName;
    }

    createFrame() {
        const newFrame = new Frame(this._createFrameContent(), {isKeyFrame: true});
        this._frames.push(newFrame);

        return newFrame;
    }

    createFrameAt(aTargetFrameNumber) {
        const newFrame = new Frame(this._createFrameContent(), {isKeyFrame: true});
        this._frames.splice(aTargetFrameNumber - 1, 0, newFrame);

        this.convertToKeyFrame(aTargetFrameNumber + 1);
        
        return newFrame;
    }

    showFrame(aFrameNumber) {
        this.hideVisibleFrame();
        this.makeVisibleFrameNumber(aFrameNumber);

        if (!this.isVisible()) this.hideVisibleFrame();

        if (!this._isPlaying && this.hasOnionSkinEnabled()) {
            this.removeCurrentOnionSkins();
            this.showNewOnionSkins();
        };
    }

    deleteFrame(aFrameNumber) {
        const frameToDelete = this.findFrame(aFrameNumber).get();
        
        if (frameToDelete.isKeyFrame()) {
            this
                .findFrame(aFrameNumber + 1)
                .ifPresent(nextFrame => {
                    if (nextFrame.isKeyFrame()) {
                        frameToDelete.deleteContent();
                    }
                    else {
                        nextFrame.convertToKeyFrame();
                    }
                });
        }
        
        const frameToDeleteIndex = aFrameNumber - 1;
        this._frames.splice(frameToDeleteIndex, 1);
    }

    hide() {
        this._isVisible = false;
        this.hideVisibleFrame();
        this.deactivateOnionSkin();
    }

    show() {
        this._isVisible = true;
        this.visibleFrame.show();
    }

    activateFrame() {
        this.visibleFrame.activate();
    }

    activateOnionSkin(onionSkinSettings) {
        this.removeCurrentOnionSkins(); // TODO: agrega test
        this._onionSkinSettings = onionSkinSettings;

        if (this.isVisible()) {
            this._hasOnionSkinEnabled = true;
            this.showNewOnionSkins();
        }
    }

    deactivateOnionSkin() {
        this._hasOnionSkinEnabled = false;
        this.removeCurrentOnionSkins();
    }

    // PRIVATE
    get visibleFrame() {
        return this._frames[this._visibleFrameNumber - 1];
    }

    findFrame(aFrameNumber) {
        return Optional.fromNullable(this._frames[aFrameNumber - 1]);
    }

    hideVisibleFrame() {
        this.visibleFrame && this.visibleFrame.hide();
    }

    makeVisibleFrameNumber(aFrameNumber) {
        this.findFrame(aFrameNumber).ifPresent(frame => frame.show());
        this._visibleFrameNumber = aFrameNumber;
    }

    showNewOnionSkins() {
        const {beforeColor, afterColor, numberOfFramesBefore, numberOfFramesAfter, opacityStep} = this._onionSkinSettings;
        
        const previousFramesShowingOnionSkin =
            new Array(numberOfFramesBefore)
                .fill()
                .map((_, index) => index + 1)
                .map(offset => this._visibleFrameNumber - offset)
                .filter(frameNumber => this.existFrameAtFrameNumber(frameNumber));
        
        previousFramesShowingOnionSkin
            .reduce((opacity, frameNumber) => {
                this.findFrame(frameNumber).get().showOnionSkin(beforeColor, opacity);
                return opacity - opacityStep;
            }, 1 - opacityStep);
        
        const nextFramesShowingOnionSkin =
            new Array(numberOfFramesAfter)
                .fill()
                .map((_, index) => index + 1)
                .map(offset => this._visibleFrameNumber + offset)
                .filter(frameNumber => this.existFrameAtFrameNumber(frameNumber));

        nextFramesShowingOnionSkin
            .reduce((opacity, frameNumber) => {
                this.findFrame(frameNumber).get().showOnionSkin(afterColor, opacity);
                return opacity - opacityStep;
            }, 1 - opacityStep);

        this._frameNumbersShowingOnionSkin = previousFramesShowingOnionSkin.reverse().concat(nextFramesShowingOnionSkin);
    }

    removeCurrentOnionSkins() {
        this._frameNumbersShowingOnionSkin.forEach(frameNumber => this.findFrame(frameNumber).get().hideOnionSkin());
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