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

  it('cuando se presiona la tecla "." se avanza al siguiente frame', () => {
    caminiToons.createFrameOnLayer(0);
    caminiToons.goToFrame(1);

    caminiToons.handleKeyDown({key: '.'})

    expect(caminiToons.currentFrameNumber).toBe(2);
  });

  it('cuando se presiona la tecla "," se retrocede al frame anterior', () => {
    caminiToons.createFrameOnLayer(0);
    caminiToons.goToFrame(2);

    caminiToons.handleKeyDown({key: ','})

    expect(caminiToons.currentFrameNumber).toBe(1);
  });

  it('cuando se presiona la tecla "v" se cambia la herramienta seleccionada a la herramienta de seleccion', () => {
    caminiToons.usePen();
    caminiToons.handleKeyDown({key: 'v'})

    expect(caminiToons.selectedTool.name).toBe('selectionTool');
  });

  it('cuando se presiona la tecla "y" se cambia la herramienta seleccionada al lapiz', () => {
    caminiToons.useSelectionTool();
    caminiToons.handleKeyDown({key: 'y'})

    expect(caminiToons.selectedTool.name).toBe('pen');
  });

  it('cuando se presiona la tecla "*" se crea un nuevo frame', () => {
    caminiToons.handleKeyDown({key: '*'})

    expect(caminiToons.lastFrameNumber).toBe(2);
  });

  it('cuando se presiona "l" se crea una capa', () => {
    caminiToons.handleKeyDown({key: 'l'})

    expect(caminiToons.layersDetails.length).toBe(2);
  });
});