
import AnimationDocument from './AnimationDocument';
import { mockPath } from '../../test/helpers/mocks';
import Optional from '../Optional';

class MokedAnimationDocument extends AnimationDocument {

  constructor() {
    super();
    this.hitTest = jest.fn(() => Optional.empty());
    this.createPath = jest.fn(() => mockPath());
    this.deselectAllDrawings = jest.fn();
    this.selectDrawing = jest.fn();
  }

}

export default MokedAnimationDocument;