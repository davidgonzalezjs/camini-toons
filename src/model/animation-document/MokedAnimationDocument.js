
import AnimationDocument from './AnimationDocument';
import { mockPath } from '../../test/helpers/mocks';

class MokedAnimationDocument extends AnimationDocument {

  constructor() {
    super();
    this.createPath = jest.fn(() => mockPath());
  }

}

export default MokedAnimationDocument;