import LessMokedAnimationDocument from "../../model/animation-document/LessMokedAnimationDocument";
import Clock from "../../model/Clock";
import CaminiToons from "../../model/CaminiToons";

import { } from '../helpers/mouse-event-factory'

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

  xit('cuando se crea un frame en la capa activa se avanza un frame', () => {
    caminiToons.createFrameOnLayer(1);

    expect(animationDocument.activeLayer.createFrame).toBeCalled();
    expect(animationDocument.activeLayer.goToFrame).toBeCalledWith(2);
    expect(caminiToons.currentFrameNumber).toBe(2);
  });

  xit('cuando se solicita comenzar a reproducir animacion se vuelve al primer frame', () => {
    caminiToons.playAnimation();

    expect(animationDocument.activeLayer.goToFrame.mock.calls[0][0]).toBe(1);
  });

  xit('cuando se una animacion se esta reproduciendo avanza un frame por cada tick', () => {
    animationDocument.activeLayer.frames = {length: 3}; // TODO: corregir esto. Ver comentario en PaperJSAnimationDocument
    caminiToons.playAnimation();
    
    caminiToons.tick();
    caminiToons.tick();
    caminiToons.tick();

    expect(caminiToons.currentFrameNumber).toBe(3);
    expect(animationDocument.activeLayer.goToFrame.mock.calls[1][0]).toBe(1);
    expect(animationDocument.activeLayer.goToFrame.mock.calls[2][0]).toBe(2);
    expect(animationDocument.activeLayer.goToFrame.mock.calls[3][0]).toBe(3);
  });

});