import LessMokedAnimationDocument from "../../model/animation-document/LessMokedAnimationDocument";
import Clock from "../../model/Clock";
import CaminiToons from "../../model/CaminiToons";

import { } from '../helpers/mouse-event-factory'
import { mockPath, mockFunctionReturning, mockFunctionReturningSequence } from "../helpers/mocks";

describe('Linea de tiempo', () => {
  let animationDocument;
  let caminiToons;

  beforeEach(() => {
    animationDocument = new LessMokedAnimationDocument();
    caminiToons = new CaminiToons(animationDocument, new Clock({frameRate: 6}));
  });

  it('una animacion nueva comienza en el frame 1', () => {
    expect(caminiToons.currentFrameNumber).toBe(1);
  });

  it('cuando se crea un frame en la capa activa se avanza un frame', () => {
    caminiToons.createFrame();

    expect(animationDocument.activeLayer.createFrame).toBeCalled();
    expect(animationDocument.activeLayer.goToFrame).toBeCalledWith(2);
    expect(caminiToons.currentFrameNumber).toBe(2);
  });

  xit('cuando se reproduce una animacion se vuelve al primer frame', () => {
    caminiToons.createFrame();
    animationDocument.activeLayer.numberOfFrames = 2;
    caminiToons.playAnimation();

    animationDocument.onFrame({time: 0, delta: 0});
  
    expect(animationDocument.activeLayer.goToFrame.mock.calls[0][0]).toBe(1);
  });

});