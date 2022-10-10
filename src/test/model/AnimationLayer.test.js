import AnimationLayer from '../../model/AnimationLayer';
import {createFrameContent} from '../helpers/mocks';

const createAnimationLayer = (props = {}) => new AnimationLayer({name: props.name || 'layer name', createFrameContent});

const createEmptyAnimationLayer = () => {
    const animationLayer = createAnimationLayer();
    animationLayer.deleteFrame(1);
    
    return animationLayer;
}

describe('AnimationLayer', () => {

    it('una capa nueva tiene un frame visible', () => {
        const animationLayer = createAnimationLayer();

        expect(animationLayer.lastFrameNumber).toBe(1);
        expect(animationLayer.isVisibleFrame(1)).toBe(true);
    });

    it('cuando crea un nuevo frame, este no es visible', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrameAt(2);

        expect(animationLayer.lastFrameNumber).toBe(2);
        expect(animationLayer.isVisibleFrame(1)).toBe(true);
        expect(animationLayer.isVisibleFrame(2)).toBe(false);
    });

    it(`no tiene un frame visible mas alla del ultimo numero de frame`, () => {
        const animationLayer = createAnimationLayer();
        
        expect(animationLayer.isVisibleFrame(animationLayer.lastFrameNumber + 1)).toBe(false);
    });

    it(`cuando esta escondida, todos sus frames lo estan`, () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrameAt(2);
 
        animationLayer.hide()

        expect(animationLayer.isVisible()).toBe(false);
        expect(animationLayer.isVisibleFrame(1)).toBe(false);
        expect(animationLayer.isVisibleFrame(2)).toBe(false);
    });

    it('cuando se muestra una capa escondida, el frame actual vuelve a ser visible', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.hide()

        animationLayer.show();

        expect(animationLayer.isVisible()).toBe(true);
        expect(animationLayer.isVisibleFrame(1)).toBe(true);
    });

    it('cuando a una capa oculta se le pide mostrar un frame distinto al actual, dicho frame no se hace visible', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrameAt(2);
        animationLayer.hide()

        animationLayer.showFrame(2);

        expect(animationLayer.isVisible()).toBe(false);
        expect(animationLayer.isVisibleFrame(1)).toBe(false);
    });

    it('cuando a una capa oculta a la que se le habia pedido mostrar un frame distinto al actual se hace visible, entonces dicho frame se hace visible', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrameAt(2);
        animationLayer.hide()
        animationLayer.showFrame(2);

        animationLayer.show()

        expect(animationLayer.isVisible()).toBe(true);
        expect(animationLayer.isVisibleFrame(1)).toBe(false);
        expect(animationLayer.isVisibleFrame(2)).toBe(true);
    });

    it('cuando esta visible y se le pide mostrar un frame distinto al actual, solo el nuevo frame es visible', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrameAt(2);

        animationLayer.showFrame(2);

        expect(animationLayer.isVisibleFrame(1)).toBe(false);
        expect(animationLayer.isVisibleFrame(2)).toBe(true);
    });

    it(`cuando se oculta una capa que tenia activados, estos tambien se ocultan`, () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrameAt(2);
        animationLayer.createFrameAt(3);
        animationLayer.showFrame(2);
        animationLayer.activateOnionSkin({beforeColor: 'red', afterColor: 'green', numberOfFramesBefore: 1, numberOfFramesAfter: 1, opacityStep: 0.5});
 
        animationLayer.hide();

        expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
    });

    it(`cuando esta oculta y se intenta activar los onion skins, estos no se activan`, () => {
        const animationLayer = createAnimationLayer();
        animationLayer.hide();

        animationLayer.activateOnionSkin({beforeColor: 'red', afterColor: 'green', numberOfFramesBefore: 1, numberOfFramesAfter: 1, opacityStep: 0.5});

        expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
    });

    it('se le puede pedir detalles descriptivos', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.extendFrame(1);
        animationLayer.createFrameAt(3);

        animationLayer.extractToAnimationClip({name: 'clip', startFrameNumber: 3, endFrameNumber: 3});


        expect(animationLayer.details).toEqual({
            name: 'layer name',
            isVisible: true,
            hasOnionSkinEnabled: false,
            frames: [
                {number: 1, isKeyFrame: true, isEmpty: true, isAnimationClip: false},
                {number: 2, isKeyFrame: false, isEmpty: true, isAnimationClip: false},
                {number: 3, isKeyFrame: true, isEmpty: true, isAnimationClip: true}
            ]
        });
    });

    it('tiene un nombre', () => {
        const animationLayer = createAnimationLayer({name: 'layer name'});

        expect(animationLayer.name).toBe('layer name');
    });

    it(`puede cambiar su nombre`, () => {
        const animationLayer = createAnimationLayer({name: 'original name'});
        animationLayer.changeNameTo('another name')

        expect(animationLayer.name).toBe('another name');
    });

    it('puede borrar un frame', () => {
        const animationLayer = createAnimationLayer({});
        
        animationLayer.deleteFrame(1);

        expect(animationLayer.existFrameAt(1)).toBe(false);
    });

    it('cuando se crea un frame, este tiene un contenido distinto al resto', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrameAt(2);

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
        animationLayer.createFrameAt(2);
        animationLayer.extendFrame(1);
        
        expect(animationLayer.lastFrameNumber).toBe(3);
        expect(animationLayer.framesHaveTheSameContent(1, 2)).toBe(true);
        expect(animationLayer.framesHaveTheSameContent(2, 3)).toBe(false);
    });

    it('cuando se crea un frame, este es un keyframe', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.createFrameAt(2);

        expect(animationLayer.isKeyFrame(2)).toBe(true);
    });

    it('cuando se extiende un frame, el frame resultante no es un keyframe', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.extendFrame(1);

        expect(animationLayer.isKeyFrame(2)).toBe(false);
    });

    it('se puede convertir en keyframe un frame que no lo es', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.extendFrame(1);

        animationLayer.convertToKeyFrame(2);
        
        expect(animationLayer.lastFrameNumber).toBe(2);
        
        expect(animationLayer.isKeyFrame(2)).toBe(true);
        expect(animationLayer.framesHaveTheSameContent(1, 2)).toBe(false);
    });

    // TODO: buscar un nombre de test mas claro
    it('cuando un frame extendido seguido por un frame extendido es convertido a keyframe, el frame extendido de la derecha pasa a tener el mismo contenido que el nuevo keyframe', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.extendFrame(1);
        animationLayer.extendFrame(1);
        animationLayer.extendFrame(1);

        animationLayer.convertToKeyFrame(3);
        
        expect(animationLayer.isKeyFrame(3)).toBe(true);
        expect(animationLayer.framesHaveTheSameContent(1, 3)).toBe(false);
        expect(animationLayer.framesHaveTheSameContent(3, 4)).toBe(true);
    });

    it('cuando un frame extendido seguido por varios frames extendidos es convertido a keyframe, los frames extendidos de la derecha pasan a tener el mismo contenido que el nuevo keyframe', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.extendFrame(1);
        animationLayer.extendFrame(1);
        animationLayer.extendFrame(1);
        animationLayer.extendFrame(1);

        animationLayer.convertToKeyFrame(3);
        
        expect(animationLayer.isKeyFrame(3)).toBe(true);
        expect(animationLayer.framesHaveTheSameContent(1, 3)).toBe(false);
        expect(animationLayer.framesHaveTheSameContent(3, 4)).toBe(true);
        expect(animationLayer.framesHaveTheSameContent(3, 5)).toBe(true);
    });

    it('cuando un frame extendido seguido por algun keyframe es convertido a keyframe, el keyframe de la derecha no tienen el mismo contenido que el nuevo keyframe', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.extendFrame(1);
        animationLayer.createFrameAt(3);;

        animationLayer.convertToKeyFrame(2);
        
        expect(animationLayer.isKeyFrame(2)).toBe(true);
        expect(animationLayer.framesHaveTheSameContent(2, 3)).toBe(false);
    });

    it('cuando un keyframe que fue extendido es borrado, el frame siguiente se convierte en keyframe', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.extendFrame(1);
        animationLayer.createFrameAt(3);

        animationLayer.deleteFrame(1);
        
        expect(animationLayer.lastFrameNumber).toBe(2);
        expect(animationLayer.isKeyFrame(1)).toBe(true);
        expect(animationLayer.isKeyFrame(2)).toBe(true);
    });

    it('cuando un frame extendido vecino de otros frames extendidos es borrado, ningun frame extendido se convierte en keyframe', () => {
        const animationLayer = createAnimationLayer();
        animationLayer.extendFrame(1);
        animationLayer.extendFrame(1);
        animationLayer.extendFrame(1);

        animationLayer.deleteFrame(3);
        
        expect(animationLayer.lastFrameNumber).toBe(3);
        expect(animationLayer.isKeyFrame(1)).toBe(true);
        expect(animationLayer.isKeyFrame(2)).toBe(false);
        expect(animationLayer.isKeyFrame(3)).toBe(false);
    });

    // TODO. mejorar el nombre del test
    it('cuando se crea un keyframe en medio de dos frames extendidos, el frame de la derecha que no sean keyframe se convierte en keyframe', () => {
        const animationLayer = createEmptyAnimationLayer();
        animationLayer.createFrameAt(1);
        animationLayer.extendFrame(1);
        animationLayer.extendFrame(1);
        animationLayer.extendFrame(1);
        animationLayer.extendFrame(1);

        animationLayer.createFrameAt(3);

        expect(animationLayer.lastFrameNumber).toBe(6);
        expect(animationLayer.isKeyFrame(1)).toBe(true);
        expect(animationLayer.isKeyFrame(2)).toBe(false);

        expect(animationLayer.isKeyFrame(3)).toBe(true);
        
        expect(animationLayer.isKeyFrame(4)).toBe(true);
        expect(animationLayer.isKeyFrame(5)).toBe(false);
    });
        
    it('cuando se crea un nuevo frame en donde se encuentra el frame actual, solo el nuevo frame es visible', () => {
        const animationLayer = createEmptyAnimationLayer();
        const aFrame = animationLayer.createFrameAt(1);

        const anotherFrame = animationLayer.createFrameAt(1);

        expect(animationLayer.lastFrameNumber).toBe(2);

        expect(aFrame.isVisible()).toBe(false);
        expect(anotherFrame.isVisible()).toBe(true);
        
        expect(animationLayer.isVisibleFrame(1)).toBe(true);
        expect(animationLayer.isVisibleFrame(2)).toBe(false);
    });
});
