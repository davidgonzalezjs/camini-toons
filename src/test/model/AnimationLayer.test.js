import AnimationLayer from '../../model/AnimationLayer'
import Frame from '../../model/Frame';

const createContent = () => ({
    activateOnionSkin: jest.fn(),
    activate: jest.fn(),
});
const createFrameFunction = () => new Frame({createContent});

const createAnimationLayer = () => new AnimationLayer({createFrameFunction});

describe('AnimationLayer', () => {

    it('starts with one visible frame', () => {
        const animationLayer = createAnimationLayer();

        expect(animationLayer.lastFrameNumber).toBe(1);
        expect(animationLayer.isVisibleFrame(1)).toBe(true);
    });

    it('when a new frame is created it is not visible', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();

        expect(animationLayer.lastFrameNumber).toBe(2);
        expect(animationLayer.isVisibleFrame(1)).toBe(true);
        expect(animationLayer.isVisibleFrame(2)).toBe(false);
    });

    it('when a hidden frame is shown then previous visible frame is hidden', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();

        animationLayer.showFrame(2);

        expect(animationLayer.isVisibleFrame(1)).toBe(false);
        expect(animationLayer.isVisibleFrame(2)).toBe(true);
    });

});
