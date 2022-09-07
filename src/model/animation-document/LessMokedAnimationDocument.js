
import AnimationDocument from './AnimationDocument';
import { mockPath, mockLayer } from '../../test/helpers/mocks';
import Optional from '../Optional';

class LessMokedAnimationDocument extends AnimationDocument {

  constructor() {
    super();
    this._activeLayer = mockLayer();
    this.hitTest = jest.fn(() => Optional.empty());
    this.createPath = jest.fn(() => mockPath());
  }

  get activeLayer() {
    return this._activeLayer;
  }

}

export default LessMokedAnimationDocument;