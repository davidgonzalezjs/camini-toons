import AnimationLayer from '../../model/layers/AnimationLayer';
import {animationDocumentMockedProps, createFrameContent} from '../helpers/mocks';

const createAnimationLayer = (props = {}) => new AnimationLayer({name: props.name || 'layer name', createFrameContent});

const createEmptyAnimationLayer = () => {
    const animationLayer = createAnimationLayer();
    animationLayer.deleteFrame(1);
    
    return animationLayer;
}

describe('AnimationClip', () => {

    it('se puede extraer un frame a un clip de animacion', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.extendFrame(1);

        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 1})
        
        expect(animationLayer.lastFrameNumber).toBe(2);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(2)).toBe(false);
    });

    it('se pueden extraer varios frames a un clip de animacion', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.extendFrame(1);
        animationLayer.extendFrame(1);

        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 2})
        
        expect(animationLayer.lastFrameNumber).toBe(3);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(2)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(3)).toBe(false);
    });

    it('se puede extraer el ultimo frame a un clip de animacion', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);

        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 1})
        
        expect(animationLayer.lastFrameNumber).toBe(1);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(true);
    });

    it('cuando se extrae a un clip de animacion un keyframe vecino de un frame extendido, el frame extendido se convierte en key frame', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.extendFrame(1);

        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 1})
        
        expect(animationLayer.isKeyFrame(2)).toBe(true);
    });

    it('cuando se extraen varios frames a un clip de animacion, solo el primero es un keyframe', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.createFrameAt(2);

        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 2})
        
        expect(animationLayer.isKeyFrame(1)).toBe(true);
        expect(animationLayer.isKeyFrame(2)).toBe(false);
    });

    it('se puede insertar un clip de animacion antes del primer frame', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.createFrameAt(2);
        
        const animationClip = animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 2, endFrameNumber: 2})
        
        animationLayer.insertFrames(animationClip.frames, {position: 1});

        expect(animationLayer.lastFrameNumber).toBe(3);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(2)).toBe(false);
        expect(animationLayer.isAnimationClipFrame(3)).toBe(true);
    });

    it('se puede insertar un clip de animacion luego del ultimo frame', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.createFrameAt(2);
        
        const animationClip = animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 1})
        
        animationLayer.insertFrames(animationClip.frames, {position: 3});

        expect(animationLayer.lastFrameNumber).toBe(3);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(2)).toBe(false);
        expect(animationLayer.isAnimationClipFrame(3)).toBe(true);
    });

    it('se puede insertar un clip de animacion en medio de otros frames', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.createFrameAt(2);
        
        const animationClip = animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 2, endFrameNumber: 2});
        
        animationLayer.insertFrames(animationClip.frames, {position: 2});

        expect(animationLayer.lastFrameNumber).toBe(3);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(false);
        expect(animationLayer.isAnimationClipFrame(2)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(3)).toBe(true);
    });

    it('se puede extender un clip de animacion a partir de su ultimo frame', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.createFrameAt(2);
        animationLayer.createFrameAt(3);
        
        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 3});
        
        animationLayer.extendFrame(3);

        expect(animationLayer.lastFrameNumber).toBe(4);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(2)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(3)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(4)).toBe(true);

        expect(animationLayer._frames.map(animationClipFrame => animationClipFrame.frameIndex)).toEqual([0, 1, 2, 0])
    });

    it('se puede extender un clip de animacion a partir de un frame previo al ultimo que no sea keyframe', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.createFrameAt(2);
        animationLayer.createFrameAt(3);
        
        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 3});
        
        animationLayer.extendFrame(2);

        expect(animationLayer.lastFrameNumber).toBe(4);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(2)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(3)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(4)).toBe(true);

        expect(animationLayer._frames.map(animationClipFrame => animationClipFrame.frameIndex)).toEqual([0, 1, 2, 0])
    });

    it('se puede extender un clip de animacion para que se repita la secuencia de cuadros mas de una vez', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.createFrameAt(2);
        
        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 2});
        
        animationLayer.extendFrame(2);
        animationLayer.extendFrame(2);

        animationLayer.extendFrame(2);

        expect(animationLayer._frames.map(animationClipFrame => animationClipFrame.frameIndex))
            .toEqual([0, 1, 0, 1, 0]);
    });
});
