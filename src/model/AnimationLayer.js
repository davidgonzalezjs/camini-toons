import RegularFrame from "./frames/RegularFrame";
import AnimationClipFrame from "./frames/AnimationClipFrame";
import Optional from './Optional'
import { AnimationClip } from './AnimationClip';
import { Point } from './Point';

class AnimationLayer {

    constructor({ name, createFrameContent }) {
        this._name = name;
        this._createFrameContent = createFrameContent;
        this._transformation = {
            x: 0,
            y: 0
        }

        this._isVisible = true;
        this._hasOnionSkinEnabled = false;
        this._frames = [];
        this._frameNumbersShowingOnionSkin = [];
        
        this._position = Point.at(0, 0); // TODO: revisar. Esto es por lo de la mano. Meter otro tipo de transformacion y limpiear esto

        this.createFrameAt(1);
        this.makeVisibleFrameNumber(1);
    }

    // Testing
    isTransformationLayer() {
        return false;
    }

    hasOnionSkinEnabled() {
        return this._hasOnionSkinEnabled;
    }

    isNamed(aName) {
        return this.name === aName;
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

    get position() {
        return this._position;
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

    get transformation() {
        return this._transformation;
    }

    // Actions
    changeTransformation(transformationData) {
        this._transformation = transformationData;

        this.propagateTransformation();
    }

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
        this.hideVisibleFrame();
        this._frames.splice(position - 1, 0, ...frames);
        this.showFrame(this._visibleFrameNumber);

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
        const frames = this.framesBetween(startFrameNumber, endFrameNumber).map(frame => frame.clone());

        const animationClip = new AnimationClip(name, frames);

        this.removeFramesFromTimeLine({fromFrame: startFrameNumber, toFrame: endFrameNumber});
        this.insertFrames(animationClip.frames, {position: startFrameNumber});
        
        return animationClip;
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

    moveBy(aDeltaPosition) {
        this._position = this._position.plus(aDeltaPosition);
        this.propagateTransformation();
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
    propagateTransformation() {
        if (this.visibleFrame) {
            //this.visibleFrame.transform(this._transformation);
            this.visibleFrame.transform({
                x: this._transformation.x + this._position.x,
                y: this._transformation.y + this._position.y,
            });
        }
    }
    
    hideVisibleFrame() {
        this.visibleFrame && this.visibleFrame.hide();
    }

    makeVisibleFrameNumber(aFrameNumber) {
        this.findFrame(aFrameNumber).ifPresent(frame => frame.show());
        this._visibleFrameNumber = aFrameNumber;
        this._visibleFrame = this.findFrame(aFrameNumber);

        this.propagateTransformation();
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

    // PUBLIC - Serializacion
    serialize() {
        return {
            _name: this.name,
            _frames: this._frames.map(frame => frame.serialize()),
            _isVisible: this.isVisible()
        }
    }

    static from(aSerializedAnimationLayer, createFrameContent, frameContentDeserializer, animationClips) {
        const {_name, _frames, _isVisible} = aSerializedAnimationLayer;

        window._frames = _frames;

        const animationLayer = new this({ name: _name, createFrameContent });
        /*
        animationLayer._frames = _frames.map(_frame =>
            _frame.isAnimationClip
                ? new AnimationClipFrame({
                    name: _frame.name,
                    frameNumber: _frame.frameNumber,
                    frames: animationClips.find(clip => clip.name === _frame.name).frames,
                    isKeyFrame
                })
                : new RegularFrame(
                    frameContentDeserializer(_frame._content),
                    {isKeyFrame: _frame._isKeyFrame}
                )
        );
        */

        animationLayer._frames = _frames.reduce(
            (deserializedFrames, serializedFrame) => {
                let frame;
                if (serializedFrame._isAnimationClip) {
                    frame = new AnimationClipFrame({
                        name: serializedFrame.name,
                        frameNumber: serializedFrame._frameNumber,
                        frames: animationClips.find(clip => clip.name === serializedFrame.name).frames,
                        isKeyFrame: serializedFrame._isKeyFrame
                    })
                }
                else {
                    const frameContent = serializedFrame._isKeyFrame
                        ? frameContentDeserializer(serializedFrame._content)
                        : deserializedFrames.slice(-1)[0]._content;

                    frame = new RegularFrame(
                        frameContent,
                        {isKeyFrame: serializedFrame._isKeyFrame}
                    );
                }

                deserializedFrames.push(frame);

                return deserializedFrames;
            },
            []
        );

        // animationLayer._frames = _frames.map(_frame => RegularFrame.from(_frame, frameContentDeserializer));
        // animationLayer._frames = _frames.map(_frame => new RegularFrame(createFrameContent, {isKeyFrame: true}));
        animationLayer._isVisible = _isVisible;
        
        return animationLayer;
    }
}

export default AnimationLayer;