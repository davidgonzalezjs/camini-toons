
import AnimationDocument from './AnimationDocument';
import { mockPath } from '../../test/helpers/mocks';
import Optional from '../Optional';

class MokedAnimationDocument extends AnimationDocument {

  constructor() {
    super();
    this.hitTest = jest.fn(() => Optional.empty());
    this.createFrame = jest.fn(() => mockPath());
    this.createPath = jest.fn(() => mockPath());
    this.deselectAllDrawings = jest.fn();
    this.selectDrawing = jest.fn();
    this.deleteSelection = jest.fn();
    this.moveDrawing = jest.fn();
  }

}

export default MokedAnimationDocument;