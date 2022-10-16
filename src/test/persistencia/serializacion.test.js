import AnimationDocument from '../../model/animation-document/AnimationDocument';
import AnimationLayer from '../../model/AnimationLayer';
import {AnimationClip} from '../../model/AnimationClip';

import {createFrameContent, animationDocumentMockedProps} from '../helpers/mocks';

const createAnimationLayer = (props = {}) => new AnimationLayer({name: props.name || 'layer name', createFrameContent});
const createAnimationDocument = (props = {}) => new AnimationDocument(animationDocumentMockedProps);
const createEmptyAnimationLayer = (props = {}) => {
    const animationLayer = createAnimationLayer();
    animationLayer.deleteFrame(1);
    
    return animationLayer;
}

describe('Serializacion', () => {

    describe('de AnimationLayer', () => {
        it('con un frame de dibujo', () => {
            const animationLayer = createEmptyAnimationLayer();
            animationLayer.createFrameAt(1);
    
            const result = animationLayer.serialize();
    
            expect(result).toEqual({
                _name: animationLayer.name,
                _frames: [{_content: {visible: true}, _isKeyFrame: true, _isAnimationClip: false}],
                _isVisible: true
            });
        });
    
        it('con un frame extendido', () => {
            const animationLayer = createEmptyAnimationLayer();
            animationLayer.createFrameAt(1);
            animationLayer.extendFrame(1);
    
            const result = animationLayer.serialize();
    
            expect(result).toEqual({
                _name: animationLayer.name,
                _frames: [
                    {_content: {visible: true}, _isKeyFrame: true, _isAnimationClip: false},
                    {_content: {visible: true}, _isKeyFrame: false, _isAnimationClip: false},
                ],
                _isVisible: true
            });
        });

        it('con un frame de animacion', () => {
            const animationLayer = createEmptyAnimationLayer();
            animationLayer.createFrameAt(1);
            animationLayer.extractToAnimationClip({name: 'clip name', startFrameNumber: 1, endFrameNumber: 1});
    
            const result = animationLayer.serialize();
    
            expect(result).toEqual({
                _name: animationLayer.name,
                _frames: [
                    {
                        _isKeyFrame: true,
                        _isAnimationClip: true,
                        name: 'clip name',
                        _frameNumber: 1 
                    },
                ],
                _isVisible: true
            });
        });

        it('no visible', () => {
            const animationLayer = createEmptyAnimationLayer();
            animationLayer.hide();
    
            const result = animationLayer.serialize();
    
            expect(result).toEqual({
                _name: animationLayer.name,
                _frames: [],
                _isVisible: false
            });
        });
        
    });

    describe('AnimationClip', () => {

        it('serializacion', () => {
            const name = 'clip name';
            const frames = [{serialize: () => 'SERIALIZED_CONTENT'}];
            
            const animationDocument = new AnimationClip(name, frames);
            
            const serialized = animationDocument.serialize();

            expect(serialized).toEqual({
                name,
                frames: ['SERIALIZED_CONTENT']
            });
        });

    });

    describe('AnimationDocument', () => {
        it('con una capa', () => {
            const animationDocument = createAnimationDocument();
    
            const result = animationDocument.serialize();
    
            expect(result).toEqual({
                _currentFrameNumber: 1,
                _isPlayingOnALoop: false,
                animationClips: [],
                layers: [
                    createAnimationLayer({name: 'Capa 1'}).serialize()
                ]
            });
        });
    
        it('con varias capas', () => {
            const animationDocument = createAnimationDocument();
            animationDocument.createAnimationLayer();
    
            const result = animationDocument.serialize();
    
            expect(result).toEqual({
                _currentFrameNumber: 1,
                _isPlayingOnALoop: false,
                animationClips: [],
                layers: [
                    createAnimationLayer({name: 'Capa 1'}).serialize(),
                    createAnimationLayer({name: 'Capa 2'}).serialize()
                ]
            });
        });

        it('con un clip de animacion no insertado en ninguna capa', () => {
            const animationDocument = createAnimationDocument();
            animationDocument.extractToAnimationClip({name: 'clip name', layerIndex: 0, startFrameNumber: 1, endFrameNumber: 1});
            animationDocument.deleteFrameOnLayer({layerIndex: 0, frameNumber: 1});

            const result = animationDocument.serialize();
            
            expect(result).toEqual({
                _currentFrameNumber: 1,
                _isPlayingOnALoop: false,
                animationClips: [
                    {
                        name: 'clip name',
                        frames: [{
                            _content: {visible: true},
                            _isKeyFrame: true,
                            _isAnimationClip: false
                        }]
                    }
                ],
                layers: [{
                    _name: 'Capa 1',
                    _frames: [],
                    _isVisible: true
                }]
            });
        });

        it('con un clip de animacion insertado en una capa', () => {
            const animationDocument = createAnimationDocument();
            animationDocument.extractToAnimationClip({name: 'clip name', layerIndex: 0, startFrameNumber: 1, endFrameNumber: 1});
            
            const result = animationDocument.serialize();
            
            expect(result).toEqual({
                _currentFrameNumber: 1,
                _isPlayingOnALoop: false,
                animationClips: [
                    {
                        name: 'clip name',
                        frames: [{
                            _content: {visible: true},
                            _isKeyFrame: true,
                            _isAnimationClip: false
                        }]
                    }
                ],
                layers: [{
                    _name: 'Capa 1',
                    _frames: [{
                        name: 'clip name',
                        _frameNumber: 1,
                        _isAnimationClip: true,
                        _isKeyFrame: true
                    }],
                    _isVisible: true
                }]
            });
        });
        
    });

});
