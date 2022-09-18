import {subclassResponsibility} from '../errors'

import Optional from '../Optional';

import AnimationLayer from '../AnimationLayer';
import Frame from '../Frame';

import AnimationIdleState from './state/AnimationIdleState';
import AnimationPlayingState from './state/AnimationPlayingState';

class AnimationDocument {

  constructor({createFrameContent, hitTest}) {
    this._createFrameContent = createFrameContent;
    this._hitTestFunction = hitTest;

    this._selectedDrawings = [];
    
    this._currentFrameNumber = 1;

    this._animationLayers = [this.createAnimationLayer()]
    this._activeLayer = this._animationLayers[0];

    this._state = new AnimationIdleState();
  }

  createAnimationLayer() {
    const createFrameFunction = () => new Frame({createContent: () => this._createFrameContent()});
    return new AnimationLayer({createFrameFunction});
  }

  get activeLayer() {
    return this._activeLayer;
  }

  get currentFrameNumber() {
    return this._currentFrameNumber;
  }

  get lastFrameNumber() {
    return this.activeLayer.lastFrameNumber;
  }

  isAtLastFrame() {
    return this._currentFrameNumber === this.lastFrameNumber;
  }

  playAnimation() {;
    this.goToFrame(1);
    this._currentFrameNumber = 0; // Aclaracion: se setea en 0 que para que arranque a reproducir el frame numero 1
    this._state = new AnimationPlayingState();
  }

  stopPlaying() {
    this._state = new AnimationIdleState();
  }

  goToFrame(aFrameNumber) {
    this.deselectAllDrawings();
    this.activeLayer.goToFrame(aFrameNumber);
    this._currentFrameNumber = aFrameNumber;
  }

  goToNextFrame() {
    this.goToFrame(this._currentFrameNumber + 1)
  }

  tick() {
    this._state.tickFor(this);
  }

  createFrame() {
    this.activeLayer.createFrame();
    this.goToFrame(this._currentFrameNumber + 1);
  }

  hitTest(aPointToCheck) {
    const hitResult = this._hitTestFunction(aPointToCheck);
    
    return hitResult == null
      ? Optional.empty()
      : Optional.with(hitResult.item);
  }

  createPath(aPathStyle) {
    subclassResponsibility();
  }

  deselectAllDrawings() {
    this._selectedDrawings.forEach(drawing => drawing.deselect());
    this._selectedDrawings = [];
  }

  selectDrawing(aDrawing) {
    aDrawing.select();
    this._selectedDrawings.push(aDrawing); 
  }

  deleteSelection() {
    this._selectedDrawings.forEach(item => item.remove());
    this._selectedDrawings = [];
  }

  moveDrawing(aDrawing, aDelta) {
    aDrawing.moveBy(aDelta);
  }

}

export default AnimationDocument;