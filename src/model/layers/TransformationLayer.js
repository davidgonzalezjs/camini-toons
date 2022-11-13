import {linearInterpolation} from '../interpolationStrategies';
import AnimationLayer from './AnimationLayer';
import { Layer } from './Layer';

export class TransformationLayer extends Layer {

    constructor(name = 'TransformationLayer') {
        super();

        this._name = name;

        this._children = [];

        this._frames = {
            x: [this.buildKeyFrame({value: 0})]
        };

        this._visibleFrameNumber = 1;

        this._interpolationStrategy = linearInterpolation;
    }

    isNamed(aName) {
        return this.name === aName;
    }

    // Accessing
    get details() {
        return {
            name: this._name,
            frames: {
                x: this._frames.x.map((frame, index) => ({
                    ...frame,
                    number: index + 1
                }))
            },
            children: this._children.map(child => child.details),
            type: 'TransformationLayer'
        };
    }

    get lastFrameNumber() {
        return Math.max(...this._children.map(child => child.lastFrameNumber));
    }

    get lastFrameNumberForX() {
        return this._frames.x.length;
    }

    get lastFrameForX() {
        return this.frameForXAt(this.lastFrameNumberForX)
    }

    get numberOfChildren() {
        return this._children.length;
    }
    get layersFlattened() {
        return [this].concat(this._children.flatMap(child => child.layersFlattened)); 
    }

    frameForXAt(frameNumber) {
        return this._frames.x[Math.min(frameNumber, this.lastFrameNumberForX) - 1];
    }

    keyFrameNumberBefore(targetFrameNumber) {
        let currentFrameNumber = targetFrameNumber;

        while (currentFrameNumber > 1 && !this.hasKeyFrameAt(currentFrameNumber - 1)) {
            currentFrameNumber -= 1;
        }

        return currentFrameNumber;
    }

    interpolatedFrameNumbersBefore(targetFrameNumber) {
        const frameNumbers = [];

        for (
            let currentFrameNumber = targetFrameNumber - 1;
            currentFrameNumber > 1 && (this.hasNoFrameAt(currentFrameNumber) || !this.hasKeyFrameAt(currentFrameNumber));
            currentFrameNumber--
        ) {
            frameNumbers.push(currentFrameNumber);
        }

        return frameNumbers.reverse();
    }

    interpolatedFrameNumbersAfter(targetFrameNumber) {
        const frameNumbers = [];

        for (
            let currentFrameNumber = targetFrameNumber + 1;
            this.hasInterpolatedFrameAt(currentFrameNumber);
            currentFrameNumber++
        ) {
            frameNumbers.push(currentFrameNumber);
        }

        return frameNumbers;
    }

    moveBy(aDeltaPosition) {
        this._children.forEach(child => child.moveBy(aDeltaPosition))
    }

    // Testing
    isTransformationLayer() {
        return true;
    }

    hasChild(aLayer) {
        return this._children.includes(aLayer);
    }

    hasFrameAt(frameNumber) {
        return frameNumber <= this.lastFrameNumberForX;
        //return this.frameForXAt(frameNumber) !== undefined;
    }

    hasNoFrameAt(frameNumber) {
        return !this.hasFrameAt(frameNumber);
    }

    hasKeyFrameAt(frameNumber) {
        return this.hasFrameAt(frameNumber) && this.frameForXAt(frameNumber).isKeyFrame;
    }

    hasInterpolatedFrameAt(frameNumber) {
        return frameNumber > 1 && this.hasFrameAt(frameNumber) && !this.hasKeyFrameAt(frameNumber);
    }

    // Actions
    activateFrame() {
        // TODO: ¿que significa estar activada para una TransformationLayer
    }

    addChild(aLayer) {
        this._children.push(aLayer);

        //aLayer.changeTransformation();
    }

    showFrame(aFrameNumber) {
        this._visibleFrameNumber = aFrameNumber;

        this._children.forEach(child => {
            const frame = this.frameForXAt(aFrameNumber);

            child.changeTransformation({x: frame.value, y: 0});
            child.showFrame(aFrameNumber)
        });
    }

    createKeyFrameForXAtFrame(frameNumber) {
        if (this.hasKeyFrameAt(frameNumber)) {
            return;
        }

        if (this.hasInterpolatedFrameAt(frameNumber)) { 
            this.frameForXAt(frameNumber).isKeyFrame = true;
        }
        else {
            const value = this.lastFrameForX.value;

            const newInterpolatedFrames = this.buildInterpolatedFrames(frameNumber, value);
            const newKeyFrame = this.buildKeyFrame({frameNumber, value});

            this._frames.x.push(...newInterpolatedFrames, newKeyFrame);
        }
    }

    changeKeyFrameValueForX({frameNumber, value}) {
        this.frameForXAt(frameNumber).value = value;

        const interpolatedFramesBefore = this.interpolatedFrameNumbersBefore(frameNumber);
        const interpolatedFramesAfter = this.interpolatedFrameNumbersAfter(frameNumber);

        if (interpolatedFramesBefore.length > 0) {
            const previousKeyFrameNumber = interpolatedFramesBefore[0] - 1;
            const previousKeyFrameValue = this._frames.x[previousKeyFrameNumber - 1].value;

            this.changeInterpolatedFramesValues(interpolatedFramesBefore, previousKeyFrameValue, value, this._interpolationStrategy);
        }

        if (interpolatedFramesAfter.length > 0) {
            const nextKeyFrameNumber = interpolatedFramesAfter.slice(-1)[0] + 1;
            const nextKeyFrameValue = this._frames.x[nextKeyFrameNumber - 1].value;

            this.changeInterpolatedFramesValues(interpolatedFramesAfter, value, nextKeyFrameValue, this._interpolationStrategy);
        }     
    }

    // PRIVATE
    buildInterpolatedFrames(frameNumber, value) {
        return this
            .interpolatedFrameNumbersBefore(frameNumber)
            .map(frameNumber => this.buildInterpolationFrameWith({value}));
    }

    changeInterpolatedFramesValues(interpolatedFramesNumbers, firstValue, secondValue, interpolationStrategy) {
        interpolatedFramesNumbers.forEach((frameNumberOfInterpolatedFrame, index) => {
            const interpolatedValue = interpolationStrategy.applyTo(
                firstValue,
                secondValue,
                index,
                interpolatedFramesNumbers.length
            );

            this.frameForXAt(frameNumberOfInterpolatedFrame).value = interpolatedValue;
        });
    }

    buildKeyFrame({value}) {
        return {
            value,
            isKeyFrame: true,
        }
    }

    buildInterpolationFrameWith({value}) {
        return {
            value,
            isKeyFrame: false
        }
    }

    //
    startPlaying() {
        this._children.forEach(child => child.startPlaying());
    }

    stopPlaying() {
        this._children.forEach(child => child.stopPlaying());
    }

    serialize() {
        return {
            children: this._children.map(child => child.serialize()),
            frames: this._frames,
            name: this._name,
            type: "TransformationLayer"
        };
    }

    static from(serialized, createFrameContent, frameContentDeserializer, animationClips) {
        const deserialized = new this(serialized.name)

        deserialized._frames = serialized.frames;
        deserialized._children = serialized.children.map(layer =>
            AnimationLayer.from(
                layer,
                createFrameContent,
                frameContentDeserializer,
                animationClips
              )
        );

        return deserialized;
    }
}