import AnimationLayer from '../../model/AnimationLayer';
import {createFrameContent} from '../helpers/mocks';

const createAnimationLayer = (props = {}) => new AnimationLayer({name: props.name || 'layer name', createFrameContent});

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

    it('can be ask for details about it', () => {
        const animationLayer = createAnimationLayer({name: 'layer name'});
        animationLayer.createFrame();

        expect(animationLayer.details).toEqual({
            name: 'layer name',
            frames: [
                {number: 1},
                {number: 2}
            ]
        });
    });

    it('has a name', () => {
        const animationLayer = createAnimationLayer({name: 'layer name'});

        expect(animationLayer.name).toBe('layer name');
    });

    it(`can change it's name`, () => {
        const animationLayer = createAnimationLayer({name: 'original name'});
        animationLayer.changeNameTo('another name')

        expect(animationLayer.name).toBe('another name');
    });

});
