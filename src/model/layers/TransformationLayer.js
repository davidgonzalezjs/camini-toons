import {linearInterpolation} from '../interpolationStrategies';
import AnimationLayer from './AnimationLayer';
import { Layer } from './Layer';

export class TransformationLayer extends Layer {

    constructor(name = 'TransformationLayer') {
        super();

        this._name = name;

        this._children = [];

        this._frames = {
            x: [this.buildKeyFrame({value: 0})],
            y: [this.buildKeyFrame({value: 0})]
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
                })),
                y: this._frames.y.map((frame, index) => ({
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

    get lastTransformationFrameNumber() {
        return Math.max(this.lastFrameNumberFor('x'), this.lastFrameNumberFor('y'));
    }

    lastFrameNumberFor(property) {
        return this._frames[property].length;
    }

    get numberOfChildren() {
        return this._children.length;
    }
    get layersFlattened() {
        return [this].concat(this._children.flatMap(child => child.layersFlattened)); 
    }

    frameForXAt(frameNumber) {
        return this.frameAt({property: 'x', frameNumber});
    }

    frameForYAt(frameNumber) {
        return this.frameAt({property: 'y', frameNumber});
    }

    frameAt({property, frameNumber}) {
        return this._frames[property][Math.min(frameNumber, this.lastFrameNumberFor(property)) - 1];
    }

    interpolatedFrameNumbersBefore({property, frameNumber}) {
        const frameNumbers = [];

        for (
            let currentFrameNumber = frameNumber - 1;
            currentFrameNumber > 1 && (this.hasNoFrameAt(currentFrameNumber) || !this.hasKeyFrameForPropertyAt({property, frameNumber: currentFrameNumber}));
            currentFrameNumber--
        ) {
            frameNumbers.push(currentFrameNumber);
        }

        return frameNumbers.reverse();
    }

    interpolatedFrameNumbersAfter({property, frameNumber}) {
        const frameNumbers = [];

        for (
            let currentFrameNumber = frameNumber + 1;
            this.hasInterpolatedFrameForPropertyAt({property, frameNumber: currentFrameNumber});
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
        return frameNumber <= this.lastTransformationFrameNumber;
    }

    hasNoFrameAt(frameNumber) {
        return !this.hasFrameAt(frameNumber);
    }

    hasFrameForPropertyAt({property, frameNumber}) {
        return frameNumber <= this.lastFrameNumberFor(property);
    }

    hasKeyFrameForPropertyAt({property, frameNumber}) {
        return this.hasFrameForPropertyAt({property, frameNumber}) && this.frameAt({property, frameNumber}).isKeyFrame;
    }

    hasInterpolatedFrameForPropertyAt({property, frameNumber}) {
        return frameNumber > 1 && this.hasFrameForPropertyAt({property, frameNumber}) && !this.hasKeyFrameForPropertyAt({property, frameNumber});
    }

    // Actions
    activateFrame() {
        // TODO: ¿que significa estar activada para una TransformationLayer
    }

    addChild(aLayer) {
        this._children.push(aLayer);
    }

    showFrame(aFrameNumber) {
        this._visibleFrameNumber = aFrameNumber;

        this._children.forEach(child => {
            const x = this.frameForXAt(aFrameNumber).value;
            const y = this.frameForYAt(aFrameNumber).value;

            child.changeTransformation({x, y});
            child.showFrame(aFrameNumber)
        });
    }

    convertToKeyFrame(frameNumber) {
        this.createKeyFrameAtFrame({property: 'x', frameNumber});
        this.createKeyFrameAtFrame({property: 'y', frameNumber});
    }

    createKeyFrameAtFrame({property, frameNumber}) {
        if (this.hasKeyFrameForPropertyAt({property, frameNumber})) {
            return;
        }

        if (this.hasInterpolatedFrameForPropertyAt({property, frameNumber})) {
            this.frameAt({property, frameNumber}).isKeyFrame = true;
        }
        else {
            const newKeyFrameValue = this._frames[property][this.lastFrameNumberFor(property) - 1].value;

            const newInterpolatedFramesBefore = this.buildInterpolatedFramesBefore({property, frameNumber, value: newKeyFrameValue});
            const newKeyFrame = this.buildKeyFrame({frameNumber, value: newKeyFrameValue});

            this._frames[property].push(...newInterpolatedFramesBefore, newKeyFrame);
        }
    }

    changeKeyFrameValueForX({frameNumber, value}) {
        this.changeKeyFrameValue({property: 'x', frameNumber, value})
    }

    changeKeyFrameValueForY({frameNumber, value}) {
        this.changeKeyFrameValue({property: 'y', frameNumber, value})
    }

    changeKeyFrameValue({property, frameNumber, value}) {
        this.frameAt({property, frameNumber}).value = value;

        const interpolatedFramesBefore = this.interpolatedFrameNumbersBefore({property, frameNumber});
        const interpolatedFramesAfter = this.interpolatedFrameNumbersAfter({property, frameNumber});
 
        if (interpolatedFramesBefore.length > 0) {
            const previousKeyFrameNumber = interpolatedFramesBefore[0] - 1;
            const previousKeyFrameValue = this._frames[property][previousKeyFrameNumber - 1].value;

            this.changeInterpolatedFramesValues(property, interpolatedFramesBefore, previousKeyFrameValue, value, this._interpolationStrategy);
        }

        if (interpolatedFramesAfter.length > 0) {
            const nextKeyFrameNumber = interpolatedFramesAfter.slice(-1)[0] + 1;
            const nextKeyFrameValue = this._frames[property][nextKeyFrameNumber - 1].value;

            this.changeInterpolatedFramesValues(property, interpolatedFramesAfter, value, nextKeyFrameValue, this._interpolationStrategy);
        }     
    }

    // PRIVATE
    buildInterpolatedFramesBefore({property, frameNumber, value}) {
        return this
            .interpolatedFrameNumbersBefore({property, frameNumber})
            .map(frameNumber => this.buildInterpolationFrameWith({value}));
    }

    changeInterpolatedFramesValues(property, interpolatedFramesNumbers, firstValue, secondValue, interpolationStrategy) {
        interpolatedFramesNumbers.forEach((frameNumberOfInterpolatedFrame, index) => {
            const interpolatedValue = interpolationStrategy.applyTo(
                firstValue,
                secondValue,
                index,
                interpolatedFramesNumbers.length
            );

            this.frameAt({property, frameNumber: frameNumberOfInterpolatedFrame}).value = interpolatedValue;
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