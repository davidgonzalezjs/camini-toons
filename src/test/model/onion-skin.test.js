import AnimationLayer from '../../model/AnimationLayer'
import Frame from '../../model/Frame';

const createContent = () => ({
    showOnionSkin: jest.fn(),
    remove: jest.fn(),
    activate: jest.fn(),
    clone: () => createContent()
});

const createFrameFunction = () => new Frame({createContent});

const createAnimationLayer = () => new AnimationLayer({createFrameFunction});

describe('Onion skin', () => {

  it('starts disabled', () => {
    const animationLayer = createAnimationLayer();

    expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([]);
  });

  it(`GIVEN there are no frames before and after the current frame WHEN it's enabled THEN there are no frames showing an onion skin`, () => {
    const animationLayer = createAnimationLayer();

    animationLayer.activateOnionSkin();

    expect(animationLayer.hasOnionSkinEnabled()).toBe(true);
    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([]);
  });
  
  it(`GIVEN there are no frames before and only one after the current frame WHEN it's enabled THEN the next frame is showing an onion skin`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrame();
    animationLayer.showFrame(1);

    animationLayer.activateOnionSkin();

    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([2]);
  });

  it(`GIVEN there are no frames after and only one before the current frame WHEN it's enabled THEN the previous frame is showing an onion skin`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrame();
    animationLayer.showFrame(2);

    animationLayer.activateOnionSkin();

    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([1]);
  });

  it(`GIVEN it is enabled WHEN it's deactivated THEN there are no frames showing an onion skin`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrame();
    animationLayer.activateOnionSkin();

    animationLayer.deactivateOnionSkin();

    expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([]);
  });

  it(`GIVEN it is enabled WHEN it's deactivated and change the current frame THEN there are no frames showing an onion skin`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrame();
    animationLayer.activateOnionSkin();
    animationLayer.deactivateOnionSkin();

    animationLayer.showFrame(1);

    expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([]);
  });

  it(`GIVEN there are frames before and after showing an onion skin WHEN change the current frame THEN the frame showing an onion skin are updated`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrame();
    animationLayer.createFrame();
    animationLayer.createFrame();
    animationLayer.createFrame();
    animationLayer.activateOnionSkin();

    animationLayer.showFrame(2);

    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([1, 3]);
  });

});
