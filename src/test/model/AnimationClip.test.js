import AnimationLayer from '../../model/AnimationLayer';
import {createFrameContent} from '../helpers/mocks';

const createAnimationLayer = (props = {}) => new AnimationLayer({name: props.name || 'layer name', createFrameContent});

const createEmptyAnimationLayer = () => {
    const animationLayer = createAnimationLayer();
    animationLayer.deleteFrame(1);
    
    return animationLayer;
}

describe('AnimationClip', () => {

    it('se puede extraer un frame a un clip de animacion', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrame();
        animationLayer.extendFrame(1);

        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 1})
        
        expect(animationLayer.lastFrameNumber).toBe(2);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(2)).toBe(false);
    });

    it('se pueden extraer varios frames a un clip de animacion', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrame();
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
        animationLayer.createFrame();

        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 1})
        
        expect(animationLayer.lastFrameNumber).toBe(1);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(true);
    });

    it('cuando se extrae a un clip de animacion un keyframe vecino de un frame extendido, el frame extendido se convierte en key frame', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrame();
        animationLayer.extendFrame(1);

        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 1})
        
        expect(animationLayer.isKeyFrame(2)).toBe(true);
    });

    it('cuando se extraen varios frames a un clip de animacion, solo el primero es un keyframe', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrame();
        animationLayer.createFrame();

        animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 2})
        
        expect(animationLayer.isKeyFrame(1)).toBe(true);
        expect(animationLayer.isKeyFrame(2)).toBe(false);
    });

    it('se puede insertar un clip de animacion antes del primer frame', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrame();
        animationLayer.createFrame();
        
        const animationClipFrames = animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 2, endFrameNumber: 2})
        
        animationLayer.insertFrames(animationClipFrames, {position: 1});

        expect(animationLayer.lastFrameNumber).toBe(3);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(2)).toBe(false);
        expect(animationLayer.isAnimationClipFrame(3)).toBe(true);
    });

    it('se puede insertar un clip de animacion luego del ultimo frame', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrame();
        animationLayer.createFrame();
        
        const animationClipFrames = animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 1})
        
        animationLayer.insertFrames(animationClipFrames, {position: 3});

        expect(animationLayer.lastFrameNumber).toBe(3);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(2)).toBe(false);
        expect(animationLayer.isAnimationClipFrame(3)).toBe(true);
    });

    it('se puede insertar un clip de animacion en medio de otros frames', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrame();
        animationLayer.createFrame();
        
        const animationClipFrames = animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 2, endFrameNumber: 2})
        
        animationLayer.insertFrames(animationClipFrames, {position: 2});

        expect(animationLayer.lastFrameNumber).toBe(3);
        expect(animationLayer.isAnimationClipFrame(1)).toBe(false);
        expect(animationLayer.isAnimationClipFrame(2)).toBe(true);
        expect(animationLayer.isAnimationClipFrame(3)).toBe(true);
    });
});
