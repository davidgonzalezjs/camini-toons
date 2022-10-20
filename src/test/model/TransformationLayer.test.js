import {Point} from '../../model/Point';
import AnimationLayer from '../../model/AnimationLayer';
import {TransformationLayer} from '../../model/TransformationLayer';
import {createFrameContent} from '../helpers/mocks';

const createAnimationLayer = (props = {}) => new AnimationLayer({name: props.name || 'layer name', createFrameContent});

const createEmptyAnimationLayer = () => {
    const animationLayer = createAnimationLayer();
    animationLayer.deleteFrame(1);
    
    return animationLayer;
}

const keyFrameWidthValue = value => ({value, isKeyFrame: true});

const interpolatedFrameWithValue = value => ({value, isKeyFrame: false})

describe('TransformationLayer', () => {

    it('el valor inicial de x en el primer frame cero', () => {
        const transformationLayer = new TransformationLayer();

        expect(transformationLayer.lastFrameNumberForX).toEqual(1);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(0));
    });

    it('cuando se crea un keyframe en el segundo frame, este tiene el mismo valor que el primero keyframe', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(2);

        expect(transformationLayer.lastFrameNumberForX).toEqual(2);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(0));
        expect(transformationLayer.frameForXAt(2)).toEqual(keyFrameWidthValue(0));
    });

    it('cuando se crea un keyframe luego del un keyframe posterior al primero, el nuevo keyframe tiene el mismo valor que el keyframe previo', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(2);
        transformationLayer.createKeyFrameForXAtFrame(3);


        expect(transformationLayer.lastFrameNumberForX).toEqual(3);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(0));
        expect(transformationLayer.frameForXAt(2)).toEqual(keyFrameWidthValue(0));
        expect(transformationLayer.frameForXAt(3)).toEqual(keyFrameWidthValue(0));
    });

    it('cuando se crea un keyframe luego del un keyframe cuyo valor fue modificado, el nuevo keyframe tiene el mismo valor que el keyframe previo', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(2);
        transformationLayer.changeKeyFrameValueForX({frameNumber: 2, value: 10})

        transformationLayer.createKeyFrameForXAtFrame(3);

        expect(transformationLayer.lastFrameNumberForX).toEqual(3);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(0));
        expect(transformationLayer.frameForXAt(2)).toEqual(keyFrameWidthValue(10));
        expect(transformationLayer.frameForXAt(3)).toEqual(keyFrameWidthValue(10));
    });

    it('cuando se crea un keyframe luego de un keyframe existente dejando un frame intermedio, el frame intermedio tiene el mismo valor que los otros', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(3);

        expect(transformationLayer.lastFrameNumberForX).toEqual(3);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(0));
        expect(transformationLayer.frameForXAt(2)).toEqual(interpolatedFrameWithValue(0));
        expect(transformationLayer.frameForXAt(3)).toEqual(keyFrameWidthValue(0));
    });

    it('cuando se crea un keyframe luego de un keyframe existente dejando varios frames intermedios, los frames intermedios tiene el mismo valor que los otros', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(4);

        expect(transformationLayer.lastFrameNumberForX).toEqual(4);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(0));
        expect(transformationLayer.frameForXAt(2)).toEqual(interpolatedFrameWithValue(0));
        expect(transformationLayer.frameForXAt(3)).toEqual(interpolatedFrameWithValue(0));
        expect(transformationLayer.frameForXAt(4)).toEqual(keyFrameWidthValue(0));
    });

    it('cuando se crea un keyframe luego de un keyframe posterior al primero dejando un frame intermedio, el frame intermedio tiene el mismo valor que los otros', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(2);
        transformationLayer.createKeyFrameForXAtFrame(4);

        //console.log(transformationLayer._frames.x.map(each => each.isKeyFrame))

        expect(transformationLayer.lastFrameNumberForX).toEqual(4);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(0));
        
        expect(transformationLayer.frameForXAt(2)).toEqual(keyFrameWidthValue(0));
        expect(transformationLayer.frameForXAt(3)).toEqual(interpolatedFrameWithValue(0));
        expect(transformationLayer.frameForXAt(4)).toEqual(keyFrameWidthValue(0));
    });

    it('se puede cambiar el valor de x en un keyframe', () => {
        const transformationLayer = new TransformationLayer();

        transformationLayer.changeKeyFrameValueForX({frameNumber: 1, value: 6});

        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(6));
    });

    it('cuando se cambia el valor de un keyframe con un frame interpolado previo, el valor de este es interpolado', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(3);

        transformationLayer.changeKeyFrameValueForX({frameNumber: 3, value: 6});

        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(0));
        expect(transformationLayer.frameForXAt(2)).toEqual(interpolatedFrameWithValue(3));
        expect(transformationLayer.frameForXAt(3)).toEqual(keyFrameWidthValue(6));
    });

    it('cuando se cambia el valor de un keyframe con varios frames interpolados previos, el valor de estos es interpolado', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(4);

        transformationLayer.changeKeyFrameValueForX({frameNumber: 4, value: 6});

        expect(transformationLayer.lastFrameNumberForX).toEqual(4);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue((6 / 3) * 0));
        expect(transformationLayer.frameForXAt(2)).toEqual(interpolatedFrameWithValue((6 / 3) * 1));
        expect(transformationLayer.frameForXAt(3)).toEqual(interpolatedFrameWithValue((6 / 3) * 2));
        expect(transformationLayer.frameForXAt(4)).toEqual(keyFrameWidthValue((6 / 3) * 3));
    });

    it('cuando se cambia el valor de un keyframe con un frame interpolado por delante, el valor de dicho frame es interpolado', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(3);

        transformationLayer.changeKeyFrameValueForX({frameNumber: 1, value: -6});

        expect(transformationLayer.lastFrameNumberForX).toEqual(3);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(-6));
        expect(transformationLayer.frameForXAt(2)).toEqual(interpolatedFrameWithValue(-3));
        expect(transformationLayer.frameForXAt(3)).toEqual(keyFrameWidthValue(0));
    });

    it('cuando se cambia el valor de un keyframe con varios frames interpolados por delante, el valor de dichos frames es interpolado', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(4);

        transformationLayer.changeKeyFrameValueForX({frameNumber: 1, value: -6});

        expect(transformationLayer.lastFrameNumberForX).toEqual(4);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue((-6 / 3) * 3));
        expect(transformationLayer.frameForXAt(2)).toEqual(interpolatedFrameWithValue((-6 / 3) * 2));
        expect(transformationLayer.frameForXAt(3)).toEqual(interpolatedFrameWithValue((-6 / 3) * 1));
        expect(transformationLayer.frameForXAt(4)).toEqual(keyFrameWidthValue(0));
    });

    it('cuando se crea un keyframe en donde existe un frame interpolado, el frame interpolado es reemplazado por un keyframe con el mismo valor', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(3);

        transformationLayer.createKeyFrameForXAtFrame(2);

        expect(transformationLayer.lastFrameNumberForX).toEqual(3);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(0));
        expect(transformationLayer.frameForXAt(2)).toEqual(keyFrameWidthValue(0));
        expect(transformationLayer.frameForXAt(3)).toEqual(keyFrameWidthValue(0));
    });

    it('cuando se cambia el valor de un keyframe con frames interpolados en ambas direcciones, el valor de los frames interpolados es actualizado', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(3);
        transformationLayer.createKeyFrameForXAtFrame(5);

        transformationLayer.changeKeyFrameValueForX({frameNumber: 3, value: 10})

        expect(transformationLayer.lastFrameNumberForX).toEqual(5);
        expect(transformationLayer.frameForXAt(1)).toEqual(keyFrameWidthValue(0));

        expect(transformationLayer.frameForXAt(2)).toEqual(interpolatedFrameWithValue(5));
        expect(transformationLayer.frameForXAt(3)).toEqual(keyFrameWidthValue(10));
        expect(transformationLayer.frameForXAt(4)).toEqual(interpolatedFrameWithValue(5));
        
        expect(transformationLayer.frameForXAt(5)).toEqual(keyFrameWidthValue(0));
    });

    it('cuando se le agrega una dasdasdasd no transforma la capa', () => {
        const animationLayer = createAnimationLayer();
        const transformationLayer = new TransformationLayer();
        transformationLayer.changeKeyFrameValueForX({frameNumber: 1, value: 999});

        transformationLayer.addChild(animationLayer);

        expect(animationLayer.transformation.x).toEqual(0);
    });

    it('asdasdads mostrar frame', () => {
        const animationLayer = createAnimationLayer();
        const transformationLayer = new TransformationLayer();
        transformationLayer.changeKeyFrameValueForX({frameNumber: 1, value: 999});
        transformationLayer.addChild(animationLayer);

        transformationLayer.showFrame(1);

        expect(animationLayer.transformation.x).toEqual(999);
    });

    it('details - cuando solo tiene un keyframe', () => {
        const transformationLayer = new TransformationLayer();
        
        expect(transformationLayer.details).toEqual({
            frames: {
                x: [{ value: 0, isKeyFrame: true }]
            },
            children: [],
            type: 'TransformationLayer'
        });
    });

    it('details - cuando tiene varios keyframes', () => {
        const transformationLayer = new TransformationLayer();
        transformationLayer.createKeyFrameForXAtFrame(3);
        transformationLayer.changeKeyFrameValueForX({frameNumber: 3, value: 4})

        expect(transformationLayer.details).toEqual({
            frames: {
                x: [
                    { value: 0, isKeyFrame: true },
                    { value: 2, isKeyFrame: false },
                    { value: 4, isKeyFrame: true }
                ]
            },
            children: [],
            type: 'TransformationLayer'
        });
    });

    it('details - cuando tiene alguna capa de animacino como hija', () => {
        const animationLayer = createAnimationLayer();
        const transformationLayer = new TransformationLayer();
        
        transformationLayer.addChild(animationLayer);

        expect(transformationLayer.details).toEqual({
            frames: {
                x: [{ value: 0, isKeyFrame: true }]
            },
            children: [animationLayer.details],
            type: 'TransformationLayer'
        });
    });

    xit('details - cuando solo tiene un keyframe', () => {
        const animationLayer = createAnimationLayer();
        const transformationLayer = new TransformationLayer();
        transformationLayer.changeKeyFrameValueForX({frameNumber: 1, value: 999});
        transformationLayer.addChild(animationLayer);

        transformationLayer.showFrame(1);

        expect(animationLayer.transformation.x).toEqual(999);
    });

    //showFrame(targetFrame)
});
