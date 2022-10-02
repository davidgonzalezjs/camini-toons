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

    it(`it does not have a visible frame for a frame number larger than it's last frame`, () => {
        const animationLayer = createAnimationLayer();
        
        expect(animationLayer.isVisibleFrame(animationLayer.lastFrameNumber + 1)).toBe(false);
    });

    it(`when it's' hidden all of it's frames are hidden`, () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();
 
        animationLayer.hide()

        expect(animationLayer.isVisible()).toBe(false);
        expect(animationLayer.isVisibleFrame(1)).toBe(false);
        expect(animationLayer.isVisibleFrame(2)).toBe(false);
    });

    it('when a layer stop being hidden and shows the current frame', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.hide()

        animationLayer.show();

        expect(animationLayer.isVisible()).toBe(true);
        expect(animationLayer.isVisibleFrame(1)).toBe(true);
    });

    it('when a hidden layer is ask to show a frame different to the previously visible frame that frame stays hidden', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();
        animationLayer.hide()

        animationLayer.showFrame(2);

        expect(animationLayer.isVisible()).toBe(false);
        expect(animationLayer.isVisibleFrame(1)).toBe(false);
    });

    it('when a hidden layer that was asked to show a frame different to the previous visible frame is shown again then the frame that was asked to show is visible', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();
        animationLayer.hide()
        animationLayer.showFrame(2);

        animationLayer.show()

        expect(animationLayer.isVisible()).toBe(true);
        expect(animationLayer.isVisibleFrame(1)).toBe(false);
        expect(animationLayer.isVisibleFrame(2)).toBe(true);
    });

    it('when a hidden frame is shown then previous visible frame is hidden', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();

        animationLayer.showFrame(2);

        expect(animationLayer.isVisibleFrame(1)).toBe(false);
        expect(animationLayer.isVisibleFrame(2)).toBe(true);
    });

    it(`when a layer with onion skins is hidden it's onion skins are hidden too`, () => {
        const animationLayer = createAnimationLayer({numberOfFrames: 3, currentFrameNumber: 2});
        animationLayer.createFrame();
        animationLayer.createFrame();
        animationLayer.showFrame(2);
        animationLayer.activateOnionSkin({beforeColor: 'red', afterColor: 'green', numberOfFramesBefore: 1, numberOfFramesAfter: 1, opacityStep: 0.5});
 
        animationLayer.hide();

        expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
    });

    it(`onion skins cannot be activated on a hidden layer`, () => {
        const animationLayer = createAnimationLayer();
        animationLayer.hide();

        animationLayer.activateOnionSkin({beforeColor: 'red', afterColor: 'green', numberOfFramesBefore: 1, numberOfFramesAfter: 1, opacityStep: 0.5});

        expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
    });

    it('can be ask for details about it', () => {
        const animationLayer = createAnimationLayer({name: 'layer name'});
        animationLayer.createFrame();

        expect(animationLayer.details).toEqual({
            name: 'layer name',
            isVisible: true,
            hasOnionSkinEnabled: false,
            frames: [
                {number: 1, isKeyFrame: true, isEmpty: true},
                {number: 2, isKeyFrame: true, isEmpty: true}
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

    it('can delete a frame', () => {
        const animationLayer = createAnimationLayer({});
        
        animationLayer.deleteFrame(1);

        expect(animationLayer.existFrameAtFrameNumber(1)).toBe(false);
    });

    it('cuando se crea un frame, este tiene un contenido distinto al resto', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();

        expect(animationLayer.lastFrameNumber).toBe(2);
        expect(animationLayer.framesHaveTheSameContent(1, 2)).toBe(false);
    });

    it('cuando se extiende la duracion del ultimo frame se crea uno nuevo que tiene el mismo contenido que el frame extendido', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.extendFrame(1);
        
        expect(animationLayer.lastFrameNumber).toBe(2);
        expect(animationLayer.framesHaveTheSameContent(1, 2)).toBe(true);
    });

    it('cuando se extiende la duracion de un frame previo a otro, el frame resultante se inserta en el medio', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();
        animationLayer.extendFrame(1);
        
        expect(animationLayer.lastFrameNumber).toBe(3);
        expect(animationLayer.framesHaveTheSameContent(1, 2)).toBe(true);
        expect(animationLayer.framesHaveTheSameContent(2, 3)).toBe(false);
    });

    it('cuando se crea un frame, este es un keyframe', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrame();

        expect(animationLayer.isKeyFrame(2)).toBe(true);
    });

    it('cuando se extiende un frame, el frame resultante no es un keyframe', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.extendFrame(1);

        expect(animationLayer.isKeyFrame(2)).toBe(false);
    });

});
