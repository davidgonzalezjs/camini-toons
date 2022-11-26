
import AnimationDocument from './AnimationDocument';
import { mockLayer, mockPath, createFrameContent } from '../../test/helpers/mocks';
import Optional from '../Optional';
import RegularFrame from '../frames/RegularFrame';


class MokedAnimationDocument extends AnimationDocument {

  constructor() {
    super({
      createFrameContent: createFrameContent,
      hitTest: jest.fn(() => Optional.empty())
    });

    this.createFrame = jest.fn(() => new RegularFrame(createFrameContent(), {isKeyFrame: true}));
    this.createPath = jest.fn(() => mockPath());
    this.deselectAllDrawings = jest.fn();
    this.selectDrawing = jest.fn();
    this.deleteSelection = jest.fn();
    this.moveDrawing = jest.fn();
  }

}

export default MokedAnimationDocument;