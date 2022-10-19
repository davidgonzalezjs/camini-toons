import AnimationDocument from '../../model/animation-document/AnimationDocument';
import AnimationLayer from '../../model/AnimationLayer';
import RegularFrame from '../../model/frames/RegularFrame';
import {createFrameContent, animationDocumentMockedProps} from '../helpers/mocks';

const createAnimationLayer = (props = {}) => new AnimationLayer({name: props.name || 'layer name', createFrameContent});
const createAnimationDocument = (props = {}) => new AnimationDocument(animationDocumentMockedProps);

const frameContentDeserializer = serializedFrame => serializedFrame;

describe('Deserializacion', () => {

    describe('RegularFrame', () => {
        it('cuando es deserializado se oculta', () => {
            const content = createFrameContent();
            content.visible = true;

            const frame = new RegularFrame(content, {isKeyFrame: true});
            const serialized = frame.serialize();

            const deserialized = RegularFrame.from(serialized, () => content);

            expect(deserialized.name).toEqual(frame.name);
            expect(deserialized._content).toEqual(content);
            expect(deserialized.isVisible()).toEqual(false);
        });
    });

    describe('AnimationLayer', () => {
        it('con un keyframe', () => {
            const animationLayer = createAnimationLayer();
            const serialized = animationLayer.serialize();
    
            const deserialized = AnimationLayer.from(serialized, createFrameContent, frameContentDeserializer);

            expect(deserialized.name).toEqual(animationLayer.name);
            expect(deserialized.lastFrameNumber).toEqual(1);
            expect(deserialized.isVisible()).toEqual(true);
        });
    
        it('con varios keyframes', () => {
            const animationLayer = createAnimationLayer();
            animationLayer.createFrameAt(1);
            const serialized = animationLayer.serialize();
    
            const deserialized = AnimationLayer.from(serialized, createFrameContent, frameContentDeserializer);

            expect(deserialized.name).toEqual(animationLayer.name);
            expect(deserialized.lastFrameNumber).toEqual(2);
            expect(deserialized.isVisible()).toEqual(true);
        });

        it('con un frame extendido', () => {
            const animationLayer = createAnimationLayer();
            animationLayer.extendFrame(1);
            const serialized = animationLayer.serialize();
    
            const deserialized = AnimationLayer.from(serialized, createFrameContent, frameContentDeserializer);

            expect(deserialized.lastFrameNumber).toEqual(2);

            expect(deserialized.isKeyFrame(1)).toBe(true);
            expect(deserialized.isKeyFrame(2)).toBe(false);
       
            expect(deserialized.framesHaveTheSameContent(1, 2)).toBe(true)
        });

        it('con varios frames extendidos consecutivos', () => {
            const animationLayer = createAnimationLayer();
            animationLayer.extendFrame(1);
            animationLayer.extendFrame(2);
            const serialized = animationLayer.serialize();
    
            const deserialized = AnimationLayer.from(serialized, createFrameContent, frameContentDeserializer);

            expect(deserialized.lastFrameNumber).toEqual(3);

            expect(deserialized.isKeyFrame(1)).toBe(true);
            expect(deserialized.isKeyFrame(2)).toBe(false);
            expect(deserialized.isKeyFrame(3)).toBe(false);
       
            expect(deserialized.framesHaveTheSameContent(1, 2)).toBe(true);
            expect(deserialized.framesHaveTheSameContent(2, 3)).toBe(true);
        });

        it('con frames extendidos de diferentes keyframes', () => {
            const animationLayer = createAnimationLayer();
            animationLayer.createFrameAt(2);
            animationLayer.extendFrame(2);
            animationLayer.extendFrame(1);
            const serialized = animationLayer.serialize();
    
            const deserialized = AnimationLayer.from(serialized, createFrameContent, frameContentDeserializer);

            expect(deserialized.lastFrameNumber).toEqual(4);

            expect(deserialized.isKeyFrame(2)).toBe(false);
            expect(deserialized.isKeyFrame(4)).toBe(false);
       
            expect(deserialized.framesHaveTheSameContent(2, 4)).toBe(false);
        });

        it('no visible', () => {
            const animationLayer = createAnimationLayer();
            animationLayer.hide();
            const serialized = animationLayer.serialize();
    
            const deserialized = AnimationLayer.from(serialized, createFrameContent, frameContentDeserializer);

            expect(deserialized.isVisible()).toEqual(false);
        });
        
    });

    describe('AnimationDocument', () => {
        it('con una capa', () => {
            const animationDocument = createAnimationDocument();
            const serialized = animationDocument.serialize();

            const deserialized = AnimationDocument.from(serialized, animationDocumentMockedProps);

            expect(deserialized.lastFrameNumber).toEqual(1);

            expect(deserialized._animationLayers).toHaveLength(1);
            expect(deserialized._animationLayers[0].name).toEqual('Capa 1');
            expect(deserialized._animationLayers[0].isVisible()).toEqual(true);
            
            expect(deserialized._animationClips).toHaveLength(0);
        });
    
        it('con varias capas', () => {
            const animationDocument = createAnimationDocument();
            animationDocument.createAnimationLayer();
            const serialized = animationDocument.serialize();

            const deserialized = AnimationDocument.from(serialized, animationDocumentMockedProps);

            expect(deserialized._animationLayers).toHaveLength(2);
            
            expect(deserialized._animationLayers[0].name).toEqual('Capa 1');
            expect(deserialized._animationLayers[0].isVisible()).toEqual(true);
            
            expect(deserialized._animationLayers[1].name).toEqual('Capa 2');
            expect(deserialized._animationLayers[1].isVisible()).toEqual(true);
        });

        it('con un frame de animacion no insertado en ninguna capa', () => {
            const animationDocument = createAnimationDocument();
            animationDocument.extractToAnimationClip({name: 'clip name', layerIndex: 0, startFrameNumber: 1, endFrameNumber: 1});
            animationDocument.deleteFrameOnLayer({layerIndex: 0, frameNumber: 1});

            const serialized = animationDocument.serialize();
            
            const deserialized = AnimationDocument.from(serialized, animationDocumentMockedProps);

            expect(deserialized._animationLayers).toHaveLength(1);
            
            expect(deserialized._animationClips).toHaveLength(1);
            expect(deserialized._animationClips[0].name).toEqual('clip name');
            expect(deserialized._animationClips[0].frames).toHaveLength(1);

            expect(deserialized._animationClips[0]._frames[0].isKeyFrame()).toBe(true);
            expect(deserialized._animationClips[0]._frames[0].isAnimationClip()).toBe(false);
        });
        
        it('con un frame de animacion insertado en una capa', () => {
            const animationDocument = createAnimationDocument();
            animationDocument.extractToAnimationClip({name: 'clip name', layerIndex: 0, startFrameNumber: 1, endFrameNumber: 1});
            
            const serialized = animationDocument.serialize();
            
            const deserialized = AnimationDocument.from(serialized, animationDocumentMockedProps);

            expect(deserialized._animationLayers).toHaveLength(1);
            expect(deserialized.isKeyFrame({layerIndex: 0, frameNumber: 1})).toBe(true);
        });

        xit('con un frame de animacion insertado en varias capas', () => {
            const animationDocument = createAnimationDocument();
            animationDocument.extractToAnimationClip({name: 'clip name', layerIndex: 0, startFrameNumber: 1, endFrameNumber: 1});
            animationDocument.insertAnimationClip({name: 'clip name', layerIndex: 0, position: 2});
            
            const serialized = animationDocument.serialize();
            
            const deserialized = AnimationDocument.from(serialized, animationDocumentMockedProps);

            // console.log(deserialized._animationLayers[0])

            expect(deserialized._animationLayers).toHaveLength(1);
            expect(deserialized.isKeyFrame({layerIndex: 0, frameNumber: 1})).toBe(true);
            expect(deserialized.isKeyFrame({layerIndex: 0, frameNumber: 2})).toBe(true);
            expect(deserialized._animationLayers[0].framesHaveTheSameContent(1, 2)).toBe(true);
        });
    });

});
