import AnimationDocument from '../../model/animation-document/AnimationDocument';
import {createFrameContent} from '../helpers/mocks';
import {Point} from '../../model/Point';

const createAnimationDocument = (props = {}) => new AnimationDocument({createFrameContent, hitTest: () => {}});

const createAnimationDocumentWithEmptyLayer = () => {
    const animationDocument = createAnimationDocument();
    animationDocument.deleteFrameOnLayer({layerIndex: 0, frameNumber: 1});
    
    return animationDocument;
};

describe('AnimationLayer', () => {

    it(`inicialmente cuenta con una capa con un frame`, () => {
        const animationDocument = createAnimationDocument();

        expect(animationDocument.layersDetails).toHaveLength(1);
        expect(animationDocument.layersDetails[0].name).toBe('Capa 1');
        expect(animationDocument.layersDetails[0].frames).toHaveLength(1);
    });

    it(`puede cambiar el nombre de una capa`, () => {
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

    it(`puede ir a un frame especifico`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);

        animationDocument.goToFrame(1);

        expect(animationDocument.currentFrameNumber).toBe(1);
    });

    it(`cuando se intenta ir a un frame posterior al ultimo, va hasta el ultimo`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);

        animationDocument.goToFrame(3);

        expect(animationDocument.currentFrameNumber).toBe(2);
    });

    it(`cuando se intenta ir a un frame previo al primero, va al primero`, () => {
        const animationDocument = createAnimationDocument();
        
        animationDocument.goToFrame(0);

        expect(animationDocument.currentFrameNumber).toBe(1);
    });

    it(`puede avanzar al siguiente frame`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(1);

        animationDocument.goToNextFrame();

        expect(animationDocument.currentFrameNumber).toBe(2);
    });

    it(`puede volver al frame previo`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(2);

        animationDocument.goToPreviousFrame();

        expect(animationDocument.currentFrameNumber).toBe(1);
    });

    it(`cuando esta en modo "idle" y sucede un "tick", no cambia de frame actual`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(1);

        animationDocument.tick();

        expect(animationDocument.currentFrameNumber).toBe(1);
    });

    it(`cuando esta en modo "reproduccion" y tiene una sola capa, avanza un frame por tick en dicha capa`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(0);
        animationDocument.goToFrame(1);

        animationDocument.playAnimation();

        animationDocument.tick();
        animationDocument.tick();

        expect(animationDocument.currentFrameNumber).toBe(2);
    });

    it(`cuando esta en modo "reproduccion" y tiene varias capas, avanza un frame por tick en todas las capas`, () => {
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

    it(`cuando esta en modo "reproduccion" y llega al ultimo frame, se detiene`, () => {
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

    it(`cuando esta reproduciendo una animacion en modo "loop" y llega al ultimo frame, en el proximo "tick" comienza desde el principio`, () => {
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

    it(`la reproduccion en modo "loop" puede ser desactivada`, () => {
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

    it(`una animacion puede ser detenida`, () => {
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

    it(`puede crear una nueva capa`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();

        expect(animationDocument.layersDetails).toHaveLength(2);
        expect(animationDocument.layersDetails[0].name).toBe("Capa 1");
        expect(animationDocument.layersDetails[0].isActive).toBe(true);
        expect(animationDocument.layersDetails[1].name).toBe("Capa 2");
        expect(animationDocument.layersDetails[1].isActive).toBe(false);
    });

    it(`puede crear varias capas`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();

        expect(animationDocument.layersDetails).toHaveLength(2);
        expect(animationDocument.layersDetails[0].name).toBe("Capa 1");
        expect(animationDocument.layersDetails[1].name).toBe("Capa 2");
    });

    it(`puede crear un frame en una capa`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();

        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(1);
        animationDocument.createFrameOnLayer(1);

        expect(animationDocument.layersDetails[0].frames.length).toBe(2);
        expect(animationDocument.layersDetails[1].frames.length).toBe(3);
    });

    it(`cuando tiene una sola capa, dicha capa es la capa activa`, () => {
        const animationDocument = createAnimationDocument();
        
        expect(animationDocument.activeLayerIndex).toBe(0);
    });

    it(`la capa activa puede ser cambiada`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();
        
        animationDocument.activateLayer(0);

        expect(animationDocument.activeLayerIndex).toBe(0);
    });

    it(`comienza con una capa visible`, () => {
        const animationDocument = createAnimationDocument();

        expect(animationDocument.isVisibleLayer(0)).toBe(true);
    });

    it(`puede ocultar una capa`, () => {
        const animationDocument = createAnimationDocument();

        animationDocument.hideLayer(0);

        expect(animationDocument.isVisibleLayer(0)).toBe(false);
    });

    it(`puede mostrar una capa oculta`, () => {
        const animationDocument = createAnimationDocument();
        animationDocument.hideLayer(0);

        animationDocument.showLayer(0);

        expect(animationDocument.isVisibleLayer(0)).toBe(true);
    });

    it('puede borrar un frame de una capa', () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createAnimationLayer();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(1);

        animationDocument.deleteFrameOnLayer({layerIndex: 1, frameNumber: 2});

        const layersDetails = animationDocument.layersDetails;

        expect(layersDetails[0].frames.length).toBe(2);
        expect(layersDetails[1].frames.length).toBe(1);
    });

    it('puede crear un nuevo keyframe antes de otro cuadro en una capa', () => {
        const animationDocument = createAnimationDocumentWithEmptyLayer();
        animationDocument.createFrameOnLayer(0);
        animationDocument.extendFrameOnLayer({layerIndex: 0, frameNumber: 1});

        animationDocument.createFrameOnLayerAtFrame({layerIndex: 0, frameNumber: 1});

        const layersDetails = animationDocument.layersDetails;
        expect(layersDetails[0].frames.length).toBe(3);
        expect(animationDocument.isKeyFrame({layerIndex: 0, frameNumber: 1})).toBe(true);
        expect(animationDocument.isKeyFrame({layerIndex: 0, frameNumber: 2})).toBe(true);
        expect(animationDocument.isKeyFrame({layerIndex: 0, frameNumber: 3})).toBe(false);
    });

    it('cuando crea un nuevo keyframe antes de otro cuadro en una capa, cambia el frame actual a la posicion del nuevo frame', () => {
        const animationDocument = createAnimationDocument();
        animationDocument.createFrameOnLayer(0);
        
        animationDocument.createFrameOnLayerAtFrame({layerIndex: 0, frameNumber: 1});

        expect(animationDocument.currentFrameNumber).toBe(1);
    })

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

    it('puede convertir en keyframe un frame que no lo es en una capa', () => {
        const animationDocument = createAnimationDocument();
        animationDocument.extendFrameOnLayer({layerIndex: 0, frameNumber: 1});

        animationDocument.convertToKeyFrame({layerIndex: 0, frameNumber: 2});

        const layersDetails = animationDocument.layersDetails;

        expect(layersDetails[0].frames[1].isKeyFrame).toBe(true);
    });

    it('puede extraer un animation clip en base a frames de una capa', () => {
        const animationDocument = createAnimationDocumentWithEmptyLayer();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(0);

        animationDocument.extractToAnimationClip({layerIndex: 0, startFrameNumber: 1, endFrameNumber: 2});
        
        const layersDetails = animationDocument.layersDetails;

        expect(layersDetails[0].frames[0].isAnimationClip).toBe(true);
        expect(layersDetails[0].frames[1].isAnimationClip).toBe(true);
        expect(layersDetails[0].frames[2].isAnimationClip).toBe(false);
    });

    xit('puede mover todas sus capas juntas', () => {
        const animationDocument = createAnimationDocumentWithEmptyLayer();
        animationDocument.createAnimationLayer();

        animationDocument.moveAnimationLayersBy(Point.at(1, 2));
        
        expect(animationDocument._layers[0].position).toEqual(Point.at(1, 2));
        expect(animationDocument._layers[1].position).toEqual(Point.at(1, 2));
    });

    it('cuando se agrega como hija de una capa de transformacion a una capa, esta deja de ser hija directa del documento de animacion', () => {
        const animationDocument = createAnimationDocumentWithEmptyLayer();
        const anAnimationLayer = animationDocument.createAnimationLayer();

        const transformationLayer = animationDocument.createTransformationLayerContaining(anAnimationLayer.name);

        expect(transformationLayer.numberOfChildren).toBe(1);
        expect(transformationLayer.hasChild(anAnimationLayer)).toBe(true);
        expect(animationDocument.hasChild(anAnimationLayer)).toBe(false);
    });

    it('asdasdasd', () => {
        const animationDocument = createAnimationDocumentWithEmptyLayer();
        const anAnimationLayer = animationDocument.createAnimationLayer();
        animationDocument.createFrameOnLayer(0);
        animationDocument.createFrameOnLayer(0);

        animationDocument.createTransformationLayerContaining(anAnimationLayer.name);

        expect(animationDocument.lastFrameNumber).toBe(2);
    });

    describe('detalles de capas aplanados', () => {
        const animationDocument = createAnimationDocumentWithEmptyLayer(); // Comienza con una capa
        
        const firstAnimationLayer = animationDocument.activeLayer;
        const secondAnimationLayer = animationDocument.createAnimationLayer();
        const transformationLayer = animationDocument.createTransformationLayerContaining(firstAnimationLayer.name);

        expect(animationDocument.flattenLayersDetails).toHaveLength(3);
        expect(animationDocument.flattenLayersDetails[0]).toEqual(transformationLayer.details);
        expect(animationDocument.flattenLayersDetails[1]).toEqual(firstAnimationLayer.details);
        expect(animationDocument.flattenLayersDetails[2]).toEqual(secondAnimationLayer.details);
    })
});
