import AnimationDocument from '../../model/animation-document/AnimationDocument';
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

    it(`when it's iddle it does not change frame during a tick`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrame();
        animationDocument.createFrame();
        animationDocument.goToFrame(1);

        animationDocument.tick();

        expect(animationDocument._currentFrameNumber).toBe(1);
    });

    it(`when it's playing it advance one frame per tick`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrame();
        animationDocument.createFrame();
        animationDocument.goToFrame(1);

        animationDocument.playAnimation();

        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument._currentFrameNumber).toBe(2);
    });

    it(`when it's playing it stops at the last frame`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrame();
        animationDocument.createFrame();
        animationDocument.goToFrame(1);

        animationDocument.playAnimation();

        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument._currentFrameNumber).toBe(3);
    });

    it(`when it's playing on a loop and reaches the last frame on the next tick starts again`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrame();
        animationDocument.createFrame();
        animationDocument.goToFrame(1);

        animationDocument.activatePlayOnALoop();
        animationDocument.playAnimation();

        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument._currentFrameNumber).toBe(1);
    });

    it(`playing on a loop can be deactivated`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrame();
        animationDocument.createFrame();
        animationDocument.goToFrame(1);
        animationDocument.activatePlayOnALoop();
        animationDocument.playAnimation();

        animationDocument.deactivatePlayOnALoop();

        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument._currentFrameNumber).toBe(3);
    });

    it(`an animation can be stopped in the middle`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrame();
        animationDocument.createFrame();
        animationDocument.goToFrame(1);
        animationDocument.playAnimation();
        animationDocument.tick();
        
        animationDocument.stopAnimation();

        animationDocument.tick();
        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument._currentFrameNumber).toBe(1);
    });

});
