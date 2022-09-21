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

});
