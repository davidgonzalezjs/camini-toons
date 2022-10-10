import RegularFrame from './frames/RegularFrame';
import AnimationClipFrame from './frames/AnimationClipFrame';
import Optional from './Optional'
import { AnimationClip } from './AnimationClip';

class AnimationLayer {

    constructor({ name, createFrameContent }) {
        this._name = name;
        this._createFrameContent = createFrameContent;

        this._isVisible = true;
        this._hasOnionSkinEnabled = false;
        this._frames = [];
        this._frameNumbersShowingOnionSkin = [];
        
        this.createFrameAt(1);
        this.makeVisibleFrameNumber(1);
    }

    // Testing
    hasOnionSkinEnabled() {
        return this._hasOnionSkinEnabled;
    }

    isVisible() {
        return this._isVisible;
    }

    isVisibleFrame(aFrameNumber) {
        return this.findFrame(aFrameNumber).satisfy(frame => frame.isVisible());
    }

    isKeyFrame(aFrameNumber) {
        return this.findFrame(aFrameNumber).get().isKeyFrame();
    }

    isExtendedFrame(aFrameNumber) {
        return this.findFrame(aFrameNumber).satisfy(frame => frame.isExtendedFrame());
    }

    isAnimationClipFrame(aFrameNumber) {
        return this.findFrame(aFrameNumber).get().isAnimationClip();
    }

    framesHaveTheSameContent(aFrameNumber, anotherFrameNumber) {
        const aFrame = this.findFrame(aFrameNumber).get();
        const anotherFrame = this.findFrame(anotherFrameNumber).get();

        return aFrame.hasSameContentAs(anotherFrame);
    }

    existFrameAt(aFrameNumber) {
        return this.findFrame(aFrameNumber).isPresent();
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
                isEmpty: frame.isEmpty(),
                isAnimationClip: frame.isAnimationClip()
            }))
        };
    }

    // Actions
    changeNameTo(aNewName) {
        this._name = aNewName;
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

    showFrame(aFrameNumber) {
        this.hideVisibleFrame();
        this.makeVisibleFrameNumber(aFrameNumber);

        if (!this.isVisible()) this.hideVisibleFrame();

        if (!this._isPlaying && this.hasOnionSkinEnabled()) {
            this.removeCurrentOnionSkins();
            this.showNewOnionSkins();
        };
    }

    activateFrame() {
        this.visibleFrame.activate();
    }

    createFrameAt(aTargetFrameNumber) {
        const newFrame = new RegularFrame(this._createFrameContent(), {isKeyFrame: true});
        
        this.insertOneFrame(newFrame, {position: aTargetFrameNumber});
        
        return newFrame;
    }

    insertOneFrame(frame, {position}) {
        return this.insertFrames([frame], {position});
    }

    insertFrames(frames, {position}) {
        this._frames.splice(position - 1, 0, ...frames);
        
        const frameNumberAfterLastInsertedFrame = position + frames.length;
        
        // TODO: agregar tests para este metodo. Recordar caso de insertar frame entre frames extendidos
        if (this.existFrameAt(frameNumberAfterLastInsertedFrame) && !this.framesHaveTheSameContent(position, frameNumberAfterLastInsertedFrame)) {
            this.convertToKeyFrame(frameNumberAfterLastInsertedFrame);
        }
    }

    extendFrame(aFrameNumber) {
        const frameToExtend = this.findFrame(aFrameNumber).get();
        
        this.insertOneFrame(frameToExtend.extended(), {position: aFrameNumber + 1});
    }

    convertToKeyFrame(aFrameNumber) {
        const targetFrame = this.findFrame(aFrameNumber).get();
        targetFrame.convertToKeyFrame();
        
        let nextFrameNumber = aFrameNumber + 1;
        while (this.isExtendedFrame(nextFrameNumber)) {
            this.findFrame(nextFrameNumber).get().changeContentFor(targetFrame._content);

            nextFrameNumber += 1;
        }
    }

    extractToAnimationClip({name, startFrameNumber, endFrameNumber}) {
        // TODO: falta testear lo de clonar el frame
        const animationClipFrames =
            this
                .framesBetween(startFrameNumber, endFrameNumber)
                .map((frame, index) => new AnimationClipFrame({name, content: frame.clone(), isKeyFrame: index === 0}));

        this.removeFramesFromTimeLine({fromFrame: startFrameNumber, toFrame: endFrameNumber});
        this.insertFrames(animationClipFrames, {position: startFrameNumber});
        
        return new AnimationClip(name, animationClipFrames);
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

    // PRIVATE - Accessing
    get visibleFrame() {
        return this._frames[this._visibleFrameNumber - 1];
    }

    findFrame(aFrameNumber) {
        return Optional.fromNullable(this._frames[aFrameNumber - 1]);
    }

    framesBetween(startFrameNumber, endFrameNumber) {
        return this._frames.slice(startFrameNumber - 1, endFrameNumber);
    }

    // PRIVATE - Actions
    hideVisibleFrame() {
        this.visibleFrame && this.visibleFrame.hide();
    }

    makeVisibleFrameNumber(aFrameNumber) {
        this.findFrame(aFrameNumber).ifPresent(frame => frame.show());
        this._visibleFrameNumber = aFrameNumber;
    }

    removeFramesFromTimeLine({fromFrame, toFrame}) {
        this.framesBetween(fromFrame, toFrame).forEach((_) => {
            this.deleteFrame(fromFrame); // TODO: ¡¡¡Ojo!!! se borra un elemento de la coleccion que se esta iterando
        });
    }

    showNewOnionSkins() {
        const {beforeColor, afterColor, numberOfFramesBefore, numberOfFramesAfter, opacityStep} = this._onionSkinSettings;
        
        const previousFramesShowingOnionSkin =
            new Array(numberOfFramesBefore)
                .fill()
                .map((_, index) => index + 1)
                .map(offset => this._visibleFrameNumber - offset)
                .filter(frameNumber => this.existFrameAt(frameNumber));
        
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
                .filter(frameNumber => this.existFrameAt(frameNumber));

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