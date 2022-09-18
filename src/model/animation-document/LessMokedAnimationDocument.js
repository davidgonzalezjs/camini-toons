
import AnimationDocument from './AnimationDocument';
import { mockPath, mockLayer } from '../../test/helpers/mocks';
import Optional from '../Optional';

class LessMokedAnimationDocument extends AnimationDocument {

  constructor() {
    super({
      createFrameContent: mockLayer,
      hitTest: () => null
    });
    
    this.hitTest = jest.fn(() => Optional.empty());
    this.createPath = jest.fn(() => mockPath());
  }

}

export default LessMokedAnimationDocument;