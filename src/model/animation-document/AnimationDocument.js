import {subclassResponsibility} from '../errors'

import AnimationIdleState from './state/AnimationIdleState';
import AnimationPlayingState from './state/AnimationPlayingState';

class AnimationDocument {

  constructor() {
    this._selectedDrawings = [];
    this._currentFrameNumber = 1;

    this._state = new AnimationIdleState();
  }

  get activeLayer() {
    return subclassResponsibility();
  }

  get currentFrameNumber() {
    return this._currentFrameNumber;
  }

  get lastFrameNumber() {
    return this.activeLayer.frames.length;
    //return this.activeLayer.numberOfFrames; // TODO: ver por que esto rompe
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
    subclassResponsibility();
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