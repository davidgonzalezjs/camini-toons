import AnimationDocument from '../../model/animation-document/AnimationDocument';
import AnimationLayer from '../../model/AnimationLayer';
import {createFrameContent} from '../helpers/mocks';

const createAnimationDocument = (props = {}) => new AnimationDocument({createFrameContent, hitTest: () => {}});

describe('AnimationLayer', () => {

    it(`starts with a layer containing one frame`, () => {
        const animationDocument = createAnimationDocument();

        expect(animationDocument.layersDetails).toHaveLength(1);
        expect(animationDocument.layersDetails[0].name).toBe('Capa 1');
        expect(animationDocument.layersDetails[0].frames).toHaveLength(1);
    });

    it(`can change the name of a layer`, () => {
        const animationDocument = createAnimationDocument();

        animationDocument.changeNameOfLayer(0, 'another name');

        expect(animationDocument.layersDetails[0].name).toBe('another name');
    });
    
    it(`when it has only one layer and a new frame is created it changes it's current frame and make it visible`, () => {
        const animationDocument = createAnimationDocument();
        
        animationDocument.createFrameOnLayer(0);

        expect(animationDocument.currentFrameNumber).toBe(2);
        expect(animationDocument.hasVisibleFrameAt({layerIndex: 0, frameNumber: 1})).toBe(false);
        expect(animationDocument.hasVisibleFrameAt({layerIndex: 0, frameNumber: 2})).toBe(true);
    });

    it(`when it has a layer with many frame and creates a new layer it does not change the current frame`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);

        animationDocument.createAnimationLayer();

        expect(animationDocument.currentFrameNumber).toBe(2);
        expect(animationDocument.hasVisibleFrameAt({layerIndex: 0, frameNumber: 1})).toBe(false);
        expect(animationDocument.hasVisibleFrameAt({layerIndex: 0, frameNumber: 2})).toBe(true);

        expect(animationDocument.hasVisibleFrameAt({layerIndex: 1, frameNumber: 1})).toBe(false);
        expect(animationDocument.hasVisibleFrameAt({layerIndex: 1, frameNumber: 2})).toBe(false);
    });

    it(`can go to a specific frame`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);

        animationDocument.goToFrame(1);

        expect(animationDocument.currentFrameNumber).toBe(1);
    });

    it(`when tries to go to a frame after the last frame it goes to the last frame`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);

        animationDocument.goToFrame(3);

        expect(animationDocument.currentFrameNumber).toBe(2);
    });

    it(`when tries to go to a frame before the first frame it goes to the first frame`, () => {
        const animationDocument = createAnimationDocument();
        
        animationDocument.goToFrame(0);

        expect(animationDocument.currentFrameNumber).toBe(1);
    });

    it(`when there is some next frame can go to the next frame`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(1);

        animationDocument.goToNextFrame();

        expect(animationDocument.currentFrameNumber).toBe(2);
    });

    it(`can go to the previous frame`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(2);

        animationDocument.goToPreviousFrame();

        expect(animationDocument.currentFrameNumber).toBe(1);
    });

    it(`when it's iddle it does not change frame during a tick`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(1);

        animationDocument.tick();

        expect(animationDocument.currentFrameNumber).toBe(1);
    });

    it(`when it's playing and have only one layer it advance one frame per tick on that layer `, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(1);

        animationDocument.playAnimation();

        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument.currentFrameNumber).toBe(2);
    });

    it(`when it's playing and haves many layers with many frames it advance one frame per tick on all layers `, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(1);

        animationDocument.goToFrame(1);

        animationDocument.playAnimation();

        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument.currentFrameNumber).toBe(2);
        //expect(animatinoDocument._)
    });

    it(`when it's playing it stops at the last frame`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(1);

        animationDocument.playAnimation();

        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument.currentFrameNumber).toBe(3);
    });

    it(`when it's playing on a loop and reaches the last frame on the next tick starts again`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(1);

        animationDocument.activatePlayOnALoop();
        animationDocument.playAnimation();

        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument.currentFrameNumber).toBe(1);
    });

    it(`playing on a loop can be deactivated`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(1);
        animationDocument.activatePlayOnALoop();
        animationDocument.playAnimation();

        animationDocument.deactivatePlayOnALoop();

        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument.currentFrameNumber).toBe(3);
    });

    it(`an animation can be stopped in the middle`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(1);
        animationDocument.playAnimation();
        animationDocument.tick();
        
        animationDocument.stopAnimation();

        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument.currentFrameNumber).toBe(1);
    });

    it(`can create a new layer`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();

        expect(animationDocument.layersDetails).toHaveLength(2);
        expect(animationDocument.layersDetails[0].name).toBe("Capa 1");
        expect(animationDocument.layersDetails[0].isActive).toBe(true);
        expect(animationDocument.layersDetails[1].name).toBe("Capa 2");
        expect(animationDocument.layersDetails[1].isActive).toBe(false);
    });

    it(`can create many layers`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();

        expect(animationDocument.layersDetails).toHaveLength(2);
        expect(animationDocument.layersDetails[0].name).toBe("Capa 1");
        expect(animationDocument.layersDetails[1].name).toBe("Capa 2");
    });

    it(`can create a frame on a layer`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();

        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(1);
        animationDocument.createFrameOnLayer(1);

        expect(animationDocument.layersDetails[0].frames.length).toBe(2);
        expect(animationDocument.layersDetails[1].frames.length).toBe(3);
    });

    it(`when it has one layer that is the active layer`, () => {
        const animationDocument = createAnimationDocument();
        
        expect(animationDocument.activeLayerIndex).toBe(0);
    });

    it(`the active layer can be changed`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();
        
        animationDocument.changeActiveLayerTo(0);

        expect(animationDocument.activeLayerIndex).toBe(0);
    });

    it(`starts with a visible layer`, () => {
        const animationDocument = createAnimationDocument();

        expect(animationDocument.isVisibleLayer(0)).toBe(true);
    });

    it(`can hide a layer`, () => {
        const animationDocument = createAnimationDocument();

        animationDocument.hideLayer(0);

        expect(animationDocument.isVisibleLayer(0)).toBe(false);
    });

    it(`can show a hidden layer`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.hideLayer(0);

        animationDocument.showLayer(0);

        expect(animationDocument.isVisibleLayer(0)).toBe(true);
    });

    it('can delete a frame from a layer', () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(1);

        animationDocument.deleteFrameOnLayer({layerIndex: 1, frameNumber: 2});

        const layersDetails = animationDocument.layersDetails;

        expect(layersDetails[0].frames.length).toBe(2);
        expect(layersDetails[1].frames.length).toBe(1);
    });

    it('puede extender un frame de una capa', () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();
        
        animationDocument.extendFrameOnLayer({layerIndex: 0, frameNumber: 1});

        const layersDetails = animationDocument.layersDetails;

        expect(layersDetails[0].frames.length).toBe(2);
        expect(layersDetails[0].frames[0].isKeyFrame).toBe(true);
        expect(layersDetails[0].frames[1].isKeyFrame).toBe(false);
        
        expect(layersDetails[1].frames.length).toBe(1);
    });
    
});
