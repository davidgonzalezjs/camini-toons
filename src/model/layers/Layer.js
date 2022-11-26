import { subclassResponsibility } from "../errors";

export class Layer {

    // Testing
    isNamed(aName) {
        return this.name === aName;
    }

    // Accessing
    get details() {
        return subclassResponsibility();
    }

    get lastFrameNumber() {
        return subclassResponsibility();
    }
    
    get layersFlattened() {
        return subclassResponsibility();
    }

    moveBy(aDeltaPosition) {
        return subclassResponsibility();
    }

    // Testing
    isTransformationLayer() {
        return subclassResponsibility();
    }

    hasChild(aLayer) {
        return subclassResponsibility();
    }

    hasFrameAt(frameNumber) {
        return frameNumber <= this.lastFrameNumber;
    }

    // Actions
    showFrame(aFrameNumber) {
        return subclassResponsibility();
    }

    // PRIVATE
    startPlaying() {
        return subclassResponsibility();
    }

    stopPlaying() {
        return subclassResponsibility();
    }

}