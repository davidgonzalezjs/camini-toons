import AnimationLayer from '../../model/layers/AnimationLayer'

import {createFrameContent} from '../helpers/mocks';

const createAnimationLayer = () => new AnimationLayer({createFrameContent});

const onionSkinSettingsWithOneFrameAfterAndBefore = {
  beforeColor: 'red',
  afterColor: 'green',
  numberOfFramesBefore: 1,
  numberOfFramesAfter: 1,
  opacityStep: 0.5
};

describe('Onion skin', () => {

  it('starts disabled', () => {
    const animationLayer = createAnimationLayer();

    expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([]);
  });

  it(`GIVEN there are no frames before and after the current frame WHEN it's enabled THEN there are no frames showing an onion skin`, () => {
    const animationLayer = createAnimationLayer();

    animationLayer.activateOnionSkin(onionSkinSettingsWithOneFrameAfterAndBefore);

    expect(animationLayer.hasOnionSkinEnabled()).toBe(true);
    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([]);
  });
  
  it(`GIVEN there are no frames before and only one after the current frame WHEN it's enabled THEN the next frame is showing an onion skin`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrameAt(2);
    animationLayer.showFrame(1);

    animationLayer.activateOnionSkin(onionSkinSettingsWithOneFrameAfterAndBefore);

    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([2]);
  });

  it(`GIVEN there are no frames after and only one before the current frame WHEN it's enabled THEN the previous frame is showing an onion skin`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrameAt(2);
    animationLayer.showFrame(2);

    animationLayer.activateOnionSkin(onionSkinSettingsWithOneFrameAfterAndBefore);

    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([1]);
  });

  it(`GIVEN it is enabled WHEN it's deactivated THEN there are no frames showing an onion skin`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrameAt(2);
    animationLayer.activateOnionSkin(onionSkinSettingsWithOneFrameAfterAndBefore);

    animationLayer.deactivateOnionSkin();

    expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([]);
  });

  it(`GIVEN it is enabled WHEN it's deactivated and change the current frame THEN there are no frames showing an onion skin`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrameAt();
    animationLayer.activateOnionSkin(onionSkinSettingsWithOneFrameAfterAndBefore);
    animationLayer.deactivateOnionSkin();

    animationLayer.showFrame(1);

    expect(animationLayer.hasOnionSkinEnabled()).toBe(false);
    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([]);
  });

  it(`GIVEN there are frames before and after showing an onion skin WHEN change the current frame THEN the frame showing an onion skin are updated`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrameAt(2);
    animationLayer.createFrameAt(3);
    animationLayer.createFrameAt(4);
    animationLayer.createFrameAt(5);
    animationLayer.activateOnionSkin(onionSkinSettingsWithOneFrameAfterAndBefore);

    animationLayer.showFrame(2);

    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([1, 3]);
  });

  it(`GIVEN there are many frames before WHEN it's enabled AND configure to show many onions before THEN there are many frames showing an onion skin before`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrameAt(2);
    animationLayer.createFrameAt(3);
    animationLayer.createFrameAt(4);
    animationLayer.showFrame(4);

    animationLayer.activateOnionSkin({...onionSkinSettingsWithOneFrameAfterAndBefore, numberOfFramesBefore: 2});

    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([2, 3]);
  });

  it(`GIVEN there are many frames after WHEN it's enabled AND configure to show many onions before THEN there are many frames showing an onion skin before`, () => {
    const animationLayer = createAnimationLayer();
    animationLayer.createFrameAt(1);
    animationLayer.createFrameAt(2);
    animationLayer.createFrameAt(3);
    animationLayer.createFrameAt(4);
    animationLayer.showFrame(1);

    animationLayer.activateOnionSkin({...onionSkinSettingsWithOneFrameAfterAndBefore, numberOfFramesAfter: 3});

    expect(animationLayer.frameNumbersShowingOnionSkin).toEqual([2, 3, 4]);
  });
});
