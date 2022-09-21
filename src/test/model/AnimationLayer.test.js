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

    it(`when a layer is hidden the all it's frames are hidden`, () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();

        animationLayer.hide()

        expect(animationLayer.isVisible()).toBe(false);
        expect(animationLayer.isVisibleFrame(1)).toBe(false);
        expect(animationLayer.isVisibleFrame(2)).toBe(false);
    });

    it('when a layer is hidden and tries to show another frame that frame stays hidden', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();
        animationLayer.hide()

        animationLayer.showFrame(2);

        expect(animationLayer.isVisible()).toBe(false);
        expect(animationLayer.isVisibleFrame(2)).toBe(false);
    });

    it('when a hidden layer is ask to show another frame and after it is shown then the new frame is shown', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();
        animationLayer.hide()
        animationLayer.showFrame(2);

        animationLayer.show()

        expect(animationLayer.isVisible()).toBe(true);
        expect(animationLayer.isVisibleFrame(1)).toBe(false);
        expect(animationLayer.isVisibleFrame(2)).toBe(true);
    });
    
    it('when a layer stop being hidden and shows the current frame', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.hide()

        animationLayer.show();

        expect(animationLayer.isVisible()).toBe(true);
        expect(animationLayer.isVisibleFrame(1)).toBe(true);
    });

    it(`when a layer with onion skins is hidden it's onion skins are hidden too`, () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();
        animationLayer.createFrame();
        animationLayer.showFrame(2);
        animationLayer.activateOnionSkin();
 
        animationLayer.hide();

        expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
    });

    it(`onion skins cannot be activated on a hidden layer`, () => {
        const animationLayer = createAnimationLayer();
        animationLayer.hide();

        animationLayer.activateOnionSkin();

        expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
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
            isVisible: true,
            hasOnionSkinEnabled: false,
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