import AnimationLayer from '../../model/AnimationLayer'
import Frame from '../../model/Frame';

const createContent = () => ({});
const createFrameFunction = () => new Frame({createContent});

const createAnimationLayer = () => new AnimationLayer({createFrameFunction});

describe('AnimationLayer', () => {

    it('starts with one frame', () => {
        const animationLayer = createAnimationLayer();

        expect(animationLayer.currentFrameNumber).toBe(1);
        expect(animationLayer.lastFrameNumber).toBe(1);

        expect(animationLayer.existFrameAtFrameNumber(1)).toBe(true);
        expect(animationLayer.isVisibleFrame(1)).toBe(true);
    });

    it('can create a new frame', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();

        expect(animationLayer.currentFrameNumber).toBe(2);
        expect(animationLayer.lastFrameNumber).toBe(2);
        expect(animationLayer.existFrameAtFrameNumber(2)).toBe(true);
    });

    it('when a new frame is created the previous frame is hidden', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();

        expect(animationLayer.isVisibleFrame(1)).toBe(false);
        expect(animationLayer.existFrameAtFrameNumber(1)).toBe(true);
        
        expect(animationLayer.isVisibleFrame(2)).toBe(true);
        expect(animationLayer.existFrameAtFrameNumber(2)).toBe(true);
    });

    it('can go to a specific frame', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();

        animationLayer.goToFrame(1);

        expect(animationLayer.currentFrameNumber).toBe(1);
        expect(animationLayer.lastFrameNumber).toBe(2);
    });

    it('when going to a specific frame different to the current frame only the new current frame is visible', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();

        animationLayer.goToFrame(1);

        expect(animationLayer.isVisibleFrame(1)).toBe(true);
        expect(animationLayer.isVisibleFrame(2)).toBe(false);
    });

    it('can go to the next frame', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();
        animationLayer.goToFrame(1);

        animationLayer.goToNextFrame();

        expect(animationLayer.currentFrameNumber).toBe(2);
        expect(animationLayer.lastFrameNumber).toBe(2);
    });

    it('after the last frame number there is no frame', () => {
        const animationLayer = createAnimationLayer();
        
        expect(animationLayer.existFrameAtFrameNumber(animationLayer.lastFrameNumber + 1)).toBe(false);
    })

    it('before frame number one there is no frame', () => {
        const animationLayer = createAnimationLayer();
        
        expect(animationLayer.existFrameAtFrameNumber(0)).toBe(false);
    })

});
